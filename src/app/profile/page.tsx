import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Settings"
        description="Manage your account details and preferences."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" alt="John Doe" />
                <AvatarFallback className="text-3xl bg-blue-100 text-blue-700">JD</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">John Doe</h3>
              <p className="text-sm text-slate-500 mb-4">B.Tech Computer Science</p>
              <div className="w-full flex justify-center gap-2">
                <Button variant="outline" size="sm" className="w-full">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hostel Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">Hostel Name</label>
                  <p className="font-medium">Ramanujan</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Room Number</label>
                  <p className="font-medium">312</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Floor</label>
                  <p className="font-medium">3rd Floor</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Wing</label>
                  <p className="font-medium">North Wing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
