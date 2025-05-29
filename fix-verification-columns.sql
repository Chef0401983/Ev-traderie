-- This script adds the missing verification columns to the profiles table
-- Run this in your Supabase SQL Editor

-- Add verification_status column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'verification_status') THEN
        ALTER TABLE profiles 
        ADD COLUMN verification_status TEXT DEFAULT 'pending' 
        CHECK (verification_status IN ('pending', 'submitted', 'under_review', 'approved', 'rejected'));
    END IF;
END $$;

-- Add can_create_listings column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'can_create_listings') THEN
        ALTER TABLE profiles 
        ADD COLUMN can_create_listings BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Update existing profiles to have default values
UPDATE profiles 
SET verification_status = COALESCE(verification_status, 'pending'),
    can_create_listings = COALESCE(can_create_listings, FALSE);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_can_create_listings ON profiles(can_create_listings);

-- Verify the columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('verification_status', 'can_create_listings');
