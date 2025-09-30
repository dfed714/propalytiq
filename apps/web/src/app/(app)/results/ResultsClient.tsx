/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InvestmentReport from "@components/results/InvestmentReport";
import EditableParameters from "@components/results/EditableParameter";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Banknote } from "lucide-react";
import Link from "next/link";

// Simulating a user subscription tier for demo purposes
// In a real app, this would come from authentication context
type SubscriptionTier = "free" | "basic" | "pro" | "enterprise";

const ResultsClient = () => {
  const router = useRouter();
  const [propertyData, setPropertyData] = useState<any>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Demo purpose only - in real app this would come from auth context
  const [userTier, setUserTier] = useState<SubscriptionTier>("basic");

  useEffect(() => {
    // Retrieve property data from sessionStorage.analysisData
    const storedData = sessionStorage.getItem("analysisData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setPropertyData({
        address: parsedData.address,
        price: parsedData.price,
        bedrooms: parsedData.bedrooms,
        bathrooms: parsedData.bathrooms,
        description: parsedData.description,
        propertyType: parsedData.propertyType,
        investmentStrategy: parsedData.investmentStrategy,
        investmentGoal: parsedData.investmentGoal,
        renovationBudget: parsedData.renovationBudget,
        expectedMonthlyRental: parsedData.expectedMonthlyRental,
        mortgageRate: parsedData.mortgageRate,
        top_stats: parsedData.top_stats || {
          "ROI (%)": 0,
          "Rental Yield (%)": 0,
          "Monthly Income (£)": parsedData.expectedMonthlyRental || 0,
          "Monthly Cashflow (£)": 0,
        },
        projection: parsedData.projection || {
          x_label: "Years (1–25)",
          y_label: "Net Cashflow (£)",
          points: Array.from({ length: 25 }, (_, i) => ({
            x: i + 1,
            y: 0,
          })),
        },
        strengths: parsedData.strengths || [
          "Potential for steady rental income.",
          "Suitable property type for investment goals.",
          "Location may support property value growth.",
        ],
        weaknesses: parsedData.weaknesses || [
          "Cashflow depends on accurate expense estimates.",
          "Interest rate risks could impact returns.",
          "Requires consistent tenant occupancy.",
        ],
      });
    } else {
      router.push("/analysis"); // Redirect if no data is found
    }
  }, [router]);

  // Simulate a randomly selected investment strategy for demo purposes
  const strategies = ["btl", "brr", "sa", "hmo"];
  const [selectedStrategy, setSelectedStrategy] = useState(() => {
    return strategies[Math.floor(Math.random() * strategies.length)];
  });

  const handleRegenerate = (newStrategy: string, parameters: any) => {
    setSelectedStrategy(newStrategy);
    const updatedData = {
      ...propertyData,
      investmentStrategy: newStrategy,
      ...parameters,
    };
    sessionStorage.setItem("analysisData", JSON.stringify(updatedData));
    setPropertyData(updatedData);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpgradeClick = () => {
    setShowUpgradeDialog(true);
  };

  if (!propertyData) {
    return <div>Loading...</div>; // Simple loading state
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="bg-primary text-white p-4 sm:p-8 rounded-xl mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Your Smart Investment Report
        </h1>
        <p className="text-lg sm:text-xl opacity-90">{propertyData.address}</p>
      </div>

      <EditableParameters
        propertyData={propertyData}
        investmentStrategy={selectedStrategy}
        onRegenerate={handleRegenerate}
      />
      <InvestmentReport
        propertyData={propertyData}
        investmentStrategy={selectedStrategy}
        userTier={userTier}
        onUpgradeClick={handleUpgradeClick}
      />

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              Unlock all premium features and get full access to comprehensive
              property investment reports.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-2 flex items-center">
                <Banknote className="mr-2 h-5 w-5 text-propalytiq-teal" />
                Pro Plan
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Get unlimited reports and advanced investment metrics.
              </p>
              <div className="text-2xl font-bold mb-1">
                £29.99
                <span className="text-sm font-normal text-gray-500">
                  /month
                </span>
              </div>
              <p className="text-xs text-gray-500">Cancel anytime</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
            >
              Maybe Later
            </Button>
            <Button asChild>
              <Link href="/pricing">View Plans</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResultsClient;
