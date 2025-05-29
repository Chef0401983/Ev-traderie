'use client';

import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';

export default function SupabaseProfileExample() {
  const { supabaseUser, loading, error, updateUserProfile } = useSupabase();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Start editing with current data
  const startEditing = () => {
    if (supabaseUser) {
      setFormData({
        full_name: supabaseUser.full_name || '',
      });
    }
    setIsEditing(true);
  };

  if (loading) {
    return <div className="p-4 card">Loading profile data...</div>;
  }

  if (error) {
    return <div className="p-4 card text-red-600">Error: {error.message}</div>;
  }

  if (!supabaseUser) {
    return (
      <div className="p-4 card">
        <p>No profile data found. This could be because:</p>
        <ul className="list-disc ml-5 mt-2">
          <li>You're not signed in</li>
          <li>Your Clerk user hasn't been synced to Supabase yet</li>
          <li>The Supabase connection isn't properly configured</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="p-6 card">
      <h2 className="text-xl font-bold mb-4">Supabase Profile Data</h2>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-medium">{supabaseUser.user_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{supabaseUser.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{supabaseUser.full_name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">User Type</p>
              <p className="font-medium capitalize">{supabaseUser.user_type || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">
                {new Date(supabaseUser.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">
                {new Date(supabaseUser.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <button
            onClick={startEditing}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-opacity-90"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
