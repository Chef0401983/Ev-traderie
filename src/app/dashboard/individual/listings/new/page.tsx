'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VehicleListingForm from '@/components/vehicles/VehicleListingForm';
import PricingPlans from '@/components/listing/PricingPlans';
import VerificationGuard from '@/components/verification/VerificationGuard';
import VehicleImageUpload from '@/components/vehicles/VehicleImageUpload';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/app/dashboard/components/DashboardLayout';

interface ListingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  max_photos: number;
  max_videos: number;
  bump_ups: number;
  features: string[];
  plan_type: 'private' | 'dealership';
}

export default function NewIndividualListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<ListingPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, name: 'Choose Plan', description: 'Select your listing plan' },
    { id: 2, name: 'Vehicle Details', description: 'Add your EV information' },
    { id: 3, name: 'Payment', description: 'Complete your purchase' }
  ];

  const handlePlanSelect = (plan: ListingPlan) => {
    setSelectedPlan(plan);
  };

  const handleContinueToVehicleForm = () => {
    if (selectedPlan) {
      setCurrentStep(2);
    }
  };

  const handleBackToPricing = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (formData: FormData) => {
    if (!selectedPlan) return;
    
    setIsSubmitting(true);
    try {
      // Add plan information to form data
      formData.append('planId', selectedPlan.id);
      formData.append('planPrice', selectedPlan.price.toString());
      
      // Create the vehicle listing
      const response = await fetch('/api/vehicles/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create listing');
      }

      const result = await response.json();
      
      // Redirect to success page with vehicle details
      router.push(`/dashboard/individual/listings/success?vehicleId=${result.vehicle.id}&make=${result.vehicle.make}&model=${result.vehicle.model}&plan=${selectedPlan.name}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-4">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.id < currentStep
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : step.id === currentStep
                    ? 'border-blue-600 text-blue-600'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="ml-2 text-sm">
                <p className={`font-medium ${
                  step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
                <p className="text-gray-500">{step.description}</p>
              </div>
              {stepIdx < steps.length - 1 && (
                <div className={`ml-4 w-8 h-0.5 ${
                  step.id < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );

  return (
    <DashboardLayout userType="individual">
      <VerificationGuard>
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Create New Listing</h1>
          </div>

          {renderStepIndicator()}

          {currentStep === 1 && (
            <div className="space-y-6">
              <PricingPlans
                userType="private"
                onPlanSelect={handlePlanSelect}
                selectedPlanId={selectedPlan?.id}
              />
              
              {selectedPlan && (
                <div className="flex justify-center">
                  <Button
                    onClick={handleContinueToVehicleForm}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Continue to Vehicle Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && selectedPlan && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900">Selected Plan: {selectedPlan.name}</h3>
                    <p className="text-sm text-blue-700">
                      €{selectedPlan.price} for {selectedPlan.duration_days} days
                    </p>
                  </div>
                  <Button
                    onClick={handleBackToPricing}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Change Plan
                  </Button>
                </div>
              </div>

              <VehicleListingForm 
                sellerType="individual"
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />

              <div className="flex justify-between">
                <Button
                  onClick={handleBackToPricing}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Pricing
                </Button>
              </div>
            </div>
          )}
        </div>
      </VerificationGuard>
    </DashboardLayout>
  );
}
