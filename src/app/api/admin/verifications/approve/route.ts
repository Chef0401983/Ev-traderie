export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationStatusEmail } from '@/lib/email/helpers';

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

    const { verificationId, action, reason } = await request.json();

    if (!verificationId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the verification details
    const { data: verification, error: verificationError } = await supabase
      .from('user_verifications')
      .select(`
        user_id,
        profiles!inner (
          email,
          full_name
        )
      `)
      .eq('id', verificationId)
      .single();

    if (verificationError || !verification) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
    }

    // Update verification status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const { error: updateError } = await supabase
      .from('user_verifications')
      .update({
        status: newStatus,
        verified_by: userId,
        verified_at: new Date().toISOString(),
        rejection_reason: action === 'reject' ? reason : null
      })
      .eq('id', verificationId);

    if (updateError) {
      console.error('Error updating verification:', updateError);
      return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 });
    }

    // Update profile verification status and listing permissions
    if (action === 'approve') {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          verification_status: 'approved',
          can_create_listings: true
        })
        .eq('user_id', verification.user_id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
    } else {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          verification_status: 'rejected',
          can_create_listings: false
        })
        .eq('user_id', verification.user_id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
    }

    // Log admin activity
    await supabase
      .from('admin_activities')
      .insert({
        admin_id: userId,
        action_type: 'user_verification',
        target_type: 'verification',
        target_id: verificationId,
        action: action === 'approve' ? 'approved' : 'rejected',
        reason: reason || null,
        metadata: {
          user_id: verification.user_id,
          admin_name: profile.full_name
        }
      });

    // Send email notification
    const userProfile = verification.profiles as any;
    if (userProfile?.email && userProfile?.full_name) {
      await sendVerificationStatusEmail(
        userProfile.email,
        userProfile.full_name,
        action === 'approve',
        reason
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in verification approval API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

