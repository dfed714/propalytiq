"use client";

import { useState } from "react";
import { toast } from "@components/ui/sonner";
import { Mail, User, Info } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { clientApiFetch } from "lib/client-api";

type Props = {
  initialName?: string;
  initialEmail?: string;
};

export default function ContactForm({
  initialName = "",
  initialEmail = "",
}: Props) {
  const [formData, setFormData] = useState({
    name: initialName,
    email: initialEmail,
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await clientApiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || undefined, // DTO: subject is optional
          message: formData.message,
        }),
      });

      if (res.status === 401) {
        // Only redirect on 401 (auth); anything else just show an error.
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        // class-validator errors come as JSON; try to surface something helpful.
        try {
          const parsed = JSON.parse(text);
          const msg = Array.isArray(parsed?.message)
            ? parsed.message.join(", ")
            : parsed?.message || text || "Failed to send message";
          toast.error(msg);
        } catch {
          toast.error(text || "Failed to send message");
        }
        return;
      }

      toast.success("Your message has been sent. We'll get back to you soon!");
      // Reset, but preserve any prefilled name/email from session
      setFormData({
        name: initialName,
        email: initialEmail,
        subject: "",
        message: "",
      });
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions about Propalytiq? We're here to help.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                          className="pl-10"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          className="pl-10"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject <span className="text-gray-400">(optional)</span>
                    </label>
                    <div className="relative">
                      <Info className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help you?"
                        className="pl-10"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={8}
                      placeholder="Please provide details about your inquiry..."
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="min-h-[200px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto ml-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-gray-600">support@propalytiq.com</p>
                </div>
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-gray-600">+44 20 1234 5678</p>
                </div>
                <div>
                  <h4 className="font-medium">Address</h4>
                  <p className="text-gray-600">
                    123 Property Lane
                    <br />
                    London, EC1A 1BB
                    <br />
                    United Kingdom
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
