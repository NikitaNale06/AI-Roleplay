'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  BarChart3,
  Calendar,
  Play,
  ArrowRight
} from 'lucide-react';

/* ==============================
   PREMIUM BACKGROUND
============================== */

function PremiumBackground() {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Purple glow */}
      <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] bg-purple-600/20 blur-[160px] rounded-full" />

      {/* Blue glow */}
      <div className="absolute bottom-[-200px] right-[-200px] w-[700px] h-[700px] bg-blue-600/20 blur-[160px] rounded-full" />

      {/* Center radial focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,black_70%)]" />
    </div>
  );
}

/* ==============================
   HEADER
============================== */

function Header() {
  return (
    <nav className="relative z-10 flex justify-between items-center px-10 py-6 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Performance Command Center
      </h1>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </nav>
  );
}

/* ==============================
   STAT CARD
============================== */

function StatCard({ icon, title, value }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
          {icon}
        </div>
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ==============================
   MAIN
============================== */

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <PremiumBackground />
      <Header />

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-14">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            🚀 Track. Improve. Dominate.
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Monitor your AI interview simulations, analyze performance insights,
            and accelerate your career growth.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <StatCard
            icon={<Target className="text-blue-400" />}
            title="Average Score"
            value="82%"
          />
          <StatCard
            icon={<Trophy className="text-yellow-400" />}
            title="Best Score"
            value="94%"
          />
          <StatCard
            icon={<BarChart3 className="text-purple-400" />}
            title="Assessments"
            value="12"
          />
          <StatCard
            icon={<Calendar className="text-green-400" />}
            title="Today"
            value="2"
          />
        </div>

        {/* CTA Section */}
        <div className="flex justify-center mb-16">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard/interview/create')}
            className="px-12 py-5 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-[0_0_40px_rgba(139,92,246,0.6)]"
          >
            <div className="flex items-center gap-3">
              <Play />
              Start New Assessment
            </div>
          </motion.button>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <h3 className="text-2xl font-semibold mb-8">
            Recent Simulations
          </h3>

          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center bg-black/40 p-6 rounded-xl border border-white/10"
              >
                <div>
                  <p className="font-medium text-lg">Technical Interview</p>
                  <p className="text-gray-400 text-sm">Score: 85%</p>
                </div>
                <ArrowRight className="text-purple-400" />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}