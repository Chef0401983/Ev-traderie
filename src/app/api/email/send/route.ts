import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { sendEmail } from '@/lib/email/service';
import { queueEmail } from '@/lib/email/queue';
import { EmailTemplate } from '@/lib/email/templates';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
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
    const { to, template, data, queue = false, scheduledFor } = body;

    // Validate inputs
    if (!to || !template || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: to, template, data' },
        { status: 400 }
      );
    }

    // Validate template
    const validTemplates: EmailTemplate[] = [
      'welcome',
      'verification-approved',
      'verification-rejected',
      'listing-approved',
      'listing-rejected',
      'new-message',
      'password-reset',
      'subscription-confirmation',
      'listing-expiring',
      'admin-notification'
    ];

    if (!validTemplates.includes(template)) {
      return NextResponse.json(
        { error: 'Invalid email template' },
        { status: 400 }
      );
    }

    // Send or queue email
    if (queue || scheduledFor) {
      const result = await queueEmail({
        to,
        template,
        data,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to queue email' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        queued: true,
        queueId: result.queueId
      });
    } else {
      const result = await sendEmail({
        to,
        template,
        data
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to send email' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        sent: true,
        messageId: result.messageId
      });
    }
  } catch (error) {
    console.error('Error in email send API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
