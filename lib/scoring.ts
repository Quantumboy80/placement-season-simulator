/**
 * @file Scoring engine (single source of truth)
 *
 * Previously the weighted-score formula and the grade table were copied
 * into several UI files, while this file held unused placeholder code.
 * Now every screen imports from here, and the logic has unit tests.
 *
 * Score keys are internal: innovation = Skills, execution = Projects,
 * design = Resume, pitch = Communication (see lib/vocabulary.ts).
 */

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface AxisScores {
  innovation: number;
  execution: number;
  design: number;
  pitch: number;
}

export interface Scores extends AxisScores {
  bonus: number;
}

export interface AxisWeights {
  innovation: number;
  execution: number;
  design: number;
  pitch: number;
}

/** Id of the wildcard recruiter. Gets a random swing on the final interview. */
export const WILDCARD_RECRUITER_ID = 'judge-chaos';

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/** Letter grade for a 0-100 score. */
export function getGrade(score: number): Grade {
  if (score >= 94) return 'S';
  if (score >= 84) return 'A';
  if (score >= 72) return 'B';
  if (score >= 60) return 'C';
  if (score >= 48) return 'D';
  return 'F';
}

/** Weighted sum of the four axes (before bonus). Weights should total ~1. */
export function weightedScore(scores: AxisScores, weights: AxisWeights): number {
  return (
    scores.innovation * weights.innovation +
    scores.execution * weights.execution +
    scores.design * weights.design +
    scores.pitch * weights.pitch
  );
}

export interface JudgeScoreInput {
  scores: Scores;
  weights: AxisWeights;
  judgeId: string;
  /** Strict panel multiplier (x0.85). */
  strict?: boolean;
  /**
   * How the wildcard recruiter swings:
   *  - 'random': +/- 10 (final interview)
   *  - 'fixed': +5 (stable display on result cards)
   *  - 'none': no swing
   */
  wildcard?: 'random' | 'fixed' | 'none';
  /** Injectable RNG so tests are deterministic. */
  rng?: () => number;
}

/** Final 0-100 score from one recruiter. */
export function judgeScore(input: JudgeScoreInput): number {
  const { scores, weights, judgeId, strict = false, wildcard = 'random', rng = Math.random } = input;
  let total = weightedScore(scores, weights);

  if (judgeId === WILDCARD_RECRUITER_ID) {
    if (wildcard === 'random') total += Math.floor(rng() * 21) - 10;
    else if (wildcard === 'fixed') total += 5;
  }

  total += scores.bonus;
  if (strict) total *= 0.85;
  return clamp(Math.round(total));
}
