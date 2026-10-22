import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  // The slug is fixed once created because registrations refer to it.
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  theme: text("theme").notNull().default(""),
  short: text("short").notNull().default(""),
  detail: text("detail").notNull().default(""),
  // Stored as plain "YYYY-MM-DD" and "HH:MM" (campus local time) so they never shift between timezones.
  date: text("date"),
  time: text("time"),
  venue: text("venue"),
  registrationOpen: integer("registration_open", { mode: "boolean" }).notNull().default(true),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const eventRegistrations = sqliteTable(
  "event_registrations",
  {
    id: text("id").primaryKey(),
    eventSlug: text("event_slug").notNull(),
    name: text("name").notNull(),
    // Kept as text: roll numbers mix letters and digits (e.g. 23ECB0A12).
    rollNumber: text("roll_number").notNull(),
    phone: text("phone").notNull(),
    year: text("year"),
    branch: text("branch"),
    section: text("section"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  },
  (table) => [uniqueIndex("event_registrations_event_roll_number_unique").on(table.eventSlug, table.rollNumber)],
);
