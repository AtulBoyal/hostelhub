import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
    .select('hostel_id')
    .eq('id', user.id)
    .single();

  if (!profile?.hostel_id) {
    redirect('/onboarding');
  }

  const { data: issues } = await supabase
    .from('maintenance_issues')
    .select('*, floors(floor_number)')
    .eq('hostel_id', profile.hostel_id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance & Issues"
        description="Track and report hostel maintenance issues."
        actions={<NewIssueDialog />}
      />

      {issues && issues.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {issues.map((issue) => (
            <Card key={issue.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-1">{issue.title}</CardTitle>
                    <p className="text-sm text-slate-500 capitalize">{issue.category.replace('_', ' ')} • {issue.floors ? `Floor ${issue.floors.floor_number}` : 'Common Area'}</p>
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
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-slate-500">Reported on {new Date(issue.created_at).toLocaleDateString()}</span>
                  <Button variant="link" size="sm" className="px-0 cursor-default hover:no-underline">Priority: {issue.priority}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Wrench}
          title="No issues reported"
          description="There are no maintenance issues reported for your hostel."
          action={<NewIssueDialog />}
        />
      )}
    </div>
  );
}
