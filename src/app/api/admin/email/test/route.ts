import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/service';
import { testEmailConnection } from '@/lib/email/config';

// POST - Send test email
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, email, full_name')
      .eq('user_id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { to, template = 'welcome' } = await request.json();

    // Test connection first
    const connectionTest = await testEmailConnection();
    if (!connectionTest.success) {
      return NextResponse.json({
        error: 'Email service not configured',
        details: connectionTest.error
      }, { status: 503 });
    }

    // Send test email
    const result = await sendEmail({
      to: to || profile.email,
      template: template as any,
      data: {
        name: profile.full_name || 'Admin',
        userType: 'admin',
        // Additional test data based on template
        resetLink: 'https://www.ev-trader.ie/reset-password/test-token',
        rejectionReason: 'This is a test rejection reason',
        listingTitle: 'Test Vehicle Listing',
        listingId: 'test-listing-id',
        viewLink: 'https://www.ev-trader.ie/vehicles/test-id',
        senderName: 'Test User',
        messageFrom: 'Test User',
        messagePreview: 'This is a test message...',
        messageLink: 'https://www.ev-trader.ie/messages/test-id',
        planName: 'Test Plan',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        adminMessage: 'This is a test admin notification'
      }
    });

    // Log admin action
    await supabase
      .from('admin_activities')
      .insert({
        admin_id: user.id,
        action: 'send_test_email',
        details: {
          to: to || profile.email,
          template,
          success: result.success,
          error: result.error
        }
      });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
