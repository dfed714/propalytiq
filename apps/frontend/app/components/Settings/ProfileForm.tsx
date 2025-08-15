"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { getClerkErrorMessage, updateProfile } from "@lib/services/settings";
import { CardContent, CardFooter } from "@components/ui/card";
import { apiFetch } from "@lib/api";

export default function ProfileForm({ first_name, last_name, email }: any) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({ first_name, last_name, email });
  const [loading, setLoading] = useState(false);
  const [originalEmail] = useState(email);

  async function verifyEmailOnFrontend(emailAddressId: string, code: string) {
    const emailAddr = user?.emailAddresses.find((e) => e.id === emailAddressId);
    if (!emailAddr) throw new Error("Email not found");

    await emailAddr.attemptVerification({ code });
    await user?.update({ primaryEmailAddressId: emailAddressId });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) {
      toast.error("Name fields cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken({ template: "backend" });
      const res = await updateProfile(token!, {
        firstName: formData.first_name,
        lastName: formData.last_name,
        email: formData.email,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      // ✅ Handle verification if email changed
      if (data.requiresVerification) {
        // Refresh user from Clerk so new email is available
        await user?.reload(); // 🔹 This updates user.emailAddresses with backend changes

        const emailAddr = user?.emailAddresses.find(
          (e) => e.id === data.emailAddressId
        );
        if (!emailAddr) {
          toast.error("New email address still not found in Clerk session");
          return;
        }

        // Send verification email
        await emailAddr.prepareVerification({ strategy: "email_code" });

        // Ask for code
        const code = prompt(
          `We sent a code to ${formData.email}. Enter it here:`
        );

        if (!user) {
          toast.error("User is not loaded yet");
          return;
        }
        if (code) {
          await verifyEmailOnFrontend(data.emailAddressId, code);

          await apiFetch(
            "/user/update-email-after-verification",
            token, // pass your Clerk token here
            {
              method: "PATCH",
              body: JSON.stringify({ userId: user.id, email: formData.email }),
            }
          );

          toast.success("Email verified and updated!");
        } else {
          setFormData((prev) => ({
            ...prev,
            email: originalEmail,
          }));
          toast.info("Verification skipped — email not set as primary yet.");
        }
      }
    } catch (err) {
      setFormData((prev) => ({
        ...prev,
        email: originalEmail,
      }));
      toast.error(getClerkErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  first_name: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  last_name: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </form>
  );
}
