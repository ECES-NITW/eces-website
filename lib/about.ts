// Copy for the About section on the homepage (components/about-section.tsx, reached from the navbar at /#about).
// Edit wording here; the layout only reads from this file.
//
// Every statement below comes from the society's brief. Anything marked TODO(content) still needs to be
// confirmed; null values are not shown until they are filled in.

export type AboutFact = { label: string; value: string | null };
export type AboutPillar = { title: string; line: string };

export const about = {
  heading: { first: "Electronics & Communication", second: "Engineering Society" },

  /** Always visible: a one-line hook and a short description. */
  lead: "Built by students, for every ECE student.",
  summary:
    "ECES is the Electronics & Communication Engineering Society at NIT Warangal. From hands-on workshops to flagship events at Technozion, we help ECE students learn beyond the syllabus, build with people who share their curiosity, and find their way from first year to final year.",

  facts: [
    { label: "Department", value: "Electronics & Communication Engineering" },
    { label: "Institute", value: "NIT Warangal" },
    { label: "Established", value: null }, // TODO(content): year the society was established.
  ] satisfies AboutFact[],

  /** Shown when the visitor opens "More about ECES". */
  whoWeAre: [
    "ECES is run by students, from second year to final year. Everything we do is open to every ECE student, whether you're wiring your first circuit or preparing for placements.",
    "Through the year we host workshops, technical talks and hands-on sessions that go past the syllabus, and our flagship events take the stage at Technozion, NIT Warangal's tech fest.",
    "Between events, we gather what helps most: previous years' papers, textbooks and learning roadmaps, alongside projects built by our members.",
  ],

  pillars: [
    { title: "Workshops & sessions", line: "Hands-on sessions that take you past the syllabus." },
    { title: "Technical events", line: "Talks through the year and flagship events at Technozion." },
    { title: "Projects", line: "Ideas built by members, shared with everyone." },
    { title: "Resources", line: "PYQs, textbooks and roadmaps in one place." },
  ] satisfies AboutPillar[],
};
