/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { ArrowRight, Download, Share2, Send, PlusCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import generatePropertyReport from "@lib/generatePropertyReport";
import { Textarea } from "@components/ui/textarea";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PropertyData {
  address: string;
  price: string;
  bedrooms: string | number;
  bathrooms: string | number;
  description: string;
  property_type?: string;
  investment_strategy?: string;
}

interface AnalysisData {
  investment_strategy?: string;
  top_stats: Record<string, number>;
  projection: {
    x_label: string;
    y_label: string;
    points: Array<{ x: number | string; y: number }>;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface InvestmentReportProps {
  analysisData: AnalysisData;
  propertyData: PropertyData;
}

interface CashFlowDataPoint {
  year: string;
  cashFlow: number;
}

const InvestmentReport: React.FC<InvestmentReportProps> = ({
  propertyData,
  analysisData,
}) => {
  const handleExportPDF = () => {
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

  const cashFlowData: CashFlowDataPoint[] = analysisData.projection.points.map(
    (point: { x: any; y: any }) => ({
      year: `Year ${point.x}`,
      cashFlow: point.y || 0,
    })
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{propertyData.investment_strategy}</CardTitle>
            <CardDescription>
              Based on {propertyData.bedrooms} bedroom{" "}
              {propertyData.property_type || "property"}
              &nbsp;priced at {propertyData.price}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {Object.entries(analysisData.top_stats).map(
                ([key, value]: [string, number]) => (
                  <div
                    key={key}
                    className="bg-gray-50 p-4 rounded-lg text-center"
                  >
                    <p className="text-gray-500 text-sm">{key}</p>
                    <p
                      className={`text-2xl font-bold ${
                        key.includes("Cashflow") && value < 0
                          ? "text-red-500"
                          : "text-propalytiq-blue dark:text-blue-400"
                      }`}
                    >
                      {key.includes("(%)")
                        ? `${value}%`
                        : `£${Math.abs(value).toLocaleString()}`}
                    </p>
                  </div>
                )
              )}
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projections">Projections</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2 text-propalytiq-blue dark:text-blue-400">
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {analysisData.strengths.map(
                        (pro: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>{pro}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-2 text-propalytiq-blue dark:text-blue-400">
                      Weaknesses
                    </h3>
                    <ul className="space-y-2">
                      {analysisData.weaknesses.map(
                        (con: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">✗</span>
                            <span>{con}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projections" className="pt-4">
                <h3 className="font-medium text-lg mb-4 text-propalytiq-blue dark:text-blue-400">
                  {analysisData.projection?.x_label || "Cashflow Projection"}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer
                    id="cashflow-chart"
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={cashFlowData}
                      margin={{
                        top: 0,
                        right: 0,
                        left: 10,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="cashFlow"
                        stroke="#14B8A6"
                        fill="#14B8A6"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    Projection based on the provided cashflow data for{" "}
                    {propertyData.address}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Custom advice for this property</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {analysisData.recommendations.map(
                (recommendation: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 bg-propalytiq-teal h-2 w-2 rounded-full"></div>
                    <span>{recommendation}</span>
                  </li>
                )
              )}
            </ul>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2 border-t p-4">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" /> Export as PDF
            </Button>
            {/* <Button variant="outline" onClick={handleShare} className="w-full">
              <Share2 className="mr-2 h-4 w-4" /> Share Report
            </Button> */}
          </CardFooter>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/analysis">Analyze Another Property</Link>
        </Button>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/" className="flex items-center">
            Back to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div
        style={{
          position: "absolute",
          zIndex: -1,
          opacity: 0,
          width: 750,
          height: 550,
        }}
      >
        <ResponsiveContainer
          id="cashflow-chart-hidden"
          width="100%"
          height="100%"
        >
          <AreaChart
            data={cashFlowData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="cashFlow"
              stroke="#14B8A6"
              fill="#14B8A6"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InvestmentReport;
