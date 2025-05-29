import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET all system settings
export async function GET(request: NextRequest) {
  try {
    // Check authentication - await auth() properly for Next.js 15
    const authResult = await auth();
    const { userId } = authResult;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Admin settings GET - User ID:', userId);

    // Create Supabase client inside function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    const adminSupabase = createServiceRoleClient();

    // Check if user is admin
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('is_admin, admin_role')
      .eq('user_id', userId)
      .single();

    console.log('Profile lookup result:', { profile, profileError });

    if (profileError || !profile || !profile.is_admin) {
      console.log('Access denied - not admin:', { profile, error: profileError });
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch all system settings
    const { data: settings, error } = await adminSupabase
      .from('system_settings')
      .select('*')
      .order('key');

    if (error) {
      console.error('Error fetching settings:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    return NextResponse.json(settings || []);
  } catch (error) {
    console.error('Error in GET /api/admin/settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update a system setting
export async function PUT(request: NextRequest) {
  try {
    // Check authentication - await auth() properly for Next.js 15
    const authResult = await auth();
    const { userId } = authResult;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Admin settings PUT - User ID:', userId);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    const adminSupabase = createServiceRoleClient();

    // Check if user is admin
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('is_admin, admin_role')
      .eq('user_id', userId)
      .single();

    console.log('Profile lookup result for PUT:', { profile, profileError });

    if (profileError || !profile || !profile.is_admin) {
      console.log('Access denied - not admin:', { profile, error: profileError });
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { key, value } = await request.json();

    if (!key) {
      return NextResponse.json({ error: 'Setting key is required' }, { status: 400 });
    }

    console.log('Updating setting:', { key, value });

    // Upsert the setting
    const { data, error } = await adminSupabase
      .from('system_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating setting:', error);
      return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
    }

    console.log('Setting updated successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT /api/admin/settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
