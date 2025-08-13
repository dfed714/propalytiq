'use client';

import React from 'react';
import MainLayout from '@components/Layout/MainLayout';
import { toast } from 'sonner';

const ReportsPage = () => {
  const handleDownloadReport = () => {
    toast.success("Report downloaded successfully!");
  };
  
  return (
    <MainLayout>
      <div className="container py-16">
        <h1>Reports Page</h1>
        <button onClick={handleDownloadReport}>Download Report</button>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
