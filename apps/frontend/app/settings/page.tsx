import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import SettingsClient from '././SettingsClient';

export default async function SettingsPage() {

  return <SettingsClient />;
}
