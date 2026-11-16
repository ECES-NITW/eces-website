import { env } from "cloudflare:workers";

export const organizerSessionCookie = "__Host-eces-organizer";
export const organizerSessionSeconds = 8 * 60 * 60;
export const organizerTokenPattern = /^[a-f0-9]{64}$/;

export function randomOrganizerToken() {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("hex");
}

export async function hashOrganizerToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Buffer.from(digest).toString("hex");
}

export function getOrganizerSession(headers: Pick<Headers, "get">) {
  const token = headers.get("cookie")?.split(";")
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(organizerSessionCookie + "="))
    ?.slice(organizerSessionCookie.length + 1);
  return token && organizerTokenPattern.test(token) ? token : undefined;
}

export function isOrganizerOrigin(request: Request) {
  const origin = env.ORGANIZER_ORIGIN;
  return Boolean(origin && request.headers.get("origin") === origin
    && new URL(request.url).origin === origin);
}

export async function hasOrganizerAccess(headers: Pick<Headers, "get">) {
  const token = getOrganizerSession(headers);
  if (!env.ORGANIZER_ORIGIN || !env.DB || !token) return false;

  const session = await env.DB.prepare(
    "SELECT 1 AS active FROM organizer_sessions WHERE token_hash = ? AND expires_at > unixepoch()",
  ).bind(await hashOrganizerToken(token)).first();
  return Boolean(session);
}

export function organizerAccessDenied() {
  return Response.json({ error: "Organizer sign-in required." }, {
    status: 403,
    headers: { "cache-control": "no-store" },
  });
}
