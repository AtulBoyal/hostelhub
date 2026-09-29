import { 
  WashingMachine, 
  Droplets, 
  Wrench,
  AlertCircle,
  Megaphone,
  ArrowRightLeft,
  Search,
  ArrowRight,
  ChevronRight,
  Clock
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, hostels(name), floors(floor_number)')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return redirect('/onboarding');
  }

  const hostelName = profile.hostels?.name || 'Unknown Hostel';
  const floorNumber = profile.floors?.floor_number || 'Unknown';
  const firstName = profile.name?.split(' ')[0] || 'there';
  const greeting = getGreeting();

  // Fetch Dashboard Data in Parallel
  const [
    { data: machines },
    { data: purifiers },
    { data: wifiIssues },
    { data: maintenance },
    { data: announcements },
    { data: needs }
  ] = await Promise.all([
    supabase
      .from('washing_machines')
      .select('*')
      .eq('floor_id', profile.floor_id)
      .in('status', ['running', 'available'])
      .order('status', { ascending: false })
      .limit(1),
    
    supabase
      .from('purifiers')
      .select('*')
      .eq('floor_id', profile.floor_id)
      .limit(1),

    supabase
      .from('maintenance_issues')
      .select('*')
      .eq('hostel_id', profile.hostel_id)
      .eq('category', 'wifi')
      .in('status', ['reported', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(1),

    supabase
      .from('maintenance_issues')
      .select('*')
      .eq('hostel_id', profile.hostel_id)
      .in('status', ['reported', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(1),

    supabase
      .from('announcements')
      .select('*')
      .eq('hostel_id', profile.hostel_id)
      .order('created_at', { ascending: false })
      .limit(3),

    supabase
      .from('need_have_posts')
      .select('*, profiles(name, avatar_url)')
      .eq('type', 'need')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3)
  ]);

  const activeMachine = machines?.[0] || null;
  const purifier = purifiers?.[0] || null;
  const wifiIssue = wifiIssues?.[0] || null;
  const recentIssue = maintenance?.[0] || null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      
      {/* 1. HERO / WELCOME SECTION */}
      <section className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {greeting}, {firstName} <span className="inline-block origin-bottom hover:rotate-12 transition-transform duration-200 cursor-default">👋</span>
        </h1>
        <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl">
          Here's what's happening around <span className="font-medium text-slate-700">{hostelName}</span> today.
        </p>
      </section>

      {/* 3. QUICK ACTIONS */}
      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/maintenance" className="group relative flex flex-col items-start justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="h-5 w-5 text-blue-500" />
            </div>
            <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors duration-200">
              <Wrench className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 leading-tight">Report Issue</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Maintenance & Repairs</p>
            </div>
          </Link>

          <Link href="/laundry" className="group relative flex flex-col items-start justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="h-5 w-5 text-blue-500" />
            </div>
            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-200">
              <WashingMachine className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 leading-tight">Check Laundry</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Machine Availability</p>
            </div>
          </Link>

          <Link href="/lost-found" className="group relative flex flex-col items-start justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="h-5 w-5 text-blue-500" />
            </div>
            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors duration-200">
              <Search className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 leading-tight">Lost & Found</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Report or find items</p>
            </div>
          </Link>

          <Link href="/need-have" className="group relative flex flex-col items-start justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="h-5 w-5 text-blue-500" />
            </div>
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors duration-200">
              <ArrowRightLeft className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 leading-tight">I Need / I Have</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Community sharing</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 2 & 4. LIVE HOSTEL STATUS */}
      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150 fill-mode-both">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Live Hostel Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Laundry Status Pill */}
          <Link href="/laundry" className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <WashingMachine className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">Laundry (Floor {floorNumber})</p>
                {activeMachine ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`h-2 w-2 rounded-full ${activeMachine.status === 'running' ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`} />
                    <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{activeMachine.status === 'running' ? 'Machine In Use' : 'Machine Available'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Status Unknown</span>
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </Link>

          {/* Water Purifier Status Pill */}
          <Link href="/water" className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Droplets className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">Water (Floor {floorNumber})</p>
                {purifier ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`h-2 w-2 rounded-full ${purifier.status === 'working' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{purifier.status === 'working' ? 'Operational' : 'Needs Repair'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Status Unknown</span>
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </Link>

          {/* Maintenance / Wifi Status Pill */}
          <Link href="/maintenance" className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <AlertCircle className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">Maintenance</p>
                {recentIssue ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Active Issues Found</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">All Clear</span>
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </Link>
        </div>
      </section>

      {/* 5 & 6. SPLIT SECTION (Announcements & Community) */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200 fill-mode-both">
        
        {/* Recent Announcements */}
        <section className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Announcements</h2>
            <Link href="/announcements" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
            {announcements && announcements.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {announcements.map((item) => {
                  const isUrgent = item.priority === "urgent" || item.priority === "important";
                  return (
                    <Link key={item.id} href={`/announcements`} className="block p-5 hover:bg-slate-50/80 transition-colors group">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-4 w-full">
                          <div className={`mt-0.5 h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors ${isUrgent ? 'bg-red-50 text-red-600 group-hover:bg-red-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                            <Megaphone className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                              {item.content || "Click to view full announcement details."}
                            </p>
                            <div className="flex items-center gap-2 mt-3 text-[11px] font-medium text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                              {isUrgent && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="text-red-500 font-bold uppercase tracking-wider">{item.priority}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Megaphone className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-900">No new announcements</p>
                <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
              </div>
            )}
          </div>
        </section>

        {/* Community Needs */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Community Needs</h2>
            <Link href="/need-have" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              Help out
            </Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
            {needs && needs.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {needs.map((item) => (
                  <Link key={item.id} href={`/need-have`} className="block p-5 hover:bg-slate-50/80 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        {item.profiles?.avatar_url ? (
                          <img src={item.profiles.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="font-semibold text-slate-600 text-sm">{item.profiles?.name?.charAt(0)?.toUpperCase() || '?'}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Needs</span>
                          <span className="text-[11px] font-medium text-slate-500 truncate">{item.profiles?.name}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <ArrowRightLeft className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-900">No active needs</p>
                <p className="text-xs text-slate-500 mt-1">Nobody needs anything right now.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
