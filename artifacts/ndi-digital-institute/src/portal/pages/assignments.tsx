import { useState, useEffect } from "react";
import { useAuth, apiFetch } from "../auth-context";
import { Link, useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Clock, CheckCircle2, AlertCircle, ChevronLeft, Upload, FileText, Send } from "lucide-react";

interface Assignment {
  id: number; courseId: number; title: string; description: string | null;
  type: "assignment" | "quiz"; startDate: string; dueDate: string;
  totalPoints: number; course: { id: number; title: string };
  submissionCount?: number;
}

interface Submission {
  id: number; assignmentId: number; studentId: number; content: string | null;
  fileUrl: string | null; fileName: string | null; grade: number | null;
  feedback: string | null; submittedAt: string; gradedAt: string | null;
  student: { id: number; firstName: string; lastName: string; email: string };
}

function getStatus(a: Assignment): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  const now = new Date();
  if (now < new Date(a.startDate)) return { label: "Upcoming", variant: "secondary" };
  if (now > new Date(a.dueDate)) return { label: "Closed", variant: "destructive" };
  return { label: "Open", variant: "default" };
}

export function AssignmentsPage() {
  const { user, token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    apiFetch("/assignments", { token: token! }).then(setAssignments).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const filtered = tab === "all" ? assignments
    : tab === "assignments" ? assignments.filter((a) => a.type === "assignment")
    : assignments.filter((a) => a.type === "quiz");

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assignments & Quizzes</h1>
        <p className="text-gray-500 mt-1">View and manage all your assignments and quizzes</p>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
          <TabsTrigger value="assignments">Assignments ({assignments.filter((a) => a.type === "assignment").length})</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes ({assignments.filter((a) => a.type === "quiz").length})</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <Card><CardContent className="py-12 text-center"><ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-4" /><p className="text-gray-500">No {tab === "all" ? "assignments or quizzes" : tab} yet.</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((a) => {
                const status = getStatus(a);
                return (
                  <Link key={a.id} href={`/portal/assignments/${a.id}`}>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.type === "quiz" ? "bg-purple-100" : "bg-blue-100"}`}>
                            {a.type === "quiz" ? <FileText className="w-5 h-5 text-purple-600" /> : <ClipboardList className="w-5 h-5 text-blue-600" />}
                          </div>
                          <div>
                            <h3 className="font-medium">{a.title}</h3>
                            <p className="text-sm text-gray-500">{a.course.title} · {a.totalPoints} points</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due {new Date(a.dueDate).toLocaleDateString()}</div>
                          </div>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function AssignmentDetailPage() {
  const { user, token } = useAuth();
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitContent, setSubmitContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [grading, setGrading] = useState<{ id: number; grade: string; feedback: string } | null>(null);

  const isTeacher = user && ["teacher", "admin", "super_admin"].includes(user.role);

  useEffect(() => {
    Promise.all([
      apiFetch("/assignments", { token: token! }).then((all: Assignment[]) => all.find((a) => a.id === Number(params.id))),
      apiFetch(`/assignments/${params.id}/submissions`, { token: token! }),
    ]).then(([a, s]) => { setAssignment(a || null); setSubmissions(s); }).catch(console.error).finally(() => setLoading(false));
  }, [params.id, token]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await apiFetch(`/assignments/${params.id}/submit`, { method: "POST", body: JSON.stringify({ content: submitContent }), token: token! });
      const subs = await apiFetch(`/assignments/${params.id}/submissions`, { token: token! });
      setSubmissions(subs);
      setSubmitContent("");
    } catch (err: any) { alert(err.message); }
    setSubmitting(false);
  }

  async function handleGrade() {
    if (!grading) return;
    try {
      await apiFetch(`/submissions/${grading.id}/grade`, { method: "PUT", body: JSON.stringify({ grade: Number(grading.grade), feedback: grading.feedback }), token: token! });
      const subs = await apiFetch(`/assignments/${params.id}/submissions`, { token: token! });
      setSubmissions(subs);
      setGrading(null);
    } catch (err: any) { alert(err.message); }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading...</p></div>;
  if (!assignment) return <div className="text-center py-12"><p className="text-gray-500">Assignment not found.</p></div>;

  const status = getStatus(assignment);
  const mySubmission = submissions.find((s) => s.studentId === user?.id);

  return (
    <div>
      <button onClick={() => navigate("/portal/assignments")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"><ChevronLeft className="w-4 h-4" /> Back</button>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <p className="text-gray-500 mt-1">{assignment.course.title} · {assignment.totalPoints} points · Due {new Date(assignment.dueDate).toLocaleDateString()}</p>
        </div>
      </div>
      {assignment.description && <Card className="mb-6"><CardContent className="py-4"><p className="text-gray-700 whitespace-pre-wrap">{assignment.description}</p></CardContent></Card>}

      {user?.role === "student" && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Your Submission</CardTitle></CardHeader>
          <CardContent>
            {mySubmission ? (
              <div>
                <p className="text-gray-700 whitespace-pre-wrap mb-3">{mySubmission.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Submitted {new Date(mySubmission.submittedAt).toLocaleString()}</span>
                  {mySubmission.grade !== null && (
                    <Badge variant="default">{mySubmission.grade}/{assignment.totalPoints}</Badge>
                  )}
                </div>
                {mySubmission.feedback && <p className="mt-2 p-3 bg-gray-50 rounded-lg text-sm"><strong>Feedback:</strong> {mySubmission.feedback}</p>}
              </div>
            ) : status.label === "Open" ? (
              <div className="space-y-3">
                <Textarea value={submitContent} onChange={(e) => setSubmitContent(e.target.value)} placeholder="Type your answer here..." rows={6} />
                <Button onClick={handleSubmit} disabled={!submitContent || submitting}><Send className="w-4 h-4 mr-2" /> {submitting ? "Submitting..." : "Submit"}</Button>
              </div>
            ) : (
              <p className="text-gray-500">This {assignment.type} is {status.label.toLowerCase()}.</p>
            )}
          </CardContent>
        </Card>
      )}

      {isTeacher && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Submissions ({submissions.length})</CardTitle></CardHeader>
          <CardContent>
            {submissions.length === 0 ? <p className="text-gray-500">No submissions yet.</p> : (
              <div className="space-y-3">
                {submissions.map((s) => (
                  <div key={s.id} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{s.student.firstName} {s.student.lastName}</p>
                        <p className="text-xs text-gray-500">{new Date(s.submittedAt).toLocaleString()}</p>
                      </div>
                      {s.grade !== null ? (
                        <Badge variant="default">{s.grade}/{assignment.totalPoints}</Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setGrading({ id: s.id, grade: "", feedback: "" })}>Grade</Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{s.content}</p>
                    {s.fileName && <p className="text-sm text-blue-600 mt-1 flex items-center gap-1"><FileText className="w-3 h-3" /> {s.fileName}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={!!grading} onOpenChange={() => setGrading(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Grade Submission</DialogTitle></DialogHeader>
          {grading && (
            <div className="space-y-4 mt-4">
              <div><Label>Grade (out of {assignment.totalPoints})</Label><Input type="number" value={grading.grade} onChange={(e) => setGrading((g) => g && { ...g, grade: e.target.value })} min={0} max={assignment.totalPoints} /></div>
              <div><Label>Feedback (optional)</Label><Textarea value={grading.feedback} onChange={(e) => setGrading((g) => g && { ...g, feedback: e.target.value })} rows={3} /></div>
              <Button onClick={handleGrade} className="w-full">Submit Grade</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
