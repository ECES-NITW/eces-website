import { env } from "cloudflare:workers";
import { findEvent } from "@/lib/events";
import { detailsFromRollNumber, normalizeRollNumber } from "@/lib/roll-number";

type RegistrationInput = {
  event?: unknown;
  name?: unknown;
  rollNumber?: unknown;
  phone?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  try {
    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (declaredLength > 10_000) return Response.json({ error: "The form is too large." }, { status: 413 });

    const body = (await request.json()) as RegistrationInput;
    const event = typeof body.event === "string" ? body.event : "";
    const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
    const rollNumber = typeof body.rollNumber === "string" ? normalizeRollNumber(body.rollNumber) : "";
    const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
    const phoneDigits = phoneRaw.replace(/\D/g, "");

    if (!event) return Response.json({ error: "Choose an event to register for." }, { status: 400 });
    if (name.length < 2 || name.length > 100) return Response.json({ error: "Enter your full name." }, { status: 400 });
    if (!/^[A-Z0-9]{4,20}$/.test(rollNumber)) return Response.json({ error: "Enter your roll number (letters and digits only)." }, { status: 400 });
    if (phoneDigits.length < 10 || phoneDigits.length > 15) return Response.json({ error: "Enter a valid phone number, including country code if needed." }, { status: 400 });

    // Hidden field catches basic automated submissions without affecting real visitors.
    if (body.website) return Response.json({ ok: true }, { status: 201 });

    if (!env.DB) throw new Error("D1 binding unavailable");
    const target = await findEvent(event);
    if (!target || !target.visible) return Response.json({ error: "Choose an event to register for." }, { status: 400 });
    if (!target.registrationOpen) return Response.json({ error: "Registration for this event is closed." }, { status: 409 });

    const student = detailsFromRollNumber(rollNumber);
    await env.DB.prepare(
      `INSERT INTO event_registrations
       (id, event_slug, name, roll_number, phone, year, branch, section)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(event_slug, roll_number) DO UPDATE SET
         name = excluded.name,
         phone = excluded.phone,
         year = excluded.year,
         branch = excluded.branch`,
    ).bind(crypto.randomUUID(), event, name, rollNumber, phoneRaw, student.year, student.branch, student.section).run();

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Registration failed", error);
    return Response.json({ error: "Registration is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
