import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { SignalSculpture } from "@/components/signal-sculpture";
import { events } from "@/lib/events";

const subjects = [
  { title: "Semiconductors", description: "Explore the materials, architectures, and devices shaping tomorrow's electronics." },
  { title: "Connected systems", description: "Follow the ideas carrying communication beyond today's networks." },
  { title: "Intelligent hardware", description: "Discover where computation meets the physical world." },
];

export default function Home() {
  return <main>
    <section className="new-hero">
      <div className="hero-scene"><SignalSculpture /></div>
      <div className="hero-copy-new">
        <h1>TURN IDEAS<br />INTO <span>SIGNALS.</span></h1>
        <p className="hero-description">A space for curious minds to explore electronics, build together, and connect ideas with the world beyond the classroom.</p>
        <div className="hero-actions-new"><a className="action-primary" href="/events">Explore events <ArrowUpRight size={18} /></a><a className="action-text" href="#explore">Discover ECES <ArrowDown size={17} /></a></div>
      </div>
    </section>

    <section className="explore-section" id="explore">
      <div className="section-topline"><h2>Explore the field.</h2><p>Our interests stretch from the smallest devices to the systems that connect us all.</p></div>
      <div className="subject-list">{subjects.map(subject => <div className="subject-row" key={subject.title}><h3>{subject.title}</h3><p>{subject.description}</p><MoveUpRight size={22} strokeWidth={1.5} aria-hidden="true" /></div>)}</div>
    </section>

    <section className="community-section" id="community"><div className="community-mark" aria-hidden="true">ECES</div><div className="community-content"><h2>Built by the people<br />who ask <em>what if.</em></h2><p>Student projects, technical conversations, and shared experiments are the heart of the society. Every idea is a chance to learn from someone else and make something real.</p><div className="community-lines"><span>Projects & prototypes</span><span>Career paths</span><span>Student achievements</span></div></div></section>

    <section className="home-events"><div className="section-topline"><h2>Find your next connection.</h2><p>Workshops, talks, and society gatherings give new ideas somewhere to begin.</p></div><div className="home-event-list">{events.map(event => <a href={`/events?event=${event.slug}`} key={event.slug} className="home-event-row"><span>{event.theme}</span><h3>{event.title}</h3><span className="event-row-note">Registration open · Dates to be announced</span><ArrowUpRight size={24} strokeWidth={1.5} /></a>)}</div><a className="home-event-cta" href="/events">View all events and register <ArrowUpRight size={18} /></a></section>
  </main>;
}
