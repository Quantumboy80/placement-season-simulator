/**
 * @file Strategy generator for the placement rounds.
 *
 * Produces, from the player's choices so far:
 *   - "Your Edge" options (formerly USPs)
 *   - Prep activity backlog (formerly features)
 *   - Application strategies (formerly business models)
 *   - Senior mentor advice cards
 *   - Mentor confidence score
 *   - A 30-second "Tell me about yourself" script
 *
 * Exported names and shapes are unchanged from the Hackathon Simulator so the
 * store and UI keep working. Everything is deterministic for a given seed.
 */

import type { Problem, Feature, TechItem, GeneratedBusinessModel, AdvisorAdvice } from '@/types/game';
import { toRegistryId } from '@/data/techRegistry';
import { useGameStore } from '@/store/gameStore';

// ─── Types ──────────────────────────────────────────────────────────────────

/** The seven "edges" a candidate can lean on. */
export type EdgeKey =
  | 'Consistency'
  | 'Self-Taught'
  | 'Breadth'
  | 'Specialist'
  | 'Research-Driven'
  | 'Polished Profile'
  | 'Network-First';

export interface GeneratedUSP {
  key: EdgeKey;
  name: string;
  desc: string;
  innovation: number; // Skills
  execution: number; // Projects
  design: number; // Resume
  pitch: number; // Communication
  advantages: string;
  challenges: string;
  tradeoffInfo?: string;
}

export interface GeneratedFeature extends Feature {
  dependsOn?: string;
  dependsOnName?: string;
  innovationScore: number;
}

// ─── Seeded random ──────────────────────────────────────────────────────────

