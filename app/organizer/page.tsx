import { env } from "cloudflare:workers";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { hasOrganizerAccess } from "@/lib/organizer-access";
import { PasskeyForm } from "./passkey-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Organizer sign-in | ECE Society NIT Warangal",
  robots: { index: false, follow: false },
};

export default async function OrganizerSignIn() {
  const requestHeaders = await headers();
  const origin = env.ORGANIZER_ORIGIN;
  if (!origin || requestHeaders.get("host") !== new URL(origin).host) notFound();
  if (await hasOrganizerAccess(requestHeaders)) redirect("/admin");

  return (
    <main className="admin-page">
      <div className="admin-heading">
        <div><span>ECE Society</span><h1>Organizer sign-in</h1></div>
      </div>
      <PasskeyForm />
    </main>
  );
}
