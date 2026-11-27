import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Gallery | ECE Society NIT Warangal",
  description: "Photos from ECE Society events at NIT Warangal.",
};

// Placeholder until the Gallery page is built. Replace this file with the real page and set
// `ready: true` for "gallery" in lib/site-sections.ts.
export default function GalleryPage() {
  return <ComingSoon section="gallery" plans={[
    "Photos from society events",
    "Albums grouped by event",
    "Highlights from workshops, talks and gatherings",
  ]} />;
}
