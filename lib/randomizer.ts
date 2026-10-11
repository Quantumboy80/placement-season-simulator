/**
 * @file Randomizer utilities for The Hackathon Simulator
 * @description Helper functions for introducing controlled randomness into
 * the game — from shuffling arrays to rolling for random events.
 */

import type { GameEvent, GamePhase } from '@/types/game';

// ─── Core Random Utilities (Fully Implemented) ─────────────────────────────────

/**
 * Pick a single random element from an array.
 *
 * @template T - Type of array elements
 * @param arr - Non-empty array to pick from
 * @returns A randomly selected element
 * @throws {Error} If the array is empty
 *
 * @example
 * ```ts
 * const winner = pickRandom(['Alice', 'Bob', 'Charlie']);
 * ```
 */
export function pickRandom<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error('Cannot pick from an empty array');
  }
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Shuffle an array in place using the Fisher-Yates algorithm.
 * Returns a new shuffled array — the original is not mutated.
 *
 * @template T - Type of array elements
 * @param arr - Array to shuffle
 * @returns A new array with elements in random order
 *
 * @example
 * ```ts
 * const deck = shuffle([1, 2, 3, 4, 5]);
 * ```
 */
export function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// ─── Game-Specific Random Functions (Stubbed) ───────────────────────────────────

/**
 * Determine whether a random event should trigger during the current phase.
 *
 * @param phase - The current game phase
 * @returns `true` if an event should fire, `false` otherwise
 *
 * TODO: Implement phase-aware probability curves:
 *   - BUILDING phase: highest event frequency (~30% per tick)
 *   - TECH_STACK / FEATURE_PRIORITY: moderate (~15%)
 *   - LOBBY / RESULTS: no random events
 *   - Scale probability based on how many events have already occurred
 *     (diminishing returns to prevent event spam)
 */
export function generateEventChance(phase: GamePhase): boolean {
  // Placeholder: 20% flat chance, no events in non-active phases
  const inactivePhases: GamePhase[] = ['LOBBY', 'RESULTS'];
  if (inactivePhases.includes(phase)) return false;

  return Math.random() < 0.2;
}

/**
 * Roll to determine whether a mentor appears with a hint.
 *
 * @returns `true` if a mentor hint should be shown
 *
 * TODO: Implement smart mentor logic:
 *   - Base probability: ~25% per phase transition
 *   - Increase probability if the player is struggling (low score trajectory)
 *   - Decrease if the player has already used many hints (diminishing returns)
 *   - Never show more than 2 hints in a single phase
 */
export function rollForMentor(): boolean {
  // Placeholder: flat 25% chance
  return Math.random() < 0.25;
}

/**
 * Generate a random game event with narrative flavor.
 *
 * @returns A randomly selected GameEvent
 *
 * TODO: Implement a proper event pool system:
 *   - Maintain separate pools for positive, negative, and neutral events
 *   - Weight selection toward neutral events (~50%), then positive (~30%), negative (~20%)
 *   - Track which events have already fired to avoid repeats
 *   - Some events should have prerequisites (e.g., "server crash" only if using backend tech)
 *   - Apply the event's `effect` to the actual game state
 */
export function getRandomEvent(): GameEvent {
  // Placeholder: return from a small inline pool
  const events: GameEvent[] = [
    { id: 'evt-chai', type: 'positive', title: 'Chai Break', description: 'A friend brings chai to your study table. You feel energised and focused.', effect: '+5 minutes to the clock' },
    { id: 'evt-wifi', type: 'negative', title: 'Wi-Fi Dropout', description: 'Hostel Wi-Fi goes down just as you start a mock test.', effect: '-3 minutes from the clock' },
    { id: 'evt-senior-visit', type: 'positive', title: 'Senior Drops In', description: 'A placed senior stops by and gives you a quick tip on the interview.', effect: '+10 to execution score' },
    { id: 'evt-overplan', type: 'negative', title: 'Plan Creep', description: 'Your prep plan has ballooned. Time to cut activities or pay the price.', effect: '-1 activity slot' },
    { id: 'evt-maggi', type: 'neutral', title: 'Maggi Night', description: 'The squad takes a well-deserved break over midnight Maggi.', effect: 'No mechanical effect. Just vibes' },
    { id: 'evt-question-bank', type: 'positive', title: 'Question Bank Shared', description: 'A batchmate shares a bank of real questions from last year.', effect: '+15 to innovation score' },
    { id: 'evt-schedule-clash', type: 'negative', title: 'Schedule Clash', description: 'Two drives land on the same day. You must choose one.', effect: '-5 minutes from the clock' },
  ];

  return pickRandom(events);
}
