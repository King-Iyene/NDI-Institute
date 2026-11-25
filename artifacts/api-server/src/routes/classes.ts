import { Router } from "express";
import { db, virtualClassesTable, classChatMessagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";
import crypto from "crypto";

const router = Router();

router.get("/courses/:courseId/classes", requireAuth, async (req, res) => {
  try {
    const classes = await db.query.virtualClassesTable.findMany({
      where: eq(virtualClassesTable.courseId, Number(req.params.courseId)),
      with: { host: true },
      orderBy: [desc(virtualClassesTable.scheduledAt)],
    });
    res.json(classes.map((c) => ({
      ...c,
      host: { id: c.host.id, firstName: c.host.firstName, lastName: c.host.lastName },
    })));
  } catch { res.status(500).json({ error: "Failed to fetch classes" }); }
});

router.get("/classes", requireAuth, async (req, res) => {
  try {
    const classes = await db.query.virtualClassesTable.findMany({
      with: { host: true, course: true },
      orderBy: [desc(virtualClassesTable.scheduledAt)],
    });
    res.json(classes.map((c) => ({
      ...c,
      host: { id: c.host.id, firstName: c.host.firstName, lastName: c.host.lastName },
      course: { id: c.course.id, title: c.course.title },
    })));
  } catch { res.status(500).json({ error: "Failed to fetch classes" }); }
});

router.post("/courses/:courseId/classes", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    const { title, description, scheduledAt } = req.body;
    const roomId = `ndi-${crypto.randomBytes(8).toString("hex")}`;
    const [cls] = await db.insert(virtualClassesTable).values({
      courseId: Number(req.params.courseId), title, description,
      hostId: req.user!.userId, roomId,
      scheduledAt: new Date(scheduledAt),
    }).returning();
    res.status(201).json(cls);
  } catch { res.status(500).json({ error: "Failed to create class" }); }
});

router.put("/classes/:id", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    const { isLive, endedAt, recordingUrl, title, description, scheduledAt } = req.body;
    const updates: Record<string, unknown> = {};
    if (isLive !== undefined) updates.isLive = isLive;
    if (endedAt !== undefined) updates.endedAt = new Date(endedAt);
    if (recordingUrl !== undefined) updates.recordingUrl = recordingUrl;
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (scheduledAt !== undefined) updates.scheduledAt = new Date(scheduledAt);
    const [cls] = await db.update(virtualClassesTable).set(updates).where(eq(virtualClassesTable.id, Number(req.params.id))).returning();
    res.json(cls);
  } catch { res.status(500).json({ error: "Failed to update class" }); }
});

router.get("/classes/:id/chat", requireAuth, async (req, res) => {
  try {
    const messages = await db.query.classChatMessagesTable.findMany({
      where: eq(classChatMessagesTable.classId, Number(req.params.id)),
      with: { user: true },
      orderBy: [classChatMessagesTable.createdAt],
    });
    res.json(messages.map((m) => ({
      ...m,
      user: { id: m.user.id, firstName: m.user.firstName, lastName: m.user.lastName, avatar: m.user.avatar },
    })));
  } catch { res.status(500).json({ error: "Failed to fetch chat" }); }
});

router.post("/classes/:id/chat", requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    const [msg] = await db.insert(classChatMessagesTable).values({
      classId: Number(req.params.id), userId: req.user!.userId, message,
    }).returning();
    res.status(201).json(msg);
  } catch { res.status(500).json({ error: "Failed to send message" }); }
});

export default router;
