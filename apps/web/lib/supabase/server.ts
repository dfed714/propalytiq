// apps/web/src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // returns {name,value}[]
        getAll() {
          return cookieStore.getAll();
        },
        // set multiple cookies at once (typed)
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // server components/middleware may ignore writes; that's OK
          }
        },
      },
    }
  );
}
