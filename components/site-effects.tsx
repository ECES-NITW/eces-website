"use client";

import { useEffect, useRef } from "react";
import { startCircuitField } from "./effects/circuit-field";
import { startSignalCursor } from "./effects/signal-cursor";
import styles from "./site-effects.module.css";

/** Full-page circuit-board background with travelling signal pulses. */
export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    return canvas ? startCircuitField(canvas) : undefined;
  }, []);
  return <canvas className="neural-background" ref={canvasRef} aria-hidden="true" />;
}

/** Custom cursor for mouse and trackpad users; touch and reduced-motion users keep the native cursor. */
export function CursorTail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current, dot = dotRef.current, ring = ringRef.current;
    if (!canvas || !dot || !ring) return;
    const canHover = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;
    return startSignalCursor({ canvas, dot, ring }, { visible: styles.visible, active: styles.active, pressed: styles.pressed, text: styles.text });
  }, []);
  return <>
    <canvas className="cursor-tail" ref={canvasRef} aria-hidden="true" />
    <div className={styles.ring} ref={ringRef} aria-hidden="true"><span className={styles.ringCircle} /><span className={styles.reticle} /></div>
    <div className={styles.dot} ref={dotRef} aria-hidden="true" />
  </>;
}
