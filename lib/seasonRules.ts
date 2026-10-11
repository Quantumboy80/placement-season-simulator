/**
 * @file Season rules and feedback
 *
 * Replaces two large copies of hard-coded modifier logic that lived inside
 * app/game/page.tsx. A "season rule" is a twist for the run, such as
 * "only product companies are hiring". Rule ids come from data/modifiers.ts.
 *
 * Skill ids are registry ids (reg-*), see data/techRegistry.ts.
 */

import { clamp, type Scores } from './scoring';
import type { Problem } from '@/types/game';

export interface RuleContext {
  /** Registry ids of selected skills (reg-*). */
  skillIds: Set<string>;
  track: string | null;
  /** Edge key such as "Consistency" (not the display name). */
  edgeKey: string | null;
  strategyId: string | null;
  activityCount: number;
  mentorHintsUsed: number;
  scores: Scores;
}

const BASICS = ['reg-quant', 'reg-logical', 'reg-arrays-strings', 'reg-sorting-search'];
const PAID = ['reg-cloud-cert', 'reg-gre-ielts'];
const CORE_CS = ['reg-os', 'reg-dbms', 'reg-cn', 'reg-oop'];
const COMM = ['reg-gd', 'reg-hr-prep', 'reg-explain-projects', 'reg-mock-interviews', 'reg-english'];
const PROOF = ['reg-github-portfolio', 'reg-internship', 'reg-research-paper', 'reg-opensource', 'reg-hackathon-wins'];

const hasAny = (ids: Set<string>, list: string[]) => list.some((i) => ids.has(i));

type Rule = (ctx: RuleContext, s: Scores) => void;

const RULES: Record<string, Rule> = {
  NO_AI_TOOLS: (c, s) => {
    if (!hasAny(c.skillIds, BASICS)) {
      s.innovation -= 25;
      s.execution -= 15;
    }
  },
  BOOTSTRAP_ONLY: (c, s) => {
    if (hasAny(c.skillIds, PAID)) s.execution -= 20;
  },
  MOBILE_ONLY: (c, s) => {
    if (c.track !== 'mobile-app') s.execution -= 25;
  },
  WEB_ONLY: (c, s) => {
    if (c.track !== 'web-app') s.execution -= 25;
  },
  AI_ONLY: (c, s) => {
    if (c.track !== 'ai-solution') s.execution -= 25;
  },
  LIMITED_BUDGET: (_c, s) => {
    s.execution -= 15;
  },
  GREEN_FIRST: (c, s) => {
    if (c.edgeKey === 'Research-Driven' || c.skillIds.has('reg-research-paper')) s.bonus += 15;
  },
  USER_SENSITIVE: (_c, s) => {
    s.design = s.design >= 80 ? Math.min(100, s.design + 15) : s.design - 25;
  },
  TECH_WIZARD: (_c, s) => {
    s.bonus += s.bonus; // synergy bonus doubles
  },
  FAST_SHIP: (c, s) => {
    if (c.activityCount > 2) s.execution -= 20;
  },
  NO_MENTOR: (c, s) => {
    if (c.mentorHintsUsed > 0) s.pitch -= 30;
  },
  OPEN_SOURCE: (c, s) => {
    if (!hasAny(c.skillIds, PROOF)) s.innovation -= 15;
  },
  MONETIZE_NOW: (c, s) => {
    if (c.strategyId === 'biz-model-0') s.pitch -= 20;
  },
  SECURITY_FIRST: (c, s) => {
    if (!hasAny(c.skillIds, CORE_CS)) s.execution -= 20;
  },
  MINIMALIST: (c, s) => {
    if (c.activityCount !== 2) s.design -= 15;
  },
  CRITICAL_PATH: (c, s) => {
    if (c.activityCount > 3) s.execution -= 15;
  },
  CLOUD_NATIVE: (c, s) => {
    if (!(c.skillIds.has('reg-cloud-basics') && c.skillIds.has('reg-docker'))) s.innovation -= 15;
  },
  ACCESSIBILITY_MANDATE: (c, s) => {
    if (!(c.skillIds.has('reg-english') || c.skillIds.has('reg-gd'))) s.pitch -= 15;
  },
};

/**
 * Applies the active season rules to the player's scores.
 * Rules that act elsewhere (HARDCORE_JUDGE, SOLO_DEV, CHAOS_MAGNET, NO_MENTOR lock)
 * are handled by the store or the final scorer.
 */
