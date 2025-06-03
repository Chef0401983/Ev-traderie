export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { processEmailQueue, cleanupEmailQueue } from '@/lib/email/queue';

// This endpoint should be called by a cron job service (e.g., Vercel Cron, GitHub Actions, or external service)
// It processes the email queue and cleans up old emails

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from an authorized source
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Process email queue
    const processResult = await processEmailQueue(20); // Process up to 20 emails
    
    // Clean up old emails (older than 30 days)
    const cleanupResult = await cleanupEmailQueue(30);

    return NextResponse.json({
      success: true,
      processed: processResult.processed,
      failed: processResult.failed,
      cleaned: cleanupResult.deleted,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in email queue cron job:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process email queue',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support POST for some cron services
export async function POST(request: NextRequest) {
  return GET(request);
}

