import { createTransporter, getEmailConfig } from './config';
import { emailTemplates, EmailTemplate } from './templates';

export interface SendEmailOptions {
  to: string | string[];
  template: EmailTemplate;
  data: any;
  attachments?: Array<{
    filename: string;
    content?: Buffer;
    path?: string;
  }>;
}

export interface SendCustomEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content?: Buffer;
    path?: string;
  }>;
}

// Send email using a template
export const sendEmail = async (options: SendEmailOptions): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.warn('Email sending is disabled - no SMTP configuration');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const config = getEmailConfig();
    const template = emailTemplates[options.template];
    
    if (!template) {
      return { success: false, error: `Unknown email template: ${options.template}` };
    }

    const emailContent = template(options.data);
    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    const info = await transporter.sendMail({
      from: `"${config.from.name}" <${config.from.email}>`,
      to: recipients.join(', '),
      subject: emailContent.subject,
      html: emailContent.html,
      attachments: options.attachments,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
};

// Send custom email (for one-off emails)
export const sendCustomEmail = async (options: SendCustomEmailOptions): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.warn('Email sending is disabled - no SMTP configuration');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const config = getEmailConfig();
    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    const info = await transporter.sendMail({
      from: `"${config.from.name}" <${config.from.email}>`,
      to: recipients.join(', '),
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    });

    console.log('Custom email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending custom email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
};

// Batch send emails (with rate limiting)
export const sendBatchEmails = async (
  emails: SendEmailOptions[],
  options: { delayMs?: number; onProgress?: (sent: number, total: number) => void } = {}
): Promise<{ sent: number; failed: number; errors: string[] }> => {
  const { delayMs = 1000, onProgress } = options;
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < emails.length; i++) {
    const result = await sendEmail(emails[i]);
    
    if (result.success) {
      sent++;
    } else {
      failed++;
      errors.push(`Email ${i + 1}: ${result.error}`);
    }

    if (onProgress) {
      onProgress(sent + failed, emails.length);
    }

    // Rate limiting
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return { sent, failed, errors };
};
