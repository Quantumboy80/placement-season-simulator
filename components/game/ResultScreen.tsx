'use client';

/**
 * @file ResultScreen — Final results display
 * @description Animated score counter, category breakdowns with progress bars,
 * mock judge feedback cards, confetti-like decorative dots, and Play Again /
 * Share Results CTAs.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { RotateCcw, Share2, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import { generateRoadmap } from '@/lib/roadmapGenerator';
import { JUDGES } from '@/data/judges';
import { generateJudgeFeedback } from '@/data/judgeComments';
import { classifyProjectArchetype } from '@/lib/archetypes';
import { playWinTheme, playLoseTheme, playScoreChord } from '@/lib/sound';

// ─── Score categories ───────────────────────────────────────────────────────────

const CATEGORIES: { key: 'innovation' | 'execution' | 'design' | 'pitch'; label: string; color: string }[] = [
  { key: 'innovation', label: 'Skills', color: 'bg-neon-purple' },
  { key: 'execution', label: 'Projects', color: 'bg-neon-blue' },
  { key: 'design', label: 'Resume', color: 'bg-neon-pink' },
  { key: 'pitch', label: 'Communication', color: 'bg-neon-orange' },
];

// ─── Confetti dot generator ─────────────────────────────────────────────────────

function ConfettiDots() {
  // Generate a fixed set of floating dots on mount using useState
  const [dots] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 4,
      size: 3 + Math.random() * 5,
      color: ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'][
        i % 6
      ],
    }))
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            opacity: 0.4,
          }}
          initial={{ y: '110vh' }}
          animate={{ y: '-10vh' }}
          transition={{
            delay: dot.delay,
            duration: dot.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated counter hook ──────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1500): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function ResultScreen() {
  const {
    judgeFeedback,
    selectedProblem,
    solutionDirection,
    usp,
    techStack,
    features,
    businessModel,
    mentorHintsUsed,
    currentJudge,
    unlockedAchievements,
    chaosHistory,
    gameMode,
    difficulty,
    activeModifiers,
    score,
    resetGame,
    roastText,
    setRoastText,
    team,
    teamAdviceHistory,
    teamContributionLogs,
    teamTimeline,
    teammateDecisions,
  } = useGameStore();

  const [isPrdModalOpen, setIsPrdModalOpen] = useState(false);
  const [prdLoadingStep, setPrdLoadingStep] = useState(0);
  const [compiledPrd, setCompiledPrd] = useState("");
  const [prdCopied, setPrdCopied] = useState(false);

  const prdLogs = [
    "PREPARING PLACEMENT ROADMAP V1.0...",
    "EXTRACTING PLACEMENT PREP DECISIONS...",
    "ANALYZING PROJECT ARCHETYPE METRICS...",
    "RESOLVING TECHNOLOGY INTEGRATION LAYERS...",
    "INTEGRATING YOUR EDGE...",
    "ESTIMATING REVENUE TIER ECONOMICS...",
    "ASSESSING RISK & OPERATIONAL ROADMAP...",
    "GENERATING PRODUCT REQUIREMENTS BRIEF...",
    "ROADMAP SUCCESSFULLY CREATED."
  ];

  useEffect(() => {
    if (!isPrdModalOpen) return;

    setPrdLoadingStep(0);
    setCompiledPrd("");

    let apiResponseMarkdown = "";
    let ticksCompleted = false;

    // Trigger the server-side fetch immediately in the background
    fetch("/api/generate-roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        judgeFeedback,
        selectedProblem,
        solutionDirection,
        usp,
        techStack,
        features,
        businessModel,
        mentorHintsUsed,
        currentJudge,
        unlockedAchievements,
        chaosHistory,
        gameMode,
        difficulty,
        activeModifiers,
        score,
        grade,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        apiResponseMarkdown = data.markdown || "";
        if (ticksCompleted) {
          setCompiledPrd(apiResponseMarkdown);
          setPrdLoadingStep(prdLogs.length - 1);
        }
      })
      .catch((err) => {
        console.error(err);
        const localPrd = generateRoadmap({
          judgeFeedback,
          selectedProblem,
          solutionDirection,
          usp,
          techStack,
          features,
          businessModel,
          mentorHintsUsed,
          currentJudge,
          unlockedAchievements,
          chaosHistory,
          gameMode,
          difficulty,
          activeModifiers,
          score,
        } as any);
        apiResponseMarkdown = `> [!WARNING]\n> **AI_COMPILATION_ERROR // LOCAL FALLBACK ACTIVE:**\n> ${err.message || "Network offline"}\n\n${localPrd}`;
        if (ticksCompleted) {
          setCompiledPrd(apiResponseMarkdown);
          setPrdLoadingStep(prdLogs.length - 1);
        }
      });

    // Run the terminal animation tick sequence
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= prdLogs.length - 2) {
        clearInterval(interval);
        ticksCompleted = true;
        setPrdLoadingStep(prdLogs.length - 2);
        // Complete when the API is done
        if (apiResponseMarkdown !== "") {
          setCompiledPrd(apiResponseMarkdown);
          setPrdLoadingStep(prdLogs.length - 1);
        }
      } else {
        setPrdLoadingStep(currentStep);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [isPrdModalOpen]);

  const handleCopyPrd = () => {
    navigator.clipboard.writeText(compiledPrd).then(() => {
      setPrdCopied(true);
      setTimeout(() => setPrdCopied(false), 1500);
    });
  };

  const handleDownloadPrd = () => {
    const roadmapName = selectedProblem?.title.split(" ")[0] || "Nova";
    const blob = new Blob([compiledPrd], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${roadmapName}_prep_roadmap.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const feedback = judgeFeedback.find(fb => fb.judgeId === currentJudge?.id) || judgeFeedback[judgeFeedback.length - 1];
  const finalScore100 = feedback?.score || 0;

  const getGrade = (score: number) => {
    if (score >= 94) return "S";
    if (score >= 84) return "A";
    if (score >= 72) return "B";
    if (score >= 60) return "C";
    if (score >= 48) return "D";
    return "F";
  };
  const grade = getGrade(finalScore100);
  const allMale = team.length > 0 && team.every((t) => t.gender === 'male');

  useEffect(() => {
    if (!feedback) return;
    const projectGrade = getGrade(feedback.score);
    if (projectGrade === "S" || projectGrade === "A") {
      playWinTheme();
    } else if (projectGrade === "D" || projectGrade === "F") {
      playLoseTheme();
    } else {
      playScoreChord();
    }
  }, [feedback]);

  const archetype = classifyProjectArchetype({
    techStack,
    features,
    usp,
    businessModel,
    solutionDirection,
  });

  const [aiRoast, setAiRoast] = useState<string>("");
  const [loadingRoast, setLoadingRoast] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedProblem || !currentJudge) return;

    if (roastText) {
      setAiRoast(roastText);
      setLoadingRoast(false);
      return;
    }

    setLoadingRoast(true);
    setAiRoast("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800); // Strict 2.8s client-side timeout!

    fetch("/api/generate-roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        problemStatement: selectedProblem.description,
        solutionDirection: solutionDirection,
        techStack: techStack.map(t => t.name),
        usp: usp,
        businessModel: businessModel,
        mustHaveFeatures: features.map(f => f.name),
        judge: currentJudge.name,
        judgePersonality: currentJudge.personality,
        archetype: archetype.name,
        grade: grade,
        score: finalScore100,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.roast) {
          setAiRoast(data.roast);
          setRoastText(data.roast);
        } else {
          setAiRoast(feedback?.comment || "A decent profile with solid groundwork.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch AI roast:", err);
        setAiRoast(feedback?.comment || "A decent profile with solid groundwork.");
      })
      .finally(() => {
        setLoadingRoast(false);
        clearTimeout(timeoutId);
      });
  }, [selectedProblem, currentJudge, solutionDirection, techStack, usp, businessModel, features, archetype.name, grade, finalScore100, roastText, setRoastText, feedback]);

  // ─── Typed feedback entry ─────────────────────────────────────────────────────
  interface FeedbackEntry {
    judgeId: string;
    name: string;
    avatar: string;
    avatarImage?: string;
    score: number;
    comment: string;
    highlight: string;
    isLead: boolean;
  }

  // Resolve the 3-judge panel for display
  const displayFeedbacks = (() => {
    if (!judgeFeedback || judgeFeedback.length === 0) return [];
    
    // Find the lead feedback
    const leadFb = judgeFeedback.find(fb => fb.judgeId === currentJudge?.id) || judgeFeedback[judgeFeedback.length - 1];
    if (!leadFb) return [];

    const leadJudgeProfile = JUDGES.find(j => j.id === leadFb.judgeId) || currentJudge || JUDGES[0];

    const results: FeedbackEntry[] = [{
      judgeId: leadFb.judgeId,
      name: leadJudgeProfile.name,
      avatar: leadJudgeProfile.avatar,
      avatarImage: leadJudgeProfile.avatarImage,
      score: leadFb.score,
      comment: loadingRoast ? "⏱️ DRAWING DYNAMIC JURY FEEDBACK CRITIQUE..." : (aiRoast || leadFb.comment),
      highlight: leadFb.highlight,
      isLead: true,
    }];
    
    // Get other feedbacks from the store
    const othersInStore = judgeFeedback.filter(fb => fb.judgeId !== leadFb.judgeId);
    
    if (othersInStore.length >= 2) {
      othersInStore.slice(0, 2).forEach(fb => {
        const jProfile = JUDGES.find(j => j.id === fb.judgeId);
        if (jProfile) {
          results.push({
            judgeId: fb.judgeId,
            name: jProfile.name,
            avatar: jProfile.avatar,
            avatarImage: jProfile.avatarImage,
            score: fb.score,
            comment: fb.comment,
            highlight: fb.highlight,
            isLead: false,
          });
        }
      });
    } else {
      // Fallback: Dynamically generate feedbacks for two other judges if missing
      const usedIds = new Set(results.map(r => r.judgeId));
      const remainingJudges = JUDGES.filter(j => !usedIds.has(j.id));
      
      remainingJudges.slice(0, 2).forEach(j => {
        const finalInnovation = score.innovation || 20;
        const finalExecution = score.execution || 20;
        const finalDesign = score.design || 20;
        const finalPitch = score.pitch || 20;
        
        let weightedScore =
          finalInnovation * j.scoringWeights.innovation +
          finalExecution * j.scoringWeights.execution +
          finalDesign * j.scoringWeights.design +
          finalPitch * j.scoringWeights.pitch;
          
        if (j.id === "judge-chaos") {
          weightedScore += 5;
        }
        
        const judgeScore = Math.max(0, Math.min(Math.round(weightedScore + (score.bonus || 0)), 100));
        
        const fbResult = generateJudgeFeedback(j.id, judgeScore, {
          techStack,
          features,
          usp,
          businessModel,
          problem: selectedProblem,
          solutionDirection,
          generatedBusinessModels: useGameStore.getState().generatedBusinessModels,
          generatedAdvisorAdvice: useGameStore.getState().generatedAdvisorAdvice,
        });
        
        results.push({
          judgeId: j.id,
          name: j.name,
          avatar: j.avatar,
          avatarImage: j.avatarImage,
          score: judgeScore,
          comment: fbResult.comment,
          highlight: fbResult.highlight || "Valid architectural execution.",
          isLead: false,
        });
      });
    }
    
    return results;
  })();



  const renderFormattedText = (text: string) => {
    if (!text) return "";
    const parts = text.split("**");
    return parts.map((part, i) => {
      const isBold = i % 2 === 1;
      if (part.includes("`")) {
        const codeParts = part.split("`");
        const mapped = codeParts.map((cp, j) => {
          if (j % 2 === 1) {
            return <code key={j} className="bg-neutral-200 border border-neutral-300 px-1 py-0.5 rounded text-neutral-800 font-mono text-[9px]">{cp}</code>;
          }
          return cp;
        });
        return isBold ? <strong key={i} className="font-bold text-neutral-900">{mapped}</strong> : <span key={i}>{mapped}</span>;
      }
      return isBold ? <strong key={i} className="font-bold text-neutral-900">{part}</strong> : <span key={i}>{part}</span>;
    });
  };

  const showPrdSection = (grade === "S" || grade === "A" || grade === "B") && finalScore100 >= 72;

  const displayTotal = useCountUp(score.total);

  return (
    <div className="relative flex h-full flex-col items-center gap-10 overflow-y-auto px-4 py-12">
      {/* Confetti overlay */}
      <ConfettiDots />

      {/* Hero total score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-2"
      >
        <Sparkles className="h-8 w-8 text-neon-cyan" />
        <h1 className="text-glow-cyan text-5xl font-extrabold tracking-tight text-neon-cyan sm:text-7xl">
          {displayTotal}
        </h1>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Total Score
        </p>
      </motion.div>

      {/* Score breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="glass-card z-10 w-full max-w-md space-y-4 p-6"
      >
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Score Breakdown
        </h2>

        {CATEGORIES.map(({ key, label, color }) => {
          const val = score[key];
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{label}</span>
                <span className="font-mono text-sm font-semibold text-foreground">
                  {val}
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className={cn('absolute inset-y-0 left-0 rounded-full', color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}

        {/* Bonus row */}
        {score.bonus > 0 && (
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-sm text-muted-foreground">Bonus</span>
            <Badge className="bg-neon-green/15 text-neon-green ring-1 ring-neon-green/30 font-mono">
              +{score.bonus}
            </Badge>
          </div>
        )}
      </motion.div>

      {/* Judge feedback cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="z-10 w-full max-w-2xl space-y-4"
      >
        <h2 className="text-center text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Judge Feedback
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {displayFeedbacks.map((fb, i) => (
            <motion.div
              key={fb.judgeId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
              className={cn(
                "glass-card flex flex-col gap-3 p-4 relative transition-all duration-300",
                fb.isLead && "glass-card-strong border-neon-purple ring-1 ring-neon-purple/20 glow-purple"
              )}
            >
              {/* Lead Judge Badge Indicator */}
              {fb.isLead && (
                <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[8px] font-bold bg-neon-purple/20 text-neon-purple px-1 py-0.5 rounded uppercase tracking-wider select-none">
                  👑 LEAD
                </div>
              )}

              {/* Judge header */}
              <div className="flex items-center gap-2.5 pr-10">
                {/* Avatar photo or emoji fallback */}
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
                  {fb.avatarImage ? (
                    <Image
                      src={fb.avatarImage}
                      alt={fb.name}
                      fill
                      className="object-cover object-top"
                      sizes="40px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5 text-lg">
                      {fb.avatar}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground leading-tight">{fb.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Score: {fb.score}
                  </p>
                </div>
              </div>

              {/* Comment */}
              <div className="flex items-start gap-1.5">
                <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {fb.comment}
                </p>
              </div>

              {/* Highlight */}
              <Badge
                variant="secondary"
                className="w-fit text-[10px] mt-auto"
              >
                ✨ {fb.highlight}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Performance Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.5 }}
        className="z-10 w-full max-w-2xl bg-card border border-neutral-350 rounded-lg p-6 space-y-4 text-left font-mono text-xs select-none"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-250 pb-2">
          <div>
            <h3 className="text-sm font-black uppercase text-neutral-900">👥 Crew Contribution Ledger</h3>
            <span className="text-[8px] text-neutral-400 uppercase">Individual Performance Ledger</span>
          </div>
          <div className={`text-[9px] px-2 py-0.5 rounded font-bold ${
            allMale ? "bg-red-50 text-red-650 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-250"
          }`}>
            {allMale ? "⚠ Team Diversity Warning: Your team may be missing perspectives." : "✓ Diverse Team Assembled."}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {team.length === 0 ? (
            <p className="text-neutral-400 text-[10px] italic">No active teammates assembled for this project.</p>
          ) : (
            team.map((t) => {
              return (
                <div key={t.id} className="p-3 border border-neutral-300 rounded bg-white space-y-2 font-sans font-light text-neutral-600">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5 font-mono text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                      <span className="text-base font-normal">{t.avatar}</span>
                      <span>{t.name} ({t.role})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] border-b border-dashed border-neutral-200 pb-2">
                    <div>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-450 block">Innovation:</span>
                      <span className={t.contribution.innovation > 0 ? "text-purple-600 font-bold" : t.contribution.innovation < 0 ? "text-red-650 font-bold" : ""}>
                        {t.contribution.innovation > 0 ? `+${t.contribution.innovation}` : t.contribution.innovation} pts
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-450 block">Execution:</span>
                      <span className={t.contribution.execution > 0 ? "text-blue-600 font-bold" : t.contribution.execution < 0 ? "text-red-650 font-bold" : ""}>
                        {t.contribution.execution > 0 ? `+${t.contribution.execution}` : t.contribution.execution} pts
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-450 block">Design:</span>
                      <span className={t.contribution.design > 0 ? "text-pink-600 font-bold" : t.contribution.design < 0 ? "text-red-650 font-bold" : ""}>
                        {t.contribution.design > 0 ? `+${t.contribution.design}` : t.contribution.design} pts
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-450 block">Pitch:</span>
                      <span className={t.contribution.pitch > 0 ? "text-orange-650 font-bold" : t.contribution.pitch < 0 ? "text-red-650 font-bold" : ""}>
                        {t.contribution.pitch > 0 ? `+${t.contribution.pitch}` : t.contribution.pitch} pts
                      </span>
                    </div>
                  </div>

                  {(() => {
                    const teammateHistory = teamAdviceHistory ? teamAdviceHistory.filter((h) => h.teammateId === t.id) : [];
                    if (teammateHistory.length > 0) {
                      return (
                        <div className="mt-2 space-y-1.5 border-t border-neutral-100 pt-2 font-mono text-[9px]">
                          <span className="text-[8px] text-neutral-450 uppercase tracking-wider block">Decision History:</span>
                          {teammateHistory.map((h, idx) => {
                            const statusColor = h.status === 'applied' ? 'text-emerald-700' : 'text-red-650';
                            const statusLabel = h.status === 'applied' ? 'Applied' : 'Rejected';
                            const modsList = h.modifiers ? Object.entries(h.modifiers)
                              .filter(([_, val]) => val !== 0)
                              .map(([stat, val]) => `${stat}: ${val > 0 ? `+${val}` : val}`)
                              .join(', ') : '';
                            
                            return (
                              <div key={idx} className="flex flex-col gap-0.5 leading-tight">
                                <div className="flex justify-between">
                                  <span className="text-neutral-800 font-semibold">{h.title}</span>
                                  <span className={`font-bold uppercase ${statusColor}`}>{statusLabel}</span>
                                </div>
                                {modsList && (
                                  <span className="text-neutral-450">
                                    Effect: {modsList}.
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    return (
                      <p className="text-[9px] text-neutral-500 font-mono italic">
                        {t.helpTokenUsed 
                          ? "💡 Contributed strategic suggestions and feedback during placement prep."
                          : "💤 Remained passive during build milestones without using advice token."
                        }
                      </p>
                    );
                  })()}
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Team Contributions Accepted Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="z-10 w-full max-w-2xl bg-card border border-neutral-350 rounded-lg p-6 space-y-4 text-left font-mono text-xs select-none"
      >
        <div className="border-b border-neutral-250 pb-2">
          <h3 className="text-sm font-black uppercase text-neutral-900">👥 TEAM CONTRIBUTIONS</h3>
          <span className="text-[8px] text-neutral-400 uppercase">Accepted teammate interventions.</span>
        </div>

        <div className="space-y-3">
          {(() => {
            const appliedHistory = teamAdviceHistory ? teamAdviceHistory.filter(h => h.status === 'applied') : [];
            if (appliedHistory.length === 0) {
              return (
                <p className="text-neutral-400 text-[10px] italic">No teammate interventions were applied to the project.</p>
              );
            }

            return appliedHistory.map((h, idx) => {
              const teammate = team.find(t => t.id === h.teammateId);
              const name = teammate ? teammate.name : "Teammate";
              return (
                <div key={idx} className="p-3 border border-neutral-300 rounded bg-white font-mono text-xs leading-normal">
                  <div className="font-bold text-neutral-900 uppercase">{name}</div>
                  <div className="text-[10px] text-neutral-600 mt-1">{h.title}</div>
                </div>
              );
            });
          })()}
        </div>
      </motion.div>

      {/* Team Decisions & Ownership ledger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.82, duration: 0.5 }}
        className="z-10 w-full max-w-2xl bg-card border border-neutral-350 rounded-lg p-6 space-y-4 text-left font-mono text-xs select-none"
      >
        <div className="border-b border-neutral-250 pb-2">
          <h3 className="text-sm font-black uppercase text-neutral-900">👥 TEAM DECISIONS & OWNERSHIP</h3>
          <span className="text-[8px] text-neutral-400 uppercase">Ledger of accepted and rejected teammate recommendations.</span>
        </div>

        <div className="space-y-3">
          {!teammateDecisions || teammateDecisions.length === 0 ? (
            <p className="text-neutral-400 text-[10px] italic font-sans font-light">No teammate recommendations were evaluated.</p>
          ) : (
            teammateDecisions.map((dec, idx) => {
              const isAccepted = dec.status === 'accepted';
              return (
                <div key={idx} className="p-3 border border-neutral-300 rounded bg-white space-y-1.5 font-sans font-light text-neutral-600">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5 font-mono text-xs">
                    <span className="font-bold text-neon-purple">{dec.teammateName}</span>
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase",
                      isAccepted ? "bg-emerald-50 border-emerald-250 text-emerald-700" : "bg-red-50 border-red-200 text-red-650"
                    )}>
                      {isAccepted ? "ACCEPTED" : "REJECTED"}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-700 font-mono">
                    <span className="font-bold text-neutral-450 block uppercase text-[8px] tracking-wider">Recommendation:</span>
                    <span className="block mt-0.5">{dec.recommendation}</span>
                  </div>
                  {dec.resultingChanges && (
                    <div className="text-[10px] text-neutral-600 font-mono border-t border-dashed border-neutral-200 pt-1.5 mt-1.5">
                      <span className="font-bold text-neutral-450 block uppercase text-[8px] tracking-wider">Resulting Changes:</span>
                      <span className="block mt-0.5">{dec.resultingChanges}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Team Timeline ledger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
        className="z-10 w-full max-w-2xl bg-card border border-neutral-350 rounded-lg p-6 space-y-4 text-left font-mono text-xs select-none"
      >
        <div className="border-b border-neutral-250 pb-2">
          <h3 className="text-sm font-black uppercase text-neutral-900">👥 TEAM TIMELINE</h3>
          <span className="text-[8px] text-neutral-400 uppercase">Chronological team events and debates.</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {!teamTimeline || teamTimeline.length === 0 ? (
            <p className="text-neutral-400 text-[10px] italic">No significant team events were recorded.</p>
          ) : (
            teamTimeline.map((item, idx) => (
              <div key={idx} className="p-2.5 border border-neutral-300 rounded bg-white flex items-start gap-3">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-500 font-mono whitespace-nowrap">
                  {item.time}
                </span>
                <p className="text-[10px] text-neutral-700 leading-normal font-sans">
                  {item.event}
                </p>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Personal Prep Roadmap Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className={`z-10 w-full max-w-2xl bg-white space-y-4 shadow-sm select-none relative overflow-hidden text-left transition-all duration-300 ${
          showPrdSection ? "border-2 border-double border-neutral-900" : "border border-dashed border-neutral-300 opacity-80"
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
          <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">PREP_ACCELERATION_GATES</span>
          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
            showPrdSection ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-500"
          }`}>
            {showPrdSection ? "VENTURE QUALIFIED" : "🔒 LOCKED"}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className={`text-sm font-black uppercase flex items-center gap-1.5 ${showPrdSection ? "text-neutral-900" : "text-neutral-400"}`}>
            {showPrdSection ? "🚀 You Have a Shot at a Top Offer" : "🔒 Personal Prep Roadmap"}
          </h3>
          <p className="text-[11px] text-neutral-600 font-sans font-light leading-relaxed">
            {showPrdSection 
              ? "The panel sees real potential. Generate a personalised 4-week prep roadmap from your weakest areas and choices."
              : "Get a grade B or above to unlock your personalised prep roadmap."
            }
          </p>
        </div>

        <Button
          onClick={() => {
            if (!showPrdSection) return;
            setIsPrdModalOpen(true);
          }}
          disabled={!showPrdSection}
          className={`w-full font-mono text-xs h-9 border focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none focus:outline-none ${
            showPrdSection 
              ? "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800 cursor-pointer" 
              : "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
          }`}
        >
          {showPrdSection ? "DOWNLOAD PREP ROADMAP" : "DOWNLOAD PREP ROADMAP (LOCKED)"}
        </Button>
      </motion.div>

      {/* Personal Prep Roadmap Overlay Modal */}
      {isPrdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in select-none">
          <div className="w-full max-w-3xl bg-white border-2 border-neutral-900 rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] p-5 sm:p-6 flex flex-col gap-4 overflow-hidden relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-neutral-450">PREP_ROADMAP_GENERATOR</span>
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  prdLoadingStep === prdLogs.length - 1 ? "bg-emerald-600 text-white" : "bg-neutral-900 text-white animate-pulse"
                }`}>
                  {prdLoadingStep === prdLogs.length - 1 ? "READY" : "GENERATING"}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsPrdModalOpen(false);
                }}
                className="text-neutral-400 hover:text-neutral-900 font-mono text-xs font-bold cursor-pointer transition-colors focus:outline-none"
              >
                [ESC_CLOSE]
              </button>
            </div>

            {/* Title */}
            <div className="text-left space-y-1">
              <h2 className="text-xl font-black uppercase text-neutral-900">
                Personal Prep Roadmap
              </h2>
              <p className="text-[10px] text-muted-foreground font-mono">
                Decisions ledger parsed into product requirements parameters.
              </p>
            </div>

            {/* Main Area */}
            <div className="flex-1 overflow-hidden min-h-[350px] flex flex-col">
              {prdLoadingStep < prdLogs.length - 1 ? (
                /* Sequential Compilation Logs View */
                <div className="flex-1 flex flex-col justify-center gap-4">
                  <div className="text-center font-mono text-xs text-neutral-500 uppercase tracking-widest animate-pulse mb-2">
                    GENERATING ROADMAP...
                  </div>
                  
                  <div className="bg-neutral-950 p-4 rounded font-mono text-[10px] text-neutral-100 min-h-[180px] flex flex-col justify-between shadow-inner">
                    <div className="space-y-1 text-left">
                        {prdLogs.slice(0, prdLoadingStep + 1).map((log, i) => (
                          <div key={i} className={log.includes("SUCCESSFUL") || log.includes("CREATED") ? "text-emerald-400 font-bold" : "text-neutral-300"}>
                            {i === prdLoadingStep ? (
                              <span className="typewriter-cursor">
                                {`> [SYSTEM] ${log}`}
                              </span>
                            ) : (
                              `> [SYSTEM] ${log}`
                            )}
                          </div>
                        ))}
                    </div>
                    <div className="w-full bg-neutral-800 h-1 rounded overflow-hidden mt-3">
                      <div 
                        className="bg-neutral-100 h-full transition-all duration-300" 
                        style={{ width: `${(prdLoadingStep / (prdLogs.length - 1)) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* PRD Compiled Document View */
                <div className="flex-1 overflow-hidden flex flex-col gap-4">
                  <div className="flex-1 border border-neutral-300 p-5 bg-stone-50 rounded text-left overflow-y-auto font-sans text-xs text-neutral-855 space-y-3.5 leading-relaxed select-text shadow-inner max-h-[45vh]">
                    {compiledPrd.split("\n").map((line, idx) => {
                      if (line.startsWith("# ")) {
                        return <h1 key={idx} className="text-base font-black text-neutral-900 border-b-2 border-neutral-950 pb-1 mt-5 first:mt-0 font-mono tracking-tight uppercase">{line.replace("# ", "")}</h1>;
                      }
                      if (line.startsWith("## ")) {
                        return <h2 key={idx} className="text-xs font-bold text-neutral-900 border-b border-dashed border-neutral-300 pb-0.5 mt-4 uppercase tracking-wider font-mono">{line.replace("## ", "")}</h2>;
                      }
                      if (line.startsWith("### ")) {
                        return <h3 key={idx} className="text-xs font-bold text-neutral-850 mt-3.5 uppercase font-mono">{line.replace("### ", "")}</h3>;
                      }
                      if (line.startsWith("* **") || line.startsWith("- **")) {
                        const prefix = line.startsWith("* **") ? "* **" : "- **";
                        const clean = line.replace(prefix, "").split("**: ");
                        return (
                          <div key={idx} className="flex gap-2 pl-3">
                            <span className="text-neutral-400 font-mono text-[9px] mt-0.5">•</span>
                            <span>
                              <strong className="text-neutral-900 font-mono text-[10px] uppercase font-bold">{clean[0]}</strong>
                              {clean[1] ? ": " : ""}
                              {clean[1] ? renderFormattedText(clean[1]) : ""}
                            </span>
                          </div>
                        );
                      }
                      if (line.startsWith("* ") || line.startsWith("- ")) {
                        const prefix = line.startsWith("* ") ? "* " : "- ";
                        return (
                          <div key={idx} className="flex gap-2 pl-3">
                            <span className="text-neutral-400 font-mono text-[9px] mt-0.5">•</span>
                            <span>{renderFormattedText(line.replace(prefix, ""))}</span>
                          </div>
                        );
                      }
                      if (line.startsWith("> [!")) {
                        const isNote = line.includes("NOTE");
                        return (
                          <div key={idx} className={`p-3 border-l-2 rounded-r font-mono text-[9px] my-2 ${
                            isNote ? "bg-neutral-50 border-neutral-900 text-neutral-800" : "bg-amber-50 border-amber-500 text-amber-900"
                          }`}>
                            <span className="font-bold uppercase block mb-1">
                              {isNote ? "💡 ORGANIZER NOTE:" : "⚠️ WARNING:"}
                            </span>
                            {renderFormattedText(compiledPrd.split("\n")[idx + 1]?.replace("> ", "") || "")}
                          </div>
                        );
                      }
                      if (line.startsWith("> ")) {
                        if (compiledPrd.split("\n")[idx - 1]?.startsWith("> [!")) return null;
                        return <blockquote key={idx} className="p-2 border-l-2 border-neutral-900 pl-3 italic text-neutral-600 bg-neutral-50/50 font-serif my-2">{renderFormattedText(line.replace("> ", ""))}</blockquote>;
                      }
                      if (line.trim() === "") return null;
                      return <p key={idx} className="font-sans text-[11px] leading-relaxed text-neutral-700">{renderFormattedText(line)}</p>;
                    })}
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-3 gap-2 border-t border-neutral-200 pt-3">
                    <Button
                      onClick={handleCopyPrd}
                      variant="outline"
                      className="font-mono text-[10px] h-9 border border-neutral-900 cursor-pointer focus:outline-none"
                    >
                      {prdCopied ? "[COPIED TO CLIPBOARD]" : "COPY MARKDOWN"}
                    </Button>
                    <Button
                      onClick={handleDownloadPrd}
                      variant="outline"
                      className="font-mono text-[10px] h-9 border border-neutral-900 cursor-pointer focus:outline-none"
                    >
                      DOWNLOAD ROADMAP
                    </Button>
                    <Button
                      onClick={() => {
                        setIsPrdModalOpen(false);
                      }}
                      className="font-mono text-[10px] h-9 bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-900 cursor-pointer focus:outline-none"
                    >
                      CLOSE GENERATOR
                    </Button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="z-10 flex flex-wrap items-center justify-center gap-3"
      >
        <Link href="/" onClick={resetGame}>
          <Button
            className="gap-2 bg-neon-blue/90 px-5 text-sm font-semibold text-white hover:bg-neon-blue"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </Button>
        </Link>

        {/* TODO: Implement share functionality (clipboard / social) */}
        <Button
          variant="outline"
          className="gap-2 px-5 text-sm"
          onClick={() => {
            /** Placeholder — share results */
          }}
        >
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>
      </motion.div>
    </div>
  );
}
