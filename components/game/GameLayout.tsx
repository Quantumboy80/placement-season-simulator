'use client';

/**
 * @file GameLayout — Main game layout wrapper
 * @description Full-screen container with grid-pattern overlay, top header bar
 * (logo, phase stepper, timer), scrollable content area with AnimatePresence,
 * and a bottom status bar showing the current score.
 */

import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/store/gameStore';
import GameTimer from './GameTimer';
import type { GamePhase } from '@/types/game';
import { playMutedClick } from '@/lib/sound';

// ─── Phase metadata ─────────────────────────────────────────────────────────────

/** Human-readable labels & order for the stepper */
const PHASES: { key: GamePhase; label: string }[] = [
  { key: 'LOBBY', label: 'Lobby' },
  { key: 'PROBLEM_REVEAL', label: 'Problem' },
  { key: 'TECH_STACK', label: 'Tech Stack' },
  { key: 'FEATURE_PRIORITY', label: 'Features' },
  { key: 'BUILDING', label: 'Building' },
  { key: 'JUDGING', label: 'Judging' },
  { key: 'RESULTS', label: 'Results' },
];

// ─── Props ──────────────────────────────────────────────────────────────────────

interface GameLayoutProps {
  children: ReactNode;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function GameLayout({ children }: GameLayoutProps) {
  const phase = useGameStore((s) => s.phase);
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const totalTime = useGameStore((s) => s.totalTime);
  const score = useGameStore((s) => s.score);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);

  const currentIndex = PHASES.findIndex((p) => p.key === phase);

  return (
    <div 
      className="animated-gradient-bg grid-pattern relative flex h-screen flex-col overflow-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      {/* ── Top Header Bar ─────────────────────────────────────────────── */}
      <header className="glass-card-strong relative z-20 flex items-center justify-between mx-4 mt-3 mb-1 rounded-lg border px-4 py-2 sm:px-6 md:mx-6 md:mt-4 md:mb-2 md:px-6 xl:mx-0 xl:mt-0 xl:mb-0 xl:rounded-none xl:border-x-0 xl:border-t-0 xl:px-6">
        {/* Left — Logo */}
        <Link 
          href="/"
          onClick={() => {
            playMutedClick();
          }}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 group-hover:border-neutral-300 group-hover:bg-neutral-50 transition-all duration-150">
            <Terminal className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-black tracking-tight text-neutral-900 sm:block group-hover:text-neutral-700 transition-colors duration-150">
            PLACEMENT SIM
          </span>
        </Link>

        {/* Center — Phase Stepper */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Game phase">
          {PHASES.map((p, i) => {
            const isCurrent = p.key === phase;
            const isCompleted = i < currentIndex;

            return (
              <div key={p.key} className="flex items-center">
                {i > 0 && (
                  <div
                    className={`mx-1 h-px w-4 transition-colors ${
                      isCompleted ? 'bg-neutral-800/40' : 'bg-neutral-200'
                    }`}
                  />
                )}

                <Badge
                  variant={isCurrent ? 'default' : 'secondary'}
                  className={
                    isCurrent
                      ? 'bg-neutral-900 text-neutral-100 border border-neutral-900 ring-1 ring-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900'
                      : isCompleted
                        ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        : 'opacity-40 bg-transparent text-neutral-400 border border-transparent'
                  }
                >
                  {p.label}
                </Badge>
              </div>
            );
          })}
        </nav>

        {/* Center fallback for mobile — horizontal scroll chips */}
        <div className="md:hidden flex-1 overflow-x-auto mx-2 flex items-center gap-1.5 scroll-smooth py-1 no-scrollbar select-none" aria-label="Game phase mobile">
          {PHASES.map((p, i) => {
            const isCurrent = p.key === phase;
            const isCompleted = i < currentIndex;

            return (
              <div key={p.key} className="flex items-center shrink-0">
                {i > 0 && (
                  <div
                    className={`mx-1 h-px w-2 transition-colors ${
                      isCompleted ? 'bg-neutral-800/40' : 'bg-neutral-200'
                    }`}
                  />
                )}
                <Badge
                  variant={isCurrent ? 'default' : 'secondary'}
                  className={`whitespace-nowrap text-[9px] py-0.5 px-2 font-bold transition-all duration-150 ${
                    isCurrent
                      ? 'bg-neutral-900 text-neutral-100 border border-neutral-900 ring-1 ring-neutral-900'
                      : isCompleted
                        ? 'bg-neutral-100 text-neutral-600 border border-neutral-200 opacity-60'
                        : 'opacity-30 bg-transparent text-neutral-400 border border-transparent'
                  }`}
                >
                  {p.label}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Right — Timer & Volume */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              toggleSound();
              playMutedClick();
            }}
            className="flex items-center justify-center p-1.5 rounded hover:bg-neutral-100 border border-transparent hover:border-neutral-200 transition-colors focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none"
            aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
            title={soundEnabled ? "Mute audio" : "Unmute audio"}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-neutral-800" />
            ) : (
              <VolumeX className="h-4 w-4 text-neutral-400 animate-pulse" />
            )}
          </button>
          {totalTime > 0 ? (
            <GameTimer
              timeRemaining={timeRemaining}
              totalTime={totalTime}
              size="sm"
            />
          ) : null}
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Bottom Status Bar ──────────────────────────────────────────── */}
      <footer className="glass-card-strong relative z-20 flex items-center justify-between rounded-none border-x-0 border-b-0 px-4 py-1.5 sm:px-6">
        <span className="text-xs text-muted-foreground">
          Phase {currentIndex + 1} / {PHASES.length}
        </span>
      </footer>
    </div>
  );
}
