// Full-page circuit-board background: faint PCB traces with pads and vias, signal pulses that
// travel along them, and a soft spotlight that lights up the board around the pointer.
// Plain canvas 2D, drawn behind all content. Static board layers are pre-rendered once per size.

type Point = { x: number; y: number };
type Trace = { points: Point[]; lengths: number[]; total: number };
type Pulse = { trace: Trace; reverse: boolean; distance: number; speed: number; wait: number };
type Flash = { x: number; y: number; age: number };

const CELL = 30;
// Eight directions; even indexes are horizontal/vertical, odd ones are the 45° diagonals.
const DIRECTIONS: readonly (readonly [number, number])[] = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const SPOT_RADIUS = 250;
const TAIL = 80;
const FLASH_LIFE = 0.7;

const random = (min: number, max: number) => min + Math.random() * (max - min);
const randomInt = (max: number) => Math.floor(Math.random() * max);

/** Random-walk traces on a grid: mostly straight runs with occasional 45° bends, never overlapping. */
function buildTraces(width: number, height: number): Trace[] {
  const cols = Math.ceil(width / CELL) + 1;
  const rows = Math.ceil(height / CELL) + 1;
  const used = new Uint8Array(cols * rows);
  const traces: Trace[] = [];
  const target = Math.max(14, Math.round((width * height) / 24000));

  for (let attempt = 0; traces.length < target && attempt < target * 14; attempt++) {
    let col = randomInt(cols);
    let row = randomInt(rows);
    if (used[row * cols + col]) continue;
    let direction = Math.random() < 0.72 ? randomInt(4) * 2 : randomInt(4) * 2 + 1;
    const cells: [number, number][] = [[col, row]];
    const taken = new Set([row * cols + col]);
    const length = 5 + randomInt(17);

    for (let step = 0; step < length; step++) {
      if (step > 1 && Math.random() < 0.2) direction = (direction + (Math.random() < 0.5 ? 1 : 7)) % 8;
      const [dx, dy] = DIRECTIONS[direction];
      const nextCol = col + dx;
      const nextRow = row + dy;
      const index = nextRow * cols + nextCol;
      if (nextCol < 0 || nextRow < 0 || nextCol >= cols || nextRow >= rows || used[index] || taken.has(index)) break;
      col = nextCol;
      row = nextRow;
      cells.push([col, row]);
      taken.add(index);
    }
    if (cells.length < 4) continue;
    taken.forEach(index => { used[index] = 1; });

    const points = cells.map(([c, r]) => ({ x: c * CELL + CELL / 2, y: r * CELL + CELL / 2 }));
    const lengths = [0];
    for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
    traces.push({ points, lengths, total: lengths[lengths.length - 1] });
  }
  return traces;
}

function pointAt(trace: Trace, distance: number): Point {
  const { points, lengths } = trace;
  const d = Math.max(0, Math.min(trace.total, distance));
  let i = 1;
  while (i < lengths.length - 1 && lengths[i] < d) i++;
  const span = lengths[i] - lengths[i - 1] || 1;
  const t = (d - lengths[i - 1]) / span;
  return { x: points[i - 1].x + (points[i].x - points[i - 1].x) * t, y: points[i - 1].y + (points[i].y - points[i - 1].y) * t };
}

/** The part of a trace between two distances, as a polyline. */
function slice(trace: Trace, from: number, to: number): Point[] {
  const result = [pointAt(trace, from)];
  for (let i = 1; i < trace.points.length - 1; i++) if (trace.lengths[i] > from && trace.lengths[i] < to) result.push(trace.points[i]);
  result.push(pointAt(trace, to));
  return result;
}

type BoardStyle = { trace: string; pad: string; width: number; grid?: string };

