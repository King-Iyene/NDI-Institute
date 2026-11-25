import { pgTable, serial, varchar, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  teacherId: integer("teacher_id").notNull().references(() => usersTable.id),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courseLessonsTable = pgTable("course_lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  videoUrl: text("video_url"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courseEnrollmentsTable = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  studentId: integer("student_id").notNull().references(() => usersTable.id),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});

export const coursesRelations = relations(coursesTable, ({ one, many }) => ({
  teacher: one(usersTable, { fields: [coursesTable.teacherId], references: [usersTable.id] }),
  lessons: many(courseLessonsTable),
  enrollments: many(courseEnrollmentsTable),
}));

export const lessonsRelations = relations(courseLessonsTable, ({ one }) => ({
  course: one(coursesTable, { fields: [courseLessonsTable.courseId], references: [coursesTable.id] }),
}));

export const enrollmentsRelations = relations(courseEnrollmentsTable, ({ one }) => ({
  course: one(coursesTable, { fields: [courseEnrollmentsTable.courseId], references: [coursesTable.id] }),
  student: one(usersTable, { fields: [courseEnrollmentsTable.studentId], references: [usersTable.id] }),
}));
