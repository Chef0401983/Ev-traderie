import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { sendEmail, generateMessageNotificationEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/messages - Get user's messages
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    console.log('Messages API - User ID:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Supabase client inside the function to avoid build-time issues
    const supabase = createServiceRoleClient();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    console.log('Fetching messages for user:', userId);

    // Get messages where user is either sender or recipient
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(
          user_id,
          full_name,
          email,
          user_type
        ),
        recipient:profiles!messages_recipient_id_fkey(
          user_id,
          full_name,
          email,
          user_type
        ),
        vehicle:vehicles(
          id,
          make,
          model,
          year,
          title
        )
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    console.log('Messages query result:', { messages, error });

    if (error) {
      console.error('Error fetching messages:', error);
      // If table doesn't exist, return empty array
      if (error.code === '42P01') {
        return NextResponse.json({ 
          messages: [], 
          total: 0,
          page,
          limit,
          info: 'Messages table not yet created'
        });
      }
      return NextResponse.json({ error: 'Failed to fetch messages', details: error.message }, { status: 500 });
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);

    if (countError && countError.code !== '42P01') {
      console.error('Error counting messages:', countError);
    }

    return NextResponse.json({
      messages: messages || [],
      total: count || 0,
      page,
      limit
    });
  } catch (error) {
    console.error('Error in messages API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Supabase client inside the function to avoid build-time issues
    const supabase = createServiceRoleClient();

    const body = await request.json();
    const { recipient_id, vehicle_id, subject, content } = body;

    if (!recipient_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get sender profile
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (!senderProfile) {
      return NextResponse.json({ error: 'Sender profile not found' }, { status: 404 });
    }

    // Create message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        sender_id: userId,
        recipient_id,
        vehicle_id,
        subject: subject || 'Vehicle Inquiry',
        content,
        is_read: false
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(
          user_id,
          full_name,
          email,
          user_type
        ),
        recipient:profiles!messages_recipient_id_fkey(
          user_id,
          full_name,
          email,
          user_type
        ),
        vehicle:vehicles(
          id,
          make,
          model,
          year
        )
      `)
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    // Send email notification to recipient
    try {
      if (message.recipient?.email) {
        const vehicleInfo = message.vehicle 
          ? `${message.vehicle.year} ${message.vehicle.make} ${message.vehicle.model}`
          : undefined;

        const dashboardUrl = message.recipient.user_type === 'dealership' 
          ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/dashboard/dealership/messages`
          : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/dashboard/individual/messages`;

        const emailContent = generateMessageNotificationEmail({
          recipientName: message.recipient.full_name || 'User',
          senderName: message.sender?.full_name || 'Unknown',
          senderType: message.sender?.user_type || 'individual',
          subject: message.subject,
          content: message.content,
          vehicleInfo,
          dashboardUrl,
        });

        await sendEmail({
          to: message.recipient.email,
          subject: `New message on EV-Trader: ${message.subject}`,
          html: emailContent.html,
          text: emailContent.text,
        });

        console.log('Email notification sent to:', message.recipient.email);
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the message creation if email fails
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error in messages API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
