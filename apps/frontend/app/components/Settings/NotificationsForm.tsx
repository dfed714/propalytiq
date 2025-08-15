"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Switch } from "@components/ui/switch";
import { Button } from "@components/ui/button";
import { CardContent, CardFooter } from "@components/ui/card";
import { updateNotifications } from "@lib/services/settings";

type NotificationsFormProps = {
  email_reports: boolean;
  market_updates: boolean;
  product_updates: boolean;
  security_alerts: boolean;
};

export default function NotificationsForm({
  email_reports,
  market_updates,
  product_updates,
  security_alerts,
}: NotificationsFormProps) {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    email_reports,
    market_updates,
    product_updates,
    security_alerts,
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = (key: keyof typeof formData) => {
    setFormData({ ...formData, [key]: !formData[key] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await getToken({ template: "backend" });
      const res = await updateNotifications(token!, formData);
      if (!res.ok) throw new Error(await res.text());
      toast.success("Notifications updated successfully");
    } catch (err) {
      toast.error("Error updating notifications");
    } finally {
      setLoading(false);
    }
  };

  const notificationOptions = [
    {
      key: "email_reports",
      title: "Email Reports",
      description: "Receive your property analysis reports via email",
    },
    {
      key: "market_updates",
      title: "Market Updates",
      description: "Receive updates about property market trends",
    },
    {
      key: "product_updates",
      title: "Product Updates",
      description: "Be notified about new features and improvements",
    },
    {
      key: "security_alerts",
      title: "Security Alerts",
      description: "Get important security notifications about your account",
    },
  ] as const;

  return (
    <>
      <CardContent className="space-y-4">
        {notificationOptions.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-2"
          >
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <Switch
              checked={formData[item.key]}
              onCheckedChange={() => handleToggle(item.key)}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </>
  );
}
