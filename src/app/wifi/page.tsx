import { Wifi, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WifiReportDialog } from "./wifi-report-dialog";

export const dynamic = 'force-dynamic';

export default async function WifiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, hostels(name)')
    .eq('id', user.id)
    .single();

  if (!profile?.hostel_id) {
    redirect('/onboarding');
  }

  const hostelName = (profile.hostels as any)?.name || 'Hostel';
  const myFloor = profile.floor_id 
    ? (await supabase.from('floors').select('floor_number').eq('id', profile.floor_id).single()).data?.floor_number 
    : '?';

  // Fetch floors and active/recent Wi-Fi issues in parallel
  const [
    { data: floors },
    { data: issues }
  ] = await Promise.all([
    supabase
      .from('floors')
      .select('id, floor_number')
      .eq('hostel_id', profile.hostel_id)
      .order('floor_number'),
      
    supabase
      .from('maintenance_issues')
      .select('*, floors(floor_number)')
      .eq('hostel_id', profile.hostel_id)
      .eq('category', 'wifi')
      .order('created_at', { ascending: false })
  ]);

  const activeIssues = issues?.filter(i => i.status !== 'resolved') || [];
  const isNetworkGood = activeIssues.length === 0;

  // Compute floor-by-floor status
  const floorStatuses = (floors || []).map(floor => {
    const floorIssues = activeIssues.filter(i => i.floor_id === floor.id);
    return {
      ...floor,
      status: floorIssues.length > 0 ? 'attention' : 'operational',
      activeIssues: floorIssues
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* 1. HEADER */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Wi-Fi</h1>
          <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl font-medium">
            {hostelName} Network
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Check network availability and report connectivity problems.
          </p>
        </div>
        <div>
          <WifiReportDialog floorNumber={myFloor} />
        </div>
      </section>

      {/* 2. OVERALL NETWORK STATUS HERO */}
      <div className={`p-8 md:p-10 rounded-3xl border animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both ${isNetworkGood ? 'bg-green-50/50 border-green-200' : 'bg-yellow-50/50 border-yellow-200'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className={`mt-1 p-3 rounded-2xl ${isNetworkGood ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              <Wifi className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`h-2.5 w-2.5 rounded-full ${isNetworkGood ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                <h2 className={`text-sm font-bold uppercase tracking-wider ${isNetworkGood ? 'text-green-700' : 'text-yellow-700'}`}>
                  {isNetworkGood ? 'Operational' : 'Attention Needed'}
                </h2>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                {isNetworkGood ? 'Wi-Fi is working normally' : 'Issues reported on the network'}
              </h3>
              <p className="text-slate-500 mt-1">
                {isNetworkGood 
                  ? 'No active issues have been reported for the hostel network.' 
                  : `${activeIssues.length} active issue(s) reported. Technicians have been notified.`}
              </p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Valid As Of</p>
            <p className="text-slate-600 font-medium mt-1">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500 delay-150 fill-mode-both">
        
        {/* 3. FLOOR / AREA STATUS */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 px-1">Floor Status</h2>
          
          {floorStatuses.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {floorStatuses.map(floor => (
                  <div key={floor.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <span className="font-semibold text-slate-700">Floor {floor.floor_number}</span>
                    {floor.status === 'operational' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Operational</span>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Issue Reported</span>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-100 border-dashed rounded-3xl p-6 text-center text-slate-500 text-sm">
              No floor data available.
            </div>
          )}
        </div>

        {/* 4. ACTIVE & RECENT ISSUES */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 px-1">Recent Wi-Fi Issues</h2>
          
          {issues && issues.length > 0 ? (
            <div className="space-y-4">
              {issues.map(issue => {
                const isActive = issue.status !== 'resolved';
                
                return (
                  <div key={issue.id} className={`bg-white border ${isActive ? 'border-yellow-200 shadow-sm' : 'border-slate-200'} rounded-3xl p-5 md:p-6 transition-all`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {isActive ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-wider">
                              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                              <span>{issue.status.replace('_', ' ')}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                              <span>Resolved</span>
                            </div>
                          )}
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200 px-2 py-1 rounded-md">
                            Floor {issue.floors ? issue.floors.floor_number : '?'}
                          </div>
                        </div>
                        
                        <h3 className={`text-lg font-bold leading-tight ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                          {issue.title.replace('Wi-Fi: ', '')}
                        </h3>
                        
                        <p className={`text-sm leading-relaxed ${isActive ? 'text-slate-600' : 'text-slate-500'}`}>
                          {issue.description}
                        </p>
                      </div>

                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        Reported {new Date(issue.created_at).toLocaleDateString()}
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 border-dashed rounded-3xl">
              <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-sm font-bold text-slate-900">No Wi-Fi issues</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">Everything looks good right now. No active problems have been reported.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
