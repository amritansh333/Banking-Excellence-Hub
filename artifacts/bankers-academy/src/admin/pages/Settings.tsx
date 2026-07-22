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

const FIELD_GROUPS: { title: string; fields: { key: keyof GlobalSettings; label: string }[] }[] = [
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
      const updated = await adminApi.patch<GlobalSettings>("/admin/settings", payload);
      setSettings(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-[#0B1F4D]">Global Settings</h1>
        <p className="text-muted-foreground">
          Contact details, address and social links used across the website header, footer and contact sections.
        </p>
      </div>

      {FIELD_GROUPS.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle className="text-base">{group.title}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-green-700">Settings saved.</p>}

      {canManage && (
        <Button onClick={handleSave} disabled={saving} className="bg-[#C89B3C] text-[#0B1F4D] hover:bg-[#C89B3C]">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      )}
    </div>
  );
}
