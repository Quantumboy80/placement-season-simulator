/**
 * @file Season events (data/chaosEvents.ts)
 *
 * Ten unpredictable moments that can hit mid-season: test crashes, mentor
 * cancellations, lucky referrals and surprise interview questions. Event ids
 * and categories are stable internal keys. `team-pivot-idea` choice 0 is the
 * "Plan B Master" achievement trigger.
 *
 * @module data/chaosEvents
 */

import type { ChaosEvent } from "@/types/game";

export const CHAOS_EVENTS: ChaosEvent[] = [
  {
    id: "tech-api-rate",
    title: "Online Test Server Crash",
    description: "The assessment platform froze in the middle of your timed test. The clock is still running and your answers may not be saved.",
    category: "technical",
    weight: 10,
    choices: [
      {
        label: "Stay Calm and Retry",
        description: "Refresh, log back in and finish what you can with the time left.",
        effectText: "Improves execution, costs some confidence, adds build time.",
        modifiers: { execution: 15, innovation: -10, timeOffset: 30 },
      },
      {
        label: "Email Support With Screenshots",
        description: "Document the crash and ask for a re-attempt while you keep solving offline.",
        effectText: "Shows maturity and may earn a retest, but consumes time.",
        modifiers: { innovation: 15, execution: -10, timeOffset: -45 },
      },
    ],
  },
  {
    id: "tech-db-crash",
    title: "Laptop Dies Before Mock Interview",
    description: "Your laptop shut down an hour before a mock interview. Your notes and half-finished coding problems are on it.",
    category: "technical",
    weight: 10,
    choices: [
      {
        label: "Switch to Pen and Paper",
        description: "Do the mock on paper and fix the laptop later.",
        effectText: "Keeps momentum, loses some polish, small time boost.",
        modifiers: { execution: 12, design: -8, timeOffset: 15 },
      },
      {
        label: "Borrow a Friend's Laptop",
        description: "Set up quickly and keep the plan exactly as scheduled.",
        effectText: "Protects the plan, costs setup time.",
        modifiers: { innovation: 8, execution: 6, timeOffset: -20 },
      },
    ],
  },
  {
    id: "team-coffee-spill",
    title: "Chai Spilled on Your Notes",
    description: "Your hand-written core subject notes just got soaked, a day before the written test.",
    category: "team",
    weight: 10,
    choices: [
      {
        label: "Rewrite the Key Pages",
        description: "Spend an hour rewriting the high-value pages from memory. It doubles as revision.",
        effectText: "Strong revision, uses time.",
        modifiers: { execution: 10, design: -4, timeOffset: -30 },
      },
      {
        label: "Switch to a Friend's Notes",
        description: "Borrow clean notes and use the saved hour for practice problems.",
        effectText: "Saves time, slightly shallower recall.",
        modifiers: { execution: 6, pitch: 4, timeOffset: 20 },
      },
    ],
  },
  {
    id: "team-disappeared",
    title: "Your Study Buddy Goes Silent",
    description: "Your study partner has not replied in two days. Your shared practice schedule is falling apart.",
    category: "team",
    weight: 8,
    choices: [
      {
        label: "Find a New Partner",
        description: "Post in the batch group and fix the schedule quickly.",
        effectText: "Rebuilds support, small time cost.",
        modifiers: { pitch: 8, execution: 4, timeOffset: -15 },
      },
      {
        label: "Go Solo",
        description: "Keep going alone and rely on discipline.",
        effectText: "Saves time but weakens your communication practice.",
        modifiers: { execution: 8, pitch: -8, timeOffset: 10 },
      },
    ],
  },
  {
    id: "team-pivot-idea",
    title: "Last-Minute Plan Pivot",
    description: "A senior says your target track is crowded this year, and suggests switching your focus to a related one.",
    category: "team",
    weight: 8,
    choices: [
      {
        label: "Pivot Now",
        description: "Adjust your preparation toward the new track right away.",
        effectText: "High risk, high reward. Raises innovation, lowers stability.",
        modifiers: { innovation: 15, execution: -12, timeOffset: -30 },
      },
      {
        label: "Stay the Course",
        description: "Thank them and keep your original plan.",
        effectText: "Keeps stability, misses a possible upside.",
        modifiers: { execution: 8, innovation: -4 },
      },
    ],
  },
  {
    id: "team-mentor-unavail",
    title: "Your Mentor Cancels",
    description: "The senior who agreed to review your resume and run a mock is stuck with their own offer process.",
    category: "team",
    weight: 7,
    choices: [
      {
        label: "Self-Review With a Checklist",
        description: "Use a recruiter checklist and review it yourself.",
        effectText: "Teaches independence, slower improvement.",
        modifiers: { design: 6, execution: 6, timeOffset: -20 },
      },
      {
        label: "Ask Another Senior",
        description: "Message two more seniors and reschedule.",
        effectText: "Better feedback, uses time.",
        modifiers: { pitch: 8, design: 6, timeOffset: -35 },
      },
    ],
  },
  {
    id: "lucky-sponsor-api",
    title: "A Referral Appears",
    description: "An alumnus working at a company on your list offers to refer you if you send a resume today.",
    category: "lucky",
    weight: 6,
    choices: [
      {
        label: "Send a Tailored Resume",
        description: "Stop everything and tailor your resume for the role.",
        effectText: "Strong upside from the referral.",
        modifiers: { design: 10, pitch: 8, bonus: 5, timeOffset: -20 },
      },
      {
        label: "Send the Standard Resume",
        description: "Quick send, lower effort.",
        effectText: "Small gain, saves time.",
        modifiers: { design: 4, bonus: 2, timeOffset: 10 },
      },
    ],
  },
  {
    id: "lucky-coffee-delivery",
    title: "A Friend Shares a Question Bank",
    description: "A friend who got placed shares their notes, with real questions from last year's rounds.",
    category: "lucky",
    weight: 6,
    choices: [
      {
        label: "Study It Deeply",
        description: "Spend focused time on every question and the reasoning behind it.",
        effectText: "Big skill boost, uses time.",
        modifiers: { innovation: 12, execution: 6, timeOffset: -25 },
      },
      {
        label: "Skim the Highlights",
        description: "Scan the key patterns and move on.",
        effectText: "Small boost, keeps your schedule.",
        modifiers: { innovation: 6, timeOffset: 10 },
      },
    ],
  },
  {
    id: "judge-sustainability",
    title: "Panel Asks a Surprise Core Question",
    description: "In the interview, the panel asks about a subject you skipped. The question is outside your prepared topics.",
    category: "judge",
    weight: 8,
    choices: [
      {
        label: "Admit and Reason It Out",
        description: "Say you have not studied it deeply, then reason from first principles.",
        effectText: "Honesty plus reasoning earns respect.",
        modifiers: { pitch: 10, innovation: 4 },
      },
      {
        label: "Bluff Confidently",
        description: "Give a confident-sounding answer and hope it passes.",
        effectText: "Risky. May backfire badly.",
        modifiers: { pitch: -12, bonus: 6 },
      },
    ],
  },
  {
    id: "judge-pitch-cut",
    title: "Interview Slot Cut to 10 Minutes",
    description: "The panel is running late and your interview just shrank from 30 minutes to 10.",
    category: "judge",
    weight: 8,
    choices: [
      {
        label: "Lead With Your Best Project",
        description: "Open with your strongest project and a single clear result.",
        effectText: "A sharp, memorable interview.",
        modifiers: { pitch: 12, design: 4 },
      },
      {
        label: "Cover Everything Quickly",
        description: "Try to fit all your skills into 10 minutes.",
        effectText: "Rushed and shallow.",
        modifiers: { pitch: -8, innovation: 6 },
      },
    ],
  },
];

/** Selects a weighted random event, excluding ones already triggered. */
export function getRandomChaosEvent(excludeIds: string[] = []): ChaosEvent {
  const available = CHAOS_EVENTS.filter((e) => !excludeIds.includes(e.id));
  const pool = available.length > 0 ? available : CHAOS_EVENTS;

  const totalWeight = pool.reduce((acc, e) => acc + e.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const event of pool) {
    roll -= event.weight;
    if (roll <= 0) return event;
  }
  return pool[0];
}
