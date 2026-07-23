import type { Request, Response, NextFunction } from "express";
import type { AdminUser } from "@workspace/db";
import { getSessionUser, SESSION_COOKIE_NAME } from "../lib/auth";
import { getUserPermissions } from "../lib/rbac";
import type { PermissionKey } from "../lib/permissions";

declare global {
  namespace Express {
    interface Request {
      adminUser?: AdminUser;
      adminPermissions?: Set<PermissionKey>;
    }
  }
}

export async function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
  const user = await getSessionUser(sessionId);

  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  req.adminUser = user;
  req.adminPermissions = await getUserPermissions(user);

  next();
}

export function requirePermission(permission: PermissionKey) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.adminPermissions?.has(permission)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
}
