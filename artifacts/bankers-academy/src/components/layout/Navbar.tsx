import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Phone,
  Mail,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import logoPath from "@/attached_assets/logo.jpg";
import { useSiteSettings, useNavigation } from "@/lib/useSiteSettings";

const DEFAULT_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "What We Do", href: "/program" },
  { label: "Courses", href: "/courses" },
  { label: "Contact Us", href: "/contact" },
  { label: "Enquiry", href: "/enquiry" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const settings = useSiteSettings();
  const headerNav = useNavigation();

  const navLinks =
    headerNav
      ?.filter((i) => i.menu === "header")
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((i) => ({ label: i.label, href: i.url ?? "/" })) ??
    DEFAULT_NAV_LINKS;

  const phone = settings?.primaryPhone ?? "+91-6306286395";
  const email = settings?.primaryEmail ?? "admissions@thebankersacademy.org";
  const socials = {
    linkedin: settings?.linkedinUrl ?? "#",
    instagram: settings?.instagramUrl ?? "#",
    facebook: settings?.facebookUrl ?? "#",
    youtube: settings?.youtubeUrl ?? "#",
  };
  const tagline =
    settings?.tagline ?? "Institute of Private Banking Excellence";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#0B1F4D] text-white text-xs">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between py-2">
          <div className="flex items-center gap-5">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 hover:text-[#C89B3C] transition-colors"
            >
              <Phone size={12} />
              <span>{phone}</span>
            </a>
            <span className="text-white/20 hidden sm:block">|</span>
            <a
              href={`mailto:${email}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-[#C89B3C] transition-colors"
            >
              <Mail size={12} />
              <span>{email}</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={socials.linkedin}
              aria-label="LinkedIn"
              className="hover:text-[#C89B3C] transition-colors"
            >
              <Linkedin size={13} />
            </a>
            <a
              href={socials.instagram}
              aria-label="Instagram"
              className="hover:text-[#C89B3C] transition-colors"
            >
              <Instagram size={13} />
            </a>
            <a
              href={socials.facebook}
              aria-label="Facebook"
              className="hover:text-[#C89B3C] transition-colors"
            >
              <Facebook size={13} />
            </a>
            <a
              href={socials.youtube}
              aria-label="YouTube"
              className="hover:text-[#C89B3C] transition-colors"
            >
              <Youtube size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img
                src={logoPath}
                alt="The Bankers Academy LLP"
                className="h-14 w-auto object-contain"
                style={{ maxWidth: "140px" }}
              />
              <div className="block leading-tight">
                <div
                  className="text-[#0B1F4D] font-bold text-base leading-tight"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  The Bankers Academy
                </div>
                <div
                  className="text-[#C89B3C] text-xs font-semibold tracking-wide"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {tagline}
                </div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    location === link.href
                      ? "text-[#0B1F4D] font-semibold"
                      : "text-gray-600 hover:text-[#0B1F4D]"
                  } ${link.label === "Enquiry" ? "ml-1 px-4 py-2 bg-[#C89B3C] hover:bg-[#b8892e] text-white! hover:text-white! rounded font-semibold" : ""}`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {link.label}
                  {location === link.href && link.label !== "Enquiry" && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#C89B3C]" />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              <Link
                href="/enquiry"
                className="hidden md:inline-flex items-center px-4 py-2 bg-[#C89B3C] hover:bg-[#b8892e] text-white text-sm font-semibold rounded transition-colors whitespace-nowrap"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Enquire Now
              </Link>
              <button
                className="p-2 text-gray-600 hover:text-[#0B1F4D]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium rounded transition-colors ${
                    location === link.href
                      ? "bg-[#0B1F4D]/5 text-[#0B1F4D] font-semibold border-l-2 border-[#C89B3C]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#0B1F4D]"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
