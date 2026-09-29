import { createClient } from "@/lib/supabase/server";
import { getCachedAuthUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import { CommunityClient } from "./community-client";
import { NewPostDialog } from "./new-post-dialog";

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const { user, profile } = await getCachedAuthUser();
  const supabase = await createClient();

  if (!user || !profile?.hostel_id) {
    redirect(user ? '/onboarding' : '/login');
  }

  const hostelName = profile.hostels?.name || 'Hostel';

  const { data: posts } = await supabase
    .from('community_posts')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* 1. HEADER */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Community</h1>
          <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl font-medium">
            Connect with {hostelName} residents, share useful information, and stay involved.
          </p>
        </div>
        <div>
          <NewPostDialog />
        </div>
      </section>

      {/* 2. CLIENT-SIDE FEED (Search, Filters, Grid) */}
      <CommunityClient initialPosts={posts || []} />
      
    </div>
  );
}
