import { eq } from "drizzle-orm";
import {
  db,
  personasTable,
  rolesTable,
  permissionsTable,
  rolePermissionsTable,
  globalSettingsTable,
  navigationItemsTable,
} from "@workspace/db";
import { PERMISSION_CATALOGUE, DEFAULT_PERSONAS, DEFAULT_ROLES } from "./permissions";
import { logger } from "./logger";

export async function seedRbacDefaults(): Promise<void> {
  for (const p of PERMISSION_CATALOGUE) {
    const existing = await db.select().from(permissionsTable).where(eq(permissionsTable.key, p.key));
    if (existing.length === 0) {
      await db.insert(permissionsTable).values({ key: p.key, category: p.category, label: p.label });
    }
  }

  const personaIdByKey = new Map<string, number>();
  for (const persona of DEFAULT_PERSONAS) {
    const existing = await db.select().from(personasTable).where(eq(personasTable.key, persona.key));
    if (existing.length > 0) {
      personaIdByKey.set(persona.key, existing[0].id);
      continue;
    }
    const [created] = await db
      .insert(personasTable)
      .values({ key: persona.key, name: persona.name, description: persona.description })
      .returning();
    personaIdByKey.set(persona.key, created.id);
  }

  const allPermissions = await db.select().from(permissionsTable);
  const permissionIdByKey = new Map(allPermissions.map((p) => [p.key, p.id]));

  for (const role of DEFAULT_ROLES) {
    let roleRow = (await db.select().from(rolesTable).where(eq(rolesTable.key, role.key)))[0];
    if (!roleRow) {
      const [created] = await db
        .insert(rolesTable)
        .values({
          key: role.key,
          name: role.name,
          description: role.description,
          personaId: personaIdByKey.get(role.personaKey) ?? null,
          isSuperAdmin: role.isSuperAdmin ? "true" : "false",
        })
        .returning();
      roleRow = created;
    }

    const existingRolePerms = await db
      .select()
      .from(rolePermissionsTable)
      .where(eq(rolePermissionsTable.roleId, roleRow.id));
    const existingPermIds = new Set(existingRolePerms.map((rp) => rp.permissionId));

    for (const permKey of role.permissions) {
      const permId = permissionIdByKey.get(permKey);
      if (!permId || existingPermIds.has(permId)) continue;
      await db.insert(rolePermissionsTable).values({ roleId: roleRow.id, permissionId: permId });
    }
  }

  logger.info("RBAC defaults (personas, roles, permissions) seeded");
}

export async function seedSiteDefaults(): Promise<void> {
  const existingSettings = await db.select().from(globalSettingsTable).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(globalSettingsTable).values({
      orgName: "The Bankers Academy LLP",
      shortName: "The Bankers Academy",
      tagline: "Institute of Private Banking Excellence",
      primaryPhone: "+91-6306286395",
      primaryEmail: "admissions@thebankersacademy.org",
      admissionsEmail: "admissions@thebankersacademy.org",
      whatsappNumber: "+91-6306286395",
      address: "First Floor Dev Residency, Plot No.803, P Block, Kakadeo, Kanpur",
      city: "Kanpur",
      state: "Uttar Pradesh",
      postalCode: "208025",
      country: "India",
      workingHours: "Mon–Sat, 9 AM – 6 PM",
      linkedinUrl: "#",
      instagramUrl: "#",
      facebookUrl: "#",
      youtubeUrl: "#",
      twitterUrl: "#",
      updatedBy: "system-seed",
    });
    logger.info("Global settings seeded with default site content");
  }

  const existingNav = await db.select().from(navigationItemsTable).limit(1);
  if (existingNav.length === 0) {
    const headerLinks = [
      { label: "Home", url: "/" },
      { label: "About Us", url: "/about" },
      { label: "What We Do", url: "/program" },
      { label: "Courses", url: "/courses" },
      { label: "Contact Us", url: "/contact" },
      { label: "Enquiry", url: "/enquiry", isCta: true },
    ];
    const footerCol1 = [
      { label: "About Us", url: "/about" },
      { label: "Placements", url: "/placements" },
      { label: "Career Guidance", url: "/career-guidance" },
      { label: "News & Articles", url: "/blog" },
      { label: "Contact Us", url: "/contact" },
    ];
    const footerCol2 = [
      { label: "Private Banking & Finance Excellence", url: "/program" },
      { label: "Admission Process", url: "/admission" },
      { label: "Curriculum", url: "/program#curriculum" },
      { label: "FAQs", url: "/program#faq" },
    ];
    const footerLegal = [
      { label: "Privacy Policy", url: "/privacy-policy" },
      { label: "Terms & Conditions", url: "/terms" },
    ];

    const rows = [
      ...headerLinks.map((l, i) => ({ ...l, menu: "header", displayOrder: i })),
      ...footerCol1.map((l, i) => ({ ...l, menu: "footer_col_1", displayOrder: i })),
      ...footerCol2.map((l, i) => ({ ...l, menu: "footer_col_2", displayOrder: i })),
      ...footerLegal.map((l, i) => ({ ...l, menu: "footer_legal", displayOrder: i })),
    ];

    for (const row of rows) {
      await db.insert(navigationItemsTable).values({
        menu: row.menu,
        label: row.label,
        url: row.url,
        displayOrder: row.displayOrder,
        isCta: "isCta" in row && row.isCta ? "true" : "false",
      });
    }
    logger.info("Navigation defaults seeded (header + footer links)");
  }
}
