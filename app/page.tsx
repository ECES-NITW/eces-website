"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowRight, Cpu, Menu, X, Zap } from "lucide-react";
import { InfiniteGallery, NeuralFlash, ParticleImage, PixelMagnet } from "./effects";

const updates = [
  { category: "Semiconductors", title: "Next-Generation Semiconductor Technology", summary: "Explore the latest developments shaping the future of semiconductor technology.", detail: "A closer look at how advances in materials, fabrication, and chip architecture are changing the devices we rely on." },
  { category: "5G/6G", title: "The Future of 5G and 6G Connectivity", summary: "Discover how next-generation networks are transforming connected technologies.", detail: "From faster links to more responsive systems, communication research is opening new possibilities for connected devices." },
  { category: "AI + Hardware", title: "AI Meets the Next Generation of Hardware", summary: "Explore emerging technologies where AI meets electronics and hardware.", detail: "Efficient hardware and intelligent algorithms are converging to make powerful computation possible closer to the edge." },
];

const achievements = [
  { category: "Student Projects", title: "Innovative Projects & Prototypes", text: "Explore projects and innovations developed by ECE students." },
  { category: "Student Achievements", title: "Recognizing Excellence", text: "Celebrating outstanding achievements by ECE students." },
  { category: "Competitions & Hackathons", title: "Competing Beyond the Classroom", text: "Highlights from competitions, hackathons, and technical events." },
];

