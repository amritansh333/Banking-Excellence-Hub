import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { adminApi, AdminApiError } from "../lib/adminApi";
import { useAdminAuth } from "../lib/AdminAuthContext";

type Testimonial = {
  id: number;
  studentName: string;
  currentRole: string | null;
  organization: string | null;
  testimonialText: string;
  rating: number | null;
  featured: boolean;
  showOnHomepage: boolean;
  status: string;
  displayOrder: number;
};

export default function Testimonials() {
  const { hasPermission } = useAdminAuth();
  const canManage = hasPermission("testimonials.manage");
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [testimonialText, setTestimonialText] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await adminApi.get<Testimonial[]>("/admin/testimonials");
    setItems(res);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminApi.post("/admin/testimonials", {
        studentName,
        currentRole: currentRole || null,
        organization: organization || null,
        testimonialText,
        showOnHomepage: true,
      });
      setOpen(false);
      setStudentName("");
      setCurrentRole("");
      setOrganization("");
      setTestimonialText("");
      await load();
    } catch (err) {
      setError(
        err instanceof AdminApiError
          ? err.message
          : "Failed to create testimonial.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (t: Testimonial) => {
    await adminApi.patch(`/admin/testimonials/${t.id}`, {
      status: t.status === "PUBLISHED" ? "UNPUBLISHED" : "PUBLISHED",
    });
    await load();
  };

  const handleToggleHomepage = async (t: Testimonial) => {
    await adminApi.patch(`/admin/testimonials/${t.id}`, {
      showOnHomepage: !t.showOnHomepage,
    });
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    await adminApi.delete(`/admin/testimonials/${id}`);
    await load();
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-2xl border bg-gradient-to-r from-[#0B1F4D] via-[#15367E] to-[#2355C4] p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold">Testimonials</h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Manage student testimonials displayed across the website to
              showcase success stories, career achievements and learner
              experiences.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur w-fit">
              <p className="text-xs uppercase tracking-wider text-blue-100">
                Student Success
              </p>

              <p className="mt-1 text-lg font-semibold">
                Testimonials Dashboard
              </p>
            </div>

            {canManage && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#d4aa50] hover:text-[#0B1F4D] cursor-pointer">
                    Add Testimonial
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Testimonial</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Student Name</Label>
                      <Input
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Current Role</Label>
                      <Input
                        value={currentRole}
                        onChange={(e) => setCurrentRole(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Organization</Label>
                      <Input
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Testimonial</Label>

                      <textarea
                        required
                        className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                        value={testimonialText}
                        onChange={(e) => setTestimonialText(e.target.value)}
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? "Saving..." : "Add Testimonial"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <Card className="border shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="text-base">All Testimonials</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="h-12 w-12 rounded-full border-4 border-[#0B1F4D] border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">
                Loading testimonials...
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((t) => (
                <div
                  key={t.id}
                  className="py-3 flex items-start justify-between gap-4"
                >
                  <div className="max-w-xl">
                    <p className="font-medium text-sm">
                      {t.studentName} {t.currentRole && `· ${t.currentRole}`}{" "}
                      {t.organization && `@ ${t.organization}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.testimonialText}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        t.status === "PUBLISHED" ? "default" : "secondary"
                      }
                    >
                      {t.status}
                    </Badge>
                    {canManage && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleHomepage(t)}
                        >
                          {t.showOnHomepage ? "On homepage" : "Not on homepage"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(t)}
                        >
                          {t.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(t.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-muted-foreground py-4">
                  No testimonials yet.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
