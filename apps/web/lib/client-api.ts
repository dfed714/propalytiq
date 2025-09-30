"use client";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const base = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function clientApiFetch(path: string, init: RequestInit = {}) {
  const supabase = createBrowserSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return res;
}
