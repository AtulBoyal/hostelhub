import { createClient } from "@/lib/supabase/server";
import { getCachedAuthUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import { MarkReadButton } from "./mark-read-button";
import { NotificationsClient } from "./notifications-client";

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const { user } = await getCachedAuthUser();
  const supabase = await createClient();

  if (!user) {
    redirect('/login');
  }

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      
      {/* 1. HEADER */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <div className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full border border-blue-200">
                {unreadCount} unread
              </div>
            )}
          </div>
          <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl font-medium">
            Stay up to date with activity that matters to you.
          </p>
        </div>
        <div>
          {unreadCount > 0 && <MarkReadButton />}
        </div>
      </section>

      {/* 2. FEED */}
      <NotificationsClient initialNotifications={notifications || []} />
      
    </div>
  );
}
