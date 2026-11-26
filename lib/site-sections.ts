// The site's sections, in navbar order. The header nav, the homepage glimpses and the
// placeholder pages all read from this list.
//
// Teammates: when your page is ready, replace its placeholder in app/<route>/page.tsx with the
// real page and set `ready: true` here. If the route changes, update `href` too.
export type SiteSectionId = "home" | "projects" | "explore" | "events" | "team" | "roadmaps" | "gallery" | "about";

export type SiteSection = {
  id: SiteSectionId;
  /** Navbar label. */
  label: string;
  href: string;
  /** Heading on the placeholder page and the homepage glimpse. */
  title: string;
  /** One or two sentences describing the section. */
  blurb: string;
  /** True once the real page is on main; false while it shows the "Coming soon" placeholder. */
  ready: boolean;
};

export const siteSections: readonly SiteSection[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    title: "ECE Society",
    blurb: "The ECE Society at NIT Warangal.",
    ready: true,
  },
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
    title: "Projects",
    blurb: "Student builds from across the society, from first circuits to working prototypes.",
    ready: false,
  },
  {
    id: "explore",
    label: "Explore",
    href: "/explore",
    title: "Explore",
    blurb: "Articles and write-ups by ECE students on the ideas shaping electronics and communication.",
    ready: false,
  },
  {
    id: "events",
    label: "Events",
    href: "/events",
    title: "Events",
    blurb: "Workshops, talks and society gatherings. See what's coming up and register.",
    ready: true,
  },
  {
    id: "team",
    label: "Team",
    href: "/team",
    title: "Team",
    blurb: "The students who run the ECE Society, from second year to final year.",
    ready: true,
  },
  {
    id: "roadmaps",
    label: "Roadmaps",
    href: "/roadmaps",
    title: "Roadmaps",
    blurb: "Learning roadmaps for software and hardware, with resources to start from.",
    ready: true,
  },
  {
    id: "gallery",
    label: "Gallery",
    href: "/gallery",
    title: "Gallery",
    blurb: "Photos from society events, grouped by event.",
    ready: false,
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    title: "About",
    blurb: "Who we are, what we do, and how to get involved.",
    ready: true,
  },
];

export function getSection(id: SiteSectionId): SiteSection {
  const section = siteSections.find(item => item.id === id);
  if (!section) throw new Error(`Unknown site section: ${id}`);
  return section;
}

/** True when `pathname` is the section's page or one of its sub-pages. */
export function isCurrentSection(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
