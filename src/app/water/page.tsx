import { Droplets, AlertTriangle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCachedAuthUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import { ensurePurifiers } from "../actions/water";
import { PurifierDetailDialog } from "./purifier-detail-dialog";

export const dynamic = 'force-dynamic';

export default async function WaterPage() {
  const { user, profile } = await getCachedAuthUser();
  const supabase = await createClient();

  if (!user || !profile?.hostel_id) {
    redirect(user ? '/onboarding' : '/login');
  }

  // Auto-heal the database: ensures exactly 1 purifier per floor for this hostel exists
  await ensurePurifiers(profile.hostel_id);

  const hostelName = (profile.hostels as any)?.name || 'Hostel';

  // Fetch all floors and active maintenance issues in parallel
  const [
    { data: floors },
    { data: issues }
  ] = await Promise.all([
    supabase
      .from('floors')
      .select('*, purifiers(*)')
      .eq('hostel_id', profile.hostel_id)
      .order('floor_number'),
      
    supabase
      .from('maintenance_issues')
      .select('id, floor_id, title, created_at, status')
      .eq('hostel_id', profile.hostel_id)
      .like('title', 'Water purifier problem%')
      .in('status', ['reported', 'in_progress'])
      .order('created_at', { ascending: false })
  ]);

  if (!floors || floors.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        <section className="mt-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Water Purifiers</h1>
        </section>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 border-dashed rounded-3xl">
          <Droplets className="h-10 w-10 text-slate-300 mb-4" />
          <p className="text-sm font-medium text-slate-900">Unable to load purifiers</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
        </div>
      </div>
    )
  }

  const floorsData = floors.map(floor => {
    // Expect exactly 1 purifier per floor based on our requirement
    const purifier = (floor.purifiers as any)?.[0] || null;
    let computedStatus = 'working';
    let activeIssue = null;

    if (purifier) {
      if (purifier.status === 'not_working') {
        computedStatus = 'not_working';
        activeIssue = issues?.find(i => i.floor_id === floor.id) || null;
      }
    }

    return {
      ...floor,
      purifier,
      computedStatus,
      activeIssue
    }
  });

  const workingCount = floorsData.filter(f => f.computedStatus === 'working').length;
  const brokenCount = floorsData.filter(f => f.computedStatus === 'not_working').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* 1. HEADER */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Water Purifiers</h1>
          <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl font-medium">
            {hostelName}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Check purifier status and report water-quality issues around your hostel.
          </p>
        </div>
      </section>

      {/* 2. OVERALL STATUS */}
      <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm cursor-default">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-xs font-semibold text-slate-700">Operational</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-md font-bold">{workingCount}</span>
        </div>
        
        {brokenCount > 0 && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm cursor-default">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">Not Working</span>
            <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-md font-bold">{brokenCount}</span>
          </div>
        )}
      </div>

      {/* 3. PURIFIER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-500 delay-150 fill-mode-both">
        {floorsData.map((floor) => {
          const p = floor.purifier;
          if (!p) return null;

          const isWorking = floor.computedStatus === 'working';

          return (
            <PurifierDetailDialog key={floor.id} floor={floor} hostelId={profile.hostel_id}>
              <div className={`group text-left w-full cursor-pointer bg-white border ${isWorking ? 'border-slate-200 hover:border-blue-300' : 'border-red-200 hover:border-red-300'} rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[160px]`}>
                
                <div className="space-y-4">
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Floor {floor.floor_number}
                      </p>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">
                        Water Purifier 1
                      </h3>
                    </div>
                    
                    {isWorking ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-green-100 bg-green-50/50">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">Operational</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-red-100 bg-red-50/50">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Not Working</span>
                      </div>
                    )}
                  </div>
                  
                  {!isWorking && floor.activeIssue && (
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                      <p className="text-xs font-semibold text-red-800 line-clamp-1">{floor.activeIssue.title}</p>
                      <p className="text-[10px] text-red-600/80 mt-1">Reported {new Date(floor.activeIssue.created_at).toLocaleDateString()}</p>
                    </div>
                  )}

                  {isWorking && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-center">
                      <p className="text-xs font-medium text-slate-500">Ready to use</p>
                    </div>
                  )}
                  
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-end">
                  <span className={`text-xs font-bold transition-opacity flex items-center gap-1 -translate-x-2 group-hover:translate-x-0 duration-200 ${isWorking ? 'text-blue-600' : 'text-red-600'}`}>
                    View Details <span className="text-[14px]">→</span>
                  </span>
                </div>

              </div>
            </PurifierDetailDialog>
          )
        })}
      </div>

    </div>
  );
}
