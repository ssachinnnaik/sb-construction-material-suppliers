import { NextResponse } from 'next/server';
import supabase from '@/lib/db';

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // fetch product to delete image
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('img_path')
      .eq('id', id)
      .single();
    
    if (product && product.img_path) {
      // Extract filename from public URL if it points to Supabase Storage
      // A typical URL looks like: https://[ref].supabase.co/storage/v1/object/public/products/filename.png
      const parts = product.img_path.split('/');
      const fileName = parts[parts.length - 1];
      
      if (fileName) {
        await supabase.storage.from('products').remove([fileName]);
      }
    }

    const { error: delError, count } = await supabase
      .from('products')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (delError) {
      throw delError;
    }

    if (count > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete product', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
