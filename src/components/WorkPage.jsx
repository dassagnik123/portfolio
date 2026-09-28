import { useEffect, useRef, useState } from "react";
import { EmailIcon, PhoneIcon } from "./icons";
import { contact, projects } from "../data";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

const serif = { fontFamily: "'Instrument Serif', serif" };

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const ArrowIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
    <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Tag({ children }) {
  return (
    <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

function FeaturedProject({ project, onOpen }) {
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="liquid-glass group grid w-full cursor-pointer gap-8 rounded-[2rem] p-4 text-left transition-transform duration-300 ease-out hover:scale-[1.03] sm:p-5 lg:grid-cols-[1.35fr_1fr] lg:gap-10"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-white/5">
        {project.cover && !coverFailed && (
          <div data-px="media" className="absolute inset-x-0 -inset-y-[8%] will-change-transform">
            <img
              src={project.cover}
              alt={project.title}
              onError={() => setCoverFailed(true)}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between gap-8 px-2 pb-2 lg:py-4 lg:pr-4">
        <div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{project.number} — Case study</span>
            <span className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-foreground transition group-hover:scale-[1.06]">
              <ArrowIcon />
            </span>
          </div>
          <h3
            className="mt-6 text-3xl leading-[1.05] tracking-[-0.5px] text-foreground sm:text-4xl"
            style={serif}
          >
            {project.title}
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {project.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </button>
  );
}

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Eased window scroll; duration grows gently with distance so long jumps still glide.
function smoothScrollTo(targetY, onDone) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetY);
    return () => {};
  }
  const duration = Math.min(1600, 700 + Math.abs(distance) * 0.45);
  const start = performance.now();
  let raf = requestAnimationFrame(function step(now) {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, startY + distance * easeInOutCubic(t));
    if (t < 1) raf = requestAnimationFrame(step);
    else onDone?.();
  });
  return () => cancelAnimationFrame(raf);
}

