// The society's public channels. Add or update entries here; the footer and homepage read from this list.
export const socialLinks = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@eces.nitw",
    note: "Event updates, photos, and reels.",
    href: "https://www.instagram.com/eces.nitw/",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "ECE Society, NIT Warangal",
    note: "Talks, achievements, and opportunities.",
    href: "https://www.linkedin.com/company/ecea-nit-warangal/",
  },
] as const;

export type SocialId = (typeof socialLinks)[number]["id"];
