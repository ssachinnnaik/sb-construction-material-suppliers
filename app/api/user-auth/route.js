import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, mobile } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return NextResponse.json({ error: 'Mobile number must be exactly 10 digits.' }, { status: 400 });
    }

    const sessionData = JSON.stringify({ name: name.trim(), mobile });

    const response = NextResponse.json({ success: true, name: name.trim() });
    response.cookies.set('user_session', sessionData, {
      httpOnly: false, // accessible from JS for display
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('user_session', '', { maxAge: 0, path: '/' });
  return response;
}
