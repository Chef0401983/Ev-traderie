export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = createServerClient();

    // Build query with filters
    let query = supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images(image_url, is_primary),
        profiles!vehicles_seller_id_fkey(full_name, user_type)
      `)
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false });

    // Apply filters
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const location = searchParams.get('location');
    const condition = searchParams.get('condition');

    if (make) {
      query = query.ilike('make', `%${make}%`);
    }
    if (model) {
      query = query.ilike('model', `%${model}%`);
    }
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }
    if (minYear) {
      query = query.gte('year', parseInt(minYear));
    }
    if (maxYear) {
      query = query.lte('year', parseInt(maxYear));
    }
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    if (condition) {
      query = query.eq('condition', condition);
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1);

    const { data: vehicles, error } = await query;

    if (error) {
      console.error('Error fetching vehicles:', error);
      return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('approval_status', 'approved');

    return NextResponse.json({
      vehicles: vehicles || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in vehicles API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

