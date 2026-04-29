'use server'

import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function createSession(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Strict UID Whitelist Check
    if (process.env.ADMIN_UID && decodedToken.uid !== process.env.ADMIN_UID) {
      return { success: false, error: 'Unauthorized: Your UID is not whitelisted as Admin' };
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    const cookieStore = await cookies();
    cookieStore.set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax'
    });
    
    return { success: true };
  } catch (error) {
    console.error('Session creation error:', error);
    return { success: false, error: 'Authentication failed on server' };
  }
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete('__session');
  return { success: true };
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;
  
  if (!session) return null;
  
  try {
    const decodedToken = await adminAuth.verifySessionCookie(session, true);
    return decodedToken;
  } catch (error) {
    return null;
  }
}
