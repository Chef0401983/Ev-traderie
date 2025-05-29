# Email Service Documentation

## Overview

The EV-Trader email service provides a comprehensive solution for managing email communications within the application. It includes email templates, queue management, and helper functions for common email scenarios.

## Architecture

### Components

1. **Templates** (`templates.ts`)
   - Pre-defined email templates for various scenarios
   - Consistent branding and layout
   - Dynamic content injection

2. **Service** (`service.ts`)
   - Core email sending functionality
   - Template rendering
   - SMTP transport management

3. **Queue** (`queue.ts`)
   - Asynchronous email processing
   - Retry logic for failed emails
   - Scheduled email support

4. **Helpers** (`helpers.ts`)
   - Convenience functions for common email types
   - Simplified API for sending emails

5. **Configuration** (`config.ts`)
   - SMTP settings
   - Environment variable management
   - Transport configuration

## Configuration

### Environment Variables

Add these to your `.env.local` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=EV-Trader
SMTP_FROM_EMAIL=noreply@ev-trader.ie

# Optional: Cron job authentication
CRON_SECRET=your_secret_key
```

### Database Schema

Run the SQL schema in `schema.sql` to create the required tables:
- `email_queue` - Stores emails pending to be sent
- `email_logs` - Audit trail of all email activities

## Usage

### Sending Emails Directly

```typescript
import { sendEmail } from '@/lib/email/service';

// Using a template
await sendEmail({
  to: 'user@example.com',
  template: 'welcome',
  data: {
    name: 'John Doe',
    userType: 'individual'
  }
});

// Custom email
await sendEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  html: '<h1>Custom HTML content</h1>',
  text: 'Plain text version'
});
```

### Using Helper Functions

```typescript
import { 
  sendWelcomeEmail,
  sendVerificationStatusEmail,
  sendListingStatusEmail 
} from '@/lib/email/helpers';

// Welcome email
await sendWelcomeEmail('user@example.com', 'John Doe', 'individual');

// Verification status
await sendVerificationStatusEmail(
  'user@example.com',
  'John Doe',
  true, // approved
  'Optional rejection reason'
);

// Listing status
await sendListingStatusEmail(
  'seller@example.com',
  'Jane Doe',
  '2023 Tesla Model 3',
  false, // rejected
  'Listing does not meet quality standards'
);
```

### Queue Management

```typescript
import { queueEmail, processEmailQueue, getQueueStats } from '@/lib/email/queue';

// Queue an email
await queueEmail({
  to: 'user@example.com',
  template: 'newsletter',
  data: { content: 'Newsletter content' },
  scheduledFor: new Date('2024-01-01') // Optional: schedule for later
});

// Process queue manually
const result = await processEmailQueue(20); // Process up to 20 emails
console.log(`Processed: ${result.processed}, Failed: ${result.failed}`);

// Get queue statistics
const stats = await getQueueStats();
console.log(stats); // { pending: 5, processing: 0, sent: 100, failed: 2, total: 107 }
```

## Email Templates

Available templates:
- `welcome` - New user welcome email
- `verificationApproved` - User verification approved
- `verificationRejected` - User verification rejected
- `listingApproved` - Vehicle listing approved
- `listingRejected` - Vehicle listing rejected
- `newMessage` - New message notification
- `listingExpiring` - Listing expiration warning
- `listingExpired` - Listing has expired
- `passwordReset` - Password reset request
- `subscriptionConfirmation` - Subscription confirmed
- `paymentReceipt` - Payment receipt

## Admin Panel Integration

The email service is integrated with the admin panel:

1. **Email Management Page** (`/admin/email-management`)
   - View email queue statistics
   - Process pending emails
   - Send test emails
   - Monitor email status

2. **Automatic Notifications**
   - User verification decisions trigger emails
   - Listing approval/rejection sends notifications
   - All admin actions are logged

## Cron Job Setup

For automatic email processing, set up a cron job to call:
```
GET /api/cron/email-queue
```

Add authentication header:
```
Authorization: Bearer YOUR_CRON_SECRET
```

Recommended schedule: Every 5-15 minutes

### Example Cron Configurations

**Vercel Cron (vercel.json)**:
```json
{
  "crons": [{
    "path": "/api/cron/email-queue",
    "schedule": "*/10 * * * *"
  }]
}
```

**External Cron Service**:
```bash
*/10 * * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/cron/email-queue
```

## Error Handling

- Failed emails are automatically retried (up to 3 attempts)
- All email activities are logged in the database
- Admin notifications for critical failures
- Graceful degradation if SMTP is unavailable

## Security Considerations

1. **Environment Variables**: Never commit SMTP credentials
2. **Rate Limiting**: Implement rate limiting for email endpoints
3. **Authentication**: Secure admin endpoints with proper auth
4. **Input Validation**: Validate all email addresses and content
5. **XSS Prevention**: Sanitize dynamic content in templates

## Monitoring

Monitor these metrics:
- Queue size and processing rate
- Email delivery success rate
- Failed email patterns
- SMTP connection health

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SMTP credentials
   - Verify firewall allows SMTP port
   - Check email queue status

2. **Templates not rendering**
   - Ensure all required data is provided
   - Check for typos in template names

3. **Queue processing issues**
   - Check database connectivity
   - Verify cron job is running
   - Check for errors in email_logs table

### Debug Mode

Enable debug logging:
```typescript
process.env.EMAIL_DEBUG = 'true';
```

This will log detailed information about email processing.

## Future Enhancements

- [ ] Email analytics dashboard
- [ ] A/B testing for templates
- [ ] Unsubscribe management
- [ ] Email preview in admin panel
- [ ] Webhook support for email events
- [ ] Multi-language template support
