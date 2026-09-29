import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ensureWashingMachines } from "../actions/laundry";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { WashingMachine } from "lucide-react";
import Link from "next/link";
import { BookMachineDialog } from "./book-machine-dialog";
import { CancelBookingDialog } from "./cancel-booking-dialog";
import { ReportProblemDialog } from "./report-problem-dialog";
import { Button, buttonVariants } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function LaundryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile for hostel_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('hostel_id, hostels(name)')
    .eq('id', user.id)
    .single();

  if (!profile?.hostel_id) {
    redirect('/onboarding');
  }

  // Auto-heal the database: ensures exactly 1 washing machine per floor for this hostel exists
  await ensureWashingMachines(profile.hostel_id);

  const hostelName = (profile.hostels as any)?.name || 'Hostel';

  // Fetch all floors and active maintenance issues in parallel
  const [
    { data: floors },
    { data: issues }
  ] = await Promise.all([
    supabase
      .from('floors')
      .select('*, washing_machines(*, profiles(name))')
      .eq('hostel_id', profile.hostel_id)
      .order('floor_number'),
      
    supabase
      .from('maintenance_issues')
      .select('id, floor_id, title, created_at, status')
      .eq('hostel_id', profile.hostel_id)
      .like('title', 'Washing machine problem%')
      .in('status', ['reported', 'in_progress'])
      .order('created_at', { ascending: false })
  ]);

  if (!floors) {
    return (
      <div className="space-y-6">
        <PageHeader title="Laundry Machines" description={`${hostelName} · 1 machine per floor`} />
        <EmptyState icon={WashingMachine} title="Unable to load laundry machines" description="Please try again later." />
      </div>
    )
  }

  // Find the active booking for the current user
  let activeBooking: any = null;
  const now = new Date();

  const floorsData = floors.map(floor => {
    // Expect exactly 1 machine per floor based on our requirement
    const machine = (floor.washing_machines as any)?.[0] || null;
    let computedStatus = 'available';
    let timeRemaining = null;
    let expectedFinish = null;
    let isMyBooking = false;
    let activeIssue = null;

    if (machine) {
      if (machine.status === 'out_of_service') {
        computedStatus = 'not_working';
        // Find latest active issue for this floor
        activeIssue = issues?.find(i => i.floor_id === floor.id) || null;
      } else if (machine.status === 'running' || (machine.expected_finish_time && new Date(machine.expected_finish_time) > now)) {
        // If it's running but finish time has passed, treat as available
        if (machine.expected_finish_time && new Date(machine.expected_finish_time) <= now) {
          computedStatus = 'available';
        } else {
          computedStatus = 'in_use';
          expectedFinish = machine.expected_finish_time ? new Date(machine.expected_finish_time) : null;
          if (machine.started_by === user.id) {
            isMyBooking = true;
          }
        }
      }
      
      if (isMyBooking && computedStatus === 'in_use') {
        activeBooking = {
          floorNumber: floor.floor_number,
          machineId: machine.id,
          startTime: machine.start_time,
          expectedFinishTime: machine.expected_finish_time,
          instruction: machine.instruction
        }
      }
    }

    return {
      ...floor,
      machine,
      computedStatus,
      expectedFinish,
      isMyBooking,
      activeIssue
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laundry Machines"
        description={`${hostelName} · 1 machine per floor`}
      />

      {/* ACTIVE BOOKING SECTION */}
      {activeBooking && (
        <Card className="border-blue-200 shadow-sm bg-blue-50/30">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-blue-900">Your Laundry Booking</CardTitle>
              <CancelBookingDialog machineId={activeBooking.machineId} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-blue-800">
              <p className="font-medium">Floor {activeBooking.floorNumber} · Washing Machine 1</p>
              <p className="text-sm mt-1">
                Today · {new Date(activeBooking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(activeBooking.expectedFinishTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {activeBooking.instruction && (
                <p className="text-sm mt-2 text-blue-700 italic">{activeBooking.instruction}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ALL MACHINES GRID */}
      <div className="grid gap-4 md:grid-cols-2">
        {floorsData.map((floor) => {
          const m = floor.machine;
          
          if (!m) {
            return (
              <Card key={floor.id} className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Floor {floor.floor_number}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 font-medium">Machine unavailable</p>
                </CardContent>
              </Card>
            )
          }

          return (
            <Card key={floor.id} className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">Floor {floor.floor_number}</CardTitle>
                    <p className="text-slate-500 text-sm mt-0.5">Washing Machine 1</p>
                  </div>
                  <StatusBadge
                    status={
                      floor.computedStatus === 'available' ? 'success'
                        : floor.computedStatus === 'in_use' ? 'warning'
                        : 'error'
                    }
                  >
                    {floor.computedStatus === 'available' ? 'Available'
                      : floor.computedStatus === 'in_use' ? 'In Use'
                      : 'Not Working'}
                  </StatusBadge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col min-h-[5rem] justify-center space-y-2">
                  
                  {/* AVAILABLE */}
                  {floor.computedStatus === 'available' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Ready to use</span>
                      <BookMachineDialog machineId={m.id} floorNumber={floor.floor_number} />
                    </div>
                  )}

                  {/* IN USE */}
                  {floor.computedStatus === 'in_use' && floor.expectedFinish && m.start_time && (
                    <div className="text-sm text-slate-600 space-y-1 py-1">
                      <p>
                        <span className="font-semibold">Used by:</span> {m.profiles?.name || 'Someone'}
                      </p>
                      <p>
                        <span className="font-semibold">Started:</span> {new Date(m.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p>
                        <span className="font-semibold">Available until:</span> {floor.expectedFinish.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {m.instruction && (
                        <p className="italic text-slate-500 pt-1">{m.instruction}</p>
                      )}
                    </div>
                  )}

                  {/* NOT WORKING */}
                  {floor.computedStatus === 'not_working' && (
                    <div className="pt-1">
                      {floor.activeIssue ? (
                        <div className="text-sm space-y-2">
                          <p className="font-medium text-slate-700">{floor.activeIssue.title}</p>
                          <p className="text-slate-500">Reported: {new Date(floor.activeIssue.created_at).toLocaleDateString()} {new Date(floor.activeIssue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <div className="flex justify-end pt-1">
                            <Link href="/maintenance" className={buttonVariants({ variant: "outline", size: "sm" })}>
                              View Issue
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">Machine out of order</span>
                          <ReportProblemDialog 
                            machineId={m.id} 
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
                        machineId={m.id} 
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
