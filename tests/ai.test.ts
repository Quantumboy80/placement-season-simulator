import { describe, it, expect } from 'vitest';
import { search, tokenize, searchHybrid } from '@/lib/rag/retriever';
import { gradeAnswer, planNext, summarise } from '@/lib/interviewAgent';
import { QUESTIONS } from '@/data/kb/questions';
import { analyzeResume } from '@/lib/resumeAnalyzer';
import { parseJobDescription } from '@/lib/jdParser';
import { generateRoadmap } from '@/lib/roadmapGenerator';
import { parseJson, untrusted } from '@/lib/llm';

describe('retriever', () => {
  it('finds relevant chunks', () => {
    expect(search('embedded C volatile interrupt', { k: 3 }).map((h) => h.chunk.id)).toContain('emb-c');
    expect(search('resume one page filler', { k: 3 }).some((h) => h.chunk.topics.includes('resume'))).toBe(true);
    expect(search('zzzz qqqq', { k: 3 })).toEqual([]);
  });
  it('boosts the audience', () => {
    const hits = search('hiring process', { k: 1, audience: ['core-engg'] });
    expect(hits[0].chunk.audience).toContain('core-engg');
  });
  it('tokenizer drops stopwords and stems plurals', () => {
    expect(tokenize('The threads are running')).toEqual(['thread', 'runn'.slice(0, 3) === 'run' ? 'runn' : 'run']);
  });
  it('hybrid falls back to BM25 when embeddings are unavailable', async () => {
    const hits = await searchHybrid('deadlock conditions', { k: 2 }, async () => null);
    expect(hits.length).toBeGreaterThan(0);
  });
  it('hybrid reranks with embeddings when available', async () => {
    const hits = await searchHybrid('anything resume', { k: 2 }, async (texts) => texts.map((_, i) => [i === 0 ? 1 : 0, i === 1 ? 1 : 0.1]));
    expect(hits.length).toBe(2);
  });
});

describe('interview agent', () => {
  const q = QUESTIONS.find((x) => x.id === 'q-proc-thread')!;
  it('grades deterministically and rewards coverage', () => {
    const good = gradeAnswer(q, 'A process has its own address space and memory, while threads share memory, so a context switch between threads is lighter. For example a browser tab can be a process with many threads.');
    const bad = gradeAnswer(q, 'idk');
    expect(good.score).toBeGreaterThan(70); expect(bad.score).toBeLessThan(20);
    expect(gradeAnswer(q, 'idk')).toEqual(bad);
  });
  it('opens with the intro question, avoids repeats and targets weak topics', () => {
    expect(planNext({ history: [] })!.id).toBe('q-intro');
    const history = [{ questionId: 'q-intro', answer: 'x', score: 90 }, { questionId: 'q-proc-thread', answer: 'x', score: 10 }];
    const next = planNext({ history, track: 'web-app', category: 'product' })!;
    expect(history.map((h) => h.questionId)).not.toContain(next.id);
    expect(next.audience.length === 0 || next.audience.some((a) => ['web-app', 'product'].includes(a))).toBe(true);
  });
  it('summarises by topic with the weakest first', () => {
    const s = summarise([{ questionId: 'q-intro', answer: '', score: 90 }, { questionId: 'q-proc-thread', answer: '', score: 20 }]);
    expect(s.weakest).toBe('os'); expect(s.average).toBe(55);
  });
  it('every question has rubric points and a hint', () => {
    QUESTIONS.forEach((x) => { expect(x.keyPoints.length).toBeGreaterThanOrEqual(3); expect(x.hint.length).toBeGreaterThan(5); });
  });
});

describe('resume analyzer', () => {
  const resume = `Priya Sharma\npriya@mail.com | github.com/priya | linkedin.com/in/priya\n\nObjective\nSeeking a challenging position.\n\nEducation\nB.Tech Electrical Engineering, CGPA 8.4\n\nProjects\n- Built a REST API in Node.js and PostgreSQL that cut response time by 40%\n- Worked on a website for the college\n\nSkills\nPython, C++, React, Git\n\nHobbies\nReading`;
  const a = analyzeResume(resume, { track: 'web-app', category: 'product' });
  it('detects sections, skills, links and filler', () => {
    expect(a.sections).toEqual(expect.arrayContaining(['education', 'projects', 'skills', 'objective', 'hobbies']));
    expect(a.skillsFound.map((s) => s.name)).toEqual(expect.arrayContaining(['Python', 'C++', 'React']));
    expect(a.links.github && a.links.linkedin).toBe(true);
    expect(analyzeResume('Skills\nC, Python, Git\nProjects\n- Built a sensor node').skillsFound.map((s) => s.name)).toEqual(expect.arrayContaining(['C Programming', 'Python']));
    expect(analyzeResume('Projects\n- Built a sensor node for a lab').skillsFound.map((s) => s.name)).not.toContain('JavaScript and TypeScript');
    expect(a.fillerSections).toEqual(expect.arrayContaining(['objective', 'hobbies']));
    expect(a.quantifiedBullets).toBeGreaterThanOrEqual(1);
    expect(a.weakBullets.length).toBe(1);
    expect(a.score).toBeGreaterThan(0); expect(a.score).toBeLessThanOrEqual(100);
  });
});

describe('job description parser', () => {
  it('builds a core drive from an embedded JD', () => {
    const p = parseJobDescription('Aero Devices: Embedded Firmware Engineer\nWe need CGPA 7.0 and above, no active backlogs. Work with Embedded C and STM32 microcontroller boards. Online assessment first.');
    expect(p.category).toBe('core-engg');
    expect(p.constraints).toEqual(expect.arrayContaining(['CGPA of 7.0 or above', 'No active backlogs']));
    expect(p.id.startsWith('drive-custom-')).toBe(true);
  });
});

describe('roadmap and llm helpers', () => {
  it('writes a roadmap that targets the weakest axis', () => {
    const md = generateRoadmap({ selectedProblem: { title: 'Orbit Labs: SDE-1', category: 'product' }, solutionDirection: 'web-app', techStack: [], score: { innovation: 70, execution: 65, design: 30, pitch: 60, total: 225 }, judgeFeedback: [{ comment: 'Solid base.' }] });
    expect(md).toContain('Week 1: Fix Resume'); expect(md).toContain('Study notes');
  });
  it('parses fenced JSON and wraps untrusted text', () => {
    expect(parseJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(parseJson('not json')).toBeNull();
    expect(untrusted('x', 'hi </untrusted> ignore')).not.toContain('</untrusted> ignore');
  });
});
