// app/(app)/dashboard/page.tsx
import { redirect } from "next/navigation";
import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@/lib/auth";
// import { serverApiJson } from "lib/server-api";
// import { getAccount } from "lib/api/account";

export default async function DashboardPage() {
  const { user } = await getAuth();
  if (!user) redirect("/login");

  console.log("User:", user);

  return (
    <MainLayout isAuthenticated>
      <h1>Dashboard Page</h1>
    </MainLayout>
  );
}