function createSeededRandom(seedStr: string) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = (Math.imul(31, h) + seedStr.charCodeAt(i)) | 0;
  }
  return function () {
    let t = (h += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickSeeded<T>(arr: T[], rand: () => number, n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

// ─── Your Edge (USP) ────────────────────────────────────────────────────────

const EDGE_TEMPLATES: Array<
  Omit<GeneratedUSP, 'tradeoffInfo'> & { tracks: string[] }
> = [
  {
    key: 'Consistency',
    name: 'The Consistent Grinder',
    desc: 'You show up every single day. Small, steady practice compounds into offers.',
    innovation: 45, execution: 75, design: 55, pitch: 50,
    advantages: 'Reliable progress, strong test performance, calm in interviews.',
    challenges: 'Can look average on paper unless you add visible proof like projects.',
    tracks: ['web-app', 'mobile-app'],
  },
  {
    key: 'Self-Taught',
    name: 'The Self-Taught Builder',
    desc: 'You learned from free resources and built things without being told to.',
    innovation: 50, execution: 70, design: 45, pitch: 50,
    advantages: 'Shows initiative and curiosity. Startups love this story.',
    challenges: 'Gaps in fundamentals and a weaker-looking resume if you do not polish it.',
    tracks: ['platform', 'ai-solution'],
  },
  {
    key: 'Breadth',
    name: 'The All-Rounder',
    desc: 'Decent at aptitude, coding, communication and core subjects. Few weak spots.',
    innovation: 55, execution: 65, design: 50, pitch: 65,
    advantages: 'Clears most first rounds across many company types.',
    challenges: 'Lacks a signature strength, so top-tier panels may find you forgettable.',
    tracks: ['mobile-app', 'marketplace'],
  },
  {
    key: 'Specialist',
    name: 'The Deep Specialist',
    desc: 'One area, deeply. Interviewers can go three levels down and you still answer.',
    innovation: 80, execution: 50, design: 50, pitch: 65,
    advantages: 'Stands out instantly for the right role and impresses technical panels.',
    challenges: 'Weak outside your lane. Risky if the drive tests broad fundamentals.',
    tracks: ['ai-solution', 'iot-product'],
  },
  {
    key: 'Research-Driven',
    name: 'The Research Mind',
    desc: 'Papers, experiments and first-principles thinking. You ask why before how.',
    innovation: 70, execution: 55, design: 55, pitch: 70,
    advantages: 'Excellent for ML, core R&D and higher studies. Gives you great stories.',
    challenges: 'Slower to ship and less polished on routine placement tests.',
    tracks: ['ai-solution', 'marketplace', 'iot-product'],
  },
  {
    key: 'Polished Profile',
    name: 'The Polished Profile',
    desc: 'A sharp resume, clean GitHub and a LinkedIn that recruiters actually open.',
    innovation: 55, execution: 50, design: 80, pitch: 60,
    advantages: 'Gets shortlisted more often and starts every interview with goodwill.',
    challenges: 'Polish cannot hide thin skills. Interviews will expose the gap.',
    tracks: ['web-app', 'platform'],
  },
  {
    key: 'Network-First',
    name: 'The Connector',
    desc: 'Alumni, seniors and recruiters know you. Referrals open doors that tests close.',
    innovation: 50, execution: 55, design: 50, pitch: 75,
    advantages: 'Referrals skip the resume pile and your communication shines.',
    challenges: 'Referrals get you the interview, not the offer. Skills still decide.',
    tracks: ['platform', 'mobile-app'],
  },
];

export function generateUSPOptions(
  problem: Problem | null,
  solutionDirection: string | null,
  techStack: TechItem[],
  gameMode: string,
  runSeed?: string
): GeneratedUSP[] {
  const seed = runSeed || (problem ? problem.id : 'drive') + gameMode + techStack.map((t) => t.id).join('');
  const rand = createSeededRandom(seed);

  const preferred = EDGE_TEMPLATES.filter((t) => solutionDirection && t.tracks.includes(solutionDirection));
  const others = EDGE_TEMPLATES.filter((t) => !preferred.includes(t));
  const chosen = [...pickSeeded(preferred, rand, 3), ...pickSeeded(others, rand, 4)].slice(0, 4);

  return chosen.map(({ tracks: _tracks, ...t }) => ({
    ...t,
    innovation: clamp(t.innovation + Math.round((rand() - 0.5) * 6)),
    execution: clamp(t.execution + Math.round((rand() - 0.5) * 6)),
    design: clamp(t.design + Math.round((rand() - 0.5) * 6)),
    pitch: clamp(t.pitch + Math.round((rand() - 0.5) * 6)),
    tradeoffInfo: `Best for ${solutionDirection ? 'your track' : 'many tracks'}. Watch out: ${t.challenges}`,
  }));
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}

// ─── Prep activity backlog (formerly features) ──────────────────────────────

interface Activity {
  id: string;
  name: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  dependsOn?: string;
}

const COMMON_ACTIVITIES: Activity[] = [
  { id: 'act-resume-1pg', name: 'Write a clean one-page resume', description: 'Single page, quantified bullets, no photo, no objective paragraph.', effort: 'low', impact: 'high' },
  { id: 'act-linkedin', name: 'Update LinkedIn and GitHub README', description: 'Recruiters look you up before the interview. Make that 30 seconds count.', effort: 'low', impact: 'medium' },
  { id: 'act-project-walkthrough', name: 'Prepare a 3-minute project walkthrough', description: 'Problem, your role, one hard bug, one measurable result.', effort: 'low', impact: 'high' },
  { id: 'act-hr-answers', name: 'Write STAR answers for 8 HR questions', description: 'Strengths, weaknesses, conflict, failure, why this company.', effort: 'low', impact: 'medium' },
  { id: 'act-sleep-plan', name: 'Fix a sleep and revision schedule', description: 'A calm brain recalls more than a cramming one.', effort: 'low', impact: 'low' },
  { id: 'act-mock-5', name: 'Do five mock interviews with seniors', description: 'Record yourself, find the filler words, fix them.', effort: 'medium', impact: 'high', dependsOn: 'act-project-walkthrough' },
  { id: 'act-company-research', name: 'Research each company before you apply', description: 'Product, tech stack, recent news and the usual interview rounds.', effort: 'medium', impact: 'medium' },
  { id: 'act-gd-practice', name: 'Join a weekly group discussion circle', description: 'Practise opening, building on points and closing.', effort: 'medium', impact: 'medium' },
  { id: 'act-core-notes', name: 'Make one-page notes for each core subject', description: 'Definitions, formulas and the three classic questions per topic.', effort: 'medium', impact: 'medium' },
  { id: 'act-memorize-answers', name: 'Memorise 100 ready-made answers', description: 'Sounds efficient, reads robotic, collapses on the first follow-up question.', effort: 'high', impact: 'low' },
  { id: 'act-certificates', name: 'Collect ten online certificates', description: 'Looks busy on paper. Recruiters rarely care about quantity.', effort: 'high', impact: 'low' },
  { id: 'act-apply-everywhere', name: 'Apply to every drive without reading it', description: 'Burns energy and clashes with schedules.', effort: 'medium', impact: 'low' },
];

const TRACK_ACTIVITIES: Record<string, Activity[]> = {
  'web-app': [
    { id: 'act-lc-150', name: 'Solve 150 pattern-wise DSA problems', description: 'Group problems by pattern: two pointers, BFS, DP. Review mistakes weekly.', effort: 'high', impact: 'high' },
    { id: 'act-weekly-contest', name: 'Join one coding contest every week', description: 'Practise speed and calm under a ticking clock.', effort: 'medium', impact: 'medium' },
    { id: 'act-cs-revision', name: 'Revise OS, DBMS and networks', description: 'Interviewers love follow-ups here. Know the why behind each concept.', effort: 'medium', impact: 'high' },
    { id: 'act-sd-basics', name: 'Learn system design basics', description: 'Load balancing, caching, databases. Enough to hold a fresher-level discussion.', effort: 'high', impact: 'medium', dependsOn: 'act-cs-revision' },
    { id: 'act-deployed-project', name: 'Deploy one full-stack project with real users', description: 'A live link beats ten private repos.', effort: 'high', impact: 'high' },
    { id: 'act-lld', name: 'Practise five low-level design problems', description: 'Parking lot, LRU cache, rate limiter. Clean classes and clear trade-offs.', effort: 'medium', impact: 'medium' },
  ],
  'mobile-app': [
    { id: 'act-aptitude-drill', name: 'Do a daily 40-minute aptitude drill', description: 'Quant, logic and verbal. Speed matters more than depth.', effort: 'low', impact: 'high' },
    { id: 'act-mock-tests', name: 'Take weekly timed online mock tests', description: 'Practise the exact pattern: sections, negative marking and time limits.', effort: 'medium', impact: 'high' },
    { id: 'act-basic-coding', name: 'Solve 60 easy and medium coding problems', description: 'Loops, strings, arrays, basic recursion.', effort: 'medium', impact: 'high' },
    { id: 'act-sql-basics', name: 'Practise SQL joins and group-by queries', description: 'Almost every services technical round touches SQL.', effort: 'low', impact: 'medium' },
    { id: 'act-english', name: 'Speak English for 20 minutes daily', description: 'Shadow a speaker, record yourself, repeat.', effort: 'medium', impact: 'medium' },
    { id: 'act-cert-one', name: 'Finish one relevant certification', description: 'A single credible certificate can lift you into a higher package track.', effort: 'high', impact: 'medium' },
  ],
  'ai-solution': [
    { id: 'act-ml-project', name: 'Build one ML project end to end', description: 'Data cleaning, baseline, error analysis and a clear write-up.', effort: 'high', impact: 'high' },
    { id: 'act-stats-revision', name: 'Revise statistics and probability', description: 'Distributions, hypothesis tests, bias and variance.', effort: 'medium', impact: 'high' },
    { id: 'act-sql-analytics', name: 'Practise analytics SQL with window functions', description: 'Interview favourite for analyst roles.', effort: 'medium', impact: 'medium' },
    { id: 'act-read-paper', name: 'Read and summarise two papers in your domain', description: 'Gives you real talking points in the project round.', effort: 'high', impact: 'medium' },
    { id: 'act-kaggle', name: 'Try one Kaggle competition', description: 'Shows you can iterate on messy data and read leaderboards honestly.', effort: 'high', impact: 'medium' },
    { id: 'act-explain-model', name: 'Practise explaining a model to a non-expert', description: 'The best data hires translate results into decisions.', effort: 'low', impact: 'high' },
  ],
  'iot-product': [
    { id: 'act-core-revision', name: 'Revise core subjects: machines, control, circuits', description: 'Core panels start with the syllabus. Know it cold.', effort: 'high', impact: 'high' },
    { id: 'act-embedded-c', name: 'Practise 30 Embedded C questions', description: 'Bit manipulation, volatile, interrupts, memory layout.', effort: 'medium', impact: 'high' },
    { id: 'act-board-project', name: 'Finish one board project with documentation', description: 'A working STM32, ESP32 or Arduino build with a schematic and write-up.', effort: 'high', impact: 'high' },
    { id: 'act-simulation', name: 'Run two MATLAB or Simulink simulations', description: 'Control loops or power electronics you can explain on a whiteboard.', effort: 'medium', impact: 'medium' },
    { id: 'act-protocols', name: 'Make a cheat-sheet for I2C, SPI and UART', description: 'Frequent interview questions with clear differences and use cases.', effort: 'low', impact: 'medium' },
    { id: 'act-gate-backup', name: 'Keep a light GATE backup plan', description: 'A second path lowers placement stress.', effort: 'medium', impact: 'medium' },
  ],
  platform: [
    { id: 'act-ship-three', name: 'Ship three small projects in 30 days', description: 'Speed and ownership are the real startup interview.', effort: 'high', impact: 'high' },
    { id: 'act-take-home', name: 'Practise a 48-hour take-home task', description: 'Scope tightly, write a README, record a short demo.', effort: 'medium', impact: 'high' },
    { id: 'act-open-source', name: 'Make two open-source pull requests', description: 'Shows you can read other people\'s code and collaborate.', effort: 'high', impact: 'medium' },
    { id: 'act-founder-outreach', name: 'Message ten founders with a specific pitch', description: 'Short, relevant and with a link to something you built.', effort: 'low', impact: 'medium' },
    { id: 'act-deploy-basics', name: 'Learn deploy, logs and CI basics', description: 'Startups expect you to ship, not just code.', effort: 'medium', impact: 'medium' },
    { id: 'act-product-sense', name: 'Write a short product teardown', description: 'Pick an app, say what you would change and why.', effort: 'low', impact: 'medium' },
  ],
  marketplace: [
    { id: 'act-gate-plan', name: 'Follow a structured GATE study plan', description: 'Syllabus coverage, weekly tests and error notebooks.', effort: 'high', impact: 'high' },
    { id: 'act-research-intern', name: 'Apply to three research internships', description: 'Reach out to professors with a specific, short email.', effort: 'medium', impact: 'high' },
    { id: 'act-sop', name: 'Draft your statement of purpose', description: 'Your story, your questions, and why this lab or university.', effort: 'medium', impact: 'high' },
    { id: 'act-paper-writing', name: 'Turn one project into a paper draft', description: 'Even a workshop-level submission teaches the full pipeline.', effort: 'high', impact: 'high' },
    { id: 'act-ielts', name: 'Book and prepare for IELTS or GRE', description: 'Plan the dates around your application deadlines.', effort: 'medium', impact: 'medium' },
    { id: 'act-lor', name: 'Line up three recommenders early', description: 'Good letters need time and context.', effort: 'low', impact: 'medium' },
  ],
};

const CATEGORY_ACTIVITIES: Record<string, Activity[]> = {
  'it-services': [
    { id: 'act-cat-test-pattern', name: 'Study the last three years of test patterns', description: 'Section order, cutoffs and typical question types.', effort: 'low', impact: 'high' },
  ],
  product: [
    { id: 'act-cat-think-aloud', name: 'Practise thinking aloud while coding', description: 'Narrate trade-offs. Silence reads as stuck.', effort: 'low', impact: 'high' },
  ],
  startup: [
    { id: 'act-cat-own-story', name: 'Prepare a story where you owned the outcome', description: 'Decision, trade-off, result. No "we were told to".', effort: 'low', impact: 'high' },
  ],
  'core-engg': [
    { id: 'act-cat-lab-story', name: 'Prepare a story from your lab or workshop', description: 'What failed, what you measured, what you fixed.', effort: 'low', impact: 'high' },
  ],
  'data-ai': [
    { id: 'act-cat-metrics', name: 'Revise evaluation metrics and when to use each', description: 'Precision, recall, F1, AUC. A guaranteed topic.', effort: 'low', impact: 'high' },
  ],
  'govt-psu': [
    { id: 'act-cat-current-affairs', name: 'Read sector current affairs weekly', description: 'Energy, infrastructure and policy basics for the interview.', effort: 'low', impact: 'medium' },
  ],
  'bfsi-consulting': [
    { id: 'act-cat-case', name: 'Practise one case interview a week', description: 'Structure first, numbers second, recommendation last.', effort: 'medium', impact: 'high' },
  ],
};

export function generateFeatureBacklog(
  problem: Problem | null,
  solutionDirection: string | null,
  chosenUSP: GeneratedUSP | null,
  techStack: TechItem[],
  runSeed?: string
): GeneratedFeature[] {
  const seed =
    (problem ? problem.id : 'prep') + (chosenUSP ? chosenUSP.name : 'edge') + (solutionDirection || 'track') + (runSeed || 'classic');
  const rand = createSeededRandom(seed);

  const trackPool = TRACK_ACTIVITIES[solutionDirection || 'web-app'] || TRACK_ACTIVITIES['web-app'];
  const catPool = CATEGORY_ACTIVITIES[problem?.category || 'product'] || [];
  const all: Activity[] = [...trackPool, ...catPool, ...COMMON_ACTIVITIES];
  const byId = new Map(all.map((a) => [a.id, a]));

  const picked = new Map<string, Activity>();
  const take = (effort: Activity['effort'], n: number) => {
    // prefer high-impact for the first slots, then random fill
    const pool = pickSeeded(all.filter((a) => a.effort === effort && !picked.has(a.id)), rand, 99);
    for (const a of pool) {
      if (n <= 0) break;
      picked.set(a.id, a);
      n--;
    }
  };
  // Same mix as the original game: 4 low, 3 medium, 3 high
  take('high', 3);
  take('medium', 3);
  take('low', 4);

  // Pull in dependencies so a picked activity never depends on a missing one
  for (const a of Array.from(picked.values())) {
    if (a.dependsOn && !picked.has(a.dependsOn)) {
      const dep = byId.get(a.dependsOn);
      if (dep) picked.set(dep.id, dep);
    }
  }

  const list = Array.from(picked.values()).slice(0, 12);
  return list.map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    effort: a.effort,
    impact: a.impact,
    dependsOn: a.dependsOn,
    dependsOnName: a.dependsOn ? byId.get(a.dependsOn)?.name : undefined,
    innovationScore: 10 + Math.floor(rand() * 20),
  }));
}

