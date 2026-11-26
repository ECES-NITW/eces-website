// Copy for the About page (/about) and the About block on the homepage.
// Edit wording here; the layouts in app/about/page.tsx and app/page.tsx only read from this file.
// Anything marked TODO(content) still needs to be confirmed by the society; until then, null values are not shown.

export type AboutFact = { label: string; value: string | null };
export type AboutPillar = { title: string; line: string };
export type AboutLink = { label: string; href: string; line: string };

export const about = {
  kicker: "About ECES",
  heading: { first: "Electronics & Communication", second: "Engineering Society" },
  summary:
    "The Electronics & Communication Engineering Society (ECES) is the student society of the Department of Electronics & Communication Engineering at NIT Warangal. It brings ECE students together to learn, build and share ideas beyond the classroom.",

  /** Shorter version for the homepage About block. */
  homeSummary:
    "ECES is the student society of the Department of Electronics & Communication Engineering at NIT Warangal, run by students for every ECE student.",

  facts: [
    { label: "Department", value: "Electronics & Communication Engineering" },
    { label: "Institute", value: "NIT Warangal" },
    { label: "Established", value: null }, // TODO(content): year the society was established.
  ] satisfies AboutFact[],

  whoWeAre: [
    "ECES is run by a student team drawn from second year through to final year. The team plans the society's activities and keeps them open to every ECE student, whatever their year or experience.",
    "Through the academic year, the society organises workshops, technical talks and hands-on sessions that take members beyond the syllabus. Its flagship events are held during Technozion, NIT Warangal's technical festival.",
    "ECES also gathers learning resources, including previous years' question papers, textbooks and learning roadmaps, and showcases projects built by its members.",
  ],

  pillars: [
    { title: "Workshops & sessions", line: "Hands-on workshops and sessions through the academic year." },
    { title: "Technical events", line: "Technical talks through the year, and flagship events at Technozion." },
    { title: "Projects", line: "Projects built and shared by society members." },
    { title: "Resources", line: "PYQs, textbooks and learning roadmaps for software and hardware." },
  ] satisfies AboutPillar[],

  getInvolved: [
    { label: "Events", href: "/events", line: "Register for upcoming workshops, talks and society events." },
    { label: "Roadmaps", href: "/roadmaps", line: "Find a learning path for software or hardware." },
    { label: "Team", href: "/team", line: "Meet the students who run the society." },
  ] satisfies AboutLink[],

  /** Public contact address. The email button is hidden while this is null. */
  contactEmail: null as string | null, // TODO(content): confirm the society's public email address.
};
