/**
 * @file Resume analyzer (deterministic core)
 *
 * Parses pasted resume text into sections, detects skills against the skill
 * registry, measures impact (quantified bullets), reuses the game's resume
 * evaluator for the layout score, and compares skills with what the chosen
 * track and company type call for. No network needed. An LLM can add rewrite
 * suggestions on top (see app/api/resume-analyze).
 */

import { TECH_REGISTRY } from '@/data/techRegistry';
import { evaluatePitchDeck, type PitchDeckEvaluation } from '@/lib/pitchDeckEvaluator';
import { getRecommendations } from '@/lib/recommendations';
import { search } from '@/lib/rag/retriever';
import type { KbChunk } from '@/data/kb/knowledge';

const HEADINGS: Record<string, RegExp> = {
  summary: /^(summary|profile|about me|professional summary)\b/i,
  objective: /^(career )?objective\b/i,
  education: /^(education|academics|academic (background|qualification))\b/i,
  skills: /^(technical )?skills\b|^(core )?competenc/i,
  projects: /^(academic |personal |key )?projects?\b/i,
  experience: /^(work )?(experience|internships?|employment)\b/i,
  publications: /^(publications?|research|papers?)\b/i,
  achievements: /^(achievements?|awards?|honou?rs|accomplishments)\b/i,
  certifications: /^(certifications?|courses|licen[sc]es)\b/i,
  leadership: /^(leadership|positions? of responsibility|clubs?)\b/i,
  extracurricular: /^(extra[- ]?curricular|activities|volunteering)\b/i,
  hobbies: /^(hobbies|interests)\b/i,
  languages: /^languages( known)?\b/i,
  references: /^references?\b/i,
  declaration: /^declaration\b/i,
  'personal-details': /^personal (details|information)\b|father'?s name|date of birth/i,
  coursework: /^(relevant )?coursework\b/i,
  opensource: /^open[- ]?source\b/i,
};

/** Common spellings that map to registry skills. */
const ALIASES: Record<string, string[]> = {
  'reg-cpp': ['c++', 'cpp'], 'reg-python': ['python'], 'reg-java': ['java '], 'reg-js-ts': ['javascript', 'typescript'], 'reg-embedded-c': ['embedded c'],
  'reg-c-lang': [' c,', 'c programming', 'embedded c'], 'reg-react': ['react'], 'reg-next': ['next.js', 'nextjs'], 'reg-node': ['node.js', 'nodejs', 'express.js'],
  'reg-sql-db': ['postgres', 'mysql', 'sql'], 'reg-mongodb': ['mongodb'], 'reg-pytorch': ['pytorch', 'tensorflow'], 'reg-sklearn': ['scikit', 'sklearn'],
  'reg-numpy-pandas': ['numpy', 'pandas'], 'reg-cv-yolo': ['yolo', 'opencv', 'computer vision'], 'reg-nlp-llm': ['nlp', 'llm', 'transformer'], 'reg-rag': ['rag', 'retrieval'],
  'reg-git': ['git', 'github'], 'reg-docker': ['docker'], 'reg-linux': ['linux'], 'reg-os': ['operating system'], 'reg-dbms': ['dbms', 'database'], 'reg-cn': ['computer network'],
  'reg-arduino': ['arduino'], 'reg-esp32': ['esp32'], 'reg-stm32': ['stm32', 'cortex'], 'reg-matlab': ['matlab', 'simulink'], 'reg-pcb': ['pcb', 'kicad'], 'reg-rtos': ['rtos', 'freertos'],
  'reg-vhdl-fpga': ['verilog', 'vhdl', 'fpga'], 'reg-cloud-basics': ['aws', 'azure', 'gcp'], 'reg-stats': ['statistics', 'probability'], 'reg-research-paper': ['published', 'paper', 'ieee'],
  'reg-opensource': ['open source', 'open-source', 'pull request'], 'reg-hackathon-wins': ['hackathon'], 'reg-internship': ['intern'], 'reg-gate': ['gate '],
};

export interface ResumeAnalysis {
  words: number;
  estimatedPages: number;
  sections: string[];
  skillsFound: { id: string; name: string }[];
  skillGaps: { id: string; name: string }[];
  bullets: number;
  quantifiedBullets: number;
  links: { github: boolean; linkedin: boolean; other: number };
  fillerSections: string[];
  layout: PitchDeckEvaluation;
  score: number;
  findings: string[];
  weakBullets: string[];
  sources: Pick<KbChunk, 'id' | 'title' | 'text'>[];
}

