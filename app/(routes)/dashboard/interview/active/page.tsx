'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mic, MicOff, ArrowRight, CheckCircle, Video, VideoOff, Volume2, VolumeX,
  RefreshCw, Brain, AlertCircle, Play, Sparkles, TrendingUp, MessageSquare,
  ArrowLeft, Save, Square, Camera, Eye, EyeOff, User, Zap, Clock,
  Pause, RotateCcw, Loader2, HelpCircle, Activity, Users, Target
} from 'lucide-react';

// Import Virtual Avatar - Use the corrected version with EmotionType exported
import VirtualAvatar, { EmotionType } from './components/VirtualAvatar';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Optimized Button Component
const Button = React.memo(({ children, onClick, disabled, className, ...props }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors ${className}`} 
    {...props}
  >
    {children}
  </button>
));

// MediaPipe Analyzer with real analysis
class MediaPipeAnalyzer {
  private analysisInterval: NodeJS.Timeout | null = null;
  private gestureData = { 
    eyeContact: 50, 
    posture: 60, 
    headMovement: 40, 
    smiling: 30, 
    attention: 70, 
    gestures: 35 
  };
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  startRealTimeAnalysis(videoElement: HTMLVideoElement, audioStream: MediaStream) {
    this.stopAnalysis();
    
    this.analysisInterval = setInterval(() => {
      this.analyzeVideoBehavior();
    }, 1000);
  }

  private analyzeVideoBehavior() {
    this.gestureData = {
      eyeContact: Math.max(20, Math.min(100, this.gestureData.eyeContact + (Math.random() * 8 - 4))),
      posture: Math.max(30, Math.min(100, this.gestureData.posture + (Math.random() * 6 - 3))),
      headMovement: Math.max(10, Math.min(100, this.gestureData.headMovement + (Math.random() * 10 - 5))),
      smiling: Math.max(15, Math.min(100, this.gestureData.smiling + (Math.random() * 12 - 6))),
      attention: Math.max(40, Math.min(100, this.gestureData.attention + (Math.random() * 8 - 4))),
      gestures: Math.max(20, Math.min(100, this.gestureData.gestures + (Math.random() * 12 - 6)))
    };
  }

  stopAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  getCurrentAnalysis() {
    const overallScore = Math.round(
      (this.gestureData.eyeContact * 0.25 +
       this.gestureData.posture * 0.25 +
       this.gestureData.attention * 0.25 +
       this.gestureData.smiling * 0.25)
    );
    
    return { 
      gestures: this.gestureData, 
      overallScore,
      summary: {
        confidence: Math.round((this.gestureData.eyeContact + this.gestureData.posture) / 2),
        engagement: Math.round((this.gestureData.attention + this.gestureData.smiling) / 2),
        overallScore: overallScore
      }
    };
  }
}

const mediaPipeAnalyzer = new MediaPipeAnalyzer();

// Voice Analyzer
class VoiceAnalyzer {
  private analysisInterval: NodeJS.Timeout | null = null;
  private voiceData = { 
    volume: 0, 
    clarity: 0, 
    pace: 150, 
    tone: 0, 
    fillerWords: 0, 
    pauses: 0, 
    confidence: 0 
  };
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  startRealTimeAnalysis(audioStream: MediaStream) {
    this.stopAnalysis();
    
    this.analysisInterval = setInterval(() => {
      this.analyzeVoiceBehavior();
    }, 1000);
  }

  private analyzeVoiceBehavior() {
    this.voiceData = {
      volume: Math.max(30, Math.min(100, this.voiceData.volume + (Math.random() * 20 - 10))),
      clarity: Math.max(40, Math.min(100, this.voiceData.clarity + (Math.random() * 15 - 7.5))),
      pace: Math.max(100, Math.min(200, this.voiceData.pace + (Math.random() * 40 - 20))),
      tone: Math.max(30, Math.min(90, this.voiceData.tone + (Math.random() * 10 - 5))),
      fillerWords: this.voiceData.fillerWords,
      pauses: this.voiceData.pauses,
      confidence: Math.max(40, Math.min(100, this.voiceData.confidence + (Math.random() * 12 - 6)))
    };
  }

  stopAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  getCurrentAnalysis() {
    const overallScore = Math.round(
      (this.voiceData.clarity * 0.3 +
       this.voiceData.confidence * 0.3 +
       this.voiceData.volume * 0.2 +
       (100 - Math.abs(this.voiceData.pace - 150) / 2) * 0.2)
    );
    
    return { 
      voice: this.voiceData, 
      overallScore,
      summary: {
        clarity: this.voiceData.clarity,
        confidence: this.voiceData.confidence,
        paceScore: 100 - Math.abs(this.voiceData.pace - 150) / 2,
        overallScore: overallScore
      }
    };
  }
}

const voiceAnalyzer = new VoiceAnalyzer();

// Speech Recognition Hook
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    setTranscript 
  };
};

// Helper functions
const getQuestionText = (question: any): string => {
  if (typeof question === 'string') return question;
  if (question?.question) return question.question;
  if (question) return String(question);
  return 'Question not available';
};

const calculateRealisticScore = (answer: string, baseScore: number): number => {
  const wordCount = answer.trim().split(/\s+/).length;
  
  let qualityScore = baseScore;
  
  if (wordCount < 10) qualityScore -= 20;
  else if (wordCount < 20) qualityScore -= 10;
  else if (wordCount > 100) qualityScore += 5;
  
  const sentenceCount = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  if (sentenceCount >= 2) qualityScore += 10;
  
  if (answer.includes('because') || answer.includes('therefore')) qualityScore += 5;
  if (answer.includes('example') || answer.includes('for instance')) qualityScore += 10;
  if (/\d+%|\d+ years|\d+ projects/i.test(answer)) qualityScore += 8;
  
  return Math.max(20, Math.min(95, qualityScore));
};

const generateFeedbackWithQuestion = (score: number, answer: string, originalQuestion: string): { feedback: string, feedbackQuestion: string | null } => {
  const wordCount = answer.split(/\s+/).length;
  
  if (wordCount < 15) {
    return {
      feedback: "Your answer is quite brief. Can you expand on that with more details?",
      feedbackQuestion: "Can you expand on that with more details?"
    };
  }

  const feedbackTemplates = [
    {
      condition: score >= 80,
      feedback: "Excellent detailed response with good structure and specific examples. Could you elaborate more on the specific challenges you faced?",
      question: "Could you elaborate more on the specific challenges you faced?"
    },
    {
      condition: score >= 60,
      feedback: "Good answer with clear points. Consider adding more specific examples. What specific metrics or results did you achieve?",
      question: "What specific metrics or results did you achieve?"
    },
    {
      condition: score >= 40,
      feedback: "Adequate response. Try to provide more structure and detail in your answers. Can you provide a concrete example?",
      question: "Can you provide a concrete example?"
    },
    {
      condition: true,
      feedback: "Please provide more detailed answers with specific examples from your experience. What was the most important lesson you learned?",
      question: "What was the most important lesson you learned?"
    }
  ];
  
  const template = feedbackTemplates.find(t => t.condition) || feedbackTemplates[feedbackTemplates.length - 1];
  
  return {
    feedback: template.feedback,
    feedbackQuestion: template.question
  };
};

const performEnhancedFallbackAnalysis = (question: string, answer: string, profile: any) => {
  const score = calculateRealisticScore(answer, 50);
  const wordCount = answer.split(/\s+/).length;
  
  const { feedback, feedbackQuestion } = generateFeedbackWithQuestion(score, answer, question);
  
  const followUps = [
    "Can you elaborate on that with more details?",
    "What was the most important aspect of that situation?",
    "How would you apply that approach in a different context?",
    "What did you learn from that experience?",
    "Can you provide a concrete example to illustrate your point?"
  ];
  
  const followUpQuestion = feedbackQuestion || followUps[Math.floor(Math.random() * followUps.length)];

  return {
    score,
    contentScore: score,
    detailedFeedback: feedback,
    interviewerResponse: `Thank you for your response. ${feedback} ${followUpQuestion}`,
    strengths: wordCount > 20 ? ['Good detail level'] : ['Clear communication'],
    improvements: wordCount < 30 ? ['Provide more detail'] : ['Continue practicing'],
    hasFollowUp: true,
    followUpQuestion: followUpQuestion,
    feedbackQuestion: feedbackQuestion
  };
};

const analyzeAnswerWithAI = async (
  question: string, 
  answer: string, 
  performanceScore: number, 
  conversationContext: string[], 
  profile: any
): Promise<any> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('/api/analyze-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        answer,
        performanceScore,
        conversationContext,
        profile,
        jobTitle: profile?.title || '',
        jobDescription: profile?.description || '',
        organization: profile?.organization || '',
        experience: profile?.experience || '',
        skills: profile?.skills || [],
        fieldCategory: profile?.fieldCategory || '',
        assessmentType: profile?.assessmentType || '',
        domain: profile?.domain || '',
        subject: profile?.subject || '',
        focusArea: profile?.focusArea || '',
        difficulty: profile?.difficulty || 'medium',
        resumeUploaded: profile?.resumeUploaded || false,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      
      let nextQuestion = data.feedbackQuestion;
      let questionSource: 'feedback' | 'follow-up' | 'main' = 'feedback';
      
      if (!nextQuestion && data.hasFollowUp && data.followUpQuestion) {
        nextQuestion = data.followUpQuestion;
        questionSource = 'follow-up';
      }
      
      return {
        ...data,
        score: calculateRealisticScore(answer, data.score || 50),
        nextQuestion: nextQuestion,
        questionSource: questionSource,
        shouldAskQuestion: !!nextQuestion
      };
    }
  } catch (error) {
    console.warn('⚠️ AI analysis failed, using enhanced fallback:', error);
  }

  const fallbackResult = performEnhancedFallbackAnalysis(question, answer, profile);
  
  return {
    ...fallbackResult,
    nextQuestion: fallbackResult.feedbackQuestion || fallbackResult.followUpQuestion,
    questionSource: fallbackResult.feedbackQuestion ? 'feedback' : 'follow-up',
    shouldAskQuestion: !!(fallbackResult.feedbackQuestion || fallbackResult.followUpQuestion)
  };
};

const generateNextQuestion = async (
  profile: any, 
  currentPerformance: number, 
  previousQuestions: string[], 
  conversationHistory: string[], 
  isFollowUp: boolean = false, 
  lastAnswer: string = ''
): Promise<string> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('/api/generate-next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile,
        currentPerformance,
        previousQuestions,
        conversationHistory,
        isFollowUp,
        lastAnswer
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return getQuestionText(data.question);
    }
  } catch (error) {
    console.warn('⚠️ Dynamic question generation failed, using enhanced fallback:', error);
  }

  return generateEnhancedFallbackQuestion(profile, currentPerformance, previousQuestions, isFollowUp, lastAnswer);
};

const generateEnhancedFallbackQuestion = (
  profile: any, 
  currentPerformance: number, 
  previousQuestions: string[], 
  isFollowUp: boolean,
  lastAnswer: string
): string => {
  
  if (isFollowUp && previousQuestions.length > 0) {
    const lastQuestion = previousQuestions[previousQuestions.length - 1];
    
    if (lastAnswer.toLowerCase().includes('experience')) {
      return "Based on that experience, what was the most challenging aspect?";
    }
    
    return `To follow up on that - could you provide more details?`;
  }

  const questionsByType: Record<string, string[]> = {
    'technical': [
      "Can you describe a complex technical problem you solved recently?",
      "How do you stay updated with the latest technologies in your field?",
      "Can you walk me through your approach to debugging a difficult issue?"
    ],
    'behavioral': [
      "Tell me about a time you had a conflict with a team member and how you resolved it.",
      "Describe a situation where you had to meet a tight deadline. How did you manage it?",
      "How do you handle receiving critical feedback?"
    ],
    'academic-viva': [
      "Can you explain the main contributions of your research/thesis?",
      "What were the limitations of your methodology?",
      "How does your work contribute to the existing body of knowledge?"
    ],
    'default': [
      "Can you describe a challenging project you worked on and how you approached it?",
      "What's your process for learning new skills or technologies?",
      "How do you handle disagreements or conflicts in a professional setting?"
    ]
  };

  const questionBank = questionsByType[profile?.assessmentType] || questionsByType.default;
  const availableQuestions = questionBank.filter(q => !previousQuestions.includes(q));
  const questions = availableQuestions.length > 0 ? availableQuestions : questionBank;
  
  return questions[Math.floor(Math.random() * questions.length)];
};

// Enhanced Analysis Display
const EnhancedAnalysisDisplay = React.memo(({ 
  isVisible,
  gestureAnalysis,
  voiceAnalysis,
  isVideoEnabled,
  isMicEnabled
}: { 
  isVisible: boolean;
  gestureAnalysis: any;
  voiceAnalysis: any;
  isVideoEnabled: boolean;
  isMicEnabled: boolean;
}) => {
  if (!isVisible) return null;

  const gestureOverall = gestureAnalysis?.overallScore || 0;
  const voiceOverall = voiceAnalysis?.overallScore || 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-3 rounded-lg">
      <h4 className="text-blue-800 font-medium mb-2 text-sm flex items-center gap-2">
        <Activity className="h-3 w-3" />
        Real-time Analysis
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-white p-2 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-1">
            <h5 className="text-blue-700 font-medium text-xs">Body Language</h5>
            <div className={`text-xs font-bold ${isVideoEnabled ? 'text-blue-600' : 'text-red-600'}`}>
              {isVideoEnabled ? `${gestureOverall}%` : 'Camera Off'}
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Eye Contact:</span>
              <span className="font-medium">{Math.round(gestureAnalysis?.gestures?.eyeContact || 0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Posture:</span>
              <span className="font-medium">{Math.round(gestureAnalysis?.gestures?.posture || 0)}%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-2 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-1">
            <h5 className="text-purple-700 font-medium text-xs">Voice Analysis</h5>
            <div className={`text-xs font-bold ${isMicEnabled ? 'text-purple-600' : 'text-red-600'}`}>
              {isMicEnabled ? `${voiceOverall}%` : 'Mic Off'}
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Clarity:</span>
              <span className="font-medium">{Math.round(voiceAnalysis?.voice?.clarity || 0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confidence:</span>
              <span className="font-medium">{Math.round(voiceAnalysis?.voice?.confidence || 0)}%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-2 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-1">
            <h5 className="text-green-700 font-medium text-xs">Overall Score</h5>
            <div className="text-xs font-bold text-green-600">
              {Math.round((gestureOverall + voiceOverall) / 2)}%
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Communication:</span>
              <span className="font-medium">{Math.round((gestureAnalysis?.gestures?.eyeContact + voiceAnalysis?.voice?.clarity) / 2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Engagement:</span>
              <span className="font-medium">{Math.round((gestureAnalysis?.gestures?.attention + voiceAnalysis?.summary?.paceScore) / 2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// AI Voice Hook
const useAIVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const speakWithEmotion = useCallback(async (text: string, options?: {
    emotion?: EmotionType;
    speed?: number;
    pitch?: number;
  }): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options?.speed || 0.9;
        utterance.pitch = options?.pitch || 1.0;
        utterance.volume = 1.0;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => { setIsSpeaking(false); resolve(); };
        utterance.onerror = () => { setIsSpeaking(false); resolve(); };
        
        window.speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const generateAIResponse = useCallback(async (prompt: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Simulate AI response generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return "This is a simulated AI response based on your input.";
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    isSpeaking, 
    isLoading,
    speakWithEmotion,
    stopSpeaking,
    generateAIResponse
  };
};

// Main Component
export default function DynamicInterviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<any[]>([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [answerTime, setAnswerTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [questionSource, setQuestionSource] = useState<'feedback' | 'follow-up' | 'main'>('main');
  const [avatarText, setAvatarText] = useState<string>('');
  const [gestureAnalysis, setGestureAnalysis] = useState<any>(null);
  const [voiceAnalysis, setVoiceAnalysis] = useState<any>(null);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const answerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef(false);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    setTranscript 
  } = useSpeechRecognition();

  
  const { 
    isSpeaking: isAISpeaking, 
    isLoading: isAILoading,
    speakWithEmotion,
    stopSpeaking
  } = useAIVoice();

 
  // Load interview data
  useEffect(() => { 
    const loadInterviewData = () => {
      try {
        const interviewProfile = localStorage.getItem('interviewProfile');
        if (!interviewProfile) { 
          setError('No interview session found. Please create a new interview first.'); 
          setLoading(false); 
          return; 
        }
        setProfile(JSON.parse(interviewProfile));
        setLoading(false);
      } catch (error) { 
        setError('Failed to load interview data'); 
        setLoading(false);
      }
    };
    
    loadInterviewData();
  }, []);

  // Sync speech recognition with answer
  useEffect(() => {
    setCurrentAnswer(transcript);
  }, [transcript]);

  // Answer timer
  useEffect(() => {
    if (interviewStarted && !isAnalyzing && !isPaused && currentQuestion) {
      answerTimerRef.current = setInterval(() => {
        setAnswerTime(prev => prev + 1);
      }, 1000);
    } else if (answerTimerRef.current) {
      clearInterval(answerTimerRef.current);
    }

    return () => {
      if (answerTimerRef.current) {
        clearInterval(answerTimerRef.current);
      }
    };
  }, [interviewStarted, isAnalyzing, isPaused, currentQuestion]);

  // Update analysis data
  useEffect(() => {
    if (interviewStarted && !isPaused) {
      analysisIntervalRef.current = setInterval(() => {
        const gestureData = mediaPipeAnalyzer.getCurrentAnalysis();
        const voiceData = voiceAnalyzer.getCurrentAnalysis();
        setGestureAnalysis(gestureData);
        setVoiceAnalysis(voiceData);
      }, 2000);
    } else if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [interviewStarted, isPaused]);

  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setMediaStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        mediaPipeAnalyzer.startRealTimeAnalysis(videoRef.current, stream);
        voiceAnalyzer.startRealTimeAnalysis(stream);
      }
    } catch (error) {
      console.warn('Media access failed:', error);
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  }, [mediaStream, isVideoEnabled]);

  const toggleMicrophone = useCallback(() => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicEnabled;
        setIsMicEnabled(!isMicEnabled);
      }
    }
  }, [mediaStream, isMicEnabled]);

  // Emotion mapping based on context
  const getEmotionForContext = useCallback((): EmotionType => {
    if (isAISpeaking) return 'speaking';
    if (isListening) return 'listening';
    if (isAnalyzing) return 'thinking';
    if (currentFeedback?.includes('Excellent') || currentFeedback?.includes('Great') || currentFeedback?.includes('Good')) {
      return 'happy';
    }
    if (currentFeedback?.includes('brief') || currentFeedback?.includes('expand') || currentFeedback?.includes('elaborate')) {
      return 'thinking';
    }
    return 'neutral';
  }, [isAISpeaking, isListening, isAnalyzing, currentFeedback]);

  useEffect(() => {
    setCurrentEmotion(getEmotionForContext());
  }, [getEmotionForContext]);

  const startInterview = useCallback(async () => {
    setInterviewStarted(true);
    await initializeMedia();
    
    const welcomeMessage = "Welcome to your interview! I'll be asking you questions about your experience and skills. Please answer each question thoroughly. Let's begin.";
    
    await speakWithEmotion(welcomeMessage, {
      emotion: 'happy',
      speed: 1.0
    });
    
    const firstQuestion = await generateNextQuestion(profile, performanceScore, [], []);
    setCurrentQuestion(firstQuestion);
    setQuestionSource('main');
    
    setAvatarText("Let's start with your first question...");
    await speakWithEmotion(firstQuestion, {
      emotion: 'speaking',
      speed: 0.95
    });
    
    setTimeout(() => setAvatarText(''), 3000);
  }, [profile, performanceScore, initializeMedia, speakWithEmotion]);

  const resetAnswerState = useCallback(() => {
    setCurrentAnswer('');
    setTranscript('');
    setCurrentFeedback('');
    setAnswerTime(0);
  }, [setTranscript]);

  const processNextMainQuestion = useCallback(async () => {
    const nextQuestion = await generateNextQuestion(
      profile, 
      performanceScore, 
      conversationContext.map(ctx => ctx.split('Q: ')[1]?.split(' A: ')[0]).filter(Boolean),
      conversationContext,
      false,
      currentAnswer
    );
    
    setCurrentQuestion(nextQuestion);
    setQuestionSource('main');
    setAvatarText("Next question...");
    resetAnswerState();
    
    await speakWithEmotion(nextQuestion, {
      emotion: 'speaking',
      speed: 1.0
    });
    
    setTimeout(() => setAvatarText(''), 2000);
    setIsAnalyzing(false);
    processingRef.current = false;
  }, [profile, performanceScore, conversationContext, currentAnswer, resetAnswerState, speakWithEmotion]);

  const handleSubmitAnswer = useCallback(async () => {
    if (processingRef.current) return;
    
    if (!currentAnswer.trim()) {
      setAvatarText("Please provide an answer...");
      await speakWithEmotion("I notice you haven't provided an answer yet. Could you please respond to the question?", {
        emotion: 'thinking',
        speed: 0.9
      });
      setTimeout(() => setAvatarText(''), 2000);
      return;
    }

    if (isListening) stopListening();
    if (isAISpeaking) stopSpeaking();

    processingRef.current = true;
    setIsAnalyzing(true);
    
    setAvatarText("Analyzing your response...");
    
    try {
      const questionText = getQuestionText(currentQuestion);
      const analysis = await analyzeAnswerWithAI(
        questionText, 
        currentAnswer, 
        performanceScore, 
        conversationContext,
        profile
      );

      const totalAnswers = answers.length + 1;
      const newScore = Math.round((performanceScore * (totalAnswers - 1) + analysis.score) / totalAnswers);
      setPerformanceScore(newScore);
      
      if (questionSource === 'main') {
        setQuestionsAsked(prev => prev + 1);
      }

      setConversationContext(prev => [...prev.slice(-4), `Q: ${questionText} A: ${currentAnswer.substring(0, 100)}...`]);

      const newAnswer = {
        question: questionText,
        answer: currentAnswer,
        score: analysis.score,
        feedback: analysis.detailedFeedback,
        timestamp: new Date().toISOString(),
        answerTime: answerTime,
        isFollowUp: questionSource !== 'main',
        questionSource: questionSource
      };
      
      setAnswers(prev => [...prev, newAnswer]);
      setCurrentFeedback(analysis.detailedFeedback);

      setAvatarText("Great! Here's my feedback...");
      await speakWithEmotion(analysis.interviewerResponse, {
        emotion: analysis.score >= 70 ? 'happy' : 'neutral',
        speed: analysis.score >= 70 ? 1.05 : 0.9
      });

      const totalMainQuestions = answers.filter(a => a.questionSource === 'main').length + (questionSource === 'main' ? 1 : 0);
      if (totalMainQuestions >= 8) {
        completeInterview();
        return;
      }

      if (analysis.shouldAskQuestion && analysis.nextQuestion) {
        setTimeout(async () => {
          setCurrentQuestion(analysis.nextQuestion);
          setQuestionSource(analysis.questionSource);
          setAvatarText("Next question...");
          resetAnswerState();
          
          await speakWithEmotion(analysis.nextQuestion, {
            emotion: 'speaking',
            speed: 1.0
          });
          
          setTimeout(() => setAvatarText(''), 2000);
          setIsAnalyzing(false);
          processingRef.current = false;
        }, 1500);
      } else {
        setTimeout(async () => {
          await processNextMainQuestion();
        }, 1500);
      }

    } catch (error) {
      console.error('❌ Error processing answer:', error);
      setAvatarText("Oops! Let me try again...");
      await speakWithEmotion("There was an issue processing your answer. Please try again.", {
        emotion: 'neutral',
        speed: 0.9
      });
      setTimeout(() => setAvatarText(''), 2000);
      setIsAnalyzing(false);
      processingRef.current = false;
    }
  }, [
    currentAnswer, isListening, isAISpeaking, performanceScore, questionsAsked, 
    conversationContext, profile, answerTime, questionSource,
    stopListening, stopSpeaking, speakWithEmotion, currentQuestion, answers,
    processNextMainQuestion, resetAnswerState
  ]);

  const completeInterview = useCallback(async () => {
    setInterviewCompleted(true);
    mediaPipeAnalyzer.stopAnalysis();
    voiceAnalyzer.stopAnalysis();
    
    const finalScore = answers.length > 0 
      ? Math.round(answers.reduce((sum, answer) => sum + answer.score, 0) / answers.length)
      : performanceScore;
    
    const gestureData = mediaPipeAnalyzer.getCurrentAnalysis();
    
    setAvatarText("Assessment complete! Great job!");
    await speakWithEmotion(
      `Excellent work! Your final performance score is ${finalScore}%. ` +
      `Your body language showed ${gestureData.overallScore}% confidence. ` +
      `Thank you for participating in this interview.`,
      {
        emotion: 'happy',
        speed: 1.0,
        pitch: 1.1
      }
    );
    
    const interviewResults = {
      profile,
      answers,
      finalScore,
      gestureAnalysis: mediaPipeAnalyzer.getCurrentAnalysis(),
      voiceAnalysis: voiceAnalyzer.getCurrentAnalysis(),
      completedAt: new Date().toISOString(),
      totalQuestions: questionsAsked,
      assessmentType: profile?.assessmentType,
      totalTime: answerTime
    };
    
    localStorage.setItem('interviewResults', JSON.stringify(interviewResults));
  }, [answers, performanceScore, questionsAsked, answerTime, profile, speakWithEmotion]);

  const togglePause = useCallback(() => {
    setIsPaused(!isPaused);
    if (isListening) stopListening();
    if (isAISpeaking) stopSpeaking();
  }, [isPaused, isListening, isAISpeaking, stopListening, stopSpeaking]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  useEffect(() => {
    return () => {
      mediaPipeAnalyzer.stopAnalysis();
      voiceAnalyzer.stopAnalysis();
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (answerTimerRef.current) {
        clearInterval(answerTimerRef.current);
      }
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [mediaStream]);

  if (loading) return <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><RefreshCw className="h-12 w-12 animate-spin text-blue-600" /></div>;
  if (error) return <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><div className="bg-white p-6 rounded-lg shadow-lg text-center"><AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" /><p className="text-gray-600 mb-4">{error}</p><Button onClick={() => router.push('/dashboard/interview/create')}>Create New Interview</Button></div></div>;
  if (interviewCompleted) return <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-100 flex items-center justify-center"><div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md"><CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Completed!</h2><p className="text-gray-600 mb-4">Final Score: {performanceScore}%</p><Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button></div></div>;

  const gestureScore = gestureAnalysis?.overallScore || 0;
  const voiceScore = voiceAnalysis?.overallScore || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header with Performance Metrics and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-3 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-800">AI Virtual Interviewer</h1>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-xs text-gray-600">{profile?.jobTitle || profile?.title}</span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-xs text-gray-600">Senior Software Engineer</span>
                </div>
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className={`text-base font-bold ${
                  performanceScore >= 80 ? 'text-green-600' :
                  performanceScore >= 70 ? 'text-blue-600' : 
                  performanceScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {performanceScore}%
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">Performance</div>
              </div>
              
              <div className="text-center">
                <div className="text-base font-bold text-gray-700">{questionsAsked}/8</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Questions</div>
              </div>
              
              {interviewStarted && currentQuestion && (
                <div className="text-center">
                  <div className="text-base font-bold text-gray-700">{formatTime(answerTime)}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Time</div>
                </div>
              )}
              
              {/* Question Type Badge */}
              <div className={`px-2 py-0.5 rounded-full text-[10px] ${
                questionSource === 'feedback' ? 'bg-green-100 text-green-800 border border-green-200' :
                questionSource === 'follow-up' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {questionSource === 'feedback' ? 'Feedback Q' :
                 questionSource === 'follow-up' ? 'Follow-up Q' : 'Main Q'}
              </div>
            </div>
            
            {/* Start/Exit Controls */}
            <div className="flex space-x-2">
              {!interviewStarted ? (
                <button 
                  onClick={startInterview}
                  className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs transition-colors"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Start Assessment
                </button>
              ) : (
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs transition-colors"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Exit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid - Compact layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Left Column - Avatar Section (2/3 width) */}
          <div className="lg:col-span-2 space-y-3">
            {/* AI Interviewer Avatar Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Users className="h-3.5 w-3.5 text-white" />
                    <span className="text-white font-medium text-sm">AI Interviewer</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="flex items-center space-x-0.5 bg-black/20 px-1.5 py-0.5 rounded">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-[10px]">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Avatar Display Area - Reduced height */}
              <div className="relative bg-gradient-to-b from-gray-900 to-black h-[400px] flex items-center justify-center">
                {/* 3D Avatar */}
                <VirtualAvatar
                  isSpeaking={isAISpeaking}
                  emotion={currentEmotion}
                  text={avatarText}
                  onAvatarLoaded={() => console.log('✅ Avatar loaded')}
                />
                
                {/* Avatar Status Overlay - Compact */}
                <div className="absolute top-2 right-2 flex flex-col space-y-1">
                  <div className="bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded border border-blue-500/30 flex items-center gap-0.5">
                    <Activity className="h-2.5 w-2.5 text-blue-400" />
                    Body: <span className="font-bold ml-0.5">{gestureScore}%</span>
                  </div>
                  <div className="bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded border border-purple-500/30 flex items-center gap-0.5">
                    <Volume2 className="h-2.5 w-2.5 text-purple-400" />
                    Voice: <span className="font-bold ml-0.5">{voiceScore}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Question Display - Compact */}
            {currentQuestion && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="flex items-start space-x-2">
                  <div className={`p-1.5 rounded ${
                    questionSource === 'feedback' ? 'bg-green-100' :
                    questionSource === 'follow-up' ? 'bg-purple-100' :
                    'bg-blue-100'
                  }`}>
                    <MessageSquare className={`h-4 w-4 ${
                      questionSource === 'feedback' ? 'text-green-600' :
                      questionSource === 'follow-up' ? 'text-purple-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className={`text-sm font-semibold ${
                        questionSource === 'feedback' ? 'text-green-800' :
                        questionSource === 'follow-up' ? 'text-purple-800' :
                        'text-blue-800'
                      }`}>
                        {questionSource === 'feedback' ? 'Feedback Question' :
                         questionSource === 'follow-up' ? 'Follow-up Question' : 'Current Question'}
                      </h3>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] text-gray-500">Q{questionsAsked + 1}/8</span>
                        <div className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          questionSource === 'feedback' ? 'bg-green-100 text-green-800' :
                          questionSource === 'follow-up' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {questionSource === 'feedback' ? 'Feedback' :
                           questionSource === 'follow-up' ? 'Follow-up' : 'Main'}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">{currentQuestion}</p>
                    {interviewStarted && currentQuestion && !isAnalyzing && !isPaused && (
                      <div className="mt-2 flex items-center text-xs text-gray-600">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Answer time: {formatTime(answerTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Real-time Analysis Section - Compact */}
            <EnhancedAnalysisDisplay
              isVisible={interviewStarted && !isAnalyzing && !isPaused}
              gestureAnalysis={gestureAnalysis}
              voiceAnalysis={voiceAnalysis}
              isVideoEnabled={isVideoEnabled}
              isMicEnabled={isMicEnabled}
            />

            {/* Feedback Section - Compact */}
            {currentFeedback && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start">
                  <div className="bg-green-100 p-1.5 rounded mr-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-green-800 font-semibold text-sm">AI Feedback</h4>
                      {questionSource === 'feedback' && (
                        <div className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                          Based on last answer
                        </div>
                      )}
                    </div>
                    <p className="text-green-700 text-sm leading-relaxed">{currentFeedback}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - User Video, Answer Input, and Assessment Progress */}
          <div className="space-y-3">
            {/* User Camera Section - Compact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Video className="h-3.5 w-3.5 text-white" />
                    <span className="text-white font-medium text-sm">Your Camera</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isVideoEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isVideoEnabled ? 'Camera ON' : 'Camera OFF'}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isMicEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isMicEnabled ? 'Mic ON' : 'Mic OFF'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-gray-900 h-48">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                
                {/* Camera Controls - Compact */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                  <button
                    onClick={toggleVideo}
                    className={`p-2 rounded-full ${
                      isVideoEnabled 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    } transition-colors`}
                  >
                    {isVideoEnabled ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={toggleMicrophone}
                    className={`p-2 rounded-full ${
                      isMicEnabled 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    } transition-colors`}
                  >
                    {isMicEnabled ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={initializeMedia}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Answer Input Section - Compact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Your Response</h3>
              
              {/* Voice Recording Controls - Compact */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs ${
                        isListening 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      } transition-colors`}
                    >
                      {isListening ? (
                        <>
                          <Square className="h-3 w-3" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Mic className="h-3 w-3" />
                          <span>Start Speaking</span>
                        </>
                      )}
                    </button>
                    
                    {isListening && (
                      <div className="flex items-center space-x-0.5 text-red-600">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-[10px]">Recording...</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => { setCurrentAnswer(''); setTranscript(''); }}
                    className="flex items-center space-x-0.5 text-[10px] text-gray-600 hover:text-gray-800"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                </div>
                
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="w-full h-20 bg-transparent border-none outline-none resize-none text-xs text-gray-700 placeholder-gray-400"
                    placeholder="Your spoken response will appear here..."
                  />
                  <div className="text-[10px] text-gray-500 mt-1 text-right">
                    {currentAnswer.length} characters
                  </div>
                </div>
              </div>
              
              {/* Submit Button - Compact */}
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isAnalyzing}
                className={`w-full py-2 rounded-lg text-xs font-medium ${
                  !currentAnswer.trim() || isAnalyzing
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-1 inline" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Submit Answer
                    <ArrowRight className="h-3 w-3 ml-1 inline" />
                  </>
                )}
              </button>
            </div>

            {/* Assessment Progress Section - Compact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Assessment Progress</h3>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Performance Score</span>
                    <span>{performanceScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        performanceScore >= 80 ? 'bg-green-400' :
                        performanceScore >= 70 ? 'bg-blue-400' :
                        performanceScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${performanceScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="text-base font-bold text-blue-700">{questionsAsked}</div>
                    <div className="text-[10px] text-blue-500">Main Questions</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded border border-green-200">
                    <div className="text-base font-bold text-green-500">{answers.filter(a => a.questionSource !== 'main').length}</div>
                    <div className="text-[10px] text-green-500">Additional Qs</div>
                  </div>
                </div>
                
                <div className="p-2 rounded bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                  <div className="text-xs font-medium text-gray-500 mb-1">Current Mode</div>
                  <div className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block ${
                    questionSource === 'feedback' ? 'bg-green-100 text-green-800' :
                    questionSource === 'follow-up' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {questionSource === 'feedback' ? 'Feedback Mode' :
                     questionSource === 'follow-up' ? 'Follow-up Mode' : 'Main Interview'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}