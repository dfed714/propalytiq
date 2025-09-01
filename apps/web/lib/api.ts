"use client";

import { createBrowserSupabase } from "@lib/supabase/browser";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch(path: string, init: RequestInit = {}) {
  const supabase = createBrowserSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    // optional: send them to /login
    // window.location.href = '/login';
  }

  return res;
}
