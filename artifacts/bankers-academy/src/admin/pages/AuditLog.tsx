import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApi } from "../lib/adminApi";

type AuditLogRow = {
  id: number;
  actorLabel: string | null;
  action: string;
  summary: string;
  createdAt: string;
};

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get<AuditLogRow[]>("/admin/audit-log").then((res) => {
      setLogs(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-[#0B1F4D]">Audit Log</h1>
        <p className="text-muted-foreground">A record of significant actions taken in the admin panel.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="divide-y">
              {logs.map((log) => (
                <div key={log.id} className="py-3">
                  <p className="text-sm">{log.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.actorLabel ?? "System"} · {log.action} · {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
              {logs.length === 0 && <p className="text-sm text-muted-foreground">No activity recorded yet.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
