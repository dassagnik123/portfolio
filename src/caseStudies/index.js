import { ticketDashboardCaseStudy } from "./customerSupport.js";
import { recruitmentCaseStudy } from "./hiring.js";

// Case study content by project slug (see projects in ../data.js).
export const caseStudies = {
  "customer-support": ticketDashboardCaseStudy,
  hiring: recruitmentCaseStudy,
};
