import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// POST /api/setup/messages-table - Create messages table
export async function POST() {
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

    // Check if user is admin (optional - for now allow any authenticated user)
    // In production, you'd want to restrict this to admins only

    const createTableSQL = `
      -- Messages table for user communication
      CREATE TABLE IF NOT EXISTS messages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        sender_id TEXT NOT NULL,
        recipient_id TEXT NOT NULL,
        vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
        subject TEXT NOT NULL DEFAULT 'Vehicle Inquiry',
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_messages_vehicle_id ON messages(vehicle_id);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);

      -- RLS policies
      ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
      DROP POLICY IF EXISTS "Users can send messages" ON messages;
      DROP POLICY IF EXISTS "Recipients can mark messages as read" ON messages;

      -- Users can see messages where they are sender or recipient
      CREATE POLICY "Users can view their own messages" ON messages
        FOR SELECT USING (
          sender_id = auth.uid() OR recipient_id = auth.uid()
        );

      -- Users can insert messages where they are the sender
      CREATE POLICY "Users can send messages" ON messages
        FOR INSERT WITH CHECK (
          sender_id = auth.uid()
        );

      -- Users can update messages where they are the recipient (for marking as read)
      CREATE POLICY "Recipients can mark messages as read" ON messages
        FOR UPDATE USING (
          recipient_id = auth.uid()
        ) WITH CHECK (
          recipient_id = auth.uid()
        );
    `;

    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });

    if (error) {
      console.error('Error creating messages table:', error);
      return NextResponse.json({ error: 'Failed to create messages table', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Messages table created successfully' });
  } catch (error) {
    console.error('Error in setup API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
