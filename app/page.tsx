import { ArrowDown, ArrowUpRight, Camera } from "lucide-react";
import DecryptedText from "@/components/react-bits/decrypted-text";
import SpotlightCard from "@/components/react-bits/spotlight-card";
import { Reveal } from "@/components/reveal";
import { SignalSculpture } from "@/components/signal-sculpture";
import { SocialIcon } from "@/components/social-icon";
import { about } from "@/lib/about";
import { describeEventWhen } from "@/lib/event-format";
import { listEvents, type EventRecord } from "@/lib/events";
import { roadmapTracks } from "@/lib/roadmaps";
import { getSection, siteSections, type SiteSectionId } from "@/lib/site-sections";
import { socialLinks } from "@/lib/social-links";
import { teamGroups } from "@/lib/team";
import styles from "./home.module.css";

// Events are edited from /admin, so read them on every request.
export const dynamic = "force-dynamic";

// The homepage is a scroll through short glimpses of each section, each linking to its page.
// Links are plain <a> tags: next/link client navigation is broken with vinext 1.0.0-beta.5.

async function loadEvents(): Promise<EventRecord[]> {
  try {
    return await listEvents();
  } catch (error) {
    // Keep the homepage up even if the database is unreachable; the events section just shows its empty state.
    console.error("Could not load events", error);
    return [];
  }
}

/** Up to three events, open registrations first, otherwise in the admin's order. */
function pickEvents(events: EventRecord[]): EventRecord[] {
  return [...events].sort((a, b) => Number(b.registrationOpen) - Number(a.registrationOpen)).slice(0, 3);
}

function sectionNumber(id: SiteSectionId): string {
  return String(siteSections.findIndex(section => section.id === id)).padStart(2, "0");
}

function Kicker({ id }: { id: SiteSectionId }) {
  return <p className={styles.kicker}><span>{sectionNumber(id)}</span>{getSection(id).label}</p>;
}

const spotlightStyle = {
  "--spotlight-card-surface": "rgba(6, 24, 52, .55)",
  "--spotlight-card-border": "rgba(132, 194, 248, .22)",
  "--spotlight-card-shadow": "none",
} as React.CSSProperties;

type GlimpseCardProps = {
  id: SiteSectionId;
  headline: string;
  cta: string;
  className: string;
  children?: React.ReactNode;
};

/** A bento card for one section. The CTA link stretches over the whole card. */
function GlimpseCard({ id, headline, cta, className, children }: GlimpseCardProps) {
  const section = getSection(id);
  return (
    <SpotlightCard className={`${styles.card} ${className}`} style={spotlightStyle} spotlightColor="#90e2ff" intensity={0.16} borderGlow={0.7}>
      <div className={styles.cardTop}>
        <Kicker id={id} />
        {!section.ready && <span className={styles.soon}>Coming soon</span>}
      </div>
      {children}
      <div className={styles.cardText}>
        <h3>{headline}</h3>
        <p>{section.blurb}</p>
        <a className={styles.cardLink} href={section.href}>{cta} <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </SpotlightCard>
  );
}

