import { db, auditLogsTable } from "@workspace/db";
import type { Request } from "express";

export async function writeAuditLog(
  req: Request,
  params: {
    actorId: number | null;
    actorLabel: string;
    action: string;
    entityType?: string;
    entityId?: string;
    summary: string;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  await db.insert(auditLogsTable).values({
    actorId: params.actorId,
    actorLabel: params.actorLabel,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    summary: params.summary,
    metadata: params.metadata,
    ipAddress: req.ip,
    userAgent: req.get("user-agent") ?? undefined,
  });
}
