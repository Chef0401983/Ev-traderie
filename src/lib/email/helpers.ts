import { queueEmail, processEmailQueue } from './queue';
import { emailProcessor } from './background-processor';
import { EmailTemplate } from './templates';

// Helper functions for common email scenarios

// Auto-process queue after adding emails
const autoProcessQueue = async () => {
  try {
    // Trigger immediate processing
    await emailProcessor.triggerProcessing();
  } catch (error) {
    console.error('Failed to trigger email processing:', error);
  }
};

export const sendWelcomeEmail = async (
  email: string,
  name: string,
  userType: 'individual' | 'dealership'
) => {
  const result = await queueEmail({
    to: email,
    template: 'welcome',
    data: { name, userType }
  });
  
  // Auto-process the queue
  autoProcessQueue();
  
  return result;
};

export const sendVerificationStatusEmail = async (
  email: string,
  name: string,
  approved: boolean,
  rejectionReason?: string
) => {
  const result = await queueEmail({
    to: email,
    template: approved ? 'verification-approved' : 'verification-rejected',
    data: { name, rejectionReason }
  });
  
  // Auto-process the queue
  autoProcessQueue();
  
  return result;
};

export const sendVerificationSubmittedEmail = async (
  email: string,
  name: string,
  userType: 'individual' | 'dealership'
) => {
  const result = await queueEmail({
    to: email,
    template: 'verification-submitted',
    data: { name, userType }
  });
  
  // Auto-process the queue
  autoProcessQueue();
  
  return result;
};

export const sendListingStatusEmail = async (
  email: string,
  name: string,
  listingTitle: string,
  approved: boolean,
  viewLink?: string,
  rejectionReason?: string
) => {
  const result = await queueEmail({
    to: email,
    template: approved ? 'listing-approved' : 'listing-rejected',
    data: { name, listingTitle, viewLink, rejectionReason }
  });
  
  // Auto-process the queue
  autoProcessQueue();
  
  return result;
};

export const sendNewMessageEmail = async (
  email: string,
  recipientName: string,
  senderName: string,
  messagePreview: string,
  messageLink: string
) => {
  const result = await queueEmail({
    to: email,
    template: 'new-message',
    data: { name: recipientName, senderName, messagePreview, messageLink }
  });
  
  // Auto-process the queue
  autoProcessQueue();
  
  return result;
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetLink: string
) => {
  const result = await queueEmail({
    to: email,
    template: 'password-reset',
    data: { name, resetLink }
  });
  
  // Auto-process the queue
  autoProcessQueue();
  
  return result;
};

export const sendSubscriptionConfirmationEmail = async (
  email: string,
  name: string,
  planName: string,
  features: string[]
) => {
  const result = await queueEmail({
    to: email,
    template: 'subscription-confirmation',
    data: { name, planName, features }
  });
  
  // Auto-process the queue
  autoProcessQueue();
  
  return result;
};

export const sendListingExpiringEmail = async (
  email: string,
  name: string,
  listingTitle: string,
  expiryDate: string,
  renewLink: string
) => {
  const result = await queueEmail({
    to: email,
    template: 'listing-expiring',
    data: { name, listingTitle, expiryDate, renewLink }
  });
  
  // Auto-process the queue
  autoProcessQueue();
  
  return result;
};

export const sendAdminNotificationEmail = async (
  adminEmails: string[],
  subject: string,
  message: string
) => {
  const result = await queueEmail({
    to: adminEmails,
    template: 'admin-notification',
    data: { adminMessage: message }
  });
  
  // Auto-process the queue
  autoProcessQueue();
  
  return result;
};

// Batch email helpers
export const sendBulkEmails = async (
  recipients: Array<{ email: string; name: string; data?: any }>,
  template: EmailTemplate,
  baseData: any = {}
) => {
  const results = await Promise.allSettled(
    recipients.map(recipient =>
      queueEmail({
        to: recipient.email,
        template,
        data: {
          ...baseData,
          name: recipient.name,
          ...recipient.data
        }
      })
    )
  );
  
  // Auto-process the queue
  autoProcessQueue();
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  return { successful, failed, total: results.length };
};
