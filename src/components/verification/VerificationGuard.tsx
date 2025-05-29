'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useVerification } from '@/hooks/useVerification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface VerificationGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export default function VerificationGuard({ 
  children, 
  fallback,
  redirectTo = '/verification' 
}: VerificationGuardProps) {
  const router = useRouter();
  const { profile, isLoading, canCreateListings, needsVerification } = useVerification();

  if (isLoading) {
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

  if (!canCreateListings && needsVerification) {
    if (fallback) {
      return <>{fallback}</>;
    }

    const getStatusIcon = () => {
      switch (profile?.verification_status) {
        case 'approved':
          return <CheckCircle className="h-8 w-8 text-green-600" />;
        case 'submitted':
        case 'under_review':
          return <Clock className="h-8 w-8 text-yellow-600" />;
        case 'rejected':
          return <AlertCircle className="h-8 w-8 text-red-600" />;
        default:
          return <Shield className="h-8 w-8 text-blue-600" />;
      }
    };

    const getStatusMessage = () => {
      switch (profile?.verification_status) {
        case 'submitted':
        case 'under_review':
          return {
            title: 'Verification Under Review',
            description: 'Your verification documents are being reviewed. You\'ll be able to create listings once approved.',
            action: 'Check Status'
          };
        case 'rejected':
          return {
            title: 'Verification Required',
            description: 'Your verification was rejected. Please resubmit your documents to start creating listings.',
            action: 'Resubmit Documents'
          };
        default:
          return {
            title: 'Verification Required',
            description: 'To ensure marketplace safety, please verify your identity before creating listings.',
            action: 'Start Verification'
          };
      }
    };

    const statusInfo = getStatusMessage();

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                {getStatusIcon()}
              </div>
              <CardTitle>{statusInfo.title}</CardTitle>
              <CardDescription>{statusInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push(redirectTo)}
                className="w-full"
              >
                {statusInfo.action}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
