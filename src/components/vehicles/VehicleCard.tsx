import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/lib/models/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  // Get primary image or fallback to first image
  const primaryImage = vehicle.vehicle_images?.find(img => img.is_primary) || 
                      vehicle.vehicle_images?.[0];
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format mileage
  const formatMileage = (mileage?: number) => {
    if (!mileage) return 'N/A';
    return new Intl.NumberFormat('en-IE').format(mileage) + ' km';
  };

  return (
    <div className="card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <Link href={`/vehicles/${vehicle.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={primaryImage?.image_url || '/images/vehicle-placeholder.jpg'} 
            alt={vehicle.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured badge */}
          {vehicle.is_featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-white font-medium">
              Featured
            </Badge>
          )}
          
          {/* Sold badge */}
          {vehicle.is_sold && (
            <Badge className="absolute top-3 right-3 bg-red-500 text-white font-medium">
              Sold
            </Badge>
          )}
        </div>
      </Link>
      
      <div className="p-6">
        <Link href={`/vehicles/${vehicle.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins group-hover:text-primary transition-colors line-clamp-2">
            {vehicle.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary font-poppins">
            {formatPrice(vehicle.price)}
          </span>
          <span className="text-sm text-gray-500 font-lato">
            {vehicle.year}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 font-lato">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Mileage
            </span>
            <span>{formatMileage(vehicle.mileage)}</span>
          </div>
          
          {vehicle.battery_capacity && (
            <div className="flex items-center justify-between text-sm text-gray-600 font-lato">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Battery
              </span>
              <span>{vehicle.battery_capacity} kWh</span>
            </div>
          )}
          
          {vehicle.range && (
            <div className="flex items-center justify-between text-sm text-gray-600 font-lato">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Range
              </span>
              <span>{vehicle.range} km</span>
            </div>
          )}
          
          {vehicle.location && (
            <div className="flex items-center justify-between text-sm text-gray-600 font-lato">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </span>
              <span>{vehicle.location}</span>
            </div>
          )}
        </div>
        
        {/* Seller info */}
        {vehicle.profiles && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-lato">
                Seller: {vehicle.profiles.full_name}
              </span>
              <Badge variant={vehicle.profiles.user_type === 'dealership' ? 'default' : 'secondary'} className="text-xs">
                {vehicle.profiles.user_type === 'dealership' ? 'Dealer' : 'Private'}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
