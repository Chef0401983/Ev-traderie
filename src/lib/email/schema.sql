-- Email queue table for managing email sending
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to TEXT[] NOT NULL,
  template VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message_id TEXT
);

-- Indexes for efficient queue processing
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_scheduled ON email_queue(scheduled_for);
CREATE INDEX idx_email_queue_created ON email_queue(created_at);

-- Email logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to TEXT[] NOT NULL,
  template VARCHAR(50),
  subject TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed', 'bounced', 'complained')),
  message_id TEXT,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email logs
CREATE INDEX idx_email_logs_created ON email_logs(created_at);
CREATE INDEX idx_email_logs_to ON email_logs USING GIN(to);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- RLS policies for email tables (admin only)
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Admin can view and manage email queue
CREATE POLICY "Admin can manage email queue" ON email_queue
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admin can view email logs
CREATE POLICY "Admin can view email logs" ON email_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_admin = true
    )
  );
