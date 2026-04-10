import { NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';

// Handle Next.js body parser limits if needed (optional)
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    return NextResponse.json({ products });
  } catch (error) {
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
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || '.png';
      const fileName = `${id}-${Date.now()}${ext}`;
      
      const dataDir = process.env.DATA_DIR;
      const uploadDir = path.join(dataDir || process.cwd(), dataDir ? 'uploads' : 'public/uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      img_path = dataDir ? `/api/uploads/${fileName}` : `/uploads/${fileName}`;
    } else {
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400 });
    }

    const insert = db.prepare('INSERT INTO products (id, name, desc, price, img_path) VALUES (?, ?, ?, ?, ?)');
    insert.run(id, name, desc, price, img_path);

    return NextResponse.json({ success: true, img_path });

  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      return NextResponse.json({ error: 'Product ID already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
