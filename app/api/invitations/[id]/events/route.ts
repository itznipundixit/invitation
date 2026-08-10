import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createAdminClient();
    
    const { data, error } = await supabase
      .from('invitation_events')
      .insert([
        {
          invitation_id: id,
          event_type: body.event_type,
          metadata: body.metadata || {}
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error logging event:', error);
      return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
