import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { testEmailConnection, getEmailConfig, createTransporter } from '@/lib/email/config';

// POST - Test SMTP connection
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    
    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const testType = body.testType || 'connection'; // 'connection' or 'send'

    if (testType === 'connection') {
      // Test basic SMTP connection
      const result = await testEmailConnection();
      
      const config = getEmailConfig();
      
      return NextResponse.json({
        success: result.success,
        error: result.error,
        config: {
          host: config.host,
          port: config.port,
          secure: config.secure,
          user: config.auth.user ? '***' + config.auth.user.slice(-10) : 'Not set',
          from: config.from
        },
        message: result.success ? 'SMTP connection successful!' : 'SMTP connection failed'
      });
    } else if (testType === 'send') {
      // Test sending an actual email
      const { testEmail, template } = body;
      
      if (!testEmail) {
        return NextResponse.json({ error: 'Test email address required' }, { status: 400 });
      }

      const transporter = createTransporter();
      
      if (!transporter) {
        return NextResponse.json({
          success: false,
          error: 'Email service not configured'
        });
      }

      try {
        let emailContent;
        let subject;

        if (template && template !== 'smtp-test') {
          // Use email template
          const { emailTemplates } = await import('@/lib/email/templates');
          
          // Sample data for template testing - provide all possible fields
          const sampleData = {
            name: 'Test User',
            userType: 'Individual',
            reason: 'Sample rejection reason for testing',
            vehicleTitle: 'Sample Electric Vehicle',
            listingId: 'TEST123',
            messageFrom: 'John Doe',
            messageContent: 'Sample message content',
            resetLink: 'https://www.ev-trader.ie/reset-password',
            planName: 'Premium Plan',
            amount: '€99.99',
            expiryDate: '2025-12-31',
            adminMessage: 'Sample admin notification'
          };

          const templateFunction = emailTemplates[template as keyof typeof emailTemplates];
          if (templateFunction) {
            const templateResult = templateFunction(sampleData as any);
            emailContent = templateResult.html;
            subject = templateResult.subject;
          } else {
            throw new Error(`Template "${template}" not found`);
          }
        } else {
          // Default SMTP test email
          subject = 'EV-Trader SMTP Test Email';
          emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">SMTP Connection Test Successful!</h2>
              <p>This is a test email from the EV-Trader marketplace.</p>
              <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
              <p><strong>From:</strong> ${getEmailConfig().from.email}</p>
              <p><strong>SMTP Host:</strong> ${getEmailConfig().host}</p>
              <p><strong>SMTP Port:</strong> ${getEmailConfig().port}</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                If you received this email, your SMTP configuration is working correctly.
              </p>
            </div>
          `;
        }

        const result = await transporter.sendMail({
          from: `${getEmailConfig().from.name} <${getEmailConfig().from.email}>`,
          to: testEmail,
          subject: subject,
          html: emailContent,
          text: emailContent.replace(/<[^>]*>/g, '') // Strip HTML for text version
        });

        return NextResponse.json({
          success: true,
          messageId: result.messageId,
          message: `${template ? `Template "${template}"` : 'Test email'} sent successfully to ${testEmail}`,
          details: {
            accepted: result.accepted,
            rejected: result.rejected,
            response: result.response,
            template: template || 'smtp-test'
          }
        });
      } catch (error) {
        console.error('Failed to send test email:', error);
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to send test email',
          message: 'Failed to send test email'
        });
      }
    } else {
      return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error testing email connection:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to test email connection' 
      },
      { status: 500 }
    );
  }
}
