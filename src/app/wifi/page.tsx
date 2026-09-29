import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Wifi, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function WifiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('hostel_id, hostels(name)')
    .eq('id', user.id)
    .single();

  if (!profile?.hostel_id) {
    redirect('/onboarding');
  }

  const { data: issues } = await supabase
    .from('maintenance_issues')
    .select('*, floors(floor_number)')
    .eq('hostel_id', profile.hostel_id)
    .eq('category', 'wifi')
    .order('created_at', { ascending: false });

  const activeIssues = issues?.filter(i => i.status !== 'resolved') || [];
  const overallStatus = activeIssues.length === 0 ? "Good" : "Issues Reported";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wi-Fi & Network"
        description={`Check network status for ${(profile.hostels as any)?.name}.`}
        actions={
          <Link href="/maintenance">
            <Button>Report Issue</Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className={activeIssues.length === 0 ? "border-green-200 bg-green-50/50" : "border-yellow-200 bg-yellow-50/50"}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wifi className={activeIssues.length === 0 ? "h-5 w-5 text-green-500" : "h-5 w-5 text-yellow-500"} />
                {(profile.hostels as any)?.name} Network
              </CardTitle>
              <StatusBadge status={activeIssues.length === 0 ? "success" : "warning"}>
                {overallStatus}
              </StatusBadge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              {activeIssues.length === 0 
                ? "The network is operating normally. No recent issues reported." 
                : `${activeIssues.length} active issue(s) reported. Technicians have been notified.`}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold border-b pb-2">Recent Network Issues</h2>
      {issues && issues.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {issues.map((issue) => (
            <Card key={issue.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-1">{issue.title}</CardTitle>
                    <p className="text-sm text-slate-500">Location: {issue.floors ? `Floor ${issue.floors.floor_number}` : 'Common Area'}</p>
                  </div>
                  <StatusBadge
                    status={
                      issue.status === "resolved"
                        ? "success"
                        : issue.status === "in_progress"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {issue.status.replace('_', ' ')}
                  </StatusBadge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-2 line-clamp-2">{issue.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-slate-500">Reported on {new Date(issue.created_at).toLocaleDateString()}</span>
                  <span className="text-xs font-medium text-slate-500 capitalize">Priority: {issue.priority}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={AlertCircle} title="No network issues" description="No Wi-Fi issues have been reported." />
      )}
    </div>
  );
}
