'use client';

import React from 'react';
import { CheckCircle, Car, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface VehicleListingSuccessProps {
  vehicleId: string;
  vehicleMake?: string;
  vehicleModel?: string;
  planName?: string;
}

export default function VehicleListingSuccess({
  vehicleId,
  vehicleMake = '',
  vehicleModel = '',
  planName = ''
}: VehicleListingSuccessProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Listing Created Successfully!
          </h1>
          <p className="text-gray-600">
            Your {vehicleMake} {vehicleModel} has been submitted for review
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center">
              <Car className="w-5 h-5 text-blue-500 mr-2" />
              <span>Listing ID: {vehicleId.slice(-8)}</span>
            </div>
            <div className="flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500 mr-2" />
              <span>Status: Pending Review</span>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-500 mr-2" />
              <span>Plan: {planName}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">What happens next?</h2>
          <div className="text-left space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">Review Process</p>
                <p className="text-gray-600 text-sm">
                  Our team will review your listing within 24-48 hours to ensure it meets our quality standards.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">Email Notification</p>
                <p className="text-gray-600 text-sm">
                  You'll receive an email once your listing is approved and goes live on the marketplace.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Start Receiving Inquiries</p>
                <p className="text-gray-600 text-sm">
                  Once live, potential buyers can contact you directly through our secure messaging system.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/individual">
            <Button variant="outline" className="w-full sm:w-auto">
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/individual/listings/new">
            <Button className="w-full sm:w-auto">
              Create Another Listing
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@ev-trader.ie" className="text-blue-600 hover:underline">
              support@ev-trader.ie
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
