import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

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

interface UseVerificationReturn {
  profile: ProfileData | null;
  verification: VerificationData | null;
  isLoading: boolean;
  error: string | null;
  isVerified: boolean;
  canCreateListings: boolean;
  needsVerification: boolean;
  refetch: () => Promise<void>;
}

export function useVerification(): UseVerificationReturn {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [verification, setVerification] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVerificationStatus = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/verification/status');
      
      if (!response.ok) {
        throw new Error('Failed to fetch verification status');
      }

      const data = await response.json();
      setProfile(data.profile);
      setVerification(data.verification);
    } catch (err) {
      console.error('Error fetching verification status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch verification status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchVerificationStatus();
    } else if (isLoaded && !user) {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  const isVerified = profile?.verification_status === 'approved';
  const canCreateListings = profile?.can_create_listings || false;
  const needsVerification = !canCreateListings && isLoaded && !!user;

  return {
    profile,
    verification,
    isLoading,
    error,
    isVerified,
    canCreateListings,
    needsVerification,
    refetch: fetchVerificationStatus
  };
}
