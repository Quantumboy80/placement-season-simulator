/**
 * POST /api/interview  (interview agent)
 *   { action: "start", track?, category? }
 *   { action: "answer", questionId, answer, history[], track?, category? }
 *
 * Plan -> retrieve -> grade -> give feedback. The rubric grade is
 * deterministic. An LLM, when configured, only rewrites the feedback text.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { guard } from '@/lib/apiGuard';
import { QUESTIONS } from '@/data/kb/questions';
import { gradeAnswer, planNext, studyMaterial, summarise } from '@/lib/interviewAgent';
import { callLLM, hasLlm, parseJson, untrusted, DATA_ONLY_NOTICE } from '@/lib/llm';
import { detectPromptInjection, sanitizeInputText } from '@/lib/security';

const TOTAL_QUESTIONS = 5;

const schema = z.object({
  action: z.enum(['start', 'answer']),
  track: z.string().max(40).nullable().optional(),
  category: z.string().max(40).nullable().optional(),
  questionId: z.string().max(60).optional(),
  answer: z.string().max(3000).optional(),
  history: z.array(z.object({ questionId: z.string().max(60), answer: z.string().max(3000), score: z.number().min(0).max(100) })).max(10).optional(),
});

const feedbackSchema = z.object({ feedback: z.string().min(10).max(700) });

const publicQ = (q: (typeof QUESTIONS)[number]) => ({ id: q.id, topic: q.topic, question: q.question, hint: q.hint, difficulty: q.difficulty });

export async function POST(req: Request) {
  const g = await guard(req, 'interview', 20, 40_000);
  if (!g.ok) return g.res;
  const parsed = schema.safeParse(g.body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const { action, track = null, category = null, history = [] } = parsed.data;

  if (action === 'start') {
    const q = planNext({ history: [], track, category });
    if (!q) return NextResponse.json({ error: 'No questions available' }, { status: 404 });
    return NextResponse.json({ question: publicQ(q), total: TOTAL_QUESTIONS, mode: hasLlm() ? 'llm' : 'local' });
  }

  const q = QUESTIONS.find((x) => x.id === parsed.data.questionId);
  const answer = sanitizeInputText(parsed.data.answer || '');
  if (!q || !answer) return NextResponse.json({ error: 'Missing question or answer' }, { status: 400 });

  // 1. Grade (deterministic)
  const grade = gradeAnswer(q, answer);
  // 2. Retrieve study material for what was missed
  const material = studyMaterial(q, track, category).map((c) => ({ id: c.id, title: c.title, text: c.text }));
  // 3. Feedback: local by default, LLM-polished when available and the input looks safe
  let feedback =
    grade.missed.length === 0
      ? 'Strong answer. You covered every key point.'
      : `You covered ${grade.covered.length} of ${q.keyPoints.length} key points. Missing: ${grade.missed.join(', ')}. ${grade.notes.join(' ')}`.trim();
  let mode: 'llm' | 'local' = 'local';

  if (hasLlm() && !detectPromptInjection(answer)) {
    const reply = await callLLM({
      system: `You are a calm, direct interviewer giving feedback to a fresher. Reply as JSON: {"feedback": string}. At most 70 words. Mention what was good, then the most important missing point, then one way to improve. Do not change the score and do not invent facts. ${DATA_ONLY_NOTICE}`,
      user: [`Question: ${q.question}`, `Score: ${grade.score}/100`, `Covered: ${grade.covered.join(', ') || 'none'}`, `Missed: ${grade.missed.join(', ') || 'none'}`,
        untrusted('candidate_answer', answer), untrusted('study_notes', material.map((m) => m.text).join('\n'))].join('\n'),
      json: true, maxTokens: 220,
    });
    const ok = feedbackSchema.safeParse(parseJson(reply));
    if (ok.success) { feedback = ok.data.feedback; mode = 'llm'; }
  }

  // 4. Plan the next question or finish
  const turns = [...history, { questionId: q.id, answer, score: grade.score }];
  const done = turns.length >= TOTAL_QUESTIONS;
  const next = done ? null : planNext({ history: turns, track, category });
  return NextResponse.json({
    grade, feedback, material, mode,
    next: next ? publicQ(next) : null,
    done: done || !next,
    summary: done || !next ? summarise(turns) : null,
  });
}
