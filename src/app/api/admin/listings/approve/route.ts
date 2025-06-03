export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendListingStatusEmail } from '@/lib/email/helpers';

export async function POST(request: NextRequest) {
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
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, full_name')
      .eq('user_id', userId)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { listingId, action, reason } = await request.json();

    if (!listingId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the listing details
    const { data: listing, error: listingError } = await supabase
      .from('vehicles')
      .select(`
        id,
        seller_id,
        title,
        profiles!inner (
          email,
          full_name
        )
      `)
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Update listing approval status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const updateData: any = {
      approval_status: newStatus,
      approved_by: userId,
      approved_at: new Date().toISOString()
    };

    if (action === 'reject') {
      updateData.rejection_reason = reason;
    }

    const { error: updateError } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', listingId);

    if (updateError) {
      console.error('Error updating listing:', updateError);
      return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
    }

    // Log admin activity
    await supabase
      .from('admin_activities')
      .insert({
        admin_id: userId,
        action_type: 'listing_approval',
        target_type: 'listing',
        target_id: listingId,
        action: action === 'approve' ? 'approved' : 'rejected',
        reason: reason || null,
        metadata: {
          seller_id: listing.seller_id,
          listing_title: listing.title,
          admin_name: profile.full_name
        }
      });

    // Send email notification
    const sellerProfile = listing.profiles as any;
    if (sellerProfile?.email && sellerProfile?.full_name) {
      await sendListingStatusEmail(
        sellerProfile.email,
        sellerProfile.full_name,
        listing.title,
        action === 'approve',
        reason
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in listing approval API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

