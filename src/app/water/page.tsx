import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Droplets } from "lucide-react";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ensurePurifiers } from "../actions/water";
import { ReportProblemDialog } from "./report-problem-dialog";

export const dynamic = 'force-dynamic';

export default async function WaterPage() {
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

  if (!floors) {
    return (
      <div className="space-y-6">
        <PageHeader title="Water Purifiers" description={`${hostelName} · 1 purifier per floor`} />
        <EmptyState icon={Droplets} title="Unable to load purifiers" description="Please try again later." />
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
        // Find latest active issue for this floor
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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Water Purifiers" 
        description={`${hostelName} · 1 purifier per floor`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {floorsData.map((floor) => {
          const p = floor.purifier;
          
          if (!p) return null; // Should not happen due to auto-heal, but type safety

          return (
            <Card key={floor.id} className="overflow-hidden flex flex-col h-full">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Floor {floor.floor_number}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">Water Purifier 1</p>
                  </div>
                  <StatusBadge status={floor.computedStatus === 'working' ? 'success' : 'error'}>
                    {floor.computedStatus === 'working' ? 'Working' : 'Not Working'}
                  </StatusBadge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-5">
                <div className="flex flex-col min-h-[5rem] justify-center space-y-2 flex-1">
                  
                  {/* WORKING */}
                  {floor.computedStatus === 'working' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Ready to use</span>
                    </div>
                  )}

                  {/* NOT WORKING */}
                  {floor.computedStatus === 'not_working' && (
                    <div className="pt-1">
                      {floor.activeIssue ? (
                        <div className="text-sm space-y-2">
                          <p className="font-medium text-slate-700">{floor.activeIssue.title}</p>
                          <p className="text-slate-500">Reported: {new Date(floor.activeIssue.created_at).toLocaleDateString()} {new Date(floor.activeIssue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <div className="flex justify-start pt-1">
                            <Link href="/maintenance" className={buttonVariants({ variant: "outline", size: "sm" })}>
                              View Issue
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">Purifier out of order</span>
                          <ReportProblemDialog 
                            purifierId={p.id} 
                            floorId={floor.id} 
                            hostelId={profile.hostel_id} 
                            floorNumber={floor.floor_number} 
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Problem reporting link (only show if not already marked not working) */}
                {floor.computedStatus !== 'not_working' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <div className="w-full sm:w-auto">
                      <ReportProblemDialog 
                        purifierId={p.id} 
                        floorId={floor.id} 
                        hostelId={profile.hostel_id} 
                        floorNumber={floor.floor_number} 
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
