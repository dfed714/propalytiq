// apps/frontend/lib/auth.ts
import { createServerSupabase } from "./supabase/server";
import type { Session, User } from "@supabase/supabase-js";

export type SupabaseServerClient = Awaited<
  ReturnType<typeof createServerSupabase>
>;

/** Get both: storage session (for token) and a verified user (contacts Supabase). */
export async function getAuth(): Promise<{
  supabase: SupabaseServerClient;
  session: Session | null; // read from cookies/storage
  user: User | null; // verified via network call
}> {
  const supabase = await createServerSupabase();

  const [sessionRes, userRes] = await Promise.all([
    supabase.auth.getSession(), // fast; from storage
    supabase.auth.getUser(), // verified; server call
  ]);

  return {
    supabase,
    session: sessionRes.data.session ?? null,
    user: userRes.data.user ?? null,
  };
}

/** Keep your existing helpers (fine for getting a token) */
export async function getSessionOrNull(): Promise<{
  supabase: SupabaseServerClient;
  session: Session | null;
}> {
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return { supabase, session };
}

export async function getAccessTokenOrNull(): Promise<string | null> {
  const { session } = await getSessionOrNull();
  return session?.access_token ?? null;
}
export async function getuser_idOrNull(): Promise<string | null> {
  const { session } = await getSessionOrNull();
  return session?.user?.id ?? null;
}
