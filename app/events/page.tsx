"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { events } from "@/lib/events";

type Status = "idle" | "loading" | "success" | "error";

export default function EventsPage() {
  const [selected, setSelected] = useState<string>(events[0].slug);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const active = events.find(event => event.slug === selected) ?? events[0];

  useEffect(() => {
    const fromLink = new URLSearchParams(window.location.search).get("event");
    if (events.some(event => event.slug === fromLink)) setSelected(fromLink!);
  }, []);

  const choose = (slug: string) => {
    setSelected(slug); setStatus("idle"); setError("");
    if (window.innerWidth < 900) formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) { setError("Please agree to be contacted about this event."); setStatus("error"); return; }
    setStatus("loading"); setError("");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ event: selected, name, email, phone, consent, website: (event.currentTarget.elements.namedItem("website") as HTMLInputElement)?.value ?? "" }),
      });
      const result = (await response.json()) as { error?: string; ok?: boolean };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "We couldn't save your registration. Please try again.");
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't save your registration. Please try again.");
      setStatus("error");
    }
  }

  return <main className="events-page">
    <div className="events-intro"><a className="back-link" href="/"><ArrowLeft size={16} /> Back to home</a><div className="events-heading"><div><h1>GET INVOLVED.<br /><span>MAKE IT REAL.</span></h1><p>Choose what interests you and register below. Event dates will be confirmed later.</p></div><div className="events-side-note"><span>ECE SOCIETY</span><strong>Ideas are better<br />in motion.</strong></div></div></div>
    <div className="registration-layout"><section className="event-choices" aria-label="Choose an event"><div className="form-section-heading"><h2>Choose your event</h2><p>Registrations are open for these event categories. Dates will be announced.</p></div>{events.map(item => <button key={item.slug} type="button" className={selected === item.slug ? "event-choice selected" : "event-choice"} onClick={() => choose(item.slug)} aria-pressed={selected === item.slug}><span className="choice-top"><span>{item.theme}</span><span>{selected === item.slug ? "Selected" : "Choose"} <ArrowUpRight size={15} /></span></span><strong>{item.title}</strong><small>{item.detail}</small><span className="choice-bottom">Date to be announced</span></button>)}</section>
    <div className="registration-column" ref={formRef} id="registration-form"><div className="registration-panel"><div className="registration-top"><span>Register interest</span><h2>{active.title}</h2><p>Enter your details to register. A confirmation will appear once they are saved.</p></div>{status === "success" ? <div className="registration-success" role="status"><span className="success-icon"><Check size={30} /></span><h3>You’re on the list.</h3><p>Your registration for {active.title} has been saved. Event dates and details will be announced later.</p><button type="button" onClick={() => { setStatus("idle"); setName(""); setEmail(""); setPhone(""); setConsent(false); }}>Register someone else <ArrowUpRight size={16} /></button></div> : <form onSubmit={submit} noValidate><label htmlFor="reg-name">Full name</label><input id="reg-name" name="name" type="text" autoComplete="name" required maxLength={100} value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" /><label htmlFor="reg-email">Email address</label><input id="reg-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /><label htmlFor="reg-phone">Phone number</label><input id="reg-phone" name="phone" type="tel" autoComplete="tel" required maxLength={24} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your phone number" /><div className="honeypot" aria-hidden="true"><label htmlFor="reg-website">Website</label><input id="reg-website" name="website" type="text" autoComplete="off" tabIndex={-1} /></div><label className="consent-label"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /><span>ECES may use these details to contact me about this event.</span></label>{status === "error" && <p className="form-error" role="alert">{error}</p>}<button className="submit-registration" type="submit" disabled={status === "loading"}>{status === "loading" ? <>Saving registration <LoaderCircle className="spin" size={17} /></> : <>Complete registration <ArrowUpRight size={17} /></>}</button><p className="privacy-note">Your details are saved privately for event registration. They are not shown on this page.</p></form>}</div></div></div>
  </main>;
}
