/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InvestmentReport from "@components/results/InvestmentReport";
import LoadingAnimation from "@components/results/LoadingAnimation";

const ResultsClient = () => {
  const router = useRouter();
  const [propertyData, setPropertyData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);

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
        investment_strategy: parsedPropertyData.investment_strategy,
        investment_goal: parsedPropertyData.investment_goal,
        renovation_budget: parsedPropertyData.renovation_budget,
        expected_monthly_rental: parsedPropertyData.expected_monthly_rental,
        mortgage_interest_rate: parsedPropertyData.mortgage_interest_rate,
      });

      const parsedAnalysisData = JSON.parse(storedAnalysisData);
      setAnalysisData({
        investment_strategy: parsedAnalysisData.investment_strategy,
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

  if (!propertyData) {
    return <LoadingAnimation />;
  } else {
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="bg-primary text-white p-4 sm:p-8 rounded-xl mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Your Smart Investment Report
        </h1>
        <p className="text-lg sm:text-xl opacity-90">{propertyData.address}</p>
      </div>

      {/* <EditableParameters propertyData={propertyData} /> */}
      <InvestmentReport
        propertyData={propertyData}
        analysisData={analysisData}
      />
    </div>
  );
};

export default ResultsClient;
