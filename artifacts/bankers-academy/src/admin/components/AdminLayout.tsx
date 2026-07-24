import { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "../lib/AdminAuthContext";
import { Menu, X } from "lucide-react";

const NAV_ITEMS: {
  label: string;
  href: string;
  permission?: string;
}[] = [
  { label: "Dashboard", href: "/admin" },

  {
    label: "Admin Users",
    href: "/admin/users",
    permission: "users.view",
  },

  {
    label: "Global Settings",
    href: "/admin/settings",
    permission: "settings.manage",
  },

  {
    label: "Navigation",
    href: "/admin/navigation",
    permission: "navigation.manage",
  },

  {
    label: "Enquiries",
    href: "/admin/enquiries",
    permission: "leads.view",
  },

  {
    label: "Applications",
    href: "/admin/applications",
    permission: "leads.view",
  },

  {
    label: "Blogs",
    href: "/admin/blogs",
    permission: "blog.view",
  },

  {
    label: "Testimonials",
    href: "/admin/testimonials",
    permission: "testimonials.manage",
  },

  {
    label: "FAQs",
    href: "/admin/faqs",
    permission: "faqs.manage",
  },

  {
    label: "Audit Log",
    href: "/admin/audit-log",
    permission: "audit_log.view",
  },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, hasPermission, logout } = useAdminAuth();

  const [location, navigate] = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    closeSidebar();
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-muted/30">
      {/* ===========================
            Mobile Overlay
      ============================ */}

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            backdrop-blur-sm
            lg:hidden
            transition-opacity
          "
        />
      )}

      {/* ===========================
            Sidebar
      ============================ */}

      <aside
        className={`
  fixed
  lg:sticky
  top-0
  left-0
  h-screen
  w-72
  lg:w-80
  shrink-0
  bg-[#0B1F4D]
  text-white
  flex
  flex-col
  z-50
  transition-transform
  duration-300
  ease-out
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
`}
      >
        <div className="border-b border-white/10">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="
      flex
      items-center
      gap-4
      px-5
      py-5
      transition-all
      duration-200
      hover:bg-white/5
    "
          >
            <img
              src="/favicon.jpg"
              alt="The Bankers Academy"
              className="
        h-10
        w-10
        sm:h-12
        sm:w-12
        lg:h-14
        lg:w-14
        shrink-0
        rounded-full
        border-2
        border-white/20
        bg-white
        object-cover
      "
            />

            <div className="flex-1 overflow-hidden">
              <h2
                className="
          font-serif
          font-semibold
          text-white
          text-lg
          sm:text-xl
          leading-tight
          whitespace-normal
          break-words
        "
              >
                The Bankers Academy
              </h2>

              <p
                className="
          mt-0.5
          text-sm
          text-white/70
        "
              >
                Admin Panel
              </p>
            </div>
          </a>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.filter(
            (item) => !item.permission || hasPermission(item.permission),
          ).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`
                block
                px-5
                py-2.5
                text-sm
                transition-colors

                ${
                  location === item.href
                    ? "bg-[#C89B3C] text-[#0B1F4D] font-medium"
                    : "text-white/80 hover:bg-white/10"
                }
              `}
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
      {/* ===========================
            Main Section
      ============================ */}

      <div className="flex-1 flex flex-col min-w-0 h-screen lg:ml-0">
        {/* ===========================
              Header
        ============================ */}

        <header className="h-14 shrink-0 border-b bg-white flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground truncate">
                Signed in as
              </p>

              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Close button visible only when sidebar is open */}

            {sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={closeSidebar}
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-black bg-red-600 text-white hover:bg-red-800 hover:border-red-700 hover:text-black transition-colors"
            >
              Logout
            </Button>
          </div>
        </header>

        {/* ===========================
              Page Content
        ============================ */}

        <main
          className="
            flex-1
            overflow-y-auto
            p-4
            sm:p-6
            bg-muted/30
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
