import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { WashingMachine, Droplets, Wifi, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Nilgiri Hostel · Floor 3"
        actions={
          <Button>File an Issue</Button>
        }
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
              <div className="text-2xl font-bold mb-2">Machine 02</div>
              <StatusBadge status="info">Running (12m left)</StatusBadge>
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
              <div className="text-2xl font-bold mb-2">Floor 3</div>
              <StatusBadge status="success">Working</StatusBadge>
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
              <div className="text-2xl font-bold mb-2">Network</div>
              <StatusBadge status="warning">Slow on Floor 3</StatusBadge>
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
              <div className="text-base font-medium truncate mb-2">Bathroom tap leakage</div>
              <StatusBadge status="warning">In Progress</StatusBadge>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Updates from the hostel office.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Pest control scheduled for tomorrow", date: "Today", type: "Important" },
                { title: "Mess menu updated for next week", date: "Yesterday", type: "Info" },
                { title: "Night canteen timing extended", date: "2 days ago", type: "Good News" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.date}</p>
                  </div>
                  <StatusBadge status={item.type === "Important" ? "error" : "neutral"}>
                    {item.type}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Community Needs</CardTitle>
            <CardDescription>Items needed by your peers.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {[
                { user: "Rahul M.", item: "Scientific Calculator", time: "2h ago" },
                { user: "Ankit S.", item: "LAN Cable", time: "5h ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-medium text-slate-600">
                    {item.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none mb-1">Needs: {item.item}</p>
                    <p className="text-xs text-slate-500">{item.user} • {item.time}</p>
                  </div>
                </div>
              ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
