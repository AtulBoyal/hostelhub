import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui-custom/status-badge";

export default function LostFoundPage() {
  const items = [
    { id: 1, title: "Black Umbrella", type: "Found", location: "Mess Hall", date: "Today", user: "Ravi K." },
    { id: 2, title: "Boat Earbuds Case", type: "Lost", location: "Library", date: "Yesterday", user: "Meera S." },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lost & Found"
        description="Report lost items or post items you've found."
        actions={<Button>Report Item</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <StatusBadge status={item.type === "Found" ? "success" : "error"}>{item.type}</StatusBadge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-500 mb-4">
                <p>Location: {item.location}</p>
                <p>Reported by: {item.user}</p>
                <p>Date: {item.date}</p>
              </div>
              <Button variant="outline" className="w-full">Contact {item.user.split(" ")[0]}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
