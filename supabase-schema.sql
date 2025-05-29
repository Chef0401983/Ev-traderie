-- Create profiles table to store user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'individual',
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'submitted', 'approved', 'rejected')),
  can_create_listings BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table to store vehicle listings
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  mileage INTEGER,
  battery_capacity DECIMAL(6, 2), -- in kWh
  range INTEGER, -- in miles/km
  charging_speed INTEGER, -- in kW
  color TEXT,
  condition TEXT,
  description TEXT,
  location TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_sold BOOLEAN DEFAULT FALSE,
  listing_purchase_id UUID REFERENCES listing_purchases(id),
  featured_until TIMESTAMP WITH TIME ZONE,
  bump_ups_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicle_images table to store images for each vehicle
CREATE TABLE IF NOT EXISTS vehicle_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_vehicles table to track user's saved/favorite vehicles
CREATE TABLE IF NOT EXISTS saved_vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id)
);

-- Create messages table for communication between buyers and sellers
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  recipient_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dealership_profiles table for additional dealership information
CREATE TABLE IF NOT EXISTS dealership_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  dealership_name TEXT NOT NULL,
  business_address TEXT,
  phone_number TEXT,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listing_plans table to store pricing plans
CREATE TABLE IF NOT EXISTS listing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(8, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  max_photos INTEGER DEFAULT 12,
  max_videos INTEGER DEFAULT 0,
  bump_ups INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('private', 'dealership')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_subscriptions table to track active subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES listing_plans(id),
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  listings_used INTEGER DEFAULT 0,
  max_listings INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listing_purchases table for one-time listing purchases
CREATE TABLE IF NOT EXISTS listing_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES listing_plans(id),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(8, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  expires_at TIMESTAMP WITH TIME ZONE,
  bump_ups_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_verifications table to store verification documents
CREATE TABLE IF NOT EXISTS user_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('individual', 'dealership')),
  
  -- Photo ID fields
  photo_id_url TEXT,
  photo_id_type TEXT CHECK (photo_id_type IN ('passport', 'driving_license', 'national_id')),
  
  -- Proof of address fields
  proof_of_address_url TEXT,
  proof_of_address_type TEXT CHECK (proof_of_address_type IN ('utility_bill', 'bank_statement', 'council_tax', 'rental_agreement')),
  
  -- Dealership specific fields
  business_registration_url TEXT,
  business_registration_number TEXT,
  business_name TEXT,
  business_address TEXT,
  vat_number TEXT,
  
  -- Verification status and notes
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'under_review', 'approved', 'rejected')),
  admin_notes TEXT,
  rejection_reason TEXT,
  verified_by TEXT, -- admin user who verified
  verified_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one verification record per user
  UNIQUE(user_id)
);

-- Insert default pricing plans for private sellers
INSERT INTO listing_plans (name, description, price, duration_days, max_photos, max_videos, bump_ups, features, plan_type) VALUES
('EV Essentials', 'Affordable, long-term visibility with extra perks', 24.99, 72, 12, 0, 3, '["Social Media Sharing"]'::jsonb, 'private'),
('EV Accelerator', 'Boost performance with analytics and flexibility', 44.99, 72, 18, 1, 6, '["Social Media Sharing", "Advanced Analytics", "AI-Priced Recommendations"]'::jsonb, 'private'),
('EV Premium Pro', 'Maximum exposure for high-value EVs', 74.99, 72, 25, 1, 12, '["Social Media Sharing", "Advanced Analytics", "AI-Priced Recommendations", "360° Virtual Tour", "Spotlight Placement", "Certified Seller Badge", "AI-Optimized Descriptions", "Priority Support"]'::jsonb, 'private');

-- Insert default pricing plans for dealerships (monthly subscriptions)
INSERT INTO listing_plans (name, description, price, duration_days, max_photos, max_videos, bump_ups, features, plan_type) VALUES
('Dealer Starter EV', 'Ideal for small dealerships or new entrants to the EV market', 89.00, 30, 5, 0, 0, '["Up to 20 listings/month", "Bronze Badge", "Bulk Upload", "Basic Analytics", "Email Support"]'::jsonb, 'dealership'),
('Dealer Pro EV', 'Growing dealerships scaling EV inventory', 249.00, 30, 15, 1, 0, '["Up to 100 listings/month", "Silver Badge", "Advanced Analytics", "AI-Price Optimization", "CRM Integration", "Priority Placement", "Account Manager"]'::jsonb, 'dealership'),
('Dealer Titan EV', 'Large dealerships or EV-only specialists', 599.00, 30, 25, 1, 0, '["Unlimited listings", "Gold Badge", "API Sync", "Advanced Dashboard", "Targeted Ads", "360° Virtual Tours", "24/7 Support", "Green Certification"]'::jsonb, 'dealership');

-- Create RLS (Row Level Security) policies

