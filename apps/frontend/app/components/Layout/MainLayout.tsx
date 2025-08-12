
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../ScrollToTop';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
