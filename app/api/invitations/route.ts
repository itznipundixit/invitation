import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    
    // Attempt to get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // We can generate a session id in frontend or just rely on the inserted UUID
    const { data, error } = await supabase
      .from('invitations')
      .insert([
        { user_agent: userAgent }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating invitation:', error);
      return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
