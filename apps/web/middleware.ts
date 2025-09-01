// apps/web/middleware.ts  (adjust path if different)
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Supabase expects an array of { name, value }
        getAll() {
          return req.cookies.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        // Supabase may ask to set multiple cookies at once
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              // NextResponse cookies API (typed, no 'any')
              res.cookies.set(name, value, options);
            }
          } catch {
            // Middleware can ignore write failures (e.g., response already committed)
          }
        },
      },
    }
  );

  // Keep the session fresh; don't redirect here.
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|images).*)'],
};
