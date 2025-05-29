import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

// Initialize Stripe with your publishable key
// In a real implementation, this would be stored in an environment variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

interface StripePaymentWrapperProps {
  vehicleId: string;
  vehicleTitle: string;
  amount: number;
  paymentType: 'deposit' | 'full';
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function StripePaymentWrapper({
  vehicleId,
  vehicleTitle,
  amount,
  paymentType,
  onSuccess,
  onCancel
}: StripePaymentWrapperProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Create a payment intent when the component mounts
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/stripe/payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            vehicleId,
            paymentType,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError('Failed to initialize payment. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    createPaymentIntent();
  }, [vehicleId, amount, paymentType]);
  
  // Stripe Elements appearance options
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#00A651', // primary color from our style guide
      colorBackground: '#FFFFFF',
      colorText: '#0F172A', // text color from our style guide
      colorDanger: '#ef4444',
      fontFamily: 'Inter, SF Pro Text, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
  };
  
  const options = {
    clientSecret,
    appearance,
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <div className="flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Payment Error</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={onCancel} 
              className="mt-2 text-sm text-red-700 underline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm
            vehicleId={vehicleId}
            vehicleTitle={vehicleTitle}
            amount={amount}
            paymentType={paymentType}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </Elements>
      )}
    </div>
  );
}
