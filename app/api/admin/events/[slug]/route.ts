import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { eventRegistrations, events } from "@/db/schema";
import { parseEventInput } from "@/lib/event-format";
import { findEvent } from "@/lib/events";

// TODO(auth): see app/api/admin/events/route.ts.

type Context = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { slug } = await params;
    if (!(await findEvent(slug))) return Response.json({ error: "That event no longer exists." }, { status: 404 });

    const parsed = parseEventInput((await request.json()) as Record<string, unknown>);
    if ("error" in parsed) return Response.json({ error: parsed.error }, { status: 400 });

    const [updated] = await getDb()
      .update(events)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(events.slug, slug))
      .returning();
    return Response.json({ event: updated });
  } catch (error) {
    console.error("Event update failed", error);
    return Response.json({ error: "Couldn't save the event. Please try again." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { slug } = await params;
    const db = getDb();
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventSlug, slug));
    // Deleting would orphan people's sign-ups, so organisers hide the event instead.
    if (Number(count) > 0) {
      return Response.json({ error: "This event has registrations, so it can't be deleted. Hide it instead." }, { status: 409 });
    }
    await db.delete(events).where(eq(events.slug, slug));
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Event delete failed", error);
    return Response.json({ error: "Couldn't delete the event. Please try again." }, { status: 500 });
  }
}
