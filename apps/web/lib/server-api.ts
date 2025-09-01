import { redirect } from "next/navigation";
import { createServerSupabase } from "@lib/supabase/server";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

/**
 * Server-side fetch to your backend, forwarding the Supabase access token.
 * - Sets Authorization header (Bearer)
 * - Sets Content-Type: application/json ONLY when you actually send JSON
 *   (i.e., not for FormData/multipart, not for GET without body)
 */
export async function serverApiFetch(path: string, init: RequestInit = {}) {
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  // merge headers but don't force JSON for FormData or empty body
  const headers = new Headers(init.headers || {});
  if (token) headers.set("authorization", `Bearer ${token}`);

  const hasBody = typeof init.body !== "undefined" && init.body !== null;

  // Only set JSON content type if there is a body AND it's not FormData AND
  // caller didn't already specify a content-type.
  if (hasBody && !isFormData(init.body) && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  console.log(`${BASE}${path}`);

  return fetch(`${BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function serverApiJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await serverApiFetch(path, init);
  console.log(res);
  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}
