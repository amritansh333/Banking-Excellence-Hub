import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "../lib/AdminAuthContext";

export default function Dashboard() {
  const { user } = useAdminAuth();

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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Permissions granted</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{user?.permissions.length ?? 0} permissions</CardContent>
        </Card>
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
