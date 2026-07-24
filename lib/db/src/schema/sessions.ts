import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const adminSessionsTable = pgTable("admin_sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AdminSession = typeof adminSessionsTable.$inferSelect;

export const loginAttemptsTable = pgTable("login_attempts", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  success: text("success").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type LoginAttempt = typeof loginAttemptsTable.$inferSelect;
