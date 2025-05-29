import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { getQueueStats } from '@/lib/email/queue';
import { emailProcessor } from '@/lib/email/background-processor';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get queue statistics
    const stats = await getQueueStats();

    return NextResponse.json({
      stats,
      message: stats.pending > 0 
        ? `${stats.pending} emails pending processing` 
        : 'No emails pending'
    });

  } catch (error) {
    console.error('Error getting email status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Trigger immediate processing
    await emailProcessor.triggerProcessing();

    // Get updated stats
    const stats = await getQueueStats();

    return NextResponse.json({
      message: 'Email processing triggered',
      stats
    });

  } catch (error) {
    console.error('Error triggering email processing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