export function applySeasonRules(activeModifiers: string[], ctx: RuleContext): Scores {
  const s: Scores = { ...ctx.scores };
  for (const id of activeModifiers) RULES[id]?.(ctx, s);
  return {
    innovation: clamp(s.innovation),
    execution: clamp(s.execution),
    design: clamp(s.design),
    pitch: clamp(s.pitch),
    bonus: s.bonus,
  };
}

export interface FeedbackContext {
  skillIds: Set<string>;
  track: string | null;
  edgeKey: string | null;
  strategyId: string | null;
  activityCount: number;
  mentorHintsUsed: number;
  drive: Problem | null;
}

/** Strengths and weaknesses shown on the result card (always two of each). */
export function deriveFeedback(c: FeedbackContext): { strengths: string[]; weaknesses: string[] } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const has = (id: string) => c.skillIds.has(id);
  const dsa = ['reg-arrays-strings', 'reg-trees-graphs', 'reg-dp', 'reg-heaps-hashing', 'reg-leetcode-habit', 'reg-sorting-search', 'reg-recursion-bt'];
  const lang = ['reg-cpp', 'reg-java', 'reg-python', 'reg-js-ts', 'reg-c-lang'];

  // ── Strengths
  if (hasAny(c.skillIds, dsa) && hasAny(c.skillIds, lang)) strengths.push('Solid coding base: DSA practice paired with a language you can defend.');
  if (hasAny(c.skillIds, PROOF) && has('reg-explain-projects')) strengths.push('Proof you can open plus the ability to explain it. That is the best interview combination.');
  if (has('reg-embedded-c') && hasAny(c.skillIds, ['reg-stm32', 'reg-esp32', 'reg-arduino', 'reg-rtos'])) strengths.push('Hands-on embedded work backed by real C fundamentals.');
  if (hasAny(c.skillIds, ['reg-sklearn', 'reg-pytorch']) && has('reg-stats')) strengths.push('Practical ML grounded in statistics, which is what data panels probe.');
  if (has('reg-mock-interviews')) strengths.push('Regular mock interviews. You practise speaking, not just reading.');
  if (c.activityCount >= 2 && c.activityCount <= 5) strengths.push('A focused prep plan you can realistically finish.');
  if (c.strategyId === 'biz-model-0' && c.drive?.category === 'it-services') strengths.push('A safety-net strategy fits a mass-hiring drive well.');
  if (c.strategyId === 'biz-model-3' && c.drive?.category === 'govt-psu') strengths.push('A dual-track plan suits the PSU and GATE route.');

  // ── Weaknesses
  if (c.track === 'ai-solution' && !hasAny(c.skillIds, ['reg-sklearn', 'reg-pytorch', 'reg-numpy-pandas', 'reg-stats', 'reg-sql-analytics'])) weaknesses.push('Data and ML track without any data or ML skill in your stack.');
  if (c.track === 'iot-product' && !hasAny(c.skillIds, ['reg-embedded-c', 'reg-circuit-analysis', 'reg-power-controls', 'reg-stm32', 'reg-arduino', 'reg-esp32'])) weaknesses.push('Core and embedded track without any electrical or embedded core skill.');
  if (c.track === 'web-app' && !hasAny(c.skillIds, dsa)) weaknesses.push('Product track without any DSA practice. Online assessments will hurt.');
  if (!hasAny(c.skillIds, COMM)) weaknesses.push('No communication practice. Strong coders still lose offers on unclear answers.');
  if (!hasAny(c.skillIds, PROOF)) weaknesses.push('Nothing a recruiter can open: no portfolio, internship or paper.');
  if (c.activityCount > 5) weaknesses.push('Over-planned prep. There are too many must-do activities to finish.');
  else if (c.activityCount < 2) weaknesses.push('Under-planned prep. Two or three focused activities would help.');
  if (c.edgeKey === 'Consistency' && (has('reg-dp') || has('reg-cp'))) weaknesses.push('A consistency edge conflicts with chasing rare hard topics.');
  if (c.drive?.difficulty === 'advanced' && !has('reg-mock-interviews')) weaknesses.push('A tough drive without mock interview practice.');
  if (c.mentorHintsUsed > 0) weaknesses.push('Leaned on mentor hints. A small penalty applies.');

  // ── Fill to two
  const fillS = ['Consistent preparation across the rounds you picked.', 'A clear plan that connects your skills to the drive.'];
  const fillW = ['Room to sharpen answers with one more mock interview.', 'Resume can be tightened to one clear page.'];
  for (const f of fillS) if (strengths.length < 2) strengths.push(f);
  for (const f of fillW) if (weaknesses.length < 2) weaknesses.push(f);

  return { strengths: strengths.slice(0, 2), weaknesses: weaknesses.slice(0, 2) };
}
