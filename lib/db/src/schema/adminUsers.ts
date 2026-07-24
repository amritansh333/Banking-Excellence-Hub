import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { rolesTable } from "./roles";
import { personasTable } from "./personas";

export const adminUsersTable = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  adminId: text("admin_id").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  roleId: integer("role_id")
    .notNull()
    .references(() => rolesTable.id, { onDelete: "restrict" }),
  personaId: integer("persona_id").references(() => personasTable.id, {
    onDelete: "set null",
  }),
  status: text("status").notNull().default("PENDING"), // PENDING, ACTIVE, INACTIVE, SUSPENDED, LOCKED, REMOVED
  failedLoginCount: integer("failed_login_count").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  removedAt: timestamp("removed_at", { withTimezone: true }),
  removedBy: integer("removed_by"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertAdminUserSchema = createInsertSchema(adminUsersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsersTable.$inferSelect;
