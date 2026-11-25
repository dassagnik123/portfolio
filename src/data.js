// Site copy. Case study text is the author's own (from the earlier version of the site).

export const projects = [
  {
    number: "01",
    slug: "customer-support",
    title: "Agents couldn't see which tickets were about to breach — so I made urgency impossible to miss",
    description:
      "A customer-support ticketing dashboard that surfaces SLA-risk, breached, and unassigned tickets on login — turning a manual daily scan into an ambient view.",
    image: "/projects/cs-dashboard.png",
    video: "/projects/customer-support-walkthrough.mp4",
    videoRatio: "1440 / 1024",
    imageAlt: "Support dashboard with SLA-at-risk and unassigned ticket queues, workload tiles and status charts",
    tags: ["UI/UX", "Dashboard", "Customer Support"],
    meta: [
      { label: "Company", text: "Keross R&D" },
      { label: "Role", text: "UI/UX Designer & Developer" },
      { label: "Timeline", text: "2 weeks" },
      { label: "Status", text: "In use by the development team" },
    ],
  },
  {
    number: "02",
    slug: "hiring",
    title: "One place to run hiring, with AI that helps and people who decide",
    description:
      "A recruitment and onboarding product for HR teams, interviewers and candidates: from posting a job to a new hire's first day, with AI that helps and never decides.",
    image: "/projects/rec-dashboard.png",
    video: "/projects/keross-walkthrough.mp4",
    videoRatio: "16 / 9",
    imageAlt: "Keross recruitment dashboard showing open roles, candidates by stage and upcoming interviews",
    tags: ["HR Tech", "AI Workflow", "UI/UX"],
    meta: [
      { label: "Company", text: "Keross R&D" },
      { label: "Role", text: "UI/UX Designer & Front-end Developer" },
      { label: "Timeline", text: "About 2 months" },
      { label: "Status", text: "Prototype, in development" },
    ],
    link: { label: "Live demo", href: "https://recruitment-onboarding-alpha.vercel.app/hr" },
  },
];

export const experience = [
  {
    role: "Software Engineer, Level 2",
    company: "Keross R&D",
    dates: "Apr 2025 – Oct 2026",
    points: [
      "Redesigned and rebuilt the customer support dashboard and ticket list: clearer hierarchy, simpler filters, fewer steps to resolve a ticket.",
      "Designed tender-management and digital-signature flows that turn multi-step work into clear journeys.",
      "Built HRMS portals (exams, onboarding, training, appraisal, exit) in Next.js, React and TypeScript.",
    ],
  },
  {
    role: "Software Engineer, Level 1",
    company: "Keross R&D",
    dates: "Nov 2022 – Apr 2025",
    points: ["Took on more frontend ownership across HRMS and dashboard products, building reusable UI components."],
  },
  {
    role: "Software Engineer Intern",
    company: "Keross R&D",
    dates: "Mar 2022 – Nov 2022",
    points: ["Built UI components in production React and Next.js codebases, guided by senior engineers."],
  },
];

export const contact = {
  email: "dassagnikdas1999@gmail.com",
  phone: "7595895302",
  linkedin: "https://www.linkedin.com/in/sagnik-das-42b6261a3",
  resume: "/resume.pdf",
};

// About me: the personal photos in public/personal/<slug>/N.jpg (small copies in .../thumbs/N.jpg).
export const about = {
  lead: "Off the clock, I'm just Sagnik — cooking something new, messing around with paint, or yelling at a cricket match.",
  sub: "Usually got a playlist running, an anime mid-season, and a trip half-planned in some notes app.",
};

const photoSet = (slug, count) =>
  Array.from({ length: count }, (_, i) => {
    const src = `/personal/${slug}/${i + 1}.jpg`;
    return { src, thumb: `/personal/${slug}/thumbs/${i + 1}.jpg` };
  });

export const hobbies = [
  {
    slug: "travel",
    label: "Travel",
    note: "Trips half-planned in a notes app and finished somewhere on the road.",
    photos: photoSet("travel", 16),
  },
  {
    slug: "cooking",
    label: "Cooking",
    note: "Something new on the stove most weekends. Some of it works; all of it gets eaten.",
    photos: photoSet("cooking", 6),
  },
  {
    slug: "painting",
    label: "Painting",
    note: "Messing around with paint — no plan, just seeing where the colour goes.",
    photos: photoSet("painting", 6),
  },
  {
    slug: "anime",
    label: "Anime",
    note: "Whatever is mid-season right now, plus the ones I keep coming back to.",
    photos: photoSet("anime", 17),
  },
  {
    slug: "sports-gaming",
    label: "Sports & Gaming",
    note: "A cricket match on the TV, a controller in hand, and a lot of yelling at both.",
    photos: photoSet("sports-gaming", 9),
  },
];
