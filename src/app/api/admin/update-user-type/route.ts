import { auth, clerkClient } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

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
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { targetUserId, userType } = await request.json();

    if (!targetUserId || !userType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update user type in Clerk
    await clerkClient.users.updateUserMetadata(targetUserId, {
      publicMetadata: { userType }
    });

    // Update user type in Supabase
    await supabase
      .from('profiles')
      .update({ user_type: userType })
      .eq('user_id', targetUserId);

    return NextResponse.json({ 
      success: true, 
      message: `User type updated to ${userType}` 
    });
  } catch (error) {
    console.error('Error updating user type:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
