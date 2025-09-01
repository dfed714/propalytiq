/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverApiJson } from "@lib/server-api";

export async function getPropertyInfo(url: string) {
  return serverApiJson<{
    id: string;
    model: string;
    text: string | null;
    usage: any | null;
  }>("/ai/property-info", {
    method: "POST",
    body: JSON.stringify({ url: url }),
  });
}
