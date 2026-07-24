import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { adminApi, AdminApiError } from "../lib/adminApi";
import { useAdminAuth } from "../lib/AdminAuthContext";

export default function Login() {
  const [, navigate] = useLocation();
  const { user, refresh, loading } = useAdminAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/admin", { replace: true });
    }
  }, [loading, user, navigate]);

  // Check whether bootstrap is complete
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await adminApi.get<{ bootstrapCompleted: boolean }>(
          "/admin/bootstrap-status",
        );

        if (mounted && !res.bootstrapCompleted) {
          navigate("/admin/setup", { replace: true });
        }
      } catch {
        // Ignore errors here.
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      await adminApi.post("/admin/login", {
        identifier,
        password,
      });

      await refresh();

      navigate("/admin", { replace: true });
    } catch (err) {
      if (err instanceof AdminApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1F4D] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-[#0B1F4D]">Admin Panel Login</CardTitle>

          <CardDescription>
            The Bankers Academy LLP — restricted access
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="identifier">Admin ID or email</Label>

              <Input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#C89B3C]"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
