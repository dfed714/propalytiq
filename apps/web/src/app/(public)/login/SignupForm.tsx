"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { toast } from "sonner";
import { createBrowserSupabase } from "@/lib/supabase/browser";

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const SignupForm = ({ isLoading, setIsLoading }: SignupFormProps) => {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        // If you want to send them back to your app after email confirmation:
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message || "Could not create account");
      return;
    }

    // If email confirmations are enabled, there won't be an active session yet.
    if (!data.session) {
      setIsLoading(false);
      toast.success("Account created. Please check your email to confirm.");
      router.replace("/login");
      return;
    }

    // If confirmations are disabled and session exists:
    toast.success("Account created!");
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input
            id="first-name"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            id="last-name"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="name@example.com"
          value={signupEmail}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSignupEmail(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Create a password"
          value={signupPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSignupPassword(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={signupConfirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSignupConfirmPassword(e.target.value)
          }
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};

export default SignupForm;
