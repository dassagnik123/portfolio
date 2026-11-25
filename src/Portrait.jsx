import { useEffect, useState } from "react";

const SRC = "/portrait/sagnik-das.webp";
// Dusty lotus rose (colors.md lotus reference), dark to light. The portrait's hot pinks are
// remapped onto this ramp by lightness, so light and shadow stay where they are and only the
// shade of pink changes.
const ROSE = ["#570B11", "#932639", "#A2565A", "#C4747A", "#DC9A9D", "#EFC0C0", "#F8D8D8", "#F8F2ED"];

function rgbToHsl(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const ROSE_STOPS = ROSE.map((hex) => {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return { rgb, l: rgbToHsl(...rgb)[2] };
}).sort((a, b) => a.l - b.l);

// The rose colour with the given lightness, interpolated between the nearest stops.
function roseAt(l) {
  if (l <= ROSE_STOPS[0].l) return ROSE_STOPS[0].rgb;
  for (let i = 1; i < ROSE_STOPS.length; i++) {
    const a = ROSE_STOPS[i - 1];
    const b = ROSE_STOPS[i];
    if (l <= b.l) {
      const t = (l - a.l) / (b.l - a.l);
      return a.rgb.map((v, k) => v + (b.rgb[k] - v) * t);
    }
  }
  return ROSE_STOPS[ROSE_STOPS.length - 1].rgb;
}

// Recolours only the pink and magenta pixels. The near-black structure (hair base, beard, eyes,
// glasses) and the olive shirt are left alone.
async function toLotusRose(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] === 0) continue;
    const [h, s, l] = rgbToHsl(px[i] / 255, px[i + 1] / 255, px[i + 2] / 255);
    const pink = (h >= 290 || h <= 20) && s > 0.15 ? smoothstep(0.15, 0.35, s) : 0;
    const w = pink * smoothstep(0.1, 0.25, l);
    if (w === 0) continue;
    const target = roseAt(l);
    const src = [px[i] / 255, px[i + 1] / 255, px[i + 2] / 255];
    for (let k = 0; k < 3; k++) px[i + k] = (src[k] + (target[k] - src[k]) * w) * 255;
  }
  ctx.putImageData(data, 0, 0);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  return URL.createObjectURL(blob);
}

// The illustrated portrait: a transparent cutout with no frame. It rises in once ready; no hover
// movement.
export default function Portrait() {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let url;
    let cancelled = false;
    const img = new Image();
    img.onload = async () => {
      url = await toLotusRose(img);
      if (cancelled) URL.revokeObjectURL(url);
      else setSrc(url);
    };
    img.src = SRC;
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  return (
    <img
      className="portrait"
      src={src ?? undefined}
      alt="Illustrated portrait of Sagnik Das in dusty rose tones, wearing glasses and an olive shirt, looking up and to the left"
      width={1094}
      height={1438}
      onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
    />
  );
}
