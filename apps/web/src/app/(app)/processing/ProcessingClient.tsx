"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProcessingAnimation from "@components/analysis/ProcessingAnimation";

const ProcessingClient = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(sessionStorage.getItem("propertyData"));
      //   router.push("/results");
    }, 8000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <ProcessingAnimation />
    </div>
  );
};

export default ProcessingClient;
