/**
 * @file Deterministic Seeded PRNG and Daily Challenge generator for Sprint v1.2
 *
 * @module lib/dailyChallenge
 */

import { PROBLEMS } from "@/data/problems";
import { JUDGES } from "@/data/judges";
import { MODIFIERS } from "@/data/modifiers";
import type { Problem, Judge } from "@/types/game";
import type { Modifier } from "@/data/modifiers";

/**
 * Creates a deterministic, seeded pseudo-random number generator (LCG)
 */
export function createSeededRandom(seed: number) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/**
 * Calculates a persistent numeric seed for today in local time format YYYYMMDD
 */
export function getDailySeed(): number {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 1-12
  const date = d.getDate(); // 1-31
  return year * 10000 + month * 100 + date;
}

export interface DailyChallenge {
  seed: number;
  problem: Problem;
  difficulty: 'easy' | 'medium' | 'hard';
  judge: Judge;
  modifier: Modifier;
}

/**
 * Generates today's locked challenge parameters deterministically based on seed
 */
export function getDailyChallenge(): DailyChallenge {
  const seed = getDailySeed();
  const rand = createSeededRandom(seed);

  // 1. Select Problem
  const problemIndex = Math.floor(rand() * PROBLEMS.length);
  const problem = PROBLEMS[problemIndex] || PROBLEMS[0];

  // 2. Select Difficulty
  const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
  const diffIndex = Math.floor(rand() * difficulties.length);
  const difficulty = difficulties[diffIndex] || 'medium';

  // 3. Select Locked Judge
  const judgeIndex = Math.floor(rand() * JUDGES.length);
  const judge = JUDGES[judgeIndex] || JUDGES[0];

  // 4. Select Modifier
  const modIndex = Math.floor(rand() * MODIFIERS.length);
  const modifier = MODIFIERS[modIndex] || MODIFIERS[0];

  return {
    seed,
    problem,
    difficulty,
    judge,
    modifier
  };
}
