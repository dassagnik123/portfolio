# CLAUDE.md — Sagnik Das portfolio

Living reference for this project: what it is, how it is built, where things live, and what has been decided. Update it whenever a decision, a page or a project changes.

## What this is

A personal portfolio for **Sagnik Das**, a frontend engineer moving into UX (4+ years, Keross R&D). One site, two "modes" switched with a toggle in the top controls:

- **9-5 (work):** the professional page. Hero, selected projects (case studies), experience, skills, contact.
- **5-9 (personal, "After Hours"):** an interactive photo sphere of hobbies (cooking, painting, anime, sports & gaming, travel).

There is only one version of the site now. The earlier version switcher and the 8-bit "interactive" version were removed from this tree (the interactive code still exists on the `interactive-version` branch and in `main`'s earlier history).

## Stack

- Vite 8, React 19 (plain JS/JSX, no TypeScript)
- Tailwind CSS v4 via `@tailwindcss/vite` (`source(".")` import in `src/developer/index.css`; uses the `pointer-coarse:` variant)
- three.js 0.185 (hand-written `ShaderMaterial` in the hero; `@react-three/fiber`, `@shadergradient/react`, `camera-controls`, `three-stdlib` are also installed)
- oxlint for linting
- Fonts (Google Fonts, imported in the CSS files): **Instrument Serif** (display serif, hero letters, headings), **Plus Jakarta Sans** (intro paragraph, case study titles), **Noto Sans** (body text, replaced Inter), plus DynaPuff and Oswald in a few places

## Commands

```
npm run dev       # vite dev server (add -- --host to test on a phone on the same network)
npm run build     # production build into dist/ (dist is git-ignored)
npm run lint      # oxlint
npm run preview   # serve the built site
sh scripts/make-thumbs.sh   # rebuild 5-9 sphere thumbnails (macOS sips); rerun after adding photos
```

## Git

- Remote: `origin` → https://github.com/dassagnik123/portfolio.git
- `main` is the live branch. Work is done on `test-version-5-developer-edition-2`, then `main` is fast-forwarded to it. Both are currently the same commit.
- Other branches are older experiments: `interactive-version`, `portfolio-professional`, `test-version-1` to `-5-developer-edition`.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Untracked and deliberately not committed: `project images/northwind-screenshots 2/` (43 MB of raw screenshots).

## Layout

```
src/main.jsx                    mounts <App/> from ./developer
src/developer/
  index.js                      imports index.css, exports App
  App.jsx                       mode state, 9-5 ↔ 5-9 switching, loaders, case-study overlay
  data.js                       ALL site content: modes, contact, socials, projects, hobbies, archive, experience, skills
  caseStudy.js                  case study 01 (customer support dashboard)
  caseStudyRecruitment.js       case study 02 (recruitment & onboarding)
  index.css                     Tailwind + theme + animation keyframes (.reveal, .case-in, .return-bar, .scroll-cue-dot)
  personalArchive.css           styles for the 5-9 page
  components/
    WorkPage.jsx                the 9-5 page (nav, hero, projects, experience, skills, contact)
    NameRibbon.jsx              the hero: three.js ribbon of letter cards spelling SAGNIK DAS
    ProjectDetail.jsx           the case study overlay (slides)
    PersonalArchive.jsx         the 5-9 photo sphere
    TopControls.jsx             mode toggle, LinkedIn, X, Resume
    ModeToggle.jsx, CustomCursor.jsx, Gallery.jsx, Polaroid.jsx, ProjectCard.jsx,
    ImageSlot.jsx, RotatingText.jsx, ShaderBackground.jsx, TicketDashboardMockup.jsx, icons.jsx
public/                         images served as-is (see Assets)
resume/Sagnik_Das.pdf           source copy of the résumé; the site serves public/resume.pdf
scripts/make-thumbs.sh          5-9 thumbnail builder
```

## Contact and links (from `data.js`)

- Email: dassagnikdas1999@gmail.com
- Phone: 7595895302
- LinkedIn: https://www.linkedin.com/in/sagnik-das-42b6261a3
- X: https://x.com/dasSagnik1999
- Résumé: `/resume.pdf` → `public/resume.pdf`. **To update it, replace `public/resume.pdf`** (keep `resume/Sagnik_Das.pdf` in sync).

## Projects (case studies)

Both live in `data.js` → `projects`, and share one slide structure.

| # | Title | Duration | Tags | File |
|---|-------|----------|------|------|
| 01 | Agents couldn't see which tickets were about to breach — so I made urgency impossible to miss | 1 week | Customer Support, Dashboard, UI/UX | `caseStudy.js` |
| 02 | One place to run hiring, with AI that helps and people who decide | ~2 months | HR tech, AI workflow, UI/UX | `caseStudyRecruitment.js` |

**Slide order (both studies, fixed):** Overview, The problem, The goal, Research, Key insights, Process, The design, Key decisions, Constraints & trade-offs, Impact, What I learned.

**Case study data shape:** `{ title, created?, duration, tags, overview: [{label,text}], sections: [{heading, blocks}] }`. Block types: `p`, `ul` (`items`), `quote`, `image` (`src`, `alt`, `caption`). `**bold**` is supported in text.

**Content rules decided so far**
- No invented metrics. The ticket study (01) says it shipped, the team is small and didn't track numbers, but resolution improved and manual work dropped. Do not add percentages back.
- Research slide of study 01 lists the three habits only (no "fixes").
- The "frontend-only by design" point and the "decisions made in the browser" point were removed from study 01's Key decisions.
- Study 01's dashboard-vs-saved-filters decision includes the slow-API reasoning.
- Plain words on purpose in study 02.
- Cover images: `cover` and optional `cover2` per project (`/customer-support-cover.jpg` + `/cs-dashboard.png`; `/rec-dashboard.png` + `/rec-evidence.png`).

**Case study page behaviour**
- Overview slide on large screens: title, then tags and created/duration, then two stacked images on the left and the "1-minute overview" box on the right. Phones: single stacked layout with one image.
- Cover title uses the same size as slide titles (`text-3xl` up to `lg:text-5xl`, extrabold).
- Previous/Next buttons are solid white. The arrows hint is `text-neutral-300`.
- Opens by growing out of the clicked card (clip-path animation) and shrinks back on Back; project cards rise in on scroll. Reduced motion is respected.

## 9-5 page

- **Nav:** signature image (`/signature-ink.png`, white ink, transparent) top-left, controls top-right. Goes translucent dark once scrolled.
- **Hero (`NameRibbon.jsx`):** time-driven (not scroll-driven) animation, `INTRO_SECONDS = 6`. A ribbon of letter cards flies in and lands spelling SAGNIK DAS (kept, not dissolved). The headline slides across as FRONTEND / UX with the caption "Frontend engineer moving into UX". Then the intro paragraph and a white "View my work" button fade in; on phones a secondary glass "Contact" button sits beside it and scrolls to the contact section.
  - Each letter card has its own photo (`public/personal/Sagnik/1..9.jpg`). A one-time photo wave plays after landing; **it waits for all nine photos to load first**. On hover (desktop) or touch-and-drag (phone), a card's photo rises from the bottom and returns.
  - Phone layout: 3×3 grid, taller cards. Desktop: rows of 6 and 3. The animation sits in a one-screen-tall stage (`h-svh`).
  - A "SCROLL" cue shows at the bottom middle on mouse devices only (hidden on touch).
  - The intro plays only on the first visit of a page load (module-level `introSeen`, no browser storage); it replays on refresh and is skipped when returning from 5-9.
  - No WebGL → the hero section is left empty rather than crashing.
- **Intro paragraph:** Plus Jakarta Sans, larger size.
- **Secondary button style:** the `liquid-glass` pill (used for email, phone and case-study buttons).
- Skills groups: Design (Figma, Wireframing, Rapid prototyping, User research, Interaction design, User-centred design) and Build (React.js, Next.js, TypeScript, JavaScript, HTML & CSS).
- Experience (Keross R&D): Software Engineer Level 2 (Apr 2025 – Oct 2026), Level 1 (Nov 2022 – Apr 2025), Intern (Mar 2022 – Nov 2022).

## 5-9 page ("After Hours")

- Photo sphere built from hobby photos in `public/personal/<hobby>/N.jpg`; the sphere loads small `thumbs/N.jpg` copies (made by `scripts/make-thumbs.sh`) and opens the full photo when one is picked. The sphere is 15% smaller than the original (`SPHERE_SIZE = 0.85`). The wheel zooms the sphere; the page does not scroll.
- Top-left: the signature image (same as 9-5). Bottom-left: only the bio paragraph (no avatar or name). Bottom-right: "After Hours" tag.
- Loader on entry: "Sagnik Das / AFTER HOURS".

## Mode switching

- 9-5 → 5-9: fade to black, then the 5-9 loader.
- 5-9 → 9-5: fade to black, then a return loader ("Sagnik Das / WORKING HOURS" with a progress line, about 1.1 s), then the 9-5 page **without** replaying the hero intro.
- With reduced motion the swap is immediate.

## Assets (`public/`)

- Case study 01: `cs-before-analytics.png`, `cs-before-ticket-list.png`, `cs-bulk-actions.png`, `cs-dashboard.png`, `cs-ticket-list.png`, `customer-support-cover.jpg`
- Case study 02: `rec-application.png`, `rec-criteria.png`, `rec-dashboard.png`, `rec-decision.png`, `rec-evidence.png`, `rec-onboarding.png`
- `signature-ink.png` (white ink, transparent; nav on both pages), `signature.png` (older, now unused in src), `favicon.svg`, `icons.svg`
- `personal/Sagnik/1..9.jpg` (hero card photos, resized to 1200 px max edge, quality 80); `personal/{anime,cooking,painting,sports-gaming,travel}/` (5-9 sphere)
- Photos must be re-exported with EXIF rotation applied (PIL `ImageOps.exif_transpose`), not `sips`, or they come out sideways.

## Conventions

- Keep code matching the surrounding style and comment density.
- All copy lives in `data.js` or the case study files, not in components (the hero intro paragraph and button are in `WorkPage.jsx`).
- Don't add emojis to code or UI; no custom cursors for new work.
- Reveal-on-scroll uses `IntersectionObserver` + `.reveal` / `.reveal-in`; always respect `prefers-reduced-motion`.
- `src/developer/index.css` overrides `--font-display` to Instrument Serif inside `.work-theme`; to use Plus Jakarta Sans there, set the font family explicitly.

## Open items / not verified

- Touch scrubbing, the wave timing and the one-time intro have not been tested on a real phone.
- The phone "Contact" button fit on very narrow screens (360 px) was estimated, not seen.
- PDFs of both case studies (text only, one page per slide) were generated once into `~/Downloads`; they are not in the repo and are not regenerated automatically.
- The résumé PDF in `public/` was replaced from `resume/Sagnik_Das.pdf`; its content was not read.
- An ElevenLabs API key was shared earlier for sound generation only; it is not stored in the repo and should be rotated.
