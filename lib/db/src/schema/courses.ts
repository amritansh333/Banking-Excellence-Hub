import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { seoFields } from "./seoShared";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  overview: text("overview"),
  thumbnailUrl: text("thumbnail_url"),
  heroMediaUrl: text("hero_media_url"),
  duration: text("duration"),
  eligibility: text("eligibility"),
  learningMode: text("learning_mode"),
  learningOutcomes: jsonb("learning_outcomes").$type<string[]>().default([]),
  practicalTraining: text("practical_training"),
  mockInterviewInfo: text("mock_interview_info"),
  placementAssistance: text("placement_assistance"),
  ctaLabel: text("cta_label"),
  ctaUrl: text("cta_url"),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  status: text("status").notNull().default("DRAFT"),
  ...seoFields,
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const courseModulesTable = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => coursesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const courseTopicsTable = pgTable("course_topics", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id")
    .notNull()
    .references(() => courseModulesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const courseFaqsTable = pgTable("course_faqs", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => coursesTable.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const courseRelatedCoursesTable = pgTable("course_related_courses", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => coursesTable.id, { onDelete: "cascade" }),
  relatedCourseId: integer("related_course_id")
    .notNull()
    .references(() => coursesTable.id, { onDelete: "cascade" }),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;
export type CourseModule = typeof courseModulesTable.$inferSelect;
export type CourseTopic = typeof courseTopicsTable.$inferSelect;
export type CourseFaq = typeof courseFaqsTable.$inferSelect;
