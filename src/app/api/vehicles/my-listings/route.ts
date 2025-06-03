export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();

    // Get user's vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select(`
        id,
        make,
        model,
        year,
        price,
        approval_status,
        created_at,
        updated_at,
        rejection_reason,
        featured_until,
        bump_ups_used
      `)
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (vehiclesError) {
      console.error('Error fetching user vehicles:', vehiclesError);
      return NextResponse.json(
        { error: 'Failed to fetch vehicles' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      vehicles: vehicles || []
    });

  } catch (error) {
    console.error('Error in my-listings endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

