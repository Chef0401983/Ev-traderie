export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client inside the function to avoid build-time issues
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Supabase environment variables not available');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { searchParams } = new URL(request.url);
    const planType = searchParams.get('type') || 'private';

    const { data: plans, error } = await supabase
      .from('listing_plans')
      .select('*')
      .eq('plan_type', planType)
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching listing plans:', error);
      return NextResponse.json(
        { error: 'Failed to fetch listing plans' },
        { status: 500 }
      );
    }

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error in listing-plans API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

