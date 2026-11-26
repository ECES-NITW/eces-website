export type ResourceType = "course" | "docs" | "practice" | "video";

export type Resource = { label: string; url: string; type: ResourceType };

export type Topic = { title: string; description: string; resources: Resource[] };

export type Track = { id: "software" | "hardware"; label: string; blurb: string; topics: Topic[] };

export const roadmapTracks: Track[] = [
  {
    id: "software",
    label: "Software",
    blurb: "Resources for software internships and placements.",
    topics: [
      {
        title: "Data Structures & Algorithms",
        description: "Placeholder: arrays, trees, graphs, DP. Replace with the real list.",
        resources: [{ label: "CSES Problem Set", url: "https://cses.fi/problemset/", type: "practice" }],
      },
      {
        title: "Web Development",
        description: "Placeholder: HTML, CSS, JavaScript, React. Replace with the real list.",
        resources: [{ label: "MDN Web Docs", url: "https://developer.mozilla.org/", type: "docs" }],
      },
    ],
  },
  {
    id: "hardware",
    label: "Hardware",
    blurb: "Resources for core ECE internships and placements.",
    topics: [
      {
        title: "Digital Design & Verilog",
        description: "Placeholder: logic design, HDL, FPGA basics. Replace with the real list.",
        resources: [{ label: "HDLBits", url: "https://hdlbits.01xz.net/", type: "practice" }],
      },
      {
        title: "Embedded Systems",
        description: "Placeholder: C, microcontrollers, interfaces. Replace with the real list.",
        resources: [],
      },
    ],
  },
];