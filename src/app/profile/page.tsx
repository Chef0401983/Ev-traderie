'use client';

import { useUser } from '@clerk/nextjs';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import SupabaseProfileExample from '@/components/examples/SupabaseProfileExample';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-gray-600 mt-2">
            View and manage your profile information
          </p>
        </div>
        
        <SignedIn>
          <div className="space-y-6">
            {/* Clerk User Info */}
            <div className="p-6 card">
              <h2 className="text-xl font-bold mb-4">Clerk User Data</h2>
              {isLoaded && user ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.fullName || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User Type</p>
                    <p className="font-medium capitalize">
                      {user.publicMetadata.userType as string || 'Not set'}
                    </p>
                  </div>
                </div>
              ) : (
                <div>Loading user data...</div>
              )}
            </div>
            
            {/* Supabase Profile Component */}
            <SupabaseProfileExample />
            
            <div className="flex space-x-4">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </SignedIn>
        
        <SignedOut>
          <div className="p-6 card text-center">
            <h2 className="text-xl font-bold mb-4">Sign In Required</h2>
            <p className="mb-6">Please sign in to view your profile</p>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90">
                Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
