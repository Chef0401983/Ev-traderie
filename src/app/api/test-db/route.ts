import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Create a direct Supabase client for testing (bypassing auth)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Missing Supabase configuration',
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey
      }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test database connection
    console.log('Testing database connection...');
    
    // Test a simple select to ensure we can read from the table
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1);
    
    if (vehiclesError) {
      console.error('Error querying vehicles:', vehiclesError);
      return NextResponse.json({ 
        error: 'Failed to query vehicles table', 
        details: vehiclesError.message,
        code: vehiclesError.code
      }, { status: 500 });
    }
    
    // Check profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('Error querying profiles:', profilesError);
      return NextResponse.json({ 
        error: 'Failed to query profiles table', 
        details: profilesError.message,
        code: profilesError.code
      }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Database test successful',
      vehiclesCount: vehicles?.length || 0,
      profilesCount: profiles?.length || 0,
      sampleVehicle: vehicles?.[0] || null,
      sampleProfile: profiles?.[0] || null
    });
    
  } catch (error) {
    console.error('Unexpected error in database test:', error);
    return NextResponse.json({ 
      error: 'Unexpected error during database test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
