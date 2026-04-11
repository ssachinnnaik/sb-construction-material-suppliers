import supabase from '@/lib/db';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('otps')
      .insert([
        {
          mobile_number: email,
          otp_code: otp,
          expires_at: expiresAt,
          used: 0
        }
      ]);
    
    if (error) throw error;

    if (process.env.RESEND_API_KEY) {
      const { data, error: resendError } = await resend.emails.send({
        from: 'SB Construction <onboarding@resend.dev>',
        to: [email],
        subject: `Your Verification Code - SB Construction`,
        text: `Your quote verification code is: ${otp}\n\nIt expires in 10 minutes. Please do not share this with anyone.`,
      });

      if (resendError) {
        console.error('Resend rejection:', resendError);
        return NextResponse.json({ error: `Email rejected: ${resendError.message}` }, { status: 500 });
      }

      console.log(`[EMAIL OTP] Sent accurately to ${email} via Resend. ID: ${data?.id}`);
    } else {
      console.warn(`[DEV MODE Email OTP] Code is ${otp} for ${email}. (Resend config missing)`);
      return NextResponse.json({ error: 'Email server configuration is incomplete on this environment.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent securely to your email.' }, { status: 200 });
  } catch (error) {
    console.error('Send Email OTP error details:', error);
    return NextResponse.json({ error: `OTP generation failed: ${error.message || 'Server error'}` }, { status: 500 });
  }
}
