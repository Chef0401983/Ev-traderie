export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendListingStatusUpdate } from '@/lib/email/listing-helpers';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { vehicleId, status, rejectionReason, adminNote } = body;

    if (!vehicleId || !status) {
      return NextResponse.json(
        { error: 'Vehicle ID and status are required' },
        { status: 400 }
      );
    }

    // Valid status values
    const validStatuses = [
      'draft',
      'pending_approval',
      'approved',
      'rejected',
      'suspended',
      'expired',
      'sold'
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update vehicle status
    const updateData: any = {
      approval_status: status,
      updated_at: new Date().toISOString()
    };

    // Add rejection reason if provided and status is rejected
    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const { data: vehicle, error: updateError } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', vehicleId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating vehicle status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update vehicle status' },
        { status: 500 }
      );
    }

    // Send email notification to seller
    const emailResult = await sendListingStatusUpdate(
      vehicleId,
      status,
      adminNote || rejectionReason
    );

    if (!emailResult.success) {
      console.warn('Failed to send status update email:', emailResult.error);
      // Don't fail the request if email fails
    }

    // Log admin activity
    try {
      await supabase
        .from('admin_activity_log')
        .insert({
          admin_id: userId,
          action: 'update_vehicle_status',
          target_type: 'vehicle',
          target_id: vehicleId,
          details: {
            old_status: 'unknown', // We could fetch this if needed
            new_status: status,
            rejection_reason: rejectionReason,
            admin_note: adminNote
          },
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.warn('Failed to log admin activity:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      vehicle,
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Error in vehicle status update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('vehicles')
      .select(`
        *,
        profiles!vehicles_seller_id_fkey(email, full_name, user_type)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: vehicles, error: vehiclesError } = await query;

    if (vehiclesError) {
      console.error('Error fetching vehicles:', vehiclesError);
      return NextResponse.json(
        { error: 'Failed to fetch vehicles' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('vehicles')
      .select('id', { count: 'exact', head: true });

    if (status) {
      countQuery = countQuery.eq('status', status);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Error counting vehicles:', countError);
      return NextResponse.json(
        { error: 'Failed to count vehicles' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      vehicles,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching vehicles for admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

