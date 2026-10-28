// Case study 02: Northwind Talent, a recruitment and onboarding product. Same shape as
// caseStudy.js. Plain words on purpose. Blocks: p, ul, quote, image (**bold** is supported).
export const recruitmentCaseStudy = {
  title: "One place to run hiring, with AI that helps and people who decide",
  duration: "1 week",
  tags: ["HR tech", "AI workflow", "UI/UX"],
  overview: [
    {
      label: "Role",
      text: "Designer and front-end developer. I wrote the plan, mapped the screens, designed them in Figma and built the working product.",
    },
    { label: "Timeline", text: "About 1 week, from the first plan to a live version" },
    {
      label: "Product",
      text: "Northwind Talent: a website where HR teams post jobs, review candidates, run interviews and welcome new hires. It has three parts: one for HR, one for interviewers and one for candidates.",
    },
    {
      label: "Problem",
      text: "Hiring work is scattered across documents, spreadsheets and email, so nobody can see where a candidate is or why a decision was made. AI tools can make it worse by choosing without showing why.",
    },
    {
      label: "What I did",
      text: "Built one place for the whole journey, from posting a job to a new hire's first day. AI helps with reading and writing. People make every decision.",
    },
    {
      label: "Outcome",
      text: "A complete working product, live on the web, with sample data. I tested it with HR while designing it. The AI is pretend for now, and I haven't measured real hiring numbers yet.",
    },
    {
      label: "Live demo",
      text: "Try the working product ↗",
      href: "https://recruitment-onboarding-geew75kta-dassagnik123s-projects.vercel.app/hr",
    },
  ],
  sections: [
    {
      heading: "The problem",
      blocks: [
        {
          type: "p",
          text: "Hiring has many steps: write the job, post it, read resumes, interview, make an offer and help the new person get started. In many teams every step lives somewhere different. A document here, a spreadsheet there, a long email thread.",
        },
        {
          type: "quote",
          text: "Hiring work is scattered, so nobody can see where a candidate is, or why a decision was made.",
        },
        { type: "p", text: "It hurts each person in a different way:" },
        {
          type: "ul",
          items: [
            "**HR** can't tell where each candidate is or what needs them next, so things get stuck or forgotten.",
            "**Interviewers** don't know what to score, and other people's opinions shape their own.",
            "**Candidates** apply and then wait, with no idea where they stand.",
          ],
        },
        {
          type: "p",
          text: "AI tools make it worse when they score or reject people without saying why. So I set one rule early: AI can help with reading and writing, but it never decides. People do.",
        },
      ],
    },
    {
      heading: "The idea",
      blocks: [
        {
          type: "p",
          text: "Put the whole journey in one place, from posting a job to a new hire's first day, and let everyone see only what they need.",
        },
        {
          type: "ul",
          items: [
            "**HR** runs the whole process from one dashboard.",
            "**Interviewers** only see their own interviews.",
            "**Candidates** follow their own application and, if selected, finish their joining steps.",
          ],
        },
        {
          type: "image",
          src: "/rec-dashboard.png",
          alt: "The HR dashboard showing open jobs, applications, decisions pending and what needs action",
          caption: "HR's dashboard: where every candidate is, and what needs action next.",
        },
        {
          type: "p",
          text: "At first I planned a separate part for recruiters. While building, I saw that HR does that work anyway, so I merged them. That removed whole screens and made the product simpler.",
        },
      ],
    },
    {
      heading: "How I worked",
      blocks: [
        {
          type: "p",
          text: "I worked in seven steps, and went back a step whenever something didn't work.",
        },
        {
          type: "ul",
          items: [
            "**1. Start from HR's request.** HR asked for a better hiring portal.",
            "**2. Ask two questions first.** Who are the users? And what is the main goal of this portal? Everything else depends on these answers.",
            "**3. Take short notes.** What HR wants from the portal, how it should fit with their other tools, and how they work today.",
            "**4. Write a PRD.** I reviewed it many times, improving it each round, until it fit HR best.",
            "**5. Design the screens with AI.** AI helped me draft screens quickly.",
            "**6. Test with HR.** Is this working for you?",
            "**7. Improve and build.** Fix the design, or move it into code, then test again and again until it works well. Then test with other people too.",
          ],
        },
        {
          type: "quote",
          text: "Test, fix, test again. That's the whole workflow.",
        },
      ],
    },
    {
      heading: "Fix 1: Decide the rules once",
      blocks: [
        {
          type: "p",
          text: "**The problem it solves:** every job gets its own list of what to look for, so the lists drift apart and decisions become unfair.",
        },
        {
          type: "p",
          text: "HR sets up the list **once for each role and level**, for example Senior Product Designer. Each point is marked as needed or nice to have, and whether it's checked on the resume or in the interview. After that, every job starts from the saved setup, and the job description, resume checks and scorecards all use the same points.",
        },
        {
          type: "image",
          src: "/rec-criteria.png",
          alt: "The job setup screen for Senior Product Designer, listing eight points to look for and the interview rounds",
          caption: "One setup per role and level. Each point says where it's checked.",
        },
        {
          type: "p",
          text: "Before a setup can be used, it's checked for wording that isn't about the job, like age or \"culture fit\", and for points that repeat. The checks only flag things. HR decides what to keep.",
        },
      ],
    },
    {
      heading: "Fix 2: Show the evidence",
      blocks: [
        {
          type: "p",
          text: "**The problem it solves:** AI that scores people without saying why, and interviews where opinions copy each other.",
        },
        {
          type: "p",
          text: "When the AI reads a resume, it shows its working. For each point it shows a short quote and the page, marked **Found**, **Partial** or **Unknown**. If the resume says nothing, it's Unknown, not failed, so the interviewer knows to ask. The match score is only a guide and is never used to reject anyone.",
        },
        {
          type: "image",
          src: "/rec-evidence.png",
          alt: "A candidate's resume check showing each point as Found, Partial or Unknown with quotes, and a match score of 92 out of 100",
          caption: "Every point shows a quote from the resume. Missing information is \"Unknown\", never a fail.",
        },
        {
          type: "p",
          text: "Interviewers only score the points their round covers, and other people's feedback stays hidden until they submit their own. HR then sees every scorecard side by side and records the decision with a reason, saved with who made it and when.",
        },
        {
          type: "image",
          src: "/rec-decision.png",
          alt: "A candidate record showing three interviewers' scores side by side, their written feedback and a final decision panel",
          caption: "Independent scorecards, then one decision with a reason.",
        },
      ],
    },
    {
      heading: "Fix 3: Nobody is left guessing",
      blocks: [
        {
          type: "p",
          text: "**The problem it solves:** candidates who wait in silence, and new hires whose paperwork gets lost.",
        },
        {
          type: "p",
          text: "Every application has its own page with the steps so far, what comes next and a copy of what the candidate sent. Internal notes and scores stay private.",
        },
        {
          type: "image",
          src: "/rec-application.png",
          alt: "A candidate's application page with the interview details, what they submitted and a progress timeline",
          caption: "A clear timeline and what was sent. Internal notes stay private.",
        },
        {
          type: "p",
          text: "After a decision, the same product carries on: offer letter, e-signature, joining documents, appointment letter and a short onboarding checklist. Every step has an owner, a due date and a status.",
        },
        {
          type: "image",
          src: "/rec-onboarding.png",
          alt: "An onboarding page with a six-step progress bar, a task list with due dates and statuses, and the joining documents",
          caption: "From offer to first day, in the same place.",
        },
      ],
    },
    {
      heading: "Metrics",
      blocks: [
        {
          type: "p",
          text: "I haven't run a real pilot yet, so these are the numbers the portal is built to improve, and the ones I'd measure first:",
        },
        {
          type: "ul",
          items: [
            "**Time to create a job.** From \"new job\" to published. Saved setups and the AI first draft should shorten it.",
            "**Resume review time.** How long HR spends on each resume with the evidence view, compared with reading by hand.",
            "**Interview speed.** Time from the interview to every scorecard being in, and to a final decision.",
            "**Chasing.** How many emails or messages it takes to find out where a candidate is. The goal is close to none.",
            "**AI corrections.** How often HR changes what the AI wrote or found. Fewer changes over time means more trust.",
            "**Time to first day.** From offer accepted to every joining step done.",
          ],
        },
        {
          type: "quote",
          text: "The first real numbers will come from a small pilot with HR.",
        },
      ],
    },
    {
      heading: "What I learned",
      blocks: [
        {
          type: "ul",
          items: [
            "**Decide once, use everywhere.** Setting up the job's points once made every other screen simpler.",
            "**Saying no to AI deciding shaped the design.** It's why there are reason boxes, hidden feedback until you've scored, and \"Unknown\" instead of \"fail\".",
            "**Using it beats looking at it.** Spacing and navigation problems only showed up when I clicked through the running product.",
            "**Fewer roles, fewer screens.** Merging recruiters into HR removed whole screens without losing anything important.",
          ],
        },
        { type: "p", text: "**What's next:**" },
        {
          type: "ul",
          items: [
            "A real backend (the data is stored in the browser for now).",
            "Phone and tablet layouts. I designed for desktop first.",
            "Real connections, like posting to job sites. These are pretend for now.",
            "Testing with a small group: how long a job takes to post, how long resume review takes, and how often people correct the AI.",
          ],
        },
      ],
    },
  ],
};
