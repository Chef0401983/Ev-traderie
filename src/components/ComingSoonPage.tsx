'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/ui/Logo';

interface ComingSoonProps {
  settings: {
    enabled: boolean;
    title: string;
    message: string;
    background_image: string;
    allow_signup: boolean;
  };
}

export default function ComingSoonPage({ settings }: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      } else {
        console.error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl text-center border border-white/20">
        <div className="mb-8">
          {/* Use the actual logo */}
          <div className="flex justify-center mb-6">
            <Logo size="lg" color="white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4 font-poppins">
            {settings.title || 'Coming Soon'}
          </h1>
          <p className="text-xl text-white/80 leading-relaxed font-lato">
            {settings.message || 'We are launching soon! Sign up to be notified when we go live.'}
          </p>
        </div>

        {settings.allow_signup ? (
          <>
            {subscribed ? (
              <div className="bg-white/20 border border-white/30 text-white px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
                <p className="font-lato">Thanks for subscribing! We'll notify you when we launch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/20 text-white placeholder:text-white/70 border-white/30 focus:border-white font-lato"
                  />
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-white text-primary hover:bg-white/90 font-poppins font-semibold px-6"
                  >
                    {loading ? 'Subscribing...' : 'Notify Me'}
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : null}
        
      </div>
      
      <div className="mt-8 text-center text-white/60">
        <p className="font-lato"> {new Date().getFullYear()} EV Trader. All rights reserved.</p>
      </div>
    </div>
  );
}
