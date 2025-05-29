import { processEmailQueue } from './queue';

class EmailBackgroundProcessor {
  private intervalId: NodeJS.Timeout | null = null;
  private isProcessing = false;
  private readonly PROCESS_INTERVAL = 30000; // 30 seconds
  private readonly BATCH_SIZE = 10;

  start() {
    if (this.intervalId) {
      console.log('Email processor already running');
      return;
    }

    console.log('Starting email background processor...');
    
    // Process immediately
    this.processQueue();
    
    // Set up interval processing
    this.intervalId = setInterval(() => {
      this.processQueue();
    }, this.PROCESS_INTERVAL);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Email background processor stopped');
    }
  }

  private async processQueue() {
    if (this.isProcessing) {
      return; // Prevent concurrent processing
    }

    this.isProcessing = true;
    
    try {
      const result = await processEmailQueue(this.BATCH_SIZE);
      
      if (result.processed > 0 || result.failed > 0) {
        console.log(`Email processor: ${result.processed} sent, ${result.failed} failed`);
      }
    } catch (error) {
      console.error('Email background processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Manual trigger for immediate processing
  async triggerProcessing() {
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }
}

// Export singleton instance
export const emailProcessor = new EmailBackgroundProcessor();

// Auto-start in production (but not during build)
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  emailProcessor.start();
}
