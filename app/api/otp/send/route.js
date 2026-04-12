import supabase from '@/lib/db';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
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

    const { error } = await supabase
      .from('otps')
      .insert([
        {
          mobile_number: email, // Reusing column for email
          otp_code: otp,
          expires_at: expiresAt,
          used: 0
        }
      ]);
    
    if (error) throw error;

    let sent = false;
    let method = '';

    // Method 1: Resend (Best for production with domain)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error: resendError } = await resend.emails.send({
          from: 'SB Construction <onboarding@resend.dev>',
          to: [email],
          subject: `Your Verification Code - SB Construction`,
          text: `Your quote verification code is: ${otp}\n\nIt expires in 10 minutes. Please do not share this with anyone.`,
        });

        if (!resendError) {
          sent = true;
          method = 'Resend';
          console.log(`[OTP] Sent via Resend to ${email}. ID: ${data?.id}`);
        } else {
          console.warn('Resend failed, trying fallback...', resendError);
        }
      } catch (e) {
        console.warn('Resend exception, trying fallback...', e.message);
      }
    }

    // Method 2: Nodemailer (SMTP - Free alternative)
    if (!sent && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"SB Construction" <${process.env.SMTP_USER}>`,
          to: email,
          subject: `Your Verification Code - SB Construction`,
          text: `Your quote verification code is: ${otp}\n\nIt expires in 10 minutes.`,
        });

        sent = true;
        method = 'Nodemailer/SMTP';
        console.log(`[OTP] Sent via SMTP to ${email}`);
      } catch (e) {
        console.error('SMTP failed:', e.message);
      }
    }

    // Removed testing sandbox to enforce realistic delivery
    if (!sent) {
      return NextResponse.json({ 
        error: 'Email delivery explicitly failed. System strict mode enforces realistic email dispatch. Please supply highly-secure SMTP_USER & SMTP_PASS in environment variables or verify a Resend domain to allow dynamic email capabilities.' 
      }, { status: 500 });
    }


    return NextResponse.json({ success: true, message: `OTP sent securely via ${method}.` }, { status: 200 });
  } catch (error) {
    console.error('OTP Route Error:', error);
    return NextResponse.json({ error: `OTP generation failed: ${error.message || 'Server error'}` }, { status: 500 });
  }
}
