import { useState, useEffect } from "react";
import { useAuth, apiFetch } from "../auth-context";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, ChevronLeft, Send, FileText, Trash2, Reply } from "lucide-react";

interface Forum {
  id: number; courseId: number; title: string; description: string | null;
  createdBy: { id: number; firstName: string; lastName: string };
  postCount: number; createdAt: string;
}

interface Post {
  id: number; forumId: number; authorId: number; parentId: number | null;
  content: string; fileUrl: string | null; fileName: string | null; createdAt: string;
  author: { id: number; firstName: string; lastName: string; avatar: string | null };
}

export function ForumsPage() {
  const { token } = useAuth();
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    apiFetch("/courses", { token: token! }).then(async (courses: any[]) => {
      const all: Forum[] = [];
      for (const c of courses) {
        try {
          const f = await apiFetch(`/courses/${c.id}/forums`, { token: token! });
          all.push(...f.map((forum: any) => ({ ...forum, courseName: c.title })));
        } catch {}
      }
      setForums(all);
    }).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading forums...</p></div>;

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Forums</h1><p className="text-gray-500 mt-1">Discuss courses, ask questions and share resources</p></div>
      {forums.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" /><p className="text-gray-500">No forums yet. Teachers can create forums from course pages.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {forums.map((f) => (
            <Card key={f.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/portal/forums/${f.id}`)}>
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-green-600" /></div>
                  <div>
                    <h3 className="font-medium">{f.title}</h3>
                    <p className="text-sm text-gray-500">by {f.createdBy.firstName} {f.createdBy.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{f.postCount} posts</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function ForumDetailPage() {
  const { user, token } = useAuth();
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);

  useEffect(() => {
    apiFetch(`/forums/${params.id}/posts`, { token: token! }).then(setPosts).catch(console.error).finally(() => setLoading(false));
  }, [params.id, token]);

  async function submitPost() {
    if (!content.trim()) return;
    try {
      await apiFetch(`/forums/${params.id}/posts`, { method: "POST", body: JSON.stringify({ content, parentId: replyTo }), token: token! });
      const updated = await apiFetch(`/forums/${params.id}/posts`, { token: token! });
      setPosts(updated);
      setContent("");
      setReplyTo(null);
    } catch (err: any) { alert(err.message); }
  }

  async function deletePost(postId: number) {
    if (!confirm("Delete this post?")) return;
    try {
      await apiFetch(`/forums/posts/${postId}`, { method: "DELETE", token: token! });
      const updated = await apiFetch(`/forums/${params.id}/posts`, { token: token! });
      setPosts(updated);
    } catch (err: any) { alert(err.message); }
  }

  const topPosts = posts.filter((p) => !p.parentId);
  const getReplies = (parentId: number) => posts.filter((p) => p.parentId === parentId);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div>
      <button onClick={() => navigate("/portal/forums")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"><ChevronLeft className="w-4 h-4" /> Back to forums</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Forum Discussion</h1>

      <Card className="mb-6">
        <CardContent className="py-4">
          {replyTo && <div className="mb-2 text-sm text-gray-500 flex items-center gap-2"><Reply className="w-3 h-3" /> Replying to a post <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)} className="text-xs">Cancel</Button></div>}
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your thoughts, ask a question..." rows={3} />
          <div className="flex justify-end mt-2"><Button onClick={submitPost} disabled={!content.trim()} size="sm"><Send className="w-4 h-4 mr-2" /> Post</Button></div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {topPosts.length === 0 ? <p className="text-gray-500 text-center py-8">No posts yet. Start the discussion!</p> : topPosts.map((p) => (
          <Card key={p.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">{p.author.firstName[0]}{p.author.lastName[0]}</div>
                  <div>
                    <p className="font-medium text-sm">{p.author.firstName} {p.author.lastName}</p>
                    <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setReplyTo(p.id)}><Reply className="w-3 h-3" /></Button>
                  {(p.authorId === user?.id || ["admin", "super_admin"].includes(user?.role || "")) && (
                    <Button variant="ghost" size="sm" onClick={() => deletePost(p.id)}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                  )}
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap ml-11">{p.content}</p>
              {p.fileName && <p className="text-sm text-blue-600 mt-1 ml-11 flex items-center gap-1"><FileText className="w-3 h-3" /> {p.fileName}</p>}
              {getReplies(p.id).length > 0 && (
                <div className="ml-11 mt-4 pl-4 border-l-2 border-gray-100 space-y-3">
                  {getReplies(p.id).map((r) => (
                    <div key={r.id}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">{r.author.firstName[0]}{r.author.lastName[0]}</div>
                        <span className="text-sm font-medium">{r.author.firstName} {r.author.lastName}</span>
                        <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 ml-8">{r.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
