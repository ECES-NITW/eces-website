import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Registration | ECE Society NIT Warangal",
  description: "Register for ECE Society workshops, research talks, and community events at NIT Warangal.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
