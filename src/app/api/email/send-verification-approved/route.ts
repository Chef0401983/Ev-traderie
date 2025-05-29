import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createClient } from '@/lib/supabase/server';
import { queueEmail } from '@/lib/email/queue';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    
    // Verify admin status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { verificationId } = await request.json();

    if (!verificationId) {
      return NextResponse.json({ error: 'Verification ID required' }, { status: 400 });
    }

    // Get verification details
    const { data: verification, error } = await supabase
      .from('user_verifications')
      .select(`
        *,
        profiles (
          email,
          full_name
        )
      `)
      .eq('id', verificationId)
      .single();

    if (error || !verification) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
    }

    // Queue the email
    const result = await queueEmail({
      to: verification.profiles.email,
      template: 'verification-approved',
      data: {
        name: verification.profiles.full_name || 'User',
      },
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Verification approval email queued',
        queueId: result.queueId 
      });
    } else {
      return NextResponse.json({ 
        error: result.error || 'Failed to queue email' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending verification approved email:', error);
    return NextResponse.json({ 
      error: 'Failed to send email' 
    }, { status: 500 });
  }
}
