import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminApi } from "../lib/adminApi";
import { useAdminAuth } from "../lib/AdminAuthContext";

type PermissionCatalogueItem = {
  key: string;
  label: string;
};

export default function Dashboard() {
  const { user } = useAdminAuth();
  const [permissionCatalogue, setPermissionCatalogue] = useState<PermissionCatalogueItem[]>([]);

  useEffect(() => {
    let mounted = true;

    adminApi
      .get<PermissionCatalogueItem[]>("/admin/permissions")
      .then((permissions) => {
        if (mounted) setPermissionCatalogue(permissions);
      })
      .catch(() => {
        if (mounted) setPermissionCatalogue([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const permissionLabels = useMemo(
    () => Object.fromEntries(permissionCatalogue.map((permission) => [permission.key, permission.label])),
    [permissionCatalogue],
  );

  const grantedPermissions = user?.permissions ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-[#0B1F4D]">Welcome, {user?.fullName}</h1>
        <p className="text-muted-foreground">The Bankers Academy admin panel dashboard.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your role</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{user?.role?.name ?? "—"}</CardContent>
        </Card>
        <Dialog>
          <DialogTrigger asChild>
            <Card
              role="button"
              tabIndex={0}
              className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <CardHeader>
                <CardTitle className="text-base">Permissions granted</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{grantedPermissions.length} permissions</CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent overlayClassName="bg-black/40 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>Permissions granted</DialogTitle>
              <DialogDescription>All permissions assigned to your account.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              {grantedPermissions.length > 0 ? (
                <ul className="space-y-2">
                  {grantedPermissions.map((permission) => (
                    <li key={permission} className="rounded-md border px-3 py-2 text-sm">
                      {permissionLabels[permission] ?? permission}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No permissions assigned.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{user?.email}</CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">
        More modules — content management, courses, blog, leads, SEO and settings — are being added to this panel.
      </p>
    </div>
  );
}
