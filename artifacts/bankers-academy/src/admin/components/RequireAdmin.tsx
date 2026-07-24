import { type ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "../lib/AdminAuthContext";
import { AdminLayout } from "./AdminLayout";

export function RequireAdmin({
  children,
  permission,
}: {
  children: ReactNode;
  permission?: string;
}) {
  const { user, loading, hasPermission } = useAdminAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate("/admin/login", { replace: true });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#0B1F4D] border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading Admin Panel...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (permission && !hasPermission(permission)) {
    return (
      <AdminLayout>
        <div className="text-center py-24">
          <h1 className="text-xl font-semibold text-[#0B1F4D]">
            Access denied
          </h1>
          <p className="text-muted-foreground mt-2">
            You do not have permission to view this page.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
