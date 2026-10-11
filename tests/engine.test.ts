import { describe, it, expect } from 'vitest';
import { getGrade, weightedScore, judgeScore, clamp } from '@/lib/scoring';
import { applySeasonRules, deriveFeedback } from '@/lib/seasonRules';
import { evaluatePitchDeck } from '@/lib/pitchDeckEvaluator';
import { TECH_REGISTRY } from '@/data/techRegistry';
import { ARCHITECTURE_TEMPLATES } from '@/data/architectureTemplates';
import { PROBLEMS } from '@/data/problems';
import { MODIFIERS } from '@/data/modifiers';
import { JUDGES } from '@/data/judges';
import { getRecommendations } from '@/lib/recommendations';
import { generateUSPOptions, generateFeatureBacklog } from '@/lib/projectStrategyGenerator';

describe('scoring', () => {
  it('grades by threshold', () => {
    expect(getGrade(95)).toBe('S'); expect(getGrade(84)).toBe('A'); expect(getGrade(72)).toBe('B');
    expect(getGrade(60)).toBe('C'); expect(getGrade(48)).toBe('D'); expect(getGrade(10)).toBe('F');
  });
  it('weights sum correctly', () => {
    expect(weightedScore({ innovation: 80, execution: 60, design: 40, pitch: 20 }, { innovation: 0.25, execution: 0.25, design: 0.25, pitch: 0.25 })).toBe(50);
  });
  it('wildcard recruiter swing is injectable and bounded', () => {
    const scores = { innovation: 50, execution: 50, design: 50, pitch: 50, bonus: 0 };
    const w = { innovation: 0.25, execution: 0.25, design: 0.25, pitch: 0.25 };
    expect(judgeScore({ scores, weights: w, judgeId: 'judge-chaos', rng: () => 0 })).toBe(40);
    expect(judgeScore({ scores, weights: w, judgeId: 'judge-chaos', wildcard: 'fixed' })).toBe(55);
    expect(judgeScore({ scores, weights: w, judgeId: 'judge-builder' })).toBe(50);
    expect(judgeScore({ scores: { ...scores, bonus: 200 }, weights: w, judgeId: 'x' })).toBe(100);
    expect(judgeScore({ scores, weights: w, judgeId: 'x', strict: true })).toBe(43);
    expect(clamp(-5)).toBe(0);
  });
});

describe('season rules', () => {
  const base = { skillIds: new Set<string>(), track: 'web-app', edgeKey: null, strategyId: null, activityCount: 3, mentorHintsUsed: 0, scores: { innovation: 60, execution: 60, design: 60, pitch: 60, bonus: 0 } };
  it('penalises a missing basics skill under closed-book rule', () => {
    const r = applySeasonRules(['NO_AI_TOOLS'], base);
    expect(r.innovation).toBe(35); expect(r.execution).toBe(45);
    const ok = applySeasonRules(['NO_AI_TOOLS'], { ...base, skillIds: new Set(['reg-quant']) });
    expect(ok.innovation).toBe(60);
  });
  it('track-locked seasons penalise the wrong track', () => {
    expect(applySeasonRules(['WEB_ONLY'], { ...base, track: 'ai-solution' }).execution).toBe(35);
    expect(applySeasonRules(['WEB_ONLY'], base).execution).toBe(60);
  });
  it('every modifier id has copy and unknown ids are ignored', () => {
    expect(MODIFIERS.length).toBe(21);
    expect(applySeasonRules(['NOPE'], base)).toEqual({ ...base.scores });
  });
  it('feedback always returns two strengths and two weaknesses', () => {
    const f = deriveFeedback({ skillIds: new Set(), track: 'ai-solution', edgeKey: null, strategyId: null, activityCount: 9, mentorHintsUsed: 1, drive: PROBLEMS[0] });
    expect(f.strengths).toHaveLength(2); expect(f.weaknesses).toHaveLength(2);
  });
});

describe('resume evaluator', () => {
  it('rewards projects before education and punishes filler', () => {
    const good = evaluatePitchDeck(['header', 'links', 'projects', 'education', 'skills', 'experience', 'achievements', '']);
    const bad = evaluatePitchDeck(['photo', 'objective', 'hobbies', 'declaration', 'personal-details', '', '', '']);
    expect(good.score).toBeGreaterThan(bad.score);
    expect(bad.archetype).toBe('Cluttered Resume');
    expect(evaluatePitchDeck([]).score).toBe(10);
  });
});

describe('data integrity', () => {
  it('registry synergies and conflicts reference real skills', () => {
    const ids = new Set(TECH_REGISTRY.map((t) => t.id));
    TECH_REGISTRY.forEach((t) => { t.synergy.forEach((s) => expect(ids.has(s)).toBe(true)); t.conflicts.forEach((c) => expect(ids.has(c)).toBe(true)); });
  });
  it('every track has slots and every slot has at least one skill', () => {
    Object.values(ARCHITECTURE_TEMPLATES).forEach((tpl) => {
      expect(tpl.slots.length).toBeGreaterThan(5);
      tpl.slots.forEach((s) => {
        const fits = TECH_REGISTRY.some((t) => s.compatibleCategories.includes(t.category) && t.compatibleSolutions.includes(tpl.solutionId as any));
        expect(fits, `${tpl.solutionId}/${s.id}`).toBe(true);
      });
    });
  });
  it('recommendations only return valid skills for every track', () => {
    const ids = new Set(TECH_REGISTRY.map((t) => t.id));
    Object.keys(ARCHITECTURE_TEMPLATES).forEach((track) => getRecommendations(track, 'Specialist', 'product').techIds.forEach((id) => expect(ids.has(id)).toBe(true)));
  });
  it('has 18 drives and 5 recruiters with weights near 1', () => {
    expect(PROBLEMS).toHaveLength(18);
    expect(JUDGES).toHaveLength(5);
    JUDGES.forEach((j) => expect(Object.values(j.scoringWeights).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 5));
  });
  it('generators are deterministic and keep dependencies satisfied', () => {
    const a = generateUSPOptions(PROBLEMS[0], 'web-app', [], 'classic', 'seed');
    const b = generateUSPOptions(PROBLEMS[0], 'web-app', [], 'classic', 'seed');
    expect(a).toEqual(b); expect(a).toHaveLength(4);
    const feats = generateFeatureBacklog(PROBLEMS[0], 'web-app', a[0], [], 'seed');
    feats.forEach((f: any) => { if (f.dependsOn) expect(feats.some((x) => x.id === f.dependsOn)).toBe(true); });
  });
});
