/**
 * @file Resume evaluator (kept in pitchDeckEvaluator.ts so imports keep working)
 *
 * The player fills 8 slots with resume sections. This module scores the
 * layout the way a recruiter skimming for 20 seconds would. Names such as
 * `evaluatePitchDeck` and `AVAILABLE_SLIDES` are inherited from the
 * Hackathon Simulator. `evaluateResume` and `RESUME_SECTIONS` are aliases.
 *
 * It is a pure function with no I/O, so it is easy to unit test.
 */

export interface SlideComponent {
  id: string;
  name: string;
  description: string;
  /** intro = Basics, problem-solution = Proof, technology = Skills, business = Impact, closing = Extras */
  category: 'intro' | 'problem-solution' | 'technology' | 'business' | 'closing';
}

export const AVAILABLE_SLIDES: SlideComponent[] = [
  { id: 'header', name: 'Header and Contact', description: 'Name, email, phone and city. Keep it to two lines.', category: 'intro' },
  { id: 'links', name: 'Links (GitHub, LinkedIn)', description: 'Short, clickable links that recruiters can open in one tap.', category: 'intro' },
  { id: 'summary', name: 'Short Summary', description: 'Two lines: who you are and what you are aiming for.', category: 'intro' },
  { id: 'education', name: 'Education', description: 'Degree, college, CGPA and graduation year.', category: 'intro' },
  { id: 'projects', name: 'Projects', description: 'Two or three projects with a result, a number and your role.', category: 'problem-solution' },
  { id: 'experience', name: 'Internships and Experience', description: 'Real work with a company, lab or client, and what you delivered.', category: 'problem-solution' },
  { id: 'publications', name: 'Research and Publications', description: 'Papers, preprints or reproducible experiments.', category: 'problem-solution' },
  { id: 'skills', name: 'Technical Skills', description: 'Grouped by category: languages, tools, frameworks. No skill bars.', category: 'technology' },
  { id: 'opensource', name: 'Open Source and GitHub', description: 'Merged pull requests and public repos with documentation.', category: 'technology' },
  { id: 'coursework', name: 'Relevant Coursework', description: 'Subjects that match the role, listed briefly.', category: 'technology' },
  { id: 'achievements', name: 'Achievements and Contests', description: 'Ranks, hackathon wins, contest results with numbers.', category: 'business' },
  { id: 'certifications', name: 'Certifications', description: 'Only the ones related to the role.', category: 'business' },
  { id: 'leadership', name: 'Leadership and Clubs', description: 'Roles where you owned something and led people.', category: 'closing' },
  { id: 'extracurricular', name: 'Extra-curriculars', description: 'Sports, arts and volunteering, in one line.', category: 'closing' },
  { id: 'languages', name: 'Languages Known', description: 'Spoken languages, if relevant for the role.', category: 'closing' },
  { id: 'objective', name: 'Objective Statement', description: 'A long paragraph about seeking a challenging position. Dated.', category: 'intro' },
  { id: 'photo', name: 'Passport Photo', description: 'Not needed for most tech roles.', category: 'intro' },
  { id: 'personal-details', name: "Personal Details (Father's name, DOB)", description: 'Takes space and adds nothing for the recruiter.', category: 'closing' },
  { id: 'hobbies', name: 'Hobbies and Interests', description: 'Reading, music, travelling. Rarely helps.', category: 'closing' },
  { id: 'references', name: 'References Available on Request', description: 'Assumed by default.', category: 'closing' },
  { id: 'declaration', name: 'Declaration and Signature', description: 'An old-school ending that wastes a line.', category: 'closing' },
];

export const RESUME_SECTIONS = AVAILABLE_SLIDES;

/** Sections that waste space on a modern tech resume. */
const FILLER = ['objective', 'photo', 'personal-details', 'hobbies', 'references', 'declaration'];

export interface PitchDeckEvaluation {
  score: number;
  quality: 'Cluttered' | 'Decent' | 'Sharp' | 'Recruiter-Ready';
  archetype:
    | 'Project-First Resume'
    | 'Experience-Led Resume'
    | 'Research Resume'
    | 'Skills-Heavy Resume'
    | 'Balanced Resume'
    | 'Cluttered Resume';
  feedback: string[];
  subScores: {
    clarity: number; // Clarity and structure
    logicalFlow: number; // Order of sections
    storytelling: number; // Story: how well sections support each other
    techDepth: number; // Technical proof
    bizThinking: number; // Fit for a typical role
    persuasion: number; // Impact
  };
}

const clamp = (n: number) => Math.max(10, Math.min(100, Math.round(n)));

/**
 * Scores a resume layout. `slides` holds section ids in order, with "" for empty slots.
 */
