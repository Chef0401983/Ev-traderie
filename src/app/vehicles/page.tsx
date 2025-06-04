"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleFilters from '@/components/vehicles/VehicleFilters';
import VehicleSearch from '@/components/vehicles/VehicleSearch';
import { Vehicle } from '@/lib/models/vehicle';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import StandardLayout from '@/components/layout/StandardLayout';

export default function VehiclesPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } | Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Handle both Promise and non-Promise searchParams
  const getSearchParams = () => {
    if (searchParams && typeof searchParams === 'object' && 'then' in searchParams) {
      // It's a Promise, need to handle it differently
      return {};
    }
    return searchParams as { [key: string]: string | string[] | undefined };
  };

  const resolvedSearchParams = getSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('newest');
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(
    typeof resolvedSearchParams.searchTerm === 'string' ? resolvedSearchParams.searchTerm : ''
  );
  const [filters, setFilters] = useState({});

  // Handle Promise-based searchParams
  useEffect(() => {
    if (searchParams && typeof searchParams === 'object' && 'then' in searchParams) {
      (searchParams as Promise<{ [key: string]: string | string[] | undefined }>).then((params) => {
        if (params.searchTerm && typeof params.searchTerm === 'string') {
          setSearchTerm(params.searchTerm);
        }
      });
    }
  }, [searchParams]);

  // Fetch vehicles from API
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add search params from URL
      Object.entries(resolvedSearchParams).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          params.append(key, value);
        }
      });
      
      // Add filters if provided
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, String(value));
          }
        });
      }

      const response = await fetch(`/api/vehicles?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      
      const data = await response.json();
      
      // Use vehicles directly from the database
      setVehicles(data.vehicles || []);
      setFilteredVehicles(data.vehicles || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterVehicles(term, filters);
  };

  // Handle filters - updated to work with FilterValues interface
  const handleFilters = (newFilters: any) => {
    setFilters(newFilters);
    filterVehicles(searchTerm, newFilters);
  };

  // Filter vehicles based on search term and filters
  const filterVehicles = (searchTerm: string, filters: any) => {
    let filtered = [...vehicles];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.title.toLowerCase().includes(term) ||
        vehicle.make.toLowerCase().includes(term) ||
        vehicle.model.toLowerCase().includes(term) ||
        vehicle.description?.toLowerCase().includes(term)
      );
    }

    // Apply filters based on FilterValues interface
    if (filters.make && filters.make.length > 0) {
      filtered = filtered.filter(vehicle => filters.make.includes(vehicle.make));
    }
    if (filters.priceMin) {
      filtered = filtered.filter(vehicle => vehicle.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(vehicle => vehicle.price <= parseInt(filters.priceMax));
    }
    if (filters.yearMin) {
      filtered = filtered.filter(vehicle => vehicle.year >= parseInt(filters.yearMin));
    }
    if (filters.yearMax) {
      filtered = filtered.filter(vehicle => vehicle.year <= parseInt(filters.yearMax));
    }
    if (filters.mileageMax) {
      filtered = filtered.filter(vehicle => (vehicle.mileage || 0) <= parseInt(filters.mileageMax));
    }
    if (filters.county && filters.county.length > 0) {
      filtered = filtered.filter(vehicle => filters.county.includes(vehicle.location));
    }
    if (filters.rangeMin) {
      filtered = filtered.filter(vehicle => (vehicle.range || 0) >= parseInt(filters.rangeMin));
    }
    if (filters.batteryCapacityMin) {
      filtered = filtered.filter(vehicle => (vehicle.battery_capacity || 0) >= parseInt(filters.batteryCapacityMin));
    }

    setFilteredVehicles(filtered);
  };

  // Sort vehicles
  useEffect(() => {
    let sorted = [...filteredVehicles];
    
    switch (sortOption) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'year-new':
        sorted.sort((a, b) => b.year - a.year);
        break;
      case 'year-old':
        sorted.sort((a, b) => a.year - b.year);
        break;
      case 'mileage-low':
        sorted.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
        break;
      case 'mileage-high':
        sorted.sort((a, b) => (b.mileage || 0) - (a.mileage || 0));
        break;
      default: // newest
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    setFilteredVehicles(sorted);
  }, [sortOption]);

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-white">
          {/* Loading Content */}
          <Container className="py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card p-4">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </StandardLayout>
    );
  }

  if (error) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-white">
          {/* Error Content */}
          <Container className="py-16">
            <div className="text-center max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">
                {error}
              </h1>
              <p className="text-gray-600 mb-6 font-lato">
                We're having trouble loading the vehicles. Please try again.
              </p>
              <Button onClick={() => fetchVehicles()}>
                Try Again
              </Button>
            </div>
          </Container>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      {/* Header */}
      <div className="bg-gradient-primary text-white py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 font-poppins">Browse Electric Vehicles</h1>
            <p className="text-xl font-lato opacity-90">
              Find your perfect electric vehicle from our curated collection
            </p>
          </div>
        </Container>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 border-b">
        <Container className="py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <VehicleSearch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-lato">
                {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
              </span>
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="form-input text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest First</option>
                <option value="year-old">Year: Oldest First</option>
                <option value="mileage-low">Mileage: Low to High</option>
                <option value="mileage-high">Mileage: High to Low</option>
              </select>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <VehicleFilters 
              onFilterChange={handleFilters} 
              totalResults={filteredVehicles.length}
            />
          </div>

          {/* Vehicle Grid */}
          <div className="lg:col-span-3">
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33l-.926-.444C3.06 15.8 1 13.05 1 10a9 9 0 1118 0c0 3.05-2.06 5.8-4.994 6.886l-.926.444z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-poppins">No vehicles found</h3>
                <p className="text-gray-600 font-lato">
                  Try adjusting your search criteria or filters to find more vehicles.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </StandardLayout>
  );
}
