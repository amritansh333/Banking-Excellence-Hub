import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const revisionsTable = pgTable("revisions", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(), // CREATE, UPDATE, PUBLISH, UNPUBLISH, ARCHIVE, RESTORE, ROLLBACK
  changedBy: integer("changed_by"),
  previousData: jsonb("previous_data").$type<Record<string, unknown> | null>(),
  updatedData: jsonb("updated_data").$type<Record<string, unknown> | null>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Revision = typeof revisionsTable.$inferSelect;
export type InsertRevision = typeof revisionsTable.$inferInsert;
