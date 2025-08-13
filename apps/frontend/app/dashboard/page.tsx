// apps/frontend/app/dashboard/page.tsx
import DashboardClient from "./DashboardClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const API = process.env.API_URL ?? "http://localhost:4000";
const PREFIX = process.env.API_PREFIX ?? ""; // "/api" if you set a global prefix in Nest

export default async function DashboardPage() {
  // In your Clerk version, auth() returns a Promise — so await it:
  const { userId, getToken } = await auth();
  if (!userId) redirect("/");

  // Mint a short-lived backend JWT (audience must match your Clerk template)
  const token = await getToken({ template: "backend" });

  console.log(token);

  const userRes = await fetch(`${API}${PREFIX}/users/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!userRes.ok) {
    const text = await userRes.text();
    console.error("Backend error:", userRes.status, text);
    throw new Error(`Backend failed: ${userRes.status}`);
  }

  const me = await userRes.json();

  return (
    <DashboardClient
      first_name={me.first_name}
        subscription= {{
          plan: me.product.name,
          billing_cycle_anchor: me.subscription.billing_cycle_anchor,
        }}
    />
  );
}
