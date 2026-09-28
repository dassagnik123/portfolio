import { ticketDashboardCaseStudy } from "./caseStudy";

export const modes = {
  work: {
    key: "work",
    toggleLabel: "9-5",
    badges: ["PROBLEM SOLVER", "PRODUCT DESIGNER", "USER-FIRST"],
    name: ["Sagnik", "Das"],
    roles: ["UX Designer", "Product Designer", "UX Engineer"],
    lead:
      " — but above all, a problem solver turning real challenges into intuitive experiences.",
    sub:
      "I dig into how people actually work, find where the friction is, and design the structure that removes it — then ship it.",
  },
  personal: {
    key: "personal",
    toggleLabel: "5-9",
    badges: ["HOME COOK", "WEEKEND PAINTER", "ANIME BINGER"],
    name: ["Sagnik", "Das"],
    lead:
      "Off the clock, I'm just Sagnik — cooking something new, messing around with paint, or yelling at a cricket match.",
    sub:
      "Usually got a playlist running, an anime mid-season, and a trip half-planned in some notes app.",
  },
};

export const contact = {
  email: "dassagnikdas1999@gmail.com",
  phone: "7595895302",
};

export const socials = {
  linkedin: "https://www.linkedin.com/in/sagnik-das-42b6261a3",
  resume: "/resume.pdf",
};

export const projects = [
  {
    number: "01",
    large: true,
    filled: true,
    tags: ["UI/UX", "SAAS", "DASHBOARD", "CUSTOMER SUPPORT"],
    cover: "/customer-support-cover.jpg",
    title:
      "Agents couldn't see which tickets were about to breach — so I made urgency impossible to miss",
    description:
      "A customer-support ticketing dashboard that surfaces SLA-risk, breached, and unassigned tickets on login — turning a manual daily scan into an ambient view.",
    caseStudy: ticketDashboardCaseStudy,
  },
  {
    number: "02",
    large: false,
    filled: false,
    slotLabel: "restaurant app",
    tags: ["UI/UX", "RESEARCH"],
    title: "Mukherjee Restaurant: table booking app",
  },
  {
    number: "03",
    large: false,
    filled: false,
    slotLabel: "dashboard redesign",
    tags: ["SAAS", "DASHBOARD"],
    title: "Google Analytics dashboard redesign",
  },
];

function imageSet(slug, count) {
  return Array.from({ length: count }, (_, i) => `/personal/${slug}/${i + 1}.jpg`);
}

export const hobbies = [
  {
    label: "Cooking",
    emoji: "🍳",
    color: "#f6c98a",
    rotate: -6,
    offset: 6,
    shiftX: -14,
    stagger: 8,
    images: imageSet("cooking", 6),
  },
  {
    label: "Travel",
    emoji: "✈️",
    color: "#a3ded4",
    rotate: -13,
    offset: 12,
    shiftX: 10,
    stagger: 38,
    images: imageSet("travel", 16),
  },
  {
    label: "Anime",
    emoji: "📺",
    color: "#b9c6f5",
    rotate: 7,
    offset: -16,
    shiftX: 18,
    stagger: -16,
    images: imageSet("anime", 17),
  },
  {
    label: "Painting",
    emoji: "🎨",
    color: "#f5a9c0",
    rotate: -16,
    offset: -14,
    shiftX: -20,
    stagger: 20,
    images: imageSet("painting", 6),
  },
  {
    label: "Sports & Gaming",
    emoji: "🎮",
    color: "#c9b3ef",
    rotate: 4,
    offset: -12,
    shiftX: 14,
    stagger: -28,
    images: imageSet("sports-gaming", 9),
  },
];

const hobbyNotes = {
  Cooking: "Something new on the stove most weekends. Some of it works; all of it gets eaten.",
  Travel: "Trips half-planned in a notes app and finished somewhere on the road.",
  Anime: "Whatever is mid-season right now, plus the ones I keep coming back to.",
  Painting: "Messing around with paint — no plan, just seeing where the colour goes.",
  "Sports & Gaming": "A cricket match on the TV, a controller in hand, and a lot of yelling at both.",
};

// Round-robin across hobbies so every part of the sphere mixes them.
function interleave(groups) {
  const out = [];
  const longest = Math.max(...groups.map((g) => g.length));
  for (let i = 0; i < longest; i++) {
    for (const group of groups) if (group[i]) out.push(group[i]);
  }
  return out;
}

export const archive = {
  name: ["Sagnik", "Das"],
  headline: ["What", "I", "Do", "After", "Five"],
  tag: "After Hours 2026",
  bio: modes.personal.lead.trim(),
  avatar: "/signature.png",
  shots: interleave(
    hobbies.map((hobby) =>
      hobby.images.map((src, i) => ({
        src,
        title: `${hobby.label} ${String(i + 1).padStart(2, "0")}`,
        place: `5-9 · ${hobby.label}`,
        note: hobbyNotes[hobby.label],
      })),
    ),
  ),
};
