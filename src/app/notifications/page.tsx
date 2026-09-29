import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const notifications = [
    { id: 1, title: "Maintenance Request Updated", message: "Your issue 'Bathroom tap leakage' status changed to In Progress.", time: "10m ago", read: false },
    { id: 2, title: "Laundry Machine Available", message: "Machine 02 on your floor is now available.", time: "1h ago", read: false },
    { id: 3, title: "New Announcement", message: "Pest control scheduled for tomorrow. Please read the notice.", time: "3h ago", read: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with alerts and messages."
        actions={<Button variant="outline">Mark all as read</Button>}
      />

      <div className="space-y-3 max-w-3xl">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "bg-slate-50/50" : "border-blue-200 shadow-sm"}>
            <CardContent className="p-4 flex items-start gap-4">
              {!notification.read && <div className="mt-2 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />}
              <div className="flex-1">
                <h4 className={`text-base font-semibold ${notification.read ? "text-slate-700" : "text-slate-900"}`}>
                  {notification.title}
                </h4>
                <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
