import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApi, AdminApiError } from "../lib/adminApi";
import { useAdminAuth } from "../lib/AdminAuthContext";

type GlobalSettings = {
  id: number;
  orgName: string;
  shortName: string;
  tagline: string | null;
  primaryPhone: string | null;
  secondaryPhone: string | null;
  primaryEmail: string | null;
  admissionsEmail: string | null;
  whatsappNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  mapEmbedUrl: string | null;
  workingHours: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  twitterUrl: string | null;
};

const FIELD_GROUPS: {
  title: string;
  fields: { key: keyof GlobalSettings; label: string }[];
}[] = [
  {
    title: "Organization",
    fields: [
      { key: "orgName", label: "Organization name" },
      { key: "shortName", label: "Short name" },
      { key: "tagline", label: "Tagline" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "primaryPhone", label: "Primary phone" },
      { key: "secondaryPhone", label: "Secondary phone" },
      { key: "primaryEmail", label: "Primary email" },
      { key: "admissionsEmail", label: "Admissions email" },
      { key: "whatsappNumber", label: "WhatsApp number" },
      { key: "workingHours", label: "Working hours" },
    ],
  },
  {
    title: "Address",
    fields: [
      { key: "address", label: "Address line" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "postalCode", label: "Postal code" },
      { key: "country", label: "Country" },
      { key: "mapEmbedUrl", label: "Map embed URL" },
    ],
  },
  {
    title: "Social links",
    fields: [
      { key: "linkedinUrl", label: "LinkedIn" },
      { key: "instagramUrl", label: "Instagram" },
      { key: "facebookUrl", label: "Facebook" },
      { key: "youtubeUrl", label: "YouTube" },
      { key: "twitterUrl", label: "Twitter / X" },
    ],
  },
];

export default function Settings() {
  const { hasPermission } = useAdminAuth();
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const canManage = hasPermission("settings.manage");

  useEffect(() => {
    adminApi.get<GlobalSettings>("/admin/settings").then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const handleChange = (key: keyof GlobalSettings, value: string) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    try {
      const { id, ...payload } = settings;
      const updated = await adminApi.patch<GlobalSettings>(
        "/admin/settings",
        payload,
      );
      setSettings(updated);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof AdminApiError ? err.message : "Failed to save settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-[#0B1F4D] border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Hero Section */}
      <div className="rounded-2xl border bg-gradient-to-r from-[#0B1F4D] via-[#15367E] to-[#2355C4] p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold">
              Global Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Configure organization details, contact information, office
              address and social media links used throughout the public website.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur w-fit">
            <p className="text-xs uppercase tracking-wider text-blue-100">
              Website Configuration
            </p>

            <p className="mt-1 text-lg font-semibold">Settings Dashboard</p>
          </div>
        </div>
      </div>

      {FIELD_GROUPS.map((group) => (
        <Card key={group.title} className="border shadow-md">
          <CardHeader className="border-b">
            <CardTitle className="text-base">{group.title}</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label>{field.label}</Label>

                <Input
                  disabled={!canManage}
                  value={(settings[field.key] as string) ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {saved && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">
            Settings saved successfully.
          </p>
        </div>
      )}

      {canManage && (
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#d4aa50] hover:text-[#0B1F4D] cursor-pointer"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
