import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReportDialog } from "./report-dialog";

export const dynamic = 'force-dynamic';

export default async function LostFoundPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: items } = await supabase
    .from('lost_found_items')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false });

  const lostItems = items?.filter(i => i.type === 'lost') || [];
  const foundItems = items?.filter(i => i.type === 'found') || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lost & Found"
        description="Report lost items or post items you've found."
        actions={<ReportDialog />}
      />

      <Tabs defaultValue="lost" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="lost">Lost Items</TabsTrigger>
          <TabsTrigger value="found">Found Items</TabsTrigger>
        </TabsList>
        <TabsContent value="lost" className="space-y-4">
          {lostItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lostItems.map((item) => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg mb-1 line-clamp-1" title={item.title}>{item.title}</CardTitle>
                      <StatusBadge status={item.status === 'active' ? 'error' : 'success'}>
                        {item.status}
                      </StatusBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{item.description}</p>
                      <div className="text-xs text-slate-500 mb-4 space-y-1">
                        <p><strong>Lost at:</strong> {item.location}</p>
                        <p><strong>Reported by:</strong> {item.profiles?.name}</p>
                        <p><strong>Date:</strong> {new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {item.status === 'active' && item.user_id !== user.id && (
                      <Button variant="outline" className="w-full cursor-default hover:bg-transparent hover:text-inherit">Contact {item.profiles?.name?.split(' ')[0]}</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={Search} title="No lost items" description="No items have been reported lost recently." />
          )}
        </TabsContent>
        <TabsContent value="found" className="space-y-4">
          {foundItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {foundItems.map((item) => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg mb-1 line-clamp-1" title={item.title}>{item.title}</CardTitle>
                      <StatusBadge status={item.status === 'active' ? 'info' : 'success'}>
                        {item.status}
                      </StatusBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{item.description}</p>
                      <div className="text-xs text-slate-500 mb-4 space-y-1">
                        <p><strong>Found at:</strong> {item.location}</p>
                        <p><strong>Found by:</strong> {item.profiles?.name}</p>
                        <p><strong>Date:</strong> {new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {item.status === 'active' && item.user_id !== user.id && (
                      <Button variant="outline" className="w-full cursor-default hover:bg-transparent hover:text-inherit">Claim Item</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={Search} title="No found items" description="No found items have been reported recently." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
