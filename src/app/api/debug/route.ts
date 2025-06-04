export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    return NextResponse.json({
      clerkUserId: userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in debug API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
