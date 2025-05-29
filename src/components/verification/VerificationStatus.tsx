'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

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

interface VerificationStatusProps {
  profile: ProfileData;
  verification: VerificationData | null;
  onRetryVerification: () => void;
}

export default function VerificationStatus({ profile, verification, onRetryVerification }: VerificationStatusProps) {
  const getStatusIcon = (status: VerificationData['status'] | ProfileData['verification_status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'submitted':
      case 'under_review':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: VerificationData['status'] | ProfileData['verification_status']) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'submitted':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'under_review':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Under Review</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getStatusMessage = (status: VerificationData['status'] | ProfileData['verification_status']) => {
    switch (status) {
      case 'approved':
        return 'Your verification has been approved! You can now create listings on our marketplace.';
      case 'rejected':
        return 'Your verification was rejected. Please review the feedback below and resubmit your documents.';
      case 'submitted':
      case 'under_review':
        return 'Your verification documents are being reviewed. This typically takes 1-3 business days.';
      default:
        return 'Please complete the verification process to start selling on our marketplace.';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(profile.verification_status)}
              Verification Status
            </div>
            {getStatusBadge(profile.verification_status)}
          </CardTitle>
          <CardDescription>
            {getStatusMessage(profile.verification_status)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verification && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Verification Type:</span>
                <p className="capitalize">{verification.verification_type}</p>
              </div>
              <div>
                <span className="font-medium">Submitted:</span>
                <p>{formatDate(verification.created_at)}</p>
              </div>
              {verification.photo_id_type && (
                <div>
                  <span className="font-medium">Photo ID Type:</span>
                  <p className="capitalize">{verification.photo_id_type.replace('_', ' ')}</p>
                </div>
              )}
              {verification.proof_of_address_type && (
                <div>
                  <span className="font-medium">Proof of Address:</span>
                  <p className="capitalize">{verification.proof_of_address_type.replace('_', ' ')}</p>
                </div>
              )}
              {verification.business_name && (
                <div>
                  <span className="font-medium">Business Name:</span>
                  <p>{verification.business_name}</p>
                </div>
              )}
              {verification.business_registration_number && (
                <div>
                  <span className="font-medium">Registration Number:</span>
                  <p>{verification.business_registration_number}</p>
                </div>
              )}
            </div>
          )}

          {profile.verification_status === 'rejected' && verification?.rejection_reason && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800 mb-1">Rejection Reason:</p>
                    <p className="text-red-700">{verification.rejection_reason}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(profile.verification_status === 'rejected' || profile.verification_status === 'pending') && (
            <Button onClick={onRetryVerification} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              {profile.verification_status === 'rejected' ? 'Resubmit Verification' : 'Start Verification'}
            </Button>
          )}
        </CardContent>
      </Card>

      {profile.verification_status === 'approved' && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Verification Complete!</p>
                <p className="text-green-700">You can now create listings and start selling on our marketplace.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(profile.verification_status === 'submitted' || profile.verification_status === 'under_review') && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Our team will review your documents within 1-3 business days</li>
                  <li>You'll receive an email notification once the review is complete</li>
                  <li>If approved, you'll be able to create listings immediately</li>
                  <li>If additional information is needed, we'll contact you directly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