function drawBoard(ctx: CanvasRenderingContext2D, traces: Trace[], width: number, height: number, style: BoardStyle) {
  if (style.grid) {
    ctx.fillStyle = style.grid;
    for (let x = CELL / 2; x < width; x += CELL) for (let y = CELL / 2; y < height; y += CELL) ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
  }
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = style.width;
  ctx.strokeStyle = style.trace;
  for (const trace of traces) {
    ctx.beginPath();
    trace.points.forEach((point, i) => (i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)));
    ctx.stroke();
  }
  ctx.fillStyle = style.pad;
  ctx.strokeStyle = style.pad;
  ctx.lineWidth = 1.1;
  for (const trace of traces) {
    const start = trace.points[0];
    const end = trace.points[trace.points.length - 1];
    ctx.fillRect(start.x - 3, start.y - 3, 6, 6); // square pad
    ctx.beginPath(); ctx.arc(end.x, end.y, 3.6, 0, Math.PI * 2); ctx.stroke(); // via ring
    ctx.beginPath(); ctx.arc(end.x, end.y, 1.2, 0, Math.PI * 2); ctx.fill();
  }
}

export function startCircuitField(canvas: HTMLCanvasElement): () => void {
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  const ctx = context;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const dim = document.createElement("canvas");
  const bright = document.createElement("canvas");
  const spot = document.createElement("canvas");
  let width = 0, height = 0, boardHeight = 0, dpr = 1;
  let traces: Trace[] = [];
  let pulses: Pulse[] = [];
  const flashes: Flash[] = [];
  const pointer = { x: 0, y: 0, active: false };
  const light = { x: 0, y: 0, strength: 0 };
  let raf = 0, last = 0, resizeTimer = 0;

  const spawn = (pulse?: Pulse): Pulse => {
    const options = traces.filter(trace => trace.total > 140);
    const trace = (options.length ? options : traces)[randomInt(options.length || traces.length)];
    const next = pulse ?? ({} as Pulse);
    next.trace = trace;
    next.reverse = Math.random() < 0.5;
    next.distance = 0;
    next.speed = random(120, 210);
    next.wait = pulse ? random(0.3, 2.4) : random(0, 3);
    return next;
  };

  const build = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    // Build a little taller than the viewport so mobile URL-bar resizes don't regenerate the board.
    boardHeight = height + 140;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    traces = buildTraces(width, boardHeight);
    for (const [layer, style] of [
      [dim, { trace: "rgba(76, 146, 238, .14)", pad: "rgba(110, 182, 255, .24)", width: 1 }],
      [bright, { trace: "rgba(132, 212, 255, .62)", pad: "rgba(170, 232, 255, .9)", width: 1.25, grid: "rgba(144, 210, 255, .42)" }],
    ] as const) {
      layer.width = Math.round(width * dpr);
      layer.height = Math.round(boardHeight * dpr);
      const layerCtx = layer.getContext("2d");
      if (!layerCtx) continue;
      layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawBoard(layerCtx, traces, width, boardHeight, style);
    }
    spot.width = spot.height = Math.round(SPOT_RADIUS * 2 * dpr);
    const count = Math.round(Math.min(18, Math.max(6, traces.length * 0.3)) * (finePointer ? 1 : 0.6));
    pulses = Array.from({ length: count }, () => spawn());
    if (!light.strength) { light.x = width * 0.68; light.y = height * 0.36; }
  };

  const drawAmbient = () => {
    // A soft blue glow behind the hero, nudged toward the pointer.
    const cx = width * 0.67 + (light.x - width * 0.67) * 0.08;
    const cy = height * 0.38 + (light.y - height * 0.38) * 0.08;
    const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.7);
    glow.addColorStop(0, "rgba(16, 87, 170, .24)");
    glow.addColorStop(0.45, "rgba(3, 30, 72, .12)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  };

  const drawSpotlight = () => {
    if (light.strength < 0.01) return;
    const spotCtx = spot.getContext("2d");
    if (!spotCtx) return;
    const size = SPOT_RADIUS * 2;
    const left = light.x - SPOT_RADIUS;
    const top = light.y - SPOT_RADIUS;
    spotCtx.globalCompositeOperation = "copy";
    spotCtx.drawImage(bright, left * dpr, top * dpr, size * dpr, size * dpr, 0, 0, spot.width, spot.height);
    spotCtx.globalCompositeOperation = "destination-in";
    const mask = spotCtx.createRadialGradient(spot.width / 2, spot.height / 2, 0, spot.width / 2, spot.height / 2, spot.width / 2);
    mask.addColorStop(0, `rgba(0, 0, 0, ${0.9 * light.strength})`);
    mask.addColorStop(0.55, `rgba(0, 0, 0, ${0.35 * light.strength})`);
    mask.addColorStop(1, "rgba(0, 0, 0, 0)");
    spotCtx.fillStyle = mask;
    spotCtx.fillRect(0, 0, spot.width, spot.height);
    spotCtx.globalCompositeOperation = "source-over";
    ctx.drawImage(spot, left, top, size, size);
  };

  const drawPulses = (dt: number) => {
    for (const pulse of pulses) {
      if (pulse.wait > 0) { pulse.wait -= dt; continue; }
      pulse.distance += pulse.speed * dt;
      const { trace } = pulse;
      const along = (d: number) => (pulse.reverse ? trace.total - d : d);
      if (pulse.distance >= trace.total + TAIL) {
        const end = pulse.reverse ? trace.points[0] : trace.points[trace.points.length - 1];
        flashes.push({ x: end.x, y: end.y, age: 0 });
        spawn(pulse);
        continue;
      }
      const headDistance = Math.min(pulse.distance, trace.total);
      const tailDistance = Math.max(0, pulse.distance - TAIL);
      const from = Math.min(along(tailDistance), along(headDistance));
      const to = Math.max(along(tailDistance), along(headDistance));
      if (to - from > 1) {
        const path = slice(trace, from, to);
        const head = pointAt(trace, along(headDistance));
        const tail = pointAt(trace, along(tailDistance));
        const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        gradient.addColorStop(0, "rgba(120, 205, 255, 0)");
        gradient.addColorStop(1, "rgba(170, 236, 255, .85)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        path.forEach((point, i) => (i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)));
        ctx.stroke();
      }
      if (pulse.distance <= trace.total) {
        const head = pointAt(trace, along(headDistance));
        const halo = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 11);
        halo.addColorStop(0, "rgba(190, 242, 255, .75)");
        halo.addColorStop(1, "rgba(90, 180, 255, 0)");
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); ctx.fill();
      }
    }
    for (let i = flashes.length - 1; i >= 0; i--) {
      const flash = flashes[i];
      flash.age += dt;
      if (flash.age > FLASH_LIFE) { flashes.splice(i, 1); continue; }
      const t = flash.age / FLASH_LIFE;
      ctx.strokeStyle = `rgba(160, 230, 255, ${0.7 * (1 - t)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(flash.x, flash.y, 4 + t * 14, 0, Math.PI * 2); ctx.stroke();
    }
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    // Ease the spotlight toward the pointer and fade it in or out.
    const follow = 1 - Math.exp(-dt * 9);
    light.x += (pointer.x - light.x) * follow;
    light.y += (pointer.y - light.y) * follow;
    light.strength += ((pointer.active ? 1 : 0) - light.strength) * (1 - Math.exp(-dt * 4));

    ctx.clearRect(0, 0, width, height);
    drawAmbient();
    ctx.drawImage(dim, 0, 0, width, boardHeight);
    drawSpotlight();
    drawPulses(dt);
    if (!document.hidden) raf = requestAnimationFrame(frame);
  };

  const renderStatic = () => {
    ctx.clearRect(0, 0, width, height);
    drawAmbient();
    ctx.drawImage(dim, 0, 0, width, boardHeight);
  };

  const start = () => {
    if (raf || reduced || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      // Mobile URL bars change the height while scrolling; only rebuild for real size changes.
      if (window.innerWidth === width && window.innerHeight <= boardHeight) {
        height = window.innerHeight;
        canvas.height = Math.round(height * dpr);
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      } else build();
      if (reduced) renderStatic();
    }, 150);
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (!pointer.active && light.strength < 0.02) { light.x = pointer.x; light.y = pointer.y; }
    pointer.active = true;
  };
  const onLeave = () => { pointer.active = false; };
  const onVisibility = () => (document.hidden ? (cancelAnimationFrame(raf), (raf = 0)) : start());

  build();
  renderStatic();
  start();
  window.addEventListener("resize", onResize);
  if (finePointer && !reduced) {
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
  }
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
