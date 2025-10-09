"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { toast } from "sonner";
import { Button } from "@components/ui/button";
import {
  FileText,
  Settings,
  CreditCard,
  Download,
  Calendar,
  BarChart3,
  Eye,
} from "lucide-react";
import generatePropertyReport from "lib/generatePropertyReport";
import type { Analysis, DashboardMetrics, Property, ReportList } from "@dtos";

interface DashboardTableClientProps {
  metrics: DashboardMetrics;
  reports?: ReportList | null; // Replace 'any' with the actual type if available
}

const fmtPercent = (v: number | string | undefined) =>
  Number(v) ? `${Number(v).toFixed(2)}%` : v ?? "N/A";

const fmtMoney = (v: number | string | undefined) =>
  Number(v) ? `£${Number(v).toLocaleString()}` : v ?? "N/A";

const fmtDate = (iso?: string) => {
  return iso ? new Date(iso).toLocaleDateString() : "N/A";
};

const handleViewReport = (propertyData: Property, analysisData: Analysis) => {
  sessionStorage.setItem("propertyData", JSON.stringify(propertyData));
  sessionStorage.setItem("analysisData", JSON.stringify(analysisData));
  window.open("/results", "_blank");
};

const handleExportPDF = (propertyData: Property, analysisData: Analysis) => {
  try {
    generatePropertyReport({ propertyData, analysisData });
    toast.success(
      "Report export functionality will be available in the full version"
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF. Please try again.");
  }
};

export default function DashboardTableClient({
  metrics,
  reports,
}: DashboardTableClientProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overview */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            Your investment analysis at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-propalytiq-blue" />
                <span className="text-sm font-medium">Total Reports</span>
              </div>
              <p className="text-2xl font-bold">{metrics.total_reports}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-propalytiq-blue" />
                <span className="text-sm font-medium">Current Month</span>
              </div>
              <p className="text-2xl font-bold">
                {metrics.current_subscription_month}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-propalytiq-blue" />
                <span className="text-sm font-medium">Average ROI</span>
              </div>
              <p className="text-2xl font-bold">
                {fmtPercent(metrics.average_roi)}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-propalytiq-blue" />
                <span className="text-sm font-medium">Reports Left</span>
              </div>
              <p className="text-2xl font-bold">
                {metrics.reports_allowed_per_month - metrics.reports_this_month}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Your last analysed properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header row */}
            <div
              className="hidden sm:grid gap-4 pb-2 border-b text-sm font-medium text-gray-500 items-center"
              style={{ gridTemplateColumns: "2fr 1fr 0.8fr 1fr 1fr" }}
            >
              <div className="text-left">Address</div>
              <div className="text-left">Strategy</div>
              <div className="text-left">ROI</div>
              <div className="text-left">Date</div>
              <div className="text-left">Action</div>
            </div>
            {!reports ||
              (reports.length < 1 && (
                <p className="text-center py-8 text-muted-foreground">
                  No reports found
                </p>
              ))}

            {/* Data rows */}
            {reports?.map((report, index) => {
              const roiDisplay = fmtPercent(report.roi);
              const dateDisplay = fmtDate(String(report.created_at));
              const strategy = report.strategy;

              return (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:gap-4 py-3 sm:py-2 border-b border-gray-100 last:border-b-0 sm:border-b-0 sm:[grid-template-columns:2fr_1fr_0.8fr_1fr_1fr]"
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <h4 className="font-medium text-sm">
                        {report.property_address}
                      </h4>
                      <div className="sm:hidden text-xs text-gray-500 mt-1 space-y-1">
                        <div>
                          {strategy} • ROI: {roiDisplay}
                        </div>
                        <div>{dateDisplay}</div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block text-sm">{strategy}</div>
                  <div className="hidden sm:block text-sm font-medium">
                    {roiDisplay}
                  </div>
                  <div className="hidden sm:block text-xs text-gray-500">
                    {dateDisplay}
                  </div>

                  <div className="flex justify-end sm:justify-start">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download Report"
                      onClick={() =>
                        handleExportPDF(report.property, report.analysis)
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="View Report"
                      onClick={() =>
                        handleViewReport(report.property, report.analysis)
                      } // Pass property and analysis
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href="/reports">View All Reports</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 className="font-bold text-lg mb-1">Demo Plan</h4>
              <p className="text-sm text-gray-600">
                Next billing:{" "}
                {metrics.next_billing_date
                  ? fmtDate(String(metrics.next_billing_date))
                  : "N/A"}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Reports Remaining</p>
                  <p className="font-bold">
                    {metrics.reports_allowed_per_month -
                      metrics.reports_this_month}{" "}
                    / {metrics.reports_allowed_per_month}
                  </p>
                </div>
                {/* <Link href="/pricing"> */}
                <Button size="sm" disabled>
                  Upgrade
                </Button>
                {/* </Link> */}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <Link href="/billing">
                    <CreditCard className="mr-2 h-4 w-4" /> Billing
                  </Link>
                </Button> */}
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
  );
}
