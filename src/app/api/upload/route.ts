import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('__session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify Firebase session
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Strict UID Whitelist Check
    if (process.env.ADMIN_UID && decodedToken.uid !== process.env.ADMIN_UID) {
      return NextResponse.json({ error: 'Unauthorized UID' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'abc-export' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: (result as any).secure_url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
