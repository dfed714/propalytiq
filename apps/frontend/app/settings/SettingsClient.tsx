"use client";

import React, { useState } from "react";
import MainLayout from "@components/Layout/MainLayout";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Switch } from "@components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@lib/api";
import ProfileForm from "@components/Settings/ProfileForm";
import NotificationsForm from "@components/Settings/NotificationsForm";
import PasswordForm from "@components/Settings/PasswordForm";

type SettingsClientProps = {
  first_name: string;
  last_name: string;
  email: string;
  email_reports: boolean;
  market_updates: boolean;
  product_updates: boolean;
  security_alerts: boolean;
};

const SettingsPage = ({
  first_name,
  last_name,
  email,
  email_reports,
  market_updates,
  product_updates,
  security_alerts,
}: SettingsClientProps) => {
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-gray-500">Manage your account preferences</p>
          </div>
        </div>

        <div className="max-w-3xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            {/* PROFILE TAB */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <ProfileForm
                  first_name={first_name}
                  last_name={last_name}
                  email={email}
                />
              </Card>
            </TabsContent>

            {/* NOTIFICATIONS TAB */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <NotificationsForm
                  email_reports={email_reports}
                  market_updates={market_updates}
                  product_updates={product_updates}
                  security_alerts={security_alerts}
                />
              </Card>
            </TabsContent>

            {/* PASSWORD TAB */}
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <PasswordForm />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
