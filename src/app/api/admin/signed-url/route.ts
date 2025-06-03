export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const adminSupabase = createServiceRoleClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (!profile || !profile.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { filePath, bucket } = await request.json();

    if (!filePath || !bucket) {
      return NextResponse.json({ 
        error: 'File path and bucket are required' 
      }, { status: 400 });
    }

    // Create signed URL for admin access (expires in 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await adminSupabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600); // 1 hour

    if (signedUrlError) {
      console.error('Failed to create signed URL:', signedUrlError);
      return NextResponse.json({ 
        error: `Failed to create signed URL: ${signedUrlError.message}` 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      signedUrl: signedUrlData.signedUrl 
    });

  } catch (error) {
    console.error('Signed URL API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

