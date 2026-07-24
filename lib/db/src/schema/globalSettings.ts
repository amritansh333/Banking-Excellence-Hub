import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const globalSettingsTable = pgTable("global_settings", {
  id: serial("id").primaryKey(),
  orgName: text("org_name").notNull().default("The Bankers Academy LLP"),
  shortName: text("short_name").notNull().default("The Bankers Academy"),
  tagline: text("tagline"),
  primaryLogoUrl: text("primary_logo_url"),
  secondaryLogoUrl: text("secondary_logo_url"),
  faviconUrl: text("favicon_url"),
  primaryPhone: text("primary_phone"),
  secondaryPhone: text("secondary_phone"),
  primaryEmail: text("primary_email"),
  admissionsEmail: text("admissions_email"),
  whatsappNumber: text("whatsapp_number"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  mapEmbedUrl: text("map_embed_url"),
  workingHours: text("working_hours"),
  linkedinUrl: text("linkedin_url"),
  instagramUrl: text("instagram_url"),
  facebookUrl: text("facebook_url"),
  youtubeUrl: text("youtube_url"),
  twitterUrl: text("twitter_url"),
  updatedBy: text("updated_by"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type GlobalSettings = typeof globalSettingsTable.$inferSelect;

export const navigationItemsTable = pgTable("navigation_items", {
  id: serial("id").primaryKey(),
  menu: text("menu").notNull().default("header"), // header | footer_col_1 | footer_col_2 | footer_legal
  label: text("label").notNull(),
  url: text("url"),
  isExternal: text("is_external").notNull().default("false"),
  parentId: integer("parent_id"),
  displayOrder: integer("display_order").notNull().default(0),
  visible: text("visible").notNull().default("true"),
  isCta: text("is_cta").notNull().default("false"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type NavigationItem = typeof navigationItemsTable.$inferSelect;
