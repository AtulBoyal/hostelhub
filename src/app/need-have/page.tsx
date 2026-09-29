import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { PackageOpen } from "lucide-react";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewPostDialog } from "./new-post-dialog";

export const dynamic = 'force-dynamic';

export default async function NeedHavePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: posts } = await supabase
    .from('need_have_posts')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false });

  const needs = posts?.filter(p => p.type === 'need') || [];
  const haves = posts?.filter(p => p.type === 'have') || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="I Need / I Have"
        description="Borrow, lend, or give away items within your hostel."
        actions={<NewPostDialog />}
      />

      <Tabs defaultValue="needs" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="needs">I Need</TabsTrigger>
          <TabsTrigger value="haves">I Have</TabsTrigger>
        </TabsList>
        <TabsContent value="needs" className="space-y-4">
          {needs.length > 0 ? needs.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
                    <p className="text-sm text-slate-500">Requested by {item.profiles?.name} • {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={item.status === 'active' ? 'warning' : 'success'}>
                    {item.status}
                  </StatusBadge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 text-slate-600">{item.description}</p>
                {item.status === 'active' && item.user_id !== user.id && (
                  <Button variant="outline" size="sm" className="cursor-default hover:bg-transparent hover:text-inherit">Offer Item</Button>
                )}
              </CardContent>
            </Card>
          )) : (
            <EmptyState icon={PackageOpen} title="No active needs" description="No one is looking for anything right now." />
          )}
        </TabsContent>
        <TabsContent value="haves" className="space-y-4">
          {haves.length > 0 ? haves.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
                    <p className="text-sm text-slate-500">Offered by {item.profiles?.name} • {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={item.status === 'active' ? 'success' : 'neutral'}>
                    {item.status}
                  </StatusBadge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 text-slate-600">{item.description}</p>
                {item.status === 'active' && item.user_id !== user.id && (
                  <Button variant="outline" size="sm" className="cursor-default hover:bg-transparent hover:text-inherit">Request Item</Button>
                )}
              </CardContent>
            </Card>
          )) : (
            <EmptyState icon={PackageOpen} title="No available items" description="No one has shared items recently." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
