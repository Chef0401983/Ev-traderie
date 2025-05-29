'use client';

import { useState, useEffect } from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

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

interface PricingPlansProps {
  userType: 'private' | 'dealership';
  onPlanSelect: (plan: ListingPlan) => void;
  selectedPlanId?: string;
}

const planIcons = {
  'EV Essentials': Star,
  'EV Accelerator': Zap,
  'EV Premium Pro': Crown,
  'Dealer Starter EV': Star,
  'Dealer Pro EV': Zap,
  'Dealer Titan EV': Crown,
};

export default function PricingPlans({ userType, onPlanSelect, selectedPlanId }: PricingPlansProps) {
  const [plans, setPlans] = useState<ListingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, [userType]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/listing-plans?type=${userType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      const data = await response.json();
      setPlans(data.plans);
    } catch (err) {
      setError('Failed to load pricing plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchPlans}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const getPlanColorScheme = (planName: string) => {
    if (planName.includes('Essentials') || planName.includes('Starter')) {
      return {
        border: 'border-gray-200',
        header: 'bg-gray-50',
        button: 'bg-gray-600 hover:bg-gray-700',
        icon: 'text-gray-600'
      };
    } else if (planName.includes('Accelerator') || planName.includes('Pro EV')) {
      return {
        border: 'border-blue-200',
        header: 'bg-blue-50',
        button: 'bg-blue-600 hover:bg-blue-700',
        icon: 'text-blue-600'
      };
    } else {
      return {
        border: 'border-yellow-200',
        header: 'bg-yellow-50',
        button: 'bg-yellow-600 hover:bg-yellow-700',
        icon: 'text-yellow-600'
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Choose Your {userType === 'private' ? 'Listing' : 'Subscription'} Plan
        </h2>
        <p className="mt-2 text-gray-600">
          {userType === 'private' 
            ? 'Select a plan to list your EV with enhanced features and visibility'
            : 'Choose a monthly subscription plan that fits your dealership needs'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const colorScheme = getPlanColorScheme(plan.name);
          const IconComponent = planIcons[plan.name as keyof typeof planIcons] || Star;
          const isSelected = selectedPlanId === plan.id;
          const isPopular = plan.name.includes('Accelerator') || plan.name.includes('Pro EV');

          return (
            <div
              key={plan.id}
              className={`relative rounded-lg border-2 ${
                isSelected ? 'border-blue-500' : colorScheme.border
              } bg-white shadow-sm hover:shadow-md transition-shadow`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`p-6 ${colorScheme.header} rounded-t-lg`}>
                <div className="flex items-center justify-center mb-4">
                  <IconComponent className={`h-8 w-8 ${colorScheme.icon}`} />
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-600 text-center mt-2">{plan.description}</p>
                <div className="text-center mt-4">
                  <span className="text-3xl font-bold text-gray-900">€{plan.price}</span>
                  <span className="text-gray-600">
                    {userType === 'private' ? ` / ${plan.duration_days} days` : ' / month'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">{plan.max_photos} high-res photos</span>
                  </li>
                  {plan.max_videos > 0 && (
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{plan.max_videos} video upload</span>
                    </li>
                  )}
                  {plan.bump_ups > 0 && (
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{plan.bump_ups} Bump Ups</span>
                    </li>
                  )}
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onPlanSelect(plan)}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : `${colorScheme.button} text-white`
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {userType === 'private' && (
        <div className="text-center text-sm text-gray-600">
          <p>All plans include 72-day listing duration with auto-renewal options.</p>
          <p className="mt-1">20% off renewals if your EV doesn't sell within the listing period.</p>
        </div>
      )}
    </div>
  );
}
