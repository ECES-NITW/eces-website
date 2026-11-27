import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Projects | ECE Society NIT Warangal",
  description: "Student projects from the ECE Society at NIT Warangal.",
};

// Placeholder until the Projects page is built. Replace this file with the real page and set
// `ready: true` for "projects" in lib/site-sections.ts.
export default function ProjectsPage() {
  return <ComingSoon section="projects" plans={[
    "Project write-ups with photos and build notes",
    "The students behind each build",
    "Work from workshops and society events",
  ]} />;
}
