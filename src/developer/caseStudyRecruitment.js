// Case study 02: Northwind Talent, a recruitment and onboarding product. Same shape and
// slide order as caseStudy.js. Plain words on purpose. Blocks: p, ul, quote, image (**bold** is supported).
export const recruitmentCaseStudy = {
  title: "One place to run hiring, with AI that helps and people who decide",
  duration: "2 months",
  tags: ["HR tech", "AI workflow", "UI/UX"],
  overview: [
    {
      label: "Role",
      text: "Designer and front-end developer. I wrote the plan, mapped the screens, designed the screens in Figma, with AI to move faster, and built the working product.",
    },
    { label: "Timeline", text: "About 2 months in total. Designing and testing with AI took about 5 days of that." },
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
      text: "The product is in production. It helps HR create jobs faster, review candidates faster and answer one question quickly: is this person right for my organization? I haven't measured the time saved yet.",
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
          text: "AI tools make it worse when they score or reject people without saying why.",
        },
      ],
    },
    {
      heading: "The goal",
      blocks: [
        {
          type: "ul",
          items: [
            "Put the whole journey in one place, from posting a job to a new hire's first day",
            "Let HR see where every candidate is and what needs them next",
            "Give interviewers clear points to score, without other people's opinions shaping theirs",
            "Keep candidates informed at every step",
            "Let AI help with reading and writing, but leave every decision to people",
          ],
        },
        {
          type: "p",
          text: "**How I'd check it worked:** time from \"new job\" to published · time spent on each resume with the evidence view compared with reading by hand · time from the interview to a decision · time from offer accepted to the first day.",
        },
      ],
    },
    {
      heading: "Research",
      blocks: [
        {
          type: "p",
          text: "Before I designed anything, I wanted to see how hiring really happens, not how a tool says it should.",
        },
        {
          type: "ul",
          items: [
            "**Talked to HR and a recruiter** in our own organization. How did they interview people before? Where did it get stuck? What would the ideal way of hiring look like to them?",
            "**Looked at interviewers' side** of the same story: what they are asked to do, what they see, and how they give their opinion.",
            "**Studied other hiring products.** I compared how they handle jobs, candidates, interviews and onboarding, and where they let AI make the call.",
          ],
        },
        {
          type: "p",
          text: "I turned this into a short list of what HR wants from the portal, how it should fit with the tools they already use, and how they work today. That list became the starting point for the flow and for the PRD.",
        },
      ],
    },
    {
      heading: "Key insights",
      blocks: [
        {
          type: "p",
          text: "From the research I wrote a few ground rules before drawing any screen. Every later decision had to fit them:",
        },
        {
          type: "ul",
          items: [
            "**AI assists, people decide.** It drafts criteria and finds evidence. It never shortlists, rejects or hires.",
            "**Scores are only a guide.** They use the job's points only, never personal traits, and what's missing is left out, not counted as zero.",
            "**Every screen has all its states:** loading, empty, error and success.",
            "**Candidates see feedback only after HR releases it.**",
            "**Three portals, one set of records:** HR, Interviewer and Candidate each see only their slice.",
          ],
        },
        {
          type: "p",
          text: "The first change came early. I had planned a separate recruiter role, but in a team this size HR already does that work. I merged them, which removed a whole portal and a set of hand-offs.",
        },
      ],
    },
    {
      heading: "Process",
      blocks: [
        {
          type: "p",
          text: "I worked in eight steps, and went back a step whenever something didn't work.",
        },
        {
          type: "ul",
          items: [
            "**1. Start from HR's request.** HR asked for a better hiring portal.",
            "**2. Ask three questions first.** Who are the users? What is the main goal of this portal? And what is your ideal way of hiring, and what would you suggest? Everything else depends on these answers.",
            "**3. Take short notes.** What HR wants from the portal, how it should fit with their other tools, and how they work today.",
            "**4. Decide the flow with HR and the interviewers.** I drew the hiring flow on paper, from posting a job to the first day, and walked through it step by step with them. I changed the flow after their feedback.",
            "**5. Write a PRD.** I reviewed it many times, improving it each round, until it fit HR best.",
            "**6. Design in Figma, with AI.** I designed the screens in Figma and used AI to draft them quickly. Designing and testing this way took about 5 days.",
            "**7. Test the design with HR and the other stakeholders.** I walked them through the Figma screens. Is this working for you?",
            "**8. Iterate until the flow is right, then build.** I fixed the design and tested again until the flow felt right. Only then did I move it into code, and kept testing there too.",
          ],
        },
        {
          type: "quote",
          text: "Test, fix, test again. That's the whole workflow.",
        },
      ],
    },
    {
      heading: "The design",
      blocks: [
        {
          type: "p",
          text: "I designed in Figma first and wrote code later. I used AI to draft screens fast, then tested them with HR and the other stakeholders and kept improving them until the flow was almost right.",
        },
        {
          type: "ul",
          items: [
            "**One flow, three portals.** One flow for the whole journey, from posting a job to a new hire's first day, split into three parts: HR, interviewers and candidates.",
            "**One look on every screen.** I used shadcn/ui components so every screen looked like part of one product, and designed each form before building it.",
            "**The design file matches the product.** After building it, I put 42 screens from the live app back into Figma.",
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
          text: "Four ideas run through almost every decision from here: people decide and AI assists, remove what doesn't earn its place, keep one source of truth, and let the process move itself.",
        },
      ],
    },
    {
      heading: "Key decisions",
      blocks: [
        {
          type: "p",
          text: "**Decide once, use everywhere.** HR sets up the list of points **once for each role and level**, for example Senior Product Designer. Each point is marked as needed or nice to have, and whether it's checked on the resume or in the interview. Every job starts from that setup, and the job description, resume checks and scorecards all use the same points.",
        },
        {
          type: "image",
          src: "/rec-criteria.png",
          alt: "The job setup screen for Senior Product Designer, listing eight points to look for and the interview rounds",
          caption: "One setup per role and level. Each point says where it's checked.",
        },
        {
          type: "p",
          text: "**Show the evidence.** When the AI reads a resume, it shows its working: a short quote and the page for each point, marked **Found**, **Partial** or **Unknown**. If the resume says nothing, it's Unknown, not failed, so the interviewer knows to ask.",
        },
        {
          type: "image",
          src: "/rec-evidence.png",
          alt: "A candidate's resume check showing each point as Found, Partial or Unknown with quotes, and a match score of 92 out of 100",
          caption: "Every point shows a quote from the resume. Missing information is \"Unknown\", never a fail.",
        },
        {
          type: "ul",
          items: [
            "**Every shortlist, hold or reject needs a written reason,** saved with the person's name and the time.",
            "**Interviewers only score their own round,** and other people's feedback stays hidden until they submit theirs.",
            "**If the AI score is missing, the app asks for a manual review** instead of quietly hiding the candidate.",
            "**Steps complete themselves when the system already knows.** Sending and accepting the appointment letter finish their own steps, and jobs close when every opening is filled.",
            "**A candidate fills in their profile once.** The next application pre-fills it.",
          ],
        },
        {
          type: "image",
          src: "/rec-decision.png",
          alt: "A candidate record showing three interviewers' scores side by side, their written feedback and a final decision panel",
          caption: "Independent scorecards, then one decision with a reason.",
        },
        {
          type: "p",
          text: "**Candidates are never left guessing.** Every application has its own page with the steps so far, what comes next and a copy of what was sent.",
        },
        {
          type: "image",
          src: "/rec-application.png",
          alt: "A candidate's application page with the interview details, what they submitted and a progress timeline",
          caption: "A clear timeline and what was sent. Internal notes stay private.",
        },
        {
          type: "image",
          src: "/rec-onboarding.png",
          alt: "An onboarding page with a six-step progress bar, a task list with due dates and statuses, and the joining documents",
          caption: "From offer to first day, in the same place. Every step has a due date and a status.",
        },
      ],
    },
    {
      heading: "Constraints & trade-offs",
      blocks: [
        {
          type: "ul",
          items: [
            "About two months in total, with roughly five days for designing and testing with AI",
            "**AI never decides** — letting it shortlist would be faster, but people need to be able to explain every decision, so it only reads and drafts",
            "**A score vs a verdict** — a match score helps HR sort, but a bare number looks like a verdict, so it's labelled \"Indicative\" and says what it's based on (\"based on N of M points\")",
            "**Bulk actions vs care** — bulk shortlist, hold or reject saves time, but still needs one shared reason and only covers screening. Interviews and offers stay one by one",
            "**One-click verify vs checking each document** — most checks pass, so verifying all documents is one click, with undo for the rare mistake",
            "**Locked jobs vs flexibility** — published jobs can't be edited, so no one applies to one thing and gets judged on another. A job that is paused shows On hold to candidates instead",
          ],
        },
      ],
    },
    {
      heading: "Impact",
      blocks: [
        {
          type: "p",
          text: "The product is in production. There was no time to measure it formally, so instead of guessing percentages, here's what the design takes out of an HR person's day:",
        },
        {
          type: "ul",
          items: [
            "**No more starting a job from a blank page.** A saved setup per role and level, plus an AI first draft, fills in the points, documents and rounds.",
            "**No more reading every resume end to end.** Each point shows a quote from the resume, marked Found, Partial or Unknown, so HR sees the evidence at a glance.",
            "**No more chasing to find where a candidate is.** Every candidate's stage and next step is in one place, from the first look to the first day.",
            "**Handling many applicants takes one action, not many.** Bulk shortlist, hold or reject covers a whole group with one shared reason.",
            "**Onboarding steps don't need ticking by hand.** Sending and accepting the appointment letter complete their own steps.",
          ],
        },
        {
          type: "p",
          text: "The biggest change is the question HR can now answer quickly. Before, they had to read a lot to get a rough idea. With AI that shows its evidence and a clearer design, it's one question:",
        },
        {
          type: "quote",
          text: "Is this person right for my organization?",
        },
        {
          type: "p",
          text: "The AI never answers it for them. It brings the evidence together, and a person makes the call and writes down why. Shipping it was the first step. Measuring it is the next.",
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
            "**Taking things out helped most.** Fewer roles, fewer steps and fewer pages made the product clearer.",
            "**Using it beats looking at it.** Spacing and navigation problems only showed up when I clicked through the running product.",
          ],
        },
      ],
    },
  ],
};
