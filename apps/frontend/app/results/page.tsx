"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@components/Layout/MainLayout";
import InvestmentReport from "@components/Results/InvestmentReport";
import ChatBox from "@components/Chat/ChatBox";
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

// --- FIX: strongly type strategy keys ---
const STRATEGY_KEYS = ["btl", "brr", "sa", "hmo"] as const;
type StrategyKey = (typeof STRATEGY_KEYS)[number];

const ResultsPage = () => {
  const router = useRouter();
  const [propertyData, setPropertyData] = useState<any>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Demo purpose only - in real app this would come from auth context
  const [userTier, setUserTier] = useState<SubscriptionTier>("basic");

  useEffect(() => {
    // Retrieve property data from session storage
    const storedData = sessionStorage.getItem("propertyData");

    if (storedData) {
      setPropertyData(JSON.parse(storedData));
    } else {
      // If no data, redirect to analysis page
      router.push("/analysis");
    }
  }, [router]);

  // Simulate a randomly selected investment strategy for demo purposes
  // --- FIX: ensure the state is typed as StrategyKey and the pool is a const tuple ---
  const [selectedStrategy] = useState<StrategyKey>(() => {
    const i = Math.floor(Math.random() * STRATEGY_KEYS.length);
    return STRATEGY_KEYS[i]!; // ← tell TS it's not undefined
  });

  const handleUpgradeClick = () => {
    setShowUpgradeDialog(true);
  };

  if (!propertyData) {
    return null; // Or a loading state
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-6">
        <InvestmentReport
          propertyData={propertyData}
          investmentStrategy={selectedStrategy} // now correctly typed
          userTier={userTier}
          onUpgradeClick={handleUpgradeClick}
        />
        <ChatBox />

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
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-2 flex items-center">
                  <Banknote className="mr-2 h-5 w-5 text-propalytiq-teal" />
                  Pro Plan
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
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
    </MainLayout>
  );
};

export default ResultsPage;
