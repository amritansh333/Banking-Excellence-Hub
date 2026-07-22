import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "../lib/adminApi";
import { useAdminAuth } from "../lib/AdminAuthContext";

type NavItem = {
  id: number;
  menu: string;
  label: string;
  url: string | null;
  displayOrder: number;
  visible: string;
  isCta: string;
};

const MENUS: { key: string; label: string }[] = [
  { key: "header", label: "Header" },
  { key: "footer_col_1", label: "Footer — Quick Links" },
  { key: "footer_col_2", label: "Footer — Program Links" },
  { key: "footer_legal", label: "Footer — Legal" },
];

export default function Navigation() {
  const { hasPermission } = useAdminAuth();
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState("header");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const canManage = hasPermission("navigation.manage");

  const load = async () => {
    setLoading(true);
    const res = await adminApi.get<NavItem[]>("/admin/navigation");
    setItems(res);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    const maxOrder = Math.max(0, ...items.filter((i) => i.menu === menu).map((i) => i.displayOrder));
    await adminApi.post("/admin/navigation", { menu, label, url, displayOrder: maxOrder + 1 });
    setLabel("");
    setUrl("");
    await load();
  };

  const handleToggleVisible = async (item: NavItem) => {
    await adminApi.patch(`/admin/navigation/${item.id}`, { visible: item.visible !== "true" });
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this navigation item?")) return;
    await adminApi.delete(`/admin/navigation/${id}`);
    await load();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-[#0B1F4D]">Navigation</h1>
        <p className="text-muted-foreground">Manage header and footer links shown across the public site.</p>
      </div>

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add link</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div className="space-y-1.5">
                <Label>Menu</Label>
                <Select value={menu} onValueChange={setMenu}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MENUS.map((m) => (
                      <SelectItem key={m.key} value={m.key}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Label</Label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>URL</Label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/about" />
              </div>
              <Button type="submit" className="bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#C89B3C]">
                Add
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {MENUS.map((m) => {
        const menuItems = items.filter((i) => i.menu === m.key).sort((a, b) => a.displayOrder - b.displayOrder);
        return (
          <Card key={m.key}>
            <CardHeader>
              <CardTitle className="text-base">{m.label}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : menuItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No links yet.</p>
              ) : (
                <div className="divide-y">
                  {menuItems.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.url}</p>
                      </div>
                      {canManage && (
                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="outline" onClick={() => handleToggleVisible(item)}>
                            <Badge variant={item.visible === "true" ? "default" : "secondary"}>
                              {item.visible === "true" ? "Visible" : "Hidden"}
                            </Badge>
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
