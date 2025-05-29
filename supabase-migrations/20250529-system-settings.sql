-- Create system_settings table for global application settings
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial settings
INSERT INTO system_settings (key, value, description)
VALUES 
  ('maintenance_mode', '{"enabled": false, "message": "We are currently performing maintenance. Please check back soon!"}', 'Controls site-wide maintenance mode'),
  ('coming_soon', '{"enabled": false, "title": "Coming Soon", "message": "We are launching soon! Sign up to be notified when we go live.", "background_image": "", "allow_signup": true}', 'Controls coming soon page visibility'),
  ('hero_section', '{"video_url": "", "video_enabled": false, "fallback_image": "/images/hero-background.jpg"}', 'Hero section configuration for homepage');

-- Create RLS policies for system_settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can modify system settings
CREATE POLICY "System settings are viewable by everyone" 
  ON system_settings FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can insert system settings" 
  ON system_settings FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Only admins can update system settings" 
  ON system_settings FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Only admins can delete system settings" 
  ON system_settings FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );
