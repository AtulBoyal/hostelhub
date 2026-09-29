import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Wifi } from "lucide-react";

export default function WifiPage() {
  const networks = [
    { id: 1, name: "IITH-Hostels", status: "Slow", speed: "12 Mbps", floor: "Floor 3" },
    { id: 2, name: "IITH-Hostels", status: "Good", speed: "85 Mbps", floor: "Floor 1" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wi-Fi & Network"
        description="Check network status and report connection issues."
        actions={<Button>Report Issue</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {networks.map((network) => (
          <Card key={network.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-blue-500" />
                  {network.name}
                </CardTitle>
                <StatusBadge status={network.status === "Good" ? "success" : "warning"}>
                  {network.status}
                </StatusBadge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-500 mb-4">
                <p>Location: {network.floor}</p>
                <p>Current Speed: {network.speed}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
