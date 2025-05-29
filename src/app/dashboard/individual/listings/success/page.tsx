'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import VehicleListingSuccess from '@/components/vehicles/VehicleListingSuccess';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  
  const vehicleId = searchParams.get('vehicleId') || '';
  const make = searchParams.get('make') || '';
  const model = searchParams.get('model') || '';
  const plan = searchParams.get('plan') || '';

  return (
    <VehicleListingSuccess
      vehicleId={vehicleId}
      vehicleMake={make}
      vehicleModel={model}
      planName={plan}
    />
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
