import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  evMakes, 
  bodyTypes, 
  irishCounties, 
  SellerType 
} from '@/lib/models/vehicle';
import VehicleImageUpload from './VehicleImageUpload';

interface VehicleListingFormProps {
  sellerType: SellerType;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function VehicleListingForm({ 
  sellerType, 
  onSubmit, 
  isSubmitting 
}: VehicleListingFormProps) {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  const totalSteps = 4;
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const currentFormData = new FormData(form);
    
    // Collect all form data from all steps
    const allFormData = new FormData();
    
    // Add stored form data from previous steps
    Object.entries(formData).forEach(([key, value]) => {
      allFormData.append(key, value);
    });
    
    // Add current step form data
    Array.from(currentFormData.entries()).forEach(([key, value]) => {
      if (key !== 'images') { // Handle images separately
        allFormData.append(key, value as string);
      }
    });
    
    // Add images with correct field name
    images.forEach((image) => {
      allFormData.append('images', image);
    });
    
    // Add seller information
    allFormData.append('sellerId', user?.id || '');
    allFormData.append('sellerType', sellerType);
    
    // Debug: Log all form data
    console.log('Submitting form data:');
    Array.from(allFormData.entries()).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
    
    onSubmit(allFormData);
  };
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Save current step data before moving to next step
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        const currentFormData = new FormData(form);
        const newFormData = { ...formData };
        
        Array.from(currentFormData.entries()).forEach(([key, value]) => {
          if (key !== 'images') {
            newFormData[key] = value as string;
          }
        });
        