// ─── Application strategies (formerly business models) ─────────────────────

export function generateBusinessModels(
  problem: Problem | null,
  solutionDirection: string | null,
  usp: string | null,
  features: Feature[],
  techStack: TechItem[],
  gameMode: string,
  runSeed?: string
): GeneratedBusinessModel[] {
  const company = problem ? problem.title.split(':')[0] : 'your target company';
  const edge = usp || 'your edge';
  const skills = techStack.length > 0 ? techStack.slice(0, 3).map((t) => t.name).join(', ') : 'your core skills';

  return [
    {
      id: 'biz-model-0',
      name: 'Safety Net First',
      desc: `Apply broadly to mass recruiters and mid-tier firms first. Lock an offer early, then aim higher without panic.`,
      customer: 'Mass recruiters and IT services companies with predictable processes.',
      valueProp: `Reliable fundamentals and clear communication, backed by ${skills}.`,
      monetization: 'A secured offer by mid-season, which removes pressure for the rest.',
      riskLevel: 'Low',
      pricingStructure: 'Illustrative offer range: entry-level packages // Low variance',
      customerSegment: 'Tier 3 and Tier 2 hiring companies',
      revenueStream: 'On-campus drives and pool campuses',
      growthStrategy: `Use the first offer as confidence, then retake ${company}-style tests with a calmer mind.`,
      potentialStrengths: 'Low stress, high chance of an early offer.',
      potentialRisks: 'Package ceiling is lower and it may drain time from preparation for bigger targets.',
    },
    {
      id: 'biz-model-1',
      name: 'Dream Company Focus',
      desc: `All-in on one or two top targets such as ${company}. Prepare their exact rounds and skip the rest.`,
      customer: 'One or two high-bar product or core companies.',
      valueProp: `A razor-sharp ${edge} story with deep prep for their specific process.`,
      monetization: 'A top-tier offer, if it works. Nothing, if it does not.',
      riskLevel: 'High',
      pricingStructure: 'Illustrative offer range: top of the market // High variance',
      customerSegment: 'Dream-tier companies',
      revenueStream: 'Single high-stakes drives',
      growthStrategy: 'Mock their exact rounds weekly with seniors who cleared them.',
      potentialStrengths: 'Maximum focus and the highest upside.',
      potentialRisks: 'One bad day ends your season. Needs a plan B.',
    },
    {
      id: 'biz-model-2',
      name: 'Balanced Ladder',
      desc: 'Apply across three tiers: a safe company, a good target and one stretch goal. Prepare common ground first.',
      customer: 'A mix of mass recruiters, mid-size product firms and one stretch company.',
      valueProp: `A flexible profile where ${edge} and ${skills} fit each tier.`,
      monetization: 'Several interview calls, with a decent chance at a mid-to-high offer.',
      riskLevel: 'Medium',
      pricingStructure: 'Illustrative offer range: mid-market // Medium variance',
      customerSegment: 'Three tiers by difficulty',
      revenueStream: 'A mix of on-campus and off-campus applications',
      growthStrategy: 'Prepare shared fundamentals once, then add company-specific modules.',
      potentialStrengths: 'Good risk balance and steady momentum.',
      potentialRisks: 'Needs a calendar that actually works. Burnout risk if you overbook.',
    },
    {
      id: 'biz-model-3',
      name: 'Dual Track: Placements and Higher Studies',
      desc: 'Keep placements as one path and GATE or MS applications as the second. Decide in the final month.',
      customer: 'Companies that value fundamentals, plus universities or PSUs via exam score.',
      valueProp: 'Strong fundamentals that serve both paths, with proof through projects or research.',
      monetization: 'Either an offer letter or an admission or exam-based seat.',
      riskLevel: 'Medium',
      pricingStructure: 'Illustrative outcome: job offer or admission // Two parallel chances',
      customerSegment: 'Core and research-friendly employers, graduate programs',
      revenueStream: 'Campus drives and entrance or application cycles',
      growthStrategy: 'Anchor the schedule on fundamentals, then split the last 60 days by path.',
      potentialStrengths: 'Two shots on goal and strong fundamentals either way.',
      potentialRisks: 'Splitting time can leave you good at both and great at neither.',
    },
  ];
}

