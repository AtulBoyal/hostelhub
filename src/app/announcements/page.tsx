import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('hostel_id')
    .eq('id', user.id)
    .single();

  if (!profile?.hostel_id) {
    redirect('/onboarding');
  }

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('hostel_id', profile.hostel_id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hostel Announcements"
        description="Official updates and notices from the hostel administration."
      />

      <div className="space-y-4">
        {announcements && announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <p className="text-sm text-slate-500">{new Date(announcement.created_at).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge
                    status={
                      announcement.priority === "urgent"
                        ? "error"
                        : announcement.priority === "important"
                        ? "warning"
                        : "info"
                    }
                    className="capitalize"
                  >
                    {announcement.priority}
                  </StatusBadge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{announcement.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState icon={Bell} title="No announcements" description="There are no recent announcements." />
        )}
      </div>
    </div>
  );
}
