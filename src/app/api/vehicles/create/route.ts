export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== VEHICLE CREATION API CALLED ===');
    console.log('Request URL:', request.url);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const { userId } = await auth();
    
    console.log('Auth result - userId:', userId);
    
    if (!userId) {
      console.log('❌ No userId found - user not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', userId);
    
    const formData = await request.formData();
    
    // Enhanced logging for debugging
    console.log('=== VEHICLE CREATION DEBUG ===');
    console.log('User ID:', userId);
    console.log('Form data keys:', Array.from(formData.keys()));
    console.log('Form data entries:');
    Array.from(formData.entries()).forEach(([key, value]) => {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });
    
    // Extract form fields with proper nested field handling
    const make = formData.get('make') as string;
    const model = formData.get('model') as string;
    const year = parseInt(formData.get('year') as string);
    const price = parseFloat(formData.get('price') as string);
    const mileage = parseInt(formData.get('mileage') as string) || 0;
    const title = formData.get('title') as string || '';
    const description = formData.get('description') as string || '';
    const bodyType = formData.get('bodyType') as string || '';
    const exteriorColor = formData.get('exteriorColor') as string || '';
    const interiorColor = formData.get('interiorColor') as string || '';
    const transmission = formData.get('transmission') as string || '';
    const drivetrain = formData.get('drivetrain') as string || '';
    const features = formData.get('features') as string || '';
    const condition = formData.get('condition') as string || 'used';
    
    // Extract nested EV specifications
    const batteryCapacity = parseFloat(formData.get('evSpecifications.batteryCapacity') as string) || null;
    const range = parseInt(formData.get('evSpecifications.range') as string) || null;
    const standardChargingTime = parseFloat(formData.get('evSpecifications.chargingTime.standard') as string) || null;
    const fastChargeTime = parseInt(formData.get('evSpecifications.chargingTime.fastCharge') as string) || null;
    const motorPower = parseInt(formData.get('evSpecifications.motorPower') as string) || null;
    const acceleration = parseFloat(formData.get('evSpecifications.acceleration') as string) || null;
    const topSpeed = parseInt(formData.get('evSpecifications.topSpeed') as string) || null;
    const efficiency = parseInt(formData.get('evSpecifications.efficiency') as string) || null;
    
    // Extract location
    const county = formData.get('location.county') as string || '';
    const city = formData.get('location.city') as string || '';
    const eircode = formData.get('location.eircode') as string || '';
    const location = `${city}, ${county} ${eircode}`.trim();
    
    const sellerId = formData.get('sellerId') as string;
    const sellerType = formData.get('sellerType') as string;
    const planId = formData.get('planId') as string;
    const planPrice = parseFloat(formData.get('planPrice') as string) || 0;
    
    console.log('Extracted vehicle data:', {
      make, model, year, price, mileage, title, description, bodyType,
      exteriorColor, interiorColor, transmission, drivetrain, features,
      batteryCapacity, range, standardChargingTime, fastChargeTime,
      motorPower, acceleration, topSpeed, efficiency, condition, location,
      sellerId, sellerType, planId, planPrice
    });

    // Validate required fields
    if (!make || !model || !year || !price) {
      console.log('Missing required fields:', { make: !!make, model: !!model, year: !!year, price: !!price });
      return NextResponse.json({ 
        error: 'Missing required fields: make, model, year, and price are required.',
        received: { make: !!make, model: !!model, year: !!year, price: !!price }
      }, { status: 400 });
    }

    // Get user profile - FIX: use user_id instead of id
    const supabase = createServerClient();
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      console.log('Profile error:', profileError);
      return NextResponse.json({ 
        error: 'User profile not found. Please complete your profile first.' 
      }, { status: 400 });
    }

    console.log('User profile found:', profile.email);

    // Handle image uploads
    const images = formData.getAll('images') as File[];
    console.log(`Processing ${images.length} images`);
    
    const imageUrls: string[] = [];
    
    if (images.length > 0) {
      const bucketName = 'vehicle_images';
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        console.log(`Uploading image ${i + 1}:`, image.name, image.size, image.type);
        
        const fileExt = image.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${i}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, image);

        if (uploadError) {
          console.error(`Error uploading image ${i + 1}:`, uploadError);
          return NextResponse.json({ 
            error: `Failed to upload image ${i + 1}: ${uploadError.message}` 
          }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
        console.log(`Image ${i + 1} uploaded successfully:`, publicUrl);
      }
    }

    console.log('All images uploaded successfully. URLs:', imageUrls);

    // Create vehicle listing - match actual database schema
    const vehicleData = {
      seller_id: userId,
      title: title || `${year} ${make} ${model}`,
      make,
      model,
      year,
      price,
      mileage,
      battery_capacity: batteryCapacity,
      range,
      charging_speed: fastChargeTime, // Use fast charge time as charging speed
      color: exteriorColor,
      condition,
      description,
      location,
      is_featured: false,
      is_sold: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Creating vehicle with data:', vehicleData);

    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .insert([vehicleData])
      .select()
      .single();

    if (vehicleError) {
      console.error('Error creating vehicle:', vehicleError);
      return NextResponse.json(
        { error: 'Failed to create vehicle listing', details: vehicleError.message },
        { status: 500 }
      );
    }

    console.log('Vehicle created successfully:', vehicle);

    // Insert vehicle images if any were uploaded
    if (imageUrls.length > 0) {
      const imageData = imageUrls.map((url, index) => ({
        vehicle_id: vehicle.id,
        image_url: url,
        is_primary: index === 0 // First image is primary by default
      }));

      console.log('Inserting vehicle images:', imageData);

      const { error: imageError } = await supabase
        .from('vehicle_images')
        .insert(imageData);

      if (imageError) {
        console.error('Error inserting vehicle images:', imageError);
        // Don't fail the whole request if images fail, just log the error
        console.log('Vehicle created but images failed to save');
      } else {
        console.log('Vehicle images inserted successfully');
      }
    }

    return NextResponse.json(
      { 
        message: 'Vehicle listing created successfully', 
        vehicle: vehicle,
        imageCount: imageUrls.length
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in vehicle creation:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred while creating the vehicle listing.' 
    }, { status: 500 });
  }
}