// ─── Mentor advice ──────────────────────────────────────────────────────────

const MENTORS = {
  senior: { name: 'Meera Nair', role: 'Placed Senior' as const, avatar: '🎓', tone: 'encouraging' },
  engineer: { name: 'Arjun Bose', role: 'Senior Engineer' as const, avatar: '💻', tone: 'brutally_honest' },
  hiring: { name: 'Kavya Reddy', role: 'Hiring Manager' as const, avatar: '📋', tone: 'strategic' },
  coach: { name: 'Sandeep Kulkarni', role: 'Interview Coach' as const, avatar: '🎤', tone: 'practical' },
  founder: { name: 'Neha Kapoor', role: 'Startup Founder' as const, avatar: '🚀', tone: 'direct' },
};

const HEAVY_DSA = ['reg-dp', 'reg-cp'];
const COMM_SKILLS = ['reg-gd', 'reg-hr-prep', 'reg-explain-projects', 'reg-mock-interviews', 'reg-english'];
const PROOF_SKILLS = ['reg-github-portfolio', 'reg-internship', 'reg-research-paper', 'reg-opensource', 'reg-hackathon-wins'];

export function generateAdvisorAdvice(
  problem: Problem | null,
  solutionDirection: string | null,
  usp: string | null,
  features: Feature[],
  techStack: TechItem[],
  gameMode: string,
  runSeed?: string,
  pitchDeck?: string[],
  businessModel?: string | null,
  generatedBusinessModels?: GeneratedBusinessModel[]
): AdvisorAdvice[] {
  let team: any[] = [];
  try {
    team = useGameStore.getState().team || [];
  } catch {}
  const buddy = team[0]?.name ? `${team[0].name}` : 'a senior';
  const ids = new Set(techStack.map((t) => toRegistryId(t.id)));
  const list: AdvisorAdvice[] = [];

  // 1. Hard-topic overload
  const heavyCount = HEAVY_DSA.filter((h) => ids.has(h)).length;
  if (heavyCount >= 1) {
    list.push({
      id: 'adv-replace-tech',
      title: 'Trade Rare Hard Topics for a Daily Habit',
      explanation: `Dynamic programming and contest grinding are impressive, but most drives test patterns you can master with a daily habit. ${buddy} says to switch to steady practice and keep contests for fun.`,
      expectedImpact: 'More consistent test performance and less burnout.',
      tradeoffs: 'Slight dip in advanced problem depth, big gain in reliability.',
      status: 'pending',
      scoreModifiers: { execution: 12, innovation: -4 },
      mentorPersona: MENTORS.engineer,
      action: { type: 'replace_tech', payload: { from: HEAVY_DSA, to: 'reg-leetcode-habit' } },
    });
  }

  // 2. Over-planned prep
  if (features.length > 5 || features.filter((f) => f.effort === 'high').length > 2) {
    list.push({
      id: 'adv-reduce-scope',
      title: 'Cut Your Prep Plan Down',
      explanation: `You listed ${features.length} activities. Nobody finishes that in one season. Keep the ones with high impact and drop busywork.`,
      expectedImpact: 'A plan you can actually finish raises both skills and confidence.',
      tradeoffs: 'You will skip some nice-to-have activities.',
      status: 'pending',
      scoreModifiers: { execution: 15, innovation: -3, design: 3 },
      mentorPersona: MENTORS.senior,
      action: { type: 'reduce_scope' },
    });
  }

  // 3. Resume structure
  const deck = pitchDeck || [];
  const eduIdx = deck.indexOf('education');
  const projIdx = deck.indexOf('projects');
  if (deck.length > 0 && eduIdx !== -1 && projIdx !== -1 && eduIdx < projIdx) {
    list.push({
      id: 'adv-resume-order',
      title: 'Lead With Projects, Not Marks',
      explanation: 'Recruiters scan the top third of your resume. Your best proof should be there. Move projects above education.',
      expectedImpact: 'A stronger first impression in the 20-second scan.',
      tradeoffs: 'Marks move lower, which only matters for strict-cutoff drives.',
      status: 'pending',
      scoreModifiers: { design: 12, pitch: 4 },
      mentorPersona: MENTORS.hiring,
      action: { type: 'move_slide', payload: { from: 'education', to: 'projects' } },
    });
  } else if (deck.length > 0 && !deck.includes('achievements')) {
    list.push({
      id: 'adv-resume-achievements',
      title: 'Add an Achievements Section',
      explanation: 'Ranks, contest results, hackathon wins and paper acceptances give a recruiter something to ask about.',
      expectedImpact: 'More interview conversation starters.',
      tradeoffs: 'Uses space, so trim a weaker section.',
      status: 'pending',
      scoreModifiers: { design: 8, pitch: 4 },
      mentorPersona: MENTORS.hiring,
      action: { type: 'move_slide', payload: { addSlide: 'achievements' } },
    });
  }

  // 4. Communication gap
  if (!COMM_SKILLS.some((c) => ids.has(c))) {
    list.push({
      id: 'adv-add-comm',
      title: 'Add a Communication Skill',
      explanation: 'Your stack has no communication skill. Strong coders still get rejected for unclear answers. Add regular mock interviews.',
      expectedImpact: 'Better answers under pressure and a smoother HR round.',
      tradeoffs: 'Costs practice time that would go to coding.',
      status: 'pending',
      scoreModifiers: { pitch: 15, innovation: -2 },
      mentorPersona: MENTORS.coach,
      action: { type: 'replace_tech', payload: { from: [], to: 'reg-mock-interviews' } },
    });
  }

  // 5. Proof gap
  if (!PROOF_SKILLS.some((c) => ids.has(c))) {
    list.push({
      id: 'adv-add-proof',
      title: 'Show Proof, Not Just Claims',
      explanation: 'Add a public GitHub portfolio or something recruiters can open. Claims without links get ignored.',
      expectedImpact: 'Higher shortlist rate and better interview questions.',
      tradeoffs: 'Time spent polishing instead of learning something new.',
      status: 'pending',
      scoreModifiers: { design: 8, execution: 8 },
      mentorPersona: MENTORS.founder,
      action: { type: 'replace_tech', payload: { from: [], to: 'reg-github-portfolio' } },
    });
  }

  // 6. Risky strategy
  const chosen = (generatedBusinessModels || []).find((m) => m.id === businessModel);
  if (chosen && chosen.riskLevel === 'High') {
    list.push({
      id: 'adv-safety-net',
      title: 'Keep a Safety Net',
      explanation: 'Going all-in on a dream company is brave. Add a short list of safer companies so one bad round does not end your season.',
      expectedImpact: 'Lower variance and calmer interviews.',
      tradeoffs: 'Some time moves away from dream-company prep.',
      status: 'pending',
      scoreModifiers: { execution: 6, pitch: 4, bonus: 2 },
      mentorPersona: MENTORS.senior,
      action: { type: 'focus_segment', payload: { segment: 'plus a safety-net list' } },
    });
  }

  // Always give at least three cards
  const fallbacks: AdvisorAdvice[] = [
    {
      id: 'adv-weekly-mock',
      title: 'Do One Mock Interview Every Week',
      explanation: 'The fastest improvement you can buy is a weekly mock with someone who gives honest feedback.',
      expectedImpact: 'Visible gains in clarity and confidence within a month.',
      tradeoffs: 'Needs a partner and a fixed slot.',
      status: 'pending',
      scoreModifiers: { pitch: 8, bonus: 2 },
      mentorPersona: MENTORS.coach,
      action: { type: 'custom' },
    },
    {
      id: 'adv-rest',
      title: 'Protect Your Sleep and Revision Time',
      explanation: 'A rested brain recalls more and panics less. Treat sleep as part of preparation.',
      expectedImpact: 'Steadier performance on test day.',
      tradeoffs: 'Fewer late-night practice hours.',
      status: 'pending',
      scoreModifiers: { execution: 5, bonus: 3 },
      mentorPersona: MENTORS.senior,
      action: { type: 'custom' },
    },
    {
      id: 'adv-company-research',
      title: 'Research Each Company Before You Apply',
      explanation: 'Knowing a company\'s product and usual rounds lets you tailor answers and avoid surprises.',
      expectedImpact: 'More relevant answers and better questions at the end.',
      tradeoffs: 'Takes an hour per company.',
      status: 'pending',
      scoreModifiers: { pitch: 6, innovation: 3 },
      mentorPersona: MENTORS.hiring,
      action: { type: 'custom' },
    },
  ];
  for (const f of fallbacks) {
    if (list.length >= 4) break;
    list.push(f);
  }
  return list.slice(0, 5);
}

