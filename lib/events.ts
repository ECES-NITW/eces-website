import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { eventRegistrations, events } from "@/db/schema";
import type { EventView } from "@/lib/event-format";

export type EventRecord = typeof events.$inferSelect;

export async function listEvents({ includeHidden = false } = {}): Promise<EventRecord[]> {
  return getDb()
    .select()
    .from(events)
    .where(includeHidden ? undefined : eq(events.visible, true))
    .orderBy(asc(events.sortOrder), asc(events.createdAt));
}

export async function findEvent(slug: string): Promise<EventRecord | undefined> {
  const [row] = await getDb().select().from(events).where(eq(events.slug, slug)).limit(1);
  return row;
}

export async function registrationCounts(): Promise<Record<string, number>> {
  const rows = await getDb()
    .select({ slug: eventRegistrations.eventSlug, count: sql<number>`count(*)` })
    .from(eventRegistrations)
    .groupBy(eventRegistrations.eventSlug);
  return Object.fromEntries(rows.map(row => [row.slug, Number(row.count)]));
}

/** Strips server-only fields before handing an event to a client component. */
export function toEventView(event: EventRecord): EventView {
  const { slug, title, theme, short, detail, date, time, venue, registrationOpen, visible } = event;
  return { slug, title, theme, short, detail, date, time, venue, registrationOpen, visible };
}
