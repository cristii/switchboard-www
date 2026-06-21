// Site navigation map. Single source for the header, footer, and 404 links so
// routes stay consistent as pages come online (see PLAN.md "Pages to build").
// Labels are ported verbatim from the reference designs; hrefs are the real
// Next routes the .dc.html sources map to.

export interface NavLink {
  label: string;
  href: string;
}

/** Primary header navigation (from the landing-page header). */
export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

/** Footer link columns (from Site Footer.dc.html). */
export const footerColumns: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Services", href: "/services" },
      { label: "Work", href: "/work" },
      { label: "Process", href: "/process" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Daily Log", href: "/blog" },
      { label: "Knowledge Base", href: "/knowledge-base" },
      { label: "Cost estimator", href: "/calculator" },
      { label: "Isometric Workflow Editor (WIP)", href: "/isometric-editor" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

/** External social / contact links (from Site Footer.dc.html). */
export const socialLinks = {
  email: "mailto:cristi.satcovschi@gmail.com",
  telegram: "https://t.me/cristi_42",
  linkedin: "https://www.linkedin.com/in/cristi-şatcovschi",
  github: "https://github.com/cristii",
} as const;

/** Where the "Book a 15-min call" CTAs point until Cal.com is wired (Phase 2.2). */
export const bookingHref = "/contact";

/** Human label per route, used by the mobile header's current-page badge. */
const routeNames: Record<string, string> = {
  "/": "Home",
  "/services": "Services",
  "/work": "Work",
  "/process": "Process",
  "/pricing": "Pricing",
  "/about": "About",
  "/faq": "FAQ",
  "/blog": "Daily Log",
  "/knowledge-base": "Knowledge Base",
  "/calculator": "Cost estimator",
  "/isometric-editor": "Isometric Editor",
  "/contact": "Contact",
  "/privacy": "Privacy",
  "/terms": "Terms",
};

/** Display name for the current route (falls back to the top-level segment for
 *  nested pages like /blog/[slug], returns "" when unknown). */
export function routeName(pathname: string): string {
  const path =
    pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (routeNames[path]) return routeNames[path];
  const top = "/" + (path.split("/")[1] ?? "");
  return routeNames[top] ?? "";
}

/** Whether a nav href matches the active route, including nested routes. */
export function isActiveRoute(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
