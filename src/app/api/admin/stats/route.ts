import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Check authentication - await auth() properly for Next.js 15
    const authResult = await auth();
    const { userId } = authResult;

    console.log('Admin check - Clerk User ID:', userId);

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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get pending verifications count
    const { count: pendingVerifications } = await supabase
      .from('user_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'submitted');

    // Get pending listings count
    const { count: pendingListings } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('approval_status', 'pending');

    // Get total users count
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get total listings count
    const { count: totalListings } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true });

    // Get recent admin activities
    const { data: recentActivities } = await supabase
      .from('admin_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      pendingVerifications: pendingVerifications || 0,
      pendingListings: pendingListings || 0,
      totalUsers: totalUsers || 0,
      totalListings: totalListings || 0,
      recentActivities: recentActivities || []
    });
  } catch (error) {
    console.error('Error in admin stats API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
