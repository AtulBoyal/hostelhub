import { createClient } from "@/lib/supabase/server";
import { getCachedAuthUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import { AnnouncementsClient } from "./announcements-client";

export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage() {
  const { user, profile } = await getCachedAuthUser();
  const supabase = await createClient();

  if (!user || !profile?.hostel_id) {
    redirect(user ? '/onboarding' : '/login');
  }

  const hostelName = profile.hostels?.name || 'Hostel';

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('hostel_id', profile.hostel_id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* 1. HEADER */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Announcements</h1>
          <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl font-medium">
            Stay updated with important news and notices from {hostelName}.
          </p>
        </div>
      </section>

      {/* 2. CLIENT-SIDE FEED (Search, Filters, Pinned, List) */}
      <AnnouncementsClient initialAnnouncements={announcements || []} />
      
    </div>
  );
}
