import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import supabase from '@/lib/db';

export async function POST(req) {
  try {
    const { password } = await req.json();
    
    // 1. Fetch Dynamic DB Password
    let activePassword = process.env.ADMIN_PASSWORD || 'admin123';
    const { data: config } = await supabase.from('products').select('desc').eq('id', '_config_admin_pwd').single();
    if (config && config.desc) {
      activePassword = config.desc;
    }
    
    if (password === activePassword) {
      const cookieStore = cookies();
      (await cookieStore).set('admin_auth', 'true', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      });

      // Send Security Email Notification
      try {
        if (process.env.RESEND_API_KEY) {
          const { Resend } = require('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: 'SB Security <onboarding@resend.dev>',
            to: ['sachinnaik.juo@gmail.com'], // The admin
            subject: 'Security Alert: Admin Login',
            text: `A successful login to your admin dashboard just occurred at ${new Date().toLocaleString()}.\n\nIf this was you, you can safely ignore this email. If not, please reset your password immediately.`
          });
        }
      } catch (emailError) {
        console.error('Failed to send login alert:', emailError);
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  (await cookieStore).delete('admin_auth');
  return NextResponse.json({ success: true });
}