export function evaluatePitchDeck(slides: string[]): PitchDeckEvaluation {
  const feedback: string[] = [];
  const s = slides.filter((x) => x !== '');

  if (s.length === 0) {
    return {
      score: 10,
      quality: 'Cluttered',
      archetype: 'Cluttered Resume',
      feedback: ['Resume is empty. Place sections into the layout to begin.'],
      subScores: { clarity: 10, logicalFlow: 10, storytelling: 10, techDepth: 10, bizThinking: 10, persuasion: 10 },
    };
  }

  const has = (id: string) => s.includes(id);
  const idx = (id: string) => s.indexOf(id);

  // ── Clarity: filler hurts, a lean resume helps
  let clarity = 70;
  const fillerHere = s.filter((x) => FILLER.includes(x));
  if (fillerHere.length > 0) {
    clarity -= fillerHere.length * 10;
    feedback.push(`Filler penalty: ${fillerHere.length} section(s) that recruiters skip (${fillerHere.join(', ')}). Use the space for proof.`);
  } else {
    feedback.push('No filler sections. Every line earns its place.');
  }
  if (has('header')) clarity += 8; else feedback.push('Missing header: recruiters need contact details at the very top.');
  if (has('links')) clarity += 6;
  if (s.length < 5) { clarity -= 10; feedback.push('Too thin: fewer than five sections leaves little to discuss.'); }

  // ── Flow: header first, projects before education, extras last
  let flow = 55;
  if (s[0] === 'header') { flow += 15; feedback.push('Header first: clean start for the 20-second scan.'); }
  else if (has('header')) { flow -= 10; feedback.push('Header is not first: the resume starts without a name.'); }
  if (has('projects') && has('education')) {
    if (idx('projects') < idx('education')) { flow += 15; feedback.push('Projects above education: your best proof sits in the top third.'); }
    else { flow -= 5; feedback.push('Education before projects: fine for strict-cutoff drives, but proof sits lower.'); }
  }
  if (has('skills') && has('projects') && idx('skills') < idx('projects')) { flow += 6; }
  if (has('achievements') && has('projects') && idx('achievements') > idx('projects')) { flow += 5; }
  const last = s[s.length - 1];
  if (['extracurricular', 'languages', 'leadership'].includes(last)) { flow += 8; feedback.push('Extras at the bottom: the right place for low-priority items.'); }
  if (FILLER.includes(s[0])) { flow -= 15; feedback.push(`Starting with "${s[0]}" wastes your prime space.`); }

  // ── Story: summary plus proof that backs it up
  let story = 40;
  if (has('summary')) story += 12;
  if (has('projects')) story += 18;
  if (has('experience')) story += 12;
  if (has('achievements')) story += 8;
  if (has('projects') && has('experience')) { story += 6; feedback.push('Projects plus experience: a believable growth story.'); }

  // ── Technical proof
  let tech = 35;
  if (has('projects')) tech += 22;
  if (has('skills')) tech += 10;
  if (has('opensource')) tech += 14;
  if (has('publications')) tech += 16;
  if (has('experience')) tech += 12;
  if (has('coursework')) tech += 3;
  if (!has('projects') && !has('experience')) feedback.push('No projects or experience: skills alone are claims, not proof.');

  // ── Role fit: a sensible number of useful sections
  const useful = s.filter((x) => !FILLER.includes(x)).length;
  let fit = 40 + useful * 7;
  if (useful > 8) fit -= 5;
  if (has('certifications')) fit += 3;
  if (has('skills') && has('projects')) fit += 8;

  // ── Impact
  let impact = 35;
  if (has('achievements')) impact += 20;
  if (has('experience')) impact += 14;
  if (has('leadership')) impact += 10;
  if (has('links')) impact += 8;
  if (has('publications')) impact += 10;
  if (has('opensource')) impact += 6;

  const sub = {
    clarity: clamp(clarity),
    logicalFlow: clamp(flow),
    storytelling: clamp(story),
    techDepth: clamp(tech),
    bizThinking: clamp(fit),
    persuasion: clamp(impact),
  };

  const score = clamp(
    sub.clarity * 0.2 + sub.logicalFlow * 0.2 + sub.storytelling * 0.15 + sub.techDepth * 0.2 + sub.bizThinking * 0.1 + sub.persuasion * 0.15
  );

  const quality: PitchDeckEvaluation['quality'] =
    score >= 85 ? 'Recruiter-Ready' : score >= 65 ? 'Sharp' : score >= 40 ? 'Decent' : 'Cluttered';

  let archetype: PitchDeckEvaluation['archetype'] = 'Balanced Resume';
  if (fillerHere.length >= 3) archetype = 'Cluttered Resume';
  else if (has('publications') && !has('experience')) archetype = 'Research Resume';
  else if (has('experience') && (!has('projects') || idx('experience') < idx('projects'))) archetype = 'Experience-Led Resume';
  else if (has('projects') && (!has('education') || idx('projects') < idx('education'))) archetype = 'Project-First Resume';
  else if (has('skills') && !has('projects') && !has('experience')) archetype = 'Skills-Heavy Resume';

  return { score, quality, archetype, feedback, subScores: sub };
}

/** Clearer alias for new code. */
export const evaluateResume = evaluatePitchDeck;
