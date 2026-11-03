export const ticketDashboardCaseStudy = {
  title:
    "Agents couldn't see which tickets were about to breach — so I made urgency impossible to miss",
  created: "February 16, 2026 · 11:16 AM",
  duration: "1 week",
  tags: ["Customer Support", "Dashboard", "UI/UX"],
  overview: [
    {
      label: "Role",
      text: "Solo designer — I did the research, the interaction design and the UI. I was also one of the developers who built it, in the product's React, Next.js and TypeScript codebase",
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
      text: "Shipped. We're a small team and didn't track numbers, but we saw tickets getting resolved better and less manual work for agents.",
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
        { type: "p", text: "Three habits:" },
        {
          type: "ul",
          items: [
            "**Read and guess** — ranking the whole table in their head every shift",
            "**Double-checking** — opening tickets just to see how urgent they were",
            "**One at a time** — the same update applied ticket by ticket",
          ],
        },
      ],
    },
    {
      heading: "Key insights",
      blocks: [
        {
          type: "p",
          text: "**What surprised me.** I thought they'd ask for better filters — more controls, more ways to slice the list. They didn't want to deal with filters at all. They wanted the tool to work out what was urgent so they could get straight to fixing things. That changed the brief from \"help them find the urgent tickets faster\" to \"put the urgent tickets in front of them\".",
        },
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
      heading: "Process",
      blocks: [
        {
          type: "p",
          text: "I did this in two rounds instead of trying to get it right first time.",
        },
        {
          type: "ul",
          items: [
            "**1. Talk to the agents.** Short conversations with the people who work the queue every day, to see their routine rather than guess it.",
            "**2. Round 1: show urgency in the list.** An SLA status column and filters for at-risk and unclaimed tickets.",
            "**3. See where it falls short.** The filters had to be set up again every day, and a filtered list still had no limit.",
            "**4. Round 2: a dashboard that does the sorting.** The most urgent and unclaimed tickets, waiting for the agent at login.",
            "**5. Build it.** I was also one of the developers, so I built it in the product's existing Next.js, React and TypeScript codebase.",
          ],
        },
      ],
    },
    {
      heading: "The design",
      blocks: [
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
          text: "**Round 2 — a dashboard that does the sorting.** Nothing to filter, nothing to set up; it's the first thing agents see when they log in:",
        },
        {
          type: "ul",
          items: [
            "**The five most urgent tickets**, grouped by SLA status. Clear one and the next most urgent moves up.",
            "**A second table for high-priority and unclaimed tickets**, so nothing important sits without an owner.",
            "**Small widgets showing who's carrying what**, so an agent can plan a shift in a few seconds.",
          ],
        },
        {
          type: "image",
          src: "/cs-dashboard.png",
          alt: "Dashboard showing SLA-at-risk and unassigned ticket tables, workload stat tiles, and a ticket status breakdown, all visible at login",
          caption:
            "Round 2 — the dashboard surfaces the most urgent and unclaimed tickets at login, capped so it stays actionable, alongside workload stats at a glance.",
        },
        {
          type: "p",
          text: "**Bulk actions** took care of the repetitive updates that used to eat into fixing time.",
        },
        {
          type: "image",
          src: "/cs-bulk-actions.png",
          alt: "Ticket list with a Take Action menu open, showing Change Status and Assign as bulk actions applied to several selected rows",
          caption:
            "Selecting multiple tickets surfaces bulk actions — status changes and assignment no longer need to be done one row at a time.",
        },
      ],
    },
    {
      heading: "Key decisions",
      blocks: [
        {
          type: "ul",
          items: [
            "**A dashboard, not saved filters.** Getting to the urgent tickets took a few clicks, had to be redone every day, and only answered one question at a time. Saved filters were the obvious fix, but they would have meant backend work I didn't have time for in a week. They also had a speed problem: our data API is slow, and a saved filter has to be fetched first, then the tickets fetched with it, one after the other. That would have made the first screen slower every day. The dashboard avoids that. It loads its own short list of urgent tickets while the full ticket list loads in the background, so agents see something useful straight away.",
            "**Five tickets, not the full list.** Even filtered, the list had no limit — on a busy day it was a wall of at-risk rows. Five is about as many as an agent can act on at once, so the list never becomes another wall.",
            "**Keep the SLA column.** The dashboard added to round 1 rather than replacing it, so urgency still reads in the full list.",
          ],
        },
        {
          type: "quote",
          text: "Knowing how it would be built shaped what I designed — the dashboard exists partly because I knew what the week could and couldn't hold.",
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
            "**Saved filters vs a dashboard** — saving filters was cheaper to design, but it needed backend work and would have made a slow API slower, because the filter has to load before the tickets; the dashboard is one more screen to maintain, but it loads alongside the ticket list and answers several questions at once",
            "**Five tickets vs the full list** — capping it keeps things manageable, but an agent can't tell how big the at-risk pile is without opening the full list",
          ],
        },
      ],
    },
    {
      heading: "Impact",
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
          src: "/cs-dashboard.png",
          alt: "Redesigned dashboard showing SLA-at-risk and unassigned ticket tables plus workload stat tiles at login",
          caption:
            "**After** — the dashboard opens straight into at-risk, breached and unclaimed tickets, with workload visible at a glance.",
        },
        {
          type: "p",
          text: "The change shipped. We're a small company and didn't measure it formally, so I won't quote percentages. What we saw in day-to-day use:",
        },
        {
          type: "p",
          text: "**Better ticket resolution**, because urgent tickets were in front of agents instead of buried in the list · **Less manual work**, because bulk actions replaced one-by-one updates",
        },
      ],
    },
    {
      heading: "What I learned",
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
