import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { seoFields } from "./seoShared";

export const pagesTable = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  status: text("status").notNull().default("DRAFT"), // DRAFT, IN_REVIEW, SCHEDULED, PUBLISHED, ARCHIVED
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...seoFields,
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  publishedBy: integer("published_by"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const pageSectionsTable = pgTable("page_sections", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id")
    .notNull()
    .references(() => pagesTable.id, { onDelete: "cascade" }),
  sectionKey: text("section_key").notNull(),
  label: text("label").notNull(),
  content: jsonb("content")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  visible: boolean("visible").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  updatedBy: integer("updated_by"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertPageSchema = createInsertSchema(pagesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pagesTable.$inferSelect;

export const insertPageSectionSchema = createInsertSchema(
  pageSectionsTable,
).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPageSection = z.infer<typeof insertPageSectionSchema>;
export type PageSection = typeof pageSectionsTable.$inferSelect;
