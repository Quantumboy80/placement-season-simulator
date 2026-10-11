/**
 * @file Season rules shown to the player (data/modifiers.ts)
 *
 * Ids are stable internal keys. The mechanics for each rule live in
 * lib/seasonRules.ts, so copy here and logic stay in sync in one place.
 *
 * @module data/modifiers
 */

export interface Modifier {
  id: string;
  name: string;
  description: string;
  effectDescription: string;
}

export const MODIFIERS: Modifier[] = [
  {
    id: "NO_AI_TOOLS",
    name: "Closed-Book Tests",
    description: "No notes, no calculators, no search. Fundamentals only.",
    effectDescription: "Penalty (-25 Skills, -15 Projects) if your stack has no aptitude or DSA basics skill.",
  },
  {
    id: "BOOTSTRAP_ONLY",
    name: "Free Resources Only",
    description: "No paid courses or cert fees this season.",
    effectDescription: "Paid certification or exam skills cost you -20 Projects.",
  },
  {
    id: "MOBILE_ONLY",
    name: "Services Season",
    description: "Only IT services and mass recruiters are hiring.",
    effectDescription: "-25 Projects if your career track is not IT Services.",
  },
  {
    id: "WEB_ONLY",
    name: "Product Season",
    description: "Only product companies are on campus this year.",
    effectDescription: "-25 Projects if your career track is not Product SWE.",
  },
  {
    id: "AI_ONLY",
    name: "Data Season",
    description: "Only data and AI roles are open.",
    effectDescription: "-25 Projects if your career track is not Data / ML.",
  },
  {
    id: "LIMITED_BUDGET",
    name: "Tight Prep Budget",
    description: "Limited money and time for books, tests and travel.",
    effectDescription: "Lowers your starting Projects score by 15.",
  },
  {
    id: "GREEN_FIRST",
    name: "Research Season",
    description: "Companies are valuing papers and research this year.",
    effectDescription: "+15 bonus if your edge is Research-Driven or you picked a research paper.",
  },
  {
    id: "USER_SENSITIVE",
    name: "Resume Scrutiny",
    description: "Recruiters are strict on resume quality.",
    effectDescription: "+15 Resume if it is 80 or higher, otherwise -25.",
  },
  {
    id: "TECH_WIZARD",
    name: "Skill Synergy Bonus",
    description: "Panels love well-matched skill combinations.",
    effectDescription: "Your synergy bonus points are doubled.",
  },
  {
    id: "SOLO_DEV",
    name: "Solo Prep",
    description: "No squad support this season.",
    effectDescription: "Lucky-break time additions are disabled.",
  },
  {
    id: "FAST_SHIP",
    name: "Short Prep Window",
    description: "Drives start sooner than expected.",
    effectDescription: "-20 Projects if you plan more than 2 must-do activities.",
  },
  {
    id: "NO_MENTOR",
    name: "No Mentor Season",
    description: "Seniors are unavailable. You are on your own.",
    effectDescription: "Mentor tips are disabled and using any hint costs -30 Communication.",
  },
  {
    id: "OPEN_SOURCE",
    name: "Portfolio Required",
    description: "Every recruiter asks for a link to your work.",
    effectDescription: "-15 Skills if you have no portfolio, internship, paper or open-source proof.",
  },
  {
    id: "MONETIZE_NOW",
    name: "Package Pressure",
    description: "Only a high package counts as success this season.",
    effectDescription: "-20 Communication if you chose the Safety Net First strategy.",
  },
  {
    id: "SECURITY_FIRST",
    name: "Fundamentals First",
    description: "Panels only ask core CS and subject fundamentals.",
    effectDescription: "-20 Projects if you have no OS, DBMS, networks or OOP skill.",
  },
  {
    id: "MINIMALIST",
    name: "Focused Plan",
    description: "Your prep plan must be tiny and sharp.",
    effectDescription: "-15 Resume unless you plan exactly 2 must-do activities.",
  },
  {
    id: "HARDCORE_JUDGE",
    name: "Strict Panel",
    description: "The interview panel is extremely critical today.",
    effectDescription: "Your final interview score is multiplied by 0.85.",
  },
  {
    id: "CRITICAL_PATH",
    name: "Essentials Only",
    description: "Only the must-do items count this sprint.",
    effectDescription: "-15 Projects if you plan more than 3 must-do activities.",
  },
  {
    id: "CLOUD_NATIVE",
    name: "Cloud Roles Hiring",
    description: "Companies want cloud and container basics.",
    effectDescription: "-15 Skills unless you picked both Cloud Basics and Docker.",
  },
  {
    id: "ACCESSIBILITY_MANDATE",
    name: "English Screening",
    description: "Every round includes a spoken English check.",
    effectDescription: "-15 Communication unless you picked Spoken English or Group Discussion skills.",
  },
  {
    id: "CHAOS_MAGNET",
    name: "Unstable Season",
    description: "Schedules change at the last minute.",
    effectDescription: "Chaos event probability rises to 35%.",
  },
];
