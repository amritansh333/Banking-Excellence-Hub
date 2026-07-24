import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, auditLogsTable, personasTable } from "@workspace/db";
import {
  requireAdminAuth,
  requirePermission,
} from "../../middlewares/requireAdminAuth";
import { PERMISSIONS, PERMISSION_CATALOGUE } from "../../lib/permissions";

const router: IRouter = Router();

router.get(
  "/admin/permissions",
  requireAdminAuth,
  async (_req, res): Promise<void> => {
    res.json(PERMISSION_CATALOGUE);
  },
);

router.get(
  "/admin/personas",
  requirePermission(PERMISSIONS.USERS_VIEW),
  async (_req, res): Promise<void> => {
    const personas = await db.select().from(personasTable);
    res.json(personas);
  },
);

router.get(
  "/admin/audit-log",
  requirePermission(PERMISSIONS.AUDIT_LOG_VIEW),
  async (req, res): Promise<void> => {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const logs = await db
      .select()
      .from(auditLogsTable)
      .orderBy(desc(auditLogsTable.createdAt))
      .limit(limit);
    res.json(logs);
  },
);

export default router;
