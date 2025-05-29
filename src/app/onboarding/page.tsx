"use client";
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import Link from 'next/link';
import { updateUserType } from './_actions';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 card">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to EV-Trader!</h1>
        <p className="text-center mb-8">Please select your account type to continue.</p>
        
        <ClientOnboarding />
      </div>
    </div>
  );
}

// Client component for handling user interactions
function ClientOnboarding() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUserTypeSelection = async (userType: 'individual' | 'dealership') => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Call the server action to update the user's publicMetadata
      const result = await updateUserType(userType);
      
      if (result.success) {
        // Reload the user to get the updated metadata
        await user.reload();
        
        // Redirect to the appropriate dashboard
        router.push(userType === 'individual' ? '/dashboard/individual' : '/dashboard/dealership');
      } else {
        setError(result.error || 'Failed to update your account type. Please try again.');
      }
    } catch (err) {
      console.error('Error updating user type:', err);
      setError('Failed to update your account type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <button
        onClick={() => handleUserTypeSelection('individual')}
        disabled={loading}
        className="w-full btn-primary flex items-center justify-center gap-2 py-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        I'm an Individual Seller
      </button>
      
      <button
        onClick={() => handleUserTypeSelection('dealership')}
        disabled={loading}
        className="w-full btn-secondary flex items-center justify-center gap-2 py-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        I'm a Dealership
      </button>
      
      {loading && (
        <div className="text-center text-gray-500 mt-4">
          Processing...
        </div>
      )}
      
      <div className="text-center mt-6">
        <Link href="/" className="text-accent hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
