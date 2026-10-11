/**
 * @file Single source of truth for everything the player SEES.
 *
 * The game engine still uses a few internal keys inherited from the original
 * Hackathon Simulator (innovation / execution / design / pitch, and `Problem`
 * for a company drive). Those keys are stable on purpose. This file maps them
 * to placement-season language so the UI never has to hard-code labels.
 */

import type { Problem } from '@/types/game';

/** Internal score keys -> what the player sees. */
export const AXIS_LABELS = {
  innovation: 'Skills',
  execution: 'Projects',
  design: 'Resume',
  pitch: 'Communication',
} as const;

export type AxisKey = keyof typeof AXIS_LABELS;

/** One-line meaning of each axis (tooltips, result screen). */
export const AXIS_HINTS: Record<AxisKey, string> = {
  innovation: 'Depth and breadth of your technical skills',
  execution: 'Quality and proof of the projects you built',
  design: 'How well your resume and profile read in 20 seconds',
  pitch: 'How clearly you speak, explain and handle HR',
};

/** Career tracks (the old "solution direction"). Internal ids are unchanged. */
export const TRACKS = [
  { id: 'web-app', name: 'Product SWE', short: 'SWE', desc: 'Product companies. DSA, CS fundamentals and projects decide everything.' },
  { id: 'mobile-app', name: 'IT Services / Mass Recruiter', short: 'SERVICES', desc: 'High-volume hiring. Aptitude, communication and consistency win here.' },
  { id: 'ai-solution', name: 'Data / ML Engineer', short: 'DATA-ML', desc: 'Analytics and ML roles. Statistics, Python and one strong project.' },
  { id: 'iot-product', name: 'Core EE / Embedded', short: 'CORE', desc: 'Electrical, electronics and firmware roles. Fundamentals and hands-on builds.' },
  { id: 'platform', name: 'Startup Full-Stack', short: 'STARTUP', desc: 'Fast-moving teams. Shipped projects and ownership beat marks.' },
  { id: 'marketplace', name: 'Higher Studies / Research', short: 'MS-GATE', desc: 'GATE, MS or PhD. Research, publications and scores over interviews.' },
] as const;

export function trackName(id: string | null | undefined): string {
  return TRACKS.find((t) => t.id === id)?.name ?? 'Open Track';
}

/** Drive categories (company types). */
export const DRIVE_CATEGORIES: Record<
  Problem['category'],
  { label: string; icon: string; color: string; badge: string }
> = {
  'it-services': { label: 'IT Services', icon: '🏢', color: 'text-blue-600 bg-blue-50 border-blue-200', badge: 'bg-neon-blue/15 text-neon-blue ring-neon-blue/30' },
  product: { label: 'Product Company', icon: '🚀', color: 'text-purple-600 bg-purple-50 border-purple-200', badge: 'bg-neon-purple/15 text-neon-purple ring-neon-purple/30' },
  startup: { label: 'Startup', icon: '⚡', color: 'text-amber-600 bg-amber-50 border-amber-200', badge: 'bg-neon-orange/15 text-neon-orange ring-neon-orange/30' },
  'core-engg': { label: 'Core Engineering', icon: '🔌', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', badge: 'bg-neon-green/15 text-neon-green ring-neon-green/30' },
  'data-ai': { label: 'Data and AI', icon: '🤖', color: 'text-pink-600 bg-pink-50 border-pink-200', badge: 'bg-neon-pink/15 text-neon-pink ring-neon-pink/30' },
  'govt-psu': { label: 'Government / PSU', icon: '🏛️', color: 'text-teal-600 bg-teal-50 border-teal-200', badge: 'bg-emerald-500/15 text-emerald-400 ring-emerald-400/30' },
  'bfsi-consulting': { label: 'BFSI / Consulting', icon: '💼', color: 'text-neutral-700 bg-neutral-50 border-neutral-200', badge: 'bg-neon-blue/15 text-neon-blue ring-neon-blue/30' },
};

export function driveCategory(cat?: string | null) {
  if (cat && cat in DRIVE_CATEGORIES) return DRIVE_CATEGORIES[cat as Problem['category']];
  return { label: 'Open Drive', icon: '🎯', color: 'text-neutral-700 bg-neutral-50 border-neutral-200', badge: 'bg-neon-blue/15 text-neon-blue ring-neon-blue/30' };
}

/** Round titles keyed by the (unchanged) stage ids. */
export const STAGE_TITLES: Record<string, string> = {
  difficulty: 'Choose Your Season',
  teamFormation: 'Build Your Prep Squad',
  problemReveal: 'Round 1: Pick a Company Drive',
  solutionDirection: 'Round 2: Choose Your Career Track',
  techStack: 'Round 3: Build Your Skill Stack',
  usp: 'Round 4: Find Your Edge',
  features: 'Round 5: Plan Your Prep Activities',
  pitchDeck: 'Round 6: Build Your Resume',
  mentor: 'Round 7: Senior Mentor Round',
  businessModel: 'Round 8: Application Strategy',
  pitchPrep: 'Round 9: Prepare "Tell Me About Yourself"',
  judgeSpin: 'Round 10: Spin for Your Lead Recruiter',
  judging: 'Round 11: The Interview',
  results: 'Results',
};

/** Tabs in the skill stack round and the skill family each one shows. */
export const SKILL_TABS = [
  { id: 'all', label: 'ALL SKILLS' },
  { id: 'dsa', label: 'DSA' },
  { id: 'corecs', label: 'CORE CS' },
  { id: 'lang', label: 'LANGUAGES' },
  { id: 'web', label: 'WEB & APPS' },
  { id: 'data', label: 'DATA & ML' },
  { id: 'embedded', label: 'EMBEDDED & EE' },
  { id: 'soft', label: 'APTITUDE & COMM' },
  { id: 'profile', label: 'TOOLS & PROFILE' },
] as const;

const FAMILY_TO_TAB: Record<string, string> = {
  'DSA & Problem Solving': 'dsa',
  'Core CS': 'corecs',
  Languages: 'lang',
  'Web & App Dev': 'web',
  'Data & ML': 'data',
  'Embedded & EE': 'embedded',
  'Aptitude & Reasoning': 'soft',
  Communication: 'soft',
  'Tools & Cloud': 'profile',
  'Certifications & Domain': 'profile',
  'Profile & Portfolio': 'profile',
};

export function tabForCategory(category: string): string {
  return FAMILY_TO_TAB[category] ?? 'all';
}
