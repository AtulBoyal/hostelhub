import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, ShieldAlert, HeartPulse } from "lucide-react";

export default function EmergencyPage() {
  const contacts = [
    { id: 1, title: "Hostel Security", number: "040-2301-6001", icon: ShieldAlert, color: "text-red-500" },
    { id: 2, title: "Ambulance / Medical", number: "040-2301-6002", icon: HeartPulse, color: "text-red-500" },
    { id: 3, title: "Hostel Warden", number: "+91 98765 43210", icon: Phone, color: "text-slate-700" },
    { id: 4, title: "Main Gate", number: "040-2301-6000", icon: Phone, color: "text-slate-700" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency & Help"
        description="Important contact numbers for immediate assistance."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <Card key={contact.id} className="border-red-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center gap-4">
              <div className="bg-red-50 p-3 rounded-full">
                <contact.icon className={`h-6 w-6 ${contact.color}`} />
              </div>
              <div>
                <CardTitle className="text-lg">{contact.title}</CardTitle>
                <p className="text-2xl font-bold text-slate-900 mt-1">{contact.number}</p>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full mt-2" variant="outline">Call Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
