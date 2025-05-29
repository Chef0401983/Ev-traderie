"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, CreditCard, Lock } from 'lucide-react';

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

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [plan, setPlan] = useState<ListingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const planId = searchParams.get('plan');

  useEffect(() => {
    if (planId) {
      fetchPlan();
    }
  }, [planId]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/listing-plans?type=private`);
      if (!response.ok) {
        throw new Error('Failed to fetch plan');
      }
      const data = await response.json();
      const selectedPlan = data.plans.find((p: ListingPlan) => p.id === planId);
      setPlan(selectedPlan || null);
    } catch (error) {
      console.error('Error fetching plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!plan) return;

    setProcessing(true);
    try {
      // In a real implementation, this would:
      // 1. Create a Stripe payment intent
      // 2. Show Stripe payment form
      // 3. Process payment
      // 4. Create listing purchase record
      // 5. Activate the listing

      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page
      router.push('/dashboard/individual/listings?success=true&payment=completed');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan Not Found</h1>
          <button
            onClick={() => router.push('/dashboard/individual/listings/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Listing Creation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Complete Your Purchase</h1>
            <p className="text-blue-100 mt-1">Secure payment powered by Stripe</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Plan Summary */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{plan.name}</h3>
                    <span className="text-lg font-bold text-gray-900">€{plan.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>{plan.duration_days} days listing duration</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>{plan.max_photos} high-resolution photos</span>
                    </div>
                    {plan.max_videos > 0 && (
                      <div className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{plan.max_videos} video upload</span>
                      </div>
                    )}
                    {plan.bump_ups > 0 && (
                      <div className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{plan.bump_ups} bump ups</span>
                      </div>
                    )}
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>€{plan.price}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  One-time payment • No recurring charges
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                
                {/* Coming Soon Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">
                        Stripe Integration Coming Soon
                      </h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Full payment processing will be available in the next update. 
                        For now, you can proceed to activate your listing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mock Payment Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        disabled
                      />
                      <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Complete Purchase - €${plan.price}`
                  )}
                </button>

                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Lock className="h-4 w-4 mr-1" />
                  Secured by 256-bit SSL encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
