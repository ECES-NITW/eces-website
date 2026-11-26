import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmaps | ECE Society NIT Warangal",
  description: "Software and hardware preparation roadmaps for internships and placements.",
};

export default function RoadmapsLayout({ children }: { children: React.ReactNode }) {
  return children;
}