'use client';

import {SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/nextjs';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Firebase Studio
      </h1>

      <p className="text-lg mb-8">
        Generate UI code effortlessly using AI.
      </p>

      <SignedIn>
        <div className="flex items-center space-x-4">
          <UserButton afterSignOutUrl="/"/>
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
