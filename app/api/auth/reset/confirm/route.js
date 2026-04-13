import { NextResponse } from 'next/server';
import supabase from '@/lib/db';

export async function POST(req) {
  try {
    const { otp, newPassword } = await req.json();
    const adminMobileDummy = '9999999999';

    // Verify OTP
    const { data: otpRecords, error: fetchError } = await supabase
      .from('otps')
      .select('*')
      .eq('mobile_number', adminMobileDummy)
      .eq('used', 0)
      .gte('expires_at', new Date().toISOString())
      .order('id', { ascending: false })
      .limit(1);

    if (fetchError || !otpRecords || otpRecords.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    const latestOtp = otpRecords[0];

    if (latestOtp.otp_code !== otp) {
      return NextResponse.json({ error: 'Incorrect OTP' }, { status: 400 });
    }

    // Mark OTP as used
    await supabase.from('otps').update({ used: 1 }).eq('id', latestOtp.id);

    // Save New Password into the products table config row
    const { error: upsertError } = await supabase
      .from('products')
      .upsert({
        id: '_config_admin_pwd', 
        name: 'System Security Hash', 
        desc: newPassword, 
        price: '-', 
        img_path: '-'
      });

    if (upsertError) throw upsertError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Confirm Reset error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
