import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { filename } = params;
  const dataDir = process.env.DATA_DIR;
  
  if (!dataDir) {
    // If not using a DATA_DIR, public files are handled natively by Next.js
    return new NextResponse('Not found', { status: 404 });
  }

  const filePath = path.join(dataDir, 'uploads', filename);
  
  try {
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(filename).toLowerCase();
      
      let contentType = 'image/jpeg';
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } else {
      return new NextResponse('Not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
