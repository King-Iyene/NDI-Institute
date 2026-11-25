import { useState, useEffect } from "react";
import { useAuth, apiFetch } from "../auth-context";
import { Link, useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Plus, Users, Clock, Edit, Trash2, Video, ChevronLeft, GripVertical } from "lucide-react";

interface Course {
  id: number; title: string; description: string | null; coverImage: string | null;
  teacherId: number; published: boolean; createdAt: string;
  teacher: { id: number; firstName: string; lastName: string };
  enrollmentCount: number;
}

interface Lesson { id: number; courseId: number; title: string; content: string | null; videoUrl: string | null; orderIndex: number; }

interface CourseDetail extends Omit<Course, 'enrollmentCount'> {
  lessons: Lesson[];
  enrollments: { id: number; enrolledAt: string; student: { id: number; firstName: string; lastName: string; email: string } }[];
}

export function CoursesPage() {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [, navigate] = useLocation();

  useEffect(() => {
    apiFetch("/courses", { token: token! }).then(setCourses).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const canCreate = user && ["teacher", "admin", "super_admin"].includes(user.role);

  async function createCourse() {
    try {
      const course = await apiFetch("/courses", { method: "POST", body: JSON.stringify(form), token: token! });
      navigate(`/portal/courses/${course.id}`);
    } catch (err: any) { alert(err.message); }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading courses...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Courses</h1><p className="text-gray-500 mt-1">Browse and manage courses</p></div>
        {canCreate && (
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> New Course</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create a new course</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Course title" /></div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What is this course about?" rows={3} /></div>
                <Button onClick={createCourse} disabled={!form.title} className="w-full">Create Course</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {courses.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" /><p className="text-gray-500">No courses yet.</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <Link key={c.id} href={`/portal/courses/${c.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                {c.coverImage && <div className="h-32 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${c.coverImage})` }} />}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <Badge variant={c.published ? "default" : "secondary"}>{c.published ? "Published" : "Draft"}</Badge>
                  </div>
                  <CardDescription>{c.teacher.firstName} {c.teacher.lastName}</CardDescription>
                </CardHeader>
                <CardContent>
                  {c.description && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{c.description}</p>}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.enrollmentCount} enrolled</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function CourseDetailPage() {
  const { user, token } = useAuth();
  const params = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: "", content: "", videoUrl: "" });
  const [, navigate] = useLocation();

  const isOwner = user && course && (course.teacherId === user.id || ["admin", "super_admin"].includes(user.role));
  const isEnrolled = user && course?.enrollments.some((e) => e.student.id === user.id);

  useEffect(() => {
    apiFetch(`/courses/${params.id}`, { token: token! }).then(setCourse).catch(console.error).finally(() => setLoading(false));
  }, [params.id, token]);

  async function enroll() {
    try {
      await apiFetch(`/courses/${params.id}/enroll`, { method: "POST", token: token! });
      const updated = await apiFetch(`/courses/${params.id}`, { token: token! });
      setCourse(updated);
    } catch (err: any) { alert(err.message); }
  }

  async function addLesson() {
    try {
      await apiFetch(`/courses/${params.id}/lessons`, { method: "POST", body: JSON.stringify({ ...lessonForm, orderIndex: (course?.lessons.length || 0) }), token: token! });
      const updated = await apiFetch(`/courses/${params.id}`, { token: token! });
      setCourse(updated);
      setShowAddLesson(false);
      setLessonForm({ title: "", content: "", videoUrl: "" });
    } catch (err: any) { alert(err.message); }
  }

  async function togglePublish() {
    try {
      await apiFetch(`/courses/${params.id}`, { method: "PUT", body: JSON.stringify({ published: !course?.published }), token: token! });
      const updated = await apiFetch(`/courses/${params.id}`, { token: token! });
      setCourse(updated);
    } catch (err: any) { alert(err.message); }
  }

  async function deleteLesson(lessonId: number) {
    if (!confirm("Delete this lesson?")) return;
    try {
      await apiFetch(`/courses/${params.id}/lessons/${lessonId}`, { method: "DELETE", token: token! });
      const updated = await apiFetch(`/courses/${params.id}`, { token: token! });
      setCourse(updated);
    } catch (err: any) { alert(err.message); }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading...</p></div>;
  if (!course) return <div className="text-center py-12"><p className="text-gray-500">Course not found.</p></div>;

  return (
    <div>
      <button onClick={() => navigate("/portal/courses")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"><ChevronLeft className="w-4 h-4" /> Back to courses</button>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <Badge variant={course.published ? "default" : "secondary"}>{course.published ? "Published" : "Draft"}</Badge>
          </div>
          <p className="text-gray-500 mt-1">by {course.teacher.firstName} {course.teacher.lastName}</p>
          {course.description && <p className="text-gray-600 mt-2">{course.description}</p>}
        </div>
        <div className="flex gap-2">
          {isOwner && <Button variant="outline" onClick={togglePublish}>{course.published ? "Unpublish" : "Publish"}</Button>}
          {user?.role === "student" && !isEnrolled && <Button onClick={enroll}>Enroll in Course</Button>}
          {isEnrolled && <Badge variant="default" className="self-center">Enrolled</Badge>}
        </div>
      </div>

      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Lessons ({course.lessons.length})</TabsTrigger>
          {isOwner && <TabsTrigger value="students">Students ({course.enrollments.length})</TabsTrigger>}
        </TabsList>
        <TabsContent value="lessons" className="mt-4">
          <div className="space-y-3">
            {course.lessons.map((lesson, i) => (
              <Card key={lesson.id}>
                <CardContent className="py-4 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-600">{i + 1}</span>
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      {lesson.content && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{lesson.content}</p>}
                      {lesson.videoUrl && <span className="inline-flex items-center gap-1 text-xs text-blue-600 mt-1"><Video className="w-3 h-3" /> Video lesson</span>}
                    </div>
                  </div>
                  {isOwner && <Button variant="ghost" size="sm" onClick={() => deleteLesson(lesson.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>}
                </CardContent>
              </Card>
            ))}
            {course.lessons.length === 0 && <p className="text-gray-500 text-center py-8">No lessons yet.</p>}
            {isOwner && (
              <Dialog open={showAddLesson} onOpenChange={setShowAddLesson}>
                <DialogTrigger asChild><Button variant="outline" className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Lesson</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add a lesson</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div><Label>Title</Label><Input value={lessonForm.title} onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))} /></div>
                    <div><Label>Content</Label><Textarea value={lessonForm.content} onChange={(e) => setLessonForm((f) => ({ ...f, content: e.target.value }))} rows={6} /></div>
                    <div><Label>Video URL (optional)</Label><Input value={lessonForm.videoUrl} onChange={(e) => setLessonForm((f) => ({ ...f, videoUrl: e.target.value }))} placeholder="https://..." /></div>
                    <Button onClick={addLesson} disabled={!lessonForm.title} className="w-full">Add Lesson</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </TabsContent>
        {isOwner && (
          <TabsContent value="students" className="mt-4">
            {course.enrollments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No students enrolled yet.</p>
            ) : (
              <div className="space-y-2">
                {course.enrollments.map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{e.student.firstName} {e.student.lastName}</p>
                      <p className="text-sm text-gray-500">{e.student.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">Enrolled {new Date(e.enrolledAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
