'use client';

import React from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface VehicleStatusNotificationProps {
  status: 'pending_approval' | 'approved' | 'rejected' | 'draft';
  vehicleId: string;
  make?: string;
  model?: string;
  rejectionReason?: string;
  onDismiss?: () => void;
}

export default function VehicleStatusNotification({
  status,
  vehicleId,
  make = '',
  model = '',
  rejectionReason,
  onDismiss
}: VehicleStatusNotificationProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Listing Approved!',
          message: `Your ${make} ${model} listing is now live on the marketplace.`,
          actionText: 'View Listing',
          actionHref: `/vehicles/${vehicleId}`
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Listing Rejected',
          message: `Your ${make} ${model} listing needs attention.`,
          actionText: 'Edit Listing',
          actionHref: `/dashboard/individual/listings/edit/${vehicleId}`
        };
      case 'pending_approval':
        return {
          icon: Clock,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Under Review',
          message: `Your ${make} ${model} listing is being reviewed by our team.`,
          actionText: 'View Status',
          actionHref: `/dashboard/individual/listings`
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Draft Listing',
          message: `Your ${make} ${model} listing is saved as a draft.`,
          actionText: 'Complete Listing',
          actionHref: `/dashboard/individual/listings/edit/${vehicleId}`
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className={`p-4 ${config.bgColor} ${config.borderColor} border-l-4`}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${config.color} mr-3 mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${config.color}`}>
            {config.title}
          </h3>
          <p className="text-sm text-gray-700 mt-1">
            {config.message}
          </p>
          {rejectionReason && status === 'rejected' && (
            <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-800">
              <strong>Reason:</strong> {rejectionReason}
            </div>
          )}
          <div className="mt-3 flex items-center space-x-3">
            <Link href={config.actionHref}>
              <Button size="sm" variant={status === 'approved' ? 'default' : 'outline'}>
                {config.actionText}
              </Button>
            </Link>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
