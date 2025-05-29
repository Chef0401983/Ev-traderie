import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export function generateMessageNotificationEmail({
  recipientName,
  senderName,
  senderType,
  subject,
  content,
  vehicleInfo,
  dashboardUrl,
}: {
  recipientName: string;
  senderName: string;
  senderType: string;
  subject: string;
  content: string;
  vehicleInfo?: string;
  dashboardUrl: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Message - EV-Trader</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .message-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #2563eb; }
        .vehicle-info { background: #eff6ff; padding: 10px; border-radius: 6px; margin: 10px 0; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
        .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
        .sender-badge { display: inline-block; background: #dbeafe; color: #1d4ed8; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Message on EV-Trader</h1>
        </div>
        
        <div class="content">
          <h2>Hi ${recipientName},</h2>
          
          <p>You have received a new message from <strong>${senderName}</strong>${senderType === 'dealership' ? '<span class="sender-badge">Dealership</span>' : ''}:</p>
          
          <div class="message-box">
            <h3>${subject}</h3>
            ${vehicleInfo ? `<div class="vehicle-info"><strong>Regarding:</strong> ${vehicleInfo}</div>` : ''}
            <p>${content}</p>
          </div>
          
          <p>To view the full message and reply, please visit your dashboard:</p>
          
          <a href="${dashboardUrl}" class="button">View Message & Reply</a>
          
          <p>You can also manage your message notifications in your account settings.</p>
        </div>
        
        <div class="footer">
          <p>This email was sent by EV-Trader. If you no longer wish to receive these notifications, you can update your preferences in your account settings.</p>
          <p>&copy; 2025 EV-Trader. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    New Message on EV-Trader
    
    Hi ${recipientName},
    
    You have received a new message from ${senderName}${senderType === 'dealership' ? ' (Dealership)' : ''}:
    
    Subject: ${subject}
    ${vehicleInfo ? `Regarding: ${vehicleInfo}` : ''}
    
    Message:
    ${content}
    
    To view the full message and reply, please visit: ${dashboardUrl}
    
    Best regards,
    EV-Trader Team
  `;

  return { html, text };
}
