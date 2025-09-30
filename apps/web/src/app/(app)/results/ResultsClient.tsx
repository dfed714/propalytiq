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
import ProcessingAnimation from "@components/analysis/ProcessingAnimation";

const ResultsClient = () => {
  const router = useRouter();
  const [propertyData, setPropertyData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  useEffect(() => {
    // Retrieve property data from sessionStorage.analysisData
    const storedPropertyData = sessionStorage.getItem("propertyData");
    const storedAnalysisData = sessionStorage.getItem("analysisData");

    if (storedPropertyData && storedAnalysisData) {
      const parsedPropertyData = JSON.parse(storedPropertyData);
      setPropertyData({
        address: parsedPropertyData.address,
        price: parsedPropertyData.price,
        bedrooms: parsedPropertyData.bedrooms,
        bathrooms: parsedPropertyData.bathrooms,
        description: parsedPropertyData.description,
        propertyType: parsedPropertyData.propertyType,
        investmentStrategy: parsedPropertyData.investmentStrategy,
        investmentGoal: parsedPropertyData.investmentGoal,
        renovationBudget: parsedPropertyData.renovationBudget,
        expectedMonthlyRental: parsedPropertyData.expectedMonthlyRental,
        mortgageRate: parsedPropertyData.mortgageRate,
      });

      const parsedAnalysisData = JSON.parse(storedAnalysisData);
      setAnalysisData({
        investmentStrategy: parsedAnalysisData.investmentStrategy,
        top_stats: parsedAnalysisData.top_stats,
        projection: parsedAnalysisData.projection,
        strengths: parsedAnalysisData.strengths,
        weaknesses: parsedAnalysisData.weaknesses,
        recommendations: parsedAnalysisData.recommendations,
      });
    } else {
      router.push("/analysis"); // Redirect if no data is found
    }
  }, [router]);

  const handleRegenerate = (newStrategy: string, parameters: any) => {
    const updatedData = {
      ...propertyData,
      investmentStrategy: newStrategy,
      ...parameters,
    };
    sessionStorage.setItem("analysisData", JSON.stringify(updatedData));
    setPropertyData(updatedData);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!propertyData) {
    return <ProcessingAnimation />;
  } else {
    console.log("Property Data:", propertyData);
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
        onRegenerate={handleRegenerate}
      />
      <InvestmentReport
        propertyData={propertyData}
        analysisData={analysisData}
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
