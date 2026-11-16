import { env } from "cloudflare:workers";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import {
  getOrganizerSession,
  hashOrganizerToken,
  isOrganizerOrigin,
  organizerAccessDenied,
  organizerSessionCookie,
  organizerSessionSeconds,
  organizerTokenPattern,
  randomOrganizerToken,
} from "@/lib/organizer-access";

type Challenge = {
  challenge: string;
  invite_hash: string | null;
  user_handle: string | null;
};

type Passkey = {
  id: string;
  user_handle: string;
  public_key: string;
  counter: number;
};

function json(value: object, status = 200) {
  return Response.json(value, { status, headers: { "cache-control": "no-store" } });
}

function sessionResponse(token = "", maxAge = 0) {
  const response = json({ ok: true });
  response.headers.set("set-cookie",
    `${organizerSessionCookie}=${token}; Max-Age=${maxAge}; Path=/; Secure; HttpOnly; SameSite=Strict`);
  return response;
}

async function storeChallenge(db: D1Database, challenge: string, inviteHash?: string, userHandle?: string) {
  const id = randomOrganizerToken();
  await db.batch([
    db.prepare("DELETE FROM organizer_challenges WHERE expires_at <= unixepoch()"),
    db.prepare(
      "INSERT INTO organizer_challenges (id, challenge, invite_hash, user_handle, expires_at) VALUES (?, ?, ?, ?, unixepoch() + 300)",
    ).bind(id, challenge, inviteHash ?? null, userHandle ?? null),
  ]);
  return id;
}

async function takeChallenge(db: D1Database, id: unknown) {
  if (typeof id !== "string" || !organizerTokenPattern.test(id)) return null;
  return db.prepare(
    "DELETE FROM organizer_challenges WHERE id = ? AND expires_at > unixepoch() RETURNING challenge, invite_hash, user_handle",
  ).bind(id).first<Challenge>();
}

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const db = env.DB;
  const origin = env.ORGANIZER_ORIGIN;
  if (!db || !origin || !isOrganizerOrigin(request)) return organizerAccessDenied();

  const { action } = await params;
  const clientIp = request.headers.get("cf-connecting-ip") ?? "local";
  const limit = await env.ORGANIZER_RATE_LIMIT?.limit({ key: clientIp });
  if (limit && !limit.success) return json({ error: "Wait a minute and try again." }, 429);

  if (action === "sign-out") {
    const token = getOrganizerSession(request.headers);
    if (token) {
      await db.prepare("DELETE FROM organizer_sessions WHERE token_hash = ?")
        .bind(await hashOrganizerToken(token)).run();
    }
    return sessionResponse();
  }

  const reader = request.body?.getReader();
  if (!reader) return organizerAccessDenied();
  const chunks = new Uint8Array(24_576);
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (size + value.length > chunks.length) {
      await reader.cancel();
      return json({ error: "Sign-in request is too large." }, 413);
    }
    chunks.set(value, size);
    size += value.length;
  }

  const rpID = new URL(origin).hostname;
  try {
    const body = JSON.parse(new TextDecoder().decode(chunks.subarray(0, size)));
    switch (action) {
      case "enrollment-options": {
        const code = typeof body.code === "string" ? body.code.trim().toLowerCase() : "";
        if (!organizerTokenPattern.test(code)) return organizerAccessDenied();
        const inviteHash = await hashOrganizerToken(code);
        const invite = await db.prepare(
          "SELECT email FROM organizer_invites WHERE token_hash = ? AND expires_at > unixepoch()",
        ).bind(inviteHash).first<{ email: string }>();
        if (!invite) return organizerAccessDenied();

        const options = await generateRegistrationOptions({
          rpName: "ECE Society NIT Warangal",
          rpID,
          userName: invite.email,
          attestationType: "none",
          authenticatorSelection: { residentKey: "required", userVerification: "required" },
          supportedAlgorithmIDs: [-7, -257],
        });
        return json({
          options,
          challengeId: await storeChallenge(db, options.challenge, inviteHash, options.user.id),
        });
      }
      case "enroll": {
        const challenge = await takeChallenge(db, body.challengeId);
        if (!challenge?.invite_hash || !challenge.user_handle) return organizerAccessDenied();
        const result = await verifyRegistrationResponse({
          response: body.response as RegistrationResponseJSON,
          expectedChallenge: challenge.challenge,
          expectedOrigin: origin,
          expectedRPID: rpID,
          requireUserVerification: true,
          supportedAlgorithmIDs: [-7, -257],
        });
        if (!result.verified) return organizerAccessDenied();

        const { id, publicKey, counter } = result.registrationInfo.credential;
        const [inserted] = await db.batch([
          db.prepare(`INSERT INTO organizer_passkeys (id, email, user_handle, public_key, counter)
            SELECT ?, email, ?, ?, ? FROM organizer_invites
            WHERE token_hash = ? AND expires_at > unixepoch()`)
            .bind(id, challenge.user_handle, Buffer.from(publicKey).toString("base64url"), counter, challenge.invite_hash),
          db.prepare("DELETE FROM organizer_invites WHERE token_hash = ?").bind(challenge.invite_hash),
        ]);
        return inserted.meta.changes === 1 ? json({ ok: true }) : organizerAccessDenied();
      }
      case "sign-in-options": {
        const options = await generateAuthenticationOptions({ rpID, userVerification: "required" });
        return json({ options, challengeId: await storeChallenge(db, options.challenge) });
      }
      case "sign-in": {
        const challenge = await takeChallenge(db, body.challengeId);
        if (!challenge || challenge.invite_hash) return organizerAccessDenied();
        const response = body.response as AuthenticationResponseJSON;
        if (typeof response?.id !== "string") return organizerAccessDenied();

        const passkey = await db.prepare(
          "SELECT id, user_handle, public_key, counter FROM organizer_passkeys WHERE id = ?",
        ).bind(response.id).first<Passkey>();
        if (!passkey || response.response.userHandle !== passkey.user_handle) return organizerAccessDenied();

        const result = await verifyAuthenticationResponse({
          response,
          credential: {
            id: passkey.id,
            publicKey: new Uint8Array(Buffer.from(passkey.public_key, "base64url")),
            counter: passkey.counter,
          },
          expectedChallenge: challenge.challenge,
          expectedOrigin: origin,
          expectedRPID: rpID,
          requireUserVerification: true,
        });
        if (!result.verified) return organizerAccessDenied();

        const token = randomOrganizerToken();
        const [updated] = await db.batch([
          db.prepare("UPDATE organizer_passkeys SET counter = ? WHERE id = ? AND counter = ?")
            .bind(result.authenticationInfo.newCounter, passkey.id, passkey.counter),
          db.prepare("INSERT INTO organizer_sessions (token_hash, passkey_id, expires_at) SELECT ?, ?, unixepoch() + ? WHERE changes() = 1")
            .bind(await hashOrganizerToken(token), passkey.id, organizerSessionSeconds),
          db.prepare("DELETE FROM organizer_sessions WHERE expires_at <= unixepoch()"),
        ]);
        return updated.meta.changes === 1
          ? sessionResponse(token, organizerSessionSeconds)
          : organizerAccessDenied();
      }
      default:
        return json({ error: "Unknown sign-in action." }, 404);
    }
  } catch {
    return organizerAccessDenied();
  }
}
