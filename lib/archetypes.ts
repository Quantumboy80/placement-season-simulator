/**
 * @file Candidate archetype classifier
 *
 * Classifies a completed run into one of six candidate archetypes from the
 * size of the skill stack, the prep plan, the chosen edge and strategy.
 * Radar stat keys are internal: techDepth = skill depth, businessAcuteness =
 * strategy sense, designFinesse = profile polish, shippingScrappiness = prep intensity.
 *
 * @module lib/archetypes
 */

import type { TechItem, Feature } from "@/types/game";

export interface ArchetypeResult {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  colorClass: string;
  radarStats: {
    techDepth: number;
    businessAcuteness: number;
    designFinesse: number;
    shippingScrappiness: number;
  };
}

export function classifyProjectArchetype(params: {
  techStack: TechItem[];
  features: Feature[];
  usp: string | null;
  businessModel: string | null;
  solutionDirection: string | null;
}): ArchetypeResult {
  const { techStack, features, usp, businessModel } = params;
  const stackCount = techStack.length;
  const activityCount = features.length;
  const u = (usp || "").toLowerCase();

  // 1. THE OVER-PREPARER: spread across too many skills and activities
  if (stackCount >= 8 || activityCount >= 7) {
    return {
      id: "overengineer",
      name: "The Over-Preparer",
      subtitle: "Spread Thin Across Everything",
      description:
        "You tried to prepare for everything. Your skill list is long and your plan is packed, but depth is thin in each area. Interviewers go three questions deep and find the floor. Pick fewer things and master them.",
      colorClass: "border-neutral-900 bg-neutral-100 text-neutral-900",
      radarStats: { techDepth: 55, businessAcuteness: 30, designFinesse: 50, shippingScrappiness: 90 },
    };
  }

  // 2. THE FOCUSED SPECIALIST: small, sharp plan
  if (activityCount <= 3 && stackCount <= 5) {
    return {
      id: "minimalist",
      name: "The Focused Specialist",
      subtitle: "A Small Plan, Done Well",
      description:
        "A lean skill stack and a short plan you can actually finish. You did not chase every trend, and your answers will go deeper than most. The risk is gaps outside your lane, so keep one safety net.",
      colorClass: "border-neutral-900 bg-white text-neutral-900",
      radarStats: { techDepth: 80, businessAcuteness: 60, designFinesse: 70, shippingScrappiness: 55 },
    };
  }

  // 3. THE STEADY GRINDER: consistency edge
  if (u.includes("grinder") || u.includes("consisten")) {
    return {
      id: "hacker",
      name: "The Steady Grinder",
      subtitle: "Small Steps, Every Day",
      description:
        "You bet on showing up daily. Your preparation is reliable and your test performance will be too. Add visible proof like a project or a mock interview recording so your resume matches your effort.",
      colorClass: "border-amber-900 bg-amber-50 text-amber-900",
      radarStats: { techDepth: 65, businessAcuteness: 45, designFinesse: 40, shippingScrappiness: 95 },
    };
  }

  // 4. THE STRATEGIST: network or a layered application strategy
  if (u.includes("connector") || u.includes("network") || businessModel === "biz-model-2" || businessModel === "biz-model-3") {
    return {
      id: "hustler",
      name: "The Strategist",
      subtitle: "Plays the Whole Season",
      description:
        "You think about the season as a system: which companies, in what order, with which fallback. That planning skill is rare among freshers. Make sure your fundamentals are strong enough to convert the interviews you earn.",
      colorClass: "border-emerald-900 bg-emerald-50 text-emerald-900",
      radarStats: { techDepth: 50, businessAcuteness: 92, designFinesse: 65, shippingScrappiness: 70 },
    };
  }

  // 5. THE RESEARCHER: specialist or research edge
  if (u.includes("specialist") || u.includes("research")) {
    return {
      id: "visionary",
      name: "The Researcher",
      subtitle: "Depth Over Breadth",
      description:
        "You go deep and ask why before how. That makes you a great fit for ML, core R&D and higher studies, and it gives you excellent stories in interviews. For mass-hiring drives, practise speed and basics too.",
      colorClass: "border-blue-900 bg-blue-50 text-blue-900",
      radarStats: { techDepth: 90, businessAcuteness: 60, designFinesse: 70, shippingScrappiness: 50 },
    };
  }

  // 6. THE BALANCED CANDIDATE (default)
  return {
    id: "builder",
    name: "The Balanced Candidate",
    subtitle: "Reliable Across the Board",
    description:
      "No glaring weakness and no single standout. You cover skills, projects, resume and communication reasonably well. To move up a tier, pick one area and go noticeably deeper than your peers.",
    colorClass: "border-stone-900 bg-stone-50 text-stone-950",
    radarStats: { techDepth: 72, businessAcuteness: 70, designFinesse: 70, shippingScrappiness: 72 },
  };
}
