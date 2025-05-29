import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { processEmailQueue } from '@/lib/email/queue';

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

    // Process the email queue
    const result = await processEmailQueue();

    return NextResponse.json({ 
      message: 'Email queue processed successfully',
      processed: result.processed,
      failed: result.failed
    });

  } catch (error) {
    console.error('Error processing email queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
