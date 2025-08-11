import { clerkMiddleware, getAuth } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';

const publicPaths = ['/', '/sign-in', '/sign-up', '/api/webhooks/clerk'];

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  // Run Clerk middleware first, get its response if any
  const clerkResponse = await clerkMiddleware(req, event);

  if (clerkResponse) {
    // Clerk middleware wants to return a response (e.g. redirect or other)
    return clerkResponse;
  }

  const { pathname } = req.nextUrl;
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  const auth = getAuth(req);

  if (!auth.userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('fallbackRedirectUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
    '/api/(.*)',
  ],
};
