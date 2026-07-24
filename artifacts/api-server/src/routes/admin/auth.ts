import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import {
  db,
  adminUsersTable,
  rolesTable,
  systemInitializationTable,
} from "@workspace/db";
import {
  hashPassword,
  verifyPassword,
  isPasswordStrong,
  createSession,
  destroySession,
  recordLoginAttempt,
  registerFailedLogin,
  clearFailedLogins,
  isLocked,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "../../lib/auth";
import { requireAdminAuth } from "../../middlewares/requireAdminAuth";
import { writeAuditLog } from "../../lib/audit";
import { getUserPermissions, isSuperAdmin } from "../../lib/rbac";

const router: IRouter = Router();

const bootstrapSchema = z.object({
  fullName: z.string().min(2),
  adminId: z.string().min(3).max(64),
  email: z.string().email(),
  password: z.string().min(10),
});

router.get("/admin/bootstrap-status", async (_req, res): Promise<void> => {
  const [state] = await db.select().from(systemInitializationTable).limit(1);
  res.json({ bootstrapCompleted: state?.bootstrapCompleted ?? false });
});

router.post("/admin/bootstrap", async (req, res): Promise<void> => {
  const [state] = await db.select().from(systemInitializationTable).limit(1);
  if (state?.bootstrapCompleted) {
    res.status(409).json({ error: "System already initialized" });
    return;
  }

  const parsed = bootstrapSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { fullName, adminId, email, password } = parsed.data;

  if (!isPasswordStrong(password)) {
    res.status(400).json({
      error:
        "Password must be at least 10 characters and include uppercase, lowercase, a number, and a symbol.",
    });
    return;
  }

  const [superAdminRole] = await db
    .select()
    .from(rolesTable)
    .where(eq(rolesTable.key, "super_admin"));
  if (!superAdminRole) {
    res
      .status(500)
      .json({
        error:
          "RBAC roles are not seeded yet. Restart the server and try again.",
      });
    return;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(adminUsersTable)
    .values({
      fullName,
      adminId,
      email,
      passwordHash,
      roleId: superAdminRole.id,
      status: "ACTIVE",
    })
    .returning();

  if (state) {
    await db
      .update(systemInitializationTable)
      .set({ bootstrapCompleted: true, bootstrapCompletedAt: new Date() })
      .where(eq(systemInitializationTable.id, state.id));
  } else {
    await db
      .insert(systemInitializationTable)
      .values({ bootstrapCompleted: true, bootstrapCompletedAt: new Date() });
  }

  const session = await createSession(
    user.id,
    req.ip,
    req.get("user-agent") ?? undefined,
  );
  res.cookie(SESSION_COOKIE_NAME, session.id, {
    ...SESSION_COOKIE_OPTIONS,
    expires: session.expiresAt,
  });

  await writeAuditLog(req, {
    actorId: user.id,
    actorLabel: user.fullName,
    action: "SYSTEM_BOOTSTRAP",
    entityType: "admin_user",
    entityId: String(user.id),
    summary: `System initialized and first super admin account "${user.adminId}" created.`,
  });

  res
    .status(201)
    .json({
      id: user.id,
      fullName: user.fullName,
      adminId: user.adminId,
      email: user.email,
    });
});

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Admin ID/email and password are required." });
    return;
  }
  const { identifier, password } = parsed.data;
  const ipAddress = req.ip;
  const userAgent = req.get("user-agent") ?? undefined;

  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, identifier.toLowerCase()));
  const candidate =
    user ??
    (
      await db
        .select()
        .from(adminUsersTable)
        .where(eq(adminUsersTable.adminId, identifier))
    )[0];

  if (!candidate) {
    await recordLoginAttempt(identifier, false, ipAddress, userAgent);
    res.status(401).json({ error: "Invalid credentials." });
    return;
  }

  if (isLocked(candidate)) {
    await recordLoginAttempt(identifier, false, ipAddress, userAgent);
    res
      .status(423)
      .json({
        error:
          "Account temporarily locked due to repeated failed logins. Try again later.",
      });
    return;
  }

  if (candidate.status !== "ACTIVE") {
    await recordLoginAttempt(identifier, false, ipAddress, userAgent);
    res
      .status(403)
      .json({ error: "This account is not active. Contact a super admin." });
    return;
  }

  const validPassword = await verifyPassword(password, candidate.passwordHash);
  if (!validPassword) {
    await registerFailedLogin(candidate.id);
    await recordLoginAttempt(identifier, false, ipAddress, userAgent);
    res.status(401).json({ error: "Invalid credentials." });
    return;
  }

  await clearFailedLogins(candidate.id);
  await recordLoginAttempt(identifier, true, ipAddress, userAgent);

  const session = await createSession(candidate.id, ipAddress, userAgent);
  res.cookie(SESSION_COOKIE_NAME, session.id, {
    ...SESSION_COOKIE_OPTIONS,
    expires: session.expiresAt,
  });

  await writeAuditLog(req, {
    actorId: candidate.id,
    actorLabel: candidate.fullName,
    action: "LOGIN",
    entityType: "admin_user",
    entityId: String(candidate.id),
    summary: `${candidate.fullName} logged in.`,
  });

  res.json({
    id: candidate.id,
    fullName: candidate.fullName,
    adminId: candidate.adminId,
    email: candidate.email,
  });
});

router.post(
  "/admin/logout",
  requireAdminAuth,
  async (req, res): Promise<void> => {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
    if (sessionId) await destroySession(sessionId);
    res.clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);
    res.status(204).send();
  },
);

router.get("/admin/me", requireAdminAuth, async (req, res): Promise<void> => {
  const user = req.adminUser!;
  const [role] = await db
    .select()
    .from(rolesTable)
    .where(eq(rolesTable.id, user.roleId));
  const permissions = await getUserPermissions(user);
  const superAdmin = await isSuperAdmin(user);
  res.json({
    id: user.id,
    fullName: user.fullName,
    adminId: user.adminId,
    email: user.email,
    role: role ? { id: role.id, key: role.key, name: role.name } : null,
    isSuperAdmin: superAdmin,
    permissions: Array.from(permissions),
  });
});

export default router;
