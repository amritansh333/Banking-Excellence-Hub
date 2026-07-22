import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { adminApi, AdminApiError } from "../lib/adminApi";
import { useAdminAuth } from "../lib/AdminAuthContext";

export default function Setup() {
  const [, navigate] = useLocation();
  const { refresh } = useAdminAuth();
  const [checking, setChecking] = useState(true);
  const [fullName, setFullName] = useState("");
  const [adminId, setAdminId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    adminApi
      .get<{ bootstrapCompleted: boolean }>("/admin/bootstrap-status")
      .then((res) => {
        if (res.bootstrapCompleted) navigate("/admin/login", { replace: true });
      })
      .finally(() => setChecking(false));
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await adminApi.post("/admin/bootstrap", { fullName, adminId, email, password });
      await refresh();
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1F4D] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-[#0B1F4D]">Set up your Admin Panel</CardTitle>
          <CardDescription>
            Create the first super admin account for The Bankers Academy admin panel. This can only be done once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adminId">Admin ID</Label>
              <Input id="adminId" required value={adminId} onChange={(e) => setAdminId(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <p className="text-xs text-muted-foreground">
                At least 10 characters, with uppercase, lowercase, a number and a symbol.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#C89B3C]" disabled={submitting}>
              {submitting ? "Creating account…" : "Create super admin account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
