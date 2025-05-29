'use client';

import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

// Types for our hook
type SupabaseUser = {
  id: string;
  user_id: string; // Add user_id field to match the database schema
  email: string;
  full_name: string;
  avatar_url: string;
  user_type: string;
  created_at: string;
  updated_at: string;
};

export function useSupabase() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch user data from Supabase when Clerk user is loaded
  useEffect(() => {
    async function fetchSupabaseUser() {
      if (!isClerkLoaded || !clerkUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Query Supabase for the user profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', clerkUser.id)
          .single();

        if (error) {
          throw error;
        }

        setSupabaseUser(data);
      } catch (err) {
        console.error('Error fetching Supabase user:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchSupabaseUser();
  }, [clerkUser, isClerkLoaded]);

  // Function to update user data in Supabase
  const updateUserProfile = async (updates: Partial<SupabaseUser>) => {
    if (!clerkUser) {
      throw new Error('No authenticated user');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', clerkUser.id)
        .select();

      if (error) {
        throw error;
      }

      setSupabaseUser(data[0]);
      return data[0];
    } catch (err) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  };

  return {
    supabase,         // The Supabase client for custom queries
    supabaseUser,     // The user data from Supabase
    loading,          // Loading state
    error,            // Any error that occurred
    updateUserProfile // Function to update the user profile
  };
}
