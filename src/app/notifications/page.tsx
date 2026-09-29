import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MarkReadButton } from "./mark-read-button";

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const hasUnread = notifications?.some(n => !n.is_read) || false;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with alerts and messages."
        actions={hasUnread ? <MarkReadButton /> : undefined}
      />

      <div className="space-y-3 max-w-3xl">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card key={notification.id} className={notification.is_read ? "bg-slate-50/50" : "border-blue-200 shadow-sm"}>
              <CardContent className="p-4 flex items-start gap-4">
                {!notification.is_read && <div className="mt-2 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />}
                <div className="flex-1">
                  <h4 className={`text-base font-semibold ${notification.is_read ? "text-slate-700" : "text-slate-900"}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{new Date(notification.created_at).toLocaleDateString()} {new Date(notification.created_at).toLocaleTimeString()}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
        )}
      </div>
    </div>
  );
}
