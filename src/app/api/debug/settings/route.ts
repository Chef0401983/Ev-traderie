export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Debug: Testing settings API...');
    
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Debug: Environment variables check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseServiceKey?.length || 0
    });
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasServiceKey: !!supabaseServiceKey
        }
      }, { status: 500 });
    }
    
    const adminSupabase = createServiceRoleClient();
    console.log('Debug: Supabase client created');

    // Test basic connection
    const { data: testData, error: testError } = await adminSupabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
      
    console.log('Debug: Test query result:', { testData, testError });

    // Check if system_settings table exists
    const { data: settings, error: settingsError } = await adminSupabase
      .from('system_settings')
      .select('*');

    console.log('Debug: Settings query result:', { 
      settings, 
      settingsError,
      settingsCount: settings?.length || 0
    });

    return NextResponse.json({ 
      success: true,
      environment: {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey
      },
      testQuery: {
        data: testData,
        error: testError
      },
      settings: {
        data: settings,
        error: settingsError,
        count: settings?.length || 0
      }
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ 
      error: 'Debug API failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

