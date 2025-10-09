import { redirect } from "next/navigation";
import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@/lib/auth";
import SettingsClient from "./SettingsClient";
import { serverApiJson } from "lib/server-api";
import { getAccount } from "lib/api/account";

export default async function SettingsPage() {
  const { user } = await getAuth();
  if (!user) redirect("/login");

  const account = user ? await getAccount() : null;

  if (!account) {
    // This should not happen as user is authenticated
    redirect("/login");
  }

  return (
    <MainLayout
      isAuthenticated={!!user}
      firstName={account?.user.first_name ?? undefined}
    >
      <SettingsClient
        // Profile seeds
        initialFirstName={account.user.first_name ?? ""}
        initialLastName={account.user.last_name ?? ""} // not in AccountResponse; keep editable
        email={user.email ?? ""}
        // Email prefs from backend
        initialPreferences={{
          emailReports: account.email_preferences.email_reports,
          marketUpdates: account.email_preferences.email_market_updates,
          productUpdates: account.email_preferences.email_product_updates,
          securityAlerts: account.email_preferences.email_security_updates,
        }}
      />
    </MainLayout>
  );
}
