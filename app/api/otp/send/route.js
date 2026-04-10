import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { mobile_number } = await request.json();

    if (!mobile_number || !/^\d{10}$/.test(mobile_number)) {
      return NextResponse.json({ error: 'Valid 10-digit mobile number required' }, { status: 400 });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const stmt = db.prepare(`
      INSERT INTO otps (mobile_number, otp_code, expires_at)
      VALUES (?, ?, ?)
    `);
    
    stmt.run(mobile_number, otp, expiresAt);

    // IN A PRODUCTION APP WITH AN SMS GATEWAY (e.g. Twilio), WE WOULD SEND THE SMS HERE.
    // For standard platform simulation, we log it so you can see it in terminal, 
    // but in the UI we will tell the user to use '123456' for testing if they want, 
    // OR we just use the real generated one from the console. 
    // To make it easy for testing without a backend console, let's just stick to standard simulation:
    console.log(`[SIMULATED SMS] Sending OTP ${otp} to ${mobile_number}`);

    return NextResponse.json({ success: true, message: 'OTP sent successfully. Check console for code.' }, { status: 200 });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
