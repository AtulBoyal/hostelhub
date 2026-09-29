import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Droplets } from "lucide-react";

export default function WaterPage() {
  const purifiers = [
    { id: 1, location: "Floor 1, North Wing", status: "Working", lastServiced: "Oct 10, 2023" },
    { id: 2, location: "Floor 2, South Wing", status: "Maintenance", lastServiced: "Sep 28, 2023" },
    { id: 3, location: "Floor 3, Central", status: "Working", lastServiced: "Oct 15, 2023" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Water Purifiers"
        description="Check the status of water purifiers in your hostel."
        actions={<Button>Report Issue</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {purifiers.map((purifier) => (
          <Card key={purifier.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  {purifier.location}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <StatusBadge status={purifier.status === "Working" ? "success" : "error"}>
                  {purifier.status}
                </StatusBadge>
              </div>
              <div className="text-sm text-slate-500">
                <p>Last Serviced: {purifier.lastServiced}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
