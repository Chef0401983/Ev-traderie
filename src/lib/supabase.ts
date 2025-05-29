import { createClient, SupabaseClient } from '@supabase/supabase-js';

// These environment variables need to be added to your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get user data from Supabase
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

// Helper function to create or update user profile
export async function upsertUserProfile(profile: any) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'user_id' })
    .select();
  
  if (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }
  
  return data;
}

// Helper function to sync Clerk user to Supabase
export async function syncUserToSupabase(clerkUser: any) {
  if (!clerkUser?.id) return null;
  
  const userProfile = {
    user_id: clerkUser.id,
    email: clerkUser.emailAddresses?.[0]?.emailAddress,
    full_name: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
    avatar_url: clerkUser.imageUrl,
    user_type: clerkUser.publicMetadata?.userType || 'individual',
    updated_at: new Date().toISOString(),
  };
  
  return await upsertUserProfile(userProfile);
}
