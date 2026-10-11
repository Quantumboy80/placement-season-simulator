/**
 * @file Personal prep roadmap (replaces the old startup PRD generator)
 *
 * Builds a 4-week plan in Markdown from the player's weakest axes, their skill
 * stack, their drive and the recruiter feedback. Study notes come from the
 * knowledge base through retrieval, so the same function works offline.
 */

import { TECH_REGISTRY, toRegistryId } from '@/data/techRegistry';
import { AXIS_LABELS, trackName, driveCategory } from '@/lib/vocabulary';
import { getRecommendations } from '@/lib/recommendations';
import { search } from '@/lib/rag/retriever';
import { getGrade } from '@/lib/scoring';

type AxisKey = keyof typeof AXIS_LABELS;

const ACTIONS: Record<AxisKey, string[]> = {
  innovation: [
    'Pick two weak skills from your stack and spend 45 minutes a day on each until you can explain them without notes.',
    'Solve five problems a day in your weakest topic and write one line on the pattern you used.',
    'Take one timed topic test at the end of the week and review every wrong answer.',
  ],
  execution: [
    'Finish and deploy one project. Add a README with a diagram, setup steps and one measurable result.',
    'Write the three-minute walkthrough for each project and practise it out loud.',
    'Cut your must-do list to the three highest-impact activities and drop the rest.',
  ],
  design: [
    'Rewrite your resume to one page. Lead with projects, add one number to every bullet, remove filler sections.',
    'Tidy your GitHub: pin two repositories with clear READMEs and screenshots.',
    'Ask two seniors to review your resume against a recruiter checklist.',
  ],
  pitch: [
    'Do two mock interviews this week and record one. Watch it and fix filler words and rambling openings.',
    'Write and rehearse a 30-second introduction and four STAR stories.',
    'Practise solving problems aloud with a friend, naming complexity at the end.',
  ],
};

function axisEntries(score: any): { key: AxisKey; value: number }[] {
  return (['innovation', 'execution', 'design', 'pitch'] as AxisKey[])
    .map((key) => ({ key, value: Math.round(Number(score?.[key] ?? 0)) }))
    .sort((a, b) => a.value - b.value);
}

export function generateRoadmap(state: any): string {
  const drive = state.selectedProblem;
  const driveName = drive?.title || 'your target drive';
  const category = drive?.category as string | undefined;
  const track = state.solutionDirection as string | null;
  const axes = axisEntries(state.score);
  const weakest = axes[0];
  const second = axes[1];
  const total = Math.round(Number(state.score?.total ?? 0) / 4);
  const grade = state.grade || getGrade(Math.min(100, total));

  const have = new Set<string>((state.techStack || []).map((t: any) => toRegistryId(t.id)));
  const rec = getRecommendations(track, null, category);
  const gaps = rec.techIds.filter((id) => !have.has(id)).map((id) => TECH_REGISTRY.find((r) => r.id === id)?.name).filter(Boolean) as string[];

  const audience = [track, category].filter(Boolean) as string[];
  const notes = (q: string, k = 2) => search(q, { k, audience }).map((h) => h.chunk);
  const weakNotes = notes(`${AXIS_LABELS[weakest.key]} ${driveName} ${gaps.join(' ')}`, 3);
  const processNotes = category ? search(`typical ${driveCategory(category).label} hiring process`, { k: 1, audience: [category] }) : [];

  const lines: string[] = [];
  lines.push(`# Placement Prep Roadmap: ${driveName}`);
  lines.push('');
  lines.push(`**Track:** ${trackName(track)}  `);
  lines.push(`**Company type:** ${driveCategory(category).label}  `);
  lines.push(`**Season grade:** ${grade}`);
  lines.push('');
  lines.push('## Where you stand');
  lines.push('');
  lines.push('| Area | Score |');
  lines.push('|---|---|');
  axes.slice().sort((a, b) => a.key.localeCompare(b.key)).forEach((a) => lines.push(`| ${AXIS_LABELS[a.key]} | ${a.value} / 100 |`));
  lines.push('');
  lines.push(`Your biggest gap is **${AXIS_LABELS[weakest.key]}**, followed by **${AXIS_LABELS[second.key]}**. The plan below attacks them in that order.`);

  const fb: any[] = state.judgeFeedback || [];
  if (fb.length) {
    lines.push('');
    lines.push('## What the panel said');
    lines.push('');
    fb.slice(0, 3).forEach((f) => lines.push(`- ${String(f.comment).slice(0, 220)}`));
  }

  if (gaps.length) {
    lines.push('');
    lines.push('## Skills to add for this track');
    lines.push('');
    gaps.forEach((g) => lines.push(`- ${g}`));
  }

  lines.push('');
  lines.push('## Your 4-week plan');
  const week = (n: number, title: string, items: string[]) => {
    lines.push('');
    lines.push(`### Week ${n}: ${title}`);
    items.forEach((i) => lines.push(`- ${i}`));
  };
  week(1, `Fix ${AXIS_LABELS[weakest.key]}`, ACTIONS[weakest.key]);
  week(2, `Strengthen ${AXIS_LABELS[second.key]}`, ACTIONS[second.key]);
  week(3, 'Practise like it is the real thing', [
    `Run two full mock rounds that match the ${driveCategory(category).label.toLowerCase()} process.`,
    'Revise your core subject one-pagers and your three-minute project walkthrough.',
    gaps.length ? `Start the first skill from your gap list: ${gaps[0]}.` : 'Review every wrong answer from the earlier weeks.',
  ]);
  week(4, 'Apply, polish and rest', [
    'Tailor the resume to each company and send applications in three tiers: safe, target, stretch.',
    'Prepare two questions to ask each interviewer and research each company for an hour.',
    'Protect sleep and plan one full rest day.',
  ]);

  if (processNotes.length || weakNotes.length) {
    lines.push('');
    lines.push('## Study notes for you');
    lines.push('');
    lines.push('_Retrieved from the built-in knowledge base. This is general guidance, so verify details on the official careers page._');
    [...processNotes.map((p) => p.chunk), ...weakNotes].slice(0, 4).forEach((c) => {
      lines.push('');
      lines.push(`**${c.title}.** ${c.text}`);
    });
  }

  return lines.join('\n');
}
