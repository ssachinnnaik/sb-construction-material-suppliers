import supabase from '@/lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    // We store the email in the 'mobile_number' column since it is just a contact string to match against
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

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your Verification Code - SB Construction`,
        text: `Your quote verification code is: ${otp}\n\nIt expires in 10 minutes. Please do not share this with anyone.`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL OTP] Sent accurately to ${email}`);
    } else {
      console.log(`[DEV MODE Email OTP] Code is ${otp} for ${email}. (Nodemailer config missing)`);
    }

    return NextResponse.json({ success: true, message: 'OTP sent securely to your email.' }, { status: 200 });
  } catch (error) {
    console.error('Send Email OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
