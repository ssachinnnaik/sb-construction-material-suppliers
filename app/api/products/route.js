import { NextResponse } from 'next/server';
import supabase from '@/lib/db';
import path from 'path';

// Handle Next.js body parser limits if needed (optional)
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  try {
    const { data: products, error } = await supabase.from('products').select('*');
    if (error) throw error;
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const id = formData.get('id');
    const name = formData.get('name');
    const desc = formData.get('desc');
    const price = formData.get('price');
    const file = formData.get('image');

    if (!id || !name || !desc || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let img_path = '';

    if (file && typeof file.arrayBuffer === 'function') {
      const buffer = await file.arrayBuffer();
      const ext = path.extname(file.name) || '.png';
      const fileName = `${id}-${Date.now()}${ext}`;
      
      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, buffer, {
          contentType: file.type || 'image/png',
          upsert: true
        });

      if (error) {
        throw new Error(`Storage upload error: ${error.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
        
      img_path = publicUrlData.publicUrl;
    } else {
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400 });
    }

    const { error: dbError } = await supabase
      .from('products')
      .insert([
        {
          id,
          name,
          desc,
          price,
          img_path
        }
      ]);

    if (dbError) {
      if (dbError.code === '23505') { // Postgres unique violation (Primary Key)
        return NextResponse.json({ error: 'Product ID already exists' }, { status: 400 });
      }
      throw dbError;
    }

    return NextResponse.json({ success: true, img_path });

  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
