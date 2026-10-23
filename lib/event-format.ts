// Shared by server routes and client components, so nothing here may touch the database.

export type EventView = {
  slug: string;
  title: string;
  theme: string;
  short: string;
  detail: string;
  date: string | null;
  time: string | null;
  venue: string | null;
  registrationOpen: boolean;
  visible: boolean;
};

export type EventInput = Omit<EventView, "slug">;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function formatEventDate(date: string | null) {
  if (!date || !DATE_PATTERN.test(date)) return null;
  const [year, month, day] = date.split("-").map(Number);
  // Format in UTC so the calendar day never shifts with the viewer's timezone.
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatEventTime(time: string | null) {
  if (!time || !TIME_PATTERN.test(time)) return null;
  const [hours, minutes] = time.split(":").map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
}

/** One line such as "Sat, 15 Nov 2026 · 4:00 PM · ECE Seminar Hall". */
export function describeEventWhen(event: Pick<EventView, "date" | "time" | "venue">) {
  const date = formatEventDate(event.date);
  const parts = [date ?? "Date to be announced", date ? formatEventTime(event.time) : null, event.venue].filter(Boolean);
  return parts.join(" · ");
}

export function slugify(title: string) {
  return title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "event";
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max + 1) : "";
}

/** Validates an admin event form. Returns either clean data or a message to show the organiser. */
export function parseEventInput(body: Record<string, unknown>): { data: EventInput } | { error: string } {
  const title = text(body.title, 120);
  const theme = text(body.theme, 30);
  const short = text(body.short, 200);
  const detail = typeof body.detail === "string" ? body.detail.trim().slice(0, 1001) : "";
  const date = text(body.date, 10);
  const time = text(body.time, 5);
  const venue = text(body.venue, 120);

  if (title.length < 2 || title.length > 120) return { error: "Give the event a title (2–120 characters)." };
  if (theme.length > 30) return { error: "Keep the label under 30 characters." };
  if (short.length > 200) return { error: "Keep the short summary under 200 characters." };
  if (detail.length > 1000) return { error: "Keep the description under 1000 characters." };
  if (date && !DATE_PATTERN.test(date)) return { error: "Enter the date as YYYY-MM-DD, or leave it blank." };
  if (time && !TIME_PATTERN.test(time)) return { error: "Enter the time as HH:MM, or leave it blank." };
  if (time && !date) return { error: "Add a date before adding a time." };
  if (venue.length > 120) return { error: "Keep the venue under 120 characters." };

  return {
    data: {
      title, theme, short, detail,
      date: date || null,
      time: time || null,
      venue: venue || null,
      registrationOpen: body.registrationOpen !== false,
      visible: body.visible !== false,
    },
  };
}
