/**
 * POST /api/resume-analyze  { text, track?, category? }
 * Deterministic analysis (lib/resumeAnalyzer.ts) plus optional LLM bullet
 * rewrites. The model is told never to invent numbers.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { guard } from '@/lib/apiGuard';
import { analyzeResume } from '@/lib/resumeAnalyzer';
import { callLLM, hasLlm, parseJson, untrusted, DATA_ONLY_NOTICE } from '@/lib/llm';
import { detectPromptInjection } from '@/lib/security';

const schema = z.object({ text: z.string().min(40).max(12000), track: z.string().max(40).nullable().optional(), category: z.string().max(40).nullable().optional() });
const rewriteSchema = z.object({ rewrites: z.array(z.object({ original: z.string().max(400), improved: z.string().max(400) })).max(5) });

export async function POST(req: Request) {
  const g = await guard(req, 'resume', 8, 60_000);
  if (!g.ok) return g.res;
  const parsed = schema.safeParse(g.body);
  if (!parsed.success) return NextResponse.json({ error: 'Paste at least a few lines of your resume (40 to 12000 characters).' }, { status: 400 });
  const { text, track = null, category = null } = parsed.data;

  const analysis = analyzeResume(text, { track, category });
  let rewrites: { original: string; improved: string }[] = [];
  let mode: 'llm' | 'local' = 'local';

  if (hasLlm() && analysis.weakBullets.length > 0 && !detectPromptInjection(text)) {
    const reply = await callLLM({
      system: `You improve resume bullets for freshers. Reply as JSON: {"rewrites":[{"original":string,"improved":string}]}. Start each improved bullet with a strong verb. Never invent facts or numbers: where a metric is missing, use a placeholder like [X%] for the student to fill. ${DATA_ONLY_NOTICE}`,
      user: untrusted('weak_bullets', analysis.weakBullets.join('\n')),
      json: true, maxTokens: 500,
    });
    const ok = rewriteSchema.safeParse(parseJson(reply));
    if (ok.success) { rewrites = ok.data.rewrites; mode = 'llm'; }
  }
  return NextResponse.json({ analysis, rewrites, mode });
}
