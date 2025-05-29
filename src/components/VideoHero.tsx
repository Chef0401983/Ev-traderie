'use client';

import React, { useState, useEffect } from 'react';
import { SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface VideoHeroProps {
  settings: {
    video_url: string;
    video_enabled: boolean;
    fallback_image: string;
  };
  title?: string;
  subtitle?: string;
}

export default function VideoHero({ 
  settings, 
  title = "Find Your Perfect Electric Vehicle", 
  subtitle = "The premier marketplace for buying and selling electric vehicles" 
}: VideoHeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const router = useRouter();
  
  // Handle video loading
  useEffect(() => {
    if (!settings.video_enabled || !settings.video_url) {
      setVideoError(true);
      return;
    }
    
    const videoElement = document.getElementById('hero-video') as HTMLVideoElement;
    
    if (videoElement) {
      const handleVideoLoaded = () => setVideoLoaded(true);
      const handleVideoError = () => setVideoError(true);
      
      videoElement.addEventListener('loadeddata', handleVideoLoaded);
      videoElement.addEventListener('error', handleVideoError);
      
      return () => {
        videoElement.removeEventListener('loadeddata', handleVideoLoaded);
        videoElement.removeEventListener('error', handleVideoError);
      };
    }
  }, [settings.video_enabled, settings.video_url]);

  // Determine background
  const backgroundStyle = videoLoaded && settings.video_enabled
    ? {} // No background when video is loaded
    : { 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${settings.fallback_image || '/images/hero-background.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };

  return (
    <div 
      className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden"
      style={backgroundStyle}
    >
      {/* Video Background */}
      {settings.video_enabled && settings.video_url && !videoError && (
        <video
          id="hero-video"
          autoPlay
          muted
          loop
          playsInline
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ zIndex: -1 }}
        >
          <source src={settings.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60" style={{ zIndex: -1 }}></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 text-center text-white z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{title}</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">{subtitle}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            onClick={() => router.push('/vehicles')}
          >
            Browse Vehicles
          </Button>
          
          <SignUpButton mode="modal">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg"
            >
              Sell my EV
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
