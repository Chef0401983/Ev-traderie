export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET public system settings
export async function GET(request: NextRequest) {
  try {
    // Create Supabase service client inside function (following best practice from previous fixes)
    const adminSupabase = createServiceRoleClient();

    // Get requested settings from query params
    const searchParams = request.nextUrl.searchParams;
    const keys = searchParams.get('keys');
    
    let query = adminSupabase.from('system_settings').select('*');
    
    // Filter by specific keys if provided
    if (keys) {
      const keyArray = keys.split(',');
      query = query.in('key', keyArray);
    }
    
    const { data: settings, error } = await query;

    if (error) {
      console.error('Error fetching settings:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    // Define the interface for system settings
    interface SystemSetting {
      id: string;
      key: string;
      value: any;
      description: string;
      created_at: string;
      updated_at: string;
    }

    // Transform to a more usable format
    const formattedSettings = (settings as SystemSetting[]).reduce((acc: Record<string, any>, setting: SystemSetting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    return NextResponse.json({ settings: formattedSettings });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

