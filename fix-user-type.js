// Quick script to fix your user type
const fetch = require('node-fetch');

async function fixUserType() {
  try {
    // First, let's get your user ID from the current session
    // You'll need to replace 'YOUR_USER_ID' with your actual Clerk user ID
    const userIdToUpdate = 'user_2qGvJMHIYBYPKJKbJNLLSVpPJrk'; // Your Clerk user ID
    
    const response = await fetch('http://localhost:3000/api/admin/update-user-type', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You'll need to add your session token here
      },
      body: JSON.stringify({
        targetUserId: userIdToUpdate,
        userType: 'individual'
      })
    });

    const result = await response.json();
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Note: This script needs to be run with proper authentication
console.log('To fix your user type, you need to:');
console.log('1. Get your Clerk user ID from the browser console');
console.log('2. Make an authenticated request to the update-user-type endpoint');
console.log('3. Or use the browser to make the request');
