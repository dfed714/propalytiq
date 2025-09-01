"use client";

import MainLayout from "@components/layout/MainLayout";
import AuthCard from "./AuthCard";

const LoginPage = () => {
  return (
    <MainLayout isAuthenticated={false}>
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <AuthCard />
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
