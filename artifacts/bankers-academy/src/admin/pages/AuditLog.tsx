import { useEffect, useState } from "react";
import {
  Activity,
  Clock3,
  LogIn,
  FileEdit,
  Settings,
  UserPlus,
  Shield,
  FilePlus,
} from "lucide-react";
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

  const getActionBadge = (action: string) => {
    const value = action.toUpperCase();

    if (value.includes("LOGIN"))
      return "bg-green-100 text-green-700 border-green-200";

    if (value.includes("SETTINGS"))
      return "bg-blue-100 text-blue-700 border-blue-200";

    if (value.includes("BLOG"))
      return "bg-purple-100 text-purple-700 border-purple-200";

    if (value.includes("USER"))
      return "bg-orange-100 text-orange-700 border-orange-200";

    if (value.includes("PERMISSION"))
      return "bg-amber-100 text-amber-700 border-amber-200";

    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getActionIcon = (action: string) => {
    const value = action.toUpperCase();

    if (value.includes("LOGIN")) return <LogIn className="h-5 w-5" />;

    if (value.includes("SETTINGS")) return <Settings className="h-5 w-5" />;

    if (value.includes("BLOG_UPDATED")) return <FileEdit className="h-5 w-5" />;

    if (value.includes("BLOG_CREATED")) return <FilePlus className="h-5 w-5" />;

    if (value.includes("USER")) return <UserPlus className="h-5 w-5" />;

    return <Activity className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-2xl border bg-gradient-to-r from-[#0B1F4D] via-[#15367E] to-[#2355C4] p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold">Audit Log</h1>

            <p className="mt-2 max-w-2xl text-sm text-blue-100 leading-relaxed">
              Review all significant actions performed inside the admin panel,
              including authentication events, content updates, permission
              changes and other administrative activities.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur w-fit">
            <p className="text-xs uppercase tracking-wider text-blue-100">
              Activity Monitoring
            </p>

            <p className="mt-1 text-lg font-semibold">Audit Dashboard</p>
          </div>
        </div>
      </div>

      <Card className="border shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-[#0B1F4D] border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">
                Loading audit logs...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Shield className="mb-4 h-14 w-14 text-slate-400" />

                  <p className="text-lg font-medium text-slate-700">
                    No activity recorded
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Audit events will appear here.
                  </p>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="group rounded-xl border bg-white p-5 transition-all hover:border-[#C89B3C] hover:shadow-lg"
                  >
                    <div className="flex gap-4">
                      {/* Icon */}

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B1F4D]/10 text-[#0B1F4D]">
                        {getActionIcon(log.action)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <p className="text-base font-medium leading-relaxed text-[#0B1F4D]">
                              {log.summary}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                                {log.actorLabel ?? "System"}
                              </span>

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getActionBadge(log.action)}`}
                              >
                                {log.action.replaceAll("_", " ")}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                            <Clock3 className="h-4 w-4" />

                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
