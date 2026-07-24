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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
      await adminApi.post("/admin/users", {
        fullName,
        adminId,
        email,
        password,
        roleId: Number(roleId),
      });
      setOpen(false);
      setFullName("");
      setAdminId("");
      setEmail("");
      setPassword("");
      setRoleId("");
      await load();
    } catch (err) {
      setError(
        err instanceof AdminApiError ? err.message : "Failed to create user.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    await adminApi.patch(`/admin/users/${id}`, { status });
    await load();
  };

  const handleRemove = async (id: number) => {
    if (!confirm("Remove this admin user? They will lose access immediately."))
      return;
    await adminApi.delete(`/admin/users/${id}`);
    await load();
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-2xl border bg-gradient-to-r from-[#0B1F4D] via-[#15367E] to-[#2355C4] p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold">Admin Users</h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Manage administrator accounts, assign roles, control permissions
              and maintain secure access to the administration panel.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="w-fit rounded-xl bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-blue-100">
                User Management
              </p>

              <p className="mt-1 text-lg font-semibold">Admin Dashboard</p>
            </div>

            {canManage && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#d4aa50] hover:text-[#0B1F4D] cursor-pointer">
                    Add Admin User
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Admin User</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Full Name</Label>
                      <Input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Admin ID</Label>
                      <Input
                        required
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Temporary Password</Label>
                      <Input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
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

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting || !roleId}
                    >
                      {submitting ? "Creating..." : "Create Account"}
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
          <CardTitle className="text-base">All Admin Accounts</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="h-12 w-12 rounded-full border-4 border-[#0B1F4D] border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">
                Loading admin accounts...
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-sm">{u.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.adminId} · {u.email} · {u.roleName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={u.status === "ACTIVE" ? "default" : "secondary"}
                    >
                      {u.status}
                    </Badge>
                    {canManage && u.status !== "REMOVED" && (
                      <>
                        {u.status === "ACTIVE" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStatusChange(u.id, "SUSPENDED")
                            }
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(u.id, "ACTIVE")}
                          >
                            Activate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemove(u.id)}
                        >
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
