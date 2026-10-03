"use client";

import { useEffect, useRef } from "react";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const ctx = context;
    const reduced = prefersReducedMotion();
    let width = 0, height = 0, raf = 0, time = 0;
    let pointerX = .7, pointerY = .35;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = innerWidth; height = innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (event: PointerEvent) => { pointerX = event.clientX / width; pointerY = event.clientY / height; };
    const drawBranch = (sx: number, sy: number, angle: number, length: number, depth: number, seed: number) => {
      let x = sx, y = sy;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let step = 0; step < 11; step++) {
        const wobble = Math.sin(step * 2.3 + seed * 8 + time * .7) * (3 + depth * 2);
        x += Math.cos(angle) * length / 11 + Math.cos(angle + Math.PI / 2) * wobble;
        y += Math.sin(angle) * length / 11 + Math.sin(angle + Math.PI / 2) * wobble;
        ctx.lineTo(x, y);
      }
      ctx.lineWidth = depth === 0 ? 1.25 : .65;
      ctx.strokeStyle = depth === 0 ? "rgba(85,165,255,.19)" : "rgba(80,150,242,.12)";
      ctx.shadowColor = "#498efc"; ctx.shadowBlur = depth === 0 ? 17 : 8;
      ctx.stroke();
      if (depth < 1) drawBranch(x, y, angle + (seed % 2 ? -.8 : .75), length * .35, depth + 1, seed + 2);
    };
    const render = () => {
      time += reduced ? 0 : .009;
      ctx.clearRect(0, 0, width, height);
      const cx = width * (.67 + (pointerX - .5) * .035), cy = height * (.38 + (pointerY - .5) * .03);
      const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * .68);
      gradient.addColorStop(0, "rgba(16,87,170,.22)"); gradient.addColorStop(.45, "rgba(3,30,72,.12)"); gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < 15; i++) {
        const angle = i * Math.PI * 2 / 15 + Math.sin(time + i) * .04;
        drawBranch(cx + Math.cos(angle) * 90, cy + Math.sin(angle) * 90, angle, Math.max(width, height) * .42, 0, i);
      }
      if (!reduced) raf = requestAnimationFrame(render);
    };
    resize(); render();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, []);
  return <canvas className="neural-background" ref={canvasRef} aria-hidden="true" />;
}

export function CursorTail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const ctx = context;
    let width = 0, height = 0, raf = 0;
    let last = { x: -100, y: -100 };
    const points: { x: number; y: number; age: number }[] = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = innerWidth; height = innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (event: PointerEvent) => { last = { x: event.clientX, y: event.clientY }; points.push({ ...last, age: 0 }); if (points.length > 34) points.shift(); };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const point of points) point.age++;
      while (points.length && points[0].age > 33) points.shift();
      if (points.length > 1) {
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1], b = points[i];
          const alpha = Math.max(0, 1 - Math.max(a.age, b.age) / 33) * (i / points.length);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(104,207,255,${alpha * .72})`;
          ctx.lineWidth = Math.max(.6, 4 * i / points.length);
          ctx.lineCap = "round"; ctx.shadowColor = "#60bafa"; ctx.shadowBlur = 13; ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }
      if (points.length) {
        const dot = ctx.createRadialGradient(last.x, last.y, 0, last.x, last.y, 9);
        dot.addColorStop(0, "rgba(215,246,255,.9)"); dot.addColorStop(1, "rgba(90,185,255,0)");
        ctx.fillStyle = dot; ctx.beginPath(); ctx.arc(last.x, last.y, 9, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize", resize); window.addEventListener("pointermove", move);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, []);
  return <canvas className="cursor-tail" ref={canvasRef} aria-hidden="true" />;
}

