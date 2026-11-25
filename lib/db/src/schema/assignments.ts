import { pgTable, serial, varchar, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { coursesTable } from "./courses";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";

export const assignmentTypeEnum = pgEnum("assignment_type", ["assignment", "quiz"]);

export const assignmentsTable = pgTable("assignments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: assignmentTypeEnum("type").notNull().default("assignment"),
  startDate: timestamp("start_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  totalPoints: integer("total_points").notNull().default(100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const submissionsTable = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => assignmentsTable.id, { onDelete: "cascade" }),
  studentId: integer("student_id").notNull().references(() => usersTable.id),
  content: text("content"),
  fileUrl: text("file_url"),
  fileName: varchar("file_name", { length: 255 }),
  grade: integer("grade"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  gradedAt: timestamp("graded_at"),
});

export const assignmentsRelations = relations(assignmentsTable, ({ one, many }) => ({
  course: one(coursesTable, { fields: [assignmentsTable.courseId], references: [coursesTable.id] }),
  submissions: many(submissionsTable),
}));

export const submissionsRelations = relations(submissionsTable, ({ one }) => ({
  assignment: one(assignmentsTable, { fields: [submissionsTable.assignmentId], references: [assignmentsTable.id] }),
  student: one(usersTable, { fields: [submissionsTable.studentId], references: [usersTable.id] }),
}));
