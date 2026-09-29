import { PageHeader } from "@/components/ui-custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
  const posts = [
    { id: 1, user: "Rohan D.", content: "Anyone up for a quick table tennis match in the common room?", time: "1h ago", likes: 4, comments: 2 },
    { id: 2, user: "Karan P.", content: "Organizing a study session for CS202 tonight at 9 PM in the reading room. Join if interested!", time: "3h ago", likes: 12, comments: 5 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hostel Community"
        description="Connect with your peers and participate in hostel activities."
        actions={<Button>Create Post</Button>}
      />

      <div className="space-y-4 max-w-3xl">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                  {post.user.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-base">{post.user}</CardTitle>
                  <p className="text-xs text-slate-500">{post.time}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-800 mb-4">{post.content}</p>
              <div className="flex gap-4 text-sm text-slate-500 border-t pt-3">
                <button className="hover:text-blue-600 font-medium">{post.likes} Likes</button>
                <button className="hover:text-blue-600 font-medium">{post.comments} Comments</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
