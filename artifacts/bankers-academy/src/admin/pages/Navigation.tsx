import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
    const maxOrder = Math.max(
      0,
      ...items.filter((i) => i.menu === menu).map((i) => i.displayOrder),
    );
    await adminApi.post("/admin/navigation", {
      menu,
      label,
      url,
      displayOrder: maxOrder + 1,
    });
    setLabel("");
    setUrl("");
    await load();
  };

  const handleToggleVisible = async (item: NavItem) => {
    await adminApi.patch(`/admin/navigation/${item.id}`, {
      visible: item.visible !== "true",
    });
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this navigation item?")) return;
    await adminApi.delete(`/admin/navigation/${id}`);
    await load();
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Hero Section */}
      <div className="rounded-2xl border bg-gradient-to-r from-[#0B1F4D] via-[#15367E] to-[#2355C4] p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold">Navigation</h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Manage header and footer navigation links displayed across the
              public website. Organize menus, update URLs and control the
              navigation structure from one place.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur w-fit">
            <p className="text-xs uppercase tracking-wider text-blue-100">
              Website Navigation
            </p>

            <p className="mt-1 text-lg font-semibold">Navigation Dashboard</p>
          </div>
        </div>
      </div>

      {canManage && (
        <Card className="border shadow-md">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Add Navigation Link</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <form
              onSubmit={handleAdd}
              className="grid grid-cols-1 gap-4 lg:grid-cols-4 items-end"
            >
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

                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>URL</Label>

                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="/about"
                />
              </div>

              <Button
                type="submit"
                className="bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#d4aa50] hover:text-[#0B1F4D] cursor-pointer"
              >
                Add Link
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {MENUS.map((m) => {
        const menuItems = items
          .filter((i) => i.menu === m.key)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return (
          <Card key={m.key} className="border shadow-md">
            <CardHeader className="border-b">
              <CardTitle className="text-base">{m.label}</CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20">
                  <div className="h-12 w-12 rounded-full border-4 border-[#0B1F4D] border-t-transparent animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Loading navigation links...
                  </p>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-sm text-muted-foreground">
                    No navigation links found.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-2.5 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.url}
                        </p>
                      </div>
                      {canManage && (
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleVisible(item)}
                          >
                            <Badge
                              variant={
                                item.visible === "true"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item.visible === "true" ? "Visible" : "Hidden"}
                            </Badge>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
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
