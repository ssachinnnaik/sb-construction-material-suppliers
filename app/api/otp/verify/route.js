import supabase from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { mobile_number, otp_code } = await request.json();

    if (!mobile_number || !otp_code) {
      return NextResponse.json({ error: 'Mobile number and OTP are required' }, { status: 400 });
    }

    const { data: records, error } = await supabase
      .from('otps')
      .select('*')
      .eq('mobile_number', mobile_number)
      .eq('otp_code', otp_code)
      .eq('used', 0)
      .order('id', { ascending: false })
      .limit(1);

    if (error || !records || records.length === 0) {
      // For testing, always allow 123456 as a master OTP
      if (otp_code === '123456') {
        return NextResponse.json({ success: true }, { status: 200 });
      }
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    const record = records[0];

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // Mark as used
    await supabase
      .from('otps')
      .update({ used: 1 })
      .eq('id', record.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
