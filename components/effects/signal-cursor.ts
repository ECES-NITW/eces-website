// Custom cursor for mouse and trackpad users: a dot pinned to the pointer, a ring that follows
// with a smooth glowing trail and opens into a probe reticle over links and buttons, a "ping" on
// click, and a gentle pull on the main call-to-action buttons. Text fields keep the native cursor.

type CursorElements = { canvas: HTMLCanvasElement; dot: HTMLElement; ring: HTMLElement };
type CursorClasses = { visible: string; active: string; pressed: string; text: string };
type Magnet = { el: HTMLElement; x: number; y: number; tx: number; ty: number };
type Ping = { x: number; y: number; age: number };

const INTERACTIVE = "a[href], button, [role='button'], summary, label[for], select, [data-cursor]";
const TEXT_FIELD = "input:not([type='checkbox']):not([type='radio']):not([type='button']):not([type='submit']), textarea, [contenteditable='true']";
const MAGNETIC = ".action-primary, .nav-cta, .home-event-cta, [data-magnetic]";
const TRAIL_POINTS = 14;
const PING_LIFE = 0.55;
const ROOT_CLASS = "eces-cursor";

export function startSignalCursor({ canvas, dot, ring }: CursorElements, classes: CursorClasses): () => void {
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  const ctx = context;
  const root = document.documentElement;
  root.classList.add(ROOT_CLASS);

  let width = 0, height = 0, raf = 0, last = 0;
  let visible = false;
  const pointer = { x: -100, y: -100 };
  const ringPos = { x: -100, y: -100 };
  const trail = Array.from({ length: TRAIL_POINTS }, () => ({ x: -100, y: -100 }));
  const pings: Ping[] = [];
  const magnets: Magnet[] = [];

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const place = (el: HTMLElement, x: number, y: number) => {
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const drawTrail = () => {
    // Tapered ribbon through the midpoints of the chain, so it bends smoothly.
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 1; i < trail.length - 1; i++) {
        const fade = 1 - i / trail.length;
        const a = trail[i - 1], b = trail[i], c = trail[i + 1];
        const start = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const end = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(b.x, b.y, end.x, end.y);
        if (pass === 0) {
          ctx.strokeStyle = `rgba(75, 164, 255, ${0.16 * fade})`;
          ctx.lineWidth = 9 * fade + 2;
        } else {
          ctx.strokeStyle = `rgba(178, 236, 255, ${0.75 * fade})`;
          ctx.lineWidth = 2.6 * fade + 0.4;
        }
        ctx.lineCap = "round";
        ctx.stroke();
      }
    }
  };

  const drawPings = (dt: number) => {
    for (let i = pings.length - 1; i >= 0; i--) {
      const ping = pings[i];
      ping.age += dt;
      if (ping.age > PING_LIFE) { pings.splice(i, 1); continue; }
      const t = ping.age / PING_LIFE;
      const eased = 1 - (1 - t) ** 3;
      ctx.strokeStyle = `rgba(160, 232, 255, ${0.8 * (1 - t)})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(ping.x, ping.y, 6 + eased * 34, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = `rgba(160, 232, 255, ${0.35 * (1 - t)})`;
      ctx.beginPath(); ctx.arc(ping.x, ping.y, 4 + eased * 20, 0, Math.PI * 2); ctx.stroke();
    }
  };

  const moveMagnets = (dt: number) => {
    const ease = 1 - Math.exp(-dt * 14);
    for (let i = magnets.length - 1; i >= 0; i--) {
      const magnet = magnets[i];
      magnet.x += (magnet.tx - magnet.x) * ease;
      magnet.y += (magnet.ty - magnet.y) * ease;
      const settled = Math.abs(magnet.tx - magnet.x) < 0.05 && Math.abs(magnet.ty - magnet.y) < 0.05;
      if (settled && magnet.tx === 0 && magnet.ty === 0) {
        magnet.el.style.translate = "";
        magnets.splice(i, 1);
      } else {
        // `translate` composes with the element's own hover transform.
        magnet.el.style.translate = `${magnet.x.toFixed(2)}px ${magnet.y.toFixed(2)}px`;
      }
    }
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;

    const ringEase = 1 - Math.exp(-dt * 16);
    ringPos.x += (pointer.x - ringPos.x) * ringEase;
    ringPos.y += (pointer.y - ringPos.y) * ringEase;
    place(ring, ringPos.x, ringPos.y);

    const headEase = 1 - Math.exp(-dt * 40);
    const chainEase = 1 - Math.exp(-dt * 30);
    trail[0].x += (pointer.x - trail[0].x) * headEase;
    trail[0].y += (pointer.y - trail[0].y) * headEase;
    for (let i = 1; i < trail.length; i++) {
      trail[i].x += (trail[i - 1].x - trail[i].x) * chainEase;
      trail[i].y += (trail[i - 1].y - trail[i].y) * chainEase;
    }

    ctx.clearRect(0, 0, width, height);
    if (visible) drawTrail();
    drawPings(dt);
    moveMagnets(dt);

    const tail = trail[trail.length - 1];
    const settled = Math.hypot(pointer.x - ringPos.x, pointer.y - ringPos.y) < 0.2
      && Math.hypot(pointer.x - tail.x, pointer.y - tail.y) < 0.2
      && pings.length === 0 && magnets.length === 0;
    // Stop the loop once everything has caught up; the next pointer move restarts it.
    if (!settled && !document.hidden) raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, width, height);
  };

  const start = () => {
    if (raf || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const updateMagnet = (target: Element | null, x: number, y: number) => {
    const el = target?.closest<HTMLElement>(MAGNETIC) ?? null;
    for (const magnet of magnets) if (magnet.el !== el) { magnet.tx = 0; magnet.ty = 0; }
    if (!el) return;
    let magnet = magnets.find(item => item.el === el);
    if (!magnet) { magnet = { el, x: 0, y: 0, tx: 0, ty: 0 }; magnets.push(magnet); }
    const box = el.getBoundingClientRect();
    // Measure from the element's resting position, not its current pulled one.
    const cx = box.left + box.width / 2 - magnet.x;
    const cy = box.top + box.height / 2 - magnet.y;
    magnet.tx = Math.max(-8, Math.min(8, (x - cx) * 0.18));
    magnet.ty = Math.max(-6, Math.min(6, (y - cy) * 0.28));
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (!visible) {
      visible = true;
      ringPos.x = pointer.x; ringPos.y = pointer.y;
      for (const point of trail) { point.x = pointer.x; point.y = pointer.y; }
      dot.classList.add(classes.visible);
      ring.classList.add(classes.visible);
    }
    place(dot, pointer.x, pointer.y);
    const target = event.target instanceof Element ? event.target : null;
    const overText = !!target?.closest(TEXT_FIELD);
    ring.classList.toggle(classes.text, overText);
    dot.classList.toggle(classes.text, overText);
    ring.classList.toggle(classes.active, !overText && !!target?.closest(INTERACTIVE));
    updateMagnet(target, pointer.x, pointer.y);
    start();
  };
  const onDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    ring.classList.add(classes.pressed);
    pings.push({ x: event.clientX, y: event.clientY, age: 0 });
    start();
  };
  const onUp = () => ring.classList.remove(classes.pressed);
  const onLeave = () => {
    visible = false;
    dot.classList.remove(classes.visible);
    ring.classList.remove(classes.visible);
    for (const magnet of magnets) { magnet.tx = 0; magnet.ty = 0; }
    start();
  };
  const onVisibility = () => (document.hidden ? (cancelAnimationFrame(raf), (raf = 0)) : start());

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  window.addEventListener("blur", onLeave);
  root.addEventListener("pointerleave", onLeave);
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    cancelAnimationFrame(raf);
    root.classList.remove(ROOT_CLASS);
    for (const magnet of magnets) magnet.el.style.translate = "";
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("blur", onLeave);
    root.removeEventListener("pointerleave", onLeave);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
