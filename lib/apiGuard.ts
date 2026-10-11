/**
 * @file Shared guard for API routes: payload size, per-IP rate limit, JSON parse.
 * Note: the rate limiter is in-memory. On serverless hosting each instance has
 * its own memory, so use Redis (for example Upstash) before production traffic.
 */

import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { checkPayloadSize } from '@/lib/security';

export async function guard(
  req: Request,
  namespace: string,
  limitPerMinute: number,
  maxBytes: number
): Promise<{ ok: true; body: any } | { ok: false; res: NextResponse }> {
  const size = checkPayloadSize(req, maxBytes);
  if (!size.ok) return { ok: false, res: NextResponse.json({ error: size.error }, { status: 413 }) };

  const rl = checkRateLimit(`${namespace}:${getClientIp(req)}`, limitPerMinute, 60_000);
  if (!rl.success) {
    return { ok: false, res: NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429, headers: { 'Retry-After': '60' } }) };
  }

  let text = '';
  try {
    text = await req.text();
  } catch {
    return { ok: false, res: NextResponse.json({ error: 'Could not read body' }, { status: 400 }) };
  }
  if (text.length > maxBytes) return { ok: false, res: NextResponse.json({ error: 'Payload too large' }, { status: 413 }) };
  try {
    return { ok: true, body: JSON.parse(text) };
  } catch {
    return { ok: false, res: NextResponse.json({ error: 'Malformed JSON' }, { status: 400 }) };
  }
}
