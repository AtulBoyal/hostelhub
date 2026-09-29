import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { EmptyState } from "@/components/ui-custom/empty-state";

export default function MaintenancePage() {
  const issues = [
    { id: "ISS-1029", title: "Bathroom tap leakage", location: "Floor 3, Washroom B", status: "In Progress", date: "Oct 24, 2023" },
    { id: "ISS-1028", title: "Fan regulator broken", location: "Room 312", status: "Resolved", date: "Oct 20, 2023" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance & Issues"
        description="Track and report hostel maintenance issues."
        actions={<Button>File New Issue</Button>}
      />

      {issues.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {issues.map((issue) => (
            <Card key={issue.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-1">{issue.title}</CardTitle>
                    <p className="text-sm text-slate-500">{issue.id} • {issue.location}</p>
                  </div>
                  <StatusBadge
                    status={
                      issue.status === "Resolved"
                        ? "success"
                        : issue.status === "In Progress"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {issue.status}
                  </StatusBadge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-slate-500">Reported on {issue.date}</span>
                  <Button variant="link" size="sm" className="px-0">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Wrench}
          title="No issues reported"
          description="You haven't reported any maintenance issues recently."
          action={<Button>File New Issue</Button>}
        />
      )}
    </div>
  );
}
