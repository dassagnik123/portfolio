// 8-bit sound effects, synthesized with the Web Audio API (no audio files).
// The context is created on the first click (unlockAudio), since browsers only allow sound after one.
let ctx = null;
let muted = false;
try {
  muted = localStorage.getItem("sfx-muted") === "1";
} catch {
  // storage unavailable: start unmuted
}

export const isMuted = () => muted;
// Muting pauses the whole audio engine: music, effects and anything still ringing go silent at
// once. Unmuting picks the music back up.
export function setMuted(value) {
  muted = value;
  if (ctx) {
    if (value) ctx.suspend();
    else ctx.resume();
  }
  if (music) music.bus.gain.setTargetAtTime(value ? 0 : MUSIC_VOLUME, ctx.currentTime, 0.05);
  try {
    localStorage.setItem("sfx-muted", value ? "1" : "0");
  } catch {
    // not remembered; still applies for this visit
  }
}

// Call from a click: creates (or wakes) the audio context. Until then sounds are skipped,
// so scrolling before any click stays silent instead of tripping the browser's autoplay block.
export function unlockAudio() {
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) ctx = new Ctx();
  }
  if (ctx?.state === "suspended" && !muted) ctx.resume();
}

function audio() {
  if (muted || !ctx) return null;
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// One oscillator note, gliding from `from` to `to` Hz, with a quick attack and decay.
function tone({ type = "square", from, to = from, dur, vol = 0.06, at = 0 }) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + at;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// A burst of white noise, high-passed so it reads as hiss or crunch rather than rumble.
function noise({ dur, vol = 0.08, at = 0, highpass = 1000 }) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + at;
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = highpass;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(t);
}

export const sfx = {
  // Rubber band creaking as he pulls the slingshot back.
  stretch: () => tone({ from: 180, to: 420, dur: 0.38, vol: 0.035 }),
  // Snap of the band and the pebble whooshing off.
  shoot: () => {
    tone({ from: 900, to: 260, dur: 0.12, vol: 0.06 });
    noise({ dur: 0.25, vol: 0.05, highpass: 2500, at: 0.02 });
  },
  // Glass bursting: a crunch, a falling zap, then a few tinkles as shards land.
  shatter: () => {
    noise({ dur: 0.45, vol: 0.12, highpass: 1500 });
    tone({ from: 700, to: 70, dur: 0.35, vol: 0.07 });
    [0.12, 0.2, 0.31, 0.45, 0.6].forEach((at, i) =>
      tone({ type: "triangle", from: 2400 + i * 300, dur: 0.06, vol: 0.03, at }),
    );
  },
  // Lights flickering out: a few dying buzzes.
  lightsOut: () => [0, 0.1, 0.24].forEach((at, i) => tone({ type: "sawtooth", from: 120 - i * 25, dur: 0.07, vol: 0.03, at })),
  // One footstep or ladder rung.
  step: (pose) => tone({ type: "triangle", from: pose === "climb" ? 260 : 150, dur: 0.045, vol: 0.05 }),
  // The ladder popping in or out.
  pop: () => tone({ from: 320, to: 640, dur: 0.09, vol: 0.05 }),
  // Menu select blip, like picking an item on a game menu.
  select: () => {
    tone({ from: 660, dur: 0.05, vol: 0.04 });
    tone({ from: 990, dur: 0.06, vol: 0.04, at: 0.05 });
  },
  // Arrow catching fire: a soft whoomph.
  ignite: () => {
    noise({ dur: 0.35, vol: 0.06, highpass: 600 });
    tone({ type: "triangle", from: 180, to: 320, dur: 0.25, vol: 0.03 });
  },
  // Bowstring twang as the arrow goes.
  twang: () => {
    tone({ type: "triangle", from: 220, to: 160, dur: 0.18, vol: 0.07 });
    noise({ dur: 0.2, vol: 0.03, highpass: 3000, at: 0.03 });
  },
  // Net swept through the air.
  swish: () => {
    noise({ dur: 0.16, vol: 0.05, highpass: 2200 });
    tone({ type: "triangle", from: 300, to: 520, dur: 0.12, vol: 0.02 });
  },
  // Caught a butterfly: a bright little three-note jingle.
  caught: () => [784, 988, 1319].forEach((f, i) => tone({ from: f, dur: 0.1, vol: 0.045, at: 0.05 + i * 0.08 })),
  // Fuse burning: a crackly hiss.
  fuse: (dur = 0.9) => noise({ dur, vol: 0.035, highpass: 4000 }),
  // Charki spinning: a whirring hiss with a wobble, and crackles.
  spin: (dur = 2.6) => {
    noise({ dur, vol: 0.05, highpass: 2500 });
    for (let at = 0.1; at < dur; at += 0.18) tone({ type: "triangle", from: 900, to: 700, dur: 0.08, vol: 0.015, at });
  },
  // Tubri: a steady roaring spray that tails off.
  spray: (dur = 3) => {
    noise({ dur, vol: 0.07, highpass: 1200 });
    for (let at = 0.2; at < dur; at += 0.23) noise({ dur: 0.03, vol: 0.04, highpass: 4000, at });
  },
  // Rocket going up: a rising whistle.
  whistle: () => tone({ type: "triangle", from: 500, to: 1800, dur: 1.05, vol: 0.04 }),
  // Firework bursting: a deep thump, a crack, then a crackle of sparks.
  boom: () => {
    tone({ type: "triangle", from: 140, to: 40, dur: 0.5, vol: 0.12 });
    noise({ dur: 0.7, vol: 0.12, highpass: 200 });
    [0.25, 0.32, 0.41, 0.5, 0.62, 0.7].forEach((at) => noise({ dur: 0.04, vol: 0.05, highpass: 3000, at }));
  },
  // Guessed the fish right: a rising fanfare, then a sparkly chord.
  win: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone({ from: f, dur: 0.12, vol: 0.05, at: i * 0.09 }));
    [1047, 1319, 1568].forEach((f) => tone({ type: "triangle", from: f, dur: 0.5, vol: 0.04, at: 0.5 }));
  },
  // A shovel biting into the ground: a dull thud and a scrape.
  dig: () => {
    tone({ type: "triangle", from: 150, to: 70, dur: 0.14, vol: 0.07 });
    noise({ dur: 0.18, vol: 0.05, highpass: 700, at: 0.04 });
  },
  // The hint after a dig: low for cold, higher for warm, a quick rising trill for hot.
  hint: (level) => {
    if (level === "hot") [660, 880, 1175].forEach((f, i) => tone({ from: f, dur: 0.09, vol: 0.05, at: i * 0.08 }));
    else if (level === "warm") tone({ type: "triangle", from: 520, to: 600, dur: 0.2, vol: 0.05 });
    else tone({ type: "triangle", from: 260, to: 200, dur: 0.25, vol: 0.05 });
  },
  // Wrong guess: a little falling "aww".
  lose: () => [392, 330, 262].forEach((f, i) => tone({ type: "triangle", from: f, to: f * 0.96, dur: 0.18, vol: 0.05, at: i * 0.16 })),
  // New bulb in: a quick rising arpeggio.
  fixed: () => [523, 659, 784, 1047].forEach((f, i) => tone({ from: f, dur: 0.09, vol: 0.05, at: i * 0.07 })),
};

