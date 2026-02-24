"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

/* =========================
   FUTURISTIC BACKGROUND
========================= */

function FuturisticBackground() {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 opacity-20 blur-3xl rounded-full animate-pulse" />

      {/* Radial Light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,black_70%)]" />
    </div>
  );
}

/* =========================
   ANIMATED AI IMAGE
========================= */

function AnimatedAI() {
  return (
    <div className="relative flex items-center justify-center h-[700px]">

      {/* Big Neon Glow Background */}
      <div className="absolute w-[650px] h-[650px] rounded-full bg-purple-600/20 blur-[120px]" />

      {/* Rotating Hologram Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="absolute w-[500px] h-[500px] rounded-full border border-purple-500/30"
      />

      {/* Second Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
        className="absolute w-[600px] h-[600px] rounded-full border border-blue-500/20"
      />

      {/* Floating AI Image */}
      <motion.img
        src="/ai-hero.png"
        alt="AI Interaction"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, -25, 0]
        }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 1 },
          y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
        }}
        className="relative w-[500px] drop-shadow-[0_0_60px_rgba(139,92,246,0.8)]"
      />
    </div>
  );
}

/* =========================
   MAIN LANDING PAGE
========================= */

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <FuturisticBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold leading-tight mb-6">
            AI Roleplay
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Simulation Arena
            </span>
          </h1>

          <p className="text-gray-400 text-lg mb-10 max-w-xl">
            Step into an immersive AI-powered simulation environment.
            Practice interviews, debates, negotiations and real-world
            conversations with intelligent adaptive AI.
          </p>

          <div className="flex gap-6">
            <button
              onClick={() =>
                router.push("/dashboard/interview/create")
              }
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
            >
              🚀 Start Assessment
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-4 border border-white/20 rounded-xl hover:bg-white/10 transition-all"
            >
              📊 Check Progress
            </button>
          </div>
        </motion.div>

        {/* RIGHT SIDE ANIMATED IMAGE */}
        <AnimatedAI />

      </div>

      <div className="absolute bottom-6 w-full text-center text-xs tracking-widest text-purple-400">
        AI SIMULATION MODE ACTIVE
      </div>
    </div>
  );
}