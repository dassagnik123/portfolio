import { ticketDashboardCaseStudy } from "./caseStudy";
import { recruitmentCaseStudy } from "./caseStudyRecruitment";

// Portfolio copy shown at each stop on the path (same words as the 9-5 page on the
// version-5 branch). Keys match the stop labels in path.js.

export const contact = {
  email: "dassagnikdas1999@gmail.com",
  phone: "7595895302",
  linkedin: "https://www.linkedin.com/in/sagnik-das-42b6261a3",
  resume: "/resume.pdf",
};

// The case studies, shown as "levels" in the WORK box (the picker appears once there's more than one). `ready: false` shows a locked
// "in progress" card; add a cover, description and facts when the case study is written.
export const projects = [
  {
    number: "01",
    ready: true,
    cover: "/rec-dashboard.png",
    coverAlt: "The HR dashboard of the Northwind Talent hiring product",
    tags: ["HR tech", "AI workflow", "UI/UX"],
    title: "One place to run hiring, with AI that helps and people who decide",
    description:
      "A hiring product for HR teams, interviewers and candidates: from posting a job to a new hire's first day, with AI that helps and never decides.",
    facts: [
      {
        label: "Role",
        text: "Designer and front-end developer: I planned it, designed it in Figma and built it in React.",
      },
      { label: "Timeline", text: "About 1 week" },
      {
        label: "Outcome",
        text: "A working product, live on the web, with sample data. Not tested with real users yet.",
      },
    ],
    caseStudy: recruitmentCaseStudy,
  },
  {
    number: "02",
    ready: true,
    cover: "/customer-support-cover.jpg",
    coverAlt: "The support-ticket dashboard on a laptop",
    tags: ["UI/UX", "Dashboard", "Customer support"],
    title: "Agents couldn't see which tickets were about to breach — so I made urgency impossible to miss",
    description:
      "A customer-support ticketing dashboard that surfaces SLA-risk, breached and unassigned tickets on login — turning a manual daily scan into an ambient view.",
    facts: [
      {
        label: "Role",
        text: "Solo designer: research, interaction design and UI. Also one of the developers who built it, in React, Next.js and TypeScript.",
      },
      { label: "Timeline", text: "One week, internal sprint" },
      {
        label: "Outcome",
        text: "Shipped. Hypothesized ~20% fewer SLA breaches, ~30% faster prioritization, ~40% less repetitive effort.",
      },
    ],
    caseStudy: ticketDashboardCaseStudy, // opens the full case study page
  },
];

export const skills = [
  {
    label: "Design",
    note: "How I find and shape the problem",
    items: ["Figma", "Wireframing", "Rapid prototyping", "User research", "Interaction design", "User-centred design"],
  },
  {
    label: "Build",
    note: "How I prototype and ship what I design",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML & CSS", "Design-to-code handoff"],
  },
];

// The EXPERIENCE stop: Keross R&D, newest first (shortened from the résumé).
export const experience = [
  {
    role: "Software Engineer, Level 2",
    dates: "Apr 2025 – Present",
    points: [
      "Redesigned and rebuilt the customer support dashboard and ticket list: clearer hierarchy, simpler filters, fewer steps to resolve a ticket.",
      "Designed tender-management and digital-signature flows that turn multi-step work into clear journeys.",
      "Built HRMS portals (exams, onboarding, training, appraisal, exit) in Next.js, React and TypeScript.",
    ],
  },
  {
    role: "Software Engineer, Level 1",
    dates: "Nov 2022 – Apr 2025",
    points: ["Took on more frontend ownership across HRMS and dashboard products, building reusable UI components."],
  },
  {
    role: "Software Engineer Intern",
    dates: "Mar 2022 – Nov 2022",
    points: ["Built UI components in production React and Next.js codebases, guided by senior engineers."],
  },
];

export const about = {
  headline: "I design for the people who use software all day.",
  body: "A frontend engineer moving into UX. For 4+ years I've worked where design meets code on B2B dashboards, support tools, procurement flows, HR portals and multi-access portals, and what I care about most is turning complex, multi-role workflows into interfaces teams can move through without thinking.",
};

// The HOBBIES stop: one animated pixel scene each (Hobbies.jsx draws them), plus my own photos
// from public/personal/<folder> (thumbs/ holds the small copies, built by scripts/make-thumbs.sh).
const photoSet = (folder, count) =>
  Array.from({ length: count }, (_, i) => ({
    thumb: `/personal/${folder}/thumbs/${i + 1}.jpg`,
    full: `/personal/${folder}/${i + 1}.jpg`,
  }));

export const hobbiesIntro = "Off the clock I'm all about travel, sketching, anime, cooking and games.";

export const hobbies = [
  {
    key: "travel",
    photos: photoSet("travel", 16),
    label: "TRAVEL",
    title: "Travelling",
    note: "Trips half-planned in a notes app and finished somewhere on the road.",
  },
  {
    key: "painting",
    photos: photoSet("painting", 6),
    label: "PAINTING",
    title: "Pen & sketch",
    note: "Mostly a pen and a sketchbook. Quick drawings of whatever the day gives me.",
  },
  {
    key: "anime",
    photos: photoSet("anime", 17),
    label: "ANIME",
    title: "Watching anime",
    note: "Whatever anime is mid-season right now, plus the ones I keep coming back to.",
  },
  {
    key: "cooking",
    photos: photoSet("cooking", 6),
    label: "COOKING",
    title: "Cooking",
    note: "Something new on the stove most weekends. Some of it works; all of it gets eaten.",
  },
  {
    key: "sports",
    photos: photoSet("sports-gaming", 9),
    label: "SPORTS",
    title: "Sports",
    note: "Football and cricket, playing them when I can and watching every big match when I can't.",
  },
  {
    key: "games",
    photos: [],
    label: "GAMES",
    title: "Playing games",
    note: "A quick round on my phone wherever I am: in a queue, on a train, or \"just one more\" before bed.",
  },
];
