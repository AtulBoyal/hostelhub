import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewPostDialog } from "./new-post-dialog";
import { StatusBadge } from "@/components/ui-custom/status-badge";

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: posts } = await supabase
    .from('community_posts')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hostel Community"
        description="Connect with your peers and participate in hostel activities."
        actions={<NewPostDialog />}
      />

      <div className="space-y-4 max-w-3xl">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                      {post.profiles?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <CardTitle className="text-base">{post.profiles?.name}</CardTitle>
                      <p className="text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <StatusBadge status="neutral" className="capitalize">{post.category.replace('_', ' ')}</StatusBadge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                <p className="text-slate-800 mb-4 whitespace-pre-wrap">{post.content}</p>
                <div className="flex gap-4 text-sm text-slate-500 border-t pt-3">
                  <button className="hover:text-blue-600 font-medium">Like</button>
                  <button className="hover:text-blue-600 font-medium">Comment</button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState icon={Users} title="No community posts" description="Be the first to start a discussion!" />
        )}
      </div>
    </div>
  );
}
