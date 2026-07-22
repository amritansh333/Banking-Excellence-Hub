import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { AdminAuthProvider } from "@/admin/lib/AdminAuthContext";
import { RequireAdmin } from "@/admin/components/RequireAdmin";

import AdminSetup from "@/admin/pages/Setup";
import AdminLogin from "@/admin/pages/Login";
import AdminDashboard from "@/admin/pages/Dashboard";
import AdminUsers from "@/admin/pages/Users";
import AdminAuditLog from "@/admin/pages/AuditLog";
import AdminSettings from "@/admin/pages/Settings";
import AdminNavigation from "@/admin/pages/Navigation";
import AdminEnquiries, {
  Applications as AdminApplications,
} from "@/admin/pages/Leads";
import AdminTestimonials from "@/admin/pages/Testimonials";
import AdminFaqs from "@/admin/pages/Faqs";

// Public pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Program from "@/pages/Program";
import Placements from "@/pages/Placements";
import Gallery from "@/pages/Gallery";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import CareerGuidance from "@/pages/CareerGuidance";
import Admission from "@/pages/Admission";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import Enquiry from "@/pages/Enquiry";
import Courses from "@/pages/Courses";

const queryClient = new QueryClient();

function PublicRouter() {
  return (
    <div className="min-h-screen flex flex-col pt-[112px]">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/program" component={Program} />
          <Route path="/placements" component={Placements} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/blog" component={Blog} />
          <Route path="/contact" component={Contact} />
          <Route path="/career-guidance" component={CareerGuidance} />
          <Route path="/admission" component={Admission} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms" component={Terms} />
          <Route path="/enquiry" component={Enquiry} />
          <Route path="/courses" component={Courses} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer />
    </div>
  );
}




function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AdminAuthProvider>
            <Switch>
              {/* ---------- Admin ---------- */}

              <Route path="/admin/setup" component={AdminSetup} />

              <Route path="/admin/login" component={AdminLogin} />

              <Route path="/admin">
                <RequireAdmin permission="dashboard.view">
                  <AdminDashboard />
                </RequireAdmin>
              </Route>

              <Route path="/admin/dashboard">
                <RequireAdmin permission="dashboard.view">
                  <AdminDashboard />
                </RequireAdmin>
              </Route>

              <Route path="/admin/users">
                <RequireAdmin permission="users.view">
                  <AdminUsers />
                </RequireAdmin>
              </Route>

              <Route path="/admin/audit-log">
                <RequireAdmin permission="audit_log.view">
                  <AdminAuditLog />
                </RequireAdmin>
              </Route>

              <Route path="/admin/settings">
                <RequireAdmin permission="settings.manage">
                  <AdminSettings />
                </RequireAdmin>
              </Route>

              <Route path="/admin/navigation">
                <RequireAdmin permission="navigation.manage">
                  <AdminNavigation />
                </RequireAdmin>
              </Route>

              <Route path="/admin/enquiries">
                <RequireAdmin permission="leads.view">
                  <AdminEnquiries />
                </RequireAdmin>
              </Route>

              <Route path="/admin/applications">
                <RequireAdmin permission="leads.view">
                  <AdminApplications />
                </RequireAdmin>
              </Route>

              <Route path="/admin/testimonials">
                <RequireAdmin permission="testimonials.manage">
                  <AdminTestimonials />
                </RequireAdmin>
              </Route>

              <Route path="/admin/faqs">
                <RequireAdmin permission="faqs.manage">
                  <AdminFaqs />
                </RequireAdmin>
              </Route>

              {/* ---------- Public ---------- */}

              <Route>
                <PublicRouter />
              </Route>
            </Switch>
          </AdminAuthProvider>

          <Toaster />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
