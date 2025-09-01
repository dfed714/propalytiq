// apps/frontend/app/(app)/components/layout/SignOutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export default function SignOutButton({
  children = "Sign out",
  className,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabase();

  async function onClick() {
    setLoading(true);
    try {
      await supabase.auth.signOut(); // ends session (client + server call)
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      router.replace("/"); // go home
      router.refresh(); // ensure server components see logged-out state
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={className}
      aria-busy={loading}
    >
      {loading ? "Signing out…" : children}
    </button>
  );
}
