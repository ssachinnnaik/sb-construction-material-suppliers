import { NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // fetch product to delete image
    const product = db.prepare('SELECT img_path FROM products WHERE id = ?').get(id);
    
    if (product && product.img_path && product.img_path.startsWith('/uploads/')) {
      const fileName = product.img_path.replace('/uploads/', '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const del = db.prepare('DELETE FROM products WHERE id = ?');
    const info = del.run(id);

    if (info.changes > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
