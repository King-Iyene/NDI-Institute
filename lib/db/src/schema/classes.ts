import { pgTable, serial, varchar, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { coursesTable } from "./courses";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";

export const virtualClassesTable = pgTable("virtual_classes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  hostId: integer("host_id").notNull().references(() => usersTable.id),
  roomId: varchar("room_id", { length: 255 }).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  endedAt: timestamp("ended_at"),
  isLive: boolean("is_live").default(false).notNull(),
  recordingUrl: text("recording_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classChatMessagesTable = pgTable("class_chat_messages", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull().references(() => virtualClassesTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const virtualClassesRelations = relations(virtualClassesTable, ({ one, many }) => ({
  course: one(coursesTable, { fields: [virtualClassesTable.courseId], references: [coursesTable.id] }),
  host: one(usersTable, { fields: [virtualClassesTable.hostId], references: [usersTable.id] }),
  chatMessages: many(classChatMessagesTable),
}));

export const chatMessagesRelations = relations(classChatMessagesTable, ({ one }) => ({
  class: one(virtualClassesTable, { fields: [classChatMessagesTable.classId], references: [virtualClassesTable.id] }),
  user: one(usersTable, { fields: [classChatMessagesTable.userId], references: [usersTable.id] }),
}));
