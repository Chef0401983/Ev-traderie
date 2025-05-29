-- Create email_queue table for managing email sending
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  to TEXT[] NOT NULL, -- Array of email addresses
  template TEXT NOT NULL,
  data JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error TEXT,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_scheduled_for ON email_queue(scheduled_for);
CREATE INDEX idx_email_queue_created_at ON email_queue(created_at);

-- Create email_logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_id UUID REFERENCES email_queue(id) ON DELETE SET NULL,
  to TEXT[] NOT NULL,
  template TEXT NOT NULL,
  subject TEXT,
  message_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'bounced', 'complained')),
  error TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for email logs
CREATE INDEX idx_email_logs_to ON email_logs USING GIN(to);
CREATE INDEX idx_email_logs_template ON email_logs(template);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);

-- RLS Policies for email_queue (admin only)
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view email queue"
  ON email_queue FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()::text
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can insert into email queue"
  ON email_queue FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()::text
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can update email queue"
  ON email_queue FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()::text
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for email_logs (admin only)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view email logs"
  ON email_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()::text
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can insert into email logs"
  ON email_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()::text
      AND profiles.is_admin = true
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for email_queue
CREATE TRIGGER update_email_queue_updated_at BEFORE UPDATE
  ON email_queue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
