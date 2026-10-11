'use client';

/** Resume analyzer: paste your resume text and get a recruiter-style review. */

import { useState } from 'react';
import Link from 'next/link';
import { TRACKS, DRIVE_CATEGORIES } from '@/lib/vocabulary';

export default function ResumePage() {
  const [text, setText] = useState('');
  const [track, setTrack] = useState('web-app');
  const [category, setCategory] = useState('product');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function analyze() {
    setLoading(true); setError(''); setData(null);
    try {
      const res = await fetch('/api/resume-analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, track, category }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Request failed');
      setData(json);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  const a = data?.analysis;
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 font-mono text-xs">
      <div className="max-w-3xl mx-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">RESUME ANALYZER</h1>
          <Link href="/" className="underline text-neutral-500">Back to the game</Link>
        </div>
        <p className="font-sans text-neutral-600">Paste plain text from your resume. Nothing is stored. The review runs a recruiter-style checklist and compares your skills with what your track usually needs.</p>
        <div className="grid grid-cols-2 gap-3">
          <select className="border p-2 bg-white" value={track} onChange={(e) => setTrack(e.target.value)}>{TRACKS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <select className="border p-2 bg-white" value={category} onChange={(e) => setCategory(e.target.value)}>{Object.entries(DRIVE_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
        </div>
        <textarea className="w-full border p-2 h-60 font-sans text-sm" placeholder="Paste your resume text here..." value={text} onChange={(e) => setText(e.target.value)} maxLength={12000} />
        <button onClick={analyze} disabled={loading || text.trim().length < 40} className="bg-neutral-900 text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'ANALYZING...' : 'ANALYZE RESUME'}</button>
        {error && <p className="text-red-600">{error}</p>}

        {a && (
          <div className="border border-neutral-300 bg-white p-4 space-y-4 rounded">
            <div className="flex items-center gap-4"><span className="text-3xl font-bold">{a.score}</span><span className="text-neutral-500">/ 100 overall</span>
              <span className="ml-auto text-neutral-500">{a.words} words, about {a.estimatedPages} page(s)</span></div>
            <div><div className="text-neutral-500 mb-1">FINDINGS</div><ul className="list-disc ml-4 space-y-1 font-sans text-sm">{a.findings.map((f: string, i: number) => <li key={i}>{f}</li>)}</ul></div>
            <div><div className="text-neutral-500 mb-1">SECTIONS DETECTED</div><div className="font-sans">{a.sections.join(' > ') || 'None'}</div></div>
            <div><div className="text-neutral-500 mb-1">SKILLS FOUND</div><div className="font-sans">{a.skillsFound.map((s: any) => s.name).join(', ') || 'None detected'}</div></div>
            <div className="grid grid-cols-3 gap-2">
              <div className="border p-2 rounded">Layout score<br /><b>{a.layout.score}</b></div>
              <div className="border p-2 rounded">Bullets with numbers<br /><b>{a.quantifiedBullets} / {a.bullets}</b></div>
              <div className="border p-2 rounded">Links<br /><b>{a.links.github ? 'GitHub ' : ''}{a.links.linkedin ? 'LinkedIn' : ''}{!a.links.github && !a.links.linkedin ? 'None' : ''}</b></div>
            </div>
            {data.rewrites?.length > 0 && (
              <div><div className="text-neutral-500 mb-1">SUGGESTED REWRITES {data.mode === 'llm' ? '(AI)' : ''}</div>
                {data.rewrites.map((r: any, i: number) => <div key={i} className="font-sans text-sm mb-2"><div className="text-neutral-400 line-through">{r.original}</div><div>{r.improved}</div></div>)}</div>
            )}
            {a.sources.length > 0 && (
              <div className="bg-neutral-50 border p-3 rounded space-y-2"><div className="text-neutral-500">TIPS FOR YOU (retrieved)</div>
                {a.sources.map((s: any) => <p key={s.id} className="font-sans"><b>{s.title}.</b> {s.text}</p>)}</div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
