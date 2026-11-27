// Sections for the homepage Roadmaps glimpse (app/page.tsx).
//
// Every track in lib/roadmaps.ts shows up there automatically. List sections that are planned but
// not built yet here; they show with a "Coming soon" label. When a planned section gets a real track
// in lib/roadmaps.ts, give the track the same `id` (the track then replaces this entry) and delete
// the entry from this list.
//
// Add more as they are planned, e.g. AI/ML or a hardware sub-track such as analog or digital.
export type PlannedRoadmapSection = {
  id: string;
  label: string;
  /** What the section will cover, shown as the main line of the row. */
  covers: string;
  blurb: string;
};

export const plannedRoadmapSections: readonly PlannedRoadmapSection[] = [
  {
    id: "academic",
    label: "Academic resources",
    covers: "Previous years' question papers / Textbooks",
    blurb: "Collected in one place for ECE courses.",
  },
];
