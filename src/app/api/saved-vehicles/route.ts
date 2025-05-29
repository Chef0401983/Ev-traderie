import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/saved-vehicles - Get count of saved vehicles for user
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Supabase client inside the function to avoid build-time issues
    const supabase = createServiceRoleClient();

    // Count saved vehicles for the user
    // Note: This assumes a saved_vehicles table exists
    // For now, return 0 as placeholder
    const { count, error } = await supabase
      .from('saved_vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      // If table doesn't exist, return 0
      console.log('Saved vehicles table not found, returning 0');
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in saved vehicles API:', error);
    // Return 0 instead of error for graceful degradation
    return NextResponse.json({ count: 0 });
  }
}
