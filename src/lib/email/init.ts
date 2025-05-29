import { emailProcessor } from './background-processor';

// Initialize email processing
export const initializeEmailSystem = () => {
  try {
    emailProcessor.start();
    console.log('Email system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize email system:', error);
  }
};

// Auto-initialize in development and production
if (typeof window === 'undefined') { // Server-side only
  initializeEmailSystem();
}
