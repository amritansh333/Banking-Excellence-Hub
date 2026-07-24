import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, UserRound, Inbox } from "lucide-react";
import { adminApi } from "../lib/adminApi";
import { useAdminAuth } from "../lib/AdminAuthContext";

type Lead = {
  id: number;

  fullName: string;
  email: string | null;
  phone: string | null;

  dob?: string | null;
  qualification?: string | null;
  college?: string | null;
  city?: string | null;
  experience?: string | null;

  courseId?: number | null;
  courseInterest?: string | null;

  message?: string | null;

  sourcePage?: string | null;

  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;

  assignedTo?: number | null;
  notes?: string | null;

  status: string;
  createdAt: string;
};

const STATUSES = [
  "NEW",
  "CONTACTED",
  "FOLLOW_UP",
  "QUALIFIED",
  "CLOSED",
  "SPAM",
];

const statusClasses: Record<string, string> = {
  NEW: "bg-blue-600 hover:bg-blue-600 text-white",
  CONTACTED: "bg-amber-500 hover:bg-amber-500 text-white",
  FOLLOW_UP: "bg-violet-600 hover:bg-violet-600 text-white",
  QUALIFIED: "bg-green-600 hover:bg-green-600 text-white",
  CLOSED: "bg-slate-700 hover:bg-slate-700 text-white",
  SPAM: "bg-red-600 hover:bg-red-600 text-white",
};

export function LeadsTable({ kind }: { kind: "enquiries" | "applications" }) {
  const { hasPermission } = useAdminAuth();

  const canManage = hasPermission("leads.manage");

  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    const res = await adminApi.get<Lead[]>(`/admin/${kind}`);

    setItems(res);

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [kind]);

  const handleStatusChange = async (id: number, status: string) => {
    await adminApi.patch(`/admin/${kind}/${id}`, { status });
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this record?")) return;

    await adminApi.delete(`/admin/${kind}/${id}`);

    await load();
  };

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-[#0B1F4D] border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading {kind}...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-[#0B1F4D] to-[#173B87] text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">
              {kind === "enquiries"
                ? "Website Enquiries"
                : "Program Applications"}
            </CardTitle>

            <p className="text-sm text-blue-100 mt-1">
              {items.length} {items.length === 1 ? "record" : "records"}{" "}
              available
            </p>
          </div>

          <Badge className="bg-white text-[#0B1F4D] hover:bg-white w-fit">
            {kind === "enquiries" ? "Enquiries" : "Applications"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl">
              📭
            </div>

            <h3 className="text-lg font-semibold">No records found</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              New submissions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((lead) => (
              <Card
                key={lead.id}
                className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-0">
                  {/* Header */}

                  <div className="border-b bg-slate-50 px-6 py-5">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0B1F4D] to-[#2355C4] text-lg font-bold text-white shadow">
                          {(lead.fullName || "?")
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold text-slate-900">
                              {lead.fullName || "Unknown"}
                            </h3>

                            <Badge
                              className={
                                statusClasses[lead.status] ??
                                "bg-slate-600 text-white"
                              }
                            >
                              {lead.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                            <span className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-[#0B1F4D]" />
                              {lead.email || "No email"}
                            </span>

                            <span className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-[#0B1F4D]" />
                              {lead.phone || "No phone"}
                            </span>

                            <span className="flex items-center gap-2">
                              <UserRound className="h-4 w-4 text-[#0B1F4D]" />
                              Lead #{lead.id}
                            </span>
                          </div>
                        </div>
                      </div>

                      {canManage && (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <select
                            className="rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4D]"
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value)
                            }
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(lead.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                      <div className="rounded-xl border bg-white p-4">
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#0B1F4D]">
                          Personal Information
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-slate-500">
                              Qualification
                            </p>
                            <p className="font-medium">
                              {lead.qualification || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Date of Birth
                            </p>
                            <p className="font-medium">{lead.dob || "—"}</p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">College</p>
                            <p className="font-medium">{lead.college || "—"}</p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">City</p>
                            <p className="font-medium">{lead.city || "—"}</p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">Experience</p>
                            <p className="font-medium">
                              {lead.experience || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Course Interest
                            </p>
                            <p className="font-medium">
                              {lead.courseInterest || "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border bg-white p-4">
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#0B1F4D]">
                          Lead Information
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-slate-500">Course ID</p>
                            <p className="font-medium">
                              {lead.courseId ?? "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Source Page
                            </p>
                            <p className="font-medium">
                              {lead.sourcePage || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">UTM Source</p>
                            <p className="font-medium">
                              {lead.utmSource || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">UTM Medium</p>
                            <p className="font-medium">
                              {lead.utmMedium || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              UTM Campaign
                            </p>
                            <p className="font-medium">
                              {lead.utmCampaign || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Assigned To
                            </p>
                            <p className="font-medium">
                              {lead.assignedTo ?? "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border bg-blue-50/40 p-5">
                      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0B1F4D]">
                        Message / Reason
                      </h4>

                      <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                        {lead.message || "No message provided."}
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border bg-amber-50 p-5">
                      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0B1F4D]">
                        Internal Notes
                      </h4>

                      <div className="text-sm whitespace-pre-wrap text-slate-700">
                        {lead.notes || "No notes available."}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 border-t pt-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                      <span>
                        Submitted on{" "}
                        <strong className="text-slate-700">
                          {new Date(lead.createdAt).toLocaleString()}
                        </strong>
                      </span>

                      <span>
                        Lead ID:{" "}
                        <strong className="text-slate-700">#{lead.id}</strong>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Enquiries() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-[#0B1F4D] via-[#15367E] to-[#2355C4] p-8 text-white shadow-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold">
              Website Enquiries
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Manage all enquiries submitted through the website. Review
              applicant details, update lead status, assign follow-ups and
              maintain notes from one place.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-blue-100">
              Lead Management
            </p>

            <p className="mt-1 text-lg font-semibold">Enquiries Dashboard</p>
          </div>
        </div>
      </div>

      <LeadsTable kind="enquiries" />
    </div>
  );
}

export function Applications() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-[#0B1F4D] via-[#15367E] to-[#2355C4] p-8 text-white shadow-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold">
              Program Applications
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Review submitted applications, track applicant progress, manage
              statuses and organize admissions efficiently.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-blue-100">
              Admissions
            </p>

            <p className="mt-1 text-lg font-semibold">Applications Dashboard</p>
          </div>
        </div>
      </div>

      <LeadsTable kind="applications" />
    </div>
  );
}
