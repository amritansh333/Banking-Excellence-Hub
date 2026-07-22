import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { adminApi, AdminApiError } from "../lib/adminApi";
import { useAdminAuth } from "../lib/AdminAuthContext";

type AdminUserRow = {
  id: number;
  fullName: string;
  adminId: string;
  email: string;
  status: string;
  roleId: number;
  roleName: string | null;
  lastLoginAt: string | null;
};

type Role = { id: number; key: string; name: string };

export default function Users() {
  const { hasPermission } = useAdminAuth();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [adminId, setAdminId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<string>("");

  const canManage = hasPermission("users.manage");

  const load = async () => {
    setLoading(true);
    const [usersRes, rolesRes] = await Promise.all([
      adminApi.get<AdminUserRow[]>("/admin/users"),
      adminApi.get<Role[]>("/admin/roles"),
    ]);
    setUsers(usersRes);
    setRoles(rolesRes);
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
      await adminApi.post("/admin/users", { fullName, adminId, email, password, roleId: Number(roleId) });
      setOpen(false);
      setFullName("");
      setAdminId("");
      setEmail("");
      setPassword("");
      setRoleId("");
      await load();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    await adminApi.patch(`/admin/users/${id}`, { status });
    await load();
  };

  const handleRemove = async (id: number) => {
    if (!confirm("Remove this admin user? They will lose access immediately.")) return;
    await adminApi.delete(`/admin/users/${id}`);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-[#0B1F4D]">Admin Users</h1>
          <p className="text-muted-foreground">Manage admin panel accounts, roles and access.</p>
        </div>
        {canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#C89B3C]">Add admin user</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add admin user</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Admin ID</Label>
                  <Input required value={adminId} onChange={(e) => setAdminId(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Temporary password</Label>
                  <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={roleId} onValueChange={setRoleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={submitting || !roleId}>
                  {submitting ? "Creating…" : "Create account"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All admin accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="divide-y">
              {users.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{u.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.adminId} · {u.email} · {u.roleName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.status === "ACTIVE" ? "default" : "secondary"}>{u.status}</Badge>
                    {canManage && u.status !== "REMOVED" && (
                      <>
                        {u.status === "ACTIVE" ? (
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(u.id, "SUSPENDED")}>
                            Suspend
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(u.id, "ACTIVE")}>
                            Activate
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleRemove(u.id)}>
                          Remove
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
