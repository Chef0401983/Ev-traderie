import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
// In a real implementation, this would be stored in an environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key_here', {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { amount, vehicleId, paymentType } = body;
    
    // Validate required fields
    if (!amount || !vehicleId || !paymentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amounts in cents
      currency: 'eur',
      metadata: {
        userId,
        vehicleId,
        paymentType, // 'deposit', 'full', etc.
      },
    });
    
    // Return the client secret to the client
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
