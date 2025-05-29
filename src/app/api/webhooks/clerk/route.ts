import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email/helpers';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error: Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';
  
  // If there's no webhook secret, error out
  if (!webhookSecret) {
    return new NextResponse('Error: Missing webhook secret', { status: 500 });
  }

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error verifying webhook', { status: 400 });
  }

  // Get the event type
  const eventType = evt.type;

  // Handle the event based on the type
  try {
    switch (eventType) {
      case 'user.created':
        await syncUserToSupabase(evt.data, true); // true = send welcome email
        break;
      case 'user.updated':
        await syncUserToSupabase(evt.data, false); // false = don't send welcome email
        break;
      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return new NextResponse('Webhook received', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}

// Function to sync user data to Supabase
async function syncUserToSupabase(userData: any, sendWelcome: boolean = false) {
  if (!userData?.id) {
    console.error('No user ID provided for syncing');
    return;
  }

  const supabase = createServiceRoleClient();
  
  // Extract email address properly
  const email = userData.email_addresses?.[0]?.email_address || '';
  const firstName = userData.first_name || '';
  const lastName = userData.last_name || '';
  
  if (!email) {
    console.error('No email address found for user:', userData.id);
    return;
  }

  // Extract relevant user data
  const userProfile = {
    user_id: userData.id,
    email: email,
    full_name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
    avatar_url: userData.image_url || null,
    user_type: userData.public_metadata?.userType || 'individual',
    verification_status: 'pending',
    can_create_listings: false,
    is_admin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('Syncing user to Supabase:', { user_id: userData.id, email });

  // Upsert user data into Supabase
  const { data, error } = await supabase
    .from('profiles')
    .upsert(userProfile, { onConflict: 'user_id' })
    .select();

  if (error) {
    console.error('Error syncing user to Supabase:', error);
    throw error;
  }

  console.log('User synced successfully:', data);

  // Send welcome email for new users
  if (sendWelcome && email) {
    try {
      const userName = firstName || email.split('@')[0];
      const userType = userProfile.user_type;
      
      await sendWelcomeEmail(email, userName, userType);
      console.log('Welcome email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the webhook if email fails
    }
  }

  return data;
}
