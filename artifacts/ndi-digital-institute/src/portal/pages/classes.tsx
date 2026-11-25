import { useState, useEffect, useRef } from "react";
import { useAuth, apiFetch } from "../auth-context";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Video, ChevronLeft, Send, Play, Square, Calendar, Users, ExternalLink } from "lucide-react";

interface VirtualClass {
  id: number; courseId: number; title: string; description: string | null;
  hostId: number; roomId: string; scheduledAt: string; endedAt: string | null;
  isLive: boolean; recordingUrl: string | null;
  host: { id: number; firstName: string; lastName: string };
  course: { id: number; title: string };
}

interface ChatMsg {
  id: number; classId: number; userId: number; message: string; createdAt: string;
  user: { id: number; firstName: string; lastName: string; avatar: string | null };
}

export function ClassesPage() {
  const { token } = useAuth();
  const [classes, setClasses] = useState<VirtualClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    apiFetch("/classes", { token: token! }).then(setClasses).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const live = classes.filter((c) => c.isLive);
  const upcoming = classes.filter((c) => !c.isLive && !c.endedAt && new Date(c.scheduledAt) > new Date());
  const past = classes.filter((c) => c.endedAt || (!c.isLive && new Date(c.scheduledAt) <= new Date()));

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Virtual Classes</h1><p className="text-gray-500 mt-1">Join live classes, view recordings, and participate in discussions</p></div>
      {live.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Live Now</h2>
          <div className="grid gap-3">{live.map((c) => <ClassCard key={c.id} cls={c} onNavigate={() => navigate(`/portal/classes/${c.id}`)} />)}</div>
        </div>
      )}
      {upcoming.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Upcoming</h2>
          <div className="grid gap-3">{upcoming.map((c) => <ClassCard key={c.id} cls={c} onNavigate={() => navigate(`/portal/classes/${c.id}`)} />)}</div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Past Classes & Recordings</h2>
          <div className="grid gap-3">{past.map((c) => <ClassCard key={c.id} cls={c} onNavigate={() => navigate(`/portal/classes/${c.id}`)} />)}</div>
        </div>
      )}
      {classes.length === 0 && <Card><CardContent className="py-12 text-center"><Video className="w-12 h-12 mx-auto text-gray-300 mb-4" /><p className="text-gray-500">No classes scheduled yet.</p></CardContent></Card>}
    </div>
  );
}

