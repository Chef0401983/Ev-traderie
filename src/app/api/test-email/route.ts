export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { sendEmail, generateMessageNotificationEmail } from '@/lib/email';

// Test email endpoint - only for admins
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'Email address required' }, { status: 400 });
    }

    // Test basic email
    const result = await sendEmail({
      to,
      subject: 'Test Email from EV-Trader',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email sent from your EV-Trader application.</p>
        <p>If you received this, your SMTP configuration is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
      text: `Test Email - This is a test email sent from your EV-Trader application. Timestamp: ${new Date().toISOString()}`
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully',
        messageId: result.messageId 
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to send email', 
        details: result.error 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in test email API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

