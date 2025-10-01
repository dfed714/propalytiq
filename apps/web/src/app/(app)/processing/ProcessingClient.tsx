// ProcessingClient.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProcessingAnimation from "@components/analysis/ProcessingAnimation";
import { AnalysisRequestDto } from "@dtos";

type ProcessingClientProps = {
  fetchPropertyAnalysis: (propertyData: AnalysisRequestDto) => Promise<any>; // Server Action
};

const ProcessingClient: React.FC<ProcessingClientProps> = ({
  fetchPropertyAnalysis,
}) => {
  const router = useRouter();

  useEffect(() => {
    const propertyData = sessionStorage.getItem("propertyData");
    const parsedPropertyData: AnalysisRequestDto | null = propertyData
      ? JSON.parse(propertyData)
      : null;
    if (parsedPropertyData) {
      fetchPropertyAnalysis(parsedPropertyData)
        .then((data) => {
          // Store analysis data in sessionStorage for results page
          sessionStorage.setItem("analysisData", JSON.stringify(data));
          router.push("/results");
        })
        .catch((error) => {
          console.error("Failed to fetch property analysis:", error);
          router.push("/analysis"); // Redirect to start if no data
        });
    } else {
      console.error("No property data found in sessionStorage.");
      router.push("/analysis"); // Redirect to start if no data
    }
  }, [fetchPropertyAnalysis, router]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <ProcessingAnimation />
    </div>
  );
};

export default ProcessingClient;
