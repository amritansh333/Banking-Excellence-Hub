import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const STATUSES = ["NEW", "CONTACTED", "FOLLOW_UP", "QUALIFIED", "CLOSED", "SPAM"];

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {kind === "enquiries" ? "Website Enquiries" : "Program Applications"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="divide-y">
            {items.map((lead) => (
              <div key={lead.id} className="py-3 flex items-start justify-between gap-4">
                <div className="flex-1">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">

    <div><span className="font-semibold">ID:</span> {lead.id}</div>

    <div><span className="font-semibold">Status:</span> {lead.status}</div>

    <div><span className="font-semibold">Full Name:</span> {lead.fullName ?? "Null"}</div>

    <div><span className="font-semibold">Email:</span> {lead.email ?? "Null"}</div>

    <div><span className="font-semibold">Phone:</span> {lead.phone ?? "Null"}</div>

    <div><span className="font-semibold">Qualification:</span> {lead.qualification ?? "Null"}</div>

    <div><span className="font-semibold">Date of Birth:</span> {lead.dob ?? "Null"}</div>

    <div><span className="font-semibold">College:</span> {lead.college ?? "Null"}</div>

    <div><span className="font-semibold">City:</span> {lead.city ?? "Null"}</div>

    <div><span className="font-semibold">Experience:</span> {lead.experience ?? "Null"}</div>

    <div><span className="font-semibold">Course ID:</span> {lead.courseId ?? "Null"}</div>

    <div><span className="font-semibold">Course Interest:</span> {lead.courseInterest ?? "Null"}</div>

    <div><span className="font-semibold">Source Page:</span> {lead.sourcePage ?? "Null"}</div>

    <div><span className="font-semibold">UTM Source:</span> {lead.utmSource ?? "Null"}</div>

    <div><span className="font-semibold">UTM Medium:</span> {lead.utmMedium ?? "Null"}</div>

    <div><span className="font-semibold">UTM Campaign:</span> {lead.utmCampaign ?? "Null"}</div>

    <div><span className="font-semibold">Assigned To:</span> {lead.assignedTo ?? "Null"}</div>

    <div><span className="font-semibold">Notes:</span> {lead.notes ?? "Null"}</div>

    <div className="md:col-span-2">
      <span className="font-semibold">Message / Reason:</span>
      <div className="mt-1 rounded-md border bg-muted/30 p-3 whitespace-pre-wrap">
        {lead.message ?? "Null"}
      </div>
    </div>

    <div className="md:col-span-2 text-xs text-muted-foreground">
      Submitted:
      {" "}
      {new Date(lead.createdAt).toLocaleString()}
    </div>

  </div>
</div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={lead.status === "NEW" ? "default" : "secondary"}>{lead.status}</Badge>
                  {canManage && (
                    <>
                      <select
                        className="text-xs border rounded-md px-2 py-1.5 bg-transparent"
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(lead.id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-sm text-muted-foreground py-4">No records yet.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Enquiries() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-[#0B1F4D]">Enquiries</h1>
        <p className="text-muted-foreground">Leads captured from website enquiry and contact forms.</p>
      </div>
      <LeadsTable kind="enquiries" />
    </div>
  );
}

export function Applications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-[#0B1F4D]">Applications</h1>
        <p className="text-muted-foreground">Program applications submitted by prospective students.</p>
      </div>
      <LeadsTable kind="applications" />
    </div>
  );
}
