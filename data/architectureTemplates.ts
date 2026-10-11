/**
 * @file Career track templates (data/architectureTemplates.ts)
 *
 * Each template is the "slot board" for one career track. The player fills
 * slots with skills from the skill registry. File and type names are kept
 * from the Hackathon Simulator so the store and UI work unchanged.
 * Track ids are internal; see lib/vocabulary.ts for display names.
 */

import { TechRegistryItem } from './techRegistry';

type Family = TechRegistryItem['category'];

export interface ArchitectureSlot {
  id: string;
  label: string;
  priority: 'required' | 'recommended' | 'optional';
  description: string;
  emptyGuidance: string;
  compatibleCategories: Array<Family>;
}

export interface ArchitectureTemplate {
  solutionId: string;
  solutionName: string;
  slots: ArchitectureSlot[];
}

const DSA: Family = 'DSA & Problem Solving';
const CS: Family = 'Core CS';
const LANG: Family = 'Languages';
const WEB: Family = 'Web & App Dev';
const ML: Family = 'Data & ML';
const EMB: Family = 'Embedded & EE';
const APT: Family = 'Aptitude & Reasoning';
const COM: Family = 'Communication';
const TOOL: Family = 'Tools & Cloud';
const CERT: Family = 'Certifications & Domain';
const PROF: Family = 'Profile & Portfolio';

function slot(
  id: string,
  label: string,
  priority: ArchitectureSlot['priority'],
  description: string,
  compatibleCategories: Family[]
): ArchitectureSlot {
  return {
    id,
    label,
    priority,
    description,
    emptyGuidance: `[DROP_${id.replace(/-/g, '_').toUpperCase()}_SKILL_${priority === 'required' ? 'HERE' : 'OPTIONAL'}]`,
    compatibleCategories,
  };
}

