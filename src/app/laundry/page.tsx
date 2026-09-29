import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookButton } from "./book-button";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { WashingMachine } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function LaundryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('floor_id, hostels(name), floors(floor_number)')
    .eq('id', user.id)
    .single();

  if (!profile?.floor_id) {
    redirect('/onboarding');
  }

  const { data: machines } = await supabase
    .from('washing_machines')
    .select('*')
    .eq('floor_id', profile.floor_id)
    .order('machine_number');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laundry Status"
        description={`Check machine availability for Floor ${(profile.floors as any)?.floor_number || ''}.`}
        actions={
          <Link href="/maintenance">
            <Button>Report Issue</Button>
          </Link>
        }
      />

      {!machines || machines.length === 0 ? (
        <EmptyState icon={WashingMachine} title="No Machines Found" description="There are no washing machines registered for your floor." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {machines.map((machine) => {
            let timeRemaining = null;
            let progress = 0;
            
            if (machine.status === 'running' && machine.expected_finish_time) {
              const now = new Date();
              const finish = new Date(machine.expected_finish_time);
              const start = new Date(machine.start_time);
              const diffMinutes = Math.max(0, Math.round((finish.getTime() - now.getTime()) / 60000));
              timeRemaining = `${diffMinutes}m left`;
              
              const totalDuration = finish.getTime() - start.getTime();
              const elapsed = now.getTime() - start.getTime();
              progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
            }

            return (
              <Card key={machine.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Machine {machine.machine_number}</CardTitle>
                    <StatusBadge
                      status={
                        machine.status === "available"
                          ? "success"
                          : machine.status === "running"
                          ? "info"
                          : "error"
                      }
                    >
                      {machine.status === "available" ? "Available" : machine.status === "running" ? "Running" : "Out of Order"}
                    </StatusBadge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-500 mb-4">Washing Machine</div>
                  {machine.status === "running" ? (
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  ) : null}
                  <div className="flex justify-between items-center h-9">
                    <span className="text-sm font-medium">{timeRemaining || "-"}</span>
                    {machine.status === "available" && (
                      <BookButton machineId={machine.id} />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
