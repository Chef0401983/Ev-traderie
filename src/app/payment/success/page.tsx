"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the vehicle ID and payment type from the URL
  const vehicleId = searchParams.get('vehicleId');
  const paymentType = searchParams.get('type');
  
  useEffect(() => {
    // Simulate loading payment details
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl font-medium">Processing your payment...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">EV-Trader</Link>
            <div className="flex items-center gap-4">
              <Link href="/vehicles" className="text-white hover:text-accent">
                Browse Vehicles
              </Link>
              <Link href="/dashboard" className="btn-primary text-sm">
                My Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              {paymentType === 'deposit' 
                ? 'Your deposit has been successfully processed.' 
                : 'Your payment has been successfully processed.'}
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment Type:</span>
                <span className="font-medium">
                  {paymentType === 'deposit' ? 'Deposit' : 'Full Payment'}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Vehicle ID:</span>
                <span className="font-medium">{vehicleId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                {paymentType === 'deposit' 
                  ? 'We have sent a confirmation email with details about next steps to complete your purchase.' 
                  : 'We have sent a receipt to your email address. The seller will contact you shortly to arrange delivery or pickup.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Link 
                  href={`/vehicles/${vehicleId}`} 
                  className="btn-secondary"
                >
                  Return to Vehicle
                </Link>
                <Link 
                  href="/dashboard" 
                  className="btn-primary"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              If you have any questions, please contact our support team at{' '}
              <a href="mailto:support@ev-trader.ie" className="text-accent hover:underline">
                support@ev-trader.ie
              </a>
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-text text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} EV-Trader. All rights reserved.</p>
            <div className="mt-2">
              <Link href="/terms" className="text-sm text-gray-300 hover:text-white mx-2">Terms</Link>
              <Link href="/privacy" className="text-sm text-gray-300 hover:text-white mx-2">Privacy</Link>
              <Link href="/contact" className="text-sm text-gray-300 hover:text-white mx-2">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
