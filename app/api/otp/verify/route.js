import supabase from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, otp_code } = await request.json();

    if (!email || !otp_code) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const { data: records, error } = await supabase
      .from('otps')
      .select('*')
      .eq('mobile_number', email)
      .eq('otp_code', otp_code)
      .eq('used', 0)
      .order('id', { ascending: false })
      .limit(1);

    if (error || !records || records.length === 0) {
      return NextResponse.json({ error: 'Invalid or incorrect Email OTP' }, { status: 400 });
    }

    const record = records[0];

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Email OTP has expired' }, { status: 400 });
    }

    // Mark as used
    await supabase
      .from('otps')
      .update({ used: 1 })
      .eq('id', record.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Verify Email OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