        setFormData(newFormData);
      }
      
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className="card p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">
            {sellerType === 'individual' ? 'List Your Electric Vehicle' : 'Add Vehicle to Inventory'}
          </h2>
          <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="make" className="block text-sm font-medium mb-1">Make *</label>
                <select 
                  id="make" 
                  name="make" 
                  required 
                  className="input"
                >
                  <option value="">Select Make</option>
                  {evMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="model" className="block text-sm font-medium mb-1">Model *</label>
                <input 
                  type="text" 
                  id="model" 
                  name="model" 
                  required 
                  className="input" 
                  placeholder="e.g. Model 3, IONIQ 5"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium mb-1">Year *</label>
                <input 
                  type="number" 
                  id="year" 
                  name="year" 
                  required 
                  min="2000" 
                  max={new Date().getFullYear() + 1} 
                  className="input" 
                  placeholder="e.g. 2023"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Price (€) *</label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  required 
                  min="0" 
                  step="100" 
                  className="input" 
                  placeholder="e.g. 45000"
                />
              </div>
              
              <div>
                <label htmlFor="mileage" className="block text-sm font-medium mb-1">Mileage (km) *</label>
                <input 
                  type="number" 
                  id="mileage" 
                  name="mileage" 
                  required 
                  min="0" 
                  className="input" 
                  placeholder="e.g. 15000"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Listing Title *</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required 
                className="input" 
                placeholder="e.g. 2023 Tesla Model 3 Long Range - Like New"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description *</label>
              <textarea 
                id="description" 
                name="description" 
                required 
                rows={5} 
                className="input" 
                placeholder="Provide a detailed description of your vehicle..."
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bodyType" className="block text-sm font-medium mb-1">Body Type *</label>
                <select 
                  id="bodyType" 
                  name="bodyType" 
                  required 
                  className="input"
                >
                  <option value="">Select Body Type</option>
                  {bodyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="exteriorColor" className="block text-sm font-medium mb-1">Exterior Color *</label>
                <input 
                  type="text" 
                  id="exteriorColor" 
                  name="exteriorColor" 
                  required 
                  className="input" 
                  placeholder="e.g. Pearl White"
                />
              </div>
              
              <div>
                <label htmlFor="interiorColor" className="block text-sm font-medium mb-1">Interior Color *</label>
                <input 
                  type="text" 
                  id="interiorColor" 
                  name="interiorColor" 
                  required 
                  className="input" 
                  placeholder="e.g. Black"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: EV Specifications */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">EV Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="batteryCapacity" className="block text-sm font-medium mb-1">Battery Capacity (kWh) *</label>
                <input 
                  type="number" 
                  id="batteryCapacity" 
                  name="evSpecifications.batteryCapacity" 
                  required 
                  min="0" 
                  step="0.1" 
                  className="input" 
                  placeholder="e.g. 75.0"
                />
              </div>
              
              <div>
                <label htmlFor="range" className="block text-sm font-medium mb-1">Range (km) *</label>
                <input 
                  type="number" 
                  id="range" 
                  name="evSpecifications.range" 
                  required 
                  min="0" 
                  className="input" 
                  placeholder="e.g. 450"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="standardChargingTime" className="block text-sm font-medium mb-1">Standard Charging Time (hours) *</label>
                <input 
                  type="number" 
                  id="standardChargingTime" 
                  name="evSpecifications.chargingTime.standard" 
                  required 
                  min="0" 
                  step="0.1" 
                  className="input" 
                  placeholder="e.g. 8.5"
                />
              </div>
              
              <div>
                <label htmlFor="fastChargingTime" className="block text-sm font-medium mb-1">Fast Charging Time (minutes, 0-80%)</label>
                <input 
                  type="number" 
                  id="fastChargingTime" 
                  name="evSpecifications.chargingTime.fastCharge" 
                  min="0" 
                  className="input" 
                  placeholder="e.g. 30"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="motorPower" className="block text-sm font-medium mb-1">Motor Power (kW) *</label>
                <input 
                  type="number" 
                  id="motorPower" 
                  name="evSpecifications.motorPower" 
                  required 
                  min="0" 
                  className="input" 
                  placeholder="e.g. 225"
                />
              </div>
              
              <div>
                <label htmlFor="acceleration" className="block text-sm font-medium mb-1">Acceleration (0-100 km/h in seconds) *</label>
                <input 
                  type="number" 
                  id="acceleration" 
                  name="evSpecifications.acceleration" 
                  required 
                  min="0" 
                  step="0.1" 
                  className="input" 
                  placeholder="e.g. 5.1"
                />
              </div>
              
              <div>
                <label htmlFor="topSpeed" className="block text-sm font-medium mb-1">Top Speed (km/h) *</label>
                <input 
                  type="number" 
                  id="topSpeed" 
                  name="evSpecifications.topSpeed" 
                  required 
                  min="0" 
                  className="input" 
                  placeholder="e.g. 225"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="efficiency" className="block text-sm font-medium mb-1">Efficiency (Wh/km) *</label>
              <input 
                type="number" 
                id="efficiency" 
                name="evSpecifications.efficiency" 
                required 
                min="0" 
                step="0.1" 
                className="input" 
                placeholder="e.g. 160"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="transmission" className="block text-sm font-medium mb-1">Transmission *</label>
                <select 
                  id="transmission" 
                  name="transmission" 
                  required 
                  className="input"
                >
                  <option value="">Select Transmission</option>
                  <option value="automatic">Automatic</option>
                  <option value="single-speed">Single-speed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="drivetrain" className="block text-sm font-medium mb-1">Drivetrain *</label>
                <select 
                  id="drivetrain" 
                  name="drivetrain" 
                  required 
                  className="input"
                >
                  <option value="">Select Drivetrain</option>
                  <option value="fwd">Front-Wheel Drive (FWD)</option>
                  <option value="rwd">Rear-Wheel Drive (RWD)</option>
                  <option value="awd">All-Wheel Drive (AWD)</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Features and Location */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Features and Location</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Features</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[
                  'Autopilot', 'Heated Seats', 'Leather Interior', 
                  'Panoramic Roof', 'Navigation System', 'Bluetooth', 
                  'Parking Sensors', 'Rear Camera', 'Keyless Entry',
                  'Climate Control', 'Adaptive Cruise Control', 'Lane Assist',
                  'Premium Sound System', 'Wireless Charging', 'Apple CarPlay',
                  'Android Auto', 'Blind Spot Monitoring', 'Collision Warning'
                ].map(feature => (
                  <div key={feature} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`feature-${feature}`} 
                      name="features" 
                      value={feature} 
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray-700">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Location Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="county" className="block text-sm font-medium mb-1">County *</label>
                  <select 
                    id="county" 
                    name="location.county" 
                    required 
                    className="input"
                  >
                    <option value="">Select County</option>
                    {irishCounties.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">City/Town *</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="location.city" 
                    required 
                    className="input" 
                    placeholder="e.g. Dublin, Cork, Galway"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="eircode" className="block text-sm font-medium mb-1">Eircode</label>
                <input 
                  type="text" 
                  id="eircode" 
                  name="location.eircode" 
                  className="input" 
                  placeholder="e.g. D04 E7R6"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your exact address will not be shown publicly. This helps us show your listing to nearby buyers.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Images and Review */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Images and Final Review</h3>
            
            <VehicleImageUpload
              onImagesChange={setImages}
              maxImages={10}
              className="mb-6"
            />
            
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Final Review</h4>
              <p className="text-sm text-gray-600 mb-4">
                Please review all the information you've provided before submitting your listing.
                Once submitted, your listing will be reviewed and published on EV-Trader.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-blue-800">Important Information</h5>
                    <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
                      <li>Ensure all vehicle details are accurate and complete</li>
                      <li>High-quality images will help your listing stand out</li>
                      <li>Be responsive to inquiries to increase your chances of selling</li>
                      <li>You can edit your listing after submission if needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || images.length === 0}
              className={`btn-primary ${(isSubmitting || images.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Listing'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
