import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";
import { coursesTable } from "./courses";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";

export const forumsTable = pgTable("forums", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdById: integer("created_by_id").notNull().references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forumPostsTable = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  forumId: integer("forum_id").notNull().references(() => forumsTable.id, { onDelete: "cascade" }),
  authorId: integer("author_id").notNull().references(() => usersTable.id),
  parentId: integer("parent_id"),
  content: text("content").notNull(),
  fileUrl: text("file_url"),
  fileName: varchar("file_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const forumsRelations = relations(forumsTable, ({ one, many }) => ({
  course: one(coursesTable, { fields: [forumsTable.courseId], references: [coursesTable.id] }),
  createdBy: one(usersTable, { fields: [forumsTable.createdById], references: [usersTable.id] }),
  posts: many(forumPostsTable),
}));

export const forumPostsRelations = relations(forumPostsTable, ({ one }) => ({
  forum: one(forumsTable, { fields: [forumPostsTable.forumId], references: [forumsTable.id] }),
  author: one(usersTable, { fields: [forumPostsTable.authorId], references: [usersTable.id] }),
}));
