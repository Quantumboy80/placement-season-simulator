/**
 * POST /api/drive-from-jd  { text }
 * Turns a pasted job description into a game drive (offline heuristic parser).
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { guard } from '@/lib/apiGuard';
import { parseJobDescription } from '@/lib/jdParser';

const schema = z.object({ text: z.string().min(30).max(8000) });

export async function POST(req: Request) {
  const g = await guard(req, 'jd', 10, 20_000);
  if (!g.ok) return g.res;
  const parsed = schema.safeParse(g.body);
  if (!parsed.success) return NextResponse.json({ error: 'Paste a longer job description (at least 30 characters).' }, { status: 400 });
  return NextResponse.json({ problem: parseJobDescription(parsed.data.text) });
}