export function analyzeResume(text: string, opts: { track?: string | null; category?: string | null } = {}): ResumeAnalysis {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  // Sections in order of appearance
  const sections: string[] = [];
  const headerLike = (l: string) => l.length <= 40 && !/[.;]$/.test(l);
  lines.forEach((l) => {
    if (!headerLike(l)) return;
    const clean = l.replace(/[:\-_=*#]+$/g, '').replace(/^[#*\s]+/, '');
    for (const [id, re] of Object.entries(HEADINGS)) {
      if (re.test(clean) && !sections.includes(id)) { sections.push(id); break; }
    }
  });
  if (/github\.com|linkedin\.com|@/.test(lines.slice(0, 6).join(' ')) && !sections.includes('header')) sections.unshift('header');
  if (/github\.com|linkedin\.com/i.test(text) && !sections.includes('links')) sections.splice(Math.min(1, sections.length), 0, 'links');

  const lower = ` ${text.toLowerCase()} `;
  const skillsFound = TECH_REGISTRY.filter((r) => {
    const aliases = ALIASES[r.id] || [];
    return lower.includes(` ${r.name.toLowerCase()}`) || aliases.some((a) => lower.includes(a));
  }).map((r) => ({ id: r.id, name: r.name }));

  // The language C is easy to miss: match a standalone "C" in a list such as "C, Python"
  if (/(^|[,;:|(\s])C(\s*[,;|)/]|\s*$)/m.test(text) && !skillsFound.some((s) => s.id === 'reg-c-lang')) {
    skillsFound.push({ id: 'reg-c-lang', name: 'C Programming' });
  }

  const rec = getRecommendations(opts.track ?? null, null, opts.category ?? null);
  const have = new Set(skillsFound.map((s) => s.id));
  const skillGaps = rec.techIds.filter((id) => !have.has(id)).map((id) => ({ id, name: TECH_REGISTRY.find((r) => r.id === id)?.name || id }));

  const bulletLines = lines.filter((l) => /^[-•*▪●–]\s*\S/.test(l) || (l.length > 45 && /[a-z]/.test(l) && !headerLike(l)));
  const quantified = bulletLines.filter((l) => /\d+(\.\d+)?\s*(%|x|ms|k|m|users|requests|hours|days|percent)|\b\d{2,}\b/.test(l));
  const weakBullets = bulletLines
    .filter((l) => !quantified.includes(l) && /^(?:[-•*▪●–]\s*)?(worked|helped|responsible|involved|assisted|participated)/i.test(l))
    .slice(0, 3);

  const links = { github: /github\.com/i.test(text), linkedin: /linkedin\.com/i.test(text), other: (text.match(/https?:\/\//g) || []).length };
  const filler = sections.filter((s) => ['objective', 'hobbies', 'references', 'declaration', 'personal-details'].includes(s));

  const deckIds = sections.filter((s) => s !== 'languages' || true).slice(0, 8);
  const layout = evaluatePitchDeck(deckIds);
  const estimatedPages = Math.max(1, Math.round((words / 550) * 10) / 10);

  const findings: string[] = [];
  if (estimatedPages > 1.3) findings.push(`About ${estimatedPages} pages. Freshers should aim for one page.`);
  if (filler.length) findings.push(`Remove filler sections: ${filler.join(', ')}.`);
  if (!links.github) findings.push('No GitHub link found. Add one with two pinned projects.');
  if (!links.linkedin) findings.push('No LinkedIn link found.');
  if (bulletLines.length > 0 && quantified.length / bulletLines.length < 0.3) findings.push('Few bullets contain numbers. Add honest metrics such as latency, accuracy or users.');
  if (!sections.includes('projects') && !sections.includes('experience')) findings.push('No projects or experience section detected. This is the strongest proof you can show.');
  const pIdx = sections.indexOf('projects');
  const eIdx = sections.indexOf('education');
  if (pIdx !== -1 && eIdx !== -1 && eIdx < pIdx) findings.push('Education comes before projects. Consider leading with projects unless the drive has a strict cutoff.');
  if (skillGaps.length) findings.push(`Skills your target track usually wants but I could not find: ${skillGaps.map((g) => g.name).join(', ')}.`);
  if (findings.length === 0) findings.push('No major issues detected. Tailor the resume to each company.');

  let score = layout.score;
  score += Math.min(10, quantified.length * 2);
  score -= filler.length * 3;
  score -= estimatedPages > 1.3 ? 8 : 0;
  score += links.github ? 3 : 0;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const sources = search(`resume ${findings.join(' ')}`, { k: 3, topics: ['resume', 'portfolio', 'projects'] }).map((h) => ({ id: h.chunk.id, title: h.chunk.title, text: h.chunk.text }));

  return { words, estimatedPages, sections, skillsFound, skillGaps, bullets: bulletLines.length, quantifiedBullets: quantified.length, links, fillerSections: filler, layout, score, findings, weakBullets, sources };
}
