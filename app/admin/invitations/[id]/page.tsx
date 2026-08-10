import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminInvitationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const { data: invitation, error: invError } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .single();

  if (invError || !invitation) {
    return <div className="p-8 text-black">Invitation not found.</div>;
  }

  const { data: events, error: eventsError } = await supabase
    .from('invitation_events')
    .select('*')
    .eq('invitation_id', id)
    .order('created_at', { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link href="/admin" className="text-pink-600 hover:underline mb-4 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Invitation Details</h1>
          <p className="text-gray-500 text-sm mt-1">ID: {invitation.id}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {invitation.final_confirmed ? 'Final Confirmed 🎉' : invitation.accepted ? 'Accepted ✅' : 'Pending ⏳'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created At</h3>
              <p className="mt-1 text-lg text-gray-900">{new Date(invitation.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Selected Day</h3>
              <p className="mt-1 text-lg text-gray-900">{invitation.selected_day || 'Not selected'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Selected Time</h3>
              <p className="mt-1 text-lg text-gray-900">{invitation.selected_time || 'Not selected'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Food Choice</h3>
              <p className="mt-1 text-lg text-gray-900">{invitation.food_choice || 'Not selected'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">User Agent</h3>
              <p className="mt-1 text-sm text-gray-500 truncate" title={invitation.user_agent}>{invitation.user_agent || 'Unknown'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Event Timeline</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {events?.map((event: any, index: number) => (
                <li key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-pink-100 text-pink-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    ⚡
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-gray-900">{event.event_type}</div>
                      <time className="font-mono text-xs text-gray-500">{new Date(event.created_at).toLocaleTimeString()}</time>
                    </div>
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                </li>
              ))}
              {!events?.length && (
                <li className="text-gray-500 text-center py-4 relative z-10 bg-white">No events recorded yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
