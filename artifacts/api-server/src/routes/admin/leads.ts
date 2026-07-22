import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  enquiriesTable,
  applicationsTable,
  insertEnquirySchema,
  insertApplicationSchema,
} from "@workspace/db";
import { requireAdminAuth, requirePermission } from "../../middlewares/requireAdminAuth";
import { writeAuditLog } from "../../lib/audit";
import { PERMISSIONS } from "../../lib/permissions";

const router: IRouter = Router();

function parseId(param: string | string[]): number {
  return Number(Array.isArray(param) ? param[0] : param);
}

// ---------- Public: lead capture ----------

router.post("/enquiries", async (req, res): Promise<void> => {
  const parsed = insertEnquirySchema
    .omit({ status: true, assignedTo: true, notes: true })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(enquiriesTable).values(parsed.data).returning();
  res.status(201).json({ id: row.id });
});

router.post("/applications", async (req, res): Promise<void> => {
  const parsed = insertApplicationSchema
    .omit({ status: true, assignedTo: true, notes: true })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(applicationsTable).values(parsed.data).returning();
  res.status(201).json({ id: row.id });
});

// ---------- Admin: Enquiries ----------

router.get(
  "/admin/enquiries",
  requireAdminAuth,
  requirePermission(PERMISSIONS.LEADS_VIEW),
  async (_req, res): Promise<void> => {
    const rows = await db.select().from(enquiriesTable);
    res.json(rows.sort((a, b) => b.id - a.id));
  },
);

router.patch(
  "/admin/enquiries/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.LEADS_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const parsed = insertEnquirySchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db.update(enquiriesTable).set(parsed.data).where(eq(enquiriesTable.id, id)).returning();
    if (!row) {
      res.status(404).json({ error: "Enquiry not found" });
      return;
    }
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "ENQUIRY_UPDATED",
      entityType: "enquiry",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} updated enquiry from ${row.fullName} (status: ${row.status}).`,
    });
    res.json(row);
  },
);

router.delete(
  "/admin/enquiries/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.LEADS_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const [row] = await db.delete(enquiriesTable).where(eq(enquiriesTable.id, id)).returning();
    if (!row) {
      res.status(404).json({ error: "Enquiry not found" });
      return;
    }
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "ENQUIRY_DELETED",
      entityType: "enquiry",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} deleted enquiry from ${row.fullName}.`,
    });
    res.status(204).send();
  },
);

// ---------- Admin: Applications ----------

router.get(
  "/admin/applications",
  requireAdminAuth,
  requirePermission(PERMISSIONS.LEADS_VIEW),
  async (_req, res): Promise<void> => {
    const rows = await db.select().from(applicationsTable);
    res.json(rows.sort((a, b) => b.id - a.id));
  },
);

router.patch(
  "/admin/applications/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.LEADS_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const parsed = insertApplicationSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db
      .update(applicationsTable)
      .set(parsed.data)
      .where(eq(applicationsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "APPLICATION_UPDATED",
      entityType: "application",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} updated application from ${row.fullName} (status: ${row.status}).`,
    });
    res.json(row);
  },
);

router.delete(
  "/admin/applications/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.LEADS_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const [row] = await db.delete(applicationsTable).where(eq(applicationsTable.id, id)).returning();
    if (!row) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "APPLICATION_DELETED",
      entityType: "application",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} deleted application from ${row.fullName}.`,
    });
    res.status(204).send();
  },
);

export default router;
