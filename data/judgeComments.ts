/**
 * @file Recruiter feedback generator (data/judgeComments.ts)
 *
 * Produces a short written verdict in each recruiter's voice, based on the
 * player's score and what they actually chose. Fully deterministic for a given
 * input, so the same run always reads the same way.
 *
 * Recruiter ids are stable internal keys (see data/judges.ts):
 *   judge-builder  Ananya Rao, IT services hiring lead
 *   judge-founder  Rohan Mehta, startup founder
 *   judge-design   Ishita Sen, resume screener
 *   judge-investor Karthik Iyer, big-tech interviewer
 *   judge-chaos    Prof. Dutta, placement cell head (wildcard)
 *
 * @module data/judgeComments
 */

import type { TechItem, Feature, Problem } from '@/types/game';
import { toRegistryId } from '@/data/techRegistry';

export interface ContextState {
  techStack: TechItem[];
  features: Feature[];
  usp: string | null;
  businessModel: string | null;
  problem: Problem | null;
  solutionDirection: string | null;
  pitchDeck?: string[];
  pitchDeckScore?: number;
  deckNarrativeQuality?: string;
  deckArchetype?: string;
  generatedBusinessModels?: any[];
  generatedAdvisorAdvice?: any[];
}

export interface CommentResult {
  comment: string;
  highlight: string;
}

type Tier = 'great' | 'good' | 'mixed' | 'poor';

const tierOf = (score: number): Tier => (score >= 85 ? 'great' : score >= 70 ? 'good' : score >= 55 ? 'mixed' : 'poor');

function seededPick<T>(arr: T[], seed: string): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return arr[Math.abs(h) % arr.length];
}

const DSA = ['reg-arrays-strings', 'reg-sorting-search', 'reg-heaps-hashing', 'reg-recursion-bt', 'reg-trees-graphs', 'reg-dp', 'reg-cp', 'reg-leetcode-habit'];
const CORE = ['reg-os', 'reg-dbms', 'reg-cn', 'reg-oop'];
const COMM = ['reg-gd', 'reg-hr-prep', 'reg-explain-projects', 'reg-mock-interviews', 'reg-english'];
const PROOF = ['reg-github-portfolio', 'reg-internship', 'reg-research-paper', 'reg-opensource', 'reg-hackathon-wins'];

