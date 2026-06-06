import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { Request, Response, NextFunction } from 'express';

initializeApp();
const auth = getAuth();

const SESSION_COOKIE_OPTIONS = {
  maxAge: 14 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
};

const PUBLIC_PATHS = [
  '/strava-webhook',
  '/login',
  '/auth/session',
  '/auth/logout',
];

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (PUBLIC_PATHS.includes(req.path) || req.path.startsWith('/static/')) {
    next();
    return;
  }

  const session = req.cookies?.__session as string | undefined;
  if (!session) {
    res.redirect('/login');
    return;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(session, true);
    (req as unknown as { user: unknown }).user = decodedClaims;
    next();
  } catch {
    res.redirect('/login');
  }
}

export async function createSession(req: Request, res: Response): Promise<void> {
  const { idToken } = req.body as { idToken?: string };
  if (!idToken) {
    res.status(400).json({ error: 'Missing idToken' });
    return;
  }

  try {
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_OPTIONS.maxAge,
    });
    res.cookie('__session', sessionCookie, SESSION_COOKIE_OPTIONS);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Failed to create session cookie:', err);
    res.status(401).json({ error: 'Failed to create session' });
  }
}

export function destroySession(_req: Request, res: Response): void {
  res.clearCookie('__session', { path: '/' });
  res.redirect('/login');
}
