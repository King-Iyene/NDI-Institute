import { Router } from "express";
import { db, assignmentsTable, submissionsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";

const router = Router();

router.get("/courses/:courseId/assignments", requireAuth, async (req, res) => {
  try {
    const assignments = await db.query.assignmentsTable.findMany({
      where: eq(assignmentsTable.courseId, Number(req.params.courseId)),
      orderBy: [desc(assignmentsTable.dueDate)],
    });
    res.json(assignments);
  } catch { res.status(500).json({ error: "Failed to fetch assignments" }); }
});

router.get("/assignments", requireAuth, async (req, res) => {
  try {
    const assignments = await db.query.assignmentsTable.findMany({
      with: { course: true, submissions: true },
      orderBy: [desc(assignmentsTable.dueDate)],
    });
    res.json(assignments.map((a) => ({
      ...a,
      course: { id: a.course.id, title: a.course.title },
      submissionCount: a.submissions.length,
      submissions: undefined,
    })));
  } catch { res.status(500).json({ error: "Failed to fetch assignments" }); }
});

router.post("/courses/:courseId/assignments", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    const { title, description, type, startDate, dueDate, totalPoints } = req.body;
    const [assignment] = await db.insert(assignmentsTable).values({
      courseId: Number(req.params.courseId), title, description,
      type: type || "assignment",
      startDate: new Date(startDate), dueDate: new Date(dueDate),
      totalPoints: totalPoints ?? 100,
    }).returning();
    res.status(201).json(assignment);
  } catch (err) { console.error(err); res.status(500).json({ error: "Failed to create assignment" }); }
});

router.put("/assignments/:id", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    const { title, description, startDate, dueDate, totalPoints } = req.body;
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (startDate !== undefined) updates.startDate = new Date(startDate);
    if (dueDate !== undefined) updates.dueDate = new Date(dueDate);
    if (totalPoints !== undefined) updates.totalPoints = totalPoints;
    const [assignment] = await db.update(assignmentsTable).set(updates).where(eq(assignmentsTable.id, Number(req.params.id))).returning();
    res.json(assignment);
  } catch { res.status(500).json({ error: "Failed to update assignment" }); }
});

router.delete("/assignments/:id", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    await db.delete(assignmentsTable).where(eq(assignmentsTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Failed to delete assignment" }); }
});

router.get("/assignments/:id/submissions", requireAuth, async (req, res) => {
  try {
    const submissions = await db.query.submissionsTable.findMany({
      where: eq(submissionsTable.assignmentId, Number(req.params.id)),
      with: { student: true },
    });
    res.json(submissions.map((s) => ({
      ...s,
      student: { id: s.student.id, firstName: s.student.firstName, lastName: s.student.lastName, email: s.student.email },
    })));
  } catch { res.status(500).json({ error: "Failed to fetch submissions" }); }
});

router.post("/assignments/:id/submit", requireAuth, async (req, res) => {
  try {
    const { content, fileUrl, fileName } = req.body;
    const assignmentId = Number(req.params.id);
    const assignment = await db.query.assignmentsTable.findFirst({ where: eq(assignmentsTable.id, assignmentId) });
    if (!assignment) { res.status(404).json({ error: "Assignment not found" }); return; }
    const now = new Date();
    if (now < assignment.startDate) { res.status(400).json({ error: "Assignment not yet open" }); return; }
    if (now > assignment.dueDate) { res.status(400).json({ error: "Assignment is closed" }); return; }
    const [submission] = await db.insert(submissionsTable).values({ assignmentId, studentId: req.user!.userId, content, fileUrl, fileName }).returning();
    res.status(201).json(submission);
  } catch { res.status(500).json({ error: "Failed to submit" }); }
});

router.put("/submissions/:id/grade", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const [submission] = await db.update(submissionsTable).set({ grade, feedback, gradedAt: new Date() }).where(eq(submissionsTable.id, Number(req.params.id))).returning();
    res.json(submission);
  } catch { res.status(500).json({ error: "Failed to grade submission" }); }
});

export default router;
