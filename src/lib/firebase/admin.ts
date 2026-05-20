import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (key) {
      const serviceAccount = JSON.parse(key);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is missing from environment variables');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Firebase admin initialization error';
    console.error('Firebase admin initialization error:', message);
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
