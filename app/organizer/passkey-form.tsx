"use client";

import { useState, type FormEvent } from "react";
import {
  startAuthentication,
  startRegistration,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";

async function passkeyRequest<T>(action: string, body: object) {
  const response = await fetch(`/api/organizer/${action}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Passkey request failed.");
  return response.json() as Promise<T>;
}

export function PasskeyForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function signIn() {
    setBusy(true);
    setMessage("");
    try {
      const { options, challengeId } = await passkeyRequest<{
        options: PublicKeyCredentialRequestOptionsJSON;
        challengeId: string;
      }>("sign-in-options", {});
      const response = await startAuthentication({ optionsJSON: options });
      await passkeyRequest("sign-in", { response, challengeId });
      window.location.assign("/admin");
    } catch {
      setMessage("Couldn’t sign in. Use a passkey that you enrolled for this site.");
      setBusy(false);
    }
  }

  async function enroll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const code = new FormData(form).get("code");
    setBusy(true);
    setMessage("");
    try {
      const { options, challengeId } = await passkeyRequest<{
        options: PublicKeyCredentialCreationOptionsJSON;
        challengeId: string;
      }>("enrollment-options", { code });
      const response = await startRegistration({ optionsJSON: options });
      await passkeyRequest("enroll", { response, challengeId });
      form.reset();
      setMessage("Passkey created. Sign in to continue.");
    } catch {
      setMessage("Couldn’t create a passkey. Check that your enrollment code is still valid and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-section">
      <button className="admin-button" type="button" disabled={busy} onClick={signIn}>
        Sign in with a passkey
      </button>
      <form className="admin-toolbar" onSubmit={enroll}>
        <label>
          Enrollment code
          <input name="code" type="password" required autoComplete="off" />
        </label>
        <button className="admin-button" disabled={busy}>Create a passkey</button>
      </form>
      <p role="status">{message}</p>
    </section>
  );
}

export function OrganizerSignOut() {
  const [message, setMessage] = useState("");

  async function signOut() {
    try {
      await passkeyRequest("sign-out", {});
      window.location.replace("/organizer");
    } catch {
      setMessage("Couldn’t sign out. Try again.");
    }
  }

  return (
    <>
      <button className="admin-button" type="button" onClick={signOut}>Sign out</button>
      {message && <p role="status">{message}</p>}
    </>
  );
}
