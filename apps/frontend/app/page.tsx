import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div>
      <h1>Welcome back!</h1>
      <p>Your user ID is: {userId}</p>
    </div>
  );
}
