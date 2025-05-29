import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client inside function
    const supabase = createServiceRoleClient();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all verifications with profile information
    const { data: verifications, error } = await supabase
      .from('user_verifications')
      .select(`
        *,
        profiles (
          full_name,
          email,
          user_type
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching verifications:', error);
      return NextResponse.json({ error: 'Failed to fetch verifications' }, { status: 500 });
    }

    // For verifications without profiles, try to fetch user data from Clerk
    const verificationsWithUserData = await Promise.all(
      verifications.map(async (verification) => {
        let userProfile = verification.profiles;
        
        if (!verification.profiles) {
          try {
            const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${verification.user_id}`, {
              headers: {
                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
              },
            });
            
            if (clerkResponse.ok) {
              const clerkUser = await clerkResponse.json();
              const email = clerkUser.email_addresses?.[0]?.email_address || '';
              const firstName = clerkUser.first_name || '';
              const lastName = clerkUser.last_name || '';
              
              // Create the missing profile in the database
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  user_id: verification.user_id,
                  email: email,
                  full_name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
                  user_type: verification.verification_type === 'dealership' ? 'dealership' : 'individual',
                  verification_status: 'pending',
                  can_create_listings: false,
                  is_admin: false,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                });

              if (!insertError) {
                console.log('Profile created for verification user:', verification.user_id);
              }
              
              userProfile = {
                full_name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
                email: email,
                user_type: verification.verification_type === 'dealership' ? 'dealership' : 'individual'
              };
            }
          } catch (error) {
            console.error('Error fetching user from Clerk:', error);
          }
        }

        // Map database fields to frontend expected fields
        return {
          ...verification,
          // Map actual database fields to what frontend expects
          document_front_url: verification.photo_id_url,
          document_back_url: verification.proof_of_address_url,
          selfie_url: verification.business_registration_url, // For dealerships, show business registration as third document
          document_type: verification.photo_id_type || 'Unknown',
          document_number: verification.business_registration_number || 'N/A',
          full_name: userProfile?.full_name || 'Unknown User',
          email: userProfile?.email || 'Unknown Email',
          submitted_at: verification.created_at,
          profile: userProfile, // Frontend expects 'profile' (singular)
          // Add the actual field names for better debugging
          photo_id_url: verification.photo_id_url,
          proof_of_address_url: verification.proof_of_address_url,
          business_registration_url: verification.business_registration_url
        };
      })
    );

    return NextResponse.json({ verifications: verificationsWithUserData });
  } catch (error) {
    console.error('Error in verifications API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
