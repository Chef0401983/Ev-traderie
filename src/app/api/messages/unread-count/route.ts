export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// GET /api/messages/unread-count - Get count of unread messages for user
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Supabase client inside the function to avoid build-time issues
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Supabase environment variables not available');
      return NextResponse.json({ count: 0 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Count unread messages for the user
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error counting unread messages:', error);
      // If table doesn't exist, return 0
      if (error.code === '42P01') {
        return NextResponse.json({ count: 0, info: 'Messages table not yet created' });
      }
      return NextResponse.json({ error: 'Failed to count unread messages' }, { status: 500 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in unread count API:', error);
    return NextResponse.json({ count: 0 });
  }
}

