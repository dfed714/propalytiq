'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../ScrollToTop';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  firstName?: string;
}

const MainLayout = ({ children, isAuthenticated, firstName }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header isAuthenticated={isAuthenticated} firstName={firstName} />
      {isAuthenticated && <Sidebar />}
      <main className={`flex-grow ${isAuthenticated ? 'md:pl-16' : ''}`}>
        {children}
      </main>
      <Footer isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default MainLayout;
