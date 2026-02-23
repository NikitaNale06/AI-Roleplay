'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, SignedIn, UserButton } from '@clerk/nextjs';
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  BarChart3, 
  FileText,
  Plus,
  Volume2,
  Download,
  Star,
  Zap,
  Brain,
  GraduationCap,
  MessageCircle,
  UserCheck,
  BookOpen,
  RefreshCw,
  Users,
  Briefcase,
  Play,
  Sparkles,
  Mic,
  Video,
  User,
  ArrowRight,
  X,
  History,
  Eye,
  EyeOff,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Component for the animated gaming background
function GamingBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-px animate-pulse rounded-full bg-blue-400 opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Animated glow effects */}
      <div className="absolute left-1/4 top-1/3 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-600 opacity-20 blur-3xl animation-delay-1000"></div>
      
      {/* Circuit board pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRINnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0SDZWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .animate-pulse {
          animation: pulse 4s infinite ease-in-out;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

// Component for the header
function Header() {
  return (
    <nav className="relative z-10 flex w-full items-center justify-between bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 px-6 py-4 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-20"></div>
          <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
        </div>
        <h1 className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
          ASSESSMENT RESULTS
        </h1>
      </div>
      <SignedIn>
        <div className="flex items-center gap-4">
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{
              elements: {
                avatarBox: "border-2 border-purple-500"
              }
            }} 
          />
        </div>
      </SignedIn>
    </nav>
  );
}

interface AssessmentResult {
  id: string;
  jobTitle: string;
  date: string;
  totalScore: number;
  questions: any[];
  answers: any[];
  startTime: string;
  endTime: string;
  duration: number;
  type?: string;
  isDynamic?: boolean;
  recordedAudio?: any;
  summary?: {
    strengths: string[];
    improvements: string[];
    overallFeedback: string;
  };
  profile?: {
    jobTitle: string;
    companyName?: string;
    experience: string;
    skills: string[];
  };
  assessmentType?: 'interview' | 'academic-viva' | 'communication-test' | 'knowledge-assessment' | 'confidence-building' | 'general-practice';
  subject?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Main Home Component
export default function Home() {
  const router = useRouter();
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [stats, setStats] = useState({
    averageScore: 0,
    totalAssessments: 0,
    totalPracticeTime: 0,
    streak: 0,
    improvementAreas: [] as string[],
    bestScore: 0,
    recentTrend: 'stable' as 'improving' | 'declining' | 'stable',
    assessmentTypes: {
      interview: 0,
      academicViva: 0,
      communicationTest: 0,
      knowledgeAssessment: 0,
      confidenceBuilding: 0,
      generalPractice: 0
    },
    todaySessions: 0,
    weeklyProgress: 0,
    topStrengths: [] as string[]
  });
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentResult | null>(null);
  const [showAssessmentDetails, setShowAssessmentDetails] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Load assessment results
  useEffect(() => {
    const loadAssessmentResults = () => {
      try {
        const completedAssessment = localStorage.getItem('completedInterview');
        const assessmentHistory = localStorage.getItem('interviewHistory');
        
        let results: AssessmentResult[] = [];
        
        if (assessmentHistory) {
          try {
            const parsedHistory = JSON.parse(assessmentHistory);
            results = parsedHistory.filter((assessment: AssessmentResult) => {
              return assessment.id && 
                     assessment.jobTitle && 
                     assessment.date && 
                     assessment.totalScore !== undefined;
            });
          } catch (e) {
            console.error('Error parsing assessment results:', e);
            results = [];
          }
        }
        
        if (completedAssessment) {
          try {
            const newAssessment: AssessmentResult = JSON.parse(completedAssessment);
            
            if (!newAssessment.id) {
              newAssessment.id = `assessment-${Date.now()}`;
            }
            if (!newAssessment.date) {
              newAssessment.date = new Date().toISOString();
            }
            if (!newAssessment.jobTitle) {
              newAssessment.jobTitle = newAssessment.profile?.jobTitle || 'Talkgenious AI Assessment';
            }
            if (newAssessment.totalScore === undefined || newAssessment.totalScore === null) {
              if (newAssessment.answers && newAssessment.answers.length > 0) {
                const validScores = newAssessment.answers
                  .filter((answer: any) => answer.score !== undefined && answer.score !== null)
                  .map((answer: any) => answer.score);
                
                if (validScores.length > 0) {
                  const avgScore = validScores.reduce((sum: number, score: number) => sum + score, 0) / validScores.length;
                  newAssessment.totalScore = Math.round(avgScore);
                } else {
                  newAssessment.totalScore = 0;
                }
              } else {
                newAssessment.totalScore = 0;
              }
            }
            if (!newAssessment.duration || newAssessment.duration === 0) {
              if (newAssessment.startTime && newAssessment.endTime) {
                const start = new Date(newAssessment.startTime).getTime();
                const end = new Date(newAssessment.endTime).getTime();
                newAssessment.duration = Math.round((end - start) / 1000);
              } else {
                newAssessment.duration = 300;
              }
            }
            
            results = [newAssessment, ...results];
            
            localStorage.setItem('interviewHistory', JSON.stringify(results));
            localStorage.removeItem('completedInterview');
            localStorage.removeItem('activeInterview');
            
            console.log('✅ New assessment result added:', newAssessment);
          } catch (e) {
            console.error('Error processing completed assessment:', e);
          }
        }
        
        setAssessmentResults(results);
        calculateStatistics(results);
        
      } catch (error) {
        console.error('Error loading assessment results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessmentResults();
    
    const interval = setInterval(loadAssessmentResults, 2000);
    const handleStorageChange = () => loadAssessmentResults();
    const handleAssessmentComplete = () => loadAssessmentResults();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('interviewCompleted', handleAssessmentComplete);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('interviewCompleted', handleAssessmentComplete);
      clearInterval(interval);
    };
  }, [refreshTrigger]);

  const calculateStatistics = (results: AssessmentResult[]) => {
    if (results.length === 0) {
      setStats({
        averageScore: 0,
        totalAssessments: 0,
        totalPracticeTime: 0,
        streak: 0,
        improvementAreas: [],
        bestScore: 0,
        recentTrend: 'stable',
        assessmentTypes: {
          interview: 0,
          academicViva: 0,
          communicationTest: 0,
          knowledgeAssessment: 0,
          confidenceBuilding: 0,
          generalPractice: 0
        },
        todaySessions: 0,
        weeklyProgress: 0,
        topStrengths: []
      });
      return;
    }
    
    const validAssessments = results.filter(assessment => {
      const hasValidScore = assessment.totalScore !== undefined && 
                           assessment.totalScore !== null && 
                           !isNaN(assessment.totalScore) &&
                           assessment.totalScore >= 0 &&
                           assessment.totalScore <= 100;
      
      const hasValidDuration = assessment.duration !== undefined && 
                             assessment.duration !== null && 
                             !isNaN(assessment.duration);
      
      return hasValidScore && hasValidDuration;
    });
    
    const totalScore = validAssessments.reduce((sum, assessment) => sum + assessment.totalScore, 0);
    const averageScore = validAssessments.length > 0 ? Math.round(totalScore / validAssessments.length) : 0;
    
    const bestScore = validAssessments.length > 0 ? 
      Math.max(...validAssessments.map(i => i.totalScore)) : 0;
    
    const totalPracticeTimeSeconds = validAssessments.reduce((sum, assessment) => sum + (assessment.duration || 0), 0);
    const totalPracticeTimeMinutes = Math.round(totalPracticeTimeSeconds / 60);
    
    // Collect all strengths from assessments
    const allStrengths = validAssessments.flatMap(assessment => 
      assessment.summary?.strengths || []
    );
    
    // Get top 3 most common strengths
    const strengthCount = allStrengths.reduce((acc: Record<string, number>, strength) => {
      acc[strength] = (acc[strength] || 0) + 1;
      return acc;
    }, {});
    
    const topStrengths = Object.entries(strengthCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([strength]) => strength);
    
    const improvementAreas = validAssessments.length > 0 ? 
      (validAssessments[0].summary?.improvements || []) : [];
    
    const streak = calculateStreak(validAssessments);
    const recentTrend = calculateRecentTrend(validAssessments);
    
    const today = new Date().toDateString();
    const todaySessions = validAssessments.filter(assessment => 
      new Date(assessment.date).toDateString() === today
    ).length;

    const weeklyProgress = calculateWeeklyProgress(validAssessments);
    
    const assessmentTypes = {
      interview: validAssessments.filter(a => a.assessmentType === 'interview').length,
      academicViva: validAssessments.filter(a => a.assessmentType === 'academic-viva').length,
      communicationTest: validAssessments.filter(a => a.assessmentType === 'communication-test').length,
      knowledgeAssessment: validAssessments.filter(a => a.assessmentType === 'knowledge-assessment').length,
      confidenceBuilding: validAssessments.filter(a => a.assessmentType === 'confidence-building').length,
      generalPractice: validAssessments.filter(a => a.assessmentType === 'general-practice').length
    };
    
    setStats({
      averageScore,
      totalAssessments: validAssessments.length,
      totalPracticeTime: totalPracticeTimeMinutes,
      streak,
      improvementAreas: improvementAreas.slice(0, 3),
      bestScore,
      recentTrend,
      assessmentTypes,
      todaySessions,
      weeklyProgress,
      topStrengths
    });
  };

  const calculateStreak = (results: AssessmentResult[]): number => {
    if (results.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedResults = [...results].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const assessment of sortedResults) {
      const assessmentDate = new Date(assessment.date);
      assessmentDate.setHours(0, 0, 0, 0);
      
      const diffTime = currentDate.getTime() - assessmentDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        streak = streak > 0 ? streak : 1;
      } else if (diffDays === streak + 1) {
        streak++;
        currentDate = assessmentDate;
      } else if (diffDays > streak + 1) {
        break;
      }
    }
    
    return streak;
  };

  const calculateRecentTrend = (results: AssessmentResult[]): 'improving' | 'declining' | 'stable' => {
    if (results.length < 2) return 'stable';
    
    const recentScores = results.slice(0, 3).map(i => i.totalScore);
    if (recentScores.length < 2) return 'stable';
    
    if (recentScores.length >= 2) {
      const currentScore = recentScores[0];
      const previousScore = recentScores[1];
      
      if (currentScore > previousScore + 5) return 'improving';
      if (currentScore < previousScore - 5) return 'declining';
    }
    
    return 'stable';
  };

  const calculateWeeklyProgress = (results: AssessmentResult[]): number => {
    if (results.length < 2) return 0;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeekSessions = results.filter(assessment => 
      new Date(assessment.date) >= oneWeekAgo
    ).length;
    
    const lastWeekSessions = results.filter(assessment => {
      const assessmentDate = new Date(assessment.date);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return assessmentDate >= twoWeeksAgo && assessmentDate < oneWeekAgo;
    }).length;
    
    if (lastWeekSessions === 0) {
      return thisWeekSessions > 0 ? 100 : 0;
    }
    
    const progress = Math.round(((thisWeekSessions - lastWeekSessions) / lastWeekSessions) * 100);
    return Math.min(Math.max(progress, -100), 100);
  };

  const handleStartNewAssessment = () => {
    router.push('/dashboard/interview/create');
  };

  const viewAssessmentDetails = (assessment: AssessmentResult) => {
    setSelectedAssessment(assessment);
    setShowAssessmentDetails(true);
  };

  const playRecordedAudio = (assessment: AssessmentResult) => {
    if (assessment.recordedAudio) {
      let audioUrl;
      if (typeof assessment.recordedAudio === 'string') {
        audioUrl = assessment.recordedAudio;
      } else {
        audioUrl = URL.createObjectURL(assessment.recordedAudio);
      }
      
      const audio = new Audio(audioUrl);
      audio.play();
      setPlayingAudio(assessment.id);
      
      audio.onended = () => setPlayingAudio(null);
    }
  };

  const downloadAssessmentReport = (assessment: AssessmentResult) => {
    const report = {
      'Assessment ID': assessment.id,
      'Assessment Type': getAssessmentTypeLabel(assessment.assessmentType || 'interview'),
      'Subject/Title': assessment.jobTitle,
      'Date': new Date(assessment.date).toLocaleDateString(),
      'Total Score': `${assessment.totalScore}%`,
      'Duration': `${Math.round((assessment.duration || 0) / 60)} minutes`,
      'Number of Questions': assessment.questions?.length || 0,
      'Questions Answered': assessment.answers?.length || 0,
      'Type': assessment.type || (assessment.isDynamic ? 'Dynamic AI' : 'Standard'),
      'Strengths': assessment.summary?.strengths?.join(', ') || 'None identified',
      'Areas for Improvement': assessment.summary?.improvements?.join(', ') || 'None identified',
      'Overall Feedback': assessment.summary?.overallFeedback || 'No feedback available',
      'Performance Insights': `Scored ${assessment.totalScore}% with ${assessment.answers?.length || 0} questions answered`
    };
    
    const reportText = Object.entries(report)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getAssessmentTypeLabel(assessment.assessmentType || 'interview').toLowerCase().replace(/ /g, '-')}-report-${assessment.id.slice(-8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAssessmentTypeLabel = (type: string) => {
    switch (type) {
      case 'academic-viva': return 'Academic Viva';
      case 'communication-test': return 'Communication Test';
      case 'knowledge-assessment': return 'Knowledge Assessment';
      case 'confidence-building': return 'Confidence Building';
      case 'general-practice': return 'General Practice';
      default: return 'Job Interview';
    }
  };

  const getAssessmentTypeIcon = (type: string) => {
    switch (type) {
      case 'academic-viva': return <GraduationCap className="h-4 w-4" />;
      case 'communication-test': return <MessageCircle className="h-4 w-4" />;
      case 'knowledge-assessment': return <BookOpen className="h-4 w-4" />;
      case 'confidence-building': return <UserCheck className="h-4 w-4" />;
      case 'general-practice': return <Users className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  const getAssessmentTypeColor = (type: string) => {
    switch (type) {
      case 'academic-viva': return 'bg-purple-100 text-purple-600';
      case 'communication-test': return 'bg-blue-100 text-blue-600';
      case 'knowledge-assessment': return 'bg-green-100 text-green-600';
      case 'confidence-building': return 'bg-orange-100 text-orange-600';
      case 'general-practice': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'declining': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 60) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const forceRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const hasActiveAssessment = () => {
    const activeAssessment = localStorage.getItem('activeInterview');
    return activeAssessment !== null;
  };

  const resumeAssessment = () => {
    router.push('/dashboard/interview/active');
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <GamingBackground />
        <Header />
        <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-300">Loading assessment results...</p>
          </div>
        </div>
      </div>
    );
  }

return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <GamingBackground />
      <Header />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4 h-[calc(100vh-80px)]">
        {/* Single Start New Assessment Button */}
        <div className="flex justify-center mb-4">
          <button 
            onClick={handleStartNewAssessment}
            className="transform rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 border border-blue-400 flex items-center gap-2"
          >
            <Play className="h-5 w-5" />
            Start New Assessment
          </button>
        </div>

        {/* Main Grid - Adjusted column ratios */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100%-140px)]">
          {/* Left Column - Performance Overview - 3/5 of the space */}
          <div className="lg:col-span-3 h-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-6 h-full">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Performance Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Average Score</p>
                      <p className="text-2xl font-bold text-white">{stats.averageScore}%</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getTrendColor(stats.recentTrend)}`}>
                    {getTrendIcon(stats.recentTrend)}
                    <span className="capitalize">{stats.recentTrend}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-xs text-gray-400">Total Assessments</p>
                    <p className="text-xl font-bold text-white">{stats.totalAssessments}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-xs text-gray-400">Best Score</p>
                    <p className={`text-xl font-bold ${getScoreColor(stats.bestScore)}`}>{stats.bestScore}%</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-xs text-gray-400">Current Streak</p>
                    <p className="text-xl font-bold text-white">{stats.streak} <span className="text-xs text-gray-400">days</span></p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-xs text-gray-400">Practice Time</p>
                    <p className="text-xl font-bold text-white">{stats.totalPracticeTime} <span className="text-xs text-gray-400">min</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Assessment Results List - 2/5 of the space (smaller) */}
          <div className="lg:col-span-2 h-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-400" />
                  Recent Results
                </h3>
                <button 
                  onClick={forceRefresh}
                  className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
              </div>

              {assessmentResults.length > 0 ? (
                <div className="space-y-1.5 flex-1 overflow-y-auto">
                  {assessmentResults.map((assessment) => (
                    <div 
                      key={assessment.id} 
                      className="flex items-center justify-between p-1.5 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 cursor-pointer border border-gray-700 group"
                      onClick={() => viewAssessmentDetails(assessment)}
                    >
                      <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${getScoreBg(assessment.totalScore)}`}>
                          <span className="text-[10px] font-bold text-white">{Math.round(assessment.totalScore)}%</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <h4 className="font-medium text-white text-[10px] truncate max-w-[80px]">{assessment.jobTitle}</h4>
                            <span className={`px-1 py-0.5 text-[6px] rounded-full ${getAssessmentTypeColor(assessment.assessmentType || 'interview')}`}>
                              {getAssessmentTypeIcon(assessment.assessmentType || 'interview')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[6px] text-gray-400">
                            <span>{new Date(assessment.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{assessment.questions?.length || 0} Q</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {assessment.recordedAudio && (
                          <button onClick={(e) => { e.stopPropagation(); playRecordedAudio(assessment); }}>
                            <Volume2 className="h-2.5 w-2.5 text-gray-400 hover:text-blue-400" />
                          </button>
                        )}
                        <ArrowRight className="h-2.5 w-2.5 text-gray-400 group-hover:text-blue-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-500 mb-1" />
                  <p className="text-[10px] text-gray-400">No results yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Today's Progress Bar - Increased size */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-5 mt-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span className="font-medium">Today's Progress</span>
                <span className="font-semibold">{stats.todaySessions} session{stats.todaySessions !== 1 ? 's' : ''}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                  style={{ width: `${Math.min(stats.todaySessions * 25, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Complete 4 sessions to reach daily goal</p>
            </div>
          </div>
        </div>

        {/* Resume Active Assessment Button */}
        {hasActiveAssessment() && (
          <div className="fixed bottom-4 right-4">
            <button
              onClick={resumeAssessment}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full text-xs font-semibold shadow-2xl border border-green-400"
            >
              <Zap className="h-3 w-3" />
              Resume
            </button>
          </div>
        )}
      </div>

      {/* Assessment Details Modal */}
      {showAssessmentDetails && selectedAssessment && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between">
              <h3 className="text-lg font-semibold text-white">Assessment Details</h3>
              <button onClick={() => setShowAssessmentDetails(false)} className="text-gray-400 hover:text-white">×</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-500/10 p-2 rounded">
                  <p className="text-xs text-blue-400">Type</p>
                  <p className="text-xs text-white">{getAssessmentTypeLabel(selectedAssessment.assessmentType || 'interview')}</p>
                </div>
                <div className="bg-green-500/10 p-2 rounded">
                  <p className="text-xs text-green-400">Score</p>
                  <p className={`text-xs font-bold ${getScoreColor(selectedAssessment.totalScore)}`}>{selectedAssessment.totalScore}%</p>
                </div>
                <div className="bg-purple-500/10 p-2 rounded">
                  <p className="text-xs text-purple-400">Duration</p>
                  <p className="text-xs text-white">{Math.round((selectedAssessment.duration || 0) / 60)} min</p>
                </div>
              </div>
              <button 
                onClick={() => downloadAssessmentReport(selectedAssessment)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded text-xs"
              >
                <Download className="h-3 w-3" /> Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}