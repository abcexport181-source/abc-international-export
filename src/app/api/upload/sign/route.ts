import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

const UPLOAD_FOLDER = 'abc-export';
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'webm', 'mp4', 'mov'];

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('__session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!adminAuth) {
      return NextResponse.json({ error: 'Firebase Admin not initialized. Check your FIREBASE_SERVICE_ACCOUNT_KEY.' }, { status: 500 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

    if (process.env.ADMIN_UID && decodedToken.uid !== process.env.ADMIN_UID) {
      return NextResponse.json({ error: 'Unauthorized UID: ' + decodedToken.uid }, { status: 403 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown auth error';
    return NextResponse.json({ error: 'Auth failed: ' + message }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary is not configured.' }, { status: 500 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = {
    allowed_formats: ALLOWED_FORMATS.join(','),
    folder: UPLOAD_FOLDER,
    resource_type: 'auto',
    timestamp,
  };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    apiSecret
  );

  return NextResponse.json({
    allowedFormats: paramsToSign.allowed_formats,
    apiKey,
    cloudName,
    folder: UPLOAD_FOLDER,
    resourceType: paramsToSign.resource_type,
    signature,
    timestamp,
  });
}
