import { Router } from "express";
import bcrypt from "bcrypt";
import { db, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";

const router = Router();

router.get("/users", requireAuth, requireRole("admin", "super_admin"), async (req, res) => {
  try {
    const role = req.query.role as string | undefined;
    const users = await db.query.usersTable.findMany({
      ...(role ? { where: eq(usersTable.role, role as any) } : {}),
      orderBy: [desc(usersTable.createdAt)],
    });
    res.json(users.map((u) => ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role, avatar: u.avatar, phone: u.phone, createdAt: u.createdAt })));
  } catch { res.status(500).json({ error: "Failed to fetch users" }); }
});

router.put("/users/:id", requireAuth, async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    if (req.user!.userId !== targetId && !["admin", "super_admin"].includes(req.user!.role)) {
      res.status(403).json({ error: "Cannot update this user" }); return;
    }
    const { firstName, lastName, bio, phone, avatar } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (bio !== undefined) updates.bio = bio;
    if (phone !== undefined) updates.phone = phone;
    if (avatar !== undefined) updates.avatar = avatar;
    const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, targetId)).returning();
    res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatar: user.avatar, bio: user.bio, phone: user.phone });
  } catch { res.status(500).json({ error: "Failed to update user" }); }
});

router.put("/users/:id/role", requireAuth, requireRole("super_admin"), async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "teacher", "admin", "super_admin"].includes(role)) {
      res.status(400).json({ error: "Invalid role" }); return;
    }
    const [user] = await db.update(usersTable).set({ role, updatedAt: new Date() }).where(eq(usersTable.id, Number(req.params.id))).returning();
    res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role });
  } catch { res.status(500).json({ error: "Failed to update role" }); }
});

router.delete("/users/:id", requireAuth, requireRole("super_admin"), async (req, res) => {
  try {
    await db.delete(usersTable).where(eq(usersTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Failed to delete user" }); }
});

router.put("/users/:id/password", requireAuth, async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    if (req.user!.userId !== targetId && !["admin", "super_admin"].includes(req.user!.role)) {
      res.status(403).json({ error: "Cannot change this password" }); return;
    }
    const { currentPassword, newPassword } = req.body;
    if (req.user!.userId === targetId) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, targetId)).limit(1);
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) { res.status(401).json({ error: "Current password is incorrect" }); return; }
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.update(usersTable).set({ password: hashed, updatedAt: new Date() }).where(eq(usersTable.id, targetId));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Failed to change password" }); }
});

export default router;
