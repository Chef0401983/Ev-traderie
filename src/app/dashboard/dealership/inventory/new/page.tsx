'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/dashboard/components/DashboardLayout';
import VehicleListingForm from '@/components/vehicles/VehicleListingForm';

export default function NewDealershipInventoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send the data to your API
      // const response = await fetch('/api/dealership/inventory', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to add vehicle to inventory');
      // }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to inventory page
      router.push('/dashboard/dealership/inventory?success=true');
    } catch (error) {
      console.error('Error adding vehicle to inventory:', error);
      alert('Failed to add vehicle to inventory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout userType="dealership">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add Vehicle to Inventory</h1>
        </div>
        
        <VehicleListingForm 
          sellerType="dealership"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardLayout>
  );
}
