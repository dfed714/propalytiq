import { API_URL } from "./config";

export async function apiFetch(
  path: string,
  token?: string | null,
  options: RequestInit = {}
) {
  const url = `${API_URL}${path}`;

  const isJson = options.body && typeof options.body === "string";

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isJson ? { "Content-Type": "application/json" } : {})
  };

  return fetch(url, {
    ...options,
    headers,
    cache: "no-store"
  });
}
