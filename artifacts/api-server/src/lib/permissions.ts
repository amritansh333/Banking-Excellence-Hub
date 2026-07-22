// Canonical permission catalogue for the admin panel RBAC system.
// Each permission is `category.action`. Roles are built by composing these.

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",

  USERS_VIEW: "users.view",
  USERS_MANAGE: "users.manage", // create/update/suspend/remove
  ROLES_MANAGE: "roles.manage",

  PAGES_VIEW: "pages.view",
  PAGES_EDIT: "pages.edit",
  PAGES_PUBLISH: "pages.publish",

  COURSES_VIEW: "courses.view",
  COURSES_MANAGE: "courses.manage",
  COURSES_PUBLISH: "courses.publish",

  BLOG_VIEW: "blog.view",
  BLOG_MANAGE: "blog.manage",
  BLOG_PUBLISH: "blog.publish",

  TESTIMONIALS_MANAGE: "testimonials.manage",
  FAQS_MANAGE: "faqs.manage",

  MEDIA_VIEW: "media.view",
  MEDIA_MANAGE: "media.manage",

  LEADS_VIEW: "leads.view",
  LEADS_MANAGE: "leads.manage",

  NAVIGATION_MANAGE: "navigation.manage",
  SETTINGS_MANAGE: "settings.manage",

  SEO_MANAGE: "seo.manage",
  REDIRECTS_MANAGE: "redirects.manage",

  AUDIT_LOG_VIEW: "audit_log.view",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_CATALOGUE: { key: PermissionKey; category: string; label: string }[] = [
  { key: PERMISSIONS.DASHBOARD_VIEW, category: "Dashboard", label: "View dashboard" },
  { key: PERMISSIONS.USERS_VIEW, category: "Admin Users", label: "View admin users" },
  { key: PERMISSIONS.USERS_MANAGE, category: "Admin Users", label: "Manage admin users" },
  { key: PERMISSIONS.ROLES_MANAGE, category: "Admin Users", label: "Manage roles & permissions" },
  { key: PERMISSIONS.PAGES_VIEW, category: "CMS Pages", label: "View pages" },
  { key: PERMISSIONS.PAGES_EDIT, category: "CMS Pages", label: "Edit pages" },
  { key: PERMISSIONS.PAGES_PUBLISH, category: "CMS Pages", label: "Publish pages" },
  { key: PERMISSIONS.COURSES_VIEW, category: "Courses", label: "View courses" },
  { key: PERMISSIONS.COURSES_MANAGE, category: "Courses", label: "Manage courses" },
  { key: PERMISSIONS.COURSES_PUBLISH, category: "Courses", label: "Publish courses" },
  { key: PERMISSIONS.BLOG_VIEW, category: "Blog", label: "View blog posts" },
  { key: PERMISSIONS.BLOG_MANAGE, category: "Blog", label: "Manage blog posts" },
  { key: PERMISSIONS.BLOG_PUBLISH, category: "Blog", label: "Publish blog posts" },
  { key: PERMISSIONS.TESTIMONIALS_MANAGE, category: "Testimonials", label: "Manage testimonials" },
  { key: PERMISSIONS.FAQS_MANAGE, category: "FAQs", label: "Manage FAQs" },
  { key: PERMISSIONS.MEDIA_VIEW, category: "Media", label: "View media library" },
  { key: PERMISSIONS.MEDIA_MANAGE, category: "Media", label: "Manage media library" },
  { key: PERMISSIONS.LEADS_VIEW, category: "Leads", label: "View enquiries & applications" },
  { key: PERMISSIONS.LEADS_MANAGE, category: "Leads", label: "Manage enquiries & applications" },
  { key: PERMISSIONS.NAVIGATION_MANAGE, category: "Site Structure", label: "Manage navigation, header & footer" },
  { key: PERMISSIONS.SETTINGS_MANAGE, category: "Site Structure", label: "Manage global settings" },
  { key: PERMISSIONS.SEO_MANAGE, category: "SEO", label: "Manage SEO settings" },
  { key: PERMISSIONS.REDIRECTS_MANAGE, category: "SEO", label: "Manage redirects" },
  { key: PERMISSIONS.AUDIT_LOG_VIEW, category: "Audit", label: "View audit log" },
];

export const ALL_PERMISSION_KEYS = PERMISSION_CATALOGUE.map((p) => p.key);

export const DEFAULT_PERSONAS = [
  { key: "super_admin", name: "Super Admin", description: "Full unrestricted access to every module." },
  { key: "content_manager", name: "Content Manager", description: "Manages pages, courses, blog and testimonials." },
  { key: "admissions_officer", name: "Admissions Officer", description: "Manages leads, enquiries and applications." },
  { key: "seo_manager", name: "SEO Manager", description: "Manages SEO, redirects and structured data." },
];

export const DEFAULT_ROLES: {
  key: string;
  name: string;
  description: string;
  personaKey: string;
  isSuperAdmin: boolean;
  permissions: PermissionKey[];
}[] = [
  {
    key: "super_admin",
    name: "Super Admin",
    description: "Unrestricted access to all admin panel modules.",
    personaKey: "super_admin",
    isSuperAdmin: true,
    permissions: ALL_PERMISSION_KEYS,
  },
  {
    key: "content_manager",
    name: "Content Manager",
    description: "Manages website content across pages, courses, blog, testimonials and FAQs.",
    personaKey: "content_manager",
    isSuperAdmin: false,
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PAGES_VIEW,
      PERMISSIONS.PAGES_EDIT,
      PERMISSIONS.PAGES_PUBLISH,
      PERMISSIONS.COURSES_VIEW,
      PERMISSIONS.COURSES_MANAGE,
      PERMISSIONS.COURSES_PUBLISH,
      PERMISSIONS.BLOG_VIEW,
      PERMISSIONS.BLOG_MANAGE,
      PERMISSIONS.BLOG_PUBLISH,
      PERMISSIONS.TESTIMONIALS_MANAGE,
      PERMISSIONS.FAQS_MANAGE,
      PERMISSIONS.MEDIA_VIEW,
      PERMISSIONS.MEDIA_MANAGE,
      PERMISSIONS.NAVIGATION_MANAGE,
    ],
  },
  {
    key: "admissions_officer",
    name: "Admissions Officer",
    description: "Manages enquiries and applications from prospective students.",
    personaKey: "admissions_officer",
    isSuperAdmin: false,
    permissions: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.LEADS_VIEW, PERMISSIONS.LEADS_MANAGE],
  },
  {
    key: "seo_manager",
    name: "SEO Manager",
    description: "Manages SEO metadata, redirects and structured data.",
    personaKey: "seo_manager",
    isSuperAdmin: false,
    permissions: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.SEO_MANAGE, PERMISSIONS.REDIRECTS_MANAGE, PERMISSIONS.PAGES_VIEW],
  },
];
