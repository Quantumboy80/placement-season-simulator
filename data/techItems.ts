/**
 * @file Legacy tech pool (data/techItems.ts)
 *
 * Kept so older imports keep working. Everything is derived from the skill
 * registry now, so there is one source of truth. TECH_WEIGHTS maps the
 * registry weights to the old hidden-score names.
 */

import type { TechItem } from '@/types/game';
import { TECH_REGISTRY, toStoreId } from './techRegistry';

export const TECH_POOL: TechItem[] = TECH_REGISTRY.map((r) => ({
  id: toStoreId(r.id),
  name: r.name,
  icon: 'layers',
  category: r.category,
  difficulty: r.difficultyScore,
  synergies: r.synergy.map(toStoreId),
}));

export interface HiddenScoreWeights {
  innovation: number; // Skills
  feasibility: number; // Projects
  design: number; // Resume
  pitchPotential: number; // Communication
}

export const TECH_WEIGHTS: Record<string, HiddenScoreWeights> = Object.fromEntries(
  TECH_REGISTRY.map((r) => [
    toStoreId(r.id),
    {
      innovation: r.innovationWeight,
      feasibility: r.executionWeight,
      design: r.designWeight,
      pitchPotential: r.pitchWeight,
    },
  ])
);
