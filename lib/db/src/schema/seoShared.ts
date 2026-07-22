import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const seoFields = {
  seoTitle: text("seo_title"),
  metaDescription: text("meta_description"),
  canonicalUrl: text("canonical_url"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  noIndex: boolean("no_index").notNull().default(false),
  noFollow: boolean("no_follow").notNull().default(false),
  schemaType: text("schema_type"),
  breadcrumbLabel: text("breadcrumb_label"),
};

export const redirectsTable = pgTable("redirects", {
  id: serial("id").primaryKey(),
  sourcePath: text("source_path").notNull().unique(),
  destinationPath: text("destination_path").notNull(),
  redirectType: text("redirect_type").notNull().default("301"),
  active: boolean("active").notNull().default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRedirectSchema = createInsertSchema(redirectsTable).omit({ id: true, createdAt: true });
export type InsertRedirect = z.infer<typeof insertRedirectSchema>;
export type Redirect = typeof redirectsTable.$inferSelect;

export const globalSeoTable = pgTable("global_seo", {
  id: serial("id").primaryKey(),
  siteTitle: text("site_title").notNull().default("The Bankers Academy LLP"),
  titleTemplate: text("title_template").notNull().default("%s — The Bankers Academy"),
  defaultMetaDescription: text("default_meta_description"),
  defaultOgImage: text("default_og_image"),
  canonicalDomain: text("canonical_domain"),
  defaultRobots: text("default_robots").notNull().default("index, follow"),
  searchConsoleVerification: text("search_console_verification"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type GlobalSeo = typeof globalSeoTable.$inferSelect;
