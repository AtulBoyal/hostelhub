import { createClient } from "@/lib/supabase/server";
import { getCachedAuthUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import { ensureWashingMachines } from "../actions/laundry";
import { WashingMachine, Clock, Wrench, AlertTriangle, PlayCircle } from "lucide-react";
import Link from "next/link";
import { BookMachineDialog } from "./book-machine-dialog";
import { CancelBookingDialog } from "./cancel-booking-dialog";
import { ReportProblemDialog } from "./report-problem-dialog";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function LaundryPage() {
  const { user, profile } = await getCachedAuthUser();
  const supabase = await createClient();

  if (!user || !profile?.hostel_id) {
    redirect(user ? '/onboarding' : '/login');
  }

  // Auto-heal the database: ensures exactly 1 washing machine per floor for this hostel exists
  await ensureWashingMachines(profile.hostel_id);

  const hostelName = profile.hostels?.name || 'Hostel';
  const myFloor = profile.floors?.floor_number || '?';

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
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        <section className="mt-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Laundry</h1>
          <p className="text-slate-500 mt-2 text-base max-w-2xl">
            {hostelName} · Floor {myFloor}
          </p>
        </section>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-3xl">
          <WashingMachine className="h-10 w-10 text-slate-300 mb-4" />
          <p className="text-sm font-medium text-slate-900">No washing machines found</p>
          <p className="text-xs text-slate-500 mt-1">Machine information hasn't been configured for this hostel yet.</p>
        </div>
      </div>
    )
  }

  // Find the active booking for the current user
  const now = new Date();

  const floorsData = floors.map(floor => {
    // Expect exactly 1 machine per floor based on our requirement
    const machine = (floor.washing_machines as any)?.[0] || null;
    let computedStatus = 'available';
    const timeRemaining = null;
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
      
    }

    return {
      ...floor,
      machine,
      computedStatus,
      expectedFinish,
      isMyBooking,
      activeIssue,
      activeBookingData: isMyBooking && computedStatus === 'in_use' ? {
        floorNumber: floor.floor_number,
        machineId: machine.id,
        startTime: machine.start_time,
        expectedFinishTime: machine.expected_finish_time,
        instruction: machine.instruction
      } : null
    }
  });

  const availableCount = floorsData.filter(f => f.computedStatus === 'available').length;
  const inUseCount = floorsData.filter(f => f.computedStatus === 'in_use').length;
  const brokenCount = floorsData.filter(f => f.computedStatus === 'not_working').length;
  
  const activeBooking = floorsData.find(f => f.activeBookingData)?.activeBookingData || null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      
      {/* 1. HEADER & 3. SUMMARY */}
      <section className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Laundry</h1>
        <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl font-medium">
          {hostelName} · Floor {myFloor}
        </p>
        <p className="text-slate-400 text-sm mt-1">
          Check machine availability and reserve a washing machine on your floor.
        </p>
        
        {/* Availability Summary */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-slate-700">{availableCount} Available</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-slate-700">{inUseCount} In Use</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-xs font-semibold text-slate-700">{brokenCount} Not Working</span>
          </div>
        </div>
      </section>

      {/* 2. YOUR LAUNDRY (ACTIVE BOOKING) */}
      <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-4">Your Laundry</h2>
        {activeBooking ? (
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 flex items-center justify-center opacity-10 md:opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <WashingMachine className="h-32 w-32 text-amber-600" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">In Use</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Floor {activeBooking.floorNumber} · Washing Machine 1</h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600 font-medium">
                <PlayCircle className="h-4 w-4 text-slate-400" />
                <span>Started {new Date(activeBooking.startTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-slate-300">•</span>
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Available at {new Date(activeBooking.expectedFinishTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {activeBooking.instruction && (
                <p className="mt-3 text-sm text-amber-800 italic bg-amber-100/50 inline-block px-3 py-1.5 rounded-md">&quot;{activeBooking.instruction}&quot;</p>
              )}
              <div className="mt-6">
                <CancelBookingDialog machineId={activeBooking.machineId} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 bg-white/50 border border-slate-200 border-dashed rounded-3xl">
            <p className="text-sm font-medium text-slate-400">No active laundry booking</p>
          </div>
        )}
      </section>

      {/* 4. FLOOR GRID */}
      <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150 fill-mode-both">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-4">All Machines (10 Floors)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {floorsData.map((floor) => {
            const m = floor.machine;
            
            if (!m) {
              return (
                <div key={floor.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm opacity-50">
                  <h3 className="text-lg font-bold text-slate-900">Floor {floor.floor_number}</h3>
                  <p className="text-sm text-slate-500 mt-1">Machine unavailable</p>
                </div>
              )
            }

            // 5. AVAILABLE CARD
            if (floor.computedStatus === 'available') {
              return (
                <div key={floor.id} className="group flex flex-col justify-between bg-white border border-slate-200 hover:border-green-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Floor {floor.floor_number}</h3>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Washing Machine 1</p>
                    
                    <div className="mt-6 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-sm font-bold text-green-700 tracking-wide">AVAILABLE</span>
                      </div>
                      <span className="text-xs font-medium text-slate-500 pl-5">Ready to use</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <BookMachineDialog machineId={m.id} floorNumber={floor.floor_number} />
                  </div>
                </div>
              )
            }

            // 6. OCCUPIED CARD
            if (floor.computedStatus === 'in_use') {
              return (
                <div key={floor.id} className="group flex flex-col justify-between bg-white border border-slate-200 hover:border-amber-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Floor {floor.floor_number}</h3>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Washing Machine 1</p>
                    
                    <div className="mt-6 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-sm font-bold text-amber-700 tracking-wide">IN USE</span>
                      </div>
                      <div className="pl-5 mt-2 space-y-1.5 text-xs text-slate-600 font-medium">
                        <p><span className="text-slate-400">Used by</span> {m.profiles?.name?.split(' ')[0] || 'Someone'}</p>
                        <p><span className="text-slate-400">Started</span> {m.start_time ? new Date(m.start_time).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : '--'}</p>
                        <p><span className="text-slate-400">Available at</span> {floor.expectedFinish ? floor.expectedFinish.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : '--'}</p>
                        {m.instruction && (
                          <p className="italic text-slate-500 mt-2">&quot;{m.instruction}&quot;</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    {floor.isMyBooking ? (
                      <div className="flex flex-col gap-2">
                         <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Your Booking</span>
                         <CancelBookingDialog machineId={m.id} />
                      </div>
                    ) : (
                      // Display only
                      <div className="h-10 w-full bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-xs font-medium text-slate-400 cursor-not-allowed">
                        Occupied
                      </div>
                    )}
                  </div>
                </div>
              )
            }

            // 7. BROKEN CARD
            if (floor.computedStatus === 'not_working') {
              return (
                <div key={floor.id} className="group flex flex-col justify-between bg-red-50/30 border border-red-100 hover:border-red-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Floor {floor.floor_number}</h3>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Washing Machine 1</p>
                    
                    <div className="mt-6 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="text-sm font-bold text-red-700 tracking-wide">NOT WORKING</span>
                      </div>
                      
                      <div className="pl-5 mt-2 space-y-1.5 text-xs text-slate-600 font-medium">
                        {floor.activeIssue ? (
                          <>
                            <p className="font-semibold text-slate-800 line-clamp-1">{floor.activeIssue.title}</p>
                            <p className="text-slate-500">Reported {new Date(floor.activeIssue.created_at).toLocaleDateString()} at {new Date(floor.activeIssue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </>
                        ) : (
                          <p className="text-slate-500">Currently unavailable</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    {floor.activeIssue ? (
                       <Link href="/maintenance" className={buttonVariants({ variant: "outline", className: "w-full bg-white hover:bg-slate-50 text-slate-700 border-slate-300 rounded-lg" })}>
                         View Issue
                       </Link>
                    ) : (
                       <ReportProblemDialog 
                         machineId={m.id} 
                         floorId={floor.id} 
                         hostelId={profile.hostel_id} 
                         floorNumber={floor.floor_number} 
                       />
                    )}
                  </div>
                </div>
              )
            }
          })}
        </div>
      </section>
    </div>
  );
}
