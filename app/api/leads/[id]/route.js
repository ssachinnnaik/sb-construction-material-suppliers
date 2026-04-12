import supabase from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Supabase Delete Error:', error);
      return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete Lead Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