function generateJudgeFeedbackInternal(judgeId: string, score: number, state: ContextState): CommentResult {
  const ids = new Set(state.techStack.map((t) => toRegistryId(t.id)));
  const any = (list: string[]) => list.some((i) => ids.has(i));
  const tier = tierOf(score);
  const drive = state.problem?.title.split(':')[0] || 'this role';
  const seed = `${judgeId}-${state.problem?.id ?? 'x'}-${tier}-${state.techStack.length}-${state.features.length}`;
  const resumeScore = state.pitchDeckScore ?? 0;
  const deck = (state.pitchDeck || []).filter(Boolean);
  const applied = (state.generatedAdvisorAdvice || []).filter((a) => a.status === 'applied').length;
  const rejected = (state.generatedAdvisorAdvice || []).filter((a) => a.status === 'rejected').length;
  const coachability =
    applied > rejected ? 'You listened to your seniors, which tells me you are coachable.'
    : rejected > applied ? 'You turned down most of the advice you were given. Be sure you are right about that.'
    : '';

  let comment = '';
  let highlight = '';

  switch (judgeId) {
    // ── Ananya Rao: IT services hiring lead (fundamentals, communication, reliability)
    case 'judge-builder': {
      const opener = {
        great: `I would shortlist you for ${drive} right now.`,
        good: `A solid profile for ${drive}. I can see where you would fit.`,
        mixed: `There is potential for ${drive}, but I am not convinced yet.`,
        poor: `I cannot recommend this profile for ${drive} as it stands.`,
      }[tier];
      const body = any(CORE) && any(COMM)
        ? 'You show fundamentals and the ability to explain them, which is exactly what we hire for.'
        : any(COMM)
        ? 'Your communication practice is visible, but I did not see enough core subject depth.'
        : any(CORE)
        ? 'Your core subjects look fine, but I could not see how you explain them under pressure.'
        : 'I could not find core subject depth or communication practice, and those are my first two filters.';
      const close = seededPick([
        'Keep your answers short and structured.',
        'A little more consistency in practice will go a long way.',
        'Prepare two clear stories for the HR round.',
      ], seed);
      comment = `${opener} ${body} ${coachability} ${close}`;
      highlight = any(COMM) ? 'Communication practice is a real asset.' : any(CORE) ? 'Core fundamentals are in place.' : 'Basics are the next thing to build.';
      break;
    }

    // ── Rohan Mehta: startup founder (shipped work, ownership)
    case 'judge-founder': {
      const opener = {
        great: `If you cracked the take-home for ${drive} like you planned this season, I would hire you tomorrow.`,
        good: `Good energy. I would give you a trial on ${drive}.`,
        mixed: `I like the effort, but I need to see more things you have shipped.`,
        poor: `I do not see anything you have built that I can open and use.`,
      }[tier];
      const body = any(PROOF)
        ? 'You have public proof of work, and that is the first thing I check.'
        : 'No portfolio, no internship and no open-source work. Claims without proof do not move me.';
      const extra = state.features.length > 5
        ? 'Your plan lists too many activities. I want focus, not a wishlist.'
        : 'Your plan looks realistic, and I like people who finish what they start.';
      comment = `${opener} ${body} ${extra} ${coachability}`;
      highlight = any(PROOF) ? 'Proof of work you can open.' : 'Ownership is the gap to close.';
      break;
    }

    // ── Ishita Sen: recruiter and resume screener
    case 'judge-design': {
      const arch = state.deckArchetype || 'resume';
      const opener = {
        great: `Your resume survived my 20-second scan. That is rare.`,
        good: `Your resume is solid. I got what I needed quickly.`,
        mixed: `Your resume is average. It does not stand out in a stack of 300.`,
        poor: `Your resume would not get past my first pass.`,
      }[tier];
      const filler = deck.filter((d) => ['objective', 'photo', 'personal-details', 'hobbies', 'references', 'declaration'].includes(d));
      const body = filler.length > 0
        ? `You spent space on ${filler.length} filler section(s). Replace them with proof.`
        : 'No filler sections, which tells me you know what recruiters skip.';
      const layout = resumeScore >= 70
        ? `The ${arch.toLowerCase()} layout works.`
        : `The ${arch.toLowerCase()} layout could be tighter: lead with projects and keep it to one page.`;
      comment = `${opener} ${body} ${layout}`;
      highlight = filler.length === 0 ? 'Clean resume with no filler.' : 'Trim filler sections to let proof breathe.';
      break;
    }

    // ── Karthik Iyer: big-tech interviewer (DSA, problem solving)
    case 'judge-investor': {
      const opener = {
        great: `Strong. You would clear my coding rounds for ${drive}.`,
        good: `Decent problem solving. I would take you to the next round.`,
        mixed: `You can code, but I would push hard on optimisation and I am not sure you would hold up.`,
        poor: `I do not see enough problem-solving practice to put you in front of my panel.`,
      }[tier];
      const body = any(DSA)
        ? any(['reg-trees-graphs', 'reg-dp'])
          ? 'Trees, graphs and DP show you have gone past the basics.'
          : 'Your DSA basics are there, but I need to see harder patterns.'
        : 'No DSA practice at all in your stack. That is an immediate no for my round.';
      const close = any(['reg-mock-interviews']) ? 'Your mock interviews will help you think aloud, which I grade.' : 'Practise thinking aloud. Silence reads as stuck.';
      comment = `${opener} ${body} ${close}`;
      highlight = any(['reg-trees-graphs', 'reg-dp']) ? 'Advanced DSA patterns covered.' : any(DSA) ? 'DSA basics covered.' : 'DSA is the gap to close first.';
      break;
    }

    // ── Prof. Dutta: placement cell head (fundamentals, discipline, attitude; unpredictable)
    case 'judge-chaos':
    default: {
      const opener = {
        great: `In all my years in the placement cell, a profile like this makes my job easy.`,
        good: `Reasonable. You prepared with discipline, and I respect that.`,
        mixed: `Hmm. Some good things, some worrying things. I would like to see more consistency.`,
        poor: `Beta, this will not do. Sit down and let us fix your preparation first.`,
      }[tier];
      const body = any(CORE)
        ? 'Your core subjects are in place, which is where I always begin.'
        : 'Where are the core subjects? Every company still asks them.';
      const attitude = state.features.length >= 2 && state.features.length <= 5
        ? 'Your plan is sensible and I like your discipline.'
        : 'Plan better. Panic is not a strategy.';
      comment = `${opener} ${body} ${attitude} ${coachability}`;
      highlight = any(CORE) ? 'Solid fundamentals.' : 'Fundamentals first, always.';
      break;
    }
  }

  return {
    comment: comment.replace(/\s+/g, ' ').replace(/!/g, '.').trim(),
    highlight: highlight.replace(/!/g, '.'),
  };
}

export function generateJudgeFeedback(judgeId: string, score: number, state: ContextState): CommentResult {
  return generateJudgeFeedbackInternal(judgeId, score, state);
}