-- Profiles table policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Vehicles table policies
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Vehicles are viewable by everyone" ON vehicles;
DROP POLICY IF EXISTS "Users can insert their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can delete their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can insert their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can delete their own vehicles" ON vehicles;

CREATE POLICY "Vehicles are viewable by everyone"
  ON vehicles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (auth.uid()::text = seller_id);

CREATE POLICY "Users can update their own vehicles"
  ON vehicles FOR UPDATE
  USING (auth.uid()::text = seller_id);

CREATE POLICY "Users can delete their own vehicles"
  ON vehicles FOR DELETE
  USING (auth.uid()::text = seller_id);

-- Vehicle images policies
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Vehicle images are viewable by everyone" ON vehicle_images;
DROP POLICY IF EXISTS "Users can insert images for their own vehicles" ON vehicle_images;
DROP POLICY IF EXISTS "Users can delete images for their own vehicles" ON vehicle_images;

CREATE POLICY "Vehicle images are viewable by everyone"
  ON vehicle_images FOR SELECT
  USING (true);

CREATE POLICY "Users can insert images for their own vehicles"
  ON vehicle_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vehicles
      WHERE vehicles.id = vehicle_id
      AND vehicles.seller_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete images for their own vehicles"
  ON vehicle_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM vehicles
      WHERE vehicles.id = vehicle_id
      AND vehicles.seller_id = auth.uid()::text
    )
  );

-- Saved vehicles policies
ALTER TABLE saved_vehicles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own saved vehicles" ON saved_vehicles;
DROP POLICY IF EXISTS "Users can save vehicles" ON saved_vehicles;
DROP POLICY IF EXISTS "Users can unsave vehicles" ON saved_vehicles;

CREATE POLICY "Users can view their own saved vehicles"
  ON saved_vehicles FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can save vehicles"
  ON saved_vehicles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can unsave vehicles"
  ON saved_vehicles FOR DELETE
  USING (auth.uid()::text = user_id);

-- Messages policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update messages they sent" ON messages;

CREATE POLICY "Users can view messages they sent or received"
  ON messages FOR SELECT
  USING (auth.uid()::text = sender_id OR auth.uid()::text = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid()::text = sender_id);

CREATE POLICY "Users can update messages they sent"
  ON messages FOR UPDATE
  USING (auth.uid()::text = sender_id);

-- Dealership profiles policies
ALTER TABLE dealership_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Dealership profiles are viewable by everyone" ON dealership_profiles;
DROP POLICY IF EXISTS "Users can insert their own dealership profile" ON dealership_profiles;
DROP POLICY IF EXISTS "Users can update their own dealership profile" ON dealership_profiles;

CREATE POLICY "Dealership profiles are viewable by everyone"
  ON dealership_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own dealership profile"
  ON dealership_profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own dealership profile"
  ON dealership_profiles FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Listing plans policies
ALTER TABLE listing_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Listing plans are viewable by everyone" ON listing_plans;

CREATE POLICY "Listing plans are viewable by everyone"
  ON listing_plans FOR SELECT
  USING (is_active = true);

-- User subscriptions policies
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;

CREATE POLICY "Users can view their own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (auth.uid()::text = user_id);

-- Listing purchases policies
ALTER TABLE listing_purchases ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own listing purchases" ON listing_purchases;
DROP POLICY IF EXISTS "Users can insert their own listing purchases" ON listing_purchases;

CREATE POLICY "Users can view their own listing purchases"
  ON listing_purchases FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own listing purchases"
  ON listing_purchases FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- User verifications policies
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own verification status" ON user_verifications;
DROP POLICY IF EXISTS "Users can submit verification documents" ON user_verifications;
DROP POLICY IF EXISTS "Admins can view and update verification status" ON user_verifications;

CREATE POLICY "Users can view their own verification status"
  ON user_verifications FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can submit verification documents"
  ON user_verifications FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own verification documents"
  ON user_verifications FOR UPDATE
  USING (auth.uid()::text = user_id AND status IN ('pending', 'rejected'));

CREATE POLICY "Admins can view verification status"
  ON user_verifications FOR SELECT
  USING (auth.role() = 'admin');

CREATE POLICY "Admins can update verification status"
  ON user_verifications FOR UPDATE
  USING (auth.role() = 'admin');

-- Function to update profile verification status when verification is approved
CREATE OR REPLACE FUNCTION update_profile_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile verification status and listing permission
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE profiles 
    SET 
      verification_status = 'approved',
      can_create_listings = TRUE,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  ELSIF NEW.status = 'rejected' THEN
    UPDATE profiles 
    SET 
      verification_status = 'rejected',
      can_create_listings = FALSE,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  ELSIF NEW.status = 'submitted' THEN
    UPDATE profiles 
    SET 
      verification_status = 'submitted',
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update profile when verification status changes
CREATE TRIGGER on_verification_status_change
  AFTER UPDATE ON user_verifications
  FOR EACH ROW 
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_profile_verification_status();

-- Create function to handle user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
