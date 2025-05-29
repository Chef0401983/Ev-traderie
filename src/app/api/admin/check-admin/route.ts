import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    console.log('Admin check - Clerk User ID:', userId);

    if (!userId) {
      return NextResponse.json({ isAdmin: false, error: 'No user ID' }, { status: 401 });
    }

    // Create Supabase client inside the function to avoid build-time issues
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Supabase environment variables not available');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is admin in the database
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin, admin_role')
      .eq('user_id', userId)
      .single();

    console.log('Admin check - Profile found:', profile);
    console.log('Admin check - Error:', error);

    if (error) {
      console.error('Error checking admin status:', error);
      return NextResponse.json({ 
        isAdmin: false, 
        error: error.message,
        userId: userId 
      }, { status: 500 });
    }

    return NextResponse.json({
      isAdmin: profile?.is_admin || false,
      adminRole: profile?.admin_role || null,
      userId: userId,
      profileFound: !!profile
    });
  } catch (error) {
    console.error('Error in check-admin API:', error);
    return NextResponse.json({ isAdmin: false, error: 'Internal server error' }, { status: 500 });
  }
}
