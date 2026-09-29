import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { WashingMachine, Droplets, Wifi, Wrench } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui-custom/empty-state";

export const dynamic = 'force-dynamic';

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

  // Fetch Laundry (active machine on floor)
  const { data: machines } = await supabase
    .from('washing_machines')
    .select('*')
    .eq('floor_id', profile.floor_id)
    .in('status', ['running', 'available'])
    .order('status', { ascending: false }) // running first
    .limit(1);
  const activeMachine = machines?.[0] || null;

  // Fetch Water Purifier
  const { data: purifiers } = await supabase
    .from('purifiers')
    .select('*')
    .eq('floor_id', profile.floor_id)
    .limit(1);
  const purifier = purifiers?.[0] || null;

  // Fetch Wifi Issue
  const { data: wifiIssues } = await supabase
    .from('maintenance_issues')
    .select('*')
    .eq('hostel_id', profile.hostel_id)
    .eq('category', 'wifi')
    .in('status', ['reported', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(1);
  const wifiIssue = wifiIssues?.[0] || null;

  // Fetch Recent Maintenance
  const { data: maintenance } = await supabase
    .from('maintenance_issues')
    .select('*')
    .eq('hostel_id', profile.hostel_id)
    .order('created_at', { ascending: false })
    .limit(1);
  const recentIssue = maintenance?.[0] || null;

  // Fetch Announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('hostel_id', profile.hostel_id)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch Community Needs
  const { data: needs } = await supabase
    .from('need_have_posts')
    .select('*, profiles(name)')
    .eq('type', 'need')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`${hostelName} · Floor ${floorNumber}`}
        actions={<Button>File an Issue</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Laundry Status */}
        <Link href="/laundry">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Laundry</CardTitle>
              <WashingMachine className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {activeMachine ? (
                <>
                  <div className="text-2xl font-bold mb-2">Machine {activeMachine.machine_number}</div>
                  <StatusBadge status={activeMachine.status === 'running' ? 'info' : 'success'}>
                    {activeMachine.status === 'running' ? 'Running' : 'Available'}
                  </StatusBadge>
                </>
              ) : (
                <div className="text-sm text-slate-500">No active machines found</div>
              )}
            </CardContent>
          </Card>
        </Link>

        {/* Water Purifier Status */}
        <Link href="/water">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Water Purifier</CardTitle>
              <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {purifier ? (
                <>
                  <div className="text-2xl font-bold mb-2">Floor {floorNumber}</div>
                  <StatusBadge status={purifier.status === 'working' ? 'success' : 'error'}>
                    {purifier.status === 'working' ? 'Working' : 'Not Working'}
                  </StatusBadge>
                </>
              ) : (
                <div className="text-sm text-slate-500">No purifier data</div>
              )}
            </CardContent>
          </Card>
        </Link>

        {/* Wi-Fi Status */}
        <Link href="/wifi">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Wi-Fi</CardTitle>
              <Wifi className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {wifiIssue ? (
                <>
                  <div className="text-xl font-bold mb-2 truncate">{wifiIssue.title}</div>
                  <StatusBadge status="warning">Issue Reported</StatusBadge>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold mb-2">Network</div>
                  <StatusBadge status="success">Working Fine</StatusBadge>
                </>
              )}
            </CardContent>
          </Card>
        </Link>

        {/* Recent Maintenance */}
        <Link href="/maintenance">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recent Issue</CardTitle>
              <Wrench className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {recentIssue ? (
                <>
                  <div className="text-base font-medium truncate mb-2" title={recentIssue.title}>{recentIssue.title}</div>
                  <StatusBadge status={recentIssue.status === 'resolved' ? 'success' : recentIssue.status === 'in_progress' ? 'info' : 'warning'}>
                    {recentIssue.status.replace('_', ' ')}
                  </StatusBadge>
                </>
              ) : (
                <div className="text-sm text-slate-500">No recent issues</div>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Updates from the hostel office.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {announcements && announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-slate-500">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <StatusBadge status={item.priority === "important" || item.priority === "urgent" ? "error" : "info"}>
                      {item.priority}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Wrench} title="No Announcements" description="All caught up!" />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Community Needs</CardTitle>
            <CardDescription>Items needed by your peers.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {needs && needs.length > 0 ? (
              <div className="space-y-4">
                {needs.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center font-medium text-slate-600">
                      {item.profiles?.name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none mb-1 truncate">Needs: {item.title}</p>
                      <p className="text-xs text-slate-500 truncate">{item.profiles?.name} • {new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Wrench} title="No active needs" description="Nobody needs anything right now." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
