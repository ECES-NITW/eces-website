"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus } from "lucide-react";
import { describeEventWhen, type EventInput, type EventView } from "@/lib/event-format";

const blank: EventInput = { title: "", theme: "", short: "", detail: "", date: null, time: null, venue: null, registrationOpen: true, visible: true };

type Editing = { slug: string | null; form: EventInput };

export function AdminEvents({ events, counts }: { events: EventView[]; counts: Record<string, number> }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function send(key: string, url: string, method: string, body?: EventInput) {
    setBusy(key); setError("");
    try {
      const response = await fetch(url, { method, headers: { "content-type": "application/json" }, body: body && JSON.stringify(body) });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Something went wrong. Please try again.");
      router.refresh();
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    const url = editing.slug ? `/api/admin/events/${encodeURIComponent(editing.slug)}` : "/api/admin/events";
    if (await send("save", url, editing.slug ? "PATCH" : "POST", editing.form)) setEditing(null);
  }

  const toggle = (item: EventView, change: Partial<EventInput>) => {
    const { slug, ...rest } = item;
    return send(`${slug}:toggle`, `/api/admin/events/${encodeURIComponent(slug)}`, "PATCH", { ...rest, ...change });
  };

  const remove = (item: EventView) => {
    if (!window.confirm(`Delete “${item.title}”? This can't be undone.`)) return;
    return send(`${item.slug}:delete`, `/api/admin/events/${encodeURIComponent(item.slug)}`, "DELETE");
  };

  const set = <K extends keyof EventInput>(key: K, value: EventInput[K]) =>
    setEditing(current => current && { ...current, form: { ...current.form, [key]: value } });

  return <section className="admin-section">
    <div className="admin-toolbar">
      <p>{events.length} {events.length === 1 ? "event" : "events"}. Changes show on the site straight away.</p>
      {!editing && <button className="admin-button" type="button" onClick={() => { setError(""); setEditing({ slug: null, form: blank }); }}><Plus size={15} /> New event</button>}
    </div>

    {error && <p className="form-error" role="alert">{error}</p>}

    {editing && <form className="admin-form" onSubmit={save}>
      <h2>{editing.slug ? "Edit event" : "New event"}</h2>
      <div className="admin-fields">
        <label className="wide">Title<input required maxLength={120} value={editing.form.title} onChange={e => set("title", e.target.value)} placeholder="Embedded Systems Workshop" /></label>
        <label>Label<input maxLength={30} value={editing.form.theme} onChange={e => set("theme", e.target.value)} placeholder="Build" /><small>A short tag shown above the title.</small></label>
        <label>Venue<input maxLength={120} value={editing.form.venue ?? ""} onChange={e => set("venue", e.target.value || null)} placeholder="ECE Seminar Hall" /></label>
        <label>Date<input type="date" value={editing.form.date ?? ""} onChange={e => set("date", e.target.value || null)} /><small>Leave blank for “Date to be announced”.</small></label>
        <label>Time<input type="time" value={editing.form.time ?? ""} onChange={e => set("time", e.target.value || null)} disabled={!editing.form.date} /></label>
        <label className="wide">Short summary<input maxLength={200} value={editing.form.short} onChange={e => set("short", e.target.value)} placeholder="One line for the homepage" /></label>
        <label className="wide">Description<textarea maxLength={1000} rows={4} value={editing.form.detail} onChange={e => set("detail", e.target.value)} placeholder="What happens, who it's for, what to bring" /></label>
        <label className="admin-check"><input type="checkbox" checked={editing.form.registrationOpen} onChange={e => set("registrationOpen", e.target.checked)} /> Registration open</label>
        <label className="admin-check"><input type="checkbox" checked={editing.form.visible} onChange={e => set("visible", e.target.checked)} /> Show on the website</label>
      </div>
      <div className="admin-form-actions">
        <button className="admin-button primary" type="submit" disabled={busy === "save"}>{busy === "save" ? <>Saving <LoaderCircle className="spin" size={15} /></> : "Save event"}</button>
        <button className="admin-button" type="button" onClick={() => { setEditing(null); setError(""); }}>Cancel</button>
      </div>
    </form>}

    {events.length === 0
      ? <p className="admin-empty">No events yet. Create one to get started.</p>
      : <ul className="admin-event-list">{events.map(item => {
        const { slug, ...form } = item;
        const count = counts[slug] ?? 0;
        return <li key={slug} className={item.visible ? undefined : "is-hidden"}>
          <div className="admin-event-main">
            <span className="admin-event-tags">{item.theme && <span>{item.theme}</span>}<span className={item.registrationOpen ? "tag-open" : "tag-closed"}>{item.registrationOpen ? "Open" : "Closed"}</span>{!item.visible && <span className="tag-hidden">Hidden</span>}</span>
            <strong>{item.title}</strong>
            <small>{describeEventWhen(item)}</small>
          </div>
          <a className="admin-event-count" href={`/admin/registrations?event=${encodeURIComponent(slug)}`}><strong>{count}</strong> {count === 1 ? "registration" : "registrations"}</a>
          <div className="admin-event-actions">
            <button type="button" onClick={() => { setError(""); setEditing({ slug, form }); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
            <button type="button" disabled={busy === `${slug}:toggle`} onClick={() => toggle(item, { registrationOpen: !item.registrationOpen })}>{item.registrationOpen ? "Close registration" : "Open registration"}</button>
            <button type="button" disabled={busy === `${slug}:toggle`} onClick={() => toggle(item, { visible: !item.visible })}>{item.visible ? "Hide" : "Show"}</button>
            {count === 0 && <button type="button" className="danger" disabled={busy === `${slug}:delete`} onClick={() => remove(item)}>Delete</button>}
          </div>
        </li>;
      })}</ul>}
  </section>;
}
