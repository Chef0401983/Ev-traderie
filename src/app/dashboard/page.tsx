"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      // User is not logged in, redirect to sign in
      router.push('/sign-in');
      return;
    }

    // Check if user has completed onboarding
    const userType = user.publicMetadata.userType as string | undefined;
    
    if (userType) {
      // User has a type, redirect to the appropriate dashboard
      router.push(userType === 'individual' ? '/dashboard/individual' : '/dashboard/dealership');
    } else {
      // User hasn't completed onboarding
      setLoading(false);
      setError('Please complete the onboarding process to access your dashboard.');
    }
  }, [user, isLoaded, router]);

  if (loading && isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 card">
          <h1 className="text-2xl font-bold text-center mb-6">Dashboard Access</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="/onboarding" className="btn-primary text-center">
              Complete Onboarding
            </Link>
            <Link href="/" className="text-accent hover:underline text-center">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
