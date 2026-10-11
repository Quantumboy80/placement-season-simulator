/**
 * @file Mentor hint data (data/mentorHints.ts)
 * @description Short tips from seniors, tagged by game phase. Phase ids are
 * internal keys inherited from the original game.
 */

import type { MentorHint } from '@/types/game';

export const MENTOR_HINTS: MentorHint[] = [
  {
    id: 'hint-lobby-1',
    phase: 'LOBBY',
    message: 'Welcome to placement season. It is not about the most certificates, it is about showing real skill clearly.',
    helpfulness: 'medium',
    category: 'strategy',
  },
  {
    id: 'hint-problem-1',
    phase: 'PROBLEM_REVEAL',
    message: 'Pick a drive you would genuinely enjoy working at. Interest shows in your answers.',
    helpfulness: 'high',
    category: 'strategy',
  },
  {
    id: 'hint-problem-2',
    phase: 'PROBLEM_REVEAL',
    message: 'Read the constraints carefully. A CGPA cutoff or a service agreement can decide your choice before any test.',
    helpfulness: 'high',
    category: 'strategy',
  },
  {
    id: 'hint-tech-1',
    phase: 'TECH_STACK',
    message: 'Pick one language and know it deeply. Interviewers prefer depth over a long list.',
    helpfulness: 'high',
    category: 'technical',
  },
  {
    id: 'hint-tech-2',
    phase: 'TECH_STACK',
    message: 'Do not skip core subjects. OS, DBMS and networks get asked in almost every technical round.',
    helpfulness: 'high',
    category: 'technical',
  },
  {
    id: 'hint-tech-3',
    phase: 'TECH_STACK',
    message: 'Add at least one communication skill. Strong coders still lose offers on unclear answers.',
    helpfulness: 'medium',
    category: 'technical',
  },
  {
    id: 'hint-feature-1',
    phase: 'FEATURE_PRIORITY',
    message: 'A short plan you finish beats a long plan you abandon. Be ruthless.',
    helpfulness: 'high',
    category: 'strategy',
  },
  {
    id: 'hint-feature-2',
    phase: 'FEATURE_PRIORITY',
    message: 'Put speaking practice in your must-do list. Reading alone does not prepare you for interviews.',
    helpfulness: 'medium',
    category: 'motivation',
  },
  {
    id: 'hint-feature-3',
    phase: 'FEATURE_PRIORITY',
    message: 'Resumes get 20 seconds. Lead with projects and quantify the result.',
    helpfulness: 'high',
    category: 'design',
  },
  {
    id: 'hint-building-1',
    phase: 'BUILDING',
    message: 'Take one mock interview and record it. Watching yourself is uncomfortable and incredibly useful.',
    helpfulness: 'high',
    category: 'motivation',
  },
  {
    id: 'hint-building-2',
    phase: 'BUILDING',
    message: 'Keep a safety net. Applying to a safer company too does not make you less ambitious.',
    helpfulness: 'medium',
    category: 'strategy',
  },
  {
    id: 'hint-judging-1',
    phase: 'JUDGING',
    message: 'Think aloud. Silence looks like being stuck, even when you are thinking well.',
    helpfulness: 'high',
    category: 'strategy',
  },
  {
    id: 'hint-judging-2',
    phase: 'JUDGING',
    message: 'If you do not know something, say so, then reason from what you do know.',
    helpfulness: 'medium',
    category: 'motivation',
  },
  {
    id: 'hint-results-1',
    phase: 'RESULTS',
    message: 'Rejections are data. Write down what you were asked and fix one thing before the next drive.',
    helpfulness: 'medium',
    category: 'motivation',
  },
];
