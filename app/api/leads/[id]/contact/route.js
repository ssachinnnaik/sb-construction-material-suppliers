import supabase from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { contacted } = await request.json();
    
    const { error } = await supabase
      .from('leads')
      .update({ contacted: contacted ? 1 : 0 })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
