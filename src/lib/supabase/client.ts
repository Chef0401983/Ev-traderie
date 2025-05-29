import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app - lazy loaded
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  if (!supabaseInstance) {
    throw new Error('Supabase client not initialized - missing environment variables');
  }
  return supabaseInstance;
}

export const supabase = {
  get from() { return getSupabaseClient().from.bind(getSupabaseClient()); },
  get auth() { return getSupabaseClient().auth; },
  get storage() { return getSupabaseClient().storage; },
  get rpc() { return getSupabaseClient().rpc.bind(getSupabaseClient()); }
};

export { getSupabaseClient as createClient };
export default supabase;
