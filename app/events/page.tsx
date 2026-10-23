import { EventRegistration } from "@/components/event-registration";
import { listEvents, toEventView } from "@/lib/events";
import type { EventView } from "@/lib/event-format";

// Events are edited from /admin, so read them on every request.
export const dynamic = "force-dynamic";

async function load() {
  try {
    return (await listEvents()).map(toEventView);
  } catch (error) {
    console.error("Could not load events", error);
    return null;
  }
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ event?: string }> }) {
  const [{ event }, events] = await Promise.all([searchParams, load()]);
  // Homepage links pass ?event=<slug> so the matching event starts selected.
  return <EventRegistration events={events ?? ([] as EventView[])} unavailable={!events} initialEvent={event} />;
}
