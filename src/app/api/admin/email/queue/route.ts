import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processEmailQueue, getQueueStats } from '@/lib/email/queue';
import { auth } from '@clerk/nextjs/server';

// GET - Get email queue stats
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    
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
    
    // Get recent queue items
    const { data: recentEmails } = await supabase
      .from('email_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      stats,
      recentEmails: recentEmails || []
    });
  } catch (error) {
    console.error('Error fetching email queue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email queue' },
      { status: 500 }
    );
  }
}

// POST - Process email queue manually
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const limit = body.limit || 10;

    // Process the email queue
    const result = await processEmailQueue(limit);

    return NextResponse.json({
      success: true,
      processed: result.processed,
      failed: result.failed,
      message: `Processed ${result.processed} emails, ${result.failed} failed`
    });
  } catch (error) {
    console.error('Error processing email queue:', error);
    return NextResponse.json(
      { error: 'Failed to process email queue' },
      { status: 500 }
    );
  }
}
