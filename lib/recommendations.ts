import { TECH_REGISTRY } from '../data/techRegistry';

export interface Recommendation {
  techIds: string[];
  why: string;
}

/** Core recommendation per career track (ids are skills from data/techRegistry.ts). */
const TRACK_BASE: Record<string, { ids: string[]; why: string }> = {
  'web-app': {
    ids: ['reg-trees-graphs', 'reg-os', 'reg-cpp', 'reg-explain-projects', 'reg-github-portfolio'],
    why: 'Product interviews reward strong DSA, one core CS subject you can defend, a language you know deeply and a project you can explain well.',
  },
  'mobile-app': {
    ids: ['reg-quant', 'reg-java', 'reg-dbms', 'reg-hr-prep', 'reg-arrays-strings'],
    why: 'Mass recruiters filter on aptitude and fundamentals first, then on communication. Cover tests, basic coding and the HR round.',
  },
  'ai-solution': {
    ids: ['reg-python', 'reg-stats', 'reg-sklearn', 'reg-explain-projects', 'reg-github-portfolio'],
    why: 'Data roles want statistics, Python and one project you can walk through end to end, with a public repo to prove it.',
  },
  'iot-product': {
    ids: ['reg-embedded-c', 'reg-c-lang', 'reg-protocols', 'reg-circuit-analysis', 'reg-explain-projects'],
    why: 'Core and firmware panels start from fundamentals. Embedded C, protocols and circuits come first, then a hands-on project you can explain.',
  },
  platform: {
    ids: ['reg-react', 'reg-node', 'reg-sql-db', 'reg-git', 'reg-github-portfolio'],
    why: 'Startups hire people who can ship. Pair a frontend and backend with a database, version control and a public portfolio.',
  },
  marketplace: {
    ids: ['reg-gate', 'reg-research-paper', 'reg-stats', 'reg-explain-projects', 'reg-python'],
    why: 'Higher studies depend on exam scores and research proof. Add one subject you can discuss deeply and communicate clearly.',
  },
};

/** Extra skills that match each edge. */
const EDGE_ADDS: Record<string, { ids: string[]; note: string }> = {
  Consistency: { ids: ['reg-leetcode-habit'], note: 'A daily practice habit is the heart of the consistency edge.' },
  'Self-Taught': { ids: ['reg-opensource', 'reg-github-portfolio'], note: 'Public work proves self-taught skills better than any certificate.' },
  Breadth: { ids: ['reg-quant', 'reg-hr-prep'], note: 'Breadth means no weak round, so cover aptitude and HR too.' },
  Specialist: { ids: ['reg-system-design', 'reg-dp'], note: 'Specialists need depth they can defend three levels down.' },
  'Research-Driven': { ids: ['reg-research-paper'], note: 'A paper or reproducible experiment is the proof for this edge.' },
  'Polished Profile': { ids: ['reg-linkedin', 'reg-internship'], note: 'Polish works best when the resume shows real experience.' },
  'Network-First': { ids: ['reg-referrals', 'reg-linkedin'], note: 'Referrals open doors. Skills still close the offer.' },
};

/** Extra skills that match each company type. */
const CATEGORY_ADDS: Record<string, string[]> = {
  'it-services': ['reg-quant', 'reg-english'],
  product: ['reg-system-design'],
  startup: ['reg-hackathon-wins'],
  'core-engg': ['reg-matlab', 'reg-power-controls'],
  'data-ai': ['reg-sql-analytics'],
  'govt-psu': ['reg-gate', 'reg-gd'],
  'bfsi-consulting': ['reg-domain-knowledge', 'reg-gd'],
};

/**
 * Returns 3 to 5 skill ids and an explanation of why they fit the chosen
 * career track, edge and (optionally) company type.
 */
export function getRecommendations(
  solutionDirection: string | null,
  usp: string | null,
  problemCategory?: string | null
): Recommendation {
  const track = TRACK_BASE[solutionDirection || 'web-app'] || TRACK_BASE['web-app'];
  const edge = usp ? EDGE_ADDS[usp] : undefined;
  const cat = problemCategory ? CATEGORY_ADDS[problemCategory] || [] : [];

  const valid = new Set(TECH_REGISTRY.map((t) => t.id));
  const merged = [...(edge?.ids || []), ...cat, ...track.ids].filter((id) => valid.has(id));
  const techIds = Array.from(new Set(merged)).slice(0, 5);

  const why = [track.why, edge?.note].filter(Boolean).join(' ');
  return { techIds, why };
}
