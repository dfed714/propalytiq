'use client';

import React, { useState } from 'react';
import MainLayout from '@components/Layout/MainLayout';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { toast } from 'sonner';
import { Mail, User, Info } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Your message has been sent successfully. We'll get back to you soon!");
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about Propalytiq? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
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
                            placeholder="Your email"
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
                        Subject
                      </label>
                      <div className="relative">
                        <Info className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="subject"
                          name="subject"
                          placeholder="How can we help you?"
                          required
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
                        rows={6}
                        placeholder="Please provide details about your inquiry..."
                        required
                        value={formData.message}
                        onChange={handleChange}
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
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
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
                      123 Property Lane<br />
                      London, EC1A 1BB<br />
                      United Kingdom
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Office Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
