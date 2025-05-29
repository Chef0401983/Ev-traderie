import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// PATCH /api/messages/[id]/read - Mark message as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Create Supabase client inside function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: messageId } = await params;

    // Update message as read, but only if user is the recipient
    const { data: message, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .eq('recipient_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error marking message as read:', error);
      return NextResponse.json({ error: 'Failed to mark message as read' }, { status: 500 });
    }

    if (!message) {
      return NextResponse.json({ error: 'Message not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error in mark as read API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
