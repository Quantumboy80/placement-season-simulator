/**
 * @file Company drive database
 *
 * 18 fictional but realistic campus-hiring drives across 7 company types.
 * Companies are invented on purpose, so the game never claims facts about a
 * real employer. Real-world patterns live in the RAG knowledge base
 * (data/kb/*) and are labelled as general guidance.
 *
 * The exported type is still `Problem` and the export is still `PROBLEMS`,
 * so the store and UI keep working unchanged.
 *
 * @module data/problems
 */

import type { Problem } from '@/types/game';

export const PROBLEMS: Problem[] = [
  // ─── IT Services ───────────────────────────────────────────────────────────
  {
    id: 'drive-nexasoft',
    title: 'NexaSoft Systems: Associate Engineer (Mass Hiring)',
    description: 'A large IT services firm is hiring thousands of freshers. Round 1 is an online aptitude and coding test, followed by a technical and HR interview.',
    category: 'it-services',
    difficulty: 'beginner',
    constraints: ['Minimum 60% throughout academics', 'No active backlogs', 'Two-year service agreement'],
    bonusObjectives: ['Clear the advanced coding track for a higher package', 'Hold a relevant certification'],
    judgingHint: 'Show consistent fundamentals and clear communication. Volume hiring rewards reliability over brilliance.',
  },
  {
    id: 'drive-bharat-infoworks',
    title: 'Bharat InfoWorks: Systems Engineer Trainee',
    description: 'A legacy-to-cloud migration team wants trainees who learn fast and are comfortable with databases, Linux and basic scripting.',
    category: 'it-services',
    difficulty: 'beginner',
    constraints: ['Willing to relocate anywhere in India', 'Rotational shifts during training', 'Written test has negative marking'],
    bonusObjectives: ['Show one SQL-heavy project', 'Explain a real bug you fixed'],
    judgingHint: 'Highlight adaptability and willingness to learn. They hire trainability.',
  },
  {
    id: 'drive-cobalt-digital',
    title: 'Cobalt Digital: Digital Specialist Programmer',
    description: 'A premium track inside a services company. Harder coding round, higher package, and a panel that tests DSA plus one project in depth.',
    category: 'it-services',
    difficulty: 'intermediate',
    constraints: ['Advanced coding test with 2 hard problems', 'CGPA of 7.5 or above', 'Project walkthrough is mandatory'],
    bonusObjectives: ['Solve both coding problems fully', 'Bring a deployed project'],
    judgingHint: 'Treat it like a product interview with a services-company screen on top.',
  },

  // ─── Product Companies ─────────────────────────────────────────────────────
  {
    id: 'drive-orbit-labs',
    title: 'Orbit Labs: SDE-1 (Product Engineering)',
    description: 'A fast-growing product company hires SDE-1s through an online assessment, two DSA rounds, one design round and a hiring manager chat.',
    category: 'product',
    difficulty: 'advanced',
    constraints: ['Online assessment cutoff is strict', 'Two live coding rounds on a shared editor', 'Basic low-level design expected'],
    bonusObjectives: ['Optimise your solution without a hint', 'Discuss trade-offs in your own project'],
    judgingHint: 'Think aloud. They grade your problem-solving process as much as the final code.',
  },
  {
    id: 'drive-pixelhive',
    title: 'Pixelhive: Frontend Engineer',
    description: 'A design-led product studio wants a frontend engineer with strong JavaScript, a sharp eye for UI and projects they can open in a browser.',
    category: 'product',
    difficulty: 'intermediate',
    constraints: ['Portfolio link is mandatory', 'Live UI task in the interview', 'Performance and accessibility questions'],
    bonusObjectives: ['Ship a polished side project', 'Contribute to an open-source UI library'],
    judgingHint: 'Show, do not tell. A live link beats a bullet point.',
  },
  {
    id: 'drive-zenith-cloud',
    title: 'Zenith Cloud: Backend Engineer (Infrastructure)',
    description: 'An infrastructure team builds scheduling and storage systems. They test OS, networking, concurrency and system design basics.',
    category: 'product',
    difficulty: 'advanced',
    constraints: ['Strong OS and networks fundamentals', 'Concurrency questions in round 2', 'A system design discussion for freshers'],
    bonusObjectives: ['Explain a deadlock you actually debugged', 'Build a small distributed project'],
    judgingHint: 'Depth in fundamentals beats a long list of frameworks.',
  },

  // ─── Startups ──────────────────────────────────────────────────────────────
  {
    id: 'drive-sparkline-ai',
    title: 'Sparkline AI: Founding Engineer Intern',
    description: 'A seed-stage AI startup wants someone who can ship an LLM feature end to end in two weeks. The interview is a take-home plus a founder chat.',
    category: 'startup',
    difficulty: 'intermediate',
    constraints: ['48-hour take-home task', 'Unstructured interview with the founder', 'Stipend first, offer after a trial'],
    bonusObjectives: ['Deliver the take-home with a short demo video', 'Show a past project with real users'],
    judgingHint: 'Founders hire ownership. Talk about what you decided, not what you were told.',
  },
  {
    id: 'drive-kirana-stack',
    title: 'Kirana Stack: Full-Stack Developer',
    description: 'A B2B commerce startup for neighbourhood shops needs a developer who can own a feature from database to UI.',
    category: 'startup',
    difficulty: 'intermediate',
    constraints: ['Live pair-programming round', 'Must know one full stack end to end', 'Equity discussion in final round'],
    bonusObjectives: ['Show a project with real payments or auth', 'Explain your database schema choices'],
    judgingHint: 'Breadth with working proof matters more than marks.',
  },
  {
    id: 'drive-railgrid',
    title: 'RailGrid: Product Engineer',
    description: 'A logistics-tech startup mixes engineering and product. They want someone who can read data, talk to users and write code.',
    category: 'startup',
    difficulty: 'intermediate',
    constraints: ['Case-style product question', 'One coding round, one product round', 'Direct conversation with the CEO'],
    bonusObjectives: ['Bring a data-driven insight from a past project', 'Show you talked to real users'],
    judgingHint: 'Connect every technical choice to a user problem.',
  },

  // ─── Core Engineering ──────────────────────────────────────────────────────
  {
    id: 'drive-volt-dynamics',
    title: 'Volt Dynamics: Graduate Engineer Trainee (Electrical)',
    description: 'A power and automation company hires electrical engineers. Written test on core subjects, then a technical interview and HR.',
    category: 'core-engg',
    difficulty: 'intermediate',
    constraints: ['Core subject test: machines, power systems, control', 'Plant visit during training', 'Minimum 65% in engineering'],
    bonusObjectives: ['Explain a hardware project you built yourself', 'Know basics of protection and switchgear'],
    judgingHint: 'Core recruiters test fundamentals first. Know your syllabus cold.',
  },
  {
    id: 'drive-aero-circuits',
    title: 'Aero Circuits: Embedded Firmware Engineer',
    description: 'A firmware team for automotive and aerospace electronics tests Embedded C, microcontrollers, communication protocols and debugging.',
    category: 'core-engg',
    difficulty: 'advanced',
    constraints: ['Embedded C coding on paper', 'Questions on interrupts, timers and RTOS', 'Hands-on debugging scenario'],
    bonusObjectives: ['Demonstrate a working STM32 or ESP32 project', 'Discuss I2C, SPI and UART trade-offs'],
    judgingHint: 'Bring a real board project. Explaining your own debugging story wins interviews.',
  },
  {
    id: 'drive-helix-automation',
    title: 'Helix Automation: Controls and PLC Engineer',
    description: 'A factory-automation integrator needs engineers for PLC programming, sensors, drives and SCADA commissioning.',
    category: 'core-engg',
    difficulty: 'intermediate',
    constraints: ['Willing to travel to client sites', 'Basics of ladder logic expected', 'Technical round on control systems'],
    bonusObjectives: ['Complete an industrial automation certification', 'Show a closed-loop control mini project'],
    judgingHint: 'Practical exposure matters. Even a lab simulation project counts.',
  },

  // ─── Data and AI ───────────────────────────────────────────────────────────
  {
    id: 'drive-insightly',
    title: 'Insightly Analytics: Data Analyst',
    description: 'An analytics firm hires analysts. Expect SQL, Excel, statistics and a business case about interpreting a messy dataset.',
    category: 'data-ai',
    difficulty: 'intermediate',
    constraints: ['SQL test with joins and window functions', 'Case study presented to a panel', 'Statistics fundamentals expected'],
    bonusObjectives: ['Build a dashboard from a real dataset', 'Explain an A/B test result clearly'],
    judgingHint: 'Tell the story behind the numbers. Panels reward clarity over complexity.',
  },
  {
    id: 'drive-visionforge',
    title: 'VisionForge: ML Engineer (Computer Vision)',
    description: 'A vision startup builds detection models for agriculture and manufacturing. They want fundamentals plus one serious ML project.',
    category: 'data-ai',
    difficulty: 'advanced',
    constraints: ['Deep dive on one ML project', 'Questions on evaluation metrics and overfitting', 'Python coding with NumPy and a framework'],
    bonusObjectives: ['Present a paper or reproducible experiment', 'Compare model architectures with real numbers'],
    judgingHint: 'Defend your experimental choices. Interviewers probe why you picked each model.',
  },

  // ─── Government / PSU ──────────────────────────────────────────────────────
  {
    id: 'drive-rashtriya-power',
    title: 'Rashtriya Power Corp: Executive Trainee (via GATE)',
    description: 'A public-sector power company shortlists through GATE scores, then runs a group discussion and a personal interview.',
    category: 'govt-psu',
    difficulty: 'advanced',
    constraints: ['GATE score decides the shortlist', 'Group discussion plus interview', 'Reservation and age norms apply'],
    bonusObjectives: ['Score above the previous year cutoff', 'Prepare current affairs on the energy sector'],
    judgingHint: 'The score gets you in the room. Your subject clarity and calm get you the offer.',
  },
  {
    id: 'drive-national-grid',
    title: 'National Grid Services: Engineer Trainee',
    description: 'A transmission utility hires engineers through a written test and interview with a service bond and a stable pay scale.',
    category: 'govt-psu',
    difficulty: 'intermediate',
    constraints: ['Written technical exam', 'Medical and document verification', 'Posting anywhere in the country'],
    bonusObjectives: ['Strong fundamentals in power systems', 'Prepare for a technical viva'],
    judgingHint: 'Be precise and humble in the viva. Do not bluff on fundamentals.',
  },

  // ─── BFSI / Consulting ─────────────────────────────────────────────────────
  {
    id: 'drive-meridian-capital',
    title: 'Meridian Capital Tech: Technology Analyst',
    description: 'A financial institution builds trading and risk platforms. They test coding, databases and how you reason under pressure.',
    category: 'bfsi-consulting',
    difficulty: 'intermediate',
    constraints: ['Timed coding round with strict cutoffs', 'SQL and basic financial literacy', 'Behavioural interview on ethics and risk'],
    bonusObjectives: ['Explain a project involving data integrity', 'Know basic banking terminology'],
    judgingHint: 'Accuracy and composure are the brand here. Avoid sloppy answers.',
  },
  {
    id: 'drive-axiom-consulting',
    title: 'Axiom Consulting: Associate Consultant (Tech)',
    description: 'A consulting firm puts freshers on client technology projects. Case-style interviews test structured thinking and communication.',
    category: 'bfsi-consulting',
    difficulty: 'advanced',
    constraints: ['Case interview with structured problem solving', 'Group exercise', 'Strong communication threshold'],
    bonusObjectives: ['Structure an answer in under a minute', 'Show leadership in a team project'],
    judgingHint: 'Structure first, answer second. Consulting panels grade how you think aloud.',
  },
];
