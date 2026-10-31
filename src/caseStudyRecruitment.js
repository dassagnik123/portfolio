// Case study 02: Northwind Talent, a recruitment and onboarding product. Same shape as
// caseStudy.js. Plain words on purpose. Blocks: p, ul, quote, image (**bold** is supported).
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
          text: "AI tools make it worse when they score or reject people without saying why. So I set one rule early: AI can help with reading and writing, but it never decides. People do.",
        },
      ],
    },
    {
      heading: "Research: how hiring works today",
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
      heading: "The rules I set first",
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
      heading: "How I worked",
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
            "**1. Map the flow.** One flow for the whole journey, from posting a job to a new hire's first day, split into three parts: HR, interviewers and candidates.",
            "**2. Design the screens in Figma.** I used shadcn/ui components so every screen looked like part of one product, and drafted layouts with AI. I designed each form before building it.",
            "**3. Test with HR and stakeholders.** I walked through the screens with them and noted where they hesitated or asked \"what happens next?\".",
            "**4. Iterate.** I fixed those spots and tested again. This loop ran many times, and it is where most of the decisions on the next slides came from.",
            "**5. Build it in code,** once the flow felt right. Later I put 42 screens from the live app back into Figma so the design file matches the product.",
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
      heading: "Decisions: one place, and it moves itself",
      blocks: [
        {
          type: "p",
          text: "**Decide once, use everywhere.** HR sets up the list of points **once for each role and level**, for example Senior Product Designer. Each point is marked as needed or nice to have, and whether it's checked on the resume or in the interview. Every job starts from that setup and can add to it, and the job description, resume checks and scorecards all use the same points.",
        },
        {
          type: "image",
          src: "/rec-criteria.png",
          alt: "The job setup screen for Senior Product Designer, listing eight points to look for and the interview rounds",
          caption: "One setup per role and level. Each point says where it's checked.",
        },
        {
          type: "ul",
          items: [
            "**A candidate fills in their profile once.** The next application pre-fills it. Missing details get a badge inside the profile, in the section where they belong.",
            "**Steps complete themselves when the system already knows.** Sending and accepting the appointment letter finish their own steps, so there's no \"mark done\" busywork.",
            "**Jobs close when every opening is filled.** No stale postings.",
            "**Verify all documents in one click, with undo.** Most checks pass, so the common case is one click and the rare mistake is safe.",
          ],
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
      heading: "Decisions: building trust",
      blocks: [
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
            "**The match score says \"Indicative\"** and explains how it was worked out (\"based on N of M points\"). A bare number looks like a verdict.",
            "**Every shortlist, hold or reject needs a written reason,** saved with the person's name and the time.",
            "**Interviewers only score their own round,** and other people's feedback stays hidden until they submit theirs.",
            "**Bulk decisions still need one shared reason** and only cover screening. Interviews and offers stay one by one.",
            "**If the AI score is missing, the app asks for a manual review** instead of quietly hiding the candidate.",
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
          text: "**Candidates are never left guessing.** Every application has its own page with the steps so far, what comes next and a copy of what was sent. A job that is On hold says so to candidates, and published jobs are locked so no one applies to one thing and gets judged on another.",
        },
        {
          type: "image",
          src: "/rec-application.png",
          alt: "A candidate's application page with the interview details, what they submitted and a progress timeline",
          caption: "A clear timeline and what was sent. Internal notes stay private.",
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
          text: "The AI never answers it for them. It brings the evidence together, and a person makes the call and writes down why.",
        },
        {
          type: "p",
          text: "What I expect this to change: less time to create a job, faster candidate review and fewer messages to find out where someone is. Shipping it was the first step. Measuring it is the next.",
        },
        {
          type: "p",
          text: "How I'd measure it: time from \"new job\" to published, time spent on each resume with the evidence view compared with reading by hand, and the time from the interview to a decision and from offer accepted to the first day.",
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
