'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@components/Layout/MainLayout';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  FileText,
  Settings,
  CreditCard,
  Download,
  Clock,
  Calendar,
  BarChart3,
  Home
} from 'lucide-react';
import generatePropertyReport from '@utils/pdfGenerator';

const DashboardClient = () => {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const userSession = sessionStorage.getItem('userSession');
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        setUserName(userData.name?.split(' ')[0] || 'User');
      } catch {
        setUserName('User');
      }
    }
  }, []);

  const recentReports = [
    { id: 1, address: '123 Investment Avenue, London', date: '12 May 2025', strategy: 'Buy-to-Let', roi: '6.2%' },
    { id: 2, address: '45 Profit Street, Manchester', date: '8 May 2025', strategy: 'HMO', roi: '9.6%' },
    { id: 3, address: '78 Capital Road, Birmingham', date: '2 May 2025', strategy: 'Serviced Accommodation', roi: '10.8%' }
  ];

  const subscription = {
    plan: 'Basic',
    nextBilling: '15 Jun 2025',
    reportsLeft: 3
  };

  const handleDownloadReport = () => {
    generatePropertyReport();
    toast.success("Report downloaded successfully!");
  };

  return (
    <MainLayout>
        <div className="container py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-gray-500">Welcome back, {userName}</p>
            </div>
            <div className="flex gap-4">
              <Link href="/analysis">
                <Button>New Analysis</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  Your investment analysis at a glance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: FileText, label: "Total Reports", value: 12 },
                    { icon: Calendar, label: "Current Month", value: 3 },
                    { icon: BarChart3, label: "Average ROI", value: "7.9%" },
                    {
                      icon: CreditCard,
                      label: "Reports Left",
                      value: subscription.reportsLeft,
                    },
                  ].map(({ icon: Icon, label, value }, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-propalytiq-blue" />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      <p className="text-2xl font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Your last analysed properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded">
                          <Home className="h-5 w-5 text-propalytiq-blue" />
                        </div>
                        <div>
                          <h4 className="font-medium">{report.address}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{report.strategy}</span>
                            <span>•</span>
                            <span>ROI: {report.roi}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {report.date}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleDownloadReport}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/reports">View All Reports</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Your current plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h4 className="font-bold text-lg mb-1">
                      {subscription.plan} Plan
                    </h4>
                    <p className="text-sm text-gray-600">
                      Next billing: {subscription.nextBilling}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">
                          Reports Remaining
                        </p>
                        <p className="font-bold">
                          {subscription.reportsLeft} / 10
                        </p>
                      </div>
                      <Link href="/pricing">
                        <Button size="sm">Upgrade</Button>
                      </Link>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        asChild
                      >
                        <Link href="/billing">
                          <CreditCard className="mr-2 h-4 w-4" /> Billing
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        asChild
                      >
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" /> Settings
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
  );
};

export default DashboardClient;
