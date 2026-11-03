// Case study 02: Northwind Talent, a recruitment and onboarding product. Same shape and
// slide order as caseStudy.js. Plain words on purpose. Blocks: p, ul, quote, image (**bold** is supported).
export const recruitmentCaseStudy = {
  title: "One place to run hiring, with AI that helps and people who decide",
  duration: "2 months",
  tags: [
    "HR tech",
    "AI workflow",
    "UI/UX"
  ],
  story: "This case study follows the problem as it appeared in day-to-day work, the conversations that changed my understanding, and the decisions that shaped the final product. It focuses on what was learned and why the design evolved—not just on the screens that were produced.",
  overview: [
    {
      label: "Role",
      text: "I worked as both the designer and front-end developer on Northwind Talent. I wrote the plan, mapped the screens, designed the experience in Figma with AI to move faster, and built the working product. The project took about two months, with around five days spent designing and testing with AI."
    },
    {
      label: "Product",
      text: "Northwind Talent brings the hiring journey together: HR teams can post jobs, review candidates, run interviews and welcome new hires. It has three connected portals for HR, interviewers and candidates."
    },
    {
      label: "Problem",
      text: "The starting problem was that hiring information lived across documents, spreadsheets and email. I wanted to create one place for the process, using AI to help with reading and writing while keeping every hiring decision with people."
    },
    {
      label: "Outcome",
      text: "The product is in production. We have not formally measured time saved, so the impact is described without invented percentages."
    },
    {
      label: "Live demo",
      text: "Try the working product ↗",
      href: "https://recruitment-onboarding-geew75kta-dassagnik123s-projects.vercel.app/hr"
    }
  ],
  sections: [
    {
      heading: "The problem",
      blocks: [
        {
          type: "p",
          text: "Hiring information was scattered across documents, spreadsheets and emails. HR struggled to track candidate progress, interviewers lacked a consistent evaluation process, and candidates had limited visibility into their application status."
        },
        {
          type: "p",
          text: "As AI entered hiring, another challenge emerged: decisions needed to remain transparent and under human control."
        }
      ]
    },
    {
      heading: "The goal",
      blocks: [
        {
          type: "p",
          text: "I wanted to bring the entire hiring journey—from job creation to onboarding—into one platform. HR needed better visibility, interviewers needed structured evaluations, and candidates needed clear progress updates."
        },
        {
          type: "p",
          text: "AI would assist with repetitive tasks and evidence gathering, while all hiring decisions remained human-led."
        }
      ]
    },
    {
      heading: "Research",
      blocks: [
        {
          type: "p",
          text: "Before thinking about screens, I wanted to understand how hiring actually happened in our organization. I spoke with HR and a recruiter about the way they worked before, where the process slowed down, and what a better experience would look like."
        },
        {
          type: "p",
          text: "I also looked at the interviewers' side: what information they received, what they were expected to assess, and how they shared feedback. Alongside those conversations, I reviewed other hiring products to understand how they handled jobs, candidates, interviews and onboarding—and where AI was allowed to influence decisions."
        },
        {
          type: "p",
          text: "I brought the findings together into a short set of product requirements. They became the foundation for the user flows and the PRD."
        }
      ]
    },
    {
      heading: "Key insights",
      blocks: [
        {
          type: "p",
          text: "The research made one principle especially important: AI should assist, but people should decide. It could help draft criteria and find evidence, but it could not shortlist, reject or hire."
        },
        {
          type: "p",
          text: "A missing skill or qualification could not automatically count as a failure. It had to appear as “Unknown” so a human could ask about it. A match score needed to be presented as indicative and explain what it was based on."
        },
        {
          type: "p",
          text: "Interviewers needed to submit their own scorecards before seeing other people's feedback. Candidates should only see feedback after HR chose to release it. Each person also needed to see only the information relevant to their role across the three connected portals."
        },
        {
          type: "p",
          text: "An early assumption changed here too. I had planned a separate recruiter role, but in a team this size HR already did that work. Merging the responsibilities removed an unnecessary portal and extra hand-offs."
        }
      ]
    },
    {
      heading: "Process",
      blocks: [
        {
          type: "p",
          text: "I started by mapping the hiring journey with HR and interviewers, from creating a job through to a new hire's first day. We walked through the steps together, discussed what information was needed at each point, and adjusted the flow based on their feedback."
        },
        {
          type: "p",
          text: "I translated the agreed flow into a PRD and refined it over several rounds until it reflected how HR needed to work. I then designed the screens in Figma, using AI to speed up early drafts without treating generated output as final."
        },
        {
          type: "p",
          text: "I walked HR and other stakeholders through the Figma screens, gathered feedback, and iterated until the flow felt right. Only then did I move into development, continuing to test the experience in the running product."
        }
      ]
    },
    {
      heading: "The design",
      blocks: [
        {
          type: "p",
          text: "The product brought together job creation, candidate review, interview evaluation and onboarding. HR could see the candidate pipeline and what needed attention next. Interviewers could complete independent scorecards. Candidates could follow their application progress and see what had been communicated to them."
        },
        {
          type: "p",
          text: "I used shadcn/ui components to keep the interface consistent and designed each form before building it. After implementation, I brought 42 screens from the live application back into Figma so the design file reflected what had actually been built."
        },
        {
          type: "p",
          text: "The design and AI-assisted testing phase took about five days within the overall two-month project."
        },
        {
          type: "image",
          src: "/rec-dashboard.png",
          alt: "The HR dashboard showing open jobs, applications, decisions pending and what needs action",
          caption: "HR's dashboard: where every candidate is, and what needs action next."
        }
      ]
    },
    {
      heading: "Key decisions",
      blocks: [
        {
          type: "p",
          text: "I wanted HR to define evaluation criteria once and reuse them throughout the journey. The system lets HR configure points for each role and level, marking each as required or nice to have and assigning it to resume review or interview assessment. Job descriptions, resume checks and scorecards then use the same criteria."
        },
        {
          type: "p",
          text: "For each criterion, resume review shows a supporting quote and page reference, with a status of Found, Partial or Unknown. This gives HR and interviewers evidence they can verify. If the resume does not contain the information, it appears as Unknown rather than as a failed requirement."
        },
        {
          type: "p",
          text: "Interviewers score only their own round, and other feedback remains hidden until they submit. HR records a reason for shortlist, hold or rejection decisions. If an AI score is unavailable, the product asks for manual review rather than silently hiding the candidate."
        },
        {
          type: "p",
          text: "Where the system already knows an action has happened, it can complete the related step. Sending and accepting an appointment letter complete their respective steps, jobs close when all openings are filled, and candidates can reuse their profile information for later applications."
        },
        {
          type: "p",
          text: "Each application has its own page showing completed steps, what comes next and a copy of what was sent. Internal notes remain private. After an offer is accepted, onboarding continues in the same place, with a status and due date for each step."
        },
        {
          type: "image",
          src: "/rec-criteria.png",
          alt: "The job setup screen for Senior Product Designer, listing eight points to look for and the interview rounds",
          caption: "One setup per role and level. Each point says where it's checked."
        },
        {
          type: "image",
          src: "/rec-evidence.png",
          alt: "A candidate's resume check showing each point as Found, Partial or Unknown with quotes, and a match score of 92 out of 100",
          caption: "Every point shows a quote from the resume. Missing information is \"Unknown\", never a fail."
        },
        {
          type: "image",
          src: "/rec-decision.png",
          alt: "A candidate record showing three interviewers' scores side by side, their written feedback and a final decision panel",
          caption: "Independent scorecards, then one decision with a reason."
        },
        {
          type: "image",
          src: "/rec-application.png",
          alt: "A candidate's application page with the interview details, what they submitted and a progress timeline",
          caption: "A clear timeline and what was sent. Internal notes stay private."
        },
        {
          type: "image",
          src: "/rec-onboarding.png",
          alt: "An onboarding page with a six-step progress bar, a task list with due dates and statuses, and the joining documents",
          caption: "From offer to first day, in the same place. Every step has a due date and a status."
        }
      ]
    },
    {
      heading: "Constraints & trade-offs",
      blocks: [
        {
          type: "p",
          text: "The project took about two months, with roughly five days for designing and testing with AI. That meant choosing what would create the most value without expanding the scope unnecessarily."
        },
        {
          type: "p",
          text: "Allowing AI to shortlist candidates might have made the process faster, but it would have weakened human accountability. I chose explainable evidence and recorded reasons instead."
        },
        {
          type: "p",
          text: "Bulk actions reduce repetitive work, so HR can shortlist, hold or reject a group of candidates with one shared reason during screening. Interviews and offers remain individual decisions because they need more care."
        },
        {
          type: "p",
          text: "Published jobs are locked so candidates are not assessed against a different version of the role from the one they applied to. If a job is paused, candidates see that it is on hold."
        }
      ]
    },
    {
      heading: "Impact",
      blocks: [
        {
          type: "p",
          text: "The product is in production. We did not have time to formally measure time saved or conversion improvements, so I am not attaching percentages to the outcome."
        },
        {
          type: "p",
          text: "HR no longer has to start every job from a blank page. Saved role-and-level configurations and AI-assisted drafts provide a starting point. Resume evidence is brought together against agreed criteria, candidate stages and next steps are visible in one place, and bulk screening actions reduce repeated updates."
        },
        {
          type: "p",
          text: "The next step is to measure the experience against the goals defined at the start: time from creating a job to publishing it, time spent reviewing each resume, time from interview to decision, and time from offer acceptance to the first day."
        },
        {
          type: "p",
          text: "The most important change is not that AI answers whether someone is right for the organization. It does not. It brings the evidence together so the people responsible can make—and explain—the decision."
        }
      ]
    },
    {
      heading: "What I learned",
      blocks: [
        {
          type: "p",
          text: "The strongest product decisions came from understanding the work before designing the interface. Merging the recruiter responsibility into HR removed unnecessary hand-offs. Reusing role criteria made several parts of the product more consistent. Showing evidence made AI outputs easier to question and verify."
        },
        {
          type: "p",
          text: "I also learned that a working product reveals issues that static screens cannot. Testing the built experience helped me notice navigation and spacing problems that were not obvious in Figma."
        },
        {
          type: "p",
          text: "If I were to continue the work, I would focus on collecting baseline and post-launch metrics, then use those findings to decide which parts of the hiring journey need further improvement."
        }
      ]
    }
  ]
};
