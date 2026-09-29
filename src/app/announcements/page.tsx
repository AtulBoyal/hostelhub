import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-custom/status-badge";

export default function AnnouncementsPage() {
  const announcements = [
    { id: 1, title: "Pest control scheduled for tomorrow", date: "Oct 25, 2023", type: "Important", content: "Please ensure all your food items are kept inside cupboards. Pest control will happen between 10 AM and 2 PM." },
    { id: 2, title: "Mess menu updated for next week", date: "Oct 24, 2023", type: "Info", content: "The mess menu has been updated. Please check the notice board or the mess section for details." },
    { id: 3, title: "Night canteen timing extended", date: "Oct 23, 2023", type: "Good News", content: "During the mid-sem week, the night canteen will remain open until 4 AM." },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hostel Announcements"
        description="Official updates and notices from the hostel administration."
      />

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <p className="text-sm text-slate-500">{announcement.date}</p>
                </div>
                <StatusBadge
                  status={
                    announcement.type === "Important"
                      ? "error"
                      : announcement.type === "Good News"
                      ? "success"
                      : "info"
                  }
                >
                  {announcement.type}
                </StatusBadge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{announcement.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
