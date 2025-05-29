"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function WelcomeHandler() {
  const { user, isLoaded } = useUser();
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || hasProcessed) return;

    const processWelcome = async () => {
      try {
        const response = await fetch('/api/auth/welcome', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Welcome process completed:', data.message);
        } else {
          const error = await response.json();
          console.log('Welcome process result:', error.message || 'Already processed');
        }
      } catch (error) {
        console.error('Welcome process failed:', error);
      } finally {
        setHasProcessed(true);
      }
    };

    processWelcome();
  }, [user, isLoaded, hasProcessed]);

  // This component doesn't render anything visible
  return null;
}