const events = [
  { type: "Hands-on learning", title: "Technical Workshops", text: "Learn practical skills through focused sessions and demonstrations." },
  { type: "Ideas & exchange", title: "Industry & Research Talks", text: "Hear perspectives from people working across electronics and communication." },
  { type: "Community", title: "ECE Society Events", text: "Connect with peers through society activities and technical gatherings." },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeUpdate, setActiveUpdate] = useState<number | null>(null);
  const closeMenu = () => setMenuOpen(false);
  return <main>
    <PixelMagnet />
    <header className="site-header">
      <a className="brand" href="#home" onClick={closeMenu} aria-label="ECE Society home"><img src="/ece-logo.png" alt="" /><span><strong>ECE SOCIETY</strong><small>NIT WARANGAL</small></span></a>
      <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
        <a href="#updates" onClick={closeMenu}>Tech updates</a><a href="#careers" onClick={closeMenu}>Careers</a><a href="#achievements" onClick={closeMenu}>Achievements</a><a href="#events" onClick={closeMenu}>Events</a><a href="#contact" onClick={closeMenu}>Contact</a>
      </nav>
      <a className="header-action" href="#events">Explore events <ArrowRight size={15} /></a>
      <button className="menu-toggle" type="button" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <section className="hero section-shell" id="home">
      <div className="hero-copy">
        <div className="hero-index"><span className="status-dot" /> A community for what comes next</div>
        <h1>WHERE ELECTRONICS<br /><em>MEETS INNOVATION</em></h1>
        <p>ECE Society at NIT Warangal — connecting students, industry, research, and innovation in electronics and communication.</p>
        <div className="hero-actions"><a className="button button-primary" href="#events">Explore events <ArrowRight size={17} /></a><a className="button button-outline" href="#about">About ECES <ArrowDownRight size={17} /></a></div>
        <div className="hero-rail"><span>Explore the signals shaping tomorrow</span><span className="rail-line" /><span>Scroll to discover ↓</span></div>
      </div>
      <div className="hero-visual" aria-label="ECE Society emblem with electric blue signal effects">
        <NeuralFlash />
        <div className="circuit-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <ParticleImage src="/ece-logo.png" alt="ECE Society eagle logo" />
        <span className="visual-label">ENGINEERING THE FUTURE <Zap size={12} /></span>
      </div>
    </section>

    <section className="about-strip section-shell" id="about"><div className="about-mark"><Cpu size={26} strokeWidth={1.5} /></div><p>Built around curiosity, collaboration, and the craft of turning ideas into working technology.</p><a href="#achievements">See what students are creating <ArrowRight size={16} /></a></section>

    <section className="content-section section-shell" id="updates"><div className="section-heading"><div><h2>LATEST TECH UPDATES</h2><p>Stay updated with the latest breakthroughs in electronics, semiconductors, communication and emerging technologies.</p></div><span className="section-symbol" aria-hidden="true">↗</span></div><div className="updates-grid">{updates.map((item, i) => <article className={`update-card ${activeUpdate === i ? "expanded" : ""}`} key={item.title}><span className="card-category">{item.category}</span><h3>{item.title}</h3><p>{item.summary}</p>{activeUpdate === i && <p className="update-detail">{item.detail}</p>}<button type="button" onClick={() => setActiveUpdate(activeUpdate === i ? null : i)} aria-expanded={activeUpdate === i}>{activeUpdate === i ? "Show less" : "Read more"} <ArrowRight size={14} /></button></article>)}</div></section>

    <section className="content-section career-section section-shell" id="careers"><div className="section-heading"><div><h2>PLACEMENT & CAREER INSIGHTS</h2><p>Explore placement trends, recruiting companies and career opportunities for ECE students.</p></div></div><div className="career-grid"><div><strong>2025–26</strong><span>Academic year</span></div><div><strong>Companies</strong><span>Explore industry pathways</span></div><div><strong>Internships</strong><span>Gain practical experience</span></div></div><p className="section-note">Placement figures and company details can be added when verified information is available.</p></section>

    <section className="content-section section-shell" id="achievements"><div className="section-heading"><div><h2>STUDENT ACHIEVEMENTS</h2><p>Celebrating the achievements, projects, and milestones of ECE students.</p></div></div><div className="achievement-grid">{achievements.map(item => <article className="achievement-card" key={item.title}><span className="card-category">{item.category}</span><h3>{item.title}</h3><p>{item.text}</p><ArrowDownRight className="achievement-arrow" size={20} /></article>)}</div></section>

    <section className="gallery-section" aria-labelledby="gallery-title"><div className="section-shell gallery-intro"><div><h2 id="gallery-title">IDEAS IN MOTION</h2><p>Explore the fields and ideas that bring the ECE community together.</p></div></div><InfiniteGallery /></section>

    <section className="content-section section-shell" id="events"><div className="section-heading"><div><h2>UPCOMING EVENTS</h2><p>Make room for new ideas, practical learning, and conversations that move the field forward.</p></div></div><div className="events-grid">{events.map(item => <article className="event-card" key={item.title}><span className="card-category">{item.type}</span><h3>{item.title}</h3><p>{item.text}</p><span className="event-meta">Dates to be announced</span></article>)}</div></section>

    <section className="cta-section section-shell"><div><span className="card-category">ECE SOCIETY · NIT WARANGAL</span><h2>CURIOUS MINDS.<br />CONNECTED FUTURES.</h2><p>Follow the ideas, projects, and people moving electronics and communication forward.</p></div><a className="button button-primary" href="#contact">Get in touch <ArrowRight size={17} /></a></section>

    <section className="content-section contact-section section-shell" id="contact"><div className="section-heading"><div><h2>GET IN TOUCH</h2><p>Connect with the ECE Society and the department community at NIT Warangal.</p></div></div><div className="contact-grid"><div><span className="card-category">Find us</span><h3>National Institute of Technology Warangal</h3><p>Warangal, Telangana, India</p></div><div><span className="card-category">Stay connected</span><h3>ECE Society</h3><p>Society contact links can be added when confirmed.</p></div></div></section>

    <footer className="site-footer section-shell"><div className="footer-brand"><img src="/ece-logo.png" alt="" /><span>ECE SOCIETY<br /><small>NIT WARANGAL</small></span></div><p>Where electronics meets innovation.</p><a href="#home">Back to top ↑</a></footer>
  </main>;
}
