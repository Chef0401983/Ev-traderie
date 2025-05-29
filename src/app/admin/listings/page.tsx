'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Check, X, Clock, Car, Euro } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  approval_status: string;
  seller_id: string;
  created_at: string;
  vehicle_images: { image_url: string; is_primary: boolean }[];
  profiles: {
    full_name: string;
    email: string;
    user_type: string;
  };
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/admin/listings');
      const data = await response.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (listingId: string, action: 'approve' | 'reject') => {
    setProcessing(true);
    try {
      const response = await fetch('/api/admin/listings/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          action,
          reason: action === 'reject' ? rejectionReason : undefined
        }),
      });

      if (response.ok) {
        await fetchListings();
        setSelectedListing(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error processing listing:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
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
        <h1 className="text-3xl font-bold text-gray-900">Listing Approvals</h1>
        <p className="text-gray-600">Review and approve vehicle listings</p>
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
                  {listings.filter(l => l.approval_status === 'pending').length}
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
                  {listings.filter(l => l.approval_status === 'approved').length}
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
                  {listings.filter(l => l.approval_status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Car className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{listings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listings List */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Listings</CardTitle>
          <CardDescription>
            Click on a listing to review details and make a decision
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedListing(listing)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    {listing.vehicle_images.find(img => img.is_primary)?.image_url ? (
                      <img
                        src={listing.vehicle_images.find(img => img.is_primary)?.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{listing.title}</h3>
                    <p className="text-sm text-gray-500">
                      {listing.year} {listing.make} {listing.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      By: {listing.profiles?.full_name} ({listing.profiles?.user_type})
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(listing.price)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(listing.approval_status)}>
                    {listing.approval_status.replace('_', ' ')}
                  </Badge>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
            {listings.length === 0 && (
              <p className="text-center text-gray-500 py-8">No listings found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedListing.title}</h2>
                  <p className="text-gray-600">
                    {selectedListing.year} {selectedListing.make} {selectedListing.model}
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatPrice(selectedListing.price)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedListing(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Vehicle Images */}
              {selectedListing.vehicle_images.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Vehicle Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedListing.vehicle_images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.image_url}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-32 object-cover border rounded-lg"
                        />
                        {image.is_primary && (
                          <Badge className="absolute top-2 left-2 bg-blue-600">
                            Primary
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Listing Details */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedListing.description}</p>
              </div>

              {/* Seller Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seller</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedListing.profiles?.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seller Type</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedListing.profiles?.user_type}</p>
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedListing.approval_status === 'pending' && (
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
              {selectedListing.approval_status === 'pending' && (
                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleApproval(selectedListing.id, 'approve')}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Listing
                  </Button>
                  <Button
                    onClick={() => handleApproval(selectedListing.id, 'reject')}
                    disabled={processing || !rejectionReason.trim()}
                    variant="destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Listing
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
