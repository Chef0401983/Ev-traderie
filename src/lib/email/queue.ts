import { SendEmailOptions, sendEmail } from './service';
import { createClient } from '@supabase/supabase-js';

export interface EmailQueueItem {
  id?: string;
  to_addresses: string[];
  cc_addresses?: string[];
  bcc_addresses?: string[];
  subject?: string;
  template?: string;
  template_data?: any;
  html?: string;
  text?: string;
  status: 'pending' | 'processing' | 'sent' | 'failed';
  attempts: number;
  max_attempts: number;
  last_error?: string;
  scheduled_for?: string;
  sent_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Add email to queue
export const queueEmail = async (
  options: SendEmailOptions & { scheduledFor?: Date }
): Promise<{ success: boolean; error?: string; queueId?: string }> => {
  try {
    // Check for required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables for email queue:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey
      });
      return { success: false, error: 'Email service configuration error' };
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const queueItem: Omit<EmailQueueItem, 'id' | 'created_at' | 'updated_at'> = {
      to_addresses: Array.isArray(options.to) ? options.to : [options.to],
      template: options.template,
      template_data: options.data,
      status: 'pending',
      attempts: 0,
      max_attempts: 3,
      scheduled_for: options.scheduledFor?.toISOString() || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('email_queue')
      .insert(queueItem)
      .select()
      .single();

    if (error) {
      console.error('Failed to queue email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, queueId: data.id };
  } catch (error) {
    console.error('Error queuing email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to queue email' 
    };
  }
};

// Process email queue
export const processEmailQueue = async (
  limit: number = 10
): Promise<{ processed: number; failed: number }> => {
  try {
    // Check for required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables for email processing:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey
      });
      return { processed: 0, failed: 0 };
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get pending emails that are due to be sent
    const { data: emails, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .lt('attempts', 3)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch email queue:', error);
      return { processed: 0, failed: 0 };
    }

    if (!emails || emails.length === 0) {
      return { processed: 0, failed: 0 };
    }

    let processed = 0;
    let failed = 0;

    // Process each email
    for (const email of emails) {
      // Update status to processing
      await supabase
        .from('email_queue')
        .update({ status: 'processing' })
        .eq('id', email.id);

      try {
        const result = await sendEmail({
          to: email.to_addresses,
          template: email.template,
          data: email.template_data,
        });

        if (result.success) {
          // Mark as sent
          await supabase
            .from('email_queue')
            .update({ 
              status: 'sent',
              sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', email.id);
          
          processed++;
        } else {
          // Mark as failed and increment attempts
          await supabase
            .from('email_queue')
            .update({ 
              status: 'failed',
              attempts: email.attempts + 1,
              last_error: result.error,
              updated_at: new Date().toISOString(),
            })
            .eq('id', email.id);
          
          failed++;
        }
      } catch (error) {
        // Mark as failed and increment attempts
        await supabase
          .from('email_queue')
          .update({ 
            status: 'failed',
            attempts: email.attempts + 1,
            last_error: error instanceof Error ? error.message : 'Unknown error',
            updated_at: new Date().toISOString(),
          })
          .eq('id', email.id);
        
        failed++;
      }
    }

    // Reset failed emails back to pending if they haven't exceeded max attempts
    await supabase
      .from('email_queue')
      .update({ status: 'pending' })
      .eq('status', 'failed')
      .lt('attempts', 3);

    return { processed, failed };
  } catch (error) {
    console.error('Error processing email queue:', error);
    return { processed: 0, failed: 0 };
  }
};

// Clean up old processed emails
export const cleanupEmailQueue = async (
  daysToKeep: number = 30
): Promise<{ deleted: number }> => {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const { data, error } = await supabase
      .from('email_queue')
      .delete()
      .eq('status', 'sent')
      .lt('sent_at', cutoffDate.toISOString())
      .select();

    if (error) {
      console.error('Failed to cleanup email queue:', error);
      return { deleted: 0 };
    }

    return { deleted: data?.length || 0 };
  } catch (error) {
    console.error('Error cleaning up email queue:', error);
    return { deleted: 0 };
  }
};

// Get queue statistics
export const getQueueStats = async (): Promise<{
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  total: number;
}> => {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('email_queue')
      .select('status')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting queue stats:', error);
      return { pending: 0, processing: 0, sent: 0, failed: 0, total: 0 };
    }

    const stats = {
      pending: 0,
      processing: 0,
      sent: 0,
      failed: 0,
      total: data?.length || 0,
    };

    data?.forEach((item: { status: string }) => {
      if (item.status in stats && item.status !== 'total') {
        stats[item.status as keyof Omit<typeof stats, 'total'>]++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting queue stats:', error);
    return { pending: 0, processing: 0, sent: 0, failed: 0, total: 0 };
  }
};
