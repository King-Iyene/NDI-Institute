import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  programme: varchar("programme", { length: 255 }),
  mode: varchar("mode", { length: 255 }),
  location: varchar("location", { length: 255 }),
  note: text("note"),
  field: varchar("field", { length: 255 }),
  status: varchar("status", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEnquirySchema = createInsertSchema(enquiriesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type Enquiry = typeof enquiriesTable.$inferSelect;
