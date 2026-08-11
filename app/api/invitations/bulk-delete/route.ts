import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    
    const { data, error } = await supabase
      .from('invitations')
      .delete()
      .in('id', ids)
      .select('id');

    if (error) {
      console.error('Error in bulk delete:', error);
      return NextResponse.json({ error: 'Failed to delete invitations' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.warn('No rows were deleted. This might be due to missing SUPABASE_SERVICE_ROLE_KEY and RLS policies.');
      return NextResponse.json({ error: 'No invitations were deleted. Check your Supabase RLS policies or add SUPABASE_SERVICE_ROLE_KEY to your .env file.' }, { status: 403 });
    }

    return NextResponse.json({ success: true, deletedCount: data.length });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
