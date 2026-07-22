import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { db, adminUsersTable, rolesTable } from "@workspace/db";
import { requireAdminAuth, requirePermission } from "../../middlewares/requireAdminAuth";
import { hashPassword, isPasswordStrong } from "../../lib/auth";
import { writeAuditLog } from "../../lib/audit";
import { PERMISSIONS } from "../../lib/permissions";

const router: IRouter = Router();

router.use("/admin/users", requireAdminAuth);
router.use("/admin/roles", requireAdminAuth);
router.use("/admin/personas", requireAdminAuth);
router.use("/admin/audit-log", requireAdminAuth);

router.get("/admin/users", requirePermission(PERMISSIONS.USERS_VIEW), async (_req, res): Promise<void> => {
  const users = await db
    .select({
      id: adminUsersTable.id,
      fullName: adminUsersTable.fullName,
      adminId: adminUsersTable.adminId,
      email: adminUsersTable.email,
      status: adminUsersTable.status,
      lastLoginAt: adminUsersTable.lastLoginAt,
      createdAt: adminUsersTable.createdAt,
      roleId: adminUsersTable.roleId,
      roleName: rolesTable.name,
    })
    .from(adminUsersTable)
    .leftJoin(rolesTable, eq(adminUsersTable.roleId, rolesTable.id))
    .orderBy(adminUsersTable.createdAt);
  res.json(users);
});

const createUserSchema = z.object({
  fullName: z.string().min(2),
  adminId: z.string().min(3).max(64),
  email: z.string().email(),
  password: z.string().min(10),
  roleId: z.coerce.number().int(),
});

router.post("/admin/users", requirePermission(PERMISSIONS.USERS_MANAGE), async (req, res): Promise<void> => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (!isPasswordStrong(parsed.data.password)) {
    res.status(400).json({ error: "Password does not meet strength requirements." });
    return;
  }
  const passwordHash = await hashPassword(parsed.data.password);
  const [user] = await db
    .insert(adminUsersTable)
    .values({
      fullName: parsed.data.fullName,
      adminId: parsed.data.adminId,
      email: parsed.data.email,
      passwordHash,
      roleId: parsed.data.roleId,
      status: "ACTIVE",
      createdBy: req.adminUser!.id,
    })
    .returning();

  await writeAuditLog(req, {
    actorId: req.adminUser!.id,
    actorLabel: req.adminUser!.fullName,
    action: "USER_CREATED",
    entityType: "admin_user",
    entityId: String(user.id),
    summary: `${req.adminUser!.fullName} created admin user "${user.fullName}".`,
  });

  res.status(201).json({ id: user.id, fullName: user.fullName, adminId: user.adminId, email: user.email });
});

const updateUserSchema = z.object({
  fullName: z.string().min(2).optional(),
  roleId: z.coerce.number().int().optional(),
  status: z.enum(["PENDING", "ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  password: z.string().min(10).optional(),
});

router.patch("/admin/users/:id", requirePermission(PERMISSIONS.USERS_MANAGE), async (req, res): Promise<void> => {
  const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { updatedBy: req.adminUser!.id };
  if (parsed.data.fullName) updates.fullName = parsed.data.fullName;
  if (parsed.data.roleId) updates.roleId = parsed.data.roleId;
  if (parsed.data.status) updates.status = parsed.data.status;
  if (parsed.data.password) {
    if (!isPasswordStrong(parsed.data.password)) {
      res.status(400).json({ error: "Password does not meet strength requirements." });
      return;
    }
    updates.passwordHash = await hashPassword(parsed.data.password);
  }

  const [user] = await db.update(adminUsersTable).set(updates).where(eq(adminUsersTable.id, id)).returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  await writeAuditLog(req, {
    actorId: req.adminUser!.id,
    actorLabel: req.adminUser!.fullName,
    action: "USER_UPDATED",
    entityType: "admin_user",
    entityId: String(user.id),
    summary: `${req.adminUser!.fullName} updated admin user "${user.fullName}".`,
    metadata: { fields: Object.keys(updates) },
  });

  res.json({ id: user.id, fullName: user.fullName, status: user.status });
});

router.delete("/admin/users/:id", requirePermission(PERMISSIONS.USERS_MANAGE), async (req, res): Promise<void> => {
  const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  if (id === req.adminUser!.id) {
    res.status(400).json({ error: "You cannot remove your own account." });
    return;
  }
  const [user] = await db
    .update(adminUsersTable)
    .set({ status: "REMOVED", removedAt: new Date(), removedBy: req.adminUser!.id })
    .where(eq(adminUsersTable.id, id))
    .returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  await writeAuditLog(req, {
    actorId: req.adminUser!.id,
    actorLabel: req.adminUser!.fullName,
    action: "USER_REMOVED",
    entityType: "admin_user",
    entityId: String(user.id),
    summary: `${req.adminUser!.fullName} removed admin user "${user.fullName}".`,
  });

  res.status(204).send();
});

router.get("/admin/roles", requirePermission(PERMISSIONS.USERS_VIEW), async (_req, res): Promise<void> => {
  const roles = await db.select().from(rolesTable);
  res.json(roles);
});

export default router;
