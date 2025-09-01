"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { EyeIcon, EyeOff } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const LoginForm = ({ isLoading, setIsLoading }: LoginFormProps) => {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword((v) => !v);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message || "Failed to sign in");
      return;
    }

    // Session cookie is set via your middleware; navigate to dashboard
    toast.success("Signed in!");
    router.replace("/dashboard");
    router.refresh();
  }

  async function onForgotPassword() {
    if (!email) {
      toast.message("Enter your email above, then click Forgot password");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
    if (error) {
      toast.error(error.message || "Could not start password reset");
    } else {
      toast.success("Password reset email sent");
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-normal text-xs"
            onClick={onForgotPassword}
          >
            Forgot password?
          </Button>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default LoginForm;