function ClassCard({ cls, onNavigate }: { cls: VirtualClass; onNavigate: () => void }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onNavigate}>
      <CardContent className="py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cls.isLive ? "bg-red-100" : cls.recordingUrl ? "bg-green-100" : "bg-blue-100"}`}>
            {cls.isLive ? <Play className="w-5 h-5 text-red-600" /> : cls.recordingUrl ? <Video className="w-5 h-5 text-green-600" /> : <Calendar className="w-5 h-5 text-blue-600" />}
          </div>
          <div>
            <h3 className="font-medium">{cls.title}</h3>
            <p className="text-sm text-gray-500">{cls.course.title} · {cls.host.firstName} {cls.host.lastName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{new Date(cls.scheduledAt).toLocaleDateString()} {new Date(cls.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {cls.isLive && <Badge variant="destructive">LIVE</Badge>}
          {cls.recordingUrl && <Badge variant="secondary">Recording</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

export function ClassDetailPage() {
  const { user, token } = useAuth();
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [cls, setCls] = useState<VirtualClass | null>(null);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const isHost = user && cls && cls.hostId === user.id;

  useEffect(() => {
    Promise.all([
      apiFetch("/classes", { token: token! }).then((all: VirtualClass[]) => all.find((c) => c.id === Number(params.id))),
      apiFetch(`/classes/${params.id}/chat`, { token: token! }),
    ]).then(([c, ch]) => { setCls(c || null); setChat(ch); }).catch(console.error).finally(() => setLoading(false));
  }, [params.id, token]);

  useEffect(() => {
    if (!cls?.isLive) return;
    pollRef.current = setInterval(async () => {
      try { const ch = await apiFetch(`/classes/${params.id}/chat`, { token: token! }); setChat(ch); } catch {}
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, [cls?.isLive, params.id, token]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  async function sendMessage() {
    if (!msg.trim()) return;
    try {
      await apiFetch(`/classes/${params.id}/chat`, { method: "POST", body: JSON.stringify({ message: msg }), token: token! });
      const ch = await apiFetch(`/classes/${params.id}/chat`, { token: token! });
      setChat(ch);
      setMsg("");
    } catch {}
  }

  async function toggleLive() {
    try {
      const updates = cls?.isLive ? { isLive: false, endedAt: new Date().toISOString() } : { isLive: true };
      await apiFetch(`/classes/${params.id}`, { method: "PUT", body: JSON.stringify(updates), token: token! });
      const all = await apiFetch("/classes", { token: token! }) as VirtualClass[];
      setCls(all.find((c) => c.id === Number(params.id)) || null);
    } catch (err: any) { alert(err.message); }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading...</p></div>;
  if (!cls) return <div className="text-center py-12"><p className="text-gray-500">Class not found.</p></div>;

  const jitsiUrl = `https://meet.jit.si/${cls.roomId}`;

  return (
    <div>
      <button onClick={() => navigate("/portal/classes")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"><ChevronLeft className="w-4 h-4" /> Back</button>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3"><h1 className="text-2xl font-bold text-gray-900">{cls.title}</h1>{cls.isLive && <Badge variant="destructive">LIVE</Badge>}</div>
          <p className="text-gray-500 mt-1">{cls.course.title} · {cls.host.firstName} {cls.host.lastName} · {new Date(cls.scheduledAt).toLocaleString()}</p>
        </div>
        {isHost && (
          <Button variant={cls.isLive ? "destructive" : "default"} onClick={toggleLive}>
            {cls.isLive ? <><Square className="w-4 h-4 mr-2" /> End Class</> : <><Play className="w-4 h-4 mr-2" /> Start Class</>}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {cls.isLive ? (
            <Card>
              <CardContent className="p-0">
                <iframe src={jitsiUrl} className="w-full rounded-lg" style={{ height: "480px" }} allow="camera;microphone;fullscreen;display-capture" />
              </CardContent>
            </Card>
          ) : cls.recordingUrl ? (
            <Card>
              <CardHeader><CardTitle className="text-lg">Recording</CardTitle></CardHeader>
              <CardContent>
                <video src={cls.recordingUrl} controls className="w-full rounded-lg" />
              </CardContent>
            </Card>
          ) : (
            <Card><CardContent className="py-12 text-center"><Video className="w-12 h-12 mx-auto text-gray-300 mb-4" /><p className="text-gray-500">{new Date(cls.scheduledAt) > new Date() ? "Class has not started yet." : "No recording available."}</p>{cls.isLive === false && !cls.endedAt && <a href={jitsiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 mt-2 text-sm"><ExternalLink className="w-3 h-3" /> Open meeting room</a>}</CardContent></Card>
          )}
        </div>
        <Card className="flex flex-col" style={{ height: cls.isLive ? "520px" : "400px" }}>
          <CardHeader className="pb-2"><CardTitle className="text-lg">Chat</CardTitle></CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-3">
            {chat.map((m) => (
              <div key={m.id} className={`flex gap-2 ${m.userId === user?.id ? "flex-row-reverse" : ""}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.userId === user?.id ? "bg-orange-100 text-gray-900" : "bg-gray-100 text-gray-800"}`}>
                  <p className="font-medium text-xs mb-1">{m.user.firstName} {m.user.lastName}</p>
                  <p>{m.message}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </CardContent>
          <Separator />
          <div className="p-3 flex gap-2">
            <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} />
            <Button size="sm" onClick={sendMessage}><Send className="w-4 h-4" /></Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
