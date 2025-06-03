export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email/helpers';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      return NextResponse.json({ message: 'Profile already exists' });
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        email,
        full_name: `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0],
        user_type: 'individual',
        verification_status: 'pending',
        can_create_listings: false,
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
    }

    // Send welcome email
    const userName = firstName || email.split('@')[0];
    const userType = 'individual';
    
    try {
      await sendWelcomeEmail(email, userName, userType);
      console.log('Welcome email sent successfully to:', email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      message: 'Profile created and welcome email sent',
      profile 
    });

  } catch (error) {
    console.error('Welcome API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

