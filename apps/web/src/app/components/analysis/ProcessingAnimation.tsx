/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Progress } from "@components/ui/progress";

const ProcessingAnimation = () => {
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Analysing market comparables..."
  );

  const loadingMessages = [
    "Gathering property data...",
    "Analysing market comparables...",
    "Calculating potential returns...",
    "Evaluating investment strategies...",
    "Assessing local rental demand...",
    "Projecting cash flow scenarios...",
    "Analysing neighbourhood trends...",
    "Compiling comprehensive report...",
  ];

  useEffect(() => {
    let frameId = 0;
    let startTime = 0;
    const duration = 18000; // 18 seconds total

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const nextProgress = Math.min(95, (elapsed / duration) * 100);
      setProgress(nextProgress);

      const messageIndex = Math.floor(
        nextProgress / (100 / loadingMessages.length)
      );
      setLoadingMessage(
        loadingMessages[Math.min(messageIndex, loadingMessages.length - 1)]
      );

      if (nextProgress < 95) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-propalytiq-blue/20 flex items-center justify-center">
          <Loader className="w-12 h-12 text-propalytiq-blue animate-spin" />
        </div>
        <div className="absolute -inset-4 rounded-full border-4 border-t-propalytiq-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Analysing Your Property</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        Our AI is generating a comprehensive investment report tailored to your
        property...
      </p>

      <div className="w-full max-w-md mb-2">
        <Progress value={progress} className="h-2.5" />
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {loadingMessage}
      </div>
    </div>
  );
};

export default ProcessingAnimation;
