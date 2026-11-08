export const ticketDashboardCaseStudy = {
  title: "Customer Support Portal Redesign",
  created: "February 16, 2026",
  duration: "2 Weeks",
  tags: [
    "Customer Support",
    "Dashboard",
    "UI/UX"
  ],
  story: "This case study follows the problem as it appeared in day-to-day work, the conversations that changed my understanding, and the decisions that shaped the final product. It focuses on what was learned and why the design evolved—not just on the screens that were produced.",
  overview: [
    {
      label: "Summary",
      text: "Making it easier for developers to track tickets and identify SLA risks."
    },
    {
      label: "Company",
      text: "Keross"
    },
    {
      label: "Project type",
      text: "B2B SaaS – Internal Tool"
    },
    {
      label: "Role",
      text: "UI/UX Designer & Developer"
    },
    {
      label: "Timeline",
      text: "2 Weeks — Week 1: Design, Week 2: Development"
    },
    {
      label: "Platform",
      text: "Web Application"
    },
    {
      label: "Team",
      text: "Manager, Team Lead and Me"
    },
    {
      label: "Design",
      text: "Figma"
    },
    {
      label: "Development",
      text: "HTML, CSS, JavaScript, jQuery"
    },
    {
      label: "Data",
      text: "Company's existing APIs"
    }
  ],
  sections: [
    {
      heading: "The problem",
      blocks: [
        {
          type: "q",
          text: "What problem were you trying to solve?"
        },
        {
          type: "a",
          text: "Our developers handled customer tickets alongside their regular development work. The existing portal showed ticket priority and status, but there was no clear way to identify tickets approaching their SLA deadlines.\n\nEven a low-priority ticket could become urgent over time, but developers had to search through multiple pages and apply filters to find it.\n\nThey also had to open tickets individually to update their status or assignment."
        }
      ]
    },
    {
      heading: "The goal",
      blocks: [
        {
          type: "q",
          text: "What did you want to improve?"
        },
        {
          type: "a",
          text: "I wanted to make important tickets easier to find and manage. My focus was on improving SLA visibility, showing urgent tickets directly on the dashboard and making it easier to update multiple tickets together."
        }
      ]
    },
    {
      heading: "Research",
      blocks: [
        {
          type: "q",
          text: "How did you understand the developers' problems?"
        },
        {
          type: "a",
          text: "I had informal conversations with three developers who regularly handled customer tickets. I also discussed the requirements with my team lead and used my own experience working with internal tools.\n\nI didn't conduct formal UX research, but these conversations helped me understand where developers were struggling."
        }
      ]
    },
    {
      heading: "Key insights",
      blocks: [
        {
          type: "q",
          text: "What did you learn from those conversations?"
        },
        {
          type: "a",
          text: "I identified three main problems:\n\n• Developers couldn't easily identify tickets approaching their SLA deadlines.\n• Important tickets could get buried across multiple pages.\n• Updating tickets individually took extra effort.\n\nThe biggest issue was that developers had to keep searching for tickets instead of knowing which ones needed attention."
        }
      ]
    },
    {
      heading: "The process",
      blocks: [
        {
          type: "q",
          text: "How did you improve ticket visibility?"
        },
        {
          type: "a",
          text: "My first approach was to add an SLA Status column to the ticket table."
        },
        {
          type: "image",
          src: "/cs-ticket-list.png",
          alt: "Redesigned ticket list with an SLA Status column as the leftmost field",
          caption: "Round 1 — an SLA Status column leads every row, so urgency reads without opening a ticket."
        },
        {
          type: "a",
          text: "I calculated SLA status in the application using the ticket creation time, configured SLA duration and current time. I introduced five statuses: Safe, Warning, Danger, About to Breach and Breached.\n\nHowever, developers still had to apply filters every time they wanted to find important tickets. Those filters were also lost after refreshing the portal, so I explored a dashboard-based solution instead."
        },
        {
          type: "q",
          text: "How did you make ticket management easier?"
        },
        {
          type: "a",
          text: "I added checkboxes to the ticket table so developers could select multiple tickets and update their status or assignment together. This reduced the need to open and update tickets one by one."
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
      heading: "The solution",
      blocks: [
        {
          type: "q",
          text: "What was your final solution?"
        },
        {
          type: "a",
          text: "I redesigned the dashboard to show important tickets as soon as developers opened the portal."
        },
        {
          type: "image",
          src: "/cs-dashboard.png",
          alt: "Dashboard showing SLA-at-risk and unassigned ticket tables, workload stat tiles, and a ticket status breakdown, all visible at login",
          caption: "The final dashboard — the most urgent and unassigned tickets at login, with workload stats at a glance."
        },
        {
          type: "a",
          text: "The dashboard has two main queues:\n\n• SLA At Risk: Shows the top five SLA-relevant tickets assigned to the logged-in developer.\n• Unassigned Tickets: Shows the top five unassigned SLA-risk tickets across all projects.\n\nBoth queues are ordered by SLA urgency and update when dashboard data refreshes. The dashboard also includes ticket summary cards, ticket status, priority and SLA health charts.\n\nAll tickets remain accessible in the full ticket list."
        },
        {
          type: "image",
          src: "/cs-sla-at-risk.png",
          alt: "SLA At Risk queue listing five tickets ordered by SLA status, from About to breach to Warning",
          caption: "SLA At Risk — the logged-in developer's five most urgent tickets, ordered by SLA status."
        },
        {
          type: "image",
          src: "/cs-unassigned.png",
          alt: "Unassigned Ticket queue listing five unassigned tickets with SLA status and priority",
          caption: "Unassigned Tickets — the top five unowned SLA-risk tickets across all projects, with priority."
        }
      ]
    },
    {
      heading: "Key decisions",
      blocks: [
        {
          type: "q",
          text: "Why did you choose a dashboard instead of relying only on filters?"
        },
        {
          type: "a",
          text: "The first redesign made SLA information visible, but developers still had to search for important tickets. I wanted the portal to bring those tickets to them instead."
        },
        {
          type: "q",
          text: "Why did you show only five tickets in each queue?"
        },
        {
          type: "a",
          text: "Showing every ticket would make the dashboard harder to scan. I limited each queue to five so developers could focus on the most important tickets first."
        },
        {
          type: "q",
          text: "Why did you prioritise SLA status over ticket priority?"
        },
        {
          type: "a",
          text: "A low-priority ticket can become urgent when its deadline approaches. So I prioritised SLA status first, followed by ticket priority for Warning and Safe tickets."
        }
      ]
    },
    {
      heading: "Constraints & trade-offs",
      blocks: [
        {
          type: "q",
          text: "What challenges did you face during the project?"
        },
        {
          type: "a",
          text: "The project had a two-week timeline: one week for design and one week for development. There was also no dedicated SLA API. I calculated SLA deadlines and statuses directly in the application using data from the company's existing systems.\n\nI also considered saving user-specific filters, but additional data requests could affect performance. Instead, I chose to show important tickets directly on the dashboard."
        }
      ]
    },
    {
      heading: "Impact",
      blocks: [
        {
          type: "q",
          text: "What changed after the redesign?"
        },
        {
          type: "a",
          text: "The redesigned portal is now being used by the development team. Developers shared that important tickets were easier to find, easier to track and easier to act on.\n\nOne piece of feedback was:\n\n“Right now, it's easy to track the ticket.”\n\nI didn't have formal analytics to measure changes in resolution time or SLA performance, so I won't claim numerical improvements."
        }
      ]
    },
    {
      heading: "What I learned",
      blocks: [
        {
          type: "q",
          text: "What did you learn from this project?"
        },
        {
          type: "a",
          text: "I learned that making information visible doesn't always solve the actual problem. My first solution added an SLA column, but developers still had to search and filter tickets repeatedly.\n\nThe second redesign taught me to look beyond the immediate UI problem and understand how people work. It also showed me how my development experience could help me make practical design decisions."
        }
      ]
    }
  ],
  format: "page"
};
