import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui-custom/status-badge";

export default function NeedHavePage() {
  const needs = [
    { id: 1, user: "Rahul M.", item: "Scientific Calculator", type: "Borrow", duration: "For 2 days", date: "2h ago" },
    { id: 2, user: "Ankit S.", item: "LAN Cable", type: "Keep", duration: "-", date: "5h ago" },
  ];

  const haves = [
    { id: 3, user: "Priya K.", item: "Engineering Drawing Kit", type: "Lend", duration: "Available anytime", date: "1d ago" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="I Need / I Have"
        description="Borrow, lend, or give away items within your hostel."
        actions={<Button>Post an Item</Button>}
      />

      <Tabs defaultValue="needs" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="needs">I Need</TabsTrigger>
          <TabsTrigger value="haves">I Have</TabsTrigger>
        </TabsList>
        <TabsContent value="needs" className="space-y-4">
          {needs.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.item}</CardTitle>
                    <p className="text-sm text-slate-500">Requested by {item.user} • {item.date}</p>
                  </div>
                  <StatusBadge status="warning">{item.type}</StatusBadge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Duration: {item.duration}</p>
                <Button variant="outline" size="sm">Offer Item</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="haves" className="space-y-4">
          {haves.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.item}</CardTitle>
                    <p className="text-sm text-slate-500">Offered by {item.user} • {item.date}</p>
                  </div>
                  <StatusBadge status="success">{item.type}</StatusBadge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Details: {item.duration}</p>
                <Button variant="outline" size="sm">Request Item</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
