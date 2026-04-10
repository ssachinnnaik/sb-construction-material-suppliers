import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { password } = await req.json();
    
    // Hardcoded master password for simplicity
    if (password === 'admin123') {
      const cookieStore = cookies();
      (await cookieStore).set('admin_auth', 'true', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      });

      // Send Security Email Notification
      try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const nodemailer = require('nodemailer');
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
  
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'sbmcontact5886@gmail.com',
            subject: `Security Alert: Admin Login - SB Construction`,
            text: `A successful login to your admin dashboard just occurred at ${new Date().toLocaleString()}.\n\nIf this was you, you can safely ignore this email. If not, please check your system immediately.`,
          };
  
          await transporter.sendMail(mailOptions);
        }
      } catch (emailError) {
        console.error('Failed to send login alert:', emailError);
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  (await cookieStore).delete('admin_auth');
  return NextResponse.json({ success: true });
}
