/**
 * @file Squad roles
 *
 * Maps role names (what the player sees) to the internal role categories the
 * squad advice engine uses. Categories are unchanged from the original game:
 *   backend   = DSA / Core CS / Embedded buddies
 *   frontend  = Projects buddy
 *   designer  = Resume and portfolio reviewer
 *   strategist= Placement mentor (a senior who got placed)
 *   pitch     = Mock interview partner
 *   ai        = Data and ML buddy
 */

export type RoleCategory =
  | 'backend'
  | 'designer'
  | 'frontend'
  | 'strategist'
  | 'ai'
  | 'pitch'
  | 'researcher'
  | 'chaiwala'
  | 'general';

export const ROLE_PRESETS = [
  'DSA and Coding Buddy',
  'Core CS Buddy',
  'Projects Buddy',
  'Resume Reviewer',
  'Placement Mentor (Senior)',
  'Mock Interview Partner',
  'Data and ML Buddy',
  'Research Buddy',
  'Chaiwala',
] as const;

export function getRoleCategory(role: string | null | undefined): RoleCategory {
  const r = (role || '').toLowerCase();
  if (r.includes('chai')) return 'chaiwala';
  if (r.includes('data') || r.includes('ml') || /\bai\b/.test(r)) return 'ai';
  if (r.includes('resume') || r.includes('portfolio') || r.includes('profile')) return 'designer';
  if (r.includes('project') || r.includes('web') || r.includes('build')) return 'frontend';
  if (r.includes('dsa') || r.includes('coding') || r.includes('core') || r.includes('embedded') || r.includes('aptitude')) return 'backend';
  if (r.includes('mentor') || r.includes('senior') || r.includes('referral') || r.includes('placement') || r.includes('strategist')) return 'strategist';
  if (r.includes('interview') || r.includes('communication') || r.includes('hr') || r.includes('gd')) return 'pitch';
  if (r.includes('research')) return 'researcher';
  return 'general';
}

/** Stages in which a role proactively gives advice. */
export function isRoleRelevantForStage(role: string | null, stage: string): boolean {
  if (!role) return false;
  switch (getRoleCategory(role)) {
    case 'backend':
    case 'ai':
      return ['techStack', 'features'].includes(stage);
    case 'frontend':
      return ['techStack', 'features', 'pitchDeck'].includes(stage);
    case 'designer':
      return ['usp', 'pitchDeck', 'features'].includes(stage);
    case 'strategist':
      return ['businessModel', 'usp', 'mentor'].includes(stage);
    case 'pitch':
      return ['pitchPrep', 'pitchDeck'].includes(stage);
    case 'researcher':
      return ['problemReveal', 'solutionDirection'].includes(stage);
    case 'chaiwala':
      return ['techStack', 'features', 'mentor', 'businessModel', 'pitchPrep'].includes(stage);
    default:
      return false;
  }
}
