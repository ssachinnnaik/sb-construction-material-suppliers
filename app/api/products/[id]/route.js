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

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    
    const name = formData.get('name');
    const desc = formData.get('desc');
    const price = formData.get('price');
    const file = formData.get('image');
    const newId = formData.get('id');

    if (!name || !desc) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let updateData = {
      name,
      desc,
      price
    };
    
    // Check if ID is changing
    if (newId && newId !== id) {
      updateData.id = newId;
    }

    if (file && typeof file.arrayBuffer === 'function') {
      // First, get old image to delete it to save space
      const { data: product } = await supabase
        .from('products')
        .select('img_path')
        .eq('id', id)
        .single();

      if (product && product.img_path) {
        const parts = product.img_path.split('/');
        const oldFileName = parts[parts.length - 1];
        if (oldFileName) {
          await supabase.storage.from('products').remove([oldFileName]);
        }
      }

      // Upload new image
      const buffer = await file.arrayBuffer();
      // To get native node path module logic we just suffix with .png for safety
      const fileName = `${id}-${Date.now()}.png`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, buffer, {
          contentType: file.type || 'image/png',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Storage upload error: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
        
      updateData.img_path = publicUrlData.publicUrl;
    }

    const { error: dbError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
