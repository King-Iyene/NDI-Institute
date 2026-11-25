import { Router } from "express";
import { db, coursesTable, courseLessonsTable, courseEnrollmentsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";

const router = Router();

router.get("/courses", requireAuth, async (req, res) => {
  try {
    const courses = await db.query.coursesTable.findMany({
      with: { teacher: true, enrollments: true },
      orderBy: [desc(coursesTable.createdAt)],
    });
    const mapped = courses.map((c) => ({
      ...c, teacher: { id: c.teacher.id, firstName: c.teacher.firstName, lastName: c.teacher.lastName },
      enrollmentCount: c.enrollments.length,
      enrollments: undefined,
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

router.get("/courses/:id", requireAuth, async (req, res) => {
  try {
    const course = await db.query.coursesTable.findFirst({
      where: eq(coursesTable.id, Number(req.params.id)),
      with: { teacher: true, lessons: { orderBy: [courseLessonsTable.orderIndex] }, enrollments: { with: { student: true } } },
    });
    if (!course) { res.status(404).json({ error: "Course not found" }); return; }
    res.json({
      ...course,
      teacher: { id: course.teacher.id, firstName: course.teacher.firstName, lastName: course.teacher.lastName, avatar: course.teacher.avatar },
      enrollments: course.enrollments.map((e) => ({ id: e.id, enrolledAt: e.enrolledAt, student: { id: e.student.id, firstName: e.student.firstName, lastName: e.student.lastName, email: e.student.email } })),
    });
  } catch { res.status(500).json({ error: "Failed to fetch course" }); }
});

router.post("/courses", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    const { title, description, coverImage } = req.body;
    const [course] = await db.insert(coursesTable).values({ title, description, coverImage, teacherId: req.user!.userId }).returning();
    res.status(201).json(course);
  } catch { res.status(500).json({ error: "Failed to create course" }); }
});

router.put("/courses/:id", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    const { title, description, coverImage, published } = req.body;
    const [course] = await db.update(coursesTable).set({ title, description, coverImage, published, updatedAt: new Date() }).where(eq(coursesTable.id, Number(req.params.id))).returning();
    res.json(course);
  } catch { res.status(500).json({ error: "Failed to update course" }); }
});

router.delete("/courses/:id", requireAuth, requireRole("admin", "super_admin"), async (req, res) => {
  try {
    await db.delete(coursesTable).where(eq(coursesTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Failed to delete course" }); }
});

router.post("/courses/:id/lessons", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    const { title, content, videoUrl, orderIndex } = req.body;
    const [lesson] = await db.insert(courseLessonsTable).values({ courseId: Number(req.params.id), title, content, videoUrl, orderIndex: orderIndex ?? 0 }).returning();
    res.status(201).json(lesson);
  } catch { res.status(500).json({ error: "Failed to create lesson" }); }
});

router.put("/courses/:courseId/lessons/:lessonId", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    const { title, content, videoUrl, orderIndex } = req.body;
    const [lesson] = await db.update(courseLessonsTable).set({ title, content, videoUrl, orderIndex }).where(eq(courseLessonsTable.id, Number(req.params.lessonId))).returning();
    res.json(lesson);
  } catch { res.status(500).json({ error: "Failed to update lesson" }); }
});

router.delete("/courses/:courseId/lessons/:lessonId", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    await db.delete(courseLessonsTable).where(eq(courseLessonsTable.id, Number(req.params.lessonId)));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Failed to delete lesson" }); }
});

router.post("/courses/:id/enroll", requireAuth, async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    const existing = await db.select().from(courseEnrollmentsTable).where(and(eq(courseEnrollmentsTable.courseId, courseId), eq(courseEnrollmentsTable.studentId, req.user!.userId))).limit(1);
    if (existing.length > 0) { res.status(409).json({ error: "Already enrolled" }); return; }
    const [enrollment] = await db.insert(courseEnrollmentsTable).values({ courseId, studentId: req.user!.userId }).returning();
    res.status(201).json(enrollment);
  } catch { res.status(500).json({ error: "Failed to enroll" }); }
});

export default router;
