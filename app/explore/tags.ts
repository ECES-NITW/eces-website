// Single source of truth for the tag pills.
// `keywords` are matched (case-insensitively, whole-word) against RSS categories, title, and summary.
export type ExploreTag = {
  slug: string;
  label: string;
  keywords: string[];
};

export const EXPLORE_TAGS: ExploreTag[] = [
  { slug: "all", label: "All", keywords: [] },
  {
    slug: "electronics",
    label: "Electronics",
    keywords: [
      "electronics",
      "hardware",
      "circuit",
      "power",
      "battery",
      "batteries",
      "solar",
      "grid",
      "pcb",
      "analog",
      "robotics",
      "robot",
      "energy",
      "motor",
      "actuator",
      "ev",
      "electric vehicle",
    ],
  },
  {
    slug: "embedded",
    label: "Embedded",
    keywords: [
      "embedded",
      "microcontroller",
      "firmware",
      "rtos",
      "arm",
      "risc-v",
      "riscv",
      "fpga",
      "automotive",
      "mcu",
      "dsp",
      "real-time",
      "edge",
      "computing",
    ],
  },
  {
    slug: "iot",
    label: "IoT",
    keywords: [
      "iot",
      "sensor",
      "sensors",
      "wearable",
      "smart",
      "telemetry",
      "bluetooth",
      "zigbee",
      "matter",
      "industrial",
      "edge",
      "monitoring",
    ],
  },
  {
    slug: "vlsi",
    label: "VLSI",
    keywords: [
      "vlsi",
      "semiconductor",
      "semiconductors",
      "chip",
      "chips",
      "silicon",
      "foundry",
      "tsmc",
      "intel",
      "asml",
      "lithography",
      "euv",
      "eda",
      "cadence",
      "synopsys",
      "siemens",
      "packaging",
      "chiplet",
      "chiplets",
      "transistor",
      "cmos",
      "dram",
      "hbm",
      "memory",
      "verification",
      "rtl",
      "asic",
      "soc",
      "wafer",
      "system-level design",
    ],
  },
  {
    slug: "comms",
    label: "Communication",
    keywords: [
      "5g",
      "6g",
      "wireless",
      "rf",
      "antenna",
      "optical",
      "optics",
      "photonics",
      "co-packaged optics",
      "fiber",
      "satellite",
      "telecom",
      "telecommunications",
      "network",
      "networking",
      "pcie",
      "serdes",
      "radar",
      "communication",
    ],
  },
  {
    slug: "ai",
    label: "AI & Edge",
    keywords: [
      "ai",
      "artificial intelligence",
      "machine learning",
      "llm",
      "llms",
      "neural",
      "npu",
      "gpu",
      "inference",
      "training",
      "data center",
      "neuromorphic",
      "gemm",
      "deep learning",
      "generative",
    ],
  },
];

export const DEFAULT_TAG = EXPLORE_TAGS[0];

export function resolveTag(slug?: string): ExploreTag {
  return EXPLORE_TAGS.find((t) => t.slug === slug) ?? DEFAULT_TAG;
}

export function tagHref(slug: string): string {
  return slug === DEFAULT_TAG.slug ? "/explore" : `/explore?tag=${slug}`;
}
