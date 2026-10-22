import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { eventRegistrations, events } from "@/db/schema";

const istFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export type RegistrationRow = Awaited<ReturnType<typeof listRegistrations>>[number];

/** Newest first, optionally for one event, with the registration time already formatted in IST. */
export async function listRegistrations(eventSlug?: string) {
  const rows = await getDb()
    .select({
      id: eventRegistrations.id,
      eventSlug: eventRegistrations.eventSlug,
      eventTitle: events.title,
      name: eventRegistrations.name,
      rollNumber: eventRegistrations.rollNumber,
      phone: eventRegistrations.phone,
      year: eventRegistrations.year,
      branch: eventRegistrations.branch,
      createdAt: eventRegistrations.createdAt,
    })
    .from(eventRegistrations)
    .leftJoin(events, eq(events.slug, eventRegistrations.eventSlug))
    .where(eventSlug ? eq(eventRegistrations.eventSlug, eventSlug) : undefined)
    .orderBy(desc(eventRegistrations.createdAt));
  return rows.map(({ createdAt, ...row }) => ({ ...row, registeredAt: istFormat.format(createdAt) }));
}
