import crypto from "crypto";
import bcrypt from "bcryptjs";
import { eq, and, gt } from "drizzle-orm";
import { db, adminSessionsTable, adminUsersTable, loginAttemptsTable } from "@workspace/db";

const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
export const SESSION_COOKIE_NAME = "ba_admin_session";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 1000 * 60 * 15; // 15 minutes

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function isPasswordStrong(password: string): boolean {
  return (
    password.length >= 10 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^a-zA-Z0-9]/.test(password)
  );
}

export async function createSession(
  userId: number,
  ipAddress: string | undefined,
  userAgent: string | undefined,
): Promise<{ id: string; expiresAt: Date }> {
  const id = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(adminSessionsTable).values({ id, userId, ipAddress, userAgent, expiresAt });
  return { id, expiresAt };
}

export async function destroySession(sessionId: string): Promise<void> {
  await db.delete(adminSessionsTable).where(eq(adminSessionsTable.id, sessionId));
}

export async function getSessionUser(sessionId: string | undefined) {
  console.log("getSessionUser()");
  console.log("Incoming session:", sessionId);

  if (!sessionId) {
    console.log("No session id");
    return null;
  }

  const allSessions = await db.select().from(adminSessionsTable);

  console.log("Total sessions:", allSessions.length);

  const [session] = await db
    .select()
    .from(adminSessionsTable)
    .where(
      and(
        eq(adminSessionsTable.id, sessionId),
        gt(adminSessionsTable.expiresAt, new Date())
      )
    );

  console.log("Matched session:", session);

  if (!session) {
    console.log("Session not found");
    return null;
  }

  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.id, session.userId));

  console.log("Matched user:", user);

  if (!user || user.status !== "ACTIVE") {
    console.log("User invalid");
    return null;
  }

  return user;
}

export async function recordLoginAttempt(
  identifier: string,
  success: boolean,
  ipAddress: string | undefined,
  userAgent: string | undefined,
): Promise<void> {
  await db.insert(loginAttemptsTable).values({
    id: crypto.randomBytes(16).toString("hex"),
    identifier,
    success: success ? "true" : "false",
    ipAddress,
    userAgent,
  });
}

export async function registerFailedLogin(userId: number): Promise<void> {
  const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, userId));
  if (!user) return;
  const failedCount = user.failedLoginCount + 1;
  const updates: Partial<typeof adminUsersTable.$inferInsert> = { failedLoginCount: failedCount };
  if (failedCount >= MAX_FAILED_ATTEMPTS) {
    updates.lockedUntil = new Date(Date.now() + LOCKOUT_MS);
  }
  await db.update(adminUsersTable).set(updates).where(eq(adminUsersTable.id, userId));
}

export async function clearFailedLogins(userId: number): Promise<void> {
  await db
    .update(adminUsersTable)
    .set({ failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() })
    .where(eq(adminUsersTable.id, userId));
}

export function isLocked(user: { lockedUntil: Date | null }): boolean {
  return !!user.lockedUntil && user.lockedUntil.getTime() > Date.now();
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
};
