export const ticketDashboardCaseStudy = {
  title:
    "Agents couldn't see which tickets were about to breach — so I made urgency impossible to miss",
  created: "February 16, 2026 · 11:16 AM",
  duration: "1 week",
  tags: ["Customer Support", "Dashboard", "SaaS", "UI/UX"],
  sections: [
    {
      heading: "The Product",
      blocks: [
        {
          type: "p",
          text: "This Customer Support Platform is an internal tool designed to help support teams manage, track, and resolve customer issues efficiently. It enables agents to handle tickets, manage escalations, assign ownership, and monitor resolution status. It is used by support agents and operations managers to streamline support workflows and ensure timely issue resolution.",
        },
      ],
    },
    {
      heading: "The Problem",
      blocks: [
        {
          type: "p",
          text: "**SLA data was tracked — but urgency wasn't visible.** Agents couldn't quickly spot which tickets were closest to breaching, so they had to manually scan and prioritize the queue each shift. In a B2B context, that delay increases SLA misses and erodes customer trust.",
        },
        {
          type: "p",
          text: "Three things drove the problem: weak prioritization cues, no proactive surfacing of high-risk/unassigned tickets, and no way to act on multiple tickets at once.",
        },
      ],
    },
    {
      heading: "The Goal",
      blocks: [
        {
          type: "ul",
          items: [
            "Introduce a prioritization layer through a structured dashboard",
            "Improve urgency visibility using clear SLA indicators",
            "Reduce manual workload with bulk action functionality",
            "Decrease cognitive load in high-ticket-volume environments",
            "Enable faster decision-making for agents",
          ],
        },
      ],
    },
    {
      heading: "Target Metrics",
      blocks: [
        {
          type: "ul",
          items: [
            "**SLA breach rate** — % of tickets breaching SLA per period",
            "**Time-to-prioritize** — seconds from opening the dashboard to acting on the first ticket (and whether agents still need to manually filter to get there)",
            "**Manual action volume** — number of individual (non-bulk) ticket updates per shift",
            "**Response time on high-priority / unassigned tickets** — time-to-first-action",
          ],
        },
      ],
    },
    {
      heading: "Research & Assumption Validation",
      blocks: [
        { type: "h3", text: "Research Approach" },
        {
          type: "p",
          text: "Given the rapid one-week internal improvement sprint, I adopted a lean research approach focused on speed and clarity. I conducted quick qualitative discussions with 2–3 support team members to understand their daily workflow, decision-making patterns, and SLA management challenges.",
        },
        { type: "h3", text: "Initial Assumptions" },
        { type: "p", text: "Before conversations, I hypothesized:" },
        {
          type: "ul",
          items: [
            "SLA breaches may be occurring due to weak urgency visibility rather than lack of tracking",
            "Agents might be manually scanning the ticket list to determine priorities",
            "Repetitive ticket updates could be slowing down resolution time",
            "High-priority or unassigned tickets might not be proactively surfaced",
          ],
        },
        { type: "h3", text: "Key Findings" },
        { type: "p", text: "From team discussions, I validated that:" },
        {
          type: "ul",
          items: [
            "Agents relied heavily on scanning the full ticket table to identify urgent tickets",
            "SLA status was available but not visually prominent enough to guide quick action",
            "There was no structured way to surface high-risk or unassigned tickets at a glance",
            "Lack of bulk action functionality increased repetitive manual effort",
          ],
        },
        {
          type: "p",
          text: "These insights revealed that the issue was not a lack of information — but a lack of structured prioritization and actionable visibility.",
        },
        {
          type: "p",
          text: "**What surprised me.** I expected agents to ask for better filtering — more controls, more ways to slice the list. Instead, they didn't want to think about filtering at all: they wanted the system to do the triage so they could just start resolving. That flipped the brief from \"give them better tools to find urgent tickets\" to \"surface the urgent tickets for them\" — the insight iteration 2 is built on.",
        },
      ],
    },
    {
      heading: "Behavioral Patterns",
      blocks: [
        {
          type: "p",
          text: "Three repeating behaviors surfaced in conversation — each a symptom of the visibility gap, and each a target for the redesign:",
        },
        {
          type: "ul",
          items: [
            "**Scan-and-guess** — agents read the entire ticket table to mentally rank what to do first, redoing this judgment from scratch each shift.",
            "**Re-check loop** — to confirm urgency, agents opened and tab-hopped between individual tickets rather than trusting the list.",
            "**One-at-a-time grind** — identical updates (status, assignment) were applied ticket by ticket, multiplying mechanical effort during high-volume shifts.",
          ],
        },
      ],
    },
    {
      heading: "Jobs To Be Done",
      blocks: [
        {
          type: "p",
          text: "**Primary job:** When I start my shift facing a full queue, I want to know which tickets will breach soonest — so I can act on the highest-risk ones without reading every row.",
        },
        {
          type: "p",
          text: "**Secondary job:** When I'm juggling many tickets under time pressure, I want to clear repetitive updates in one move — so mechanical work doesn't eat into resolution time.",
        },
        {
          type: "quote",
          text: "The brief that drove iteration 2: the primary job hides a constraint — do it without making me set it up every time. That one line is what pushed the design from a saved filter to a dashboard.",
        },
      ],
    },
    {
      heading: "Pain-Point Clusters → Opportunities",
      blocks: [
        {
          type: "p",
          text: "Grouping the findings into themes made the design response obvious. Each cluster became a \"How Might We,\" and each became a concrete design move:",
        },
        {
          type: "ul",
          items: [
            "**Sensemaking** (urgency invisible until you dig) → HMW make SLA urgency legible without opening a ticket? → SLA status column in the ticket list.",
            "**Triage** (no way to surface high-risk or unassigned tickets, and re-filtering daily was tedious) → HMW make the riskiest tickets surface themselves, with no daily setup? → Dashboard that auto-surfaces a bounded set of SLA-risk, high-priority, and unassigned tickets.",
            "**Execution cost** (repetitive one-by-one updates) → HMW cut the cost of repetitive multi-ticket actions? → Bulk actions.",
          ],
        },
      ],
    },
    {
      heading: "User Persona — Support Agent",
      blocks: [
        {
          type: "fields",
          items: [
            "**Name:** Rahul Sharma",
            "**Role:** Customer Support Executive",
            "**Experience:** 2–4 years",
            "**Environment:** B2B SaaS company (internal support team)",
          ],
        },
        { type: "h3", text: "Goals" },
        {
          type: "ul",
          items: [
            "Resolve tickets within SLA timelines",
            "Quickly identify high-priority and urgent issues",
            "Manage multiple tickets efficiently",
            "Maintain consistent response quality",
          ],
        },
        { type: "h3", text: "Pain Point" },
        {
          type: "ul",
          items: [
            "Difficulty identifying which ticket needs immediate attention",
            "SLA status is not clearly visible at a glance",
            "Needs to manually scan and sort through tickets",
            "Repetitive actions while managing multiple tickets",
            "Risk of missing important or unassigned tickets",
          ],
        },
        { type: "h3", text: "Behavior" },
        {
          type: "ul",
          items: [
            "Starts the day by opening the ticket list",
            "Relies on manual scanning to prioritize work",
            "Frequently switches between tickets to check urgency",
            "Handles multiple tickets simultaneously under time pressure",
          ],
        },
        { type: "h3", text: "Quote" },
        {
          type: "quote",
          text: "I spend a lot of time figuring out which ticket to pick first instead of actually resolving them.",
        },
        { type: "h3", text: "How this persona shaped the design" },
        {
          type: "ul",
          items: [
            "Starts the day scanning the list to prioritize → the dashboard's bounded top-5 does that triage on login, so the manual scan isn't needed.",
            "Switches between tickets to re-check urgency → the SLA status column makes urgency legible in the list, removing the re-check loop.",
            "Repetitive actions across many tickets → bulk actions cut the per-ticket grind.",
            "Doesn't want to manage filters → the dashboard surfaces urgency automatically instead of relying on a saved filter.",
          ],
        },
      ],
    },
    {
      heading: "The Design",
      blocks: [
        {
          type: "p",
          text: "To address SLA breaches and prioritization confusion, I worked in two iterations rather than designing the final solution up front.",
        },
        {
          type: "p",
          text: "**Iteration 1 — make urgency visible in the ticket list.** My first fix was the most direct one: I added an SLA status column to the ticket list and let agents filter to SLA-risk or unassigned tickets. This made urgency legible without opening each ticket.",
        },
        {
          type: "p",
          text: "**The friction it created.** In informal follow-up with 2–3 agents, two problems surfaced. First, reaching the urgent set meant several clicks, re-applied every single day, and it answered only one dimension at a time (SLA risk or unassigned). Second, even once filtered, the result was an unbounded list — on a busy day, a wall of dozens of \"at risk\" rows that just relocated the original scanning problem. The information was available, but neither ambient nor bounded.",
        },
        {
          type: "p",
          text: "**The obvious fix — and why it didn't ship.** The simplest answer was to persist each agent's SLA-risk / unassigned filters so they'd carry across shifts — no dashboard required. But filters were session-based and reset on reload, and making them persist meant data-layer work that wasn't feasible in the timeframe. That constraint is what pushed me toward a dashboard — and it turned out to be the more capable answer.",
        },
        {
          type: "p",
          text: "**Iteration 2 — a dashboard that surfaces urgency automatically.** Rather than re-running a single saved query, the dashboard surfaces several urgency dimensions at once — SLA-risk, breached, unassigned, high-priority, and workload — in one ambient view agents see on login. The constraint pushed the solution toward something more useful than a saved filter would have been.",
        },
        {
          type: "p",
          text: "The walkthrough below covers the final design, surface by surface.",
        },
      ],
    },
    {
      heading: "The Ticket List",
      blocks: [
        {
          type: "p",
          text: "**Iteration 1 — where it started.** Before the dashboard existed, the ticket list was the first place I made urgency visible: an SLA status column plus the ability to filter to SLA-risk or unassigned tickets. It improved execution, but the daily re-filtering friction it created is what led to the dashboard below.",
        },
        { type: "h3", text: "SLA Status Column" },
        {
          type: "p",
          text: "I introduced a dedicated SLA Status column with clear visual indicators to make urgency visible directly within the ticket list.",
        },
        {
          type: "p",
          text: "Designed to:",
        },
        {
          type: "ul",
          items: [
            "Remove the need to open a ticket to gauge urgency",
            "Speed up scanning",
            "Improve prioritization within the list",
          ],
        },
        { type: "h3", text: "Bulk Actions" },
        {
          type: "p",
          text: "To reduce repetitive manual work, I added bulk action functionality, allowing agents to update multiple tickets simultaneously.",
        },
        {
          type: "p",
          text: "Designed to:",
        },
        {
          type: "ul",
          items: [
            "Eliminate repetitive one-by-one ticket updates",
            "Enable faster batch resolution during high-volume shifts",
            "Reduce cognitive overhead when managing many tickets at once",
          ],
        },
      ],
    },
    {
      heading: "The Dashboard",
      blocks: [
        {
          type: "p",
          text: "The dashboard surfaces a bounded set of the most critical tickets the moment an agent logs in — no filtering, no setup.",
        },
        { type: "h3", text: "SLA-Based Prioritization Table" },
        {
          type: "p",
          text: "Instead of an unbounded filtered list, this surfaces only the **top 5 most at-risk tickets**, grouped by SLA status (Safe, At Risk, Breached). Capping the list at what an agent can act on avoids the overwhelm of a long filtered result — urgency becomes immediately actionable without manual filtering.",
        },
        {
          type: "p",
          text: "Why this matters:",
        },
        {
          type: "ul",
          items: [
            "Removes the daily re-filter step and caps the list at what an agent can act on",
            "Makes urgency visible instantly",
            "Reduces SLA misses",
          ],
        },
        { type: "h3", text: "High-Priority & Unassigned Tickets" },
        {
          type: "p",
          text: "A separate table surfaces high-priority and unassigned tickets, along with those at SLA risk. This ensures that critical issues and unattended tickets are not overlooked.",
        },
        { type: "p", text: "Why this matters:" },
        {
          type: "ul",
          items: [
            "Prevents ticket neglect",
            "Improves ownership clarity",
            "Speeds up response",
          ],
        },
        { type: "h3", text: "Agent Workload Visibility" },
        {
          type: "p",
          text: "Additional widgets provide a quick overview of ticket distribution, status breakdown, and workload, helping agents understand their current load and progress at a glance.",
        },
        { type: "p", text: "Why this matters:" },
        {
          type: "ul",
          items: [
            "Removes the need to mentally track ticket load across shifts",
            "Enables proactive workload balancing before SLAs are at risk",
            "Helps agents plan their day in seconds instead of minutes",
          ],
        },
      ],
    },
    {
      heading: "Constraints & Trade-offs",
      blocks: [
        { type: "h3", text: "Constraints" },
        {
          type: "ul",
          items: [
            "A one-week internal sprint — no dedicated research or validation phase",
            "Built within the existing platform and data model; SLA data was already captured, so this was a visibility-and-workflow problem, not a backend one",
            "Filters were session-based and reset on reload — making them persist across shifts meant data-layer work that wasn't feasible in the timeframe",
          ],
        },
        { type: "h3", text: "Trade-offs" },
        {
          type: "ul",
          items: [
            "**Saved filter vs dashboard** — persisting filters was the cheaper fix but wasn't feasible; the dashboard costs an extra surface to maintain but answers multiple urgency dimensions at once, not just one saved query.",
            "**Bounded top-5 vs full list** — the dashboard shows only the top 5 at-risk (and unassigned) tickets to prevent overwhelm, and it works as a rolling queue: as soon as one is resolved or assigned, the next-most-urgent ticket takes its place, until none remain. The residual trade-off is depth-of-field — an agent always sees the 5 most urgent, but can't tell how deep the at-risk backlog runs without opening the full, filterable list in the ticket view.",
            "**SLA status column** — adds density to an already busy table; managed with restrained color and iconography.",
          ],
        },
      ],
    },
    {
      heading: "Before vs After",
      blocks: [
        {
          type: "p",
          text: "The existing experience required agents to manually scan the ticket list to identify urgency, which increased cognitive load and led to missed SLAs. The redesigned solution introduces a structured prioritization layer and clearer execution tools to enable faster and more confident decision-making.",
        },
        { type: "h3", text: "Dashboard Redesign — Before" },
        {
          type: "ul",
          items: [
            "No centralized view for prioritization",
            "Agents directly entered ticket list",
            "Urgent tickets were not surfaced proactively",
          ],
        },
        { type: "h3", text: "Dashboard Redesign — After" },
        {
          type: "ul",
          items: [
            "Introduced dashboard as entry point",
            "SLA risk, breached, and safe tickets clearly grouped",
            "High-priority & unassigned tickets surfaced instantly",
            "Agent workload visible through widgets",
          ],
        },
      ],
    },
    {
      heading: "Hypothesized Impact",
      blocks: [
        {
          type: "p",
          text: "These are hypothesized outcomes based on the workflow friction the design removes — not measured results, since this was a short concept sprint without a formal validation phase. Directionally, I'd expect:",
        },
        {
          type: "ul",
          items: [
            "~20% fewer SLA breaches from making urgency ambient and surfacing at-risk tickets proactively",
            "~30% faster prioritization by removing the daily filter step and the manual scan-and-rank",
            "~40% less repetitive manual effort via bulk actions",
            "~25% clearer triage of high-priority and unassigned tickets",
          ],
        },
      ],
    },
    {
      heading: "Reflection & Learnings",
      blocks: [
        {
          type: "p",
          text: "The most useful thing this project taught me wasn't the dashboard — it was the iteration. My first fix (the SLA column and filter) was reasonable and solved the surface problem, but informal feedback revealed it quietly created a new one: a daily setup tax, and a filtered list too long to act on confidently. The dashboard came from taking that feedback seriously rather than defending v1.",
        },
        {
          type: "p",
          text: "Given the one-week timeline, the solution rests on limited qualitative input and focused on high-impact workflow fixes. With more time, I'd validate through usability testing — the cleanest test being whether an agent can identify their highest-priority ticket within 10 seconds of opening the dashboard, a direct proxy for the prioritization gain this targets. I'd also A/B the SLA status treatments to confirm the cues actually change which ticket agents pick first.",
        },
        {
          type: "p",
          text: "The broader lesson: in SaaS tools, structuring and surfacing the right information at the right moment often beats adding more features. The data was already there — the design's job was to make it act on the agent's behalf, without making them ask for it twice.",
        },
      ],
    },
  ],
};
