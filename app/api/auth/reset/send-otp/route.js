import { NextResponse } from 'next/server';
import supabase from '@/lib/db';

export async function POST() {
  try {
    const adminMobileDummy = '9999999999'; // Master flag for admin
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 mins

    const { error: dbError } = await supabase
      .from('otps')
      .insert([{ mobile_number: adminMobileDummy, otp_code: otpCode, expires_at: expiresAt }]);

    if (dbError) throw dbError;

    // Send email to admin
    if (process.env.RESEND_API_KEY) {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'SB Security <onboarding@resend.dev>',
        to: ['sachinnaik.juo@gmail.com'], // The admin
        subject: 'Security Alert: Password Reset OTP',
        text: `Your Master Admin Password Reset OTP is: ${otpCode}\n\nThis code is valid for 10 minutes. If you did not request this, secure your server immediately.`
      });
    } else {
      console.warn("No RESEND_API_KEY. OTP is:", otpCode);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to send reset OTP:', err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
