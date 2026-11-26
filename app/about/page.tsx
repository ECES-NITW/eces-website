import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "About | ECE Society NIT Warangal",
  description: "About the ECE Society at NIT Warangal.",
};

// Placeholder until the About page is built. Replace this file with the real page and set
// `ready: true` for "about" in lib/site-sections.ts.
export default function AboutPage() {
  return <ComingSoon section="about" plans={[
    "Who we are",
    "What we do",
    "How to get involved",
  ]} />;
}
