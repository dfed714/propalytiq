import MainLayout from "@components/layout/MainLayout";
import AuthCard from "./AuthCard";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) redirect("/dashboard"); // only here, not in middleware

  return (
    <MainLayout isAuthenticated={false}>
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <AuthCard />
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
