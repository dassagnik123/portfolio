// Pixel-art effects on one full-screen canvas: the slingshot pebble, the impact flash
// and the bulb's glass shards. Everything snaps to a 2px grid so it reads as pixels.
const GRID = 2;
const snap = (v) => Math.round(v / GRID) * GRID;

const SHARD_COLORS = ["#ffffff", "#fff08a", "#ffd23f", "#f39c1a", "#a8550f"];
const GRAVITY = 0.0016; // px/ms²

export function createFx(canvas) {
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let raf = 0;
  let last = 0;
  let pebble = null;
  let flash = null;
  let shards = [];
  let rockets = [];
  let arrow = null;
  let emitters = []; // charki and tubri: keep throwing sparks for a while

  const spark = (x, y, vx, vy, gravity, life, color, size = 2) =>
    shards.push({ x, y, vx, vy, gravity, drag: 0.985, size, color, life });

  // A soft warm pool of light on whatever's around a burning firework.
  const glow = (at, radius, strength) => {
    const g = ctx.createRadialGradient(at.x, at.y, 0, at.x, at.y, radius);
    g.addColorStop(0, `rgba(255, 210, 90, ${0.38 * strength})`);
    g.addColorStop(0.45, `rgba(255, 150, 60, ${0.14 * strength})`);
    g.addColorStop(1, "rgba(255, 140, 60, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(at.x - radius, at.y - radius, radius * 2, radius * 2);
  };

  const runEmitter = (e, now) => {
    const t = (now - e.born) / e.ms;
    if (t >= 1) return (e.done = true);
    const fade = t > 0.82 ? (1 - t) / 0.18 : Math.min(1, t / 0.08); // flares up, then sputters out
    const at = typeof e.at === "function" ? e.at() : e.at; // the charki moves, so ask where it is
    if (!at) return;
    const hot = () => ["#ffffff", "#fff08a", "#ffd23f", "#ffd23f", "#ff8a3c"][Math.floor(Math.random() * 5)];
    const flicker = 0.85 + Math.random() * 0.3;
    if (e.type === "spinner") {
      glow(at, 70, fade * flicker);
      // A whirling wheel: sparks fly off tangentially from four points turning round the rim.
      const a = (now - e.born) * 0.045;
      for (let k = 0; k < 4; k++) {
        if (Math.random() > fade) continue;
        const ang = a + k * (Math.PI / 2);
        const rx = at.x + Math.cos(ang) * 13;
        const ry = at.y + Math.sin(ang) * 13;
        for (let j = 0; j < 2; j++) {
          const sp = 0.22 + Math.random() * 0.22;
          spark(rx, ry, -Math.sin(ang) * sp, Math.cos(ang) * sp, 0.00035, 380 + Math.random() * 380, hot(), Math.random() < 0.15 ? 4 : 2);
        }
      }
    } else {
      glow({ x: at.x, y: at.y + 24 }, 110, fade * flicker);
      // A fountain: a tall, wide spray that arcs up and rains back down.
      for (let k = 0; k < 10 * fade + 0.5; k++) {
        const vx = (Math.random() - 0.5) * 0.26;
        const vy = -(0.42 + Math.random() * 0.36) * (0.55 + 0.45 * fade);
        spark(at.x, at.y, vx, vy, 0.00075, 800 + Math.random() * 500, hot(), Math.random() < 0.25 ? 4 : 2);
      }
    }
  };

  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  };
  resize();
  window.addEventListener("resize", resize);

  const px = (x, y, size, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(snap(x), snap(y), size, size);
  };

  const drawPebble = (now) => {
    const t = Math.min(1, (now - pebble.born) / pebble.duration);
    // Re-aim every frame so the pebble meets the swinging bulb.
    const to = pebble.target();
    const x = pebble.from.x + (to.x - pebble.from.x) * t;
    const y = pebble.from.y + (to.y - pebble.from.y) * t - Math.sin(Math.PI * t) * pebble.arc;

    pebble.trail.push({ x, y });
    if (pebble.trail.length > 4) pebble.trail.shift();
    pebble.trail.forEach((p, i) => {
      ctx.globalAlpha = ((i + 1) / (pebble.trail.length + 1)) * 0.45;
      px(p.x - 2, p.y - 2, 4, "#6b6b75");
    });
    ctx.globalAlpha = 1;
    px(x - 3, y - 3, 6, "#2a2a33");
    px(x - 2, y - 2, 4, "#8d8d98");
    px(x - 2, y - 2, 2, "#c9c9d2");

    if (t >= 1) {
      const onHit = pebble.onHit;
      pebble = null;
      onHit(to);
    }
  };

  // A short pixel starburst at the point of impact.
  const drawFlash = (now) => {
    const t = (now - flash.born) / 220;
    if (t >= 1) {
      flash = null;
      return;
    }
    const { x, y } = flash.at;
    const reach = 2 + Math.floor(t * 6);
    ctx.globalAlpha = 1 - t;
    px(x - 4, y - 4, 8, "#ffffff");
    for (let k = 1; k <= reach; k++) {
      const d = k * 4;
      const color = k < reach - 1 ? "#ffffff" : "#fff08a";
      px(x + d - 2, y - 2, 4, color);
      px(x - d - 2, y - 2, 4, color);
      px(x - 2, y + d - 2, 4, color);
      px(x - 2, y - d - 2, 4, color);
      if (k <= reach / 1.6) {
        px(x + d * 0.7 - 2, y + d * 0.7 - 2, 4, color);
        px(x - d * 0.7 - 2, y + d * 0.7 - 2, 4, color);
        px(x + d * 0.7 - 2, y - d * 0.7 - 2, 4, color);
        px(x - d * 0.7 - 2, y - d * 0.7 - 2, 4, color);
      }
    }
    ctx.globalAlpha = 1;
  };

  const drawShards = (dt) => {
    shards = shards.filter((s) => (s.life -= dt) > 0);
    for (const s of shards) {
      s.vy += (s.gravity ?? GRAVITY) * dt;
      if (s.drag) {
        s.vx *= s.drag;
        s.vy *= s.drag;
      }
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      // Bounce once or twice on the floor, then settle and fade.
      if (s.y > h - s.size) {
        s.y = h - s.size;
        s.vy *= -0.3;
        s.vx *= 0.6;
      }
      ctx.globalAlpha = Math.min(1, s.life / 400);
      px(s.x, s.y, s.size, s.color);
    }
    ctx.globalAlpha = 1;
  };

  // The firework rocket in flight: a little pixel rocket with a spark trail.
  const drawRocket = (rocket, now) => {
    const t = Math.min(1, (now - rocket.born) / rocket.duration);
    const ease = 1 - (1 - t) * (1 - t); // fast off the ground, slowing near the top
    const x = rocket.from.x + rocket.drift * ease + Math.sin(t * 18) * 1.5;
    const y = rocket.from.y + (rocket.toY - rocket.from.y) * ease;
    // Trail: a few sparks falling away behind it.
    for (let i = 0; i < 2; i++) {
      shards.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + 14,
        vx: (Math.random() - 0.5) * 0.06,
        vy: 0.02 + Math.random() * 0.06,
        gravity: 0.0002,
        drag: 0.96,
        size: 2,
        color: Math.random() < 0.5 ? "#ffd23f" : "#ff8a3c",
        life: 280 + Math.random() * 220,
      });
    }
    px(x - 2, y - 8, 4, "#f6f0dc"); // nose
    px(x - 4, y - 4, 4, "#d9342b");
    px(x, y - 4, 4, "#d9342b");
    px(x - 4, y, 4, "#d9342b");
    px(x, y, 4, "#f6f0dc");
    px(x - 4, y + 4, 4, "#d9342b");
    px(x, y + 4, 4, "#d9342b");
    px(x - 8, y + 6, 4, "#3b5bab"); // fins
    px(x + 4, y + 6, 4, "#3b5bab");
    px(x - 2, y + 10, 4, "#fff08a"); // flame
    if (t >= 1) {
      rocket.done = true;
      rocket.onBurst({ x, y });
    }
  };

  // An arrow on an arc; it points along its flight. A flaming one sheds embers. `to` can be a
  // function, for a moving target: it is re-aimed every frame.
  const drawArrow = (now) => {
    const t = Math.min(1, (now - arrow.born) / arrow.duration);
    const to = typeof arrow.to === "function" ? arrow.to() ?? arrow.last : arrow.to;
    arrow.last = to;
    const at = (u) => ({
      x: arrow.from.x + (to.x - arrow.from.x) * u,
      y: arrow.from.y + (to.y - arrow.from.y) * u - Math.sin(Math.PI * u) * arrow.arc,
    });
    const p = at(t);
    const q = at(Math.max(0, t - 0.02));
    let dx = p.x - q.x;
    let dy = p.y - q.y;
    const n = Math.hypot(dx, dy) || 1;
    dx /= n;
    dy /= n;
    for (let k = 1; k <= 7; k++) px(p.x - dx * k * 3, p.y - dy * k * 3, 2, "#c9a46a"); // shaft
    px(p.x - 1, p.y - 1, 3, "#9a9aa8"); // head
    if (arrow.flame) {
      px(p.x + dx * 3 - 1, p.y + dy * 3 - 1, 3, Math.random() < 0.5 ? "#ffd23f" : "#ff8a3c");
    } else {
      px(p.x - dx * 21 - 1, p.y - dy * 21 - 1, 3, "#f6f0dc"); // fletching
    }
    if (arrow.flame) shards.push({
      x: p.x,
      y: p.y,
      vx: (Math.random() - 0.5) * 0.05,
      vy: -0.02 - Math.random() * 0.04,
      gravity: 0.0001,
      drag: 0.95,
      size: 2,
      color: Math.random() < 0.5 ? "#ffd23f" : "#ff8a3c",
      life: 200 + Math.random() * 200,
    });
    if (t >= 1) {
      const onHit = arrow.onHit;
      arrow = null;
      onHit(p);
    }
  };

  const tick = (now) => {
    const dt = Math.min(32, now - (last || now));
    last = now;
    ctx.clearRect(0, 0, w, h);
    if (pebble) drawPebble(now);
    if (arrow) drawArrow(now);
    for (const e of emitters) runEmitter(e, now);
    emitters = emitters.filter((e) => !e.done);
    for (const rk of rockets) drawRocket(rk, now);
    rockets = rockets.filter((rk) => !rk.done);
    if (flash) drawFlash(now);
    if (shards.length) drawShards(dt);

    if (pebble || flash || arrow || rockets.length || emitters.length || shards.length) raf = requestAnimationFrame(tick);
    else {
      raf = 0;
      last = 0;
    }
  };
  const run = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  return {
    // Flies a pebble from `from` to wherever `target()` is when it lands, then calls onHit.
    firePebble(from, target, onHit) {
      pebble = { from, target, onHit, born: performance.now(), duration: 560, arc: 70, trail: [] };
      run();
    },
    shatter(at) {
      flash = { at, born: performance.now() };
      shards = Array.from({ length: 24 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.12 + Math.random() * 0.34;
        return {
          x: at.x,
          y: at.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.18,
          size: Math.random() < 0.3 ? 4 : 2,
          color: SHARD_COLORS[Math.floor(Math.random() * SHARD_COLORS.length)],
          life: 1500 + Math.random() * 900,
        };
      });
      run();
    },
    // Soft gray pixel puff, for things popping in or out (the ladder).
    puff(at, width = 40) {
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.04 + Math.random() * 0.08;
        shards.push({
          x: at.x + (Math.random() - 0.5) * width,
          y: at.y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.03,
          gravity: 0,
          drag: 0.97,
          size: Math.random() < 0.5 ? 6 : 4,
          color: Math.random() < 0.5 ? "#d9d9e0" : "#b4b4c0",
          life: 450 + Math.random() * 250,
        });
      }
      run();
    },
    // Little yellow twinkles when the new bulb clicks in.
    sparkle(at) {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const speed = 0.09 + Math.random() * 0.05;
        shards.push({
          x: at.x,
          y: at.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0,
          drag: 0.95,
          size: i % 3 === 0 ? 4 : 2,
          color: i % 2 ? "#fff08a" : "#ffffff",
          life: 500 + Math.random() * 200,
        });
      }
      run();
    },
    // Confetti: coloured bits shot up from `at`, then drifting down.
    confetti(at) {
      const colours = ["#e2583f", "#f6c445", "#3b82d6", "#3fa34d", "#b36ad6", "#ffffff"];
      for (let i = 0; i < 60; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
        const speed = 0.15 + Math.random() * 0.3;
        shards.push({
          x: at.x + (Math.random() - 0.5) * 30,
          y: at.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.0007,
          drag: 0.992,
          size: 3 + (i % 3),
          color: colours[i % colours.length],
          life: 1500 + Math.random() * 900,
        });
      }
      run();
    },
    // Shoots a flaming arrow from `from` to `to` along an arc, then calls onHit.
    fireArrow(from, to, onHit, { flame = true, duration = 700, arc = 90 } = {}) {
      arrow = { from, to, onHit, flame, born: performance.now(), duration, arc };
      run();
    },
    // Charki: spins sparks out in a circle around `at` for `ms`.
    spinner(at, ms) {
      emitters.push({ type: "spinner", at, ms, born: performance.now() });
      run();
    },
    // Tubri: a fountain of sparks shooting up from `at` for `ms`.
    fountain(at, ms) {
      emitters.push({ type: "fountain", at, ms, born: performance.now() });
      run();
    },
    // A few sparks fizzing off a lit fuse; call it repeatedly while it burns.
    fizz(at) {
      for (let i = 0; i < 3; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
        const speed = 0.06 + Math.random() * 0.1;
        shards.push({
          x: at.x,
          y: at.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.0006,
          drag: 0.97,
          size: 2,
          color: ["#ffffff", "#fff08a", "#ff8a3c"][i],
          life: 220 + Math.random() * 200,
        });
      }
      run();
    },
    // Sends a rocket from `from` up and across to `to`, then calls onBurst where it pops.
    launch(from, to, onBurst) {
      rockets.push({ from, toY: to.y, onBurst, born: performance.now(), duration: 1100, drift: to.x - from.x });
      run();
    },
    // A firework: a ring of coloured sparks that drift, droop and fade, with a white pop.
    firework(at) {
      flash = { at, born: performance.now() };
      const palette = ["#ff5c7a", "#ffd23f", "#6be3ff", "#b36ad6", "#7dff8a", "#ffffff"];
      const main = palette[Math.floor(Math.random() * palette.length)];
      for (let i = 0; i < 70; i++) {
        const angle = (i / 70) * Math.PI * 2 + Math.random() * 0.1;
        const speed = 0.12 + Math.random() * 0.22;
        shards.push({
          x: at.x,
          y: at.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.00018,
          drag: 0.985,
          size: Math.random() < 0.25 ? 4 : 2,
          color: Math.random() < 0.6 ? main : palette[Math.floor(Math.random() * palette.length)],
          life: 1300 + Math.random() * 900,
        });
      }
      run();
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    },
  };
}
