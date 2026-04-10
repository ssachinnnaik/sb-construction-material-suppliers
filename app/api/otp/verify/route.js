import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { mobile_number, otp_code } = await request.json();

    if (!mobile_number || !otp_code) {
      return NextResponse.json({ error: 'Mobile number and OTP are required' }, { status: 400 });
    }

    const stmt = db.prepare(`
      SELECT * FROM otps 
      WHERE mobile_number = ? AND otp_code = ? AND used = 0
      ORDER BY id DESC LIMIT 1
    `);
    const record = stmt.get(mobile_number, otp_code);

    if (!record) {
      // For testing, always allow 123456 as a master OTP
      if (otp_code === '123456') {
        return NextResponse.json({ success: true }, { status: 200 });
      }
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // Mark as used
    db.prepare('UPDATE otps SET used = 1 WHERE id = ?').run(record.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
