import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone, Twitter, Youtube } from "lucide-react";
import logoPath from "@/attached_assets/logo.jpg";
import { useSiteSettings, useNavigation } from "@/lib/useSiteSettings";

const DEFAULT_QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Placements", href: "/placements" },
  { label: "Career Guidance", href: "/career-guidance" },
  { label: "News & Articles", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const DEFAULT_PROGRAM_LINKS = [
  { label: "Private Banking & Finance Excellence", href: "/program" },
  { label: "Admission Process", href: "/admission" },
  { label: "Curriculum", href: "/program#curriculum" },
  { label: "FAQs", href: "/program#faq" },
];

const DEFAULT_LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export function Footer() {
  const settings = useSiteSettings();
  const nav = useNavigation();

  const byMenu = (menu: string, fallback: { label: string; href: string }[]) =>
    nav
      ?.filter((i) => i.menu === menu)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((i) => ({ label: i.label, href: i.url ?? "#" })) ?? fallback;

  const quickLinks = byMenu("footer_col_1", DEFAULT_QUICK_LINKS);
  const programLinks = byMenu("footer_col_2", DEFAULT_PROGRAM_LINKS);
  const legalLinks = byMenu("footer_legal", DEFAULT_LEGAL_LINKS);

  const phone = settings?.primaryPhone ?? "+91-6306286395";
  const email = settings?.primaryEmail ?? "admissions@thebankersacademy.org";
  const address = settings?.address
    ? `${settings.address}${settings.postalCode ? `, ${settings.postalCode}` : ""}`
    : "First Floor Dev Residency, Plot No.803, P Block, Kakadeo, Kanpur, 208025";
  const tagline = settings?.tagline ?? "Institute of Private Banking Excellence";
  const socials = {
    linkedin: settings?.linkedinUrl ?? "#",
    instagram: settings?.instagramUrl ?? "#",
    facebook: settings?.facebookUrl ?? "#",
    youtube: settings?.youtubeUrl ?? "#",
    twitter: settings?.twitterUrl ?? "#",
  };

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white p-2 rounded shrink-0">
                <img src={logoPath} alt="The Bankers Academy" className="h-20 w-20 object-contain" />
              </div>
              <div>
                <div className="text-white font-bold text-base leading-tight" style={{ fontFamily: "'Raleway', sans-serif" }}>The Bankers Academy</div>
                <div className="text-[#C89B3C] text-xs font-semibold mt-1" style={{ fontFamily: "'Open Sans', sans-serif" }}>{tagline}</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mt-2">
              A prestigious institute of private banking excellence preparing students to survive, thrive, and grow in the Private Banking, Finance, Insurance, and NBFC sectors.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href={socials.linkedin} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Linkedin size={16} />
              </a>
              <a href={socials.instagram} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Instagram size={16} />
              </a>
              <a href={socials.facebook} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Facebook size={16} />
              </a>
              <a href={socials.youtube} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Youtube size={16} />
              </a>
              <a href={socials.twitter} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold mb-6 text-white relative inline-block tracking-wide uppercase" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: "0.04em" }}>
              Quick Links
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#C89B3C]"></span>
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {quickLinks.map((l) => (
                <li key={l.label}><Link href={l.href} className="hover:text-secondary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Program */}
          <div>
            <h3 className="text-base font-bold mb-6 text-white relative inline-block tracking-wide uppercase" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: "0.04em" }}>
              Our Program
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#C89B3C]"></span>
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {programLinks.map((l) => (
                <li key={l.label}><Link href={l.href} className="hover:text-secondary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold mb-6 text-white relative inline-block tracking-wide uppercase" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: "0.04em" }}>
              Contact Info
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#C89B3C]"></span>
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="text-secondary mt-0.5 shrink-0" size={18} />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-secondary shrink-0" size={18} />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-secondary shrink-0" size={18} />
                <span>{email}</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Subscribe to Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:border-secondary text-sm"
                />
                <button className="bg-secondary text-white px-4 py-2 rounded-r-md font-medium text-sm hover:bg-secondary/90 transition-colors cursor-pointer">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 space-y-3">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} The Bankers Academy LLP. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {legalLinks.map((l) => (
                <Link key={l.label} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-gray-500" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            Developed & Managed by{" "}
            <a href="https://www.vigyapanam.in" target="_blank" rel="noopener noreferrer" className="text-[#C89B3C] hover:text-[#d4aa50] transition-colors font-medium">
              Vigyapanam Digi Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
