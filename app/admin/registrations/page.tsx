import { Download } from "lucide-react";
import { listEvents, registrationCounts } from "@/lib/events";
import { listRegistrations } from "@/lib/registrations";

export const dynamic = "force-dynamic";

async function load(filter?: string) {
  try {
    const [events, counts, rows] = await Promise.all([listEvents({ includeHidden: true }), registrationCounts(), listRegistrations(filter)]);
    return { events, counts, rows };
  } catch (error) {
    console.error("Admin registrations failed to load", error);
    return null;
  }
}

export default async function AdminRegistrationsPage({ searchParams }: { searchParams: Promise<{ event?: string }> }) {
  const { event: filter } = await searchParams;
  const data = await load(filter);
  if (!data) return <p className="form-error" role="alert">Couldn&apos;t load registrations from the database. Check that the migrations have been applied.</p>;

  const { events, counts, rows } = data;
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const exportHref = filter ? `/api/admin/registrations?event=${encodeURIComponent(filter)}` : "/api/admin/registrations";

  return <section className="admin-section">
    <div className="admin-toolbar">
      <div className="admin-filters" role="list" aria-label="Filter by event">
        <a role="listitem" href="/admin/registrations" aria-current={!filter ? "true" : undefined}>All <span>{total}</span></a>
        {events.map(event => <a role="listitem" key={event.slug} href={`/admin/registrations?event=${encodeURIComponent(event.slug)}`} aria-current={filter === event.slug ? "true" : undefined}>{event.title} <span>{counts[event.slug] ?? 0}</span></a>)}
      </div>
      <a className="admin-button" href={exportHref} download><Download size={15} /> Download CSV</a>
    </div>
    {rows.length === 0
      ? <p className="admin-empty">No registrations{filter ? " for this event" : ""} yet.</p>
      : <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr>{!filter && <th>Event</th>}<th>Name</th><th>Roll number</th><th>Phone</th><th>Year</th><th>Branch</th><th>Registered</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row.id}>{!filter && <td>{row.eventTitle ?? row.eventSlug}</td>}<td>{row.name}</td><td>{row.rollNumber}</td><td>{row.phone}</td><td>{row.year ?? "—"}</td><td>{row.branch ?? "—"}</td><td>{row.registeredAt}</td></tr>)}</tbody>
      </table></div>}
  </section>;
}
