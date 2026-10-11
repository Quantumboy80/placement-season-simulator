/**
 * @file Job description -> company drive
 *
 * Turns a pasted job description into a `Problem` the game can use as a drive.
 * Heuristic and offline. Everything extracted is shown to the player, who can
 * edit nothing silently: this only fills the same fields as the built-in drives.
 */

import type { Problem } from '@/types/game';
import { TECH_REGISTRY } from '@/data/techRegistry';

const CATEGORY_RULES: [Problem['category'], RegExp][] = [
  ['core-engg', /\b(embedded|firmware|plc|scada|power systems?|transformer|microcontroller|control systems?|electrical engineer|vlsi|pcb)\b/i],
  ['data-ai', /\b(data analyst|data scientist|machine learning|ml engineer|computer vision|nlp|analytics|deep learning)\b/i],
  ['govt-psu', /\b(psu|public sector|gate score|government|executive trainee|engineer trainee)\b/i],
  ['bfsi-consulting', /\b(bank|financial|fintech|consult|trading|risk|insurance|bfsi)\b/i],
  ['startup', /\b(startup|founding|early[- ]stage|seed|series a|take[- ]home)\b/i],
  ['product', /\b(sde|software development engineer|backend engineer|frontend engineer|system design|product (company|engineering))\b/i],
  ['it-services', /\b(trainee|associate engineer|systems engineer|mass hiring|service agreement|aptitude)\b/i],
];

export function parseJobDescription(raw: string): Problem {
  const text = raw.replace(/\s+\n/g, '\n').trim().slice(0, 8000);
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const title = (lines[0] || 'Custom Drive').slice(0, 90);

  let category: Problem['category'] = 'it-services';
  for (const [cat, re] of CATEGORY_RULES) {
    if (re.test(text)) { category = cat; break; }
  }

  const constraints: string[] = [];
  const cgpa = text.match(/(\d(?:\.\d+)?)\s*(?:\+|and above|or above)?\s*(?:cgpa|gpa)/i) || text.match(/(?:cgpa|gpa)[^\d]{0,15}(\d(?:\.\d+)?)/i);
  if (cgpa) constraints.push(`CGPA of ${cgpa[1]} or above`);
  const pct = text.match(/(\d{2})\s*%\s*(?:throughout|and above|or above|in)/i);
  if (pct) constraints.push(`Minimum ${pct[1]}% in academics`);
  if (/no (active )?backlogs?|without (any )?backlogs?/i.test(text)) constraints.push('No active backlogs');
  if (/service agreement|bond/i.test(text)) constraints.push('Service agreement or bond mentioned');
  if (/relocat/i.test(text)) constraints.push('Willing to relocate');
  if (/online (assessment|test)/i.test(text)) constraints.push('Online assessment is the first filter');
  if (/take[- ]home/i.test(text)) constraints.push('Take-home task included');
  if (constraints.length === 0) constraints.push('Read the notification for eligibility and rounds');

  const lower = ` ${text.toLowerCase()} `;
  const skills = TECH_REGISTRY.filter((r) => lower.includes(` ${r.name.toLowerCase()}`)).slice(0, 6).map((r) => r.name);
  const difficulty: Problem['difficulty'] = /\b(system design|sde-?2|senior|hard|advanced)\b/i.test(text) ? 'advanced'
    : category === 'it-services' ? 'beginner' : 'intermediate';

  const body = lines.slice(1, 4).join(' ').slice(0, 280) || 'A custom drive created from a pasted job description.';
  const id = `drive-custom-${Math.abs([...title].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)).toString(36)}`;

  return {
    id,
    title,
    description: body,
    category,
    difficulty,
    constraints: constraints.slice(0, 5),
    bonusObjectives: skills.length ? [`Show proof in: ${skills.join(', ')}`] : ['Tailor your resume to the keywords in the description'],
    judgingHint: skills.length ? `Expect questions on ${skills.slice(0, 3).join(', ')}. Tie each answer to a project.` : 'Mirror the honest keywords of the description in your answers.',
  };
}
