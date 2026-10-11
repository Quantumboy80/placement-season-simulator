'use client';

/**
 * @file JudgeWheel — Animated judge showcase / carousel
 * @description Displays all judges in a horizontal row with staggered entrance
 * animations. The active judge is highlighted with a purple glow and slight
 * elevation. Each card shows avatar portrait, name, title, expertise badges,
 * personality, and scoring-weight mini-bars.
 */

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { JUDGES } from '@/data/judges';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';

// ─── Personality color / label map ──────────────────────────────────────────────

const PERSONALITY_STYLE: Record<string, string> = {
  tough: 'bg-red-500/15 text-red-400 ring-red-400/30',
  encouraging: 'bg-neon-green/15 text-neon-green ring-neon-green/30',
  technical: 'bg-neon-blue/15 text-neon-blue ring-neon-blue/30',
  creative: 'bg-neon-purple/15 text-neon-purple ring-neon-purple/30',
};

// ─── Scoring weight labels ──────────────────────────────────────────────────────

const WEIGHT_LABELS: { key: keyof typeof JUDGES[0]['scoringWeights']; label: string; color: string }[] = [
  { key: 'innovation', label: 'Innovation', color: 'bg-neon-purple' },
  { key: 'execution', label: 'Execution', color: 'bg-neon-blue' },
  { key: 'design', label: 'Design', color: 'bg-neon-pink' },
  { key: 'pitch', label: 'Pitch', color: 'bg-neon-orange' },
];

// ─── Animation variants ─────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
};

// ─── Component ──────────────────────────────────────────────────────────────────

export default function JudgeWheel() {
  const currentJudge = useGameStore((s) => s.currentJudge);

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-10">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-glow-cyan text-xl font-bold tracking-tight sm:text-2xl">
          Meet the Judges
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each judge values different aspects of your hack.
        </p>
      </motion.div>

      {/* Judge cards — horizontal scroll on mobile */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-6xl gap-4 overflow-x-auto pb-4 sm:justify-center"
      >
        {JUDGES.map((judge) => {
          const isActive = currentJudge?.id === judge.id;

          return (
            <motion.div
              key={judge.id}
              variants={cardVariants}
              className={cn(
                'glass-card flex min-w-[200px] flex-col items-center gap-3 p-5 transition-all duration-300 flex-shrink-0',
                isActive && 'glass-card-strong glow-purple -translate-y-1 ring-1 ring-neon-purple/40',
              )}
            >
              {/* Avatar Portrait */}
              <div className={cn(
                'relative h-24 w-24 overflow-hidden rounded-full ring-2 transition-all duration-300',
                isActive ? 'ring-neon-purple shadow-[0_0_18px_rgba(139,92,246,0.5)]' : 'ring-white/10'
              )}>
                {judge.avatarImage ? (
                  <Image
                    src={judge.avatarImage}
                    alt={judge.name}
                    fill
                    className="object-cover object-top"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5 text-4xl">
                    {judge.avatar}
                  </div>
                )}
              </div>

              {/* Active indicator crown */}
              {isActive && (
                <span className="text-xs font-bold text-neon-purple uppercase tracking-widest font-mono">
                  ★ Selected
                </span>
              )}

              {/* Name & Title */}
              <div className="text-center">
                <h3 className="text-sm font-bold text-foreground">{judge.name}</h3>
                <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                  {judge.title}
                </p>
              </div>

              {/* Personality badge */}
              <Badge
                className={cn(
                  'ring-1 text-[10px] capitalize',
                  PERSONALITY_STYLE[judge.personality],
                )}
              >
                {judge.personality}
              </Badge>

              {/* Expertise tags */}
              <div className="flex flex-wrap justify-center gap-1">
                {judge.expertise.slice(0, 3).map((e) => (
                  <Badge
                    key={e}
                    variant="secondary"
                    className="text-[10px] opacity-70"
                  >
                    {e}
                  </Badge>
                ))}
              </div>

              {/* Scoring weights — mini progress bars */}
              <div className="mt-auto w-full space-y-1.5 pt-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Scoring Weights
                </span>
                {WEIGHT_LABELS.map(({ key, label, color }) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-16 text-[10px] text-muted-foreground">
                      {label}
                    </span>
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className={cn('absolute inset-y-0 left-0 rounded-full', color)}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${judge.scoringWeights[key] * 100}%`,
                        }}
                        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="w-7 text-right font-mono text-[10px] text-muted-foreground">
                      {Math.round(judge.scoringWeights[key] * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Selected Judge Spotlight — shows below the roulette when a judge is picked */}
      <AnimatePresence mode="wait">
        {currentJudge && (
          <motion.div
            key={currentJudge.id}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex w-full max-w-sm items-center gap-5 glass-card-strong glow-purple rounded-2xl px-6 py-4 ring-1 ring-neon-purple/30"
          >
            {/* Big portrait */}
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-neon-purple shadow-[0_0_20px_rgba(139,92,246,0.45)]">
              {currentJudge.avatarImage ? (
                <Image
                  src={currentJudge.avatarImage}
                  alt={currentJudge.name}
                  fill
                  className="object-cover object-top"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/5 text-3xl">
                  {currentJudge.avatar}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neon-purple">
                Your Judge
              </span>
              <p className="text-base font-bold text-foreground leading-tight">
                {currentJudge.name}
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {currentJudge.title}
              </p>
              <Badge
                className={cn(
                  'w-fit ring-1 text-[10px] capitalize mt-1',
                  PERSONALITY_STYLE[currentJudge.personality],
                )}
              >
                {currentJudge.personality}
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
