import { Router } from "express";
import { db, forumsTable, forumPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";

const router = Router();

router.get("/courses/:courseId/forums", requireAuth, async (req, res) => {
  try {
    const forums = await db.query.forumsTable.findMany({
      where: eq(forumsTable.courseId, Number(req.params.courseId)),
      with: { createdBy: true, posts: true },
      orderBy: [desc(forumsTable.createdAt)],
    });
    res.json(forums.map((f) => ({
      ...f,
      createdBy: { id: f.createdBy.id, firstName: f.createdBy.firstName, lastName: f.createdBy.lastName },
      postCount: f.posts.length,
      posts: undefined,
    })));
  } catch { res.status(500).json({ error: "Failed to fetch forums" }); }
});

router.post("/courses/:courseId/forums", requireAuth, requireRole("teacher", "admin", "super_admin"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const [forum] = await db.insert(forumsTable).values({
      courseId: Number(req.params.courseId), title, description, createdById: req.user!.userId,
    }).returning();
    res.status(201).json(forum);
  } catch { res.status(500).json({ error: "Failed to create forum" }); }
});

router.get("/forums/:id/posts", requireAuth, async (req, res) => {
  try {
    const posts = await db.query.forumPostsTable.findMany({
      where: eq(forumPostsTable.forumId, Number(req.params.id)),
      with: { author: true },
      orderBy: [forumPostsTable.createdAt],
    });
    res.json(posts.map((p) => ({
      ...p,
      author: { id: p.author.id, firstName: p.author.firstName, lastName: p.author.lastName, avatar: p.author.avatar },
    })));
  } catch { res.status(500).json({ error: "Failed to fetch posts" }); }
});

router.post("/forums/:id/posts", requireAuth, async (req, res) => {
  try {
    const { content, parentId, fileUrl, fileName } = req.body;
    const [post] = await db.insert(forumPostsTable).values({
      forumId: Number(req.params.id), authorId: req.user!.userId,
      content, parentId: parentId ?? null, fileUrl, fileName,
    }).returning();
    res.status(201).json(post);
  } catch { res.status(500).json({ error: "Failed to create post" }); }
});

router.delete("/forums/posts/:id", requireAuth, async (req, res) => {
  try {
    const post = await db.query.forumPostsTable.findFirst({ where: eq(forumPostsTable.id, Number(req.params.id)) });
    if (!post) { res.status(404).json({ error: "Post not found" }); return; }
    if (post.authorId !== req.user!.userId && !["admin", "super_admin"].includes(req.user!.role)) {
      res.status(403).json({ error: "Cannot delete this post" }); return;
    }
    await db.delete(forumPostsTable).where(eq(forumPostsTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Failed to delete post" }); }
});

export default router;
