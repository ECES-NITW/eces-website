import type { Metadata } from "next";
import { AdminTabs } from "@/components/admin-tabs";

export const metadata: Metadata = {
  title: "Admin | ECE Society NIT Warangal",
  robots: { index: false, follow: false },
};

// TODO(auth): this area is open to anyone who knows the URL. Add organiser sign-in before publishing.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="admin-page">
    <div className="admin-heading"><div><span>ECE Society</span><h1>Admin</h1></div><AdminTabs /></div>
    {children}
  </main>;
}
