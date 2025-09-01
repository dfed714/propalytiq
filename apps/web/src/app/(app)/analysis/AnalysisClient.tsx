/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import UnifiedPropertyForm from "@components/analysis/UnifiedPropertyForm";
import PropertyPreview from "@components/analysis/PropertyPreview";
import { useRouter } from "next/navigation";

type AnalysisClientProps = {
  fetchPropertyInfo: (url: string) => Promise<any>; // Server Action
};

const AnalysisClient: React.FC<AnalysisClientProps> = ({
  fetchPropertyInfo,
}) => {
  const router = useRouter();
  const [propertyData, setPropertyData] = useState<any>(null);

  const handlePreviewData = (data: any) => {
    setPropertyData(data);
  };

  const handleAnalyze = () => {
    try {
      sessionStorage.setItem("propertyData", JSON.stringify(propertyData));
    } catch {
      // ignore storage errors (private mode)
    }
    router.push("/processing");
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Start Your Property Analysis
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Enter property details to receive your AI-powered investment report
        </p>
      </div>

      {!propertyData ? (
        <UnifiedPropertyForm
          onSubmitData={handlePreviewData}
          fetchPropertyInfo={fetchPropertyInfo}
        />
      ) : (
        <PropertyPreview
          propertyData={propertyData}
          onAnalyze={handleAnalyze}
        />
      )}
    </div>
  );
};

export default AnalysisClient;
