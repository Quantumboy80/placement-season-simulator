/**
 * @file Interview agent core (pure, testable)
 *
 * The agent plans the next question (targeting the weakest topic so far),
 * grades the answer with a deterministic rubric, and retrieves study material
 * for what was missed. An optional LLM only rewrites the feedback text. It
 * never changes the score.
 */

import { QUESTIONS, type InterviewQuestion } from '@/data/kb/questions';
import { search } from '@/lib/rag/retriever';
import type { KbChunk } from '@/data/kb/knowledge';

export interface Turn {
  questionId: string;
  answer: string;
  score: number;
}

export interface Grade {
  score: number; // 0-100
  covered: string[];
  missed: string[];
  notes: string[];
}

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** Deterministic rubric: coverage 70, length 15, structure 15. */
export function gradeAnswer(q: InterviewQuestion, answer: string): Grade {
  const a = answer.toLowerCase();
  const covered: string[] = [];
  const missed: string[] = [];
  q.keyPoints.forEach((group) => {
    (group.some((stem) => a.includes(stem.toLowerCase())) ? covered : missed).push(group[0]);
  });
  const coverage = covered.length / Math.max(1, q.keyPoints.length);
  const words = wordCount(answer);
  const notes: string[] = [];

  let lengthPts = 15;
  if (words < 15) { lengthPts = 3; notes.push('Too short. Aim for 40 to 120 words.'); }
  else if (words < 30) { lengthPts = 9; notes.push('A bit short. Add a little more detail.'); }
  else if (words > 220) { lengthPts = 8; notes.push('Too long. Tighten it to the key points.'); }

  const structured = /(for example|for instance|because|first|second|then|finally|so that|as a result|result)/i.test(answer);
  const structurePts = structured ? 15 : 5;
  if (!structured) notes.push('Add structure: a reason or example makes answers stronger.');

  const score = Math.max(0, Math.min(100, Math.round(coverage * 70 + (words >= 5 ? lengthPts + structurePts : 0))));
  return { score, covered, missed, notes };
}

export interface PlanInput {
  history: Turn[];
  track?: string | null;
  category?: string | null;
  /** Restrict to these topics if given. */
  topics?: string[];
}

/** Picks the next question: matches audience, avoids repeats, targets the weakest topic. */
export function planNext(input: PlanInput): InterviewQuestion | null {
  const { history, track, category, topics } = input;
  const asked = new Set(history.map((h) => h.questionId));
  const audience = [track, category].filter(Boolean) as string[];

  let pool = QUESTIONS.filter((q) => !asked.has(q.id));
  if (topics && topics.length > 0) pool = pool.filter((q) => topics.includes(q.topic));
  pool = pool.filter((q) => q.audience.length === 0 || q.audience.some((a) => audience.includes(a)));
  if (pool.length === 0) return null;

  // Topic averages so far (weakest first); unseen topics get a neutral 50
  const sums = new Map<string, { s: number; n: number }>();
  history.forEach((h) => {
    const q = QUESTIONS.find((x) => x.id === h.questionId);
    if (!q) return;
    const cur = sums.get(q.topic) || { s: 0, n: 0 };
    sums.set(q.topic, { s: cur.s + h.score, n: cur.n + 1 });
  });
  const avg = (topic: string) => {
    const v = sums.get(topic);
    return v ? v.s / v.n : 50;
  };

  // Open with an easy HR question, then target weakness and ramp up difficulty
  if (history.length === 0) {
    const opener = pool.find((q) => q.id === 'q-intro');
    if (opener) return opener;
  }
  const lastScore = history.length ? history[history.length - 1].score : 60;
  const targetDifficulty = lastScore >= 75 ? 3 : lastScore >= 50 ? 2 : 1;

  return [...pool].sort((a, b) => {
    const wa = avg(a.topic) + Math.abs(a.difficulty - targetDifficulty) * 8;
    const wb = avg(b.topic) + Math.abs(b.difficulty - targetDifficulty) * 8;
    return wa - wb;
  })[0];
}

/** Study material for what the candidate missed. */
export function studyMaterial(q: InterviewQuestion, track?: string | null, category?: string | null): KbChunk[] {
  const audience = [track, category].filter(Boolean) as string[];
  return search(`${q.question} ${q.topic}`, { k: 2, audience }).map((h) => h.chunk);
}

export interface Summary {
  average: number;
  byTopic: { topic: string; average: number }[];
  weakest: string | null;
}

export function summarise(history: Turn[]): Summary {
  if (history.length === 0) return { average: 0, byTopic: [], weakest: null };
  const by = new Map<string, number[]>();
  history.forEach((h) => {
    const q = QUESTIONS.find((x) => x.id === h.questionId);
    if (!q) return;
    by.set(q.topic, [...(by.get(q.topic) || []), h.score]);
  });
  const byTopic = Array.from(by.entries())
    .map(([topic, s]) => ({ topic, average: Math.round(s.reduce((a, b) => a + b, 0) / s.length) }))
    .sort((a, b) => a.average - b.average);
  const average = Math.round(history.reduce((a, h) => a + h.score, 0) / history.length);
  return { average, byTopic, weakest: byTopic[0]?.topic ?? null };
}
