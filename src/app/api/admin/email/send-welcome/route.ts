export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID required' }, { status: 400 });
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('email, full_name, user_type')
      .eq('user_id', targetUserId)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Send welcome email
    const userName = userProfile.full_name || userProfile.email.split('@')[0];
    await sendWelcomeEmail(userProfile.email, userName, userProfile.user_type || 'individual');

    return NextResponse.json({ 
      message: 'Welcome email sent successfully',
      email: userProfile.email
    });

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

