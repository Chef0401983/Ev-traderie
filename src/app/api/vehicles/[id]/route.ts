import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id: vehicleId } = await params;

    // Get vehicle details with seller information
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select(`
        *,
        profiles!vehicles_seller_id_fkey(email, full_name, user_type),
        vehicle_images(*)
      `)
      .eq('id', vehicleId)
      .eq('approval_status', 'approved') // Only show approved vehicles publicly
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ vehicle });

  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { id: vehicleId } = await params;

    // Check if vehicle exists and belongs to user
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('id, seller_id, make, model, year')
      .eq('id', vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    if (vehicle.seller_id !== userId) {
      return NextResponse.json(
        { error: 'You can only delete your own vehicles' },
        { status: 403 }
      );
    }

    // Delete related records first (cascade delete)
    
    // Delete vehicle images
    const { error: imagesError } = await supabase
      .from('vehicle_images')
      .delete()
      .eq('vehicle_id', vehicleId);

    if (imagesError) {
      console.error('Error deleting vehicle images:', imagesError);
    }

    // Delete saved vehicles (favorites)
    const { error: savedError } = await supabase
      .from('saved_vehicles')
      .delete()
      .eq('vehicle_id', vehicleId);

    if (savedError) {
      console.error('Error deleting saved vehicles:', savedError);
    }

    // Delete messages related to this vehicle
    const { error: messagesError } = await supabase
      .from('messages')
      .delete()
      .eq('vehicle_id', vehicleId);

    if (messagesError) {
      console.error('Error deleting messages:', messagesError);
    }

    // Finally delete the vehicle
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);

    if (deleteError) {
      console.error('Error deleting vehicle:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete vehicle' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { id: vehicleId } = await params;
    const body = await request.json();

    // Check if vehicle exists and belongs to user
    const { data: existingVehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('id, seller_id, approval_status')
      .eq('id', vehicleId)
      .single();

    if (vehicleError || !existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    if (existingVehicle.seller_id !== userId) {
      return NextResponse.json(
        { error: 'You can only edit your own vehicles' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {
      ...body,
      updated_at: new Date().toISOString()
    };

    // If vehicle was rejected and is being updated, reset status to pending
    if (existingVehicle.approval_status === 'rejected') {
      updateData.approval_status = 'pending_approval';
      updateData.rejection_reason = null;
    }

    // Update vehicle
    const { data: vehicle, error: updateError } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', vehicleId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating vehicle:', updateError);
      return NextResponse.json(
        { error: 'Failed to update vehicle' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle
    });

  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
