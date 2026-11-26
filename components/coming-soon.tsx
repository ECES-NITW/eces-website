import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getSection, siteSections, type SiteSectionId } from "@/lib/site-sections";
import styles from "./coming-soon.module.css";

type ComingSoonProps = {
  section: SiteSectionId;
  /** Short lines describing what the finished page will hold. */
  plans?: readonly string[];
};

/** Placeholder for a section whose page is still being built. Replace it with the real page. */
export function ComingSoon({ section, plans = [] }: ComingSoonProps) {
  const { title, blurb } = getSection(section);
  const number = String(siteSections.findIndex(item => item.id === section)).padStart(2, "0");

  return (
    <main className={styles.page}>
      {/* Plain links: next/link client navigation is broken with vinext 1.0.0-beta.5 (see site-shell.tsx). */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- next/link navigation is broken in this vinext version */}
      <a className={styles.back} href="/"><ArrowLeft size={16} aria-hidden="true" /> Back to home</a>
      <header className={styles.heading}>
        <p className={styles.kicker}><span>{number}</span> ECE Society <span className={styles.tag}>Coming soon</span></p>
        <h1>{title}</h1>
        <p className={styles.blurb}>{blurb}</p>
      </header>
      {plans.length > 0 && (
        <section className={styles.plans} aria-labelledby="plans-title">
          <h2 id="plans-title">What you&apos;ll find here</h2>
          <ol>
            {plans.map((plan, index) => (
              <li key={plan}><span>{String(index + 1).padStart(2, "0")}</span>{plan}</li>
            ))}
          </ol>
        </section>
      )}
      <div className={styles.actions}>
        <p>This page is being built by the society team. Until then, see what&apos;s on.</p>
        <a className={styles.cta} href="/events">Explore events <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </main>
  );
}
