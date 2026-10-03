"use client";

import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { CursorTail, NeuralBackground } from "./site-effects";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <>
    <NeuralBackground />
    <CursorTail />
    <div className="site-stage">
      <header className="main-header">
        <a className="wordmark" href="/" aria-label="ECE Society home" onClick={() => setOpen(false)}>
          <img src="/ece-logo.png" alt="" />
          <span><strong>ECE Society</strong><small>NIT Warangal</small></span>
        </a>
        <nav className={open ? "main-nav open" : "main-nav"} aria-label="Main navigation">
          <a href="/#explore" onClick={() => setOpen(false)}>Explore</a>
          <a href="/#community" onClick={() => setOpen(false)}>Community</a>
          <a href="/events" onClick={() => setOpen(false)}>Events</a>
        </nav>
        <a className="nav-cta" href="/events">Register for an event <ArrowUpRight size={16} /></a>
        <button className="nav-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </header>
      {children}
      <footer className="main-footer">
        <a className="footer-logo" href="/"><img src="/ece-logo.png" alt="" /><span>ECE Society<br />NIT Warangal</span></a>
        <p>Ideas move further when we build them together.</p>
        <a href="/events">Explore events <ArrowUpRight size={14} /></a>
      </footer>
    </div>
  </>;
}
