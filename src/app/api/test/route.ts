export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Simple test endpoint to verify Supabase connection and system_settings table
export async function GET(request: NextRequest) {
  try {
    const adminSupabase = createServiceRoleClient();
    
    // Check if system_settings table exists and has data
    const { data, error } = await adminSupabase
      .from('system_settings')
      .select('*');
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        error: 'Database error', 
        details: error,
        message: 'Failed to query system_settings table'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'System settings table is accessible',
      count: data?.length || 0,
      data: data || []
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      message: 'An unexpected error occurred',
      details: error
    }, { status: 500 });
  }
}

