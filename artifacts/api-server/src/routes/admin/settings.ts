import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { db, globalSettingsTable, navigationItemsTable } from "@workspace/db";
import { requireAdminAuth, requirePermission } from "../../middlewares/requireAdminAuth";
import { writeAuditLog } from "../../lib/audit";
import { PERMISSIONS } from "../../lib/permissions";

const router: IRouter = Router();

async function getOrCreateSettings() {
  const [existing] = await db.select().from(globalSettingsTable).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(globalSettingsTable).values({}).returning();
  return created;
}

router.get("/settings", async (_req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(settings);
});

router.get("/navigation", async (_req, res): Promise<void> => {
  const items = await db.select().from(navigationItemsTable).where(eq(navigationItemsTable.visible, "true"));
  res.json(items.sort((a, b) => a.displayOrder - b.displayOrder));
});

router.get("/admin/settings", requireAdminAuth, async (_req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(settings);
});

const settingsSchema = z.object({
  orgName: z.string().min(1).optional(),
  shortName: z.string().min(1).optional(),
  tagline: z.string().optional().nullable(),
  primaryLogoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  primaryPhone: z.string().optional().nullable(),
  secondaryPhone: z.string().optional().nullable(),
  primaryEmail: z.string().optional().nullable(),
  admissionsEmail: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  mapEmbedUrl: z.string().optional().nullable(),
  workingHours: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  twitterUrl: z.string().optional().nullable(),
});

router.patch(
  "/admin/settings",
  requireAdminAuth,
  requirePermission(PERMISSIONS.SETTINGS_MANAGE),
  async (req, res): Promise<void> => {
    const parsed = settingsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const current = await getOrCreateSettings();
    const [updated] = await db
      .update(globalSettingsTable)
      .set({ ...parsed.data, updatedBy: req.adminUser!.fullName })
      .where(eq(globalSettingsTable.id, current.id))
      .returning();

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "SETTINGS_UPDATED",
      entityType: "global_settings",
      entityId: String(updated.id),
      summary: `${req.adminUser!.fullName} updated global site settings.`,
    });

    res.json(updated);
  },
);

router.get(
  "/admin/navigation",
  requireAdminAuth,
  requirePermission(PERMISSIONS.NAVIGATION_MANAGE),
  async (_req, res): Promise<void> => {
    const items = await db.select().from(navigationItemsTable);
    res.json(items.sort((a, b) => a.displayOrder - b.displayOrder));
  },
);

const navItemSchema = z.object({
  menu: z.enum(["header", "footer_col_1", "footer_col_2", "footer_legal"]),
  label: z.string().min(1),
  url: z.string().optional().nullable(),
  isExternal: z.boolean().optional(),
  displayOrder: z.coerce.number().int().optional(),
  visible: z.boolean().optional(),
  isCta: z.boolean().optional(),
});

router.post(
  "/admin/navigation",
  requireAdminAuth,
  requirePermission(PERMISSIONS.NAVIGATION_MANAGE),
  async (req, res): Promise<void> => {
    const parsed = navItemSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [item] = await db
      .insert(navigationItemsTable)
      .values({
        menu: parsed.data.menu,
        label: parsed.data.label,
        url: parsed.data.url,
        isExternal: parsed.data.isExternal ? "true" : "false",
        displayOrder: parsed.data.displayOrder ?? 0,
        visible: parsed.data.visible === false ? "false" : "true",
        isCta: parsed.data.isCta ? "true" : "false",
      })
      .returning();

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "NAVIGATION_ITEM_CREATED",
      entityType: "navigation_item",
      entityId: String(item.id),
      summary: `${req.adminUser!.fullName} added navigation item "${item.label}" to ${item.menu}.`,
    });

    res.status(201).json(item);
  },
);

router.patch(
  "/admin/navigation/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.NAVIGATION_MANAGE),
  async (req, res): Promise<void> => {
    const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    const parsed = navItemSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const updates: Record<string, unknown> = {};
    if (parsed.data.menu) updates.menu = parsed.data.menu;
    if (parsed.data.label) updates.label = parsed.data.label;
    if (parsed.data.url !== undefined) updates.url = parsed.data.url;
    if (parsed.data.isExternal !== undefined) updates.isExternal = parsed.data.isExternal ? "true" : "false";
    if (parsed.data.displayOrder !== undefined) updates.displayOrder = parsed.data.displayOrder;
    if (parsed.data.visible !== undefined) updates.visible = parsed.data.visible ? "true" : "false";
    if (parsed.data.isCta !== undefined) updates.isCta = parsed.data.isCta ? "true" : "false";

    const [item] = await db.update(navigationItemsTable).set(updates).where(eq(navigationItemsTable.id, id)).returning();
    if (!item) {
      res.status(404).json({ error: "Navigation item not found" });
      return;
    }

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "NAVIGATION_ITEM_UPDATED",
      entityType: "navigation_item",
      entityId: String(item.id),
      summary: `${req.adminUser!.fullName} updated navigation item "${item.label}".`,
    });

    res.json(item);
  },
);

router.delete(
  "/admin/navigation/:id",
  requireAdminAuth,
  requirePermission(PERMISSIONS.NAVIGATION_MANAGE),
  async (req, res): Promise<void> => {
    const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    const [item] = await db.delete(navigationItemsTable).where(eq(navigationItemsTable.id, id)).returning();
    if (!item) {
      res.status(404).json({ error: "Navigation item not found" });
      return;
    }

    await writeAuditLog(req, {
      actorId: req.adminUser!.id,
      actorLabel: req.adminUser!.fullName,
      action: "NAVIGATION_ITEM_DELETED",
      entityType: "navigation_item",
      entityId: String(item.id),
      summary: `${req.adminUser!.fullName} removed navigation item "${item.label}".`,
    });

    res.status(204).send();
  },
);

export default router;
