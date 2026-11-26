import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SocialIcon } from "@/components/social-icon";
import { about } from "@/lib/about";
import { socialLinks } from "@/lib/social-links";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About | ECE Society NIT Warangal",
  description: about.summary,
};

// All copy lives in lib/about.ts. Links are plain <a> tags: next/link client navigation is
// broken with vinext 1.0.0-beta.5.
export default function AboutPage() {
  const facts = about.facts.filter(fact => fact.value !== null);
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.mark} aria-hidden="true">ECES</div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- next/link navigation is broken in this vinext version */}
        <a className={styles.back} href="/"><ArrowLeft size={16} aria-hidden="true" /> Back to home</a>
        <div className={styles.introGrid}>
          <div>
            <p className={styles.kicker}>{about.kicker}</p>
            <h1>{about.heading.first}<br /><span>{about.heading.second}</span></h1>
            <p className={styles.summary}>{about.summary}</p>
          </div>
          <dl className={styles.facts}>
            {facts.map(fact => (
              <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
            ))}
          </dl>
        </div>
      </header>

      <Reveal>
        <section className={styles.split} aria-labelledby="who-title">
          <h2 id="who-title">Who we are</h2>
          <div className={styles.prose}>{about.whoWeAre.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.block} aria-labelledby="what-title">
          <h2 id="what-title">What we do</h2>
          <ol className={styles.pillars}>
            {about.pillars.map((pillar, index) => (
              <li key={pillar.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.line}</p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.block} aria-labelledby="involved-title">
          <h2 id="involved-title">Get involved</h2>
          <div className={styles.rows}>
            {about.getInvolved.map(link => (
              <a key={link.href} href={link.href} className={styles.row}>
                <h3>{link.label}</h3>
                <p>{link.line}</p>
                <ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.block} aria-labelledby="contact-title">
          <h2 id="contact-title">Get in touch</h2>
          <div className={styles.rows}>
            {socialLinks.map(link => (
              <a key={link.id} href={link.href} className={styles.row} target="_blank" rel="noopener noreferrer">
                <h3><SocialIcon id={link.id} size={20} /> {link.label}</h3>
                <p>{link.handle}<small>{link.note}</small></p>
                <ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" />
              </a>
            ))}
          </div>
          {about.contactEmail && (
            <a className={styles.email} href={`mailto:${about.contactEmail}`}><Mail size={18} aria-hidden="true" /> {about.contactEmail}</a>
          )}
        </section>
      </Reveal>
    </main>
  );
}
