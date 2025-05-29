import { useState } from 'react';
import { evMakes, bodyTypes, irishCounties } from '@/lib/models/vehicle';
import { Button } from '@/components/ui/button';

interface FilterValues {
  make: string[];
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
  mileageMax: string;
  bodyType: string[];
  county: string[];
  rangeMin: string;
  batteryCapacityMin: string;
}

interface VehicleFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: Partial<FilterValues>;
  totalResults: number;
}

export default function VehicleFilters({ 
  onFilterChange, 
  initialFilters = {}, 
  totalResults 
}: VehicleFiltersProps) {
  const currentYear = new Date().getFullYear();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    make: initialFilters.make || [],
    priceMin: initialFilters.priceMin || '',
    priceMax: initialFilters.priceMax || '',
    yearMin: initialFilters.yearMin || '',
    yearMax: initialFilters.yearMax || '',
    mileageMax: initialFilters.mileageMax || '',
    bodyType: initialFilters.bodyType || [],
    county: initialFilters.county || [],
    rangeMin: initialFilters.rangeMin || '',
    batteryCapacityMin: initialFilters.batteryCapacityMin || '',
  });
  
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'make' | 'bodyType' | 'county'
  ) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    
    setFilters(prev => {
      const newValues = isChecked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value);
      
      return { ...prev, [field]: newValues };
    });
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const applyFilters = () => {
    onFilterChange(filters);
  };
  
  const resetFilters = () => {
    const emptyFilters: FilterValues = {
      make: [],
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      mileageMax: '',
      bodyType: [],
      county: [],
      rangeMin: '',
      batteryCapacityMin: '',
    };
    
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 font-poppins">Filters</h3>
        <button 
          type="button" 
          onClick={toggleExpand}
          className="md:hidden text-sm text-primary hover:text-primary/80 flex items-center font-lato transition-colors"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
          <svg 
            className={`ml-1 h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Price Range */}
        <div>
          <h3 className="text-sm font-medium mb-2">Price Range (€)</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                name="priceMin"
                placeholder="Min"
                value={filters.priceMin}
                onChange={handleInputChange}
                className="input text-sm py-1.5"
              />
            </div>
            <div>
              <input
                type="number"
                name="priceMax"
                placeholder="Max"
                value={filters.priceMax}
                onChange={handleInputChange}
                className="input text-sm py-1.5"
              />
            </div>
          </div>
        </div>
        
        {/* Year Range */}
        <div>
          <h3 className="text-sm font-medium mb-2">Year</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <select
                name="yearMin"
                value={filters.yearMin}
                onChange={handleInputChange}
                className="input text-sm py-1.5"
              >
                <option value="">Min Year</option>
                {Array.from({ length: 25 }, (_, i) => currentYear - 24 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="yearMax"
                value={filters.yearMax}
                onChange={handleInputChange}
                className="input text-sm py-1.5"
              >
                <option value="">Max Year</option>
                {Array.from({ length: 25 }, (_, i) => currentYear - 24 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Make */}
        <div>
          <h3 className="text-sm font-medium mb-2">Make</h3>
          <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
            {evMakes.map(make => (
              <div key={make} className="flex items-center">
                <input
                  type="checkbox"
                  id={`make-${make}`}
                  value={make}
                  checked={filters.make.includes(make)}
                  onChange={e => handleCheckboxChange(e, 'make')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor={`make-${make}`} className="ml-2 text-sm text-gray-700">
                  {make}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Body Type */}
        <div>
          <h3 className="text-sm font-medium mb-2">Body Type</h3>
          <div className="space-y-1">
            {bodyTypes.slice(0, 6).map(type => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`bodyType-${type}`}
                  value={type}
                  checked={filters.bodyType.includes(type)}
                  onChange={e => handleCheckboxChange(e, 'bodyType')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor={`bodyType-${type}`} className="ml-2 text-sm text-gray-700">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* EV-specific filters */}
        <div>
          <h3 className="text-sm font-medium mb-2">EV Specifications</h3>
          <div className="space-y-2">
            <div>
              <label htmlFor="rangeMin" className="block text-xs text-gray-500 mb-1">
                Minimum Range (km)
              </label>
              <select
                id="rangeMin"
                name="rangeMin"
                value={filters.rangeMin}
                onChange={handleInputChange}
                className="input text-sm py-1.5"
              >
                <option value="">Any Range</option>
                <option value="200">200+ km</option>
                <option value="300">300+ km</option>
                <option value="400">400+ km</option>
                <option value="500">500+ km</option>
                <option value="600">600+ km</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="batteryCapacityMin" className="block text-xs text-gray-500 mb-1">
                Minimum Battery Capacity (kWh)
              </label>
              <select
                id="batteryCapacityMin"
                name="batteryCapacityMin"
                value={filters.batteryCapacityMin}
                onChange={handleInputChange}
                className="input text-sm py-1.5"
              >
                <option value="">Any Capacity</option>
                <option value="40">40+ kWh</option>
                <option value="60">60+ kWh</option>
                <option value="80">80+ kWh</option>
                <option value="100">100+ kWh</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Mileage */}
        <div>
          <h3 className="text-sm font-medium mb-2">Maximum Mileage</h3>
          <select
            name="mileageMax"
            value={filters.mileageMax}
            onChange={handleInputChange}
            className="input text-sm py-1.5"
          >
            <option value="">Any Mileage</option>
            <option value="10000">Under 10,000 km</option>
            <option value="30000">Under 30,000 km</option>
            <option value="50000">Under 50,000 km</option>
            <option value="100000">Under 100,000 km</option>
            <option value="150000">Under 150,000 km</option>
          </select>
        </div>
        
        {/* Location */}
        <div>
          <h3 className="text-sm font-medium mb-2">Location</h3>
          <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
            {irishCounties.map(county => (
              <div key={county} className="flex items-center">
                <input
                  type="checkbox"
                  id={`county-${county}`}
                  value={county}
                  checked={filters.county.includes(county)}
                  onChange={e => handleCheckboxChange(e, 'county')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor={`county-${county}`} className="ml-2 text-sm text-gray-700">
                  {county}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Filter Actions */}
        <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
          <Button onClick={applyFilters} className="w-full py-2">
            Apply Filters
          </Button>
          
          <Button onClick={resetFilters} className="text-sm w-full py-2">
            Reset All Filters
          </Button>
        </div>
        
        <div className="pt-2 text-center">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-secondary">{totalResults}</span> results
          </p>
        </div>
      </div>
    </div>
  );
}
