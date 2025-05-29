'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Check, X, Clock, FileText } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

interface Verification {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  document_type: string;
  document_number: string;
  document_front_url: string;
  document_back_url: string;
  selfie_url: string;
  status: string;
  submitted_at: string;
  profile: {
    full_name: string;
    email: string;
  };
  verification_type?: string;
  business_name?: string;
}

// Helper function to get secure signed URL for verification documents
const getSecureUrl = async (originalUrl: string): Promise<string> => {
  if (!originalUrl) return '';
  
  try {
    // Extract file path from the original URL
    const urlParts = originalUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'verification-documents');
    if (bucketIndex === -1) return originalUrl; // Not a verification document
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    
    const response = await fetch('/api/admin/signed-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filePath,
        bucket: 'verification-documents'
      }),
    });

    if (!response.ok) {
      console.error('Failed to get signed URL:', response.statusText);
      return originalUrl;
    }

    const data = await response.json();
    return data.signedUrl || originalUrl;
  } catch (error) {
    console.error('Error getting secure URL:', error);
    return originalUrl;
  }
};

// Secure Document Viewer Component
const SecureDocumentViewer = ({ url, title, type }: { url: string; title: string; type: string }) => {
  const [secureUrl, setSecureUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadSecureUrl = async () => {
      if (!url) {
        setLoading(false);
        return;
      }

      try {
        const signedUrl = await getSecureUrl(url);
        setSecureUrl(signedUrl);
      } catch (err) {
        console.error('Failed to load secure URL:', err);
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    loadSecureUrl();
  }, [url]);

  if (!url) {
    return <p className="text-gray-500">No {title.toLowerCase()} uploaded</p>;
  }

  if (loading) {
    return (
      <div className="border rounded p-4 bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Loading secure document...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded p-4 bg-red-50">
        <p className="text-red-600">{error}</p>
        <p className="text-xs mt-1 text-gray-600">Original URL: {url}</p>
      </div>
    );
  }

  const isPdf = url.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return (
      <div className="border rounded p-4 bg-gray-50">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="h-5 w-5 text-red-600" />
          <span className="font-medium">PDF Document</span>
        </div>
        <a 
          href={secureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          View {title} (PDF)
        </a>
        <iframe
          src={secureUrl}
          className="w-full h-96 mt-2 border rounded"
          title={title}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <img 
        src={secureUrl}
        alt={title}
        className="w-full max-w-md h-auto border rounded"
        onError={(e) => {
          console.error(`Failed to load ${title.toLowerCase()} image:`, secureUrl);
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.nextElementSibling) {
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
          }
        }}
      />
      <div className="hidden bg-gray-100 border rounded p-4 text-center text-gray-600">
        <p>{title} image not available</p>
        <p className="text-xs mt-1">URL: {secureUrl}</p>
      </div>
    </div>
  );
};

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const response = await fetch('/api/admin/verifications');
      const data = await response.json();
      console.log('Verification API Response:', data);
      console.log('Verifications Array:', data.verifications);
      
      // Log image URLs for debugging
      if (data.verifications && data.verifications.length > 0) {
        data.verifications.forEach((verification: Verification, index: number) => {
          console.log(`Verification ${index + 1} image URLs:`, {
            id: verification.id,
            document_front_url: verification.document_front_url,
            document_back_url: verification.document_back_url,
            selfie_url: verification.selfie_url
          });
        });
      }
      
      setVerifications(data.verifications || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (verificationId: string, action: 'approve' | 'reject') => {
    setProcessing(true);
    try {
      const response = await fetch('/api/admin/verifications/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationId,
          action,
          reason: action === 'reject' ? rejectionReason : undefined
        }),
      });

      if (response.ok) {
        await fetchVerifications();
        setSelectedVerification(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error processing verification:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Verifications</h1>
        <p className="text-gray-600">Review and approve user identity verifications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Pending Review</p>
                <p className="text-2xl font-bold">
                  {verifications.filter(v => v.status === 'submitted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold">
                  {verifications.filter(v => v.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold">
                  {verifications.filter(v => v.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{verifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
          <CardDescription>
            Click on a verification to review documents and make a decision
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verifications.map((verification) => (
              <div
                key={verification.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedVerification(verification)}
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{verification.profile?.full_name || 'Unknown User'}</h3>
                    <p className="text-sm text-gray-500">{verification.profile?.email}</p>
                    <p className="text-xs text-gray-400">
                      {verification.document_type} - {verification.document_number}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(verification.status)}>
                    {verification.status.replace('_', ' ')}
                  </Badge>
                  <p className="text-sm text-gray-500">
                    {new Date(verification.submitted_at).toLocaleDateString()}
                  </p>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
            {verifications.length === 0 && (
              <p className="text-center text-gray-500 py-8">No verification requests found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verification Detail Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Verification Review</h2>
                  <p className="text-gray-600">{selectedVerification.profile?.full_name}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedVerification(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Document Images */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Photo ID Document</h4>
                  <SecureDocumentViewer url={selectedVerification.document_front_url} title="Photo ID" type="image" />
                  <p className="text-sm text-gray-600 mt-1">
                    Type: {selectedVerification.document_type || 'Not specified'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Proof of Address</h4>
                  <SecureDocumentViewer url={selectedVerification.document_back_url} title="Proof of Address" type="image" />
                </div>

                {selectedVerification.verification_type === 'dealership' && selectedVerification.selfie_url && (
                  <div>
                    <h4 className="font-medium mb-2">Business Registration</h4>
                    <SecureDocumentViewer url={selectedVerification.selfie_url} title="Business Registration" type="image" />
                    {selectedVerification.business_name && (
                      <p className="text-sm text-gray-600 mt-1">
                        Business: {selectedVerification.business_name}
                      </p>
                    )}
                    {selectedVerification.document_number && selectedVerification.document_number !== 'N/A' && (
                      <p className="text-sm text-gray-600">
                        Registration Number: {selectedVerification.document_number}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Verification Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Document Type</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedVerification.document_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Document Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedVerification.document_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedVerification.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedVerification.email}</p>
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedVerification.status === 'submitted' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    rows={3}
                  />
                </div>
              )}

              {/* Action Buttons */}
              {selectedVerification.status === 'submitted' && (
                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleApproval(selectedVerification.id, 'approve')}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleApproval(selectedVerification.id, 'reject')}
                    disabled={processing || !rejectionReason.trim()}
                    variant="destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
