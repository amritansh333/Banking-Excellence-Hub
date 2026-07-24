import { pgTable, serial, boolean, timestamp } from "drizzle-orm/pg-core";

export const systemInitializationTable = pgTable("system_initialization", {
  id: serial("id").primaryKey(),
  bootstrapCompleted: boolean("bootstrap_completed").notNull().default(false),
  bootstrapCompletedAt: timestamp("bootstrap_completed_at", {
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type SystemInitialization =
  typeof systemInitializationTable.$inferSelect;
