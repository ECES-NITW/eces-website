import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { events } from "@/db/schema";
import { parseEventInput, slugify } from "@/lib/event-format";
import { findEvent } from "@/lib/events";

// TODO(auth): /api/admin/* and /admin are currently open to anyone; add organiser authentication before publishing.

export async function POST(request: Request) {
  try {
    const parsed = parseEventInput((await request.json()) as Record<string, unknown>);
    if ("error" in parsed) return Response.json({ error: parsed.error }, { status: 400 });

    const base = slugify(parsed.data.title);
    let slug = base;
    for (let n = 2; await findEvent(slug); n++) slug = `${base}-${n}`;

    const db = getDb();
    const [{ max }] = await db.select({ max: sql<number | null>`max(${events.sortOrder})` }).from(events);
    const [created] = await db.insert(events).values({ ...parsed.data, slug, sortOrder: (max ?? 0) + 1 }).returning();
    return Response.json({ event: created }, { status: 201 });
  } catch (error) {
    console.error("Event create failed", error);
    return Response.json({ error: "Couldn't save the event. Please try again." }, { status: 500 });
  }
}