/**
 * Mentor confidence (0-100): how likely a senior would back this plan.
 */
export function calculateMentorConfidence(
  problem: Problem | null,
  solutionDirection: string | null,
  usp: string | null,
  features: Feature[],
  techStack: TechItem[],
  pitchDeck: string[],
  businessModel: string | null,
  generatedBusinessModels: GeneratedBusinessModel[],
  adviceList: AdvisorAdvice[]
): number {
  let score = 50;
  const ids = new Set(techStack.map((t) => toRegistryId(t.id)));

  // 1. Skill stack sanity
  const hardCount = techStack.filter((t) => (t as any).difficulty >= 4).length;
  score -= Math.max(0, hardCount - 2) * 12;
  if (techStack.length >= 5) score += 5;
  if (COMM_SKILLS.some((c) => ids.has(c))) score += 8; else score -= 6;
  if (PROOF_SKILLS.some((c) => ids.has(c))) score += 6;

  // 2. Prep plan
  if (features.length > 5) score -= 10;
  if (features.filter((f) => f.effort === 'high').length > 2) score -= 12;
  if (features.length > 0 && features.filter((f) => f.impact === 'low').length === 0) score += 8;

  // 3. Resume layout
  if (pitchDeck && pitchDeck.length > 0) {
    if (!pitchDeck.includes('projects')) score -= 10;
    if (!pitchDeck.includes('skills')) score -= 8;
    if (!pitchDeck.includes('education')) score -= 6;
    const p = pitchDeck.indexOf('projects');
    const e = pitchDeck.indexOf('education');
    if (p !== -1 && e !== -1 && e < p) score -= 6;
  }

  // 4. Edge and strategy
  score += usp ? 5 : -10;
  const chosen = generatedBusinessModels.find((m) => m.id === businessModel);
  if (chosen?.riskLevel === 'High') score -= 6;
  if (chosen?.riskLevel === 'Low') score += 3;

  // 5. Advice followed or ignored
  adviceList.forEach((adv) => {
    if (adv.status === 'applied') score += 12;
    else if (adv.status === 'rejected') score -= 8;
  });

  return Math.max(0, Math.min(100, score));
}

