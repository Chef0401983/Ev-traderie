import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "./card"
import { Button } from "./button"

interface VehicleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage?: number;
    location?: string;
    image_url?: string;
    battery_capacity?: number;
    range?: number;
  };
  onViewDetails?: (vehicleId: string) => void;
  onContact?: (vehicleId: string) => void;
}

const VehicleCard = React.forwardRef<HTMLDivElement, VehicleCardProps>(
  ({ className, vehicle, onViewDetails, onContact, ...props }, ref) => {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    };

    const formatMileage = (mileage: number) => {
      return new Intl.NumberFormat('en-GB').format(mileage);
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
          className
        )}
        {...props}
      >
        {/* Vehicle Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
          {vehicle.image_url ? (
            <img
              src={vehicle.image_url}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <div className="text-4xl text-gray-400 mb-2">🚗</div>
                <p className="text-sm text-gray-500 font-lato">No Image Available</p>
              </div>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-sm">
            <span className="text-lg font-semibold text-gray-900 font-poppins">
              {formatPrice(vehicle.price)}
            </span>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Vehicle Title */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 font-poppins line-clamp-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.location && (
              <p className="text-sm text-gray-600 font-lato mt-1">📍 {vehicle.location}</p>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {vehicle.mileage && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">🛣️</span>
                <span className="font-lato text-gray-700">{formatMileage(vehicle.mileage)} miles</span>
              </div>
            )}
            
            {vehicle.battery_capacity && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">🔋</span>
                <span className="font-lato text-gray-700">{vehicle.battery_capacity} kWh</span>
              </div>
            )}
            
            {vehicle.range && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">⚡</span>
                <span className="font-lato text-gray-700">{vehicle.range} miles</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(vehicle.id)}
          >
            View Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onContact?.(vehicle.id)}
          >
            Contact Seller
          </Button>
        </CardFooter>
      </Card>
    )
  }
)
VehicleCard.displayName = "VehicleCard"

export { VehicleCard }
