import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data from request body
    const { email, fullName, avatarUrl } = await request.json();

    // Initialize Supabase with service role key (server-side only)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json({ 
        success: true, 
        profile: existingProfile,
        message: 'Profile already exists'
      });
    }

    // Create new profile
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        email: email || '',
        full_name: fullName || '',
        avatar_url: avatarUrl || '',
        user_type: 'individual'
      })
      .select()
      .single();

    if (error) {
      console.error('Profile creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      profile: newProfile,
      message: 'Profile created successfully'
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
