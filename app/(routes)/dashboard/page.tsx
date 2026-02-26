'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  BarChart3,
  Calendar,
  Play,
  ArrowRight,
  Loader2,
  Clock,
  MessageSquare,
  Eye,
  Ear
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
   RECENT ASSESSMENT CARD
============================== */

function RecentAssessmentCard({ assessment, index }: any) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="flex justify-between items-center bg-black/40 p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
    >
      <div>
        <p className="font-medium text-lg">
          {assessment.assessmentType ? 
            assessment.assessmentType.charAt(0).toUpperCase() + assessment.assessmentType.slice(1) : 
            'Interview'} Assessment
        </p>
        <div className="flex gap-4 mt-2">
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {assessment.answerCount || assessment.answers?.length || 0} answers
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {Math.floor(assessment.totalTime / 60)}m {assessment.totalTime % 60}s
          </p>
          <p className="text-gray-400 text-sm">
            {formatDate(assessment.completedAt)}
          </p>
          {assessment.manuallyStopped && (
            <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">
              Manual Stop
            </span>
          )}
        </div>
        {(assessment.voiceAnalysis?.hasValidData || assessment.behavioralAnalysis?.hasValidData) && (
          <div className="flex gap-3 mt-2">
            {assessment.voiceAnalysis?.hasValidData && (
              <span className="text-xs flex items-center gap-1 text-blue-400">
                <Ear className="h-3 w-3" />
                Voice: {assessment.voiceAnalysis.summary?.confidence || 0}%
              </span>
            )}
            {assessment.behavioralAnalysis?.hasValidData && (
              <span className="text-xs flex items-center gap-1 text-green-400">
                <Eye className="h-3 w-3" />
                Body: {assessment.behavioralAnalysis.summary?.engagement || 0}%
              </span>
            )}
          </div>
        )}
      </div>
      <div className="text-right">
        <p className={`text-2xl font-bold ${getScoreColor(assessment.finalScore || 0)}`}>
          {assessment.finalScore || 0}%
        </p>
        <p className="text-xs text-gray-400">Score</p>
      </div>
    </motion.div>
  );
}

/* ==============================
   MAIN
============================== */

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    averageScore: 0,
    bestScore: 0,
    totalAssessments: 0,
    todayCount: 0
  });
  const [recentAssessments, setRecentAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/interview/results?userId=guest-user&limit=10');
      
      const data = await response.json();
      
      // Handle both success and error responses
      const allResults = data.all || [];
      const recentResults = data.recent || [];
      
      setRecentAssessments(recentResults);

      // Calculate stats from ALL results
      if (allResults.length > 0) {
        const scores = allResults.map((r: any) => r.finalScore || 0);
        const totalScore = scores.reduce((sum: number, score: number) => sum + score, 0);
        const avgScore = Math.round(totalScore / allResults.length);
        const bestScore = Math.max(...scores);
        
        const today = new Date().toDateString();
        const todayCount = allResults.filter((r: any) => 
          new Date(r.completedAt).toDateString() === today
        ).length;

        setStats({
          averageScore: avgScore,
          bestScore: bestScore,
          totalAssessments: allResults.length,
          todayCount: todayCount
        });
      } else {
        // Reset stats if no data
        setStats({
          averageScore: 0,
          bestScore: 0,
          totalAssessments: 0,
          todayCount: 0
        });
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      // Set empty state on error
      setRecentAssessments([]);
      setStats({
        averageScore: 0,
        bestScore: 0,
        totalAssessments: 0,
        todayCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  fetchResults();
}, []);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black overflow-hidden">
        <PremiumBackground />
        <Header />
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

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
            value={stats.averageScore > 0 ? `${stats.averageScore}%` : '--'}
          />
          <StatCard
            icon={<Trophy className="text-yellow-400" />}
            title="Best Score"
            value={stats.bestScore > 0 ? `${stats.bestScore}%` : '--'}
          />
          <StatCard
            icon={<BarChart3 className="text-purple-400" />}
            title="Assessments"
            value={stats.totalAssessments}
          />
          <StatCard
            icon={<Calendar className="text-green-400" />}
            title="Today"
            value={stats.todayCount}
          />
        </div>

        {/* CTA Section */}
        <div className="flex justify-center mb-16">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard/interview/create')}
            className="px-12 py-5 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-[0_0_40px_rgba(139,92,246,0.6)] hover:shadow-[0_0_60px_rgba(139,92,246,0.8)] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <Play className="h-5 w-5" />
              Start New Assessment
            </div>
          </motion.button>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <h3 className="text-2xl font-semibold mb-8">
            Recent Simulations
          </h3>

          {recentAssessments.length > 0 ? (
            <div className="space-y-4">
              {recentAssessments.slice(0, 10).map((assessment, index) => (
                <RecentAssessmentCard 
                  key={index} 
                  assessment={assessment} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">No Assessments Yet</h4>
              <p className="text-gray-400 mb-6">Start your first AI interview assessment to see results here</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/interview/create')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium inline-flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Assessment
              </motion.button>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {recentAssessments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-3 gap-4 text-center"
          >
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-purple-400">{stats.totalAssessments}</p>
              <p className="text-xs text-gray-400">Total Assessments</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-blue-400">{stats.averageScore}%</p>
              <p className="text-xs text-gray-400">Average Score</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-green-400">{stats.bestScore}%</p>
              <p className="text-xs text-gray-400">Best Performance</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}