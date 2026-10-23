import { listRegistrations } from "@/lib/registrations";

// TODO(auth): see app/api/admin/events/route.ts.

function csvCell(value: string | null) {
  let text = value ?? "";
  // Stop spreadsheet apps from treating a cell as a formula, while leaving phone numbers like +91… alone.
  if (/^[=@\t\r]/.test(text) || /^[+-][^\d\s]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET(request: Request) {
  try {
    const eventSlug = new URL(request.url).searchParams.get("event") || undefined;
    const rows = await listRegistrations(eventSlug);
    const header = ["Event", "Name", "Roll number", "Phone", "Year", "Branch", "Registered at (IST)"];
    const lines = [header, ...rows.map(row => [row.eventTitle ?? row.eventSlug, row.name, row.rollNumber, row.phone, row.year, row.branch, row.registeredAt])];
    // The BOM makes Excel read names with non-ASCII characters correctly.
    const csv = "﻿" + lines.map(line => line.map(csvCell).join(",")).join("\r\n") + "\r\n";
    const stamp = new Date().toISOString().slice(0, 10);
    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="registrations-${eventSlug ?? "all"}-${stamp}.csv"`,
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("Registration export failed", error);
    return Response.json({ error: "Couldn't export registrations." }, { status: 500 });
  }
}
