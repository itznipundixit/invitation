import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createAdminClient();
    
    const { data, error } = await supabase
      .from('invitations')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating invitation:', error);
      return NextResponse.json({ error: 'Failed to update invitation' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createAdminClient();
    
    const { data, error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      console.error('Error deleting invitation:', error);
      return NextResponse.json({ error: 'Failed to delete invitation' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.warn('No rows were deleted. This might be due to missing SUPABASE_SERVICE_ROLE_KEY and RLS policies.');
      return NextResponse.json({ error: 'No invitation was deleted. Check your Supabase RLS policies or add SUPABASE_SERVICE_ROLE_KEY to your .env file.' }, { status: 403 });
    }

    return NextResponse.json({ success: true, deletedCount: data.length });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
