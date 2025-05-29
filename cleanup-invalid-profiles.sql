-- Clean up profiles with empty or null user_id values
-- These were created due to authentication issues

DELETE FROM profiles 
WHERE user_id IS NULL 
   OR user_id = '' 
   OR LENGTH(TRIM(user_id)) = 0;

-- Verify the cleanup
SELECT COUNT(*) as remaining_profiles FROM profiles;
SELECT * FROM profiles WHERE user_id IS NOT NULL AND user_id != '';
