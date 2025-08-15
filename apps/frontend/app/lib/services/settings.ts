// apps/frontend/lib/services/settings.ts
import { useUser } from "@clerk/nextjs";
import { apiFetch } from "@lib/api";
import type { ClerkAPIResponseError } from "@clerk/types";
export async function updateProfile(token: string, data: any) {
  return apiFetch("/settings/profile", token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function updateNotifications(token: string, data: any) {
  return apiFetch("/settings/notifications", token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function getClerkErrorMessage(err: unknown) {
  // Clerk API format
  if (err && typeof err === "object" && "errors" in err) {
    const e = err as { errors?: { message?: string }[] };
    if (Array.isArray(e.errors) && e.errors.length) {
      return e.errors.map((x) => x.message).filter(Boolean).join(", ");
    }
  }

  // NestJS / generic JSON error
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: string | string[] }).message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }

  // Standard JS Error instance
  if (err instanceof Error) {
    return err.message;
  }

  return "An unexpected error occurred";
}

