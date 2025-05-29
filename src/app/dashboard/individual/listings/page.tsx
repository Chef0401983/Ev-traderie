'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Car } from 'lucide-react';
import VehicleStatusNotification from '@/components/vehicles/VehicleStatusNotification';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  approval_status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'suspended' | 'expired' | 'sold';
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
  featured_until?: string;
  bump_ups_used: number;
}

export default function UserListingsPage() {
  const { user, isLoaded } = useUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchVehicles();
    }
  }, [isLoaded, user]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles/my-listings');
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }

      // Remove from local state
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete vehicle');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
      pending_approval: { color: 'bg-orange-100 text-orange-800', text: 'Under Review' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Live' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      suspended: { color: 'bg-yellow-100 text-yellow-800', text: 'Suspended' },
      expired: { color: 'bg-gray-100 text-gray-800', text: 'Expired' },
      sold: { color: 'bg-blue-100 text-blue-800', text: 'Sold' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchVehicles}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Vehicle Listings</h1>
          <p className="text-gray-600 mt-2">Manage your electric vehicle listings</p>
        </div>
        <Link href="/dashboard/individual/listings/new">
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create New Listing
          </Button>
        </Link>
      </div>

      {/* Status notifications for recent listings */}
      <div className="mb-8 space-y-4">
        {vehicles
          .filter(v => ['approved', 'rejected'].includes(v.approval_status))
          .slice(0, 3)
          .map(vehicle => (
            <VehicleStatusNotification
              key={vehicle.id}
              status={vehicle.approval_status as any}
              vehicleId={vehicle.id}
              make={vehicle.make}
              model={vehicle.model}
              rejectionReason={vehicle.rejection_reason}
            />
          ))}
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-6">Create your first vehicle listing to get started selling on EV-Trader.</p>
          <Link href="/dashboard/individual/listings/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Listing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      €{vehicle.price.toLocaleString()}
                    </p>
                  </div>
                  {getStatusBadge(vehicle.approval_status)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    {new Date(vehicle.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Bump-ups:</span> {vehicle.bump_ups_used || 0}
                  </div>
                </div>

                {vehicle.rejection_reason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
                    <strong className="text-red-800">Rejection reason:</strong>
                    <p className="text-red-700 mt-1">{vehicle.rejection_reason}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  {vehicle.approval_status === 'approved' && (
                    <Link href={`/vehicles/${vehicle.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  )}
                  
                  <Link href={`/dashboard/individual/listings/edit/${vehicle.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
