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

type Faq = {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  relatedPage: string | null;
  status: string;
  displayOrder: number;
};

export default function Faqs() {
  const { hasPermission } = useAdminAuth();
  const canManage = hasPermission("faqs.manage");
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [relatedPage, setRelatedPage] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await adminApi.get<Faq[]>("/admin/faqs");
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
      await adminApi.post("/admin/faqs", {
        question,
        answer,
        relatedPage: relatedPage || null,
      });
      setOpen(false);
      setQuestion("");
      setAnswer("");
      setRelatedPage("");
      await load();
    } catch (err) {
      setError(
        err instanceof AdminApiError ? err.message : "Failed to create FAQ.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (f: Faq) => {
    await adminApi.patch(`/admin/faqs/${f.id}`, {
      status: f.status === "PUBLISHED" ? "UNPUBLISHED" : "PUBLISHED",
    });
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return;
    await adminApi.delete(`/admin/faqs/${id}`);
    await load();
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-2xl border bg-gradient-to-r from-[#0B1F4D] via-[#15367E] to-[#2355C4] p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold">FAQs</h1>

            <p className="mt-2 max-w-2xl text-sm text-blue-100 leading-relaxed">
              Manage frequently asked questions displayed across the website to
              help visitors quickly find answers about admissions, courses,
              placements and other services.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur w-fit">
              <p className="text-xs uppercase tracking-wider text-blue-100">
                Knowledge Base
              </p>

              <p className="mt-1 text-lg font-semibold">FAQs Dashboard</p>
            </div>

            {canManage && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#d4aa50] hover:text-[#0B1F4D] cursor-pointer">
                    Add FAQ
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add FAQ</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Question</Label>
                      <Input
                        required
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Answer</Label>

                      <textarea
                        required
                        className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
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
                      {submitting ? "Saving..." : "Add FAQ"}
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
          <CardTitle className="text-base">All FAQs</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-[#0B1F4D] border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">Loading FAQs...</p>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((f) => (
                <div
                  key={f.id}
                  className="py-3 flex items-start justify-between gap-4"
                >
                  <div className="max-w-xl">
                    <p className="font-medium text-sm">{f.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {f.answer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        f.status === "PUBLISHED" ? "default" : "secondary"
                      }
                    >
                      {f.status}
                    </Badge>
                    {canManage && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(f)}
                        >
                          {f.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(f.id)}
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
                  No FAQs yet.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
