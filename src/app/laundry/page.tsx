import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Button } from "@/components/ui/button";

export default function LaundryPage() {
  const machines = [
    { id: "01", type: "Washing Machine", status: "Available", time: null },
    { id: "02", type: "Washing Machine", status: "Running", time: "12m left" },
    { id: "03", type: "Dryer", status: "Out of Order", time: null },
    { id: "04", type: "Dryer", status: "Available", time: null },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laundry Status"
        description="Check machine availability on your floor."
        actions={<Button>Report Issue</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {machines.map((machine) => (
          <Card key={machine.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Machine {machine.id}</CardTitle>
                <StatusBadge
                  status={
                    machine.status === "Available"
                      ? "success"
                      : machine.status === "Running"
                      ? "info"
                      : "error"
                  }
                >
                  {machine.status}
                </StatusBadge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-500 mb-4">{machine.type}</div>
              {machine.status === "Running" ? (
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "70%" }}></div>
                </div>
              ) : null}
              <div className="flex justify-between items-center h-9">
                <span className="text-sm font-medium">{machine.time || "-"}</span>
                {machine.status === "Available" && (
                  <Button size="sm" variant="outline">Book</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
