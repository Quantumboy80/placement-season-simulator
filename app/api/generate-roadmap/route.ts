/**
 * POST /api/generate-roadmap
 * Builds the personal prep roadmap. The roadmap itself is deterministic and
 * retrieval-grounded (lib/roadmapGenerator.ts). If an LLM key is set, a short
 * personal coach note is added on top. Without a key it is simply omitted.
 */

import { NextResponse } from 'next/server';
import { guard } from '@/lib/apiGuard';
import { generateRoadmap } from '@/lib/roadmapGenerator';
import { callLLM, hasLlm, untrusted, DATA_ONLY_NOTICE } from '@/lib/llm';
import { detectPromptInjection } from '@/lib/security';

export async function POST(req: Request) {
  const g = await guard(req, 'roadmap', 5, 60_000);
  if (!g.ok) return g.res;
  const state = g.body;
  if (!state || typeof state !== 'object' || !state.selectedProblem) {
    return NextResponse.json({ error: 'Missing game state' }, { status: 400 });
  }

  const markdown = generateRoadmap(state);
  let note = '';
  const scan = JSON.stringify([state.selectedProblem?.title, state.usp, state.businessModel]);
  if (hasLlm() && !detectPromptInjection(scan)) {
    const reply = await callLLM({
      system: `You are a warm, direct placement coach. Write a 3 to 4 sentence personal note for a student about their roadmap. Be specific, honest and encouraging. Do not invent facts or numbers. ${DATA_ONLY_NOTICE}`,
      user: untrusted('roadmap', markdown.slice(0, 3500)),
      maxTokens: 220,
    });
    if (reply) note = `> **Coach note:** ${reply.replace(/\s+/g, ' ').trim()}\n\n`;
  }
  return NextResponse.json({ markdown: note + markdown, mode: note ? 'llm' : 'local' });
}
