import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminEvents } from "@/components/admin-events";
import { listEvents, registrationCounts, toEventView } from "@/lib/events";
import { hasOrganizerAccess } from "@/lib/organizer-access";

export const dynamic = "force-dynamic";

async function load() {
  try {
    const [events, counts] = await Promise.all([listEvents({ includeHidden: true }), registrationCounts()]);
    return { events: events.map(toEventView), counts };
  } catch (error) {
    console.error("Admin events failed to load", error);
    return null;
  }
}

export default async function AdminEventsPage() {
  if (!(await hasOrganizerAccess(await headers()))) redirect("/organizer");
  const data = await load();
  if (!data) return <p className="form-error" role="alert">Couldn&apos;t load events from the database. Check that the migrations have been applied.</p>;
  return <AdminEvents events={data.events} counts={data.counts} />;
}
