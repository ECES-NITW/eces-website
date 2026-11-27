"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { about } from "@/lib/about";
import styles from "./about-section.module.css";

function scrollToAbout() {
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("about")?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

/**
 * The homepage About block. The description is always visible; "More about ECES" opens the rest
 * like a dropdown. It also opens when a visitor arrives at /#about or clicks an About link.
 * Render it inside a grid container: its head and body sit side by side, the panel spans the row.
 */
export function AboutSection({ kicker }: { kicker: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  // True when the panel was opened by an About link: it opens without animating so the page is
  // already full height when we scroll the section into view.
  const [instant, setInstant] = useState(false);
  const reduceMotion = useReducedMotion();
  const panelId = useId();
  // Set when an About link opened the panel: scroll once the panel has its full height. Scrolling
  // earlier stops short, because the page is not tall enough yet (the browser's own jump to #about
  // on load has the same problem).
  const scrollWhenOpen = useRef(false);
  const panel = useRef<HTMLDivElement>(null);
  const isOpen = useRef(open);
  useEffect(() => {
    isOpen.current = open;
  }, [open]);

  useEffect(() => {
    const showAbout = () => {
      if (isOpen.current) {
        requestAnimationFrame(scrollToAbout);
        return;
      }
      scrollWhenOpen.current = true;
      setInstant(true);
      setOpen(true);
    };
    const openForHash = () => {
      if (window.location.hash === "#about") showAbout();
    };
    // Clicking "About" again while already at #about fires no hashchange, so watch the click too.
    const openForLink = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a[href$='#about']")) showAbout();
    };
    // Scroll once the panel has actually grown to its full height.
    const resize = new ResizeObserver(entries => {
      if (scrollWhenOpen.current && entries.some(entry => entry.contentRect.height > 0)) {
        scrollWhenOpen.current = false;
        requestAnimationFrame(scrollToAbout);
      }
    });
    if (panel.current) resize.observe(panel.current);
    const frame = requestAnimationFrame(openForHash);
    window.addEventListener("hashchange", openForHash);
    document.addEventListener("click", openForLink);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", openForHash);
      document.removeEventListener("click", openForLink);
    };
  }, []);

  return (
    <>
      <div className={styles.head}>
        {kicker}
        <h2 id="about-title">{about.heading.first}<br /><em>{about.heading.second}</em></h2>
      </div>

      <div className={styles.body}>
        <p className={styles.summary}>{about.summary}</p>
        <ul className={styles.highlights} aria-label="ECES at a glance">
          {about.highlights.map(point => <li key={point}>{point}</li>)}
        </ul>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            setInstant(false);
            setOpen(value => !value);
          }}
        >
          {open ? "Show less" : "More about ECES"}
          <ChevronDown size={18} aria-hidden="true" className={open ? styles.chevronOpen : styles.chevron} />
        </button>
      </div>

      <motion.div
        id={panelId}
        className={styles.panel}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduceMotion || instant ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        ref={panel}
        inert={!open}
      >
        <div className={styles.part}>
          <h3>Who we are</h3>
          <div className={styles.whoWeAre}>{about.whoWeAre.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
        <div className={styles.part}>
          <h3>What we do</h3>
          <ol className={styles.pillars}>
            {about.pillars.map((pillar, index) => (
              <li key={pillar.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{pillar.title}</strong>
                <p>{pillar.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </>
  );
}
