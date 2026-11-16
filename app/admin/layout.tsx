import type { Metadata } from "next";
import { AdminTabs } from "@/components/admin-tabs";
import { OrganizerSignOut } from "@/app/organizer/passkey-form";

export const metadata: Metadata = {
  title: "Admin | ECE Society NIT Warangal",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="admin-page">
    <div className="admin-heading"><div><span>ECE Society</span><h1>Admin</h1></div><AdminTabs /><OrganizerSignOut /></div>
    {children}
  </main>;
}
