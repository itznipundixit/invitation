import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DateInvitation } from '@/types/invitation';
import AdminDashboardClient from './AdminDashboardClient';

export const revalidate = 0; // Disable caching

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const { data: invitations, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return <div>Error loading invitations</div>;
  }

  const typedInvitations = (invitations || []) as DateInvitation[];

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <AdminDashboardClient initialInvitations={typedInvitations} />
      </div>
    </div>
  );
}