// Plays a background video only while it is on screen.
function useVisiblePlayback(ref) {
  useEffect(() => {
    const video = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [ref]);
}

// Drains the blue from the upper sky; the warm glow at the bottom keeps its color.
const DESATURATE =
  "pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,#000_0%,#000_64%,transparent_86%)] mix-blend-saturation";

// Night-sky scene from the hero video, themed black, fading into the page below.
function SkyScene() {
  const videoRef = useRef(null);
  useVisiblePlayback(videoRef);

  return (
    <div data-px="hero-bg" className="absolute inset-0 z-0 will-change-transform">
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover object-bottom"
        src={HERO_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div aria-hidden className={DESATURATE} />
      {/* Color burn crushes the leftover dark-gray sky to the page's true black; stars stay bright. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,#8c8c8c_0%,#8c8c8c_48%,transparent_72%)] mix-blend-color-burn"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.3)_55%,transparent_76%,transparent_85%,#000_100%)]"
      />
    </div>
  );
}

// Soft-edged regions of the frame with no characters in them (percent of the video box):
// the two book stacks, the flower beds beside them, and the flower strip along the bottom.
const FOOTER_MASK = [
  "radial-gradient(ellipse 19% 70% at 0% 100%, #000 62%, transparent 100%)",
  "radial-gradient(ellipse 20% 56% at 100% 100%, #000 62%, transparent 100%)",
  "radial-gradient(ellipse 18% 21% at 21% 100%, #000 50%, transparent 100%)",
  "radial-gradient(ellipse 18% 21% at 71% 100%, #000 50%, transparent 100%)",
  "linear-gradient(to bottom, transparent 89%, #000 96%)",
].join(", ");

// Footer: the scene's books and flowers without the people, framing the contact section.
function FooterScene() {
  const videoRef = useRef(null);
  useVisiblePlayback(videoRef);

  return (
    <div data-px="footer-bg" aria-hidden className="pointer-events-none absolute inset-0 z-0 will-change-transform">
      {/* Shown larger and anchored to the bottom edge, so the flowers reach high and fill to the bottom. */}
      <div
        className="absolute bottom-0 left-1/2 aspect-video w-[max(125%,1000px)] -translate-x-1/2"
        style={{ maskImage: FOOTER_MASK, WebkitMaskImage: FOOTER_MASK }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full max-w-none object-cover"
          src={HERO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        {/* Same black treatment as the hero: no blue sky around the book stacks. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#000_0%,#000_72%,transparent_90%)] mix-blend-saturation" />
      </div>
    </div>
  );
}

// Fixed, softly twinkling star field behind the whole page, matching the video's black sky.
function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars = [];
    let w = 0;
    let h = 0;
    let raf = 0;

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const star of stars) {
        const twinkle = still ? 1 : 0.6 + 0.4 * Math.sin(star.phase + t * 0.001 * star.speed);
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.fillStyle = star.tint;
        ctx.beginPath();
        const y = still ? star.y : (((star.y - window.scrollY * 0.12) % h) + h) % h;
        ctx.arc(star.x, y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      // Mobile URL bars change the height constantly; only rebuild on real size changes.
      const nextW = window.innerWidth;
      const nextH = Math.max(window.innerHeight, h);
      if (nextW === w && nextH - h < 120 && stars.length) return;
      w = nextW;
      h = nextH;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.round((w * h) / 1700) }, () => {
        const bright = Math.random() < 0.06;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: bright ? 0.9 + Math.random() * 0.7 : 0.25 + Math.random() * 0.6,
          alpha: bright ? 0.85 : 0.25 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.4,
          tint: Math.random() < 0.3 ? "#dfe6ff" : "#ffffff",
        };
      });
      if (still) draw(0);
    };

    const loop = (t) => {
      if (!document.hidden) draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (!still) raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-0 w-full bg-black"
    />
  );
}

export default function WorkPage({ controls, onOpenProject }) {
  const cancelScroll = useRef(() => {});
  const rootRef = useRef(null);
  const navRef = useRef(null);
  const [active, setActive] = useState("#top");

  // Scroll-driven layers: the fixed nav's backdrop, which nav link is current, and a
  // parallax where the hero scene, card cover and footer scene move at different speeds.
  useEffect(() => {
    const root = rootRef.current;
    const nav = navRef.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroBg = root.querySelector('[data-px="hero-bg"]');
    const heroCopy = root.querySelector('[data-px="hero-copy"]');
    const footerBg = root.querySelector('[data-px="footer-bg"]');
    const footer = root.querySelector("#contact");
    const media = [...root.querySelectorAll('[data-px="media"]')];
    const sections = ["#projects", "#contact"].map((id) => [id, root.querySelector(id)]);
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      nav.dataset.scrolled = String(y > 24);

      let current = "#top";
      for (const [id, el] of sections) if (el.getBoundingClientRect().top < vh * 0.45) current = id;
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = "#contact";
      setActive(current);

      if (still) return;
      if (y < vh * 1.5) {
        heroBg.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
        heroCopy.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
        heroCopy.style.opacity = String(Math.max(0, 1 - y / (vh * 0.7)));
      }
      for (const el of media) {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - vh / 2) * -0.08}px, 0)`;
      }
      const f = footer.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh - f.top) / f.height));
      footerBg.style.transform = `translate3d(0, ${(1 - progress) * 90}px, 0)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Any manual wheel/touch/key input takes over from an in-progress glide.
  useEffect(() => {
    const stop = () => cancelScroll.current();
    const opts = { passive: true };
    window.addEventListener("wheel", stop, opts);
    window.addEventListener("touchstart", stop, opts);
    window.addEventListener("keydown", stop);
    return () => {
      stop();
      window.removeEventListener("wheel", stop, opts);
      window.removeEventListener("touchstart", stop, opts);
      window.removeEventListener("keydown", stop);
    };
  }, []);

  const handleAnchorClick = (e) => {
    const link = e.target.closest?.('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    cancelScroll.current();
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    let y = target.getBoundingClientRect().top + window.scrollY - margin;
    // Sections can name an element that must end up fully on screen (e.g. the project card).
    // Prefer the section heading sitting just below the top edge; if the element would still be
    // cut off at the bottom, scroll further until it fits (or pin its top when it's too tall).
    const fit = target.dataset.scrollFit && target.querySelector(target.dataset.scrollFit);
    if (fit) {
      const heading = target.querySelector("h2") ?? fit;
      const box = fit.getBoundingClientRect();
      const top = box.top + window.scrollY;
      const bottom = top + box.height;
      const gap = 32;
      const inset = navRef.current?.offsetHeight ?? 0;
      y = heading.getBoundingClientRect().top + window.scrollY - Math.max(48, inset + 16);
      if (box.height + gap * 2 > window.innerHeight - inset) y = top - inset - gap;
      else if (bottom + gap > y + window.innerHeight) y = bottom + gap - window.innerHeight;
    }
    y = Math.max(0, y);
    cancelScroll.current = smoothScrollTo(y);
  };

  const [featured] = projects;

  return (
    <div
      id="top"
      ref={rootRef}
      onClick={handleAnchorClick}
      className="work-theme relative isolate min-h-dvh bg-background text-foreground"
    >
      <StarField />

      {/* Stays pinned while scrolling; gains a soft dark backdrop once the page moves. */}
      <nav
        ref={navRef}
        data-scrolled="false"
        className="fixed inset-x-0 top-0 z-40 flex w-full items-center justify-between gap-6 px-6 pb-4 pt-[calc(22px+env(safe-area-inset-top))] transition-[background-color,backdrop-filter,box-shadow] duration-500 data-[scrolled=true]:bg-black/75 data-[scrolled=true]:shadow-[0_1px_0_rgba(255,255,255,0.06)] data-[scrolled=true]:backdrop-blur-md sm:px-10 lg:px-14"
      >
        <a href="#top" className="text-2xl tracking-tight text-foreground sm:text-3xl" style={serif}>
          Sagnik Das
        </a>
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={active === link.href ? "true" : undefined}
              className={`text-sm transition-colors hover:text-foreground ${
                active === link.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
        {controls}
      </nav>

      {/* Landing */}
      <section className="relative z-10 flex min-h-dvh flex-col overflow-hidden">
        <SkyScene />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[22vh] bg-gradient-to-b from-transparent to-black"
        />

        <div aria-hidden className="h-[calc(74px+env(safe-area-inset-top))] shrink-0" />

        <div data-px="hero-copy" className="hero-copy relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-[24vh] pt-10 text-center sm:pt-12">
          <h1
            className="hero-title animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] sm:text-7xl md:text-8xl"
            style={serif}
          >
            Where <em className="not-italic text-muted-foreground">friction</em> turns into{" "}
            <em className="not-italic text-muted-foreground">quiet clarity.</em>
          </h1>
          <p className="animate-fade-rise-delay mt-6 max-w-2xl sm:mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
            I'm Sagnik — a UX designer, product designer and UX engineer. I dig into how people
            actually work, find where the friction is, and design the structure that removes it —
            then ship it.
          </p>
          <a
            href="#projects"
            className="liquid-glass animate-fade-rise-delay-2 mt-10 cursor-pointer rounded-full px-12 py-4 text-base sm:mt-12 sm:px-14 sm:py-5 text-foreground transition-transform hover:scale-[1.03]"
          >
            View my work
          </a>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" data-scroll-fit="[data-scroll-fit-target]" className="relative z-10 scroll-mt-6 px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2
              className="max-w-3xl text-4xl font-normal leading-[0.95] tracking-[-1.5px] sm:text-6xl"
              style={serif}
            >
              Selected work, <em className="not-italic text-muted-foreground">built around real problems.</em>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
              Each project starts with how people actually work — then removes whatever is in their way.
            </p>
          </div>

          <div data-scroll-fit-target className="mt-14 sm:mt-20">
            <FeaturedProject project={featured} onOpen={() => onOpenProject(featured)} />
          </div>
        </div>
      </section>

      {/* Contact: the hero's books and flowers (without the characters) frame the bottom edge. */}
      <section
        id="contact"
        className="relative z-10 flex flex-col overflow-hidden px-6 sm:px-10 lg:px-14"
      >
        <FooterScene />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center pb-[clamp(150px,17vw,260px)] pt-24 text-center sm:pt-32">
          <h2
            className="max-w-4xl text-4xl font-normal leading-[0.95] tracking-[-1.5px] sm:text-6xl"
            style={serif}
          >
            Have a problem <em className="not-italic text-muted-foreground">worth solving?</em>
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${contact.email}`}
              className="liquid-glass flex items-center gap-2 rounded-full px-8 py-4 text-sm text-foreground transition-transform hover:scale-[1.03] sm:text-base"
            >
              <EmailIcon />
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground transition-colors hover:text-foreground sm:text-base"
            >
              <PhoneIcon />
              {contact.phone}
            </a>
          </div>
          <p className="mt-10 text-xs text-muted-foreground">© 2026 Sagnik Das</p>
        </div>
      </section>
    </div>
  );
}
