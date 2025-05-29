// Email template types
export type EmailTemplate = 
  | 'welcome'
  | 'verification-submitted'
  | 'verification-approved'
  | 'verification-rejected'
  | 'listing-approved'
  | 'listing-rejected'
  | 'new-message'
  | 'password-reset'
  | 'subscription-confirmation'
  | 'listing-expiring'
  | 'admin-notification';

// Base email layout
const baseLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EV-Trader</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #2563eb;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header img {
      max-height: 40px;
      width: auto;
      filter: brightness(0) invert(1);
    }
    .header h1 {
      margin: 10px 0 0 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://www.ev-trader.ie/ev-trader-logo.svg" alt="EV-Trader Logo" />
      <h1>EV-Trader</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; 2025 EV-Trader. All rights reserved.</p>
      <p>
        <a href="https://www.ev-trader.ie/privacy">Privacy Policy</a> | 
        <a href="https://www.ev-trader.ie/terms">Terms of Service</a> | 
        <a href="https://www.ev-trader.ie/contact">Contact Us</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

// Email templates
export const emailTemplates = {
  welcome: (data: { name: string; userType: string }) => ({
    subject: 'Welcome to EV-Trader!',
    html: baseLayout(`
      <h2>Welcome to EV-Trader, ${data.name}!</h2>
      <p>Thank you for joining Ireland's premier electric vehicle marketplace.</p>
      <p>Your account has been created as a <strong>${data.userType}</strong> account.</p>
      
      <h3>Next Steps:</h3>
      <ul>
        <li>Complete your profile verification to start listing vehicles</li>
        <li>Browse our extensive collection of electric vehicles</li>
        <li>Set up alerts for vehicles that match your preferences</li>
      </ul>
      
      <a href="https://www.ev-trader.ie/dashboard" class="button">Go to Dashboard</a>
      
      <p>If you have any questions, feel free to contact our support team.</p>
    `),
  }),

  'verification-submitted': (data: { name: string; userType: string }) => ({
    subject: 'Verification documents received - Under review',
    html: baseLayout(`
      <h2>Thank you, ${data.name}!</h2>
      <p>We've successfully received your verification documents for your ${data.userType} account.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2563eb; margin-top: 0;">What happens next?</h3>
        <ul style="margin-bottom: 0;">
          <li>Our team will review your documents within 1-2 business days</li>
          <li>You'll receive an email notification once the review is complete</li>
          <li>If approved, you can start listing vehicles immediately</li>
          <li>If additional information is needed, we'll contact you with details</li>
        </ul>
      </div>
      
      <p>In the meantime, you can:</p>
      <ul>
        <li>Browse existing vehicle listings</li>
        <li>Set up your profile preferences</li>
        <li>Explore the marketplace features</li>
      </ul>
      
      <a href="https://www.ev-trader.ie/dashboard" class="button">Visit Your Dashboard</a>
      
      <p>Thank you for choosing EV-Trader as your electric vehicle marketplace!</p>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        If you have any questions, please don't hesitate to contact our support team.
      </p>
    `),
  }),

  'verification-approved': (data: { name: string }) => ({
    subject: 'Your verification has been approved!',
    html: baseLayout(`
      <h2>Congratulations, ${data.name}!</h2>
      <p>Your account verification has been approved. You can now start listing vehicles on EV-Trader.</p>
      
      <p>With your verified account, you can:</p>
      <ul>
        <li>List your vehicle for sale</li>
        <li>Access premium features</li>
        <li>Build trust with potential buyers</li>
      </ul>
      
      <a href="https://www.ev-trader.ie/dashboard/listings/new" class="button">Create Your First Listing</a>
      
      <p>Thank you for choosing EV-Trader!</p>
    `),
  }),

  'verification-rejected': (data: { name: string; reason: string }) => ({
    subject: 'Verification requires additional information',
    html: baseLayout(`
      <h2>Hello ${data.name},</h2>
      <p>We've reviewed your verification request and need some additional information.</p>
      
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
        <p><strong>Reason:</strong> ${data.reason}</p>
      </div>
      
      <p>Please update your verification documents and resubmit your application.</p>
      
      <a href="https://www.ev-trader.ie/dashboard/verification" class="button">Update Verification</a>
      
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
    `),
  }),

  'listing-approved': (data: { name: string; vehicleTitle: string; listingId: string }) => ({
    subject: 'Your vehicle listing is now live!',
    html: baseLayout(`
      <h2>Great news, ${data.name}!</h2>
      <p>Your listing for <strong>${data.vehicleTitle}</strong> has been approved and is now live on EV-Trader.</p>
      
      <p>Your listing is now:</p>
      <ul>
        <li>Visible to thousands of potential buyers</li>
        <li>Searchable in our marketplace</li>
        <li>Eligible for featured placement</li>
      </ul>
      
      <a href="https://www.ev-trader.ie/vehicles/${data.listingId}" class="button">View Your Listing</a>
      
      <p>Tips for a successful sale:</p>
      <ul>
        <li>Respond to inquiries promptly</li>
        <li>Keep your listing information up to date</li>
        <li>Consider featuring your listing for more visibility</li>
      </ul>
    `),
  }),

  'listing-rejected': (data: { name: string; vehicleTitle: string; reason: string }) => ({
    subject: 'Your listing needs updates',
    html: baseLayout(`
      <h2>Hello ${data.name},</h2>
      <p>We've reviewed your listing for <strong>${data.vehicleTitle}</strong> and it requires some updates before it can go live.</p>
      
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
        <p><strong>Reason:</strong> ${data.reason}</p>
      </div>
      
      <p>Common reasons for listing updates:</p>
      <ul>
        <li>Missing or unclear photos</li>
        <li>Incomplete vehicle information</li>
        <li>Pricing concerns</li>
      </ul>
      
      <a href="https://www.ev-trader.ie/dashboard/listings" class="button">Update Your Listing</a>
      
      <p>Once you've made the necessary updates, we'll review your listing again.</p>
    `),
  }),

  'new-message': (data: { name: string; senderName: string; vehicleTitle: string; messagePreview: string }) => ({
    subject: `New message about ${data.vehicleTitle}`,
    html: baseLayout(`
      <h2>Hello ${data.name},</h2>
      <p>You have a new message from <strong>${data.senderName}</strong> about your listing: <strong>${data.vehicleTitle}</strong></p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><em>"${data.messagePreview}"</em></p>
      </div>
      
      <a href="https://www.ev-trader.ie/dashboard/messages" class="button">View Message</a>
      
      <p>Quick response tips:</p>
      <ul>
        <li>Respond within 24 hours for best results</li>
        <li>Be clear and professional in your communication</li>
        <li>Arrange viewings in safe, public locations</li>
      </ul>
    `),
  }),

  'password-reset': (data: { name: string; resetLink: string }) => ({
    subject: 'Reset your EV-Trader password',
    html: baseLayout(`
      <h2>Hello ${data.name},</h2>
      <p>We received a request to reset your password. Click the button below to create a new password.</p>
      
      <a href="${data.resetLink}" class="button">Reset Password</a>
      
      <p>This link will expire in 1 hour for security reasons.</p>
      
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      
      <p style="margin-top: 30px; font-size: 12px; color: #666;">
        For security reasons, this link can only be used once.
      </p>
    `),
  }),

  'subscription-confirmation': (data: { name: string; planName: string; price: string; features: string[] }) => ({
    subject: 'Subscription confirmed - Welcome to ' + data.planName,
    html: baseLayout(`
      <h2>Thank you for subscribing, ${data.name}!</h2>
      <p>Your subscription to <strong>${data.planName}</strong> is now active.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Subscription Details:</h3>
        <p><strong>Plan:</strong> ${data.planName}</p>
        <p><strong>Price:</strong> ${data.price}</p>
        <p><strong>Features included:</strong></p>
        <ul>
          ${data.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
      
      <a href="https://www.ev-trader.ie/dashboard/subscription" class="button">Manage Subscription</a>
      
      <p>Make the most of your subscription by listing your vehicles today!</p>
    `),
  }),

  'listing-expiring': (data: { name: string; vehicleTitle: string; daysRemaining: number }) => ({
    subject: `Your listing expires in ${data.daysRemaining} days`,
    html: baseLayout(`
      <h2>Hello ${data.name},</h2>
      <p>Your listing for <strong>${data.vehicleTitle}</strong> will expire in <strong>${data.daysRemaining} days</strong>.</p>
      
      <p>To keep your listing active, you can:</p>
      <ul>
        <li>Renew your listing for another period</li>
        <li>Upgrade to a featured listing for more visibility</li>
        <li>Update your listing details to attract more buyers</li>
      </ul>
      
      <a href="https://www.ev-trader.ie/dashboard/listings" class="button">Renew Listing</a>
      
      <p>Don't miss out on potential buyers - renew your listing today!</p>
    `),
  }),

  'admin-notification': (data: { title: string; message: string; actionUrl?: string; actionText?: string }) => ({
    subject: `Admin Alert: ${data.title}`,
    html: baseLayout(`
      <h2>${data.title}</h2>
      <p>${data.message}</p>
      
      ${data.actionUrl ? `
        <a href="${data.actionUrl}" class="button">${data.actionText || 'View Details'}</a>
      ` : ''}
      
      <p style="margin-top: 30px; font-size: 12px; color: #666;">
        This is an automated admin notification from EV-Trader.
      </p>
    `),
  }),
};
