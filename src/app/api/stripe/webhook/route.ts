import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
// In a real implementation, this would be stored in an environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key_here', {
  apiVersion: '2023-10-16',
});

// Webhook secret for verifying the event
// Get the webhook secret from environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Ensure webhook secret is configured
if (!webhookSecret) {
  console.error('STRIPE_WEBHOOK_SECRET is not configured in environment variables');
}

export async function POST(req: NextRequest) {
  // Check if webhook secret is configured
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook configuration error' },
      { status: 500 }
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;
    
    // Verify the event came from Stripe
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }
    
    // Handle the event based on its type
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleSuccessfulPayment(paymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleFailedPayment(failedPaymentIntent);
        break;
        
      // Add other event types as needed
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Return a response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Function to handle successful payments
async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  // Extract metadata
  const { userId, vehicleId, paymentType } = paymentIntent.metadata;
  
  // In a real implementation, you would:
  // 1. Update your database to record the payment
  // 2. Update the vehicle status if it's a full payment
  // 3. Send notifications to the buyer and seller
  // 4. Generate receipts or invoices
  
  console.log(`Payment succeeded for vehicle ${vehicleId} by user ${userId}`);
}

// Function to handle failed payments
async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  // Extract metadata
  const { userId, vehicleId, paymentType } = paymentIntent.metadata;
  
  // In a real implementation, you would:
  // 1. Update your database to record the failed payment
  // 2. Send notifications to the buyer
  // 3. Potentially retry the payment or provide guidance
  
  console.log(`Payment failed for vehicle ${vehicleId} by user ${userId}`);
}
