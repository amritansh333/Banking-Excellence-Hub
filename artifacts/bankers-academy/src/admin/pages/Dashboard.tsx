import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adminApi } from "../lib/adminApi";
import { useAdminAuth } from "../lib/AdminAuthContext";

type PermissionCatalogueItem = {
  key: string;
  label: string;
};

export default function Dashboard() {
  const { user } = useAdminAuth();
  const [permissionCatalogue, setPermissionCatalogue] = useState<
    PermissionCatalogueItem[]
  >([]);

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
    () =>
      Object.fromEntries(
        permissionCatalogue.map((permission) => [
          permission.key,
          permission.label,
        ]),
      ),
    [permissionCatalogue],
  );

  const grantedPermissions = user?.permissions ?? [];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl border bg-gradient-to-r from-[#0B1F4D] via-[#15367E] to-[#2355C4] p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-100">
              The Bankers Academy
            </p>

            <h1 className="mt-2 text-3xl md:text-4xl font-serif font-semibold">
              Welcome, {user?.fullName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100">
              Welcome to your administration dashboard. Manage website content,
              applications, enquiries, blogs, testimonials, navigation, settings
              and administrator accounts from one place.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 px-6 py-5 backdrop-blur w-fit">
            <p className="text-xs uppercase tracking-wider text-blue-100">
              Logged In As
            </p>

            <p className="mt-2 text-xl font-semibold">
              {user?.role?.name ?? "Administrator"}
            </p>

            <p className="mt-1 text-sm text-blue-100">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Your Role</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <p className="text-2xl font-semibold text-[#0B1F4D]">
              {user?.role?.name ?? "—"}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Your assigned administrator role.
            </p>
          </CardContent>
        </Card>

        <Dialog>
          <DialogTrigger asChild>
            <Card
              role="button"
              tabIndex={0}
              className="cursor-pointer border shadow-md transition-all hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <CardHeader className="border-b">
                <CardTitle className="text-base">Permissions</CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                <p className="text-2xl font-semibold text-[#0B1F4D]">
                  {grantedPermissions.length}
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  Click to view all assigned permissions.
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>

          <DialogContent overlayClassName="bg-black/40 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>Permissions Granted</DialogTitle>

              <DialogDescription>
                All permissions assigned to your account.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-y-auto pr-1">
              {grantedPermissions.length > 0 ? (
                <ul className="space-y-2">
                  {grantedPermissions.map((permission) => (
                    <li
                      key={permission}
                      className="rounded-lg border bg-muted/30 px-3 py-3 text-sm"
                    >
                      {permissionLabels[permission] ?? permission}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No permissions assigned.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Card className="border shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <p className="text-lg font-semibold break-all text-[#0B1F4D]">
              {user?.email}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Primary administrator email address.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
