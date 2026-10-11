/**
 * @file Retriever for the knowledge base (BM25, with optional dense rerank)
 *
 * Works with no API keys and no network: a small BM25 index over the curated
 * chunks. On the server, `searchHybrid` can rerank the top candidates with
 * embeddings when OPENAI_API_KEY is set (see lib/llm.ts). To scale up, swap the
 * index for pgvector or another vector store; the `search` signature stays.
 */

import { KNOWLEDGE_BASE, type KbChunk } from '@/data/kb/knowledge';

const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'is', 'are', 'be', 'it', 'as', 'at', 'by', 'with', 'that', 'this', 'you', 'your', 'from', 'can', 'will', 'not', 'but', 'if', 'so', 'do', 'how', 'what', 'when', 'than', 'then', 'they', 'their', 'have', 'has']);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);
}

/** Very light stemmer: enough to match plural and -ing forms. */
function stem(t: string): string {
  if (t.length > 5 && t.endsWith('ing')) return t.slice(0, -3);
  if (t.length > 4 && t.endsWith('es')) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1);
  return t;
}

export interface SearchHit {
  chunk: KbChunk;
  score: number;
}

export interface SearchOptions {
  k?: number;
  /** Boost chunks whose audience includes any of these (company types or track ids). */
  audience?: string[];
  /** Only chunks that share at least one of these topics. */
  topics?: string[];
}

interface Index {
  docs: { chunk: KbChunk; tf: Map<string, number>; len: number }[];
  df: Map<string, number>;
  avgLen: number;
}

let chunks: KbChunk[] = [...KNOWLEDGE_BASE];
let index: Index | null = null;

function build(): Index {
  const docs = chunks.map((chunk) => {
    const tokens = tokenize(`${chunk.title} ${chunk.title} ${chunk.topics.join(' ')} ${chunk.text}`);
    const tf = new Map<string, number>();
    tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
    return { chunk, tf, len: tokens.length };
  });
  const df = new Map<string, number>();
  docs.forEach((d) => d.tf.forEach((_, term) => df.set(term, (df.get(term) || 0) + 1)));
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / Math.max(1, docs.length);
  return { docs, df, avgLen };
}

/** Add your own chunks at runtime (for example from a JSON file of interview experiences). */
export function addChunks(extra: KbChunk[]): void {
  const ids = new Set(chunks.map((c) => c.id));
  chunks = [...chunks, ...extra.filter((c) => !ids.has(c.id))];
  index = null;
}

export function search(query: string, opts: SearchOptions = {}): SearchHit[] {
  const { k = 4, audience = [], topics = [] } = opts;
  if (!index) index = build();
  const q = tokenize(query);
  if (q.length === 0) return [];
  const N = index.docs.length;
  const k1 = 1.4;
  const b = 0.75;

  const hits: SearchHit[] = [];
  for (const d of index.docs) {
    if (topics.length > 0 && !d.chunk.topics.some((t) => topics.includes(t))) continue;
    let score = 0;
    for (const term of q) {
      const f = d.tf.get(term) || 0;
      if (!f) continue;
      const n = index.df.get(term) || 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / index.avgLen)));
    }
    if (score <= 0) continue;
    if (audience.length > 0) {
      if (d.chunk.audience.some((a) => audience.includes(a))) score *= 1.35;
      else if (d.chunk.audience.length > 0) score *= 0.7;
    }
    hits.push({ chunk: d.chunk, score });
  }
  return hits.sort((a, b2) => b2.score - a.score).slice(0, k);
}

/** Server-side: BM25 candidates, optionally reranked by embeddings. */
export async function searchHybrid(
  query: string,
  opts: SearchOptions,
  embed?: (texts: string[]) => Promise<number[][] | null>
): Promise<SearchHit[]> {
  const k = opts.k ?? 4;
  const candidates = search(query, { ...opts, k: Math.max(12, k * 3) });
  if (!embed || candidates.length <= 1) return candidates.slice(0, k);
  try {
    const vecs = await embed([query, ...candidates.map((c) => `${c.chunk.title}. ${c.chunk.text}`)]);
    if (!vecs || vecs.length !== candidates.length + 1) return candidates.slice(0, k);
    const [qv, ...dvs] = vecs;
    const cos = (a: number[], b2: number[]) => {
      let dot = 0, na = 0, nb = 0;
      for (let i = 0; i < a.length; i++) { dot += a[i] * b2[i]; na += a[i] * a[i]; nb += b2[i] * b2[i]; }
      return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
    };
    const maxBm = Math.max(...candidates.map((c) => c.score)) || 1;
    return candidates
      .map((c, i) => ({ chunk: c.chunk, score: 0.4 * (c.score / maxBm) + 0.6 * cos(qv, dvs[i]) }))
      .sort((a, b2) => b2.score - a.score)
      .slice(0, k);
  } catch {
    return candidates.slice(0, k);
  }
}
