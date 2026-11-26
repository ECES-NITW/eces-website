// Copy for the About section on the homepage (app/page.tsx, reached from the navbar at /#about).
// Edit wording here; the layout only reads from this file.
// Anything marked TODO(content) still needs to be confirmed by the society; until then, null values are not shown.

export type AboutFact = { label: string; value: string | null };
export type AboutPillar = { title: string; line: string };

export const about = {
  heading: { first: "Electronics & Communication", second: "Engineering Society" },
  summary:
    "The Electronics & Communication Engineering Society (ECES) is the student society of the Department of Electronics & Communication Engineering at NIT Warangal. It brings ECE students together to learn, build and share ideas beyond the classroom.",

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

  /** Public contact address. Shown in the homepage "Stay connected" list once set. */
  contactEmail: null as string | null, // TODO(content): confirm the society's public email address.
};
