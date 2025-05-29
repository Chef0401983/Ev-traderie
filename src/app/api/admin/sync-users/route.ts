import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email/helpers';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all verifications without profiles
    const { data: verificationsWithoutProfiles } = await supabase
      .from('user_verifications')
      .select('user_id, verification_type')
      .is('profiles.user_id', null);

    if (!verificationsWithoutProfiles?.length) {
      return NextResponse.json({ 
        message: 'No users need syncing',
        synced: 0
      });
    }

    let syncedCount = 0;
    let emailsSent = 0;

    // Process each user
    for (const verification of verificationsWithoutProfiles) {
      try {
        // Fetch user from Clerk
        const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${verification.user_id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        });

        if (!clerkResponse.ok) {
          console.error(`Failed to fetch user ${verification.user_id} from Clerk`);
          continue;
        }

        const clerkUser = await clerkResponse.json();
        const email = clerkUser.email_addresses?.[0]?.email_address || '';
        const firstName = clerkUser.first_name || '';
        const lastName = clerkUser.last_name || '';

        if (!email) {
          console.error(`No email found for user ${verification.user_id}`);
          continue;
        }

        // Create profile
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

        if (insertError) {
          console.error(`Failed to create profile for ${verification.user_id}:`, insertError);
          continue;
        }

        syncedCount++;

        // Send welcome email
        try {
          const userName = `${firstName} ${lastName}`.trim() || email.split('@')[0];
          const userType = verification.verification_type === 'dealership' ? 'dealership' : 'individual';
          await sendWelcomeEmail(email, userName, userType);
          emailsSent++;
          console.log(`Welcome email sent to: ${email}`);
        } catch (emailError) {
          console.error(`Failed to send welcome email to ${email}:`, emailError);
        }

      } catch (error) {
        console.error(`Error processing user ${verification.user_id}:`, error);
      }
    }

    return NextResponse.json({ 
      message: `Successfully synced ${syncedCount} users and sent ${emailsSent} welcome emails`,
      synced: syncedCount,
      emailsSent: emailsSent
    });

  } catch (error) {
    console.error('Error syncing users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
