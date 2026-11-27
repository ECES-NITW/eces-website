import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Explore | ECE Society NIT Warangal",
  description: "Articles and write-ups by ECE students at NIT Warangal.",
};

// Placeholder until the Explore page is built. Replace this file with the real page and set
// `ready: true` for "explore" in lib/site-sections.ts.
export default function ExplorePage() {
  return <ComingSoon section="explore" plans={[
    "Articles and write-ups by ECE students",
    "Explainers on electronics and communication topics",
    "Notes from talks and society events",
  ]} />;
}
