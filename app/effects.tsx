"use client";

import { useEffect, useRef, useState } from "react";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function PixelMagnet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let raf = 0;
    let x = -100, y = -100, tx = -100, ty = -100;
    let visible = false;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; visible = true; };
    const leave = () => { visible = false; };
    const draw = () => {
      x += (tx - x) * .16;
      y += (ty - y) * .16;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (visible) {
        for (let i = 0; i < 26; i++) {
          const angle = i * 2.39996 + frame * .008;
          const radius = 9 + Math.sqrt(i) * 9;
          const px = Math.round((x + Math.cos(angle) * radius) / 6) * 6;
          const py = Math.round((y + Math.sin(angle) * radius) / 6) * 6;
          ctx.fillStyle = `rgba(67, 150, 255, ${.55 * (1 - i / 30)})`;
          ctx.fillRect(px, py, i % 6 === 0 ? 5 : 3, i % 6 === 0 ? 5 : 3);
        }
      }
      frame++;
      raf = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); };
  }, [reduced]);
  return <canvas ref={canvasRef} className="pixel-magnet" aria-hidden="true" />;
}

export function NeuralFlash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let tick = 0;
    let width = 0, height = 0;
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width; height = box.height;
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const branch = (startX: number, startY: number, angle: number, length: number, depth: number, phase: number) => {
      const segments = 8;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      let x = startX, y = startY;
      for (let j = 1; j <= segments; j++) {
        const wobble = Math.sin(j * 3.8 + phase + depth) * 8;
        x = startX + Math.cos(angle) * length * j / segments + Math.cos(angle + Math.PI / 2) * wobble;
        y = startY + Math.sin(angle) * length * j / segments + Math.sin(angle + Math.PI / 2) * wobble;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = depth === 0 ? "rgba(63,141,255,.9)" : "rgba(51,112,231,.5)";
      ctx.lineWidth = depth === 0 ? 1.4 : .65;
      ctx.shadowBlur = depth === 0 ? 15 : 7;
      ctx.shadowColor = "#226eff";
      ctx.stroke();
      if (depth < 2) branch(x, y, angle + (depth % 2 ? -.72 : .64), length * .42, depth + 1, phase);
    };
    const render = () => {
      tick += reduced ? 0 : .012;
      ctx.clearRect(0, 0, width, height);
      const cx = width * .53, cy = height * .47;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * .52);
      glow.addColorStop(0, "rgba(22,81,193,.36)"); glow.addColorStop(.5, "rgba(4,30,96,.13)"); glow.addColorStop(1, "rgba(4,15,32,0)");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < 12; i++) {
        const angle = i * Math.PI / 6 + Math.sin(tick + i) * .1;
        const radius = Math.min(width, height) * (.18 + .04 * Math.sin(i * 3.1));
        branch(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, angle, Math.min(width, height) * .31, 0, tick * 4 + i);
      }
      if (!reduced) raf = requestAnimationFrame(render);
    };
    resize(); render();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [reduced]);
  return <canvas ref={canvasRef} className="neural-flash" aria-hidden="true" />;
}

export function ParticleImage({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = new Image();
    image.src = src;
    let raf = 0;
    let hovering = false;
    let particles: { x: number; y: number; ox: number; oy: number; vx: number; vy: number; r: number; g: number; b: number; a: number }[] = [];
    const size = 285;
    canvas.width = size * 2; canvas.height = size * 2;
    canvas.style.width = `${size}px`; canvas.style.height = `${size}px`;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    image.onload = () => {
      const off = document.createElement("canvas"); off.width = size; off.height = size;
      const o = off.getContext("2d"); if (!o) return;
      o.drawImage(image, 0, 6, size, size - 12);
      const data = o.getImageData(0, 0, size, size).data;
      for (let y = 0; y < size; y += 4) for (let x = 0; x < size; x += 4) {
        const k = (y * size + x) * 4;
        if (data[k + 3] > 90) particles.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, r: data[k], g: data[k + 1], b: data[k + 2], a: data[k + 3] / 255 });
      }
      canvas.style.opacity = "1";
      const draw = () => {
        ctx.clearRect(0, 0, size, size);
        for (const p of particles) {
          if (hovering) { p.vx += (Math.random() - .5) * .6; p.vy += (Math.random() - .5) * .6; }
          p.vx += (p.ox - p.x) * .025; p.vy += (p.oy - p.y) * .025;
          p.vx *= .87; p.vy *= .87; p.x += p.vx; p.y += p.vy;
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.a})`;
          ctx.fillRect(p.x, p.y, 4.5, 4.5);
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
    };
    const enter = () => { hovering = true; };
    const leave = () => { hovering = false; };
    canvas.addEventListener("pointerenter", enter); canvas.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener("pointerenter", enter); canvas.removeEventListener("pointerleave", leave); };
  }, [src, reduced]);
  return <div className="particle-image"><img src={src} alt={alt} className="particle-fallback" /><canvas ref={canvasRef} aria-hidden="true" /></div>;
}

const galleryItems = [
  { title: "Circuit design", subtitle: "From ideas to hardware", kind: "circuit" },
  { title: "Signal processing", subtitle: "Making sense of waves", kind: "signal" },
  { title: "Communication", subtitle: "Connecting what comes next", kind: "orbit" },
  { title: "Embedded systems", subtitle: "Intelligence in every device", kind: "chip" },
  { title: "Research culture", subtitle: "Questions into experiments", kind: "nodes" },
];

export function InfiniteGallery() {
  const [position, setPosition] = useState(0);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const cardWidth = 270;
  const offset = ((position % galleryItems.length) + galleryItems.length) % galleryItems.length;
  return <div className="gallery-wrap">
    <div className="gallery-toolbar"><span>Drag to explore</span><div><button aria-label="Previous gallery image" onClick={() => setPosition(v => v - 1)}>←</button><button aria-label="Next gallery image" onClick={() => setPosition(v => v + 1)}>→</button></div></div>
    <div className="infinite-gallery" role="region" aria-label="ECE fields gallery" onPointerDown={e => { drag.current = { x: e.clientX, start: position }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={e => { if (!drag.current) return; const dx = e.clientX - drag.current.x; setPosition(drag.current.start - Math.round(dx / (cardWidth * .62))); drag.current = null; }}>
      {Array.from({ length: 7 }, (_, i) => {
        const relative = i - 3;
        const item = galleryItems[(Math.round(offset) + relative + galleryItems.length * 3) % galleryItems.length];
        return <article key={`${item.kind}-${relative}`} className={`gallery-card art-${item.kind}`} style={{ transform: `translateX(calc(-50% + ${relative * cardWidth}px)) translateZ(${-Math.abs(relative) * 65}px) rotateY(${-relative * 13}deg)`, zIndex: 10 - Math.abs(relative), opacity: Math.abs(relative) > 2 ? .4 : 1 }}>
          <div className="gallery-art" aria-hidden="true"><div className="art-core" /></div>
          <div className="gallery-caption"><span>{item.subtitle}</span><h3>{item.title}</h3></div>
        </article>;
      })}
    </div>
  </div>;
}
