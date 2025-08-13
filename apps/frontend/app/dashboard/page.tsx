import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import DashboardClient from './DashboardClient'; // client component

export default async function DashboardPage() {
  return <DashboardClient />;
}
