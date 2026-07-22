import { useEffect, useState } from "react";

export type SiteSettings = {
  orgName: string;
  shortName: string;
  tagline: string | null;
  primaryPhone: string | null;
  primaryEmail: string | null;
  admissionsEmail: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  twitterUrl: string | null;
};

export type NavItem = {
  id: number;
  menu: string;
  label: string;
  url: string | null;
  displayOrder: number;
  isCta: string;
};

const API_BASE = `${import.meta.env.BASE_URL}api`.replace(/\/$/, "");

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setSettings(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}

export function useNavigation() {
  const [items, setItems] = useState<NavItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/navigation`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setItems(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}
