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
import { seoFields } from "./seoShared";

export const blogAuthorsTable = pgTable("blog_authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const blogCategoriesTable = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const blogTagsTable = pgTable("blog_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  featuredImageUrl: text("featured_image_url"),
  authorId: integer("author_id").references(() => blogAuthorsTable.id, {
    onDelete: "set null",
  }),
  categoryId: integer("category_id").references(() => blogCategoriesTable.id, {
    onDelete: "set null",
  }),
  content: text("content").notNull().default(""),
  status: text("status").notNull().default("DRAFT"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  modifiedAt: timestamp("modified_at", { withTimezone: true }),
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

export const blogPostTagsTable = pgTable("blog_post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => blogPostsTable.id, { onDelete: "cascade" }),
  tagId: integer("tag_id")
    .notNull()
    .references(() => blogTagsTable.id, { onDelete: "cascade" }),
});

export const blogRelatedPostsTable = pgTable("blog_related_posts", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => blogPostsTable.id, { onDelete: "cascade" }),
  relatedPostId: integer("related_post_id")
    .notNull()
    .references(() => blogPostsTable.id, { onDelete: "cascade" }),
});

export const blogRelatedCoursesTable = pgTable("blog_related_courses", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => blogPostsTable.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPostsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPostsTable.$inferSelect;
export type BlogAuthor = typeof blogAuthorsTable.$inferSelect;
export type BlogCategory = typeof blogCategoriesTable.$inferSelect;
export type BlogTag = typeof blogTagsTable.$inferSelect;
