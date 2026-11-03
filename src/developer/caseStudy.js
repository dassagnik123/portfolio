export const ticketDashboardCaseStudy = {
  title: "Agents couldn't see which tickets were about to breach — so I made urgency impossible to miss",
  created: "February 16, 2026",
  duration: "1 week",
  tags: [
    "Customer Support",
    "Dashboard",
    "UI/UX"
  ],
  story: "This case study follows the problem as it appeared in day-to-day work, the conversations that changed my understanding, and the decisions that shaped the final product. It focuses on what was learned and why the design evolved—not just on the screens that were produced.",
  overview: [
    {
      label: "Role",
      text: "I worked as the solo designer and one of the developers on this internal support-tool improvement. I handled the research, interaction design and UI, then helped build it in the existing React, Next.js and TypeScript codebase."
    },
    {
      label: "Product",
      text: "The work was completed in a one-week internal sprint. The product helps support agents work through customer tickets before their SLA deadlines pass."
    },
    {
      label: "What I did",
      text: "The SLA information already existed, but agents had to scan and sort the queue themselves to find the most urgent work. I first made SLA status visible in the ticket list, then evolved the solution into a dashboard that surfaces urgent, breached and unclaimed tickets as soon as agents log in."
    },
    {
      label: "Outcome",
      text: "The changes shipped. The team did not track formal metrics, but day-to-day use suggested better ticket resolution and less manual work."
    }
  ],
  sections: [
    {
      heading: "The problem",
      blocks: [
        {
          type: "p",
          text: "Support agents had SLA countdowns available, but identifying urgent tickets meant scanning and sorting a long list manually."
        },
        {
          type: "p",
          text: "As a result, at-risk tickets could go unnoticed, unclaimed work remained unattended, and agents spent time on repetitive updates."
        }
      ]
    },
    {
      heading: "The goal",
      blocks: [
        {
          type: "p",
          text: "I wanted to help agents identify and act on urgent tickets without manually scanning the entire queue."
        },
        {
          type: "p",
          text: "The dashboard needed to highlight SLA risks, surface unclaimed work and simplify repetitive actions so agents could focus more on resolving customer issues."
        }
      ]
    },
    {
      heading: "Research",
      blocks: [
        {
          type: "p",
          text: "The project was an internal sprint, so I had one week to understand the problem and deliver an improvement. I kept the research focused and spoke with two to three agents who used the tool every day."
        },
        {
          type: "p",
          text: "Their routines were remarkably similar. They read the whole table and guessed which tickets needed attention first. They opened individual tickets just to double-check how urgent they were. And when several tickets needed the same update, they repeated the action row by row."
        }
      ]
    },
    {
      heading: "Key insights",
      blocks: [
        {
          type: "p",
          text: "I initially thought the answer might be more filters. But the conversations changed my thinking. Agents did not want another set of controls to manage. They wanted the system to identify the important tickets and put them in front of them."
        },
        {
          type: "p",
          text: "That distinction changed the brief. Instead of helping agents find urgent tickets faster, the product needed to surface urgent tickets automatically."
        },
        {
          type: "p",
          text: "There was a second insight too: the solution should not ask agents to configure the same view every day. It needed to be ready when they arrived."
        }
      ]
    },
    {
      heading: "Process",
      blocks: [
        {
          type: "p",
          text: "I approached the work in two rounds. In the first round, I added an SLA Status column to the ticket list, using clear visual cues to show which tickets were at risk. I also added filters for at-risk and unclaimed tickets."
        },
        {
          type: "p",
          text: "Then I reviewed where that solution fell short. Agents had to set up the filters again every day, and even a filtered list could become too long to act on."
        },
        {
          type: "p",
          text: "That feedback led to the second round: a dashboard that prepared the most urgent and unclaimed work as soon as agents logged in. Because I was also one of the developers, I built the experience in the existing React, Next.js and TypeScript codebase."
        }
      ]
    },
    {
      heading: "The design",
      blocks: [
        {
          type: "p",
          text: "The dashboard became the first screen agents saw. It brought the most urgent work forward without requiring them to apply filters or remember a particular setup."
        },
        {
          type: "p",
          text: "At the top, it showed the five most urgent tickets, grouped by SLA status. When an agent cleared one, the next most urgent ticket moved into the list. A second table highlighted high-priority and unclaimed tickets, helping ensure that important work did not sit without an owner."
        },
        {
          type: "p",
          text: "Small workload widgets helped agents see who was carrying what and plan their shift quickly. Bulk actions made it possible to update the status or assignment of multiple selected tickets in one go."
        },
        {
          type: "p",
          text: "The original SLA Status column stayed in the full ticket list. The dashboard did not replace that view; it gave agents a better starting point while preserving the detailed queue when they needed it."
        },
        {
          type: "image",
          src: "/cs-ticket-list.png",
          alt: "Redesigned ticket list with an SLA Status column as the leftmost field",
          caption: "Round 1 — an SLA Status column leads every row, so urgency reads without opening a ticket."
        },
        {
          type: "image",
          src: "/cs-dashboard.png",
          alt: "Dashboard showing SLA-at-risk and unassigned ticket tables, workload stat tiles, and a ticket status breakdown, all visible at login",
          caption: "Round 2 — the dashboard surfaces the most urgent and unclaimed tickets at login, capped so it stays actionable, alongside workload stats at a glance."
        },
        {
          type: "image",
          src: "/cs-bulk-actions.png",
          alt: "Ticket list with a Take Action menu open, showing Change Status and Assign as bulk actions applied to several selected rows",
          caption: "Selecting multiple tickets surfaces bulk actions — status changes and assignment no longer need to be done one row at a time."
        }
      ]
    },
    {
      heading: "Key decisions",
      blocks: [
        {
          type: "p",
          text: "Saved filters seemed like the obvious next step after the first round. But they would still ask agents to choose and revisit a view, and they did not solve the problem of an unlimited list of results."
        },
        {
          type: "p",
          text: "There was also a technical constraint. The existing data API was slow. A saved-filter approach would require the application to fetch the filter first and then fetch the tickets using that filter, one after the other. That could make the first screen slower."
        },
        {
          type: "p",
          text: "The dashboard took a different approach. It loaded its own short list of urgent tickets while the full ticket list loaded in the background. That meant agents could see something useful quickly, without waiting for the entire queue."
        },
        {
          type: "p",
          text: "I capped the urgent list at five tickets because a long list would recreate the same problem in a new place. Five gives an agent a manageable set to act on at once. The trade-off is that the dashboard does not show the full size of the at-risk queue; agents can still open the full list for that context."
        },
        {
          type: "p",
          text: "The goal was not to show every ticket on the first screen. It was to show the next useful action."
        }
      ]
    },
    {
      heading: "Constraints & trade-offs",
      blocks: [
        {
          type: "p",
          text: "The work had to fit into a one-week internal sprint, with no time set aside for extensive research or formal testing. I built on the platform and data that already existed; the SLA information was available, so the work focused on showing and using it rather than changing the backend."
        },
        {
          type: "p",
          text: "A dashboard is another screen to maintain, but it avoids the sequential filter-then-ticket loading that could make the first screen slower. Capping the list at five keeps it actionable, but agents need the full list to understand the size of the at-risk queue."
        }
      ]
    },
    {
      heading: "Impact",
      blocks: [
        {
          type: "p",
          text: "The changes shipped. We were a small team and did not formally track metrics, so I cannot claim a measured percentage improvement. But the day-to-day experience changed in a few important ways."
        },
        {
          type: "p",
          text: "Agents now start with at-risk, breached and unclaimed tickets already grouped for them. They do not have to scan the entire queue to work out where to begin. Workload is visible at a glance, and bulk actions replace repeated one-by-one updates for common tasks."
        },
        {
          type: "p",
          text: "The improvement was not simply a new dashboard. The system now handles the initial sorting, so agents can spend more of their attention resolving customer issues."
        },
        {
          type: "p",
          text: "I would validate the impact further by measuring SLA breach rate, time from opening the tool to acting on the first ticket, the number of one-by-one updates per shift, and how quickly high-priority and unclaimed tickets are picked up."
        },
        {
          type: "image",
          src: "/cs-before-ticket-list.png",
          alt: "Original ticket list packed with creation and issue date/time columns and no SLA urgency indicator",
          caption: "**Before** — the old list led with timestamps; nothing flagged which tickets were close to breaching."
        },
        {
          type: "image",
          src: "/cs-dashboard.png",
          alt: "Redesigned dashboard showing SLA-at-risk and unassigned ticket tables plus workload stat tiles at login",
          caption: "**After** — the dashboard opens straight into at-risk, breached and unclaimed tickets, with workload visible at a glance."
        }
      ]
    },
    {
      heading: "What I learned",
      blocks: [
        {
          type: "p",
          text: "The biggest lesson came from the second round. My first solution was reasonable: show SLA status and provide filters. But feedback revealed that it still left agents with setup work every day and a list that could be too long to act on."
        },
        {
          type: "p",
          text: "Instead of defending the first design, I treated that friction as evidence that the problem had not been fully solved. The dashboard came from changing the approach, not simply adding more features."
        },
        {
          type: "p",
          text: "I also learned how closely design and implementation constraints can work together. Understanding the API behaviour and existing codebase helped me choose a solution that was useful for agents and achievable within the sprint."
        }
      ]
    }
  ]
};
