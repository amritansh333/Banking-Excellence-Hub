import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "../lib/AdminAuthContext";

const NAV_ITEMS: { label: string; href: string; permission?: string }[] = [
  { label: "Dashboard", href: "/admin" },

  { label: "Admin Users", href: "/admin/users", permission: "users.view" },

  { label: "Global Settings", href: "/admin/settings", permission: "settings.manage" },

  { label: "Navigation", href: "/admin/navigation", permission: "navigation.manage" },

  { label: "Enquiries", href: "/admin/enquiries", permission: "leads.view" },

  { label: "Applications", href: "/admin/applications", permission: "leads.view" },

  { label: "Blogs", href: "/admin/blogs", permission: "blog.view" },

  { label: "Testimonials", href: "/admin/testimonials", permission: "testimonials.manage" },

  { label: "FAQs", href: "/admin/faqs", permission: "faqs.manage" },

  { label: "Audit Log", href: "/admin/audit-log", permission: "audit_log.view" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, hasPermission, logout } = useAdminAuth();
  const [location, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-muted/30">
      <aside className="sticky top-0 h-screen w-64 shrink-0 bg-[#0B1F4D] text-white flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="font-serif text-lg font-semibold">The Bankers Academy</p>
          <p className="text-xs text-white/60">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {NAV_ITEMS.filter((item) => !item.permission || hasPermission(item.permission)).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-5 py-2.5 text-sm transition-colors ${
                location === item.href ? "bg-[#C89B3C] text-[#0B1F4D] font-medium" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10 text-xs text-white/60">
          <p className="text-white/90 font-medium">{user?.fullName}</p>
          <p>{user?.role?.name}</p>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="h-14 border-b bg-white flex items-center justify-between px-6">
          <p className="text-sm text-muted-foreground">Signed in as {user?.email}</p>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
