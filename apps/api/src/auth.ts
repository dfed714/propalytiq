/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { NextFunction, Request, Response } from 'express';

const supabaseUrl = process.env.SUPABASE_URL!;
const issuer = `${supabaseUrl}/auth/v1`;
const JWKS = createRemoteJWKSet(new URL(`${issuer}/jwks`));

export type AuthedRequest = Request & {
  user?: { id: string; email?: string | null; role?: string | null };
};

export async function requireUser(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const auth = req.headers.authorization ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!token) return res.status(401).json({ error: 'Missing bearer token' });

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer,
      // Supabase tokens typically have aud: "authenticated". You can enforce audience if you want:
      // audience: process.env.SUPABASE_ANON_KEY,
    });

    req.user = {
      id: String(payload.sub),
      email: (payload as any).email ?? null,
      role: (payload as any).role ?? null,
    };

    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token', e });
  }
}
