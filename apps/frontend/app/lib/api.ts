import { API_BASE } from "./config";

export async function apiFetch(
  path: string,
  token?: string | null,
  options: RequestInit = {}
) {
  const url = `${API_BASE}${path}`;

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
    cache: "no-store", // default behavior for all requests
  });
}
