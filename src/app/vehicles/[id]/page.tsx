"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Vehicle } from '@/lib/models/vehicle';
import StandardLayout from '@/components/layout/StandardLayout';
import { 
  MapPin, 
  Calendar, 
  Gauge, 
  Zap, 
  Clock, 
  Battery, 
  Phone,
  Mail,
  Heart,
  Share2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const response = await fetch(`/api/vehicles/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Vehicle not found');
        } else {
          setError('Failed to load vehicle');
        }
        return;
      }
      const data = await response.json();
      setVehicle(data.vehicle);
    } catch (err) {
      console.error('Error fetching vehicle:', err);
      setError('Failed to load vehicle');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (vehicle?.vehicle_images && vehicle.vehicle_images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === vehicle.vehicle_images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (vehicle?.vehicle_images && vehicle.vehicle_images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? vehicle.vehicle_images!.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <StandardLayout>
        <Container className="py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </Container>
      </StandardLayout>
    );
  }

  if (error || !vehicle) {
    return (
      <StandardLayout>
        <Container className="py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">
              {error || 'Vehicle not found'}
            </h1>
            <p className="text-gray-600 mb-6 font-lato">
              The vehicle you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/vehicles">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Vehicles
              </Button>
            </Link>
          </div>
        </Container>
      </StandardLayout>
    );
  }

  const images = vehicle.vehicle_images || [];
  const currentImage = images[selectedImageIndex];

  return (
    <StandardLayout>
      <Container className="py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/vehicles">
            <Button variant="ghost" className="text-gray-600 hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vehicles
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              {currentImage ? (
                <img 
                  src={currentImage.image_url} 
                  alt={vehicle.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Image navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {images.map((_, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {vehicle.is_featured && (
                  <Badge className="bg-primary text-white">Featured</Badge>
                )}
                {vehicle.is_sold && (
                  <Badge className="bg-red-500 text-white">Sold</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image: any, index: number) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image.image_url} 
                      alt={`${vehicle.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
                {vehicle.title}
              </h1>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-primary font-poppins">
                  {new Intl.NumberFormat('en-IE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(vehicle.price)}
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Specifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-poppins">Key Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500 font-lato">Year</p>
                      <p className="font-medium font-lato">{vehicle.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Gauge className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500 font-lato">Mileage</p>
                      <p className="font-medium font-lato">{vehicle.mileage ? new Intl.NumberFormat('en-IE').format(vehicle.mileage) + ' km' : 'N/A'}</p>
                    </div>
                  </div>

                  {vehicle.battery_capacity && (
                    <div className="flex items-center space-x-3">
                      <Battery className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500 font-lato">Battery</p>
                        <p className="font-medium font-lato">{vehicle.battery_capacity} kWh</p>
                      </div>
                    </div>
                  )}

                  {vehicle.range && (
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500 font-lato">Range</p>
                        <p className="font-medium font-lato">{vehicle.range} km</p>
                      </div>
                    </div>
                  )}

                  {vehicle.color && (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: vehicle.color.toLowerCase() }}></div>
                      <div>
                        <p className="text-sm text-gray-500 font-lato">Color</p>
                        <p className="font-medium font-lato">{vehicle.color}</p>
                      </div>
                    </div>
                  )}

                  {vehicle.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500 font-lato">Location</p>
                        <p className="font-medium font-lato">{vehicle.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {vehicle.description && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 font-poppins">Description</h3>
                  <p className="text-gray-700 font-lato leading-relaxed whitespace-pre-wrap">
                    {vehicle.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Seller Information */}
            {vehicle.profiles && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 font-poppins">Seller Information</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium font-lato">{vehicle.profiles.full_name}</p>
                      <Badge variant={vehicle.profiles.user_type === 'dealership' ? 'default' : 'secondary'} className="mt-1">
                        {vehicle.profiles.user_type === 'dealership' ? 'Dealership' : 'Private Seller'}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </StandardLayout>
  );
}
