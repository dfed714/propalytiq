import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import SettingsClient from "././SettingsClient";
import { apiFetch } from "@lib/api";

export default async function SettingsPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/");

  // Mint a short-lived backend JWT (audience must match your Clerk template)
  const token = await getToken({ template: "backend" });

  console.log(token);
  
  const settingsRes = await apiFetch("/settings", token);

  if (!settingsRes.ok) {
    const text = await settingsRes.text();
    console.error("Backend error:", settingsRes.status, text);
    throw new Error(`Backend failed: ${settingsRes.status}`);
  }

  const settings = await settingsRes.json();

  console.log("Settings:", settings);

  return (
    <SettingsClient
      first_name={settings.first_name}
      last_name={settings.last_name}
      email={settings.email}
      email_reports={settings.email_reports}
      market_updates={settings.market_updates}
      product_updates={settings.product_updates}
      security_alerts={settings.security_alerts}
    />
  );
}
