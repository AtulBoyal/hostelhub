import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MaintenanceClient } from "./maintenance-client";
import { NewIssueDialog } from "./new-issue-dialog";

export const dynamic = 'force-dynamic';

export default async function MaintenancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('hostel_id, hostels(name), floors(floor_number)')
    .eq('id', user.id)
    .single();

  if (!profile?.hostel_id) {
    redirect('/onboarding');
  }

  // Fetch all issues for this hostel
  const { data: issues } = await supabase
    .from('maintenance_issues')
    .select('*, floors(floor_number), profiles(name)')
    .eq('hostel_id', profile.hostel_id)
    .order('created_at', { ascending: false });

  const hostelName = (profile.hostels as any)?.name || 'Hostel';
  const myFloor = (profile.floors as any)?.floor_number || '?';
  const totalIssues = issues || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* 1. HEADER */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Maintenance</h1>
          <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl font-medium">
            {hostelName}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Report and track problems around your hostel.
          </p>
        </div>
        <div>
          <NewIssueDialog 
            floorNumber={myFloor} 
            hostelId={profile.hostel_id} 
          />
        </div>
      </section>

      {/* Client component for Status Summary, Filters, and List */}
      <MaintenanceClient initialIssues={totalIssues} currentUserId={user.id} />
      
    </div>
  );
}
