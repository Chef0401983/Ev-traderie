"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import VerificationForm from '@/components/verification/VerificationForm';
import VerificationStatus from '@/components/verification/VerificationStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertCircle } from 'lucide-react';

interface VerificationData {
  id: string;
  verification_type: 'individual' | 'dealership';
  status: 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  photo_id_type?: string;
  proof_of_address_type?: string;
  business_name?: string;
  business_registration_number?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

interface ProfileData {
  verification_status: 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  can_create_listings: boolean;
  user_type: 'individual' | 'dealership';
}

export default function VerificationPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [verification, setVerification] = useState<VerificationData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
      return;
    }

    if (isLoaded && user) {
      fetchVerificationStatus();
    }
  }, [isLoaded, user, router]);

  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/verification/status');
      
      if (!response.ok) {
        throw new Error('Failed to fetch verification status');
      }

      const data = await response.json();
      setProfile(data.profile);
      setVerification(data.verification);
      
      // Show form if user needs verification or wants to retry
      if (data.needsVerification && !data.verification) {
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
      setError('Failed to load verification status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionComplete = () => {
    setShowForm(false);
    fetchVerificationStatus();
  };

  const handleRetryVerification = () => {
    setShowForm(true);
  };

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Error Loading Verification</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Account Verification</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            To ensure the safety and security of our marketplace, we require all sellers to verify their identity 
            and address before creating listings.
          </p>
        </div>

        {showForm && profile ? (
          <VerificationForm 
            userType={profile.user_type}
            onSubmissionComplete={handleSubmissionComplete}
          />
        ) : profile ? (
          <VerificationStatus
            profile={profile}
            verification={verification}
            onRetryVerification={handleRetryVerification}
          />
        ) : null}
      </div>
    </div>
  );
}
