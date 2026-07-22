import { eq } from "drizzle-orm";
import {
  db,
  rolesTable,
  rolePermissionsTable,
  permissionsTable,
  userPermissionOverridesTable,
  type AdminUser,
} from "@workspace/db";
import type { PermissionKey } from "./permissions";

export async function getUserPermissions(user: AdminUser): Promise<Set<PermissionKey>> {
  const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, user.roleId));
  if (!role) return new Set();

  if (role.isSuperAdmin === "true") {
    const all = await db.select().from(permissionsTable);
    return new Set(all.map((p) => p.key as PermissionKey));
  }

  const rolePerms = await db
    .select({ key: permissionsTable.key })
    .from(rolePermissionsTable)
    .innerJoin(permissionsTable, eq(rolePermissionsTable.permissionId, permissionsTable.id))
    .where(eq(rolePermissionsTable.roleId, role.id));

  const permissionSet = new Set(rolePerms.map((p) => p.key as PermissionKey));

  const overrides = await db
    .select({ key: permissionsTable.key, effect: userPermissionOverridesTable.effect })
    .from(userPermissionOverridesTable)
    .innerJoin(permissionsTable, eq(userPermissionOverridesTable.permissionId, permissionsTable.id))
    .where(eq(userPermissionOverridesTable.userId, user.id));

  for (const o of overrides) {
    if (o.effect === "GRANT") permissionSet.add(o.key as PermissionKey);
    else permissionSet.delete(o.key as PermissionKey);
  }

  return permissionSet;
}

export async function isSuperAdmin(user: AdminUser): Promise<boolean> {
  const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, user.roleId));
  return role?.isSuperAdmin === "true";
}
