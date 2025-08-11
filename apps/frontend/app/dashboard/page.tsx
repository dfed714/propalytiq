import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Header from '../components/header';

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in?fallbackRedirectUrl=/dashboard');
  }

  return (
    <div>
      <Header></Header>
      <h1>Dashboard</h1>
      <h2>Welcome back!</h2>
      <p>Your user ID is: {userId}</p>
    </div>
  );
}
