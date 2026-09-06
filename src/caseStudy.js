export const ticketDashboardCaseStudy = {
  title:
    "Agents couldn't see which tickets were about to breach — so I made urgency impossible to miss",
  created: "February 16, 2026 · 11:16 AM",
  duration: "1 week",
  tags: ["Customer Support", "Dashboard", "SaaS", "UI/UX"],
  overview: [
    {
      label: "Role",
      text: "Solo designer — I did the research, the interaction design, the UI and the prototype",
    },
    { label: "Timeline", text: "One week, internal sprint" },
    {
      label: "Product",
      text: "An internal tool support agents use to work through customer tickets before the SLA clock runs out",
    },
    {
      label: "Problem",
      text: "The SLA data was there, but you couldn't see it. Agents read through the whole queue every shift to work out what to do first, and tickets still went past their deadline.",
    },
    {
      label: "What I did",
      text: "Two rounds. First I added an SLA status column and filters to the ticket list. Then I built a dashboard that shows the five most urgent, breached and unclaimed tickets the moment an agent logs in, plus bulk actions. Now the system does the sorting, not the agent.",
    },
    {
      label: "Outcome",
      text: "Shipped, but impact wasn't formally measured. Hypothesized: ~20% fewer SLA breaches, ~30% faster prioritization, ~40% less repetitive effort.",
    },
  ],
  sections: [
    {
      heading: "The problem",
      blocks: [
        {
          type: "p",
          text: "This is an internal support tool at a B2B company. Every ticket already had an SLA countdown on it — it just wasn't easy to see. Agents couldn't tell which tickets were closest to missing their deadline, so they read through and re-sorted the queue by hand at the start of every shift. Tickets still slipped.",
        },
        {
          type: "p",
          text: "Three reasons: nothing on screen told you what was urgent, nothing pushed risky or unclaimed tickets in front of you, and there was no way to update more than one ticket at a time.",
        },
      ],
    },
    {
      heading: "The goal",
      blocks: [
        {
          type: "ul",
          items: [
            "Make it obvious at a glance which tickets are about to miss their deadline",
            "Sort the queue for the agent instead of handing them a flat list",
            "Cut the repetitive clicking with bulk actions",
          ],
        },
        {
          type: "p",
          text: "**How I'd check it worked:** how many tickets miss their SLA · how long from opening the tool to acting on the first ticket · how many one-by-one updates an agent makes per shift · how quickly high-priority and unclaimed tickets get picked up.",
        },
      ],
    },
    {
      heading: "Research",
      blocks: [
        {
          type: "p",
          text: "I only had a week, so I kept it simple: short conversations with 2–3 of the agents who use the tool every day. They all described the same routine — read the whole table, work out in their head what to do first, do it again next shift, then apply the same update to one ticket after another.",
        },
        {
          type: "p",
          text: "**What surprised me.** I thought they'd ask for better filters — more controls, more ways to slice the list. They didn't want to deal with filters at all. They wanted the tool to work out what was urgent so they could get straight to fixing things. That changed the brief from \"help them find the urgent tickets faster\" to \"put the urgent tickets in front of them\" — which is what the second round is built on.",
        },
        { type: "p", text: "Three habits, three fixes:" },
        {
          type: "ul",
          items: [
            "**Read and guess** — ranking the whole table in their head every shift → a dashboard that puts the riskiest tickets up front at login",
            "**Double-checking** — opening tickets just to see how urgent they were → an SLA status column in the list",
            "**One at a time** — the same update applied ticket by ticket → bulk actions",
          ],
        },
      ],
    },
    {
      heading: "Jobs to be done",
      blocks: [
        {
          type: "p",
          text: "**Main job:** When I start my shift and the queue is full, I want to know which tickets are closest to missing their deadline, so I can start with those instead of reading every row.",
        },
        {
          type: "p",
          text: "**Second job:** When I'm handling a lot of tickets at once, I want to update them in one go, so the busywork doesn't eat the time I need for actual fixes.",
        },
        {
          type: "quote",
          text: "There's a catch hidden in the main job — and don't make me set it up every time. That's the line that turned the design from a saved filter into a dashboard.",
        },
      ],
    },
    {
      heading: "The design",
      blocks: [
        {
          type: "p",
          text: "I did this in two rounds instead of trying to get it right first time.",
        },
        {
          type: "p",
          text: "**Round 1 — show urgency in the list.** I added an SLA Status column with clear colour cues, plus filters for at-risk and unclaimed tickets, so agents could judge urgency without opening anything.",
        },
        {
          type: "image",
          src: "/cs-ticket-list.png",
          alt: "Redesigned ticket list with an SLA Status column as the leftmost field",
          caption:
            "Round 1 — an SLA Status column leads every row, so urgency reads without opening a ticket.",
        },
        {
          type: "p",
          text: "**Where it fell short.** Getting to the urgent tickets took a few clicks, had to be redone every day, and only answered one question at a time. And even filtered, the list had no limit — on a busy day it was a wall of at-risk rows, which is the same reading problem in a different place.",
        },
        {
          type: "p",
          text: "Just saving the filters would have been the cheap fix, but they reset whenever the page reloaded, and making them stick meant backend work I didn't have time for in a week. That's what pushed me towards a dashboard — and it turned out to be the better answer anyway.",
        },
        {
          type: "p",
          text: "**Round 2 — a dashboard that does the sorting.** Nothing to filter, nothing to set up; it's the first thing agents see when they log in:",
        },
        {
          type: "ul",
          items: [
            "**The five most urgent tickets**, grouped by SLA status. Five is about as many as an agent can act on at once, so the list never becomes another wall of rows — and it refills itself: clear one and the next most urgent moves up.",
            "**A second table for high-priority and unclaimed tickets**, so nothing important sits without an owner.",
            "**Small widgets showing who's carrying what**, so an agent can plan a shift in a few seconds.",
          ],
        },
        {
          type: "image",
          src: "/cs-dashboard-sla-table.png",
          alt: "Dashboard prioritization tables showing the most at-risk and unclaimed tickets, each capped to a short list",
          caption:
            "Round 2 — the dashboard surfaces the most urgent and unclaimed tickets at login, capped so it stays actionable.",
        },
        {
          type: "p",
          text: "The SLA column from round 1 stayed — the dashboard added to it rather than replacing it. Bulk actions took care of the repetitive updates that used to eat into fixing time.",
        },
      ],
    },
    {
      heading: "Constraints & trade-offs",
      blocks: [
        {
          type: "ul",
          items: [
            "One week, in-house, with no time set aside for proper research or testing",
            "Built on the platform and data that already existed — the SLA information was there, so this was about showing and using it, not changing the backend",
            "**Saved filters vs a dashboard** — saving filters was cheaper but wasn't possible in the time; the dashboard is one more screen to maintain, but it answers several questions at once",
            "**Five tickets vs the full list** — capping it keeps things manageable, but an agent can't tell how big the at-risk pile is without opening the full list",
          ],
        },
      ],
    },
    {
      heading: "Before → after",
      blocks: [
        {
          type: "p",
          text: "**Before** — no single place to start, agents landed straight in the ticket list, and urgent tickets never came to them.",
        },
        {
          type: "p",
          text: "**After** — the dashboard is the first thing they see, at-risk, breached and unclaimed tickets are grouped for them, and workload is visible at a glance.",
        },
        {
          type: "image",
          src: "/cs-before-ticket-list.png",
          alt: "Original ticket list packed with creation and issue date/time columns and no SLA urgency indicator",
          caption:
            "**Before** — the old list led with timestamps; nothing flagged which tickets were close to breaching.",
        },
        {
          type: "image",
          src: "/cs-before-analytics.png",
          alt: "Original summary view with donut charts breaking tickets down by type, severity, and status",
          caption:
            "**Before** — the summary view aggregated tickets by type and severity, but never surfaced the ones at risk.",
        },
      ],
    },
    {
      heading: "Estimated impact",
      blocks: [
        {
          type: "p",
          text: "The change shipped, but impact wasn't formally measured — there was no dedicated validation phase in the timeframe. These are my estimates, based on the steps the design takes out of an agent's day:",
        },
        {
          type: "p",
          text: "**~20% fewer missed SLAs** · **~30% faster to decide what to work on** · **~40% less repetitive manual work**",
        },
      ],
    },
    {
      heading: "Reflection",
      blocks: [
        {
          type: "p",
          text: "The real lesson wasn't the dashboard, it was the second round. My first fix was sensible and solved the obvious problem, but the feedback showed it had quietly created a new one: setup work every day, and a filtered list too long to act on. The dashboard came out of taking that seriously instead of defending what I'd already made.",
        },
        {
          type: "p",
          text: "With more time I'd test it properly — the simplest check being whether an agent can spot their most urgent ticket within ten seconds of opening the dashboard.",
        },
        {
          type: "p",
          text: "The bigger takeaway: the information was already in the product. The design's job was to do something with it, so the agent didn't have to ask twice.",
        },
      ],
    },
  ],
};