function CircuitTraces() {
  return (
    <svg className={styles.circuit} viewBox="0 0 520 220" aria-hidden="true" preserveAspectRatio="xMaxYMin slice">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M0 40 H140 L170 70 H300 L330 40 H520" />
        <path d="M60 110 H200 L230 140 H380 L410 110 H520" />
        <path d="M120 190 H260 L290 160 H440" />
        <path d="M300 70 V20" />
        <path d="M380 140 V200 H520" />
        <path className={styles.signal} d="M0 40 H140 L170 70 H300 L330 40 H520" />
        <path className={styles.signal} d="M60 110 H200 L230 140 H380 L410 110 H520" />
      </g>
      <g fill="currentColor">
        <circle cx="300" cy="20" r="3.5" /><circle cx="170" cy="70" r="3" /><circle cx="230" cy="140" r="3" />
        <circle cx="440" cy="160" r="3.5" /><circle cx="120" cy="190" r="3" /><circle cx="410" cy="110" r="3" />
      </g>
      <rect x="248" y="88" width="64" height="34" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M256 88 V80 M272 88 V80 M288 88 V80 M304 88 V80 M256 122 V130 M272 122 V130 M288 122 V130 M304 122 V130" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function PhotoFrames() {
  return (
    <div className={styles.frames} aria-hidden="true">
      <span /><span /><span><Camera size={22} strokeWidth={1.3} /></span>
    </div>
  );
}

const exploreTopics = ["Semiconductors", "Connected systems", "Intelligent hardware"];

// Senior roles shown on the Team card: the General Secretary and the first Additional Secretaries.
const seniorMembers = teamGroups
  .filter(group => group.id === "general-secretary" || group.id === "additional-secretaries")
  .flatMap(group => group.members.map(member => ({ ...member, role: group.title })))
  .filter(member => member.portrait)
  .slice(0, 5);
const memberCount = teamGroups.reduce((total, group) => total + group.members.length, 0);

export default async function Home() {
  const events = pickEvents(await loadEvents());
  return <main>
    <section className="new-hero">
      <div className="hero-scene"><SignalSculpture /></div>
      <div className="hero-copy-new">
        <h1>TURN IDEAS<br />INTO <span><DecryptedText text="SIGNALS." animateOn="view" sequential characters="01<>/|=+-~" scrambleColor="#4ba4ff" speed={60} /></span></h1>
        <p className="hero-description">A space for curious minds to explore electronics, build together, and connect ideas with the world beyond the classroom.</p>
        <div className="hero-actions-new"><a className="action-primary" href="/events">Explore events <ArrowUpRight size={18} /></a><a className="action-text" href="#whats-on">Discover ECES <ArrowDown size={17} /></a></div>
      </div>
    </section>

    <section className={`home-events ${styles.whatsOn}`} id="whats-on" aria-labelledby="whats-on-title">
      <Reveal>
        <Kicker id="events" />
        <div className="section-topline"><h2 id="whats-on-title">What&apos;s on.</h2><p>Workshops, talks, and society gatherings give new ideas somewhere to begin.</p></div>
        <div className="home-event-list">{events.length === 0 ? <p className="event-empty-note">New events will be announced here soon.</p> : events.map(event => <a href={`/events?event=${event.slug}`} key={event.slug} className="home-event-row"><span>{event.theme}</span><h3>{event.title}</h3><span className="event-row-note">{event.registrationOpen ? "Registration open" : "Registration closed"} · {describeEventWhen(event)}</span><ArrowUpRight size={24} strokeWidth={1.5} /></a>)}</div>
        <a className="home-event-cta" href="/events">View all events and register <ArrowUpRight size={18} /></a>
      </Reveal>
    </section>

    <section className={styles.society} aria-labelledby="society-title">
      <Reveal>
        <div className="section-topline"><h2 id="society-title">Inside the society.</h2><p>What members build, write, capture and run together. Each section has its own page.</p></div>
      </Reveal>
      <div className={styles.bento}>
        <Reveal className={styles.wide}>
          <GlimpseCard id="projects" headline="Built by students." cta="See projects" className={styles.projects}>
            <CircuitTraces />
          </GlimpseCard>
        </Reveal>
        <Reveal delay={0.08}>
          <GlimpseCard id="explore" headline="Read the field." cta="Start reading" className={styles.explore}>
            <ul className={styles.topics} aria-label="Topics">{exploreTopics.map(topic => <li key={topic}>{topic}</li>)}</ul>
          </GlimpseCard>
        </Reveal>
        <Reveal>
          <GlimpseCard id="gallery" headline="Moments from the society." cta="Open the gallery" className={styles.gallery}>
            <PhotoFrames />
          </GlimpseCard>
        </Reveal>
        <Reveal className={styles.wide} delay={0.08}>
          <GlimpseCard id="team" headline="The people behind ECES." cta="Meet the team" className={styles.team}>
            <div className={styles.portraits}>
              <ul>
                {seniorMembers.map(member => (
                  <li key={member.email} title={`${member.name}, ${member.role}`}>
                    {/* The site ships these portraits as resized WebP files, as on the Team page. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/team/${member.portrait}.webp`} alt="" width={160} height={160} loading="lazy" decoding="async" />
                  </li>
                ))}
              </ul>
              <p><strong>{memberCount}</strong> students across {teamGroups.length} roles</p>
            </div>
          </GlimpseCard>
        </Reveal>
      </div>
    </section>

    <section className={styles.roadmaps} aria-labelledby="roadmaps-title">
      <Reveal>
        <Kicker id="roadmaps" />
        <div className="section-topline"><h2 id="roadmaps-title">Know where to start.</h2><p>{getSection("roadmaps").blurb}</p></div>
        <div className={styles.trackList}>
          {roadmapTracks.map((track, index) => (
            <a key={track.id} href="/roadmaps" className={styles.trackRow}>
              <span>Track {String(index + 1).padStart(2, "0")}</span>
              <h3>{track.label}</h3>
              <span className={styles.trackNote}>{track.topics.map(topic => topic.title).join(" / ")}<small>{track.blurb}</small></span>
              <ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" />
            </a>
          ))}
          <a href="/roadmaps" className={styles.trackRow}>
            <span>Coming soon</span>
            <h3>PYQs &amp; textbooks</h3>
            <span className={styles.trackNote}>Previous years&apos; question papers and textbooks<small>Collected in one place for ECE courses.</small></span>
            <ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
        <a className="home-event-cta" href="/roadmaps">Open the roadmaps <ArrowUpRight size={18} /></a>
      </Reveal>
    </section>

    <section className={styles.about} aria-labelledby="about-title">
      <div className={styles.aboutMark} aria-hidden="true">ECES</div>
      <Reveal className={styles.aboutInner}>
        <div className={styles.aboutHead}>
          <Kicker id="about" />
          <h2 id="about-title">{about.heading.first}<br /><em>{about.heading.second}</em></h2>
        </div>
        <div className={styles.aboutBody}>
          <p>{about.homeSummary}</p>
          <a className="action-primary" href="/about">More about the society <ArrowUpRight size={18} /></a>
        </div>
        <ol className={styles.pillars}>
          {about.pillars.map((pillar, index) => (
            <li key={pillar.title}><span>{String(index + 1).padStart(2, "0")}</span>{pillar.title}</li>
          ))}
        </ol>
      </Reveal>
    </section>

    <section className={`connect-section ${styles.connect}`} id="connect" aria-labelledby="connect-title">
      <Reveal>
        <div className="section-topline"><h2 id="connect-title">Stay connected.</h2><p>Follow along for event announcements, recaps, and what the society is building next.</p></div>
        <div className="home-event-list">{socialLinks.map(link => <a href={link.href} key={link.id} className="home-event-row connect-row" target="_blank" rel="noopener noreferrer"><span><SocialIcon id={link.id} size={18} /> {link.label}</span><h3>{link.handle}</h3><span className="event-row-note">{link.note}</span><ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" /></a>)}</div>
      </Reveal>
    </section>
  </main>;
}
