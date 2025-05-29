import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    console.log('Auth userId:', userId); // Debug log
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Supabase client inside the function to avoid build-time issues
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Supabase environment variables not available');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, try to get user's profile - use maybeSingle() to avoid error if no profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('verification_status, can_create_listings, user_type, email, full_name')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ 
        error: 'Failed to fetch profile' 
      }, { status: 500 });
    }

    // If no profile exists, create one first
    if (!profile) {
      console.log('Creating new profile for userId:', userId); // Debug log
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          email: '',
          full_name: '',
          avatar_url: '',
          user_type: 'individual',
          verification_status: 'pending',
          can_create_listings: false
        })
        .select('verification_status, can_create_listings, user_type, email, full_name')
        .single();

      if (createError) {
        console.error('Profile creation error:', createError);
        return NextResponse.json({ 
          error: 'Failed to create profile' 
        }, { status: 500 });
      }

      console.log('New profile created:', newProfile); // Debug log

      // Return the newly created profile with no verification record
      return NextResponse.json({
        profile: newProfile,
        verification: null,
        needsVerification: true
      });
    }

    // Get detailed verification information
    const { data: verification, error: verificationError } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('user_id', userId)
      .single();

    // If no verification record exists, user hasn't started verification
    if (verificationError && verificationError.code === 'PGRST116') {
      return NextResponse.json({
        profile,
        verification: null,
        needsVerification: true
      });
    }

    if (verificationError) {
      console.error('Verification fetch error:', verificationError);
      return NextResponse.json({ 
        error: 'Failed to fetch verification status' 
      }, { status: 500 });
    }

    return NextResponse.json({
      profile,
      verification,
      needsVerification: !profile.can_create_listings
    });

  } catch (error) {
    console.error('Verification status error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
