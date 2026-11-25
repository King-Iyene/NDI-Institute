import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth, apiFetch } from "../auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen, ClipboardList, Video, MessageSquare, Users,
  TrendingUp, Clock, CheckCircle2, AlertCircle, GraduationCap, Calendar,
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  description?: string;
  coverImage?: string;
  published: boolean;
  teacher: { id: number; firstName: string; lastName: string };
  enrollmentCount: number;
}

interface Assignment {
  id: number;
  title: string;
  type: string;
  startDate: string;
  dueDate: string;
  totalPoints: number;
  course: { id: number; title: string };
  submissionCount?: number;
}

interface VirtualClass {
  id: number;
  title: string;
  scheduledAt: string;
  isLive: boolean;
  recordingUrl?: string;
  host: { id: number; firstName: string; lastName: string };
  course: { id: number; title: string };
}

interface UserInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentStatus({ startDate, dueDate }: { startDate: string; dueDate: string }) {
  const now = new Date();
  const start = new Date(startDate);
  const due = new Date(dueDate);
  if (now < start) return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Not yet open</Badge>;
  if (now > due) return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" />Closed</Badge>;
  return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="mr-1 h-3 w-3" />Open</Badge>;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StudentDashboard({ token }: { token: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<VirtualClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, a, cl] = await Promise.all([
          apiFetch("/courses", { token }),
          apiFetch("/assignments", { token }),
          apiFetch("/classes", { token }),
        ]);
        setCourses(c);
        setAssignments(a);
        setClasses(cl);
      } catch {}
      setLoading(false);
    })();
  }, [token]);

  const now = new Date();
  const upcoming = assignments
    .filter((a) => new Date(a.dueDate) >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
  const upcomingClasses = classes
    .filter((c) => new Date(c.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);
  const pendingCount = assignments.filter((a) => new Date(a.startDate) <= now && new Date(a.dueDate) >= now).length;

  if (loading) return <p className="text-muted-foreground p-8">Loading dashboard...</p>;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Enrolled Courses" value={courses.length} color="bg-blue-600" />
        <StatCard icon={ClipboardList} label="Pending Assignments" value={pendingCount} color="bg-amber-600" />
        <StatCard icon={Video} label="Upcoming Classes" value={upcomingClasses.length} color="bg-purple-600" />
        <StatCard icon={MessageSquare} label="Total Assignments" value={assignments.length} color="bg-green-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> My Courses</CardTitle>
            <CardDescription>Courses you are enrolled in</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses yet. Browse available courses to enroll.</p>
            ) : (
              <div className="space-y-3">
                {courses.slice(0, 5).map((c) => (
                  <Link key={c.id} href={`/portal/courses/${c.id}`} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">By {c.teacher.firstName} {c.teacher.lastName}</p>
                    </div>
                    <Badge variant="secondary">{c.enrollmentCount} enrolled</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Upcoming Assignments</CardTitle>
            <CardDescription>Sorted by due date</CardDescription>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming assignments.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((a) => (
                  <Link key={a.id} href={`/portal/assignments/${a.id}`} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.course.title} · Due {formatDate(a.dueDate)}</p>
                    </div>
                    <AssignmentStatus startDate={a.startDate} dueDate={a.dueDate} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Video className="h-5 w-5" /> Upcoming Classes</CardTitle>
            <CardDescription>Next scheduled live sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming classes scheduled.</p>
            ) : (
              <div className="space-y-3">
                {upcomingClasses.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.course.title} · {formatDate(c.scheduledAt)}</p>
                    </div>
                    {c.isLive ? (
                      <Badge className="bg-red-600 hover:bg-red-700 animate-pulse">LIVE</Badge>
                    ) : (
                      <Badge variant="outline"><Calendar className="mr-1 h-3 w-3" />Scheduled</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href="/portal/courses"><Button variant="outline" className="w-full justify-start"><BookOpen className="mr-2 h-4 w-4" />Browse Courses</Button></Link>
            <Link href="/portal/assignments"><Button variant="outline" className="w-full justify-start"><ClipboardList className="mr-2 h-4 w-4" />View All Assignments</Button></Link>
            <Link href="/portal/classes"><Button variant="outline" className="w-full justify-start"><Video className="mr-2 h-4 w-4" />Class Schedule</Button></Link>
            <Link href="/portal/forums"><Button variant="outline" className="w-full justify-start"><MessageSquare className="mr-2 h-4 w-4" />Discussion Forums</Button></Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function TeacherDashboard({ token, userId }: { token: string; userId: number }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<VirtualClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, a, cl] = await Promise.all([
          apiFetch("/courses", { token }),
          apiFetch("/assignments", { token }),
          apiFetch("/classes", { token }),
        ]);
        setCourses(c.filter((x: Course) => x.teacher.id === userId));
        setAssignments(a);
        setClasses(cl.filter((x: VirtualClass) => x.host.id === userId));
      } catch {}
      setLoading(false);
    })();
  }, [token, userId]);

  const now = new Date();
  const toGrade = assignments.filter((a) => (a.submissionCount ?? 0) > 0);
  const upcomingClasses = classes
    .filter((c) => new Date(c.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  if (loading) return <p className="text-muted-foreground p-8">Loading dashboard...</p>;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="My Courses" value={courses.length} color="bg-blue-600" />
        <StatCard icon={ClipboardList} label="To Grade" value={toGrade.length} color="bg-amber-600" />
        <StatCard icon={Video} label="Upcoming Classes" value={upcomingClasses.length} color="bg-purple-600" />
        <StatCard icon={Users} label="Total Students" value={courses.reduce((s, c) => s + c.enrollmentCount, 0)} color="bg-green-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> My Courses</CardTitle>
            <CardDescription>Courses you teach</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground">You have not created any courses yet.</p>
            ) : (
              <div className="space-y-3">
                {courses.map((c) => (
                  <Link key={c.id} href={`/portal/courses/${c.id}`} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.enrollmentCount} students enrolled</p>
                    </div>
                    <Badge variant={c.published ? "default" : "secondary"}>{c.published ? "Published" : "Draft"}</Badge>
                  </Link>
                ))}
              </div>
            )}
            <Separator className="my-4" />
            <Link href="/portal/courses/new"><Button className="w-full"><BookOpen className="mr-2 h-4 w-4" />Create New Course</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Assignments to Grade</CardTitle>
            <CardDescription>Submissions awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            {toGrade.length === 0 ? (
              <p className="text-sm text-muted-foreground">No submissions to grade.</p>
            ) : (
              <div className="space-y-3">
                {toGrade.slice(0, 5).map((a) => (
                  <Link key={a.id} href={`/portal/assignments/${a.id}`} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.course.title}</p>
                    </div>
                    <Badge className="bg-amber-600">{a.submissionCount} submissions</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Video className="h-5 w-5" /> Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming classes.</p>
            ) : (
              <div className="space-y-3">
                {upcomingClasses.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.course.title} · {formatDate(c.scheduledAt)}</p>
                    </div>
                    {c.isLive ? (
                      <Badge className="bg-red-600 hover:bg-red-700 animate-pulse">LIVE</Badge>
                    ) : (
                      <Badge variant="outline"><Calendar className="mr-1 h-3 w-3" />Scheduled</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Separator className="my-4" />
            <Link href="/portal/classes"><Button variant="outline" className="w-full"><Video className="mr-2 h-4 w-4" />Schedule a Class</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href="/portal/courses/new"><Button variant="outline" className="w-full justify-start"><BookOpen className="mr-2 h-4 w-4" />Create Course</Button></Link>
            <Link href="/portal/assignments"><Button variant="outline" className="w-full justify-start"><ClipboardList className="mr-2 h-4 w-4" />Manage Assignments</Button></Link>
            <Link href="/portal/forums"><Button variant="outline" className="w-full justify-start"><MessageSquare className="mr-2 h-4 w-4" />Discussion Forums</Button></Link>
            <Link href="/portal/recordings"><Button variant="outline" className="w-full justify-start"><Video className="mr-2 h-4 w-4" />Class Recordings</Button></Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function AdminDashboard({ token }: { token: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<VirtualClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, u, a, cl] = await Promise.all([
          apiFetch("/courses", { token }),
          apiFetch("/users", { token }),
          apiFetch("/assignments", { token }),
          apiFetch("/classes", { token }),
        ]);
        setCourses(c);
        setUsers(u);
        setAssignments(a);
        setClasses(cl);
      } catch {}
      setLoading(false);
    })();
  }, [token]);

  const studentCount = users.filter((u) => u.role === "student").length;
  const teacherCount = users.filter((u) => u.role === "teacher").length;
  const adminCount = users.filter((u) => u.role === "admin" || u.role === "super_admin").length;

  if (loading) return <p className="text-muted-foreground p-8">Loading dashboard...</p>;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Total Courses" value={courses.length} color="bg-blue-600" />
        <StatCard icon={Users} label="Total Users" value={users.length} color="bg-green-600" />
        <StatCard icon={ClipboardList} label="Assignments" value={assignments.length} color="bg-amber-600" />
        <StatCard icon={Video} label="Classes" value={classes.length} color="bg-purple-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Users Overview</CardTitle>
            <CardDescription>Breakdown by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Students</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${users.length ? (studentCount / users.length) * 100 : 0}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{studentCount}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Teachers</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: `${users.length ? (teacherCount / users.length) * 100 : 0}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{teacherCount}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Admins</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${users.length ? (adminCount / users.length) * 100 : 0}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{adminCount}</span>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <Link href="/portal/users"><Button variant="outline" className="w-full"><Users className="mr-2 h-4 w-4" />Manage Users</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> All Courses</CardTitle>
            <CardDescription>{courses.filter((c) => c.published).length} published, {courses.filter((c) => !c.published).length} draft</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses created yet.</p>
            ) : (
              <div className="space-y-3">
                {courses.slice(0, 5).map((c) => (
                  <Link key={c.id} href={`/portal/courses/${c.id}`} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">By {c.teacher.firstName} {c.teacher.lastName} · {c.enrollmentCount} enrolled</p>
                    </div>
                    <Badge variant={c.published ? "default" : "secondary"}>{c.published ? "Published" : "Draft"}</Badge>
                  </Link>
                ))}
              </div>
            )}
            <Separator className="my-4" />
            <Link href="/portal/courses"><Button variant="outline" className="w-full"><BookOpen className="mr-2 h-4 w-4" />View All Courses</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assignments yet.</p>
            ) : (
              <div className="space-y-3">
                {assignments.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.course.title} · Due {formatDate(a.dueDate)}</p>
                    </div>
                    <AssignmentStatus startDate={a.startDate} dueDate={a.dueDate} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Platform Management</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href="/portal/users"><Button variant="outline" className="w-full justify-start"><Users className="mr-2 h-4 w-4" />Manage Users</Button></Link>
            <Link href="/portal/courses"><Button variant="outline" className="w-full justify-start"><BookOpen className="mr-2 h-4 w-4" />Manage Courses</Button></Link>
            <Link href="/portal/assignments"><Button variant="outline" className="w-full justify-start"><ClipboardList className="mr-2 h-4 w-4" />All Assignments</Button></Link>
            <Link href="/portal/classes"><Button variant="outline" className="w-full justify-start"><Video className="mr-2 h-4 w-4" />All Classes</Button></Link>
            <Link href="/portal/forums"><Button variant="outline" className="w-full justify-start"><MessageSquare className="mr-2 h-4 w-4" />All Forums</Button></Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function DashboardPage() {
  const { user, token } = useAuth();

  if (!user || !token) return null;

  const greeting = `Welcome back, ${user.firstName}`;
  const roleLabel = user.role === "super_admin" ? "Super Admin" : user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{greeting}</h1>
        <p className="text-muted-foreground">
          <Badge variant="outline" className="mr-2">{roleLabel}</Badge>
          Here is what is happening across your portal.
        </p>
      </div>

      {user.role === "student" && <StudentDashboard token={token} />}
      {user.role === "teacher" && <TeacherDashboard token={token} userId={user.id} />}
      {(user.role === "admin" || user.role === "super_admin") && <AdminDashboard token={token} />}
    </div>
  );
}
