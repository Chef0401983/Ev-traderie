'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

/**
 * Updates the user's publicMetadata with their selected user type
 */
export const updateUserType = async (userType: 'individual' | 'dealership') => {
  // Get the current user ID from the auth context
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Not authenticated' };
  }

  try {
    // Use clerkClient to update the user's publicMetadata
    const user = await clerkClient.users.updateUser(userId, {
      publicMetadata: { userType },
    });

    return { 
      success: true, 
      userType,
      message: 'User type updated successfully' 
    };
  } catch (error) {
    console.error('Error updating user type:', error);
    return { 
      success: false, 
      error: 'Failed to update user type. Please try again.' 
    };
  }
};
