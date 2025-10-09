"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clientApiFetch } from "lib/client-api";
import { createBrowserSupabase } from "lib/supabase/browser";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";

type Props = {
  initialFirstName: string;
  initialLastName: string;
  email: string;
  initialPreferences: {
    emailReports: boolean;
    marketUpdates: boolean;
    productUpdates: boolean;
    securityAlerts: boolean;
  };
};

export default function SettingsClient({
  initialFirstName,
  initialLastName,
  email,
  initialPreferences,
}: Props) {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  // Profile
  const [userProfile, setUserProfile] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email, // from Supabase auth
  });

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notifications
  const [notifications, setNotifications] = useState({
    emailReports: initialPreferences.emailReports,
    marketUpdates: initialPreferences.marketUpdates,
    productUpdates: initialPreferences.productUpdates,
    securityAlerts: initialPreferences.securityAlerts,
  });

  // ---------- Profile Save (first/last name via backend; email via Supabase) ----------
  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      // 1) First/Last -> backend
      const res = await clientApiFetch("/account/profile", {
        method: "PATCH",
        body: JSON.stringify({
          first_name: userProfile.firstName || undefined,
          last_name: userProfile.lastName || undefined,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to update profile");
      }

      // 2) Email -> Supabase (user-scoped)
      // Only attempt if changed
      if (userProfile.email && userProfile.email !== email) {
        setIsSavingEmail(true);
        const { error } = await supabase.auth.updateUser({
          email: userProfile.email,
        });
        setIsSavingEmail(false);

        if (error) {
          // Revert UI email to previous on failure
          setUserProfile((prev) => ({ ...prev, email }));
          throw new Error(error.message || "Failed to update email");
        }
        // Supabase may send a confirmation email depending on your project settings
        toast.success(
          "Email update requested. Please confirm via the email sent to you."
        );
      }

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  }

  // ---------- Preferences Save ----------
  async function handleSavePreferences() {
    setIsSavingPrefs(true);
    try {
      const res = await clientApiFetch("/account/preferences", {
        method: "PATCH",
        body: JSON.stringify({
          email_reports: notifications.emailReports,
          email_market_updates: notifications.marketUpdates,
          email_product_updates: notifications.productUpdates,
          email_security_updates: notifications.securityAlerts,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to save preferences");
      }
      toast.success("Notification preferences saved");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save preferences");
    } finally {
      setIsSavingPrefs(false);
    }
  }

  // ---------- Password Update (Supabase user-scoped) ----------
  async function handlePasswordUpdate() {
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSavingPassword(true);
    try {
      // Optional: Re-authenticate flow if you require it (email+password sign-in)
      // Since Supabase allows updateUser with a valid session, we may not need currentPassword here.
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw new Error(error.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update password");
    } finally {
      setIsSavingPassword(false);
    }
  }

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="container p-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-500">Manage your account preferences</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 text-sm sm:text-base">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={userProfile.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setUserProfile({
                            ...userProfile,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={userProfile.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setUserProfile({
                            ...userProfile,
                            lastName: e.target.value,
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
                      value={userProfile.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserProfile({
                          ...userProfile,
                          email: e.target.value,
                        })
                      }
                    />
                    {isSavingEmail && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Requesting email change…
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    type="submit"
                    disabled={isSavingProfile || isSavingEmail}
                  >
                    {isSavingProfile ? "Saving…" : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Notifications */}
          {/* <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4 py-2">
                  <div>
                    <h4 className="font-medium">Email Reports</h4>
                    <p className="text-sm text-gray-500">
                      Receive your property analysis reports via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailReports}
                    onCheckedChange={() => toggleNotification("emailReports")}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 py-2">
                  <div>
                    <h4 className="font-medium">Market Updates</h4>
                    <p className="text-sm text-gray-500">
                      Receive updates about property market trends
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketUpdates}
                    onCheckedChange={() => toggleNotification("marketUpdates")}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 py-2">
                  <div>
                    <h4 className="font-medium">Product Updates</h4>
                    <p className="text-sm text-gray-500">
                      Be notified about new features and improvements
                    </p>
                  </div>
                  <Switch
                    checked={notifications.productUpdates}
                    onCheckedChange={() => toggleNotification("productUpdates")}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 py-2">
                  <div>
                    <h4 className="font-medium">Security Alerts</h4>
                    <p className="text-sm text-gray-500">
                      Get important security notifications about your account
                    </p>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={() => toggleNotification("securityAlerts")}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSavingPrefs}
                >
                  {isSavingPrefs ? "Saving…" : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent> */}

          {/* Password */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Optional: currentPassword if you want to force re-auth */}
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewPassword(e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setConfirmPassword(e.target.value)
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handlePasswordUpdate}
                  disabled={isSavingPassword}
                >
                  {isSavingPassword ? "Saving…" : "Update Password"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
