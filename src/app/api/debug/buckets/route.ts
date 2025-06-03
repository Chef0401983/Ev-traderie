export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Use service role key to bypass RLS for debugging
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      buckets: buckets?.map(b => ({ name: b.name, id: b.id, public: b.public })) || [],
      count: buckets?.length || 0
    });
  } catch (error) {
    console.error('Bucket listing error:', error);
    return NextResponse.json({ error: 'Failed to list buckets' }, { status: 500 });
  }
}