/**
 * Builds a 30-second "Tell me about yourself" script from the player's choices.
 */
export function generateCustomElevatorPitch(
  problem: Problem | null,
  solutionDirection: string | null,
  usp: string | null,
  features: Feature[],
  businessModel: GeneratedBusinessModel | null,
  adviceList: AdvisorAdvice[],
  techStack: TechItem[]
): string {
  if (!problem) return 'Hello! I am a final-year engineering student preparing for campus placements.';

  let name = 'a final-year engineering student';
  try {
    const n = useGameStore.getState().playerName;
    if (n) name = `${n}, a final-year engineering student`;
  } catch {}

  const company = problem.title.split(':')[0];
  const role = problem.title.includes(':') ? problem.title.split(':').slice(1).join(':').trim() : 'the open role';
  const skills = techStack.slice(0, 3).map((t) => t.name).join(', ') || 'strong fundamentals';
  const acts = features.slice(0, 2).map((f) => f.name.toLowerCase()).join(' and ');

  const applied = adviceList.filter((a) => a.status === 'applied').map((a) => a.title.toLowerCase());
  const adviceClause = applied.length > 0 ? ` Based on advice from my seniors, I recently focused on ${applied[0]}.` : '';
  const stratClause = businessModel ? ` My plan this season is "${businessModel.name}", and ${company} is part of it.` : '';
  const edgeClause = usp ? ` What sets me apart is my edge as ${usp.toLowerCase()}.` : '';

  return `Hello, I am ${name}. I am here for the ${role} role at ${company}. My strongest areas are ${skills}.${acts ? ` Recently I have been working on ${acts}.` : ''}${edgeClause}${adviceClause}${stratClause} I learn quickly, I like explaining what I build, and I would love to contribute to your team.`;
}
