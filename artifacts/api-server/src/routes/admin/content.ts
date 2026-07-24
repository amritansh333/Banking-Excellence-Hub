import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  testimonialsTable,
  faqsTable,
  insertTestimonialSchema,
  insertFaqSchema,
} from "@workspace/db";
import {
  requireAdminAuth,
  requirePermission,
} from "../../middlewares/requireAdminAuth";
import { writeAuditLog } from "../../lib/audit";
import { PERMISSIONS } from "../../lib/permissions";

const router: IRouter = Router();

function parseId(param: string | string[]): number {
  return Number(Array.isArray(param) ? param[0] : param);
}

// ---------- Public ----------

router.get("/testimonials", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(testimonialsTable)
    .where(eq(testimonialsTable.status, "PUBLISHED"));
  res.json(rows.sort((a, b) => a.displayOrder - b.displayOrder));
});

router.get("/faqs", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(faqsTable)
    .where(eq(faqsTable.status, "PUBLISHED"));
  res.json(rows.sort((a, b) => a.displayOrder - b.displayOrder));
});

// ---------- Admin: Testimonials ----------

router.get(
  "/admin/testimonials",
  requireAdminAuth,
  requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE),
  async (_req, res): Promise<void> => {
    const rows = await db.select().from(testimonialsTable);
    res.json(rows.sort((a, b) => a.displayOrder - b.displayOrder));
  },
);

router.post(
  "/admin/testimonials",
  requireAdminAuth,
  requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE),
  async (req, res): Promise<void> => {
    const parsed = insertTestimonialSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db
      .insert(testimonialsTable)
      .values(parsed.data)
      .returning();
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "TESTIMONIAL_CREATED",
      entityType: "testimonial",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} added a testimonial from ${row.studentName}.`,
    });
    res.status(201).json(row);
  },
);

router.patch(
  "/admin/testimonials/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const parsed = insertTestimonialSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db
      .update(testimonialsTable)
      .set(parsed.data)
      .where(eq(testimonialsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "TESTIMONIAL_UPDATED",
      entityType: "testimonial",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} updated a testimonial from ${row.studentName}.`,
    });
    res.json(row);
  },
);

router.delete(
  "/admin/testimonials/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const [row] = await db
      .delete(testimonialsTable)
      .where(eq(testimonialsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "TESTIMONIAL_DELETED",
      entityType: "testimonial",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} deleted a testimonial from ${row.studentName}.`,
    });
    res.status(204).send();
  },
);

// ---------- Admin: FAQs ----------

router.get(
  "/admin/faqs",
  requireAdminAuth,
  requirePermission(PERMISSIONS.FAQS_MANAGE),
  async (_req, res): Promise<void> => {
    const rows = await db.select().from(faqsTable);
    res.json(rows.sort((a, b) => a.displayOrder - b.displayOrder));
  },
);

router.post(
  "/admin/faqs",
  requireAdminAuth,
  requirePermission(PERMISSIONS.FAQS_MANAGE),
  async (req, res): Promise<void> => {
    const parsed = insertFaqSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db.insert(faqsTable).values(parsed.data).returning();
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "FAQ_CREATED",
      entityType: "faq",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} added FAQ "${row.question}".`,
    });
    res.status(201).json(row);
  },
);

router.patch(
  "/admin/faqs/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.FAQS_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const parsed = insertFaqSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db
      .update(faqsTable)
      .set(parsed.data)
      .where(eq(faqsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "FAQ_UPDATED",
      entityType: "faq",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} updated FAQ "${row.question}".`,
    });
    res.json(row);
  },
);

router.delete(
  "/admin/faqs/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.FAQS_MANAGE),
  async (req, res): Promise<void> => {
    const id = parseId(req.params.id);
    const [row] = await db
      .delete(faqsTable)
      .where(eq(faqsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }
    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "FAQ_DELETED",
      entityType: "faq",
      entityId: String(row.id),
      summary: `${req.adminUser!.fullName} deleted FAQ "${row.question}".`,
    });
    res.status(204).send();
  },
);

export default router;