/* ---------- background music ---------- */
// A small looping chiptune: four bars of square-wave melody, arpeggio and triangle bass.
// "day" is bright and in C major; "night" (bulb out) is slower and in A minor.
const MUSIC_VOLUME = 0.55;
const midi = (n) => 440 * 2 ** ((n - 69) / 12);

const TUNES = {
  day: {
    bpm: 96,
    bass: [48, 45, 41, 43], // C  Am  F  G
    chords: [
      [60, 64, 67, 72],
      [57, 60, 64, 69],
      [53, 57, 60, 65],
      [55, 59, 62, 67],
    ],
    melody: [
      [76, null, 79, 76, 74, 72, null, 72],
      [72, null, 76, 74, 72, 69, null, null],
      [69, 72, 77, 76, 74, 72, null, 69],
      [71, null, 74, 72, 71, 67, null, null],
    ],
    lead: "square",
  },
  night: {
    bpm: 72,
    bass: [45, 41, 38, 40], // Am  F  Dm  E
    chords: [
      [57, 60, 64, 69],
      [53, 57, 60, 65],
      [50, 53, 57, 62],
      [52, 56, 59, 64],
    ],
    melody: [
      [76, null, null, 72, null, null, 69, null],
      [72, null, null, 69, null, null, 65, null],
      [74, null, 72, null, 69, null, null, null],
      [71, null, null, 68, null, null, 64, null],
    ],
    lead: "triangle",
  },
};

let music = null;

function note(freq, type, t, dur, vol) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(music.bus);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// One eighth-note step of the tune at time t.
function playStep(step, t) {
  const tune = TUNES[music.mood];
  const bar = Math.floor(step / 8) % 4;
  const beat = step % 8;
  const eighth = 60 / tune.bpm / 2;
  if (beat % 4 === 0) note(midi(tune.bass[bar]), "triangle", t, eighth * 3.6, 0.09);
  note(midi(tune.chords[bar][beat % 4]), "square", t, eighth * 0.8, 0.012);
  const m = tune.melody[bar][beat];
  if (m) note(midi(m), tune.lead, t, eighth * 1.6, 0.03);
}

// Schedules notes a little ahead of time so the beat stays steady.
function schedule() {
  if (!music) return;
  const now = ctx.currentTime;
  if (muted) {
    music.next = now + 0.05; // nothing queued up while muted; resume cleanly on unmute
    return;
  }
  if (music.next < now - 0.2) music.next = now + 0.05; // back from a background tab: don't rush to catch up
  while (music.next < now + 0.15) {
    if (music.step % 8 === 0) music.mood = music.pendingMood; // switch moods on a bar line
    playStep(music.step, music.next);
    music.next += 60 / TUNES[music.mood].bpm / 2;
    music.step = (music.step + 1) % 32;
  }
}

// Starts the loop (call from a click, after unlockAudio). Safe to call more than once.
export function startMusic() {
  if (music || !ctx) return;
  const bus = ctx.createGain();
  bus.gain.value = muted ? 0 : MUSIC_VOLUME;
  const soften = ctx.createBiquadFilter(); // takes the harsh edge off the square waves
  soften.type = "lowpass";
  soften.frequency.value = 2600;
  bus.connect(soften).connect(ctx.destination);
  music = { bus, step: 0, next: ctx.currentTime + 0.1, mood: pendingMood, pendingMood };
  music.timer = setInterval(schedule, 25);
}

let pendingMood = "day";
// "day" or "night"; takes effect at the next bar.
export function setMusicMood(mood) {
  pendingMood = mood;
  if (music) music.pendingMood = mood;
}

// Dev only: when this file hot-reloads, stop the old copy's music loop and audio engine, so no
// orphaned music keeps playing where the mute button can't reach it.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (music) clearInterval(music.timer);
    music = null;
    ctx?.close();
  });
}
