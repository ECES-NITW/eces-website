"use client";

import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Events" },
  { href: "/admin/registrations", label: "Registrations" },
];

export function AdminTabs() {
  const pathname = usePathname();
  return <nav className="admin-tabs" aria-label="Admin sections">
    {tabs.map(tab => <a key={tab.href} href={tab.href} aria-current={pathname === tab.href ? "page" : undefined}>{tab.label}</a>)}
  </nav>;
}
