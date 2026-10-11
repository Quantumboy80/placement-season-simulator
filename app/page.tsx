"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Terminal,
  Clock,
  ChevronRight,
  Code2,
  Cpu,
  Layers,
  Shield,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/gameStore";
import { playMutedClick, playSubtleHover } from "@/lib/sound";
import { PROBLEMS } from "@/data/problems";
import { JUDGES } from "@/data/judges";
import { TECH_POOL } from "@/data/techItems";

/** Stagger animation container variant */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Fade-up animation for children */
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function LandingPage() {
  const router = useRouter();
  const resetGame = useGameStore((s) => s.resetGame);
  const setGameMode = useGameStore((s) => s.setGameMode);

  const [isLocal, setIsLocal] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLocal(
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      );
    }
  }, []);

  const handleLaunch = () => {
    playMutedClick();
    resetGame();
    setGameMode("classic");
    router.push("/game");
  };

  const handleDebugSkip = () => {
    playMutedClick();
    
    // Pick a random problem
    const randomProblem = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    
    // Choose Node.js and Next.js from tech pool, or mock them
    const nextTech = TECH_POOL.find(t => t.id === 'tech-next') || {
      id: 'tech-next',
      name: 'Next.js',
      icon: 'layers',
      category: 'frontend',
      difficulty: 2,
      synergies: ['tech-vercel', 'tech-supabase', 'tech-openai'],
    };
    
    const nodeTech = TECH_POOL.find(t => t.id === 'tech-node') || {
      id: 'tech-node',
      name: 'Node.js',
      icon: 'server',
      category: 'backend',
      difficulty: 2,
      synergies: ['tech-react', 'tech-mongodb', 'tech-docker'],
    };

    const vercelTech = TECH_POOL.find(t => t.id === 'tech-vercel') || {
      id: 'tech-vercel',
      name: 'Vercel',
      icon: 'cloud',
      category: 'devops',
      difficulty: 1,
      synergies: ['tech-next', 'tech-react'],
    };

    const postgresTech = TECH_POOL.find(t => t.id === 'tech-postgres') || {
      id: 'tech-postgres',
      name: 'PostgreSQL',
      icon: 'database',
      category: 'database',
      difficulty: 3,
      synergies: ['tech-fastapi', 'tech-supabase', 'tech-aws'],
    };

    const mockTechStack = [nextTech, nodeTech, vercelTech, postgresTech] as any[];

    // Pick a judge
    const mockJudge = JUDGES[0] || {
      id: 'judge-builder',
      name: 'Ananya Rao',
      avatar: '🔥',
      title: 'Campus Hiring Lead, IT Services',
      personality: 'technical',
    };

    // Features
    const mockFeatures = [
      {
        id: 'feat-1',
        name: 'Core Adaptation Engine',
        description: 'Dynamically adapts user experience in real-time based on tracking parameters.',
        effort: 'high',
        impact: 'high',
      },
      {
        id: 'feat-2',
        name: 'Real-Time Telemetry Dashboard',
        description: 'Sleek visual representation of the prototype pipeline outputs.',
        effort: 'medium',
        impact: 'high',
      },
      {
        id: 'feat-3',
        name: 'Offline-First Sandbox Cache',
        description: 'Saves full workspace logic inside the client cache.',
        effort: 'low',
        impact: 'medium',
      }
    ] as any[];

    // Update the Zustand store using setState
    useGameStore.setState({
      stage: 'results',
      phase: 'RESULTS',
      isGameStarted: true,
      isGameOver: true,
      isTimerPaused: true,
      selectedProblem: randomProblem,
      solutionDirection: `We built a web application powered by a Next.js frontend combined with a robust Node.js server to solve the core challenges of ${randomProblem.title}.`,
      techStack: mockTechStack,
      usp: 'Ultra-low latency real-time telemetry rendering with automated sandboxed isolation.',
      features: mockFeatures,
      mentorName: 'Dr. Priya Kapoor',
      businessModel: 'SaaS monthly subscriptions with flexible tiered enterprise pricing.',
      pitchText: `Our product solves the core problems of ${randomProblem.title} by using Next.js for high-fidelity interactive client routing, coupled with Node.js on the backend. This allows instantaneous response tracking and complete runtime isolation.`,
      score: {
        innovation: 23,
        execution: 24,
        design: 21,
        pitch: 22,
        bonus: 5,
        total: 95
      },
      currentJudge: mockJudge as any,
      judgeFeedback: [
        {
          judgeId: mockJudge.id,
          score: 95,
          comment: `Superb execution! The Next.js and Node.js synergy is beautifully justified here, and the architecture is remarkably clean and scalable.`,
          highlight: 'Outstanding code quality, modern layout aesthetics, and clear monetization workflows.'
        }
      ],
      chaosHistory: ['api-rate-limit-resolved', 'database-crash-survived'],
      difficulty: 'easy',
      gameMode: 'classic',
      activeModifiers: []
    });

    router.push("/game");
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#fafaf8] text-neutral-900 font-mono text-xs">
      <div className="absolute inset-0 grid-pattern pointer-events-none z-0 opacity-[0.4]" />

      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 border-b border-neutral-200 bg-[#fafaf8]/50 backdrop-blur-xs select-none">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group">
          <div className="p-2 rounded bg-neutral-100 border border-neutral-200 text-neutral-800 group-hover:border-neutral-300 transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-sans font-bold text-sm tracking-tight text-neutral-900">
            PLACEMENT SEASON <span className="text-neutral-500 font-normal">SIMULATOR</span>
          </span>
        </Link>
        <div>
          <span className="text-[10px] text-neutral-400 font-mono tracking-wider font-bold">
            v2.4.0//STABLE_BUILD
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-md:py-2 py-4 max-w-4xl mx-auto w-full max-md:space-y-4 space-y-6">
        
        {/* Core Elevator Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-neutral-200 bg-[#f4f4f2] text-neutral-600 text-[9px] font-bold tracking-wider uppercase select-none">
              <Trophy className="w-3 h-3 text-neutral-600" />
              A DECISION-DRIVEN SIMULATION GAME
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-4xl font-black font-sans tracking-tight text-neutral-900 uppercase leading-none"
          >
            BUILD. SHIP. <span className="text-neutral-500 font-light">SURVIVE.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-[13px] text-neutral-500 font-sans font-light leading-relaxed max-w-xl mx-auto"
          >
            Experience a complete campus placement journey from drive announcement to final interview. 
            Build your project under time pressure, collaborate with AI-powered teammates, 
            survive mentor reviews, create a pitch deck, and defend your decisions before specialist judges.
          </motion.p>
        </motion.div>

        {/* Central Premium Launch Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white border-2 border-neutral-800 rounded-md max-md:p-4 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.08)] text-left select-none relative overflow-hidden max-md:space-y-3 space-y-5"
        >
          <div className="absolute top-1.5 right-2.5 font-mono text-[8px] text-neutral-400 font-bold select-none">
            GAME RUNNER V2.4
          </div>

          <div className="max-md:space-y-2 space-y-4 font-mono">
            <div className="flex items-center gap-2 border-b border-neutral-200 max-md:pb-1 pb-2">
              <Clock className="w-4 h-4 text-neutral-850 animate-pulse" />
              <span className="font-bold text-xs uppercase text-neutral-900">THE REAL GAME SEQUENCE</span>
            </div>

            <div className="space-y-3 text-[10px] leading-relaxed text-neutral-600 font-sans">
              <div className="flex gap-2.5">
                <span className="font-mono text-neutral-900 font-bold mt-0.5">01/</span>
                <span>Choose a real-world problem statement.</span>
              </div>
              <div className="flex gap-2.5">
                <span className="font-mono text-neutral-900 font-bold mt-0.5">02/</span>
                <span>Build an architecture using technologies that actually fit your solution.</span>
              </div>
              <div className="flex gap-2.5">
                <span className="font-mono text-neutral-900 font-bold mt-0.5">03/</span>
                <span>Collaborate with teammates who critique and improve your project.</span>
              </div>
              <div className="flex gap-2.5">
                <span className="font-mono text-neutral-900 font-bold mt-0.5">04/</span>
                <span>Create a pitch deck, survive mentor reviews, and face final judging.</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLaunch}
            onMouseEnter={playSubtleHover}
            className="w-full h-11 bg-neutral-900 text-white hover:bg-neutral-850 font-bold tracking-wider rounded border border-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
          >
            START BUILDING
            <ChevronRight className="w-4 h-4" />
          </Button>

          {isLocal && (
            <button
              onClick={handleDebugSkip}
              className="mt-3 w-full text-center font-mono text-[9px] text-amber-500 hover:text-amber-600 font-bold uppercase transition-colors cursor-pointer border border-dashed border-amber-300 py-1.5 rounded hover:bg-[#fffbeb] transition-all duration-150"
            >
              🛠️ SKIP TO RESULTS DEMO (DEVELOPER ONLY)
            </button>
          )}
        </motion.div>

        {/* Lightweight Simulator Metrics Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[10px] text-neutral-500 border-y border-neutral-200/80 py-3 w-full max-w-xl font-mono uppercase font-bold select-none text-center"
        >
          <span>⏱️ 10 Minute Sessions</span>
          <span className="hidden sm:inline text-neutral-300">•</span>
          <span>💡 20+ Problem Categories</span>
          <span className="hidden sm:inline text-neutral-300">•</span>
          <span>⚙️ 100+ Tech Combinations</span>
          <span className="hidden sm:inline text-neutral-300">•</span>
          <span>👥 Team Personalities</span>
          <span className="hidden sm:inline text-neutral-300">•</span>
          <span>⚖️ Dynamic Judging</span>
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-3xl select-none"
        >
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -2, borderColor: "#737373" }}
            transition={{ duration: 0.15 }}
            className="p-4 bg-white border border-neutral-200 rounded text-left space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-colors"
          >
            <div className="flex items-center gap-2 text-neutral-900">
              <Users className="w-3.5 h-3.5 text-neutral-700" />
              <span className="font-bold text-[10px] uppercase tracking-wide">AI TEAMMATES</span>
            </div>
            <p className="text-[9px] text-neutral-500 font-sans font-light leading-relaxed">
              Each teammate has a role, personality, expertise, and opinions. Receive architecture reviews, business feedback, design critiques, and real-time project discussions.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -2, borderColor: "#737373" }}
            transition={{ duration: 0.15 }}
            className="p-4 bg-white border border-neutral-200 rounded text-left space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-colors"
          >
            <div className="flex items-center gap-2 text-neutral-900">
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              <span className="font-bold text-[10px] uppercase tracking-wide">DYNAMIC PROJECT BUILDER</span>
            </div>
            <p className="text-[9px] text-neutral-500 font-sans font-light leading-relaxed">
              Generate problem statements, USPs, feature backlogs, business models, and pitch structures tailored to your project.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -2, borderColor: "#737373" }}
            transition={{ duration: 0.15 }}
            className="p-4 bg-white border border-neutral-200 rounded text-left space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-colors"
          >
            <div className="flex items-center gap-2 text-neutral-900">
              <Clock className="w-3.5 h-3.5 text-neutral-700" />
              <span className="font-bold text-[10px] uppercase tracking-wide">REAL PLACEMENT FLOW</span>
            </div>
            <p className="text-[9px] text-neutral-500 font-sans font-light leading-relaxed">
              Experience the core loop: Problem Selection → Tech Stack → USP → Backlog → Pitch Deck → Mentor Review → Business Model → Judging → Results.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            whileHover={{ y: -2, borderColor: "#737373" }}
            transition={{ duration: 0.15 }}
            className="p-4 bg-white border border-neutral-200 rounded text-left space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-colors"
          >
            <div className="flex items-center gap-2 text-neutral-900">
              <Layers className="w-3.5 h-3.5 text-neutral-700" />
              <span className="font-bold text-[10px] uppercase tracking-wide">ARCHITECTURE REVIEWS</span>
            </div>
            <p className="text-[9px] text-neutral-500 font-sans font-light leading-relaxed">
              Your team actively challenges poor technical decisions, recommends better stacks, and helps optimize execution.
            </p>
          </motion.div>

          {/* Card 5 */}
          <motion.div
            whileHover={{ y: -2, borderColor: "#737373" }}
            transition={{ duration: 0.15 }}
            className="p-4 bg-white border border-neutral-200 rounded text-left space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-colors"
          >
            <div className="flex items-center gap-2 text-neutral-900">
              <Terminal className="w-3.5 h-3.5 text-neutral-700" />
              <span className="font-bold text-[10px] uppercase tracking-wide">PITCH DECK BUILDER</span>
            </div>
            <p className="text-[9px] text-neutral-500 font-sans font-light leading-relaxed">
              Build and organize your presentation through drag-and-drop storytelling and project strategy decisions.
            </p>
          </motion.div>

          {/* Card 6 */}
          <motion.div
            whileHover={{ y: -2, borderColor: "#737373" }}
            transition={{ duration: 0.15 }}
            className="p-4 bg-white border border-neutral-200 rounded text-left space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-colors"
          >
            <div className="flex items-center gap-2 text-neutral-900">
              <Shield className="w-3.5 h-3.5 text-neutral-700" />
              <span className="font-bold text-[10px] uppercase tracking-wide">FINAL JUDGING</span>
            </div>
            <p className="text-[9px] text-neutral-500 font-sans font-light leading-relaxed">
              Face judges with unique perspectives who evaluate your project, team decisions, architecture quality, and pitch strength.
            </p>
          </motion.div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 text-[9px] text-neutral-400 border-t border-neutral-200 select-none">
        <div className="flex items-center justify-center gap-2">
          <Terminal className="w-3 h-3 text-neutral-400" />
          <span>
            PLACEMENT SEASON SIMULATOR v0.1 — ZERO BACKEND — 100% LOCAL CLIENT-SIDE SYSTEM
          </span>
        </div>
      </footer>
    </div>
  );
}
