import nodemailer, { Transporter } from 'nodemailer';

// Email configuration interface
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    email: string;
  };
}

// Get email configuration from environment variables
export const getEmailConfig = (): EmailConfig => {
  return {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
    from: {
      name: process.env.SMTP_FROM_NAME || 'EV-Trader',
      email: process.env.SMTP_FROM_EMAIL || 'noreply@ev-trader.ie',
    },
  };
};

// Create and export the transporter
export const createTransporter = (): Transporter | null => {
  const config = getEmailConfig();
  
  // More detailed logging for debugging
  console.log('Email config check:', {
    hasHost: !!config.host,
    hasUser: !!config.auth.user,
    hasPass: !!config.auth.pass,
    host: config.host || 'NOT_SET',
    user: config.auth.user || 'NOT_SET',
    fromEmail: config.from.email
  });
  
  if (!config.host || !config.auth.user || !config.auth.pass) {
    console.warn('Email configuration is incomplete. Missing:', {
      host: !config.host ? 'SMTP_HOST' : null,
      user: !config.auth.user ? 'SMTP_USER' : null,
      pass: !config.auth.pass ? 'SMTP_PASS' : null
    });
    return null;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure, // true for 465, false for other ports
      auth: config.auth,
      // Additional options for better compatibility with Azure Communication Services
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates in development
      },
      // Add timeout settings
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    });

    console.log('Email transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    return null;
  }
};

// Test email connection
export const testEmailConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      return { 
        success: false, 
        error: 'Email service not configured. Please set SMTP environment variables.' 
      };
    }

    console.log('Testing SMTP connection...');
    
    // Verify connection configuration
    const result = await transporter.verify();
    console.log('SMTP verification result:', result);
    
    return { success: true };
  } catch (error) {
    console.error('Email connection test failed:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Common Azure Communication Services errors
      if (errorMessage.includes('EAUTH')) {
        errorMessage = 'Authentication failed. Please check your SMTP username and password.';
      } else if (errorMessage.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused. Please check your SMTP host and port.';
      } else if (errorMessage.includes('ETIMEDOUT')) {
        errorMessage = 'Connection timeout. Please check your network connection and SMTP settings.';
      } else if (errorMessage.includes('ENOTFOUND')) {
        errorMessage = 'SMTP host not found. Please check your SMTP_HOST setting.';
      }
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

// Check if email is configured
export const isEmailConfigured = (): boolean => {
  const config = getEmailConfig();
  return !!(config.host && config.auth.user && config.auth.pass);
};
