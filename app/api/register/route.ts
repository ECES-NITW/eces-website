import { env } from "cloudflare:workers";
import { detailsFromStudentEmail } from "@/lib/student-email";

const allowedEvents = new Set(["technical-workshops", "industry-research-talks", "ece-society-events"]);

type RegistrationInput = {
  event?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  consent?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  try {
    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (declaredLength > 10_000) return Response.json({ error: "The form is too large." }, { status: 413 });

    const body = (await request.json()) as RegistrationInput;
    const event = typeof body.event === "string" ? body.event : "";
    const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
    const phoneDigits = phoneRaw.replace(/\D/g, "");

    if (!allowedEvents.has(event)) return Response.json({ error: "Choose an event to register for." }, { status: 400 });
    if (name.length < 2 || name.length > 100) return Response.json({ error: "Enter your full name." }, { status: 400 });
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    if (phoneDigits.length < 10 || phoneDigits.length > 15) return Response.json({ error: "Enter a valid phone number, including country code if needed." }, { status: 400 });
    if (body.consent !== true) return Response.json({ error: "Please agree to be contacted about this event." }, { status: 400 });

    // Hidden field catches basic automated submissions without affecting real visitors.
    if (body.website) return Response.json({ ok: true }, { status: 201 });

    if (!env.DB) throw new Error("D1 binding unavailable");
    const student = detailsFromStudentEmail(email);
    await env.DB.prepare(
      `INSERT INTO event_registrations
       (id, event_slug, name, email, phone, year, branch, section)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(event_slug, email) DO UPDATE SET
         name = excluded.name,
         phone = excluded.phone`,
    ).bind(crypto.randomUUID(), event, name, email, phoneRaw, student.year, student.branch, student.section).run();

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Registration failed", error);
    return Response.json({ error: "Registration is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
