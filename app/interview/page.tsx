'use client';

/**
 * Mock Interview Agent: plan -> retrieve -> grade -> feedback.
 * Works offline (rubric grading + built-in knowledge base). With an LLM key
 * on the server, feedback text is polished, but scores stay rubric-based.
 */

import { useState } from 'react';
import Link from 'next/link';
import { TRACKS, DRIVE_CATEGORIES } from '@/lib/vocabulary';

type Q = { id: string; topic: string; question: string; hint: string; difficulty: number };
type Turn = { questionId: string; answer: string; score: number };
type Result = {
  grade: { score: number; covered: string[]; missed: string[]; notes: string[] };
  feedback: string;
  material: { id: string; title: string; text: string }[];
  mode: 'llm' | 'local';
  done: boolean;
  next: Q | null;
  summary: { average: number; byTopic: { topic: string; average: number }[]; weakest: string | null } | null;
};

export default function InterviewPage() {
  const [track, setTrack] = useState<string>('web-app');
  const [category, setCategory] = useState<string>('product');
  const [question, setQuestion] = useState<Q | null>(null);
  const [total, setTotal] = useState(5);
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState<Turn[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function call(body: object) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/interview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function start() {
    setHistory([]); setResult(null); setAnswer('');
    const data = await call({ action: 'start', track, category });
    if (data) { setQuestion(data.question); setTotal(data.total); }
  }

  async function submit() {
    if (!question || !answer.trim()) return;
    const data: Result | null = await call({ action: 'answer', questionId: question.id, answer, history, track, category });
    if (!data) return;
    setResult(data);
    setHistory([...history, { questionId: question.id, answer, score: data.grade.score }]);
  }

  function nextQuestion() {
    if (result?.next) { setQuestion(result.next); setResult(null); setAnswer(''); }
  }

  const finished = result?.done;
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 font-mono text-xs">
      <div className="max-w-3xl mx-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">MOCK INTERVIEW AGENT</h1>
          <Link href="/" className="underline text-neutral-500">Back to the game</Link>
        </div>
        <p className="font-sans text-neutral-600">
          The agent picks questions for your track, targets your weakest topic, grades with a fixed rubric and pulls study notes for what you missed.
        </p>

        {!question && (
          <div className="border border-neutral-300 bg-white p-4 space-y-3 rounded">
            <label className="block">Career track
              <select className="mt-1 w-full border p-2 bg-white" value={track} onChange={(e) => setTrack(e.target.value)}>
                {TRACKS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </label>
            <label className="block">Company type
              <select className="mt-1 w-full border p-2 bg-white" value={category} onChange={(e) => setCategory(e.target.value)}>
                {Object.entries(DRIVE_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </label>
            <button onClick={start} disabled={loading} className="bg-neutral-900 text-white px-4 py-2 rounded disabled:opacity-50">START {total}-QUESTION INTERVIEW</button>
          </div>
        )}

        {question && !finished && (
          <div className="border border-neutral-300 bg-white p-4 space-y-3 rounded">
            <div className="flex justify-between text-neutral-500">
              <span>QUESTION {history.length + (result ? 0 : 1)} OF {total}</span>
              <span className="uppercase">{question.topic}</span>
            </div>
            <p className="font-sans text-sm font-semibold">{question.question}</p>
            <p className="text-neutral-400">Hint: {question.hint}</p>
            {!result && (
              <>
                <textarea className="w-full border p-2 h-36 font-sans text-sm" placeholder="Type your answer as you would say it out loud..." value={answer} onChange={(e) => setAnswer(e.target.value)} maxLength={3000} />
                <button onClick={submit} disabled={loading || !answer.trim()} className="bg-neutral-900 text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'GRADING...' : 'SUBMIT ANSWER'}</button>
              </>
            )}
            {result && (
              <div className="space-y-3">
                <div className="flex items-center gap-3"><span className="text-2xl font-bold">{result.grade.score}</span><span className="text-neutral-500">/ 100 (rubric score)</span>
                  <span className="ml-auto text-[10px] border px-1.5 py-0.5 rounded uppercase">{result.mode === 'llm' ? 'AI feedback' : 'Offline feedback'}</span></div>
                <p className="font-sans text-sm">{result.feedback}</p>
                {result.material.length > 0 && (
                  <div className="bg-neutral-50 border p-3 rounded space-y-2">
                    <div className="text-neutral-500">STUDY NOTES (retrieved)</div>
                    {result.material.map((m) => <p key={m.id} className="font-sans"><b>{m.title}.</b> {m.text}</p>)}
                  </div>
                )}
                {!result.done && <button onClick={nextQuestion} className="bg-neutral-900 text-white px-4 py-2 rounded">NEXT QUESTION</button>}
              </div>
            )}
          </div>
        )}

        {finished && result?.summary && (
          <div className="border border-neutral-300 bg-white p-4 space-y-3 rounded">
            <div className="text-lg font-bold">Average: {result.summary.average} / 100</div>
            <div className="space-y-1">
              {result.summary.byTopic.map((t) => (
                <div key={t.topic} className="flex items-center gap-2"><span className="w-28 uppercase">{t.topic}</span>
                  <div className="flex-1 bg-neutral-100 h-2 rounded"><div className="bg-neutral-900 h-2 rounded" style={{ width: `${t.average}%` }} /></div><span>{t.average}</span></div>
              ))}
            </div>
            {result.summary.weakest && <p className="font-sans">Weakest topic: <b className="uppercase">{result.summary.weakest}</b>. Spend your next study block there.</p>}
            <button onClick={() => { setQuestion(null); setResult(null); setHistory([]); }} className="bg-neutral-900 text-white px-4 py-2 rounded">TRY AGAIN</button>
          </div>
        )}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </main>
  );
}
