import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await auth();
    const { userId } = authResult;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminSupabase = createServiceRoleClient();

    // Get ALL profiles to see what's in the database
    const { data: allProfiles, error: allProfilesError } = await adminSupabase
      .from('profiles')
      .select('*');

    console.log('All profiles in database:', allProfiles);
    console.log('Current Clerk user ID:', userId);

    // Check current profile by user_id
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    console.log('Profile lookup result:', { profile, profileError, userId });

    // Also check if there's a profile with email matching fullerjustin83@gmail.com
    const { data: emailProfile, error: emailError } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('email', 'fullerjustin83@gmail.com')
      .single();

    console.log('Email profile lookup:', { emailProfile, emailError });

    return NextResponse.json({ 
      clerkUserId: userId,
      profileByUserId: profile,
      profileError: profileError,
      profileByEmail: emailProfile,
      emailError: emailError,
      allProfiles: allProfiles,
      allProfilesError: allProfilesError
    });

  } catch (error) {
    console.error('Error in profile debug:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
