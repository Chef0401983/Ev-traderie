-- Add verification columns to existing profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'submitted', 'under_review', 'approved', 'rejected'));

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS can_create_listings BOOLEAN DEFAULT FALSE;

-- Update existing profiles to have default verification status
UPDATE profiles 
SET verification_status = 'pending', can_create_listings = FALSE 
WHERE verification_status IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_can_create_listings ON profiles(can_create_listings);
