import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Droplets } from "lucide-react";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function WaterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('hostel_id')
    .eq('id', user.id)
    .single();

  if (!profile?.hostel_id) {
    redirect('/onboarding');
  }

  const { data: purifiers } = await supabase
    .from('purifiers')
    .select('*, floors(floor_number)')
    .order('created_at', { ascending: true }); // Fetching for all floors since people can go to other floors for water

  return (
    <div className="space-y-6">
      <PageHeader
        title="Water Purifiers"
        description="Check the status of water purifiers in your hostel."
        actions={
          <Link href="/maintenance">
            <Button>Report Issue</Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {purifiers && purifiers.length > 0 ? (
          purifiers.map((purifier) => (
            <Card key={purifier.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    Floor {purifier.floors?.floor_number}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 mt-2">
                  <StatusBadge status={purifier.status === "working" ? "success" : "error"}>
                    {purifier.status === "working" ? "Working" : "Not Working"}
                  </StatusBadge>
                </div>
                <div className="text-sm text-slate-500">
                  <p>Last Verified: {purifier.last_verified_at ? new Date(purifier.last_verified_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState icon={Droplets} title="No purifiers found" description="There are no purifiers registered in the system." />
          </div>
        )}
      </div>
    </div>
  );
}
