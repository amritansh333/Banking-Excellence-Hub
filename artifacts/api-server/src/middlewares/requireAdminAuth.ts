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
  console.log("========== ADMIN AUTH ==========");
  console.log("Cookie Header:", req.headers.cookie);
  console.log("Parsed Cookies:", req.cookies);

  const sessionId = req.cookies?.[SESSION_COOKIE_NAME];

  console.log("Session ID:", sessionId);

  const user = await getSessionUser(sessionId);

  console.log("Resolved User:", user);

  if (!user) {
    console.log("AUTH FAILED");
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  console.log("AUTH SUCCESS");

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
