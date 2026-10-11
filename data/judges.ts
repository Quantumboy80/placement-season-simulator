/**
 * @file Recruiter panel (kept in judges.ts so existing imports keep working)
 * Ids stay the same on purpose: judge-chaos has special wildcard logic in
 * app/game/page.tsx and components/game/ResultScreen.tsx.
 * Score keys map to: innovation=Skills, execution=Projects, design=Resume, pitch=Communication.
 */

import type { Judge } from '@/types/game';

export const JUDGES: Judge[] = [
  {
    id: 'judge-builder',
    name: 'Ananya Rao',
    avatar: '\u{1F3E2}',
    avatarImage: '/avatars/uday.png', // TODO: replace image
    title: 'Campus Hiring Lead, IT Services',
    expertise: ['Fundamentals', 'Communication', 'Team Fit', 'Learning Ability', 'Project Explanation'],
    personality: 'technical',
    scoringWeights: { innovation: 0.20, execution: 0.30, design: 0.20, pitch: 0.30 },
  },
  {
    id: 'judge-founder',
    name: 'Rohan Mehta',
    avatar: '\u{1F680}',
    avatarImage: '/avatars/bart.png', // TODO: replace image
    title: 'Startup Founder and Hiring Manager',
    expertise: ['Shipped Projects', 'Ownership', 'Speed of Learning', 'Full-Stack Skills', 'Product Sense'],
    personality: 'creative',
    scoringWeights: { innovation: 0.30, execution: 0.40, design: 0.05, pitch: 0.25 },
  },
  {
    id: 'judge-design',
    name: 'Ishita Sen',
    avatar: '\u{1F4C4}',
    avatarImage: '/avatars/nishika.png', // TODO: replace image
    title: 'Recruiter and Resume Screener',
    expertise: ['Resume Clarity', 'ATS Keywords', 'Quantified Impact', 'Formatting', 'First Impressions'],
    personality: 'encouraging',
    scoringWeights: { innovation: 0.15, execution: 0.15, design: 0.50, pitch: 0.20 },
  },
  {
    id: 'judge-investor',
    name: 'Karthik Iyer',
    avatar: '\u{1F9E0}',
    avatarImage: '/avatars/sejal.png', // TODO: replace image
    title: 'Big-Tech Interviewer (DSA and System Design)',
    expertise: ['Data Structures', 'Algorithms', 'Problem Solving', 'System Design Basics', 'Code Quality'],
    personality: 'tough',
    scoringWeights: { innovation: 0.45, execution: 0.25, design: 0.05, pitch: 0.25 },
  },
  {
    id: 'judge-chaos',
    name: 'Prof. Dutta',
    avatar: '\u{1F393}',
    avatarImage: '/avatars/jitu.png', // TODO: replace image
    title: 'Placement Cell Head (Wildcard)',
    expertise: ['Fundamentals', 'Discipline', 'Attitude', 'Academic Record', 'Consistency'],
    personality: 'technical',
    scoringWeights: { innovation: 0.25, execution: 0.25, design: 0.25, pitch: 0.25 },
  },
];
