'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import MainLayout from '@components/Layout/MainLayout';
import PropertyLinkForm from '@components/Analysis/PropertyLinkForm';
import ManualEntryForm from '@components/Analysis/ManualEntryForm';
import PropertyPreview from '@components/Analysis/PropertyPreview';
import { useRouter } from 'next/navigation';

const AnalysisPage = () => {
  const router = useRouter();
  const [inputMethod, setInputMethod] = useState<string>('link');
  const [propertyData, setPropertyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePreviewData = (data: any) => {
    setPropertyData(data);
  };

  const handleAnalyze = () => {
    // Store property data in session storage for the processing and results pages
    sessionStorage.setItem('propertyData', JSON.stringify(propertyData));
    router.push('/processing');
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Start Your Property Analysis</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter property details to receive your AI-powered investment report
          </p>
        </div>

        {!propertyData ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <Tabs defaultValue={inputMethod} onValueChange={setInputMethod}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="link">Paste Property Link</TabsTrigger>
                <TabsTrigger value="manual">Manual Input</TabsTrigger>
              </TabsList>
              
              <TabsContent value="link">
                <PropertyLinkForm 
                  onPreviewData={handlePreviewData} 
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </TabsContent>
              
              <TabsContent value="manual">
                <ManualEntryForm onSubmitData={handlePreviewData} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <PropertyPreview 
            propertyData={propertyData} 
            onAnalyze={handleAnalyze}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default AnalysisPage;
