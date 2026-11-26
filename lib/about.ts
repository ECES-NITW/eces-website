// Copy for the About section on the homepage (components/about-section.tsx, reached from the navbar at /#about).
// Edit wording here; the layout only reads from this file.
// Every statement below has been confirmed by the society. Don't add facts that haven't been.

export type AboutPillar = { title: string; line: string };

export const about = {
  heading: { first: "Electronics & Communication", second: "Engineering Society" },

  /** Always visible. */
  summary:
    "The Electronics & Communication Engineering Society (ECES) is the official student association of the Department of Electronics & Communication Engineering at the National Institute of Technology Warangal. The society gives ECE students opportunities to learn, build and grow beyond the classroom.",

  /** Always visible, as short points under the summary. */
  highlights: [
    "Official student association of the ECE Department, NIT Warangal",
    "Around 50 members, from first year to final year",
    "Workshops, technical talks and hands-on sessions all year round",
    "Open to every ECE student",
  ],

  /** Shown when the visitor opens "More about ECES". */
  whoWeAre: [
    "ECES brings together around 50 students from first year to final year. Its members plan and run the society's activities, and everything the society organises is open to every ECE student, whatever their year or experience.",
    "Throughout the academic year, the society conducts workshops, technical talks and hands-on sessions that complement the curriculum. It also curates learning resources, including previous years' question papers, textbooks and learning roadmaps, and gives members a platform to showcase their projects.",
  ],

  pillars: [
    { title: "Workshops & sessions", line: "Hands-on workshops and practical sessions held throughout the year." },
    { title: "Technical talks", line: "Talks on topics across electronics and communication engineering." },
    { title: "Learning resources", line: "Previous years' question papers, textbooks and learning roadmaps in one place." },
    { title: "Student projects", line: "A platform for members to build and showcase their work." },
  ] satisfies AboutPillar[],
};
