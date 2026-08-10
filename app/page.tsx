import { InvitationFlow } from '@/components/invitation/InvitationFlow';

export default function Home() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-pink-50 to-pink-100">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>
      
      <div className="z-10 w-full max-w-4xl mx-auto">
        <InvitationFlow />
      </div>
    </main>
  );
}
