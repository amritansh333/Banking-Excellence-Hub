import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
      await adminApi.post("/admin/faqs", { question, answer, relatedPage: relatedPage || null });
      setOpen(false);
      setQuestion("");
      setAnswer("");
      setRelatedPage("");
      await load();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Failed to create FAQ.");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-[#0B1F4D]">FAQs</h1>
          <p className="text-muted-foreground">Manage frequently asked questions shown across the site.</p>
        </div>
        {canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#C89B3C]">Add FAQ</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add FAQ</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Question</Label>
                  <Input required value={question} onChange={(e) => setQuestion(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Answer</Label>
                  <textarea
                    required
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-24"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
                
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Saving…" : "Add FAQ"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="divide-y">
              {items.map((f) => (
                <div key={f.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <p className="font-medium text-sm">{f.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">{f.answer}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={f.status === "PUBLISHED" ? "default" : "secondary"}>{f.status}</Badge>
                    {canManage && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleToggleStatus(f)}>
                          {f.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(f.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="text-sm text-muted-foreground py-4">No FAQs yet.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
