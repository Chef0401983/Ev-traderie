export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client inside function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all users with their details
    const { data: users, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_verifications (
          id,
          status,
          created_at
        ),
        vehicles (
          id
        ),
        dealership_profiles (
          dealership_name,
          website
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the data to include counts
    const transformedUsers = users?.map(user => ({
      ...user,
      vehicle_count: user.vehicles?.length || 0,
      vehicles: undefined // Remove the array, just keep the count
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userIdToDelete = searchParams.get('userId');

    if (!userIdToDelete) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Don't allow admin to delete themselves
    if (userIdToDelete === userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Delete user and all related data
    const { error } = await supabase.rpc('delete_user_cascade', {
      p_user_id: userIdToDelete
    });

    if (error) {
      // If the RPC doesn't exist, do manual cascade delete
      if (error.code === 'P0001' || error.message.includes('function')) {
        // Manual cascade delete
        await supabase.from('messages').delete()
          .or(`sender_id.eq.${userIdToDelete},recipient_id.eq.${userIdToDelete}`);
        
        await supabase.from('saved_vehicles').delete()
          .eq('user_id', userIdToDelete);
        
        // Get vehicles to delete images
        const { data: vehicles } = await supabase
          .from('vehicles')
          .select('id')
          .eq('seller_id', userIdToDelete);
        
        if (vehicles && vehicles.length > 0) {
          const vehicleIds = vehicles.map(v => v.id);
          await supabase.from('vehicle_images').delete()
            .in('vehicle_id', vehicleIds);
        }
        
        await supabase.from('vehicles').delete()
          .eq('seller_id', userIdToDelete);
        
        await supabase.from('user_verifications').delete()
          .eq('user_id', userIdToDelete);
        
        await supabase.from('dealership_profiles').delete()
          .eq('user_id', userIdToDelete);
        
        await supabase.from('listing_purchases').delete()
          .eq('user_id', userIdToDelete);
        
        await supabase.from('user_subscriptions').delete()
          .eq('user_id', userIdToDelete);
        
        await supabase.from('profiles').delete()
          .eq('user_id', userIdToDelete);
      } else {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Log admin activity
    await supabase
      .from('admin_activities')
      .insert({
        admin_id: userId,
        action_type: 'user_deletion',
        action: 'deleted',
        target_type: 'user',
        target_id: userIdToDelete,
        metadata: { deleted_user_id: userIdToDelete }
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

