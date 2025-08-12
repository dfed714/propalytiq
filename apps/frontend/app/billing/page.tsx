'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MainLayout from '@components/Layout/MainLayout';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import generateInvoicePDF, { type InvoiceData } from '@utils/InvoiceGenerator';


const BillingPage = () => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  // Sample invoice data
  const invoiceHistory = [
    {
      id: 'INV-2025-001',
      date: '15 Apr 2025',
      amount: '£29.99',
      status: 'Paid',
      plan: 'Pro'
    },
    {
      id: 'INV-2025-002',
      date: '15 Mar 2025',
      amount: '£29.99',
      status: 'Paid',
      plan: 'Pro'
    },
    {
      id: 'INV-2025-003',
      date: '15 Feb 2025',
      amount: '£29.99',
      status: 'Paid',
      plan: 'Pro'
    }
  ];
  
  const handleDownloadInvoice = (invoice: typeof invoiceHistory[0]) => {
    // Create invoice data
    const invoiceData: InvoiceData = {
      invoiceNumber: invoice.id,
      date: invoice.date,
      amount: invoice.amount,
      plan: invoice.plan,
      paymentMethod: 'Credit Card',
      customerName: 'James Smith',
      customerEmail: 'james.smith@example.com'
    };
    
    // Generate and download PDF
    generateInvoicePDF(invoiceData);
    toast.success(`Invoice ${invoice.id} downloaded`);
  };
  
  return (
    <MainLayout>
    
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8 p-6">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Billing & Subscription</h2>
          
          {/* Current Plan */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the Pro plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
                  <p className="text-gray-500">£29.99 per month</p>
                  <p className="text-sm text-gray-500 mt-1">Next billing date: 15 May 2025</p>
                </div>
                <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                  <Button variant="outline" asChild>
                    <Link href="/pricing">Upgrade Plan</Link>
                  </Button>
                  <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>
                    Cancel Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Methods */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between border rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded mr-4">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/2026</p>
                  </div>
                </div>
                <Badge>Default</Badge>
              </div>
              <Button variant="outline" size="sm">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
          
          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                Your recent invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoiceHistory.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            <Download className="h-4 w-4 mr-1" /> Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Plan Cancellation Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Are you sure you want to cancel?</DialogTitle>
              <DialogDescription>
                We're sorry to see you go. Your subscription will remain active until the end of your current billing period.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4 bg-orange-50 border-orange-200">
                <h4 className="font-semibold mb-2 text-orange-800">What you'll lose:</h4>
                <ul className="text-sm space-y-2 text-orange-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Access to premium investment analysis features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Advanced property comparison tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>AI-powered investment recommendations</span>
                  </li>
                </ul>
              </div>
              
              <div className="rounded-lg border p-4 bg-blue-50 border-blue-200">
                <h4 className="font-semibold mb-2 text-blue-800">Special Offer:</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Stay with us for one more month and receive a <strong>FREE comprehensive property report</strong> (worth £49.99) for any property of your choice!
                </p>
                <Button 
                  className="w-full mb-2 bg-propalytiq-teal hover:bg-propalytiq-teal/90" 
                  onClick={() => {
                    setShowCancelDialog(false);
                    toast.success("Special offer accepted! Your free report credit has been added to your account.");
                  }}
                >
                  Accept Special Offer
                </Button>
                <p className="text-xs text-center text-gray-500">
                  Your subscription will continue at the regular rate and you can cancel anytime.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCancelDialog(false)}
              >
                Keep My Subscription
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setShowCancelDialog(false);
                  toast.success("Your subscription has been cancelled. You'll have access until the end of your billing period.");
                }}
              >
                Cancel Anyway
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </MainLayout>
  );
};

export default BillingPage;
