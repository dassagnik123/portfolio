import { ticketDashboardCaseStudy } from "./caseStudy";

export const modes = {
  work: {
    key: "work",
    toggleLabel: "9-5",
    badges: ["PROBLEM SOLVER", "PRODUCT DESIGNER", "USER-FIRST"],
    name: ["Sagnik", "Das"],
    lead:
      "UX & Product Designer — but above all, a problem solver turning real challenges into intuitive experiences.",
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

export const projects = [
  {
    number: "01",
    large: true,
    filled: true,
    tags: ["UI/UX", "SAAS", "DASHBOARD", "CUSTOMER SUPPORT"],
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

export const hobbyColumns = [
  [
    { label: "Cooking", emoji: "🍳", color: "#f6c98a", rotate: -6 },
    { label: "Anime", emoji: "📺", color: "#b9c6f5", rotate: 5 },
    { label: "Travel", emoji: "✈️", color: "#a3ded4", rotate: -5 },
  ],
  [
    { label: "Painting", emoji: "🎨", color: "#f5a9c0", rotate: 4 },
    { label: "Music", emoji: "🎧", color: "#f6d675", rotate: -4 },
    { label: "Photography", emoji: "📷", color: "#f3b8d6", rotate: 3 },
  ],
  [
    { label: "Cricket", emoji: "🏏", color: "#a9d99b", rotate: -3 },
    { label: "Gaming", emoji: "🎮", color: "#c9b3ef", rotate: 6 },
  ],
];
