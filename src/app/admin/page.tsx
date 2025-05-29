'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function AdminRedirect() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // User is not signed in, redirect to sign in
      router.push('/sign-in?redirect_url=/admin');
      return;
    }

    // Check if user is admin
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/admin/check-admin');
        const data = await response.json();
        
        if (data.isAdmin) {
          router.push('/admin/dashboard');
        } else {
          // User is signed in but not an admin, redirect to home
          router.push('/?error=admin_access_required');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/?error=admin_check_failed');
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded || isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="font-lato">Checking admin access...</p>
        </div>
      </div>
    );
  }

  return null;
}
