import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  photoUrl: text("photo_url"),
  courseId: integer("course_id"),
  currentRole: text("current_role"),
  organization: text("organization"),
  testimonialText: text("testimonial_text").notNull(),
  videoUrl: text("video_url"),
  rating: integer("rating"),
  featured: boolean("featured").notNull().default(false),
  showOnHomepage: boolean("show_on_homepage").notNull().default(false),
  showOnCoursePage: boolean("show_on_course_page").notNull().default(false),
  showOnTestimonialsPage: boolean("show_on_testimonials_page")
    .notNull()
    .default(true),
  displayOrder: integer("display_order").notNull().default(0),
  status: text("status").notNull().default("PUBLISHED"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const faqsTable = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"),
  relatedPage: text("related_page"),
  relatedCourseId: integer("related_course_id"),
  displayOrder: integer("display_order").notNull().default(0),
  status: text("status").notNull().default("PUBLISHED"), // PUBLISHED, UNPUBLISHED, ARCHIVED
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertTestimonialSchema = createInsertSchema(
  testimonialsTable,
).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonialsTable.$inferSelect;

export const insertFaqSchema = createInsertSchema(faqsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqsTable.$inferSelect;
