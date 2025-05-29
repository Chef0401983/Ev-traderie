import { useState, useEffect } from 'react';
import StripePaymentWrapper from './StripePaymentWrapper';
import { Vehicle } from '@/lib/models/vehicle';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export default function PaymentModal({ isOpen, onClose, vehicle }: PaymentModalProps) {
  const [paymentType, setPaymentType] = useState<'deposit' | 'full'>('deposit');
  const [paymentStep, setPaymentStep] = useState<'select' | 'process'>('select');
  
  // Calculate deposit amount (10% of vehicle price)
  const depositAmount = Math.round(vehicle.price * 0.1);
  
  // Get the amount based on payment type
  const amount = paymentType === 'deposit' ? depositAmount : vehicle.price;
  
  // Format the amount with Euro symbol
  const formattedAmount = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
  
  // Handle payment type selection
  const handleSelectPaymentType = (type: 'deposit' | 'full') => {
    setPaymentType(type);
    setPaymentStep('process');
  };
  
  // Handle payment success
  const handlePaymentSuccess = () => {
    // In a real implementation, you would update the UI to show a success message
    // and potentially redirect the user to a receipt page
    onClose();
  };
  
  // Handle payment cancellation
  const handlePaymentCancel = () => {
    if (paymentStep === 'process') {
      // Go back to payment type selection
      setPaymentStep('select');
    } else {
      // Close the modal
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Modal header */}
          <div className="bg-secondary text-white px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {paymentStep === 'select' ? 'Select Payment Option' : 'Process Payment'}
            </h3>
            <button
              type="button"
              className="text-white hover:text-gray-200"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Modal content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {paymentStep === 'select' ? (
              <div className="space-y-4">
                <p className="text-gray-700 mb-4">
                  Please select a payment option for the vehicle:
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  <div 
                    className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-green-50 transition-colors"
                    onClick={() => handleSelectPaymentType('deposit')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-lg">Pay Deposit</h4>
                        <p className="text-gray-600 text-sm">
                          Secure the vehicle with a 10% deposit
                        </p>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {new Intl.NumberFormat('en-IE', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(depositAmount)}
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-green-50 transition-colors"
                    onClick={() => handleSelectPaymentType('full')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-lg">Pay Full Amount</h4>
                        <p className="text-gray-600 text-sm">
                          Pay the full amount for the vehicle
                        </p>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {new Intl.NumberFormat('en-IE', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(vehicle.price)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium">Secure Payment</p>
                      <p>All payments are processed securely through Stripe. Your payment information is never stored on our servers.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <StripePaymentWrapper
                vehicleId={vehicle.id}
                vehicleTitle={vehicle.title}
                amount={amount}
                paymentType={paymentType}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
