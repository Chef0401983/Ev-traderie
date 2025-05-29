// Vehicle types and interfaces for the EV-trader marketplace

export type VehicleStatus = 'available' | 'pending' | 'sold';
export type SellerType = 'individual' | 'dealership';

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: Date;
}

// Simplified Vehicle interface matching the actual database schema
export interface Vehicle {
  id: string;
  seller_id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  battery_capacity?: number; // in kWh
  range?: number; // in miles/km
  charging_speed?: number; // in kW
  color?: string;
  condition?: string;
  description?: string;
  location?: string;
  is_featured: boolean;
  is_sold: boolean;
  listing_purchase_id?: string;
  featured_until?: Date;
  bump_ups_used: number;
  created_at: Date;
  updated_at: Date;
  
  // Related data from joins
  vehicle_images?: VehicleImage[];
  profiles?: {
    full_name: string;
    user_type: SellerType;
  };
}

// For backward compatibility, create a type that includes computed fields
export interface VehicleWithComputed extends Vehicle {
  // Computed fields for display
  primaryImage?: VehicleImage;
  sellerName?: string;
  sellerType?: SellerType;
}

// Common EV makes for dropdown selection
export const evMakes = [
  'Tesla',
  'Nissan',
  'Hyundai',
  'Kia',
  'Volkswagen',
  'BMW',
  'Audi',
  'Mercedes-Benz',
  'Polestar',
  'Renault',
  'MG',
  'Jaguar',
  'Porsche',
  'Ford',
  'Skoda',
  'Volvo',
  'Peugeot',
  'Citroen',
  'MINI',
  'Other'
];

// Common body types for dropdown selection
export const bodyTypes = [
  'Sedan',
  'Hatchback',
  'SUV',
  'Crossover',
  'Estate',
  'Coupe',
  'Convertible',
  'MPV',
  'Van',
  'Other'
];

// Irish counties for location dropdown
export const irishCounties = [
  'Antrim',
  'Armagh',
  'Carlow',
  'Cavan',
  'Clare',
  'Cork',
  'Derry',
  'Donegal',
  'Down',
  'Dublin',
  'Fermanagh',
  'Galway',
  'Kerry',
  'Kildare',
  'Kilkenny',
  'Laois',
  'Leitrim',
  'Limerick',
  'Longford',
  'Louth',
  'Mayo',
  'Meath',
  'Monaghan',
  'Offaly',
  'Roscommon',
  'Sligo',
  'Tipperary',
  'Tyrone',
  'Waterford',
  'Westmeath',
  'Wexford',
  'Wicklow'
];