export const ARCHITECTURE_TEMPLATES: Record<string, ArchitectureTemplate> = {
  'web-app': {
    solutionId: 'web-app',
    solutionName: 'Product SWE',
    slots: [
      slot('dsa-core', 'DSA Foundation', 'required', 'Arrays, hashing and sorting. Every online assessment starts here.', [DSA]),
      slot('dsa-advanced', 'DSA Advanced', 'required', 'Trees, graphs and dynamic programming separate product offers from the rest.', [DSA]),
      slot('corecs', 'Core CS Subject', 'required', 'OS, DBMS or networks. Interviewers love asking follow-ups here.', [CS]),
      slot('system-design', 'Design Thinking', 'recommended', 'Low-level design or system design basics for the design round.', [CS]),
      slot('lang', 'Primary Language', 'required', 'The language you code in during live rounds. Know it deeply.', [LANG]),
      slot('project-stack', 'Project Stack', 'recommended', 'The stack behind your best project, so you can discuss it in depth.', [WEB]),
      slot('comm', 'Communication', 'required', 'Thinking aloud and explaining projects clearly.', [COM]),
      slot('profile', 'Profile Proof', 'recommended', 'GitHub, internship or open-source work that backs your resume.', [PROF]),
      slot('tools', 'Tools and Workflow', 'optional', 'Git, Linux and testing habits that show engineering maturity.', [TOOL]),
      slot('aptitude', 'Aptitude Backup', 'optional', 'Some product companies still run an aptitude screen.', [APT]),
    ],
  },
  'mobile-app': {
    solutionId: 'mobile-app',
    solutionName: 'IT Services / Mass Recruiter',
    slots: [
      slot('aptitude-quant', 'Quantitative Aptitude', 'required', 'Speed and accuracy in the online test decide your shortlist.', [APT]),
      slot('aptitude-verbal', 'Verbal and Reasoning', 'recommended', 'English and logical reasoning sections carry cutoffs too.', [APT]),
      slot('lang', 'Primary Language', 'required', 'One language you can write clean basic programs in.', [LANG]),
      slot('corecs', 'Core CS Subject', 'required', 'DBMS, OS or OOP. Technical rounds stay close to the syllabus.', [CS]),
      slot('dsa-core', 'DSA Basics', 'recommended', 'Basic coding problems appear in nearly every services test.', [DSA]),
      slot('comm', 'Communication', 'required', 'Clear, confident speaking is a major filter in mass hiring.', [COM]),
      slot('hr', 'HR Round Readiness', 'recommended', 'Structured answers for the standard HR questions.', [COM]),
      slot('cert', 'Certification', 'optional', 'A relevant certification can lift you into a higher package track.', [CERT]),
      slot('profile', 'Profile Proof', 'optional', 'An internship or a decent project helps you stand out.', [PROF]),
      slot('tools', 'Tools', 'optional', 'Basic Git and Linux exposure for the technical round.', [TOOL]),
    ],
  },
  'ai-solution': {
    solutionId: 'ai-solution',
    solutionName: 'Data / ML Engineer',
    slots: [
      slot('ml-core', 'ML / Data Core', 'required', 'The main analytics or ML skill your resume leads with.', [ML]),
      slot('ml-advanced', 'ML Advanced', 'recommended', 'A deeper skill such as deep learning, vision or retrieval pipelines.', [ML]),
      slot('lang', 'Primary Language', 'required', 'Python is the default. Know it well enough to code live.', [LANG]),
      slot('dsa-core', 'DSA Basics', 'recommended', 'Most ML roles still run a coding screen.', [DSA]),
      slot('corecs', 'Core CS Subject', 'optional', 'DBMS or OS fundamentals for the general technical round.', [CS]),
      slot('tools', 'Tools and Deployment', 'recommended', 'Git, containers or cloud basics to show you can ship.', [TOOL]),
      slot('profile', 'Research or Project Proof', 'required', 'A paper, a public repo or an internship that proves real work.', [PROF]),
      slot('comm', 'Communication', 'required', 'Explaining experiments and results simply.', [COM]),
      slot('cert', 'Certification', 'optional', 'Cloud or ML certification as a supporting signal.', [CERT]),
    ],
  },
  'iot-product': {
    solutionId: 'iot-product',
    solutionName: 'Core EE / Embedded',
    slots: [
      slot('embedded-core', 'Core Electrical / Embedded', 'required', 'Embedded C, circuits or power systems. This is what core interviews test.', [EMB]),
      slot('embedded-hands', 'Hands-On Build', 'recommended', 'A board, a simulation or a PCB you actually built.', [EMB]),
      slot('lang', 'Primary Language', 'required', 'C is the safe choice. Python helps for tooling and scripting.', [LANG]),
      slot('corecs', 'Computing Fundamentals', 'recommended', 'OS and networks basics for firmware and IoT roles.', [CS]),
      slot('aptitude', 'Aptitude', 'recommended', 'Written tests still screen core candidates.', [APT]),
      slot('comm', 'Communication', 'required', 'Explaining your hardware projects to a non-expert panel.', [COM]),
      slot('profile', 'Profile Proof', 'recommended', 'Internship, lab project or a documented build.', [PROF]),
      slot('cert', 'Certification / GATE', 'optional', 'GATE or an automation certification as a second path.', [CERT]),
      slot('tools', 'Tools', 'optional', 'Git and Linux for toolchains and version control.', [TOOL]),
    ],
  },
  platform: {
    solutionId: 'platform',
    solutionName: 'Startup Full-Stack',
    slots: [
      slot('web-front', 'Frontend Skill', 'required', 'The UI skill that lets you ship something visible.', [WEB]),
      slot('web-back', 'Backend and Data Skill', 'required', 'APIs and a database you can build and explain end to end.', [WEB]),
      slot('lang', 'Primary Language', 'required', 'The language you ship fastest in.', [LANG]),
      slot('tools', 'Tools and Deployment', 'required', 'Git, containers or CI. Startups expect you to deploy.', [TOOL]),
      slot('dsa-core', 'DSA Basics', 'recommended', 'Startups run lighter coding rounds but still run them.', [DSA]),
      slot('profile', 'Portfolio Proof', 'required', 'Live projects, real users and public code.', [PROF]),
      slot('comm', 'Communication', 'required', 'Founder conversations reward clarity and ownership.', [COM]),
      slot('data', 'Data Skill', 'optional', 'A bit of analytics or AI makes you more useful.', [ML]),
      slot('corecs', 'Core CS Subject', 'optional', 'DBMS or networks for depth questions.', [CS]),
    ],
  },
  marketplace: {
    solutionId: 'marketplace',
    solutionName: 'Higher Studies / Research',
    slots: [
      slot('cert-exam', 'Exam Preparation', 'required', 'GATE, GRE or IELTS. This decides your admission or shortlist.', [CERT]),
      slot('research-proof', 'Research Proof', 'required', 'A paper, an open-source contribution or a research internship.', [PROF]),
      slot('subject-depth', 'Subject Depth', 'recommended', 'Mastery in the field you want to study.', [ML, EMB]),
      slot('lang', 'Primary Language', 'recommended', 'For experiments, simulations and coursework.', [LANG]),
      slot('comm', 'Communication', 'required', 'Statement of purpose, interviews and presenting your work.', [COM]),
      slot('corecs', 'Core Fundamentals', 'optional', 'Supporting fundamentals for entrance interviews.', [CS]),
      slot('dsa-core', 'DSA Basics', 'optional', 'Useful if you keep placements as a backup.', [DSA]),
      slot('aptitude', 'Aptitude', 'optional', 'Quantitative skills help in GRE and some PSU tests.', [APT]),
      slot('tools', 'Tools', 'optional', 'Version control and reproducible workflows.', [TOOL]),
    ],
  },
};
