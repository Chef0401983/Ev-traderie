import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PaymentElement, 
  LinkAuthenticationElement,
  useStripe, 
  useElements, 
  AddressElement
} from '@stripe/react-stripe-js';

interface PaymentFormProps {
  vehicleId: string;
  vehicleTitle: string;
  amount: number;
  paymentType: 'deposit' | 'full';
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentForm({
  vehicleId,
  vehicleTitle,
  amount,
  paymentType,
  onSuccess,
  onCancel
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!stripe) {
      return;
    }
    
    // Retrieve the client secret from the URL query parameters
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    
    if (!clientSecret) {
      return;
    }
    
    // Retrieve the payment intent using the client secret
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          if (onSuccess) onSuccess();
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe, onSuccess]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirect to the success page after payment
        return_url: `${window.location.origin}/payment/success?vehicleId=${vehicleId}&type=${paymentType}`,
        receipt_email: email,
      },
    });
    
    // This will only execute if there's an immediate error when confirming the payment.
    // Otherwise, the customer will be redirected to the return_url.
    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'An unexpected error occurred.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    }
    
    setIsLoading(false);
  };
  
  // Format the amount with Euro symbol
  const formattedAmount = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
  
  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
        
        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-medium">Vehicle:</span> {vehicleTitle}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Payment Type:</span> {paymentType === 'deposit' ? 'Deposit' : 'Full Payment'}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Amount:</span> {formattedAmount}
          </p>
        </div>
        
        <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e) => setEmail(e.value.email)}
        />
        
        <div className="mt-4">
          <PaymentElement id="payment-element" />
        </div>
        
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Billing Address</h3>
          <AddressElement options={{ mode: 'billing' }} />
        </div>
      </div>
      
      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('succeeded') 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          {message}
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className={`btn-primary ${(isLoading || !stripe || !elements) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            `Pay ${formattedAmount}`
          )}
        </button>
      </div>
    </form>
  );
}
