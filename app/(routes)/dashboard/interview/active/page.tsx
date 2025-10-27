'use client';
if (!AbortSignal.timeout) {
  AbortSignal.timeout = function(ms) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new Error('Timeout')), ms);
    return controller.signal;
  };
}

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mic, 
  MicOff, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Brain,
  AlertCircle,
  Play,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ArrowLeft,
  Save,
  Pause,
  StopCircle,
  Zap,
  User,
  Briefcase,
  Award,
  Star,
  Maximize2,
  Minimize2,
  Square,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react';

// Add type declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Enhanced Types for Real Analysis
interface GestureAnalysis {
  eyeContact: number;
  posture: number;
  headMovement: number;
  smiling: number;
  attention: number;
  gestures: number;
}

interface VoiceAnalysis {
  volume: number;
  clarity: number;
  pace: number;
  tone: number;
  fillerWords: number;
  pauses: number;
  confidence: number;
}

interface BehavioralAnalysis {
  score: number;
  eyeContact: number;
  posture: number;
  gestures: number;
  facialExpressions: number;
  confidenceLevel: number;
  engagement: number;
  professionalism: number;
  analysis: {
    gazeDirection: number[];
    headPose: number[];
    smileIntensity: number;
    gestureFrequency: number;
  };
}

interface ComprehensiveFeedback {
  contentScore: number;
  behavioralScore: number;
  voiceScore: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  contentAnalysis: {
    relevance: number;
    structure: number;
    examples: number;
    depth: number;
  };
  behavioralAnalysis: BehavioralAnalysis;
  voiceAnalysis: VoiceAnalysis;
  specificSuggestions: {
    content: string[];
    delivery: string[];
    behavior: string[];
  };
}

interface Question {
  id: string;
  question: string;
  type: 'introduction' | 'technical' | 'behavioral' | 'situational' | 'problem-solving' | 'domain-specific' | 'follow-up' | 'probing' | 'skill-assessment';
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  fieldRelevant?: boolean;
  reasoning?: string;
  followsUp?: boolean;
  skillFocus?: string[];
  followUpCount?: number;
  isFollowUp?: boolean;
  parentQuestionId?: string;
}

interface Answer {
  questionId: string;
  answer: string;
  timestamp: string;
  score?: number;
  audioBlob?: Blob;
  aiEvaluation?: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    skillAssessment: { [key: string]: number };
    detailedFeedback: string;
    confidenceLevel: number;
    behavioralAnalysis?: BehavioralAnalysis;
    voiceAnalysis?: VoiceAnalysis;
    comprehensiveFeedback?: ComprehensiveFeedback;
    interviewerResponse: string;
    correctedAnswer: string;
    expectedAnswer: string;
    followUpQuestion?: string;
    contentScore?: number;
    behavioralScore?: number;
    voiceScore?: number;
  };
}

interface InterviewProfile {
  jobTitle: string;
  jobDescription: string;
  companyName?: string;
  experience: string;
  skills: string[];
  fieldCategory?: string;
  userName?: string;
  assessmentType?: string;
  subject?: string;
  domain?: string;
}

interface InterviewState {
  performanceScore: number;
  skillProficiency: { [key: string]: number };
  difficultyLevel: 'easy' | 'medium' | 'hard';
  answeredQuestions: number;
  conversationContext: string[];
  weakAreas: string[];
  strongAreas: string[];
  adaptiveInsights: string[];
  interviewStage: 'introduction' | 'skill-assessment' | 'technical-evaluation' | 'behavioral-assessment' | 'closing';
  userName?: string;
  currentFollowUpCount: number;
  currentMainQuestionId?: string;
  currentQuestionHasFollowUps?: boolean;
}

interface ActiveInterview {
  profile: InterviewProfile;
  questions: Question[];
  startTime: string;
  currentQuestionIndex: number;
  answers: Answer[];
  isActive: boolean;
  type: string;
  isDynamic?: boolean;
}
// Add this near the top with other constants, around line 50-60
const MAX_MAIN_QUESTIONS = 10;
const MAX_FOLLOW_UPS_PER_QUESTION = 3; // Add this line

// Enhanced Types for Real Analysis
interface GestureAnalysis {
  eyeContact: number;
  posture: number;
  headMovement: number;
  smiling: number;
  attention: number;
  gestures: number;
}

// Add proper MediaPipe type declarations
declare global {
  interface Window {
    FaceMesh: any;
    Pose: any;
    Hands: any;
    camera: any;
    drawConnectors: any;
    drawLandmarks: any;
  }
}

// Enhanced Types for Real Analysis
interface GestureAnalysis {
  eyeContact: number;
  posture: number;
  headMovement: number;
  smiling: number;
  attention: number;
  gestures: number;
}

interface VoiceAnalysis {
  volume: number;
  clarity: number;
  pace: number;
  tone: number;
  fillerWords: number;
  pauses: number;
  confidence: number;
}

interface BehavioralAnalysis {
  score: number;
  eyeContact: number;
  posture: number;
  gestures: number;
  facialExpressions: number;
  confidenceLevel: number;
  engagement: number;
  professionalism: number;
  analysis: {
    gazeDirection: number[];
    headPose: number[];
    smileIntensity: number;
    gestureFrequency: number;
  };
}
// Simplified and Robust RealTimeAnalyzer
// Enhanced RealTimeAnalyzer with MediaPipe
// Enhanced RealTimeAnalyzer with MediaPipe - CORRECTED VERSION
class RealTimeAnalyzer {
  private faceMesh: any = null;
  private pose: any = null;
  private hands: any = null;
  private isInitialized = false;
  private analysisInterval: NodeJS.Timeout | null = null;
  
  // MediaPipe elements
  private canvas: HTMLCanvasElement | null = null;
  private canvasCtx: CanvasRenderingContext2D | null = null;
  
  // Audio analysis components - ADD THESE MISSING PROPERTIES
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private isAudioContextClosed = false;
  private hasUserSpoken: boolean = false;
  private wordCount: number = 0;
  private speechStartTime: number = 0;
  private mediaStream: MediaStream | null = null;

  // Data storage - ADD THESE MISSING PROPERTIES
  private gestureData: GestureAnalysis = {
    eyeContact: 50,
    posture: 60,
    headMovement: 40,
    smiling: 30,
    attention: 70,
    gestures: 35
  };

  private voiceData: VoiceAnalysis = {
    volume: 0,
    clarity: 0,
    pace: 150,
    tone: 0,
    fillerWords: 0,
    pauses: 0,
    confidence: 0
  };

  async initialize() {
    try {
      console.log('🎯 Initializing MediaPipe RealTimeAnalyzer');
      
      // Load MediaPipe scripts dynamically
      await this.loadMediaPipeScripts();
      
      // Initialize MediaPipe solutions
      await this.initializeMediaPipe();
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing MediaPipe analyzer:', error);
      return false;
    }
  }

  private async loadMediaPipeScripts() {
    const scripts = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
    ];

    for (const src of scripts) {
      await new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => {
          console.warn(`Failed to load script: ${src}`);
          resolve(true); // Continue even if one script fails
        };
        document.head.appendChild(script);
      });
    }
  }

  private async initializeMediaPipe() {
    // Check if MediaPipe is available
    if (!window.FaceMesh || !window.Pose || !window.Hands) {
      console.warn('MediaPipe not available, using fallback analysis');
      return;
    }

    // Initialize Face Mesh
    this.faceMesh = new window.FaceMesh({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    });

    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // Initialize Pose
    this.pose = new window.Pose({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // Initialize Hands
    this.hands = new window.Hands({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  }

  // Real video analysis with MediaPipe
  async analyzeVideoFrame(videoElement: HTMLVideoElement): Promise<GestureAnalysis> {
    if (!this.isInitialized || !videoElement || videoElement.readyState < 2) {
      return this.getFallbackGestureAnalysis();
    }

    try {
      // Create canvas if not exists
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvas.width = videoElement.videoWidth;
        this.canvas.height = videoElement.videoHeight;
      }

      // Draw video frame to canvas
      this.canvasCtx!.drawImage(videoElement, 0, 0, this.canvas.width, this.canvas.height);

      // Convert to image data for MediaPipe
      const imageData = this.canvasCtx!.getImageData(0, 0, this.canvas.width, this.canvas.height);
      
      // Run MediaPipe analysis if available, otherwise use fallback
      if (this.faceMesh && this.pose && this.hands) {
        const [faceResults, poseResults, handsResults] = await Promise.all([
          this.analyzeFace(imageData),
          this.analyzePose(imageData),
          this.analyzeHands(imageData)
        ]);

        // Combine results for comprehensive analysis
        return this.combineMediaPipeResults(faceResults, poseResults, handsResults);
      } else {
        // Fallback analysis without MediaPipe
        return this.getFallbackGestureAnalysis();
      }

    } catch (error) {
      console.warn('MediaPipe analysis failed:', error);
      return this.getFallbackGestureAnalysis();
    }
  }

  private async analyzeFace(imageData: ImageData): Promise<any> {
    return new Promise((resolve) => {
      if (!this.faceMesh) {
        resolve(null);
        return;
      }

      this.faceMesh.onResults((results: any) => {
        resolve(results);
      });

      this.faceMesh.send({ image: imageData });
    });
  }

  private async analyzePose(imageData: ImageData): Promise<any> {
    return new Promise((resolve) => {
      if (!this.pose) {
        resolve(null);
        return;
      }

      this.pose.onResults((results: any) => {
        resolve(results);
      });

      this.pose.send({ image: imageData });
    });
  }

  private async analyzeHands(imageData: ImageData): Promise<any> {
    return new Promise((resolve) => {
      if (!this.hands) {
        resolve(null);
        return;
      }

      this.hands.onResults((results: any) => {
        resolve(results);
      });

      this.hands.send({ image: imageData });
    });
  }

  private combineMediaPipeResults(faceResults: any, poseResults: any, handsResults: any): GestureAnalysis {
    let eyeContact = 50;
    let posture = 60;
    let headMovement = 40;
    let smiling = 30;
    let attention = 70;
    let gestures = 35;

    // Analyze face results
    if (faceResults && faceResults.multiFaceLandmarks && faceResults.multiFaceLandmarks.length > 0) {
      const faceLandmarks = faceResults.multiFaceLandmarks[0];
      
      // Eye contact analysis (simplified - check if face is facing forward)
      const noseTip = faceLandmarks[1]; // Nose tip
      const leftEye = faceLandmarks[33]; // Left eye corner
      const rightEye = faceLandmarks[263]; // Right eye corner
      
      if (noseTip && leftEye && rightEye) {
        const eyeDistance = Math.abs(leftEye.x - rightEye.x);
        const faceCentered = Math.abs(noseTip.x - 0.5) < 0.2; // Face centered in frame
        eyeContact = faceCentered ? 85 : 40;
      }

      // Smile detection (mouth corners)
      const leftMouth = faceLandmarks[61];
      const rightMouth = faceLandmarks[291];
      if (leftMouth && rightMouth) {
        const mouthOpenness = Math.abs(leftMouth.y - rightMouth.y);
        smiling = Math.min(100, mouthOpenness * 200);
      }
    }

    // Analyze pose results
    if (poseResults && poseResults.poseLandmarks) {
      const landmarks = poseResults.poseLandmarks;
      
      // Posture analysis (shoulder and spine alignment)
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const nose = landmarks[0];
      
      if (leftShoulder && rightShoulder && nose) {
        const shoulderAlignment = Math.abs(leftShoulder.y - rightShoulder.y);
        const spineStraight = shoulderAlignment < 0.1; // Shoulders level
        posture = spineStraight ? 80 : 50;
      }

      // Head movement (nose position variability)
      headMovement = Math.min(100, Math.abs(nose.x - 0.5) * 150);
    }

    // Analyze hand gestures
    if (handsResults && handsResults.multiHandLandmarks) {
      const handCount = handsResults.multiHandLandmarks.length;
      let handMovement = 0;

      handsResults.multiHandLandmarks.forEach((hand: any) => {
        // Calculate hand movement based on landmark positions
        const wrist = hand[0];
        const thumbTip = hand[4];
        const indexTip = hand[8];
        
        if (wrist && thumbTip && indexTip) {
          const thumbDistance = Math.sqrt(
            Math.pow(thumbTip.x - wrist.x, 2) + 
            Math.pow(thumbTip.y - wrist.y, 2)
          );
          handMovement += thumbDistance * 100;
        }
      });

      gestures = Math.min(100, handMovement * 2 + handCount * 20);
    }

    // Attention score based on multiple factors
    attention = Math.min(100, (eyeContact * 0.4 + posture * 0.3 + (100 - headMovement) * 0.3));

    return {
      eyeContact: Math.max(20, Math.min(100, eyeContact)),
      posture: Math.max(30, Math.min(100, posture)),
      headMovement: Math.max(10, Math.min(100, headMovement)),
      smiling: Math.max(15, Math.min(100, smiling)),
      attention: Math.max(40, Math.min(100, attention)),
      gestures: Math.max(20, Math.min(100, gestures))
    };
  }

  // Enhanced audio analysis with Web Audio API
  analyzeAudio(audioStream: MediaStream): VoiceAnalysis {
    if (!this.isInitialized || !audioStream.active) {
      return this.getFallbackVoiceAnalysis();
    }

    try {
      // Initialize audio context if needed
      if (!this.audioContext || this.isAudioContextClosed) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.isAudioContextClosed = false;
      }

      if (!this.analyzer) {
        const source = this.audioContext.createMediaStreamSource(audioStream);
        this.analyzer = this.audioContext.createAnalyser();
        this.analyzer.fftSize = 2048;
        this.analyzer.smoothingTimeConstant = 0.8;
        source.connect(this.analyzer);
      }

      const bufferLength = this.analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const timeDomainArray = new Uint8Array(bufferLength);
      
      // Get frequency data for volume analysis
      this.analyzer.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      
      // Get time domain data for clarity analysis
      this.analyzer.getByteTimeDomainData(timeDomainArray);
      
      // Convert to actual audio samples
      const samples = new Float32Array(timeDomainArray.length);
      for (let i = 0; i < timeDomainArray.length; i++) {
        samples[i] = (timeDomainArray[i] - 128) / 128.0;
      }
      
      // Calculate audio metrics
      const clarity = this.calculateClarity(samples);
      const tone = this.analyzePitch(samples);
      const isSpeaking = this.detectSpeech(samples, volume);
      
      // Update confidence based on speaking activity
      let confidence = this.voiceData.confidence;
      if (isSpeaking) {
        this.hasUserSpoken = true;
        confidence = Math.min(100, (volume * 0.3 + clarity * 0.4 + tone * 0.3) * 100);
      } else if (this.hasUserSpoken) {
        confidence = Math.max(0, confidence * 0.98); // Gradual decay
      }
      
      return {
        volume: Math.min(100, (volume / 256) * 200),
        clarity: Math.min(100, clarity * 100),
        pace: this.voiceData.pace,
        tone: Math.min(100, tone * 100),
        fillerWords: this.voiceData.fillerWords,
        pauses: this.voiceData.pauses,
        confidence: confidence
      };
    } catch (error) {
      console.error('Audio analysis error:', error);
      return this.getFallbackVoiceAnalysis();
    }
  }

  private detectSpeech(samples: Float32Array, volume: number): boolean {
    // Calculate RMS for speech detection
    let sumSquared = 0;
    for (let i = 0; i < samples.length; i++) {
      sumSquared += samples[i] * samples[i];
    }
    const rms = Math.sqrt(sumSquared / samples.length);
    
    // Speech is detected if there's significant audio activity
    return volume > 15 && rms > 0.02;
  }

  private analyzePitch(samples: Float32Array): number {
    // Zero-crossing rate as simple pitch indicator
    let zeroCrossings = 0;
    for (let i = 1; i < samples.length; i++) {
      if ((samples[i-1] <= 0 && samples[i] > 0) || (samples[i-1] >= 0 && samples[i] < 0)) {
        zeroCrossings++;
      }
    }
    const zeroCrossingRate = zeroCrossings / samples.length;
    return Math.min(1, zeroCrossingRate * 8);
  }

  private calculateClarity(samples: Float32Array): number {
    // Calculate signal-to-noise ratio approximation
    let peak = 0;
    let rms = 0;
    
    for (let i = 0; i < samples.length; i++) {
      const absSample = Math.abs(samples[i]);
      if (absSample > peak) peak = absSample;
      rms += samples[i] * samples[i];
    }
    
    rms = Math.sqrt(rms / samples.length);
    
    // Clarity is higher when peak-to-RMS ratio is good
    const clarity = peak > 0 ? Math.min(1, (peak + rms) * 2) : 0;
    return clarity;
  }

  // ADD THESE MISSING METHODS
  updateSpeechMetrics(transcript: string, duration: number) {
    const words = transcript.split(/\s+/).filter(word => word.length > 0);
    this.wordCount = words.length;
    
    if (words.length > 0) {
      this.hasUserSpoken = true;
    }
    
    // Calculate speaking pace (words per minute)
    if (duration > 0 && words.length > 3) {
      this.voiceData.pace = Math.max(50, Math.min(300, (words.length / duration) * 60));
    }
    
    // Detect filler words
    const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically'];
    const fillerCount = words.filter(word => 
      fillerWords.includes(word.toLowerCase().replace(/[.,!?;:]/g, ''))
    ).length;
    
    this.voiceData.fillerWords = fillerCount;
    
    // Detect pauses
    const pauseCount = (transcript.match(/[.!?]/g) || []).length;
    this.voiceData.pauses = pauseCount;
  }

  resetUserSpeech() {
    this.hasUserSpoken = false;
    this.voiceData.confidence = 0;
    this.voiceData.pace = 150;
    this.voiceData.fillerWords = 0;
    this.voiceData.pauses = 0;
    this.wordCount = 0;
  }

  getUserEngagementLevel(): number {
    const currentAnalysis = this.getCurrentAnalysis();
    if (!this.isUserActuallySpeaking()) {
      return 0;
    }
    
    return Math.round(
      (currentAnalysis.gestures.attention * 0.4) +
      (currentAnalysis.gestures.eyeContact * 0.3) +
      (currentAnalysis.gestures.posture * 0.3)
    );
  }

  isUserActuallySpeaking(): boolean {
    const currentAnalysis = this.getCurrentAnalysis();
    return currentAnalysis.voice.volume > 25 && 
           currentAnalysis.voice.confidence > 40 &&
           this.hasUserSpoken;
  }

  startRealTimeAnalysis(videoElement: HTMLVideoElement, audioStream: MediaStream) {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }

    this.mediaStream = audioStream;

    this.analysisInterval = setInterval(async () => {
      try {
        // Analyze audio if stream is active
        if (audioStream.active) {
          const voiceAnalysis = this.analyzeAudio(audioStream);
          this.voiceData = { ...this.voiceData, ...voiceAnalysis };
        }
        
        // Analyze video with MediaPipe
        if (videoElement && videoElement.readyState >= 2) {
          const gestureAnalysis = await this.analyzeVideoFrame(videoElement);
          this.gestureData = gestureAnalysis;
        }
      } catch (error) {
        console.warn('Real-time analysis warning:', error);
      }
    }, 500); // Analyze every 500ms for better performance
  }

  stopAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    if (this.audioContext && !this.isAudioContextClosed) {
      this.audioContext.close().then(() => {
        this.isAudioContextClosed = true;
        this.analyzer = null;
      }).catch(console.warn);
    }
  }

  getCurrentAnalysis(): { gestures: GestureAnalysis; voice: VoiceAnalysis } {
    return {
      gestures: this.gestureData,
      voice: this.voiceData
    };
  }

  private getFallbackGestureAnalysis(): GestureAnalysis {
    return {
      eyeContact: 50,
      posture: 60,
      headMovement: 40,
      smiling: 30,
      attention: 70,
      gestures: 35
    };
  }

  private getFallbackVoiceAnalysis(): VoiceAnalysis {
    return {
      volume: 0,
      clarity: 0,
      pace: 0,
      tone: 0,
      fillerWords: 0,
      pauses: 0,
      confidence: 0
    };
  }
}
// Initialize the real-time analyzer
const realTimeAnalyzer = new RealTimeAnalyzer();

// Components
const Button = ({ children, onClick, disabled, className, ...props }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className || ''}`}
    {...props}
  >
    {children}
  </button>
);

const Textarea = ({ placeholder, onChange, className, value, ...props }: any) => (
  <textarea
    placeholder={placeholder}
    onChange={onChange}
    value={value}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${className || ''}`}
    rows={6}
    {...props}
  />
);

// Fixed Video Interviewer Component
const VideoInterviewer = ({ 
  isSpeaking, 
  currentQuestion, 
  onVideoEnd,
  isVideoEnabled = true,
  shouldShowVideo = true,
  isUserAnswering = false
}: { 
  isSpeaking: boolean;
  currentQuestion: string;
  onVideoEnd: () => void;
  isVideoEnabled?: boolean;
  shouldShowVideo?: boolean;
  isUserAnswering?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isVideoLoaded) return;

    const playVideo = async () => {
      try {
        if (videoElement.currentTime >= videoElement.duration - 1) {
          videoElement.currentTime = 0;
        }
        
        if (videoElement.readyState >= 2) {
          await videoElement.play();
          setIsVideoPlaying(true);
        }
      } catch (error) {
        console.warn('Video play failed:', error);
        setVideoError(true);
        setIsVideoPlaying(false);
      }
    };

    const pauseVideo = () => {
      if (videoElement) {
        videoElement.pause();
        setIsVideoPlaying(false);
      }
    };

    if (isVideoEnabled && shouldShowVideo && isSpeaking) {
      playVideo();
    } else if (isUserAnswering) {
      pauseVideo();
    }

  }, [isVideoEnabled, shouldShowVideo, isVideoLoaded, isSpeaking, isUserAnswering]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVideoEnd = () => {
      if (videoElement) {
        videoElement.currentTime = 0;
        if (isVideoEnabled && shouldShowVideo && isSpeaking) {
          videoElement.play().catch(console.warn);
        }
      }
    };

    videoElement.addEventListener('ended', handleVideoEnd);

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [isVideoEnabled, shouldShowVideo, isSpeaking]);

  const handleVideoError = () => {
    setVideoError(true);
    setIsVideoPlaying(false);
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    setVideoError(false);
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden w-full h-full">
      {isVideoEnabled && shouldShowVideo && !videoError ? (
        <>
          <video
            ref={videoRef}
            src="/videos/interviewer-question.mp4"
            muted
            playsInline
            loop
            preload="metadata"
            className="w-full h-full object-cover"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onCanPlay={handleVideoLoad}
          />
          
          {!isVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Loading AI Roleplay...</p>
              </div>
            </div>
          )}

          {isVideoPlaying && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Live
            </div>
          )}

          {isUserAnswering && (
            <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Your Turn
            </div>
          )}

          {isSpeaking && !isUserAnswering && (
            <div className="absolute top-3 left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              AI Speaking
            </div>
          )}

          {currentQuestion && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4">
              <p className="text-white text-sm text-center">
                {currentQuestion}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-800">
          <div className="text-center text-white p-4">
            <User className="h-12 w-12 mx-auto mb-3 opacity-80" />
            <p className="text-lg font-semibold mb-1">Talkgenious AI</p>
            <p className="text-xs opacity-75 mb-4">AI-Powered Assessment</p>
            
            {currentQuestion && (
              <div className="mt-4 p-3 bg-black bg-opacity-50 rounded-lg max-w-md">
                <p className="text-sm">{currentQuestion}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
// FIXED: Comprehensive AI Assessment with proper layout
const ComprehensiveFeedbackDisplay = ({ 
  feedback, 
  isVisible,
  onClose 
}: { 
  feedback: ComprehensiveFeedback; 
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible || !feedback) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 rounded-lg shadow-lg mb-6 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header - Always Visible */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-600" />
            <div>
              <h4 className="text-blue-800 font-semibold text-lg">Comprehensive AI Assessment</h4>
              <p className="text-blue-600 text-sm">Real-time performance analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors border border-gray-300"
              title={isExpanded ? 'Collapse Details' : 'Expand Details'}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button 
              onClick={onClose}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 bg-white">
          {/* Overall Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200 text-center">
              <div className={`text-xl font-bold ${
                feedback.overallScore >= 80 ? 'text-green-600' :
                feedback.overallScore >= 70 ? 'text-blue-600' : 
                feedback.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {feedback.overallScore}%
              </div>
              <div className="text-xs text-gray-600 font-medium">Overall</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200 text-center">
              <div className={`text-lg font-bold ${
                feedback.contentScore >= 80 ? 'text-green-600' :
                feedback.contentScore >= 70 ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {feedback.contentScore}%
              </div>
              <div className="text-xs text-gray-600 font-medium">Content</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200 text-center">
              <div className={`text-lg font-bold ${
                feedback.voiceScore >= 80 ? 'text-green-600' :
                feedback.voiceScore >= 70 ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {feedback.voiceScore}%
              </div>
              <div className="text-xs text-gray-600 font-medium">Delivery</div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-3 rounded-lg border border-teal-200 text-center">
              <div className={`text-lg font-bold ${
                feedback.behavioralScore >= 80 ? 'text-green-600' :
                feedback.behavioralScore >= 70 ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {feedback.behavioralScore}%
              </div>
              <div className="text-xs text-gray-600 font-medium">Behavior</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            <div className="bg-gray-50 p-2 rounded border">
              <div className="text-sm font-bold text-gray-800">
                {Math.round(feedback.contentAnalysis.relevance)}%
              </div>
              <div className="text-xs text-gray-600">Relevance</div>
            </div>
            <div className="bg-gray-50 p-2 rounded border">
              <div className="text-sm font-bold text-gray-800">
                {Math.round(feedback.contentAnalysis.structure)}%
              </div>
              <div className="text-xs text-gray-600">Structure</div>
            </div>
            <div className="bg-gray-50 p-2 rounded border">
              <div className="text-sm font-bold text-gray-800">
                {Math.round(feedback.contentAnalysis.examples)}%
              </div>
              <div className="text-xs text-gray-600">Examples</div>
            </div>
          </div>

          {/* Expandable Detailed Analysis */}
          {isExpanded && (
            <div className="border-t pt-4 mt-4 space-y-4">
              {/* Voice & Behavior Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h5 className="text-blue-700 font-medium mb-2 text-sm flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Voice Analysis
                  </h5>
                  <div className="space-y-2 text-xs">
                    {Object.entries(feedback.voiceAnalysis).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 w-10 text-right">
                            {typeof value === 'number' ? Math.round(value) + (key === 'pace' ? '' : '%') : value}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full bg-blue-500"
                              style={{ width: `${Math.min(100, typeof value === 'number' ? value : 0)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h5 className="text-green-700 font-medium mb-2 text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Behavior Analysis
                  </h5>
                  <div className="space-y-2 text-xs">
                    {Object.entries(feedback.behavioralAnalysis).map(([key, value]) => {
                      if (key === 'analysis') return null;
                      return (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800 w-10 text-right">
                              {typeof value === 'number' ? Math.round(value) + '%' : value}
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-green-500"
                                style={{ width: `${Math.min(100, typeof value === 'number' ? value : 0)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                  <h5 className="text-green-700 font-medium mb-2 text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h5>
                  <ul className="text-green-800 text-xs space-y-1">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 mr-2 flex-shrink-0"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200">
                  <h5 className="text-orange-700 font-medium mb-2 text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Improvements
                  </h5>
                  <ul className="text-orange-800 text-xs space-y-1">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 mr-2 flex-shrink-0"></span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Specific Suggestions */}
              {feedback.specificSuggestions && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200">
                  <h5 className="text-purple-700 font-medium mb-2 text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Specific Suggestions
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {feedback.specificSuggestions.content.length > 0 && (
                      <div>
                        <h6 className="text-purple-600 font-medium mb-1">Content Tips</h6>
                        <ul className="text-purple-700 space-y-0.5">
                          {feedback.specificSuggestions.content.slice(0, 2).map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {feedback.specificSuggestions.delivery.length > 0 && (
                      <div>
                        <h6 className="text-blue-600 font-medium mb-1">Voice & Delivery</h6>
                        <ul className="text-blue-700 space-y-0.5">
                          {feedback.specificSuggestions.delivery.slice(0, 2).map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {feedback.specificSuggestions.behavior.length > 0 && (
                      <div>
                        <h6 className="text-teal-600 font-medium mb-1">Body Language</h6>
                        <ul className="text-teal-700 space-y-0.5">
                          {feedback.specificSuggestions.behavior.slice(0, 2).map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assessment Summary - Always Visible */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border border-gray-200 mt-3">
            <h5 className="text-gray-700 font-medium mb-1 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Assessment Summary
            </h5>
            <p className="text-gray-800 text-xs leading-relaxed">
              {feedback.detailedFeedback}
            </p>
            {!isExpanded && (
              <button 
                onClick={() => setIsExpanded(true)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-2 flex items-center gap-1"
              >
                Show detailed analysis <Maximize2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
// Enhanced CorrectedAnswerDisplay Component with 30-second timer
const CorrectedAnswerDisplay = ({ 
  correctedAnswer, 
  expectedAnswer, 
  isVisible,
  onClose,
  autoCloseDelay = 30000 // 30 seconds default
}: { 
  correctedAnswer: string; 
  expectedAnswer: string; 
  isVisible: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
}) => {
  const [timeLeft, setTimeLeft] = useState(autoCloseDelay / 1000);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      setTimeLeft(autoCloseDelay / 1000);
      
      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isVisible, onClose, autoCloseDelay]);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-400 p-6 mb-6 rounded-lg shadow-lg">
      <div className="flex items-start">
        <CheckCircle className="h-7 w-7 text-green-600 mr-4 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-green-800 font-semibold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              How to Improve Your Answer
              <span className="text-sm font-normal text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Auto-closes in: {timeLeft}s
              </span>
            </h4>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm bg-white px-3 py-1 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              Close Now
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
              <h5 className="text-green-700 font-medium mb-3 text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Suggested Improvement
              </h5>
              <div className="bg-green-50 p-4 rounded border-l-4 border-green-400">
                <p className="text-green-800 text-sm leading-relaxed">{correctedAnswer}</p>
              </div>
              <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-700">
                💡 <strong>Pro Tip:</strong> Focus on specific examples and measurable outcomes
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
              <h5 className="text-blue-700 font-medium mb-3 text-sm flex items-center gap-2">
                <Star className="h-4 w-4" />
                Ideal Answer Structure
              </h5>
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                <p className="text-blue-800 text-sm leading-relaxed">{expectedAnswer}</p>
              </div>
              <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
                🎯 <strong>Remember:</strong> Use the STAR method (Situation, Task, Action, Result)
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <div className="font-medium text-yellow-700 mb-1">Content Tips</div>
              <ul className="text-yellow-600 space-y-1">
                <li>• Include specific examples</li>
                <li>• Use measurable results</li>
                <li>• Explain your thought process</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-3 rounded border border-purple-200">
              <div className="font-medium text-purple-700 mb-1">Delivery Tips</div>
              <ul className="text-purple-600 space-y-1">
                <li>• Speak clearly and confidently</li>
                <li>• Maintain good pace (150 wpm)</li>
                <li>• Minimize filler words</li>
              </ul>
            </div>
            <div className="bg-teal-50 p-3 rounded border border-teal-200">
              <div className="font-medium text-teal-700 mb-1">Behavior Tips</div>
              <ul className="text-teal-600 space-y-1">
                <li>• Maintain eye contact</li>
                <li>• Use natural gestures</li>
                <li>• Sit with good posture</li>
              </ul>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-green-700 mb-1">
              <span>Time remaining to read suggestions</span>
              <span>{timeLeft}s</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / (autoCloseDelay / 1000)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW: Enhanced Follow-up Question Display Component with Answer Input
const FollowUpQuestionDisplay = ({ 
  followUpQuestion, 
  followUpCount,
  maxFollowUps,
  isVisible,
  onAnswer,
  onSkip,
  currentAnswer,
  setCurrentAnswer,
  isRecording,
  startRecording,
  stopRecording,
  recordedChunks,
  hasMediaPermissions,
  isMicEnabled,
  isSpeechRecognitionActive,
  loading,
  isGeneratingNext
}: { 
  followUpQuestion: string;
  followUpCount: number;
  maxFollowUps: number;
  isVisible: boolean;
  onAnswer: () => void;
  onSkip: () => void;
  currentAnswer: string;
  setCurrentAnswer: (answer: string) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  recordedChunks: Blob[];
  hasMediaPermissions: boolean;
  isMicEnabled: boolean;
  isSpeechRecognitionActive: boolean;
  loading: boolean;
  isGeneratingNext: boolean;
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400 p-6 mb-6 rounded-lg shadow-lg">
      <div className="flex items-start">
        <MessageSquare className="h-7 w-7 text-orange-600 mr-4 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-orange-800 font-semibold text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Follow-up Question ({followUpCount}/{maxFollowUps})
            </h4>
            <button 
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 text-sm bg-white px-3 py-1 rounded-lg border"
            >
              Skip Follow-up
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm mb-4">
            <h5 className="text-orange-700 font-medium mb-3 text-sm">Follow-up Question:</h5>
            <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-400">
              <p className="text-orange-800 text-sm leading-relaxed">{followUpQuestion}</p>
            </div>
            <p className="text-orange-600 text-xs mt-3">
              This is follow-up question {followUpCount} of {maxFollowUps}. Please provide more details to improve your response.
            </p>
          </div>

{followUpCount === maxFollowUps && (
  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
    <strong>Note:</strong> This is your final follow-up question for this topic. After your response, we'll provide comprehensive feedback and move to the next question.
  </div>
)}

          {/* Answer Input Area for Follow-up Questions */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Your Follow-up Response:
                </span>
                {isRecording && (
                  <div className="flex items-center gap-2 text-red-600 animate-pulse">
                    <div className="h-3 w-3 bg-red-600 rounded-full"></div>
                    <span className="text-sm font-medium">Recording in progress...</span>
                  </div>
                )}
                {isSpeechRecognitionActive && (
                  <div className="flex items-center gap-2 text-green-600 animate-pulse">
                    <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                    <span className="text-sm font-medium">Listening...</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {currentAnswer.trim().split(/\s+/).length} words • Target: 50-150 words
              </div>
            </div>
            
            <Textarea
              placeholder="Please provide your detailed response to the follow-up question. Include specific examples, outcomes, or clarify your approach..."
              value={currentAnswer}
              onChange={(e: any) => setCurrentAnswer(e.target.value)}
              className="mb-4 min-h-32"
            />
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {hasMediaPermissions && (
                  <>
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-3 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                      disabled={!isMicEnabled}
                    >
                      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    
                    {recordedChunks.length > 0 && (
                      <Button
                        onClick={() => {
                          const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
                          const audioUrl = URL.createObjectURL(audioBlob);
                          const audio = new Audio(audioUrl);
                          audio.play().catch(console.error);
                        }}
                        className="p-3 bg-green-600 hover:bg-green-700"
                        title="Play recorded response"
                      >
                        <Play className="h-5 w-5" />
                      </Button>
                    )}
                  </>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
                  <span>Response quality:</span>
                  <div className={`px-2 py-1 rounded text-xs ${
                    currentAnswer.trim().split(/\s+/).length > 80 ? 'bg-green-100 text-green-700' :
                    currentAnswer.trim().split(/\s+/).length > 40 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {currentAnswer.trim().split(/\s+/).length > 80 ? 'Detailed' :
                     currentAnswer.trim().split(/\s+/).length > 40 ? 'Good' : 'Brief'}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={onAnswer}
                  disabled={(!currentAnswer.trim() && recordedChunks.length === 0) || loading || isGeneratingNext}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700"
                >
                  {loading || isGeneratingNext ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Follow-up</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW: Next Question Prompt Component
const NextQuestionPrompt = ({ 
  isVisible,
  onProceed
}: { 
  isVisible: boolean;
  onProceed: () => void;
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-400 p-6 mb-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-green-600" />
          <div>
            <h4 className="text-green-800 font-medium">Ready for the next question?</h4>
            <p className="text-green-600 text-sm">
              You've completed this question. Continue to the next challenge.
            </p>
          </div>
        </div>
        <Button
          onClick={onProceed}
          className="bg-green-600 hover:bg-green-700"
        >
          Next Question
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

// NEW: Enhanced User Question Input Component with Resume Interview
const UserQuestionInput = ({ 
  isVisible,
  onAskQuestion,
  currentUserQuestion,
  setCurrentUserQuestion,
  isMicEnabled,
  hasMediaPermissions,
  onResumeInterview,
  isQuestionChatActive
}: { 
  isVisible: boolean;
  onAskQuestion: (question: string) => void;
  currentUserQuestion: string;
  setCurrentUserQuestion: (question: string) => void;
  isMicEnabled: boolean;
  hasMediaPermissions: boolean;
  onResumeInterview: () => void;
  isQuestionChatActive: boolean;
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-400 p-6 mb-6 rounded-lg shadow-lg">
      <div className="flex items-start">
        <MessageSquare className="h-7 w-7 text-purple-600 mr-4 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-purple-800 font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Ask the Interviewer
            </h4>
            {isQuestionChatActive && (
              <Button
                onClick={onResumeInterview}
                className="bg-green-600 hover:bg-green-700 text-sm"
              >
                Resume Interview
              </Button>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm mb-4">
            <p className="text-purple-700 text-sm mb-3">
              Have a question for the AI? You can ask for clarification, repetition, or any other questions about the role or process.
            </p>
            
            <Textarea
              placeholder="Type your question for the AI here... (e.g., 'Could you please repeat the question?', 'Can you clarify what you mean by...?')"
              value={currentUserQuestion}
              onChange={(e: any) => setCurrentUserQuestion(e.target.value)}
              className="mb-4 min-h-20"
            />
            
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  if (hasMediaPermissions && isMicEnabled) {
                    // Add speech recognition for user questions
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (SpeechRecognition) {
                      const recognition = new SpeechRecognition();
                      recognition.continuous = false;
                      recognition.interimResults = false;
                      recognition.lang = 'en-US';
                      
                      recognition.onresult = (event: any) => {
                        const transcript = event.results[0][0].transcript;
                        setCurrentUserQuestion(transcript);
                      };
                      
                      recognition.start();
                    }
                  }
                }}
                disabled={!hasMediaPermissions || !isMicEnabled}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Mic className="h-4 w-4 mr-2" />
                Speak Question
              </Button>
              
              <Button
                onClick={() => onAskQuestion(currentUserQuestion)}
                disabled={!currentUserQuestion.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Ask Question
                <MessageSquare className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW: Interviewer Response Display Component
const InterviewerResponseDisplay = ({
  response,
  isVisible,
  onResumeInterview
}: {
  response: string;
  isVisible: boolean;
  onResumeInterview: () => void;
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-6 mb-6 rounded-lg shadow-lg">
      <div className="flex items-start">
        <User className="h-7 w-7 text-blue-600 mr-4 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-blue-800 font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Interviewer Response
            </h4>
            <Button
              onClick={onResumeInterview}
              className="bg-green-600 hover:bg-green-700 text-sm"
            >
              Resume Interview
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
              <p className="text-blue-800 text-sm leading-relaxed">{response}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Simplified behavior analysis without MediaPipe
// Enhanced behavior analysis with MediaPipe
const analyzeBehaviorFromVideo = async (videoElement: HTMLVideoElement, isUserAnswering: boolean): Promise<BehavioralAnalysis> => {
  try {
    if (!videoElement || videoElement.readyState < 2 || !isUserAnswering) {
      return getFallbackBehavioralAnalysis();
    }

    const gestureAnalysis = await realTimeAnalyzer.analyzeVideoFrame(videoElement);
    
    // Only score if user is actually visible and engaged
    const isUserEngaged = gestureAnalysis.attention > 30 && gestureAnalysis.eyeContact > 20;
    
    if (!isUserEngaged) {
      return getFallbackBehavioralAnalysis();
    }

    const behavioralScore = Math.round(
      (gestureAnalysis.eyeContact * 0.25) +
      (gestureAnalysis.posture * 0.20) +
      (gestureAnalysis.gestures * 0.15) +
      (gestureAnalysis.smiling * 0.15) +
      (gestureAnalysis.attention * 0.25)
    );

    const analysis: BehavioralAnalysis = {
      score: behavioralScore,
      eyeContact: gestureAnalysis.eyeContact,
      posture: gestureAnalysis.posture,
      gestures: gestureAnalysis.gestures,
      facialExpressions: gestureAnalysis.smiling,
      confidenceLevel: Math.min(100, (gestureAnalysis.eyeContact + gestureAnalysis.posture + gestureAnalysis.smiling) / 3),
      engagement: gestureAnalysis.attention,
      professionalism: gestureAnalysis.posture,
      analysis: {
        gazeDirection: [0.5, 0.5],
        headPose: [0, 0, 0],
        smileIntensity: gestureAnalysis.smiling / 100,
        gestureFrequency: gestureAnalysis.gestures / 100
      }
    };

    return analysis;

  } catch (error) {
    console.warn('Behavior analysis fallback:', error);
    return getFallbackBehavioralAnalysis();
  }
};
// Enhanced voice analysis with proper validation
const analyzeVoiceFromAudio = (audioStream: MediaStream, transcript: string, duration: number): VoiceAnalysis => {
  try {
    // Only update speech metrics if there's actual speech
    if (transcript.trim().length > 0) {
      realTimeAnalyzer.updateSpeechMetrics(transcript, duration);
    }
    
    const voiceAnalysis = realTimeAnalyzer.analyzeAudio(audioStream);
    
    // More realistic validation - check if user is actually speaking
    const isActuallySpeaking = voiceAnalysis.volume > 15 && voiceAnalysis.confidence > 20;
    
    if (!isActuallySpeaking) {
      console.log('No significant speech detected');
      return getFallbackVoiceAnalysis();
    }
    
    return voiceAnalysis;
  } catch (error) {
    console.error('Voice analysis error:', error);
    return getFallbackVoiceAnalysis();
  }
};

// Enhanced voice analysis


// ENHANCED: Improved fallback behavioral analysis
const getEnhancedFallbackBehavioralAnalysis = (): BehavioralAnalysis => {
  // More realistic fallback scores based on typical user behavior
  return {
    score: 45,
    eyeContact: 50,
    posture: 55,
    gestures: 40,
    facialExpressions: 35,
    confidenceLevel: 45,
    engagement: 50,
    professionalism: 55,
    analysis: {
      gazeDirection: [0.5, 0.5],
      headPose: [0, 0, 0],
      smileIntensity: 0.3,
      gestureFrequency: 0.4
    }
  };
};
// FIXED: Accurate content scoring function
// FIXED: Accurate content scoring with gibberish detection
const calculateContentScore = (answer: string, question: Question): number => {
  // If answer is empty or very short, return very low score
  if (!answer.trim() || answer.trim().length < 3) {
    return 5;
  }

  const words = answer.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // ENHANCED: Better gibberish detection
  const hasGibberish = detectGibberish(answer);
  if (hasGibberish) {
    return Math.max(1, Math.min(15, wordCount * 1)); // Max 15% for gibberish
  }

  // ENHANCED: Test for repeated characters or keyboard mashing
  const hasRepeatedChars = /(.)\1{4,}/.test(answer); // 5+ repeated characters
  const hasKeyboardMashing = /(asdf|jkl|qwer|zxcv|fdsa|lkj|rewq|vcxz)/i.test(answer.toLowerCase());
  
  if (hasRepeatedChars || hasKeyboardMashing) {
    return Math.max(1, Math.min(10, wordCount * 0.5)); // Max 10% for keyboard mashing
  }

  // ENHANCED: Test for single repeated word
  const uniqueWords = new Set(words.map(word => word.toLowerCase()));
  if (uniqueWords.size === 1 && wordCount > 2) {
    return Math.max(5, Math.min(20, wordCount * 2)); // Max 20% for single word repetition
  }

  let score = 0;
  
  // Length factor (0-25 points) - More strict
  if (wordCount >= 100) score += 25;
  else if (wordCount >= 70) score += 20;
  else if (wordCount >= 50) score += 15;
  else if (wordCount >= 30) score += 10;
  else if (wordCount >= 15) score += 5;
  else if (wordCount >= 5) score += 2;
  else score += 1; // Very short answers get minimal points
  
  // Structure factor (0-20 points)
  const sentenceCount = (answer.match(/[.!?]+/g) || []).length;
  if (sentenceCount >= 6) score += 20;
  else if (sentenceCount >= 4) score += 15;
  else if (sentenceCount >= 3) score += 10;
  else if (sentenceCount >= 2) score += 5;
  else if (sentenceCount >= 1) score += 2;
  
  // Content quality factors (0-40 points) - More strict evaluation
  const hasExamples = /example|for instance|such as|specifically|e\.g|in my experience|project|work|experience/i.test(answer.toLowerCase());
  const hasOutcomes = /result|outcome|achieved|accomplished|saved|improved|increased|reduced|solved|completed/i.test(answer.toLowerCase());
  const hasMetrics = /\d+%|\d+ hours|\d+ dollars|\d+ users|\d+ projects|\d+ years|\d+ months|\$\d+|\d+k/i.test(answer);
  const hasStructure = /first|then|next|finally|because|therefore|however|although|step|process/i.test(answer.toLowerCase());
  const hasRelevantKeywords = /team|lead|develop|create|build|manage|implement|design|solve|problem/i.test(answer.toLowerCase());
  
  if (hasExamples) score += 10;
  if (hasOutcomes) score += 10;
  if (hasMetrics) score += 10;
  if (hasStructure) score += 5;
  if (hasRelevantKeywords) score += 5;
  
  // Question relevance (bonus/malus) - More strict
  const questionKeywords = question.question.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !['what','when','where','why','how','tell','describe','explain'].includes(word));
  
  const relevantKeywords = questionKeywords.filter(keyword => 
    answer.toLowerCase().includes(keyword)
  );
  
  const relevanceRatio = relevantKeywords.length / Math.max(1, questionKeywords.length);
  score += Math.round(relevanceRatio * 15);
  
  // ENHANCED: Penalize very poor answers more aggressively
  if (wordCount < 10) score = Math.min(score, 25);
  if (wordCount < 5) score = Math.min(score, 15);
  if (wordCount < 3) score = Math.min(score, 10);
  
  return Math.min(95, Math.max(1, score));
};

// NEW: Enhanced gibberish detection
const detectGibberish = (text: string): boolean => {
  if (!text.trim()) return true;
  
  const words = text.trim().split(/\s+/);
  
  // Single character "words" or very short random strings
  if (words.every(word => word.length <= 2)) {
    return true;
  }
  
  // Check for random character sequences without vowels
  const hasNoVowels = /^[^aeiouyAEIOUY]{4,}$/.test(text.replace(/\s+/g, ''));
  if (hasNoVowels && text.length > 6) {
    return true;
  }
  
  // Check for repeated patterns
  const hasRepeatedPatterns = /(..+)\1{2,}/.test(text); // Repeated sequences
  if (hasRepeatedPatterns) {
    return true;
  }
  
  // Check for keyboard walking patterns
  const keyboardPatterns = [
    /qwerty|asdfgh|zxcvbn/i,
    /poiuyt|lkjhgf|mnbvcx/i,
    /12345|67890/i
  ];
  
  if (keyboardPatterns.some(pattern => pattern.test(text))) {
    return true;
  }
  
  return false;
};
// Enhanced voice scoring - only score if user has actually spoken
// Enhanced voice scoring - only score if user has actually spoken
// FIXED: Realistic voice scoring
const calculateVoiceScore = (
  voiceData: VoiceAnalysis, 
  hasUserSpoken: boolean, 
  answerLength: number
): number => {
  // Return 0 if user hasn't spoken or provided very short/gibberish answer
  if (!hasUserSpoken || answerLength < 5) {
    return 0;
  }

  // Only calculate score if there's significant speech activity AND meaningful content
  const hasSignificantSpeech = voiceData.volume > 20 && voiceData.confidence > 30;
  if (!hasSignificantSpeech) {
    return Math.max(0, (voiceData.confidence * 0.7) + (voiceData.clarity * 0.3));
  }

  const weights = {
    volume: 0.25,
    clarity: 0.30,
    pace: 0.20,
    tone: 0.15,
    fillerWords: 0.05,
    pauses: 0.05
  };

  let paceScore = 0;
  if (voiceData.pace >= 140 && voiceData.pace <= 160) {
    paceScore = 100;
  } else if (voiceData.pace >= 130 && voiceData.pace <= 170) {
    paceScore = 80;
  } else if (voiceData.pace >= 120 && voiceData.pace <= 180) {
    paceScore = 60;
  } else {
    paceScore = 40;
  }

  const fillerWordPenalty = Math.min(voiceData.fillerWords * 5, 25);
  const pausePenalty = Math.min(voiceData.pauses * 2, 15);

  const rawScore = 
    (voiceData.volume * weights.volume) +
    (voiceData.clarity * weights.clarity) +
    (paceScore * weights.pace) +
    (voiceData.tone * weights.tone);

  const finalScore = Math.max(0, rawScore - fillerWordPenalty - pausePenalty);
  return Math.round(finalScore);
};

// Enhanced skill assessment
// FIXED: Realistic skill assessment
const generateSkillAssessment = (
  contentScore: number,
  behavioralScore: number,
  voiceScore: number,
  questionType: string,
  hasUserSpoken?: boolean,
  hasUserEngaged?: boolean
): { [key: string]: number } => {
  
  // If content score is very low (gibberish), return minimal scores
  if (contentScore < 20) {
    return {
      'Communication': Math.max(1, contentScore),
      'Problem Solving': Math.max(1, contentScore / 2),
      'Technical Knowledge': Math.max(1, contentScore / 2),
      'Confidence': Math.max(1, behavioralScore / 4),
      'Professionalism': Math.max(1, behavioralScore / 4),
      'Algorithms': Math.max(1, contentScore / 3)
    };
  }
  
  // Only assess communication if user actually spoke and provided meaningful content
  const baseCommunication = (hasUserSpoken && contentScore > 30) ? 
    Math.round((contentScore * 0.4 + voiceScore * 0.6) * 0.9) : contentScore;
  
  // Only assess confidence if user was engaged and provided meaningful content
  const baseConfidence = (hasUserEngaged && contentScore > 30) ? 
    Math.round((behavioralScore * 0.7 + voiceScore * 0.3) * 0.9) : Math.max(10, behavioralScore / 2);
  
  const baseProblemSolving = Math.max(1, contentScore * (questionType === 'problem-solving' ? 0.8 : 0.6));
  const baseTechnical = Math.max(1, contentScore * (questionType === 'technical' ? 0.8 : 0.5));
  
  return {
    'Communication': Math.max(1, baseCommunication),
    'Problem Solving': Math.max(1, baseProblemSolving),
    'Technical Knowledge': Math.max(1, baseTechnical),
    'Confidence': Math.max(1, baseConfidence),
    'Professionalism': Math.max(1, behavioralScore * 0.7),
    'Algorithms': Math.max(1, contentScore * (questionType === 'technical' ? 0.6 : 0.3))
  };
};

// ENHANCED: Improved analysis function with better answer understanding and feedback
const getEnhancedRealAnalysis = (
  question: Question,
  answer: string,
  behavioralData: BehavioralAnalysis,
  voiceData: VoiceAnalysis,
  userName: string = '',
  isFollowUp: boolean = false,
  followUpCount: number = 0
) => {
  const hasUserSpoken = answer.trim().length > 0;
  const contentScore = calculateContentScore(answer, question);
  const behavioralScore = behavioralData.score;
  // Add these near the top of your component with other state declarations
 const [hasUserActuallySpoken, setHasUserActuallySpoken] = useState(false);
 const [currentAnswer, setCurrentAnswer] = useState('');
const voiceScore = calculateVoiceScore(
  voiceData, 
  answer.trim().length > 10, // hasUserSpoken
  answer.trim().length
);

 const overallScore = Math.round(
  (contentScore * 0.7) + // Content is 70% of score
  (behavioralScore * 0.2) + // Behavior is 20%
  (voiceScore * 0.1) // Voice is only 10%
);

// In analyzeAnswerWithAI function calls, replace with:
// In analyzeAnswerWithAI function calls, replace with:
const skillAssessment = generateSkillAssessment(
  contentScore,
  behavioralScore,
  voiceScore,
  question.type,
  answer.trim().length > 0, // hasUserSpoken - use the answer parameter
  behavioralData ? behavioralData.score > 30 : false // hasUserEngaged
);
  const comprehensiveFeedback = generateComprehensiveFeedback(
    contentScore,
    behavioralScore,
    voiceScore,
    { score: contentScore },
    behavioralData,
    voiceData
  );

  const userPrefix = userName ? `${userName}, ` : '';
  
  let feedback = '';
  let interviewerResponse = '';
  let followUpQuestion = null;

  // ENHANCED: Better answer analysis and feedback generation
  const answerLower = answer.toLowerCase();
  
  // Check for common issues in answers
  const isConfused = /don't understand|don't know|not sure|confused|can you repeat|what do you mean/i.test(answerLower);
  const isVague = /maybe|perhaps|probably|I think|I guess|kind of|sort of/i.test(answerLower);
  const isShort = answer.trim().split(/\s+/).length < 20;
  const lacksExamples = !/example|for instance|such as|specifically|in my experience/i.test(answerLower);
  const lacksStructure = !/first|then|next|finally|because|therefore|however/i.test(answerLower);

  // Generate appropriate feedback based on answer quality
  if (isConfused) {
    feedback = `${userPrefix}I notice you seem unsure about this question. Let me clarify what I'm looking for and give you another chance to answer.`;
    interviewerResponse = `${userPrefix}I understand this might be challenging. Let me rephrase the question to make it clearer for you.`;
    followUpQuestion = generateClarificationFollowUp(question, answer);
  } 
  else if (overallScore >= 90) {
    feedback = `${userPrefix}excellent response! You provided comprehensive details with specific examples and demonstrated strong communication skills.`;
    interviewerResponse = `${userPrefix}thank you for that outstanding answer. You clearly have deep expertise in this area.`;
  } else if (overallScore >= 85) {
    feedback = `${userPrefix}that was a very good response. You covered the main points well with relevant examples and good delivery.`;
    interviewerResponse = `${userPrefix}thank you for that detailed answer. It gives me a clear picture of your capabilities.`;
  } else if (overallScore >= 75) {
    feedback = `${userPrefix}good response. You addressed the question appropriately. Consider improving your delivery and adding more specific examples.`;
    interviewerResponse = `${userPrefix}thank you for your response. That helps me understand your approach.`;
    if (shouldAskFollowUp(overallScore, followUpCount)) {
      followUpQuestion = generateFirstFollowUp(question, answer, overallScore);
    }
  } else if (overallScore >= 65) {
    feedback = `${userPrefix}you've made a good attempt. The response would be stronger with more specific details, better vocal delivery, and confident body language.`;
    interviewerResponse = `${userPrefix}I appreciate your answer. Let me ask a follow-up to better understand your experience.`;
    if (shouldAskFollowUp(overallScore, followUpCount)) {
      followUpQuestion = followUpCount === 0 ? 
        generateFirstFollowUp(question, answer, overallScore) : 
        generateSecondFollowUp(question, answer, overallScore);
    }
  } else {
    feedback = `${userPrefix}your response was quite brief. In professional settings, it's important to provide comprehensive answers with specific examples, confident delivery, and professional body language.`;
    interviewerResponse = `${userPrefix}thank you for attempting the question. Let me ask a follow-up to help you provide more detail.`;
    if (shouldAskFollowUp(overallScore, followUpCount)) {
      followUpQuestion = followUpCount === 0 ? 
        generateFirstFollowUp(question, answer, overallScore) :
        followUpCount === 1 ?
        generateSecondFollowUp(question, answer, overallScore) :
        generateThirdFollowUp(question, answer, overallScore);
    }
  }

  // ENHANCED: Generate more specific corrected answer based on actual response issues
  let correctedAnswer = "An improved answer would include specific examples, measurable results, clearer connections to the role requirements, confident vocal delivery, and professional body language.";
  
  if (isVague) {
    correctedAnswer = "Try to be more definitive in your responses. Instead of 'I think maybe...' say 'Based on my experience...' and provide concrete examples.";
  }
  if (lacksExamples) {
    correctedAnswer = "Include specific examples from your experience. For instance, instead of saying 'I handled projects,' say 'I managed a team of 5 on Project X which resulted in 20% efficiency improvement.'";
  }
  if (lacksStructure) {
    correctedAnswer = "Structure your answer clearly. Start with your main point, provide supporting evidence or examples, then conclude with the outcome or learning.";
  }

  return {
    score: overallScore,
    contentScore,
    behavioralScore,
    voiceScore,
    strengths: generateStrengths(contentScore, behavioralScore, voiceScore),
    improvements: generateImprovements(contentScore, behavioralScore, voiceScore),
    suggestions: [
      "Include specific metrics when possible",
      "Use concrete examples from your experience",
      "Explain your thought process clearly",
      "Highlight measurable outcomes and achievements"
    ],
    skillAssessment,
    detailedFeedback: feedback,
    confidenceLevel: overallScore,
    behavioralAnalysis: behavioralData,
    voiceAnalysis: voiceData,
    comprehensiveFeedback,
    interviewerResponse,
    correctedAnswer,
    expectedAnswer: "An ideal response demonstrates expertise through specific examples, shows problem-solving methodology, highlights relevant outcomes with metrics, uses confident and clear communication, and maintains professional presence.",
    followUpQuestion
  };
};
// ENHANCED: Improved function to handle user questions to interviewer with better analysis
const handleUserQuestionToInterviewer = (userQuestion: string, currentQuestion: Question, interviewState: InterviewState): string => {
  const lowerQuestion = userQuestion.toLowerCase();
  
  // Enhanced analysis of user questions with more realistic responses
  const isAskingForClarification = /clarify|explain|what do you mean|don't understand|not clear/i.test(lowerQuestion);
  const isAskingForRepetition = /repeat|say that again|didn't catch|missed that/i.test(lowerQuestion);
  const isAskingAboutProcess = /process|next|how many|what happens|after this/i.test(lowerQuestion);
  const isAskingAboutEvaluation = /evaluate|looking for|criteria|how am i doing|performance/i.test(lowerQuestion);
  const isAskingAboutRole = /role|position|job|responsibilities|what would i do/i.test(lowerQuestion);
  const isAskingAboutFeedback = /feedback|how did i do|my answer|assessment/i.test(lowerQuestion);
  const isAskingAboutTime = /time|long|duration|how much longer/i.test(lowerQuestion);
  const isAskingTechnical = /technical|skill|experience|knowledge|background/i.test(lowerQuestion);
  const isAskingPersonal = /your|you|who are you|your role/i.test(lowerQuestion);
  
  // Handle request to repeat question
  if (isAskingForRepetition) {
    return `Of course, I'd be happy to repeat the question. "${currentQuestion.question}" Please take your time to think about your response.`;
  }
  
  // Handle clarification requests with more specific, realistic responses
  if (isAskingForClarification) {
    return `I'd be happy to clarify that for you. The question is asking about ${
      currentQuestion.type === 'technical' ? 'your technical knowledge and how you approach problems in this area' :
      currentQuestion.type === 'behavioral' ? 'a specific example from your past experience that demonstrates your capabilities' :
      currentQuestion.type === 'problem-solving' ? 'your methodology for solving challenges and the steps you take' :
      'your relevant experience and thought process'
    }. Could you provide a specific example that relates to this?`;
  }
  
  // Handle questions about the interview process with realistic timing
  if (isAskingAboutProcess) {
    const mainQuestionsCount = interviewState.answeredQuestions;
    const remaining = Math.max(0, 10 - mainQuestionsCount);
    const estimatedTime = Math.max(5, remaining * 3); // 3 minutes per question estimate
    
    return `We're about halfway through the assessment. We've completed ${mainQuestionsCount} main questions with approximately ${remaining} remaining. The entire session typically takes around ${estimatedTime} more minutes. The interview adapts based on your responses to better understand your capabilities.`;
  }
  
  // Handle questions about evaluation criteria with realistic, encouraging feedback
  if (isAskingAboutEvaluation) {
    const score = interviewState.performanceScore;
    let performanceText = '';
    let encouragement = '';
    
    if (score >= 80) {
      performanceText = 'strong';
      encouragement = 'You\'re demonstrating excellent communication skills and relevant experience.';
    } else if (score >= 70) {
      performanceText = 'good';
      encouragement = 'You\'re providing solid answers with good examples.';
    } else if (score >= 60) {
      performanceText = 'satisfactory';
      encouragement = 'You\'re on the right track, focus on providing more specific examples.';
    } else {
      performanceText = 'developing';
      encouragement = 'Try to provide more detailed responses with concrete examples from your experience.';
    }
    
    return `I evaluate responses based on several factors: relevance to the question, depth of examples provided, clarity of communication, problem-solving approach, and how well your experience aligns with role requirements. Based on your responses so far, your performance is ${performanceText} with an overall score of ${score}%. ${encouragement}`;
  }
  
  // Handle personal questions about the AI interviewer
  if (isAskingPersonal) {
    return "I'm your AI Roleplay conducting this assessment. My role is to understand your capabilities and experience through our conversation, and provide you with constructive feedback to help you improve.";
  }
  
  // Handle other questions with more natural, conversational responses
  if (isAskingAboutRole) {
    return "That's a great question about the role. In a real interview setting, this shows your interest in understanding the position better. For this assessment, I'd recommend focusing on demonstrating how your specific skills and experiences make you a strong fit through your answers to the questions asked.";
  }
  
  if (isAskingAboutFeedback) {
    const weakAreas = Object.entries(interviewState.skillProficiency)
      .filter(([_, score]) => score < 60)
      .map(([skill]) => skill)
      .slice(0, 2);
    
    if (weakAreas.length > 0) {
      return `Based on our conversation so far, you're doing well overall. To strengthen your responses further, consider providing more specific examples when discussing ${weakAreas.join(' and ')}. Use the STAR method - Situation, Task, Action, Result - to structure your answers with concrete outcomes.`;
    } else {
      return "You're providing good, comprehensive answers. Continue focusing on specific examples with measurable results, and maintain the clear communication style you've been demonstrating.";
    }
  }
  
  // Default response for other questions
  return "That's a relevant question. In a professional interview setting, asking thoughtful questions demonstrates your engagement and understanding. For this assessment, I'd recommend we continue with the planned questions to thoroughly evaluate your capabilities, but I appreciate your curiosity and engagement.";
};

// Helper functions for generating feedback
const generateStrengths = (contentScore: number, behavioralScore: number, voiceScore: number): string[] => {
  const strengths: string[] = [];
  
  if (contentScore >= 70) strengths.push("Strong content quality and relevance");
  if (behavioralScore >= 70) strengths.push("Good body language and professional presence");
  if (voiceScore >= 70) strengths.push("Clear and confident vocal delivery");
  if (contentScore >= 80 && behavioralScore >= 80) strengths.push("Excellent overall communication skills");
  
  if (strengths.length === 0) {
    strengths.push("Good attempt at answering the question");
  }
  
  return strengths;
};

const generateImprovements = (contentScore: number, behavioralScore: number, voiceScore: number): string[] => {
  const improvements: string[] = [];
  
  if (contentScore < 70) improvements.push("Need more specific examples and detailed explanations");
  if (behavioralScore < 70) improvements.push("Improve body language and professional presence");
  if (voiceScore < 70) improvements.push("Work on vocal clarity and confidence");
  if (contentScore < 60) improvements.push("Provide more structured and comprehensive answers");
  
  return improvements;
};

// Enhanced comprehensive feedback generation
const generateComprehensiveFeedback = (
  contentScore: number,
  behavioralScore: number,
  voiceScore: number,
  contentAnalysis: any,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis
): ComprehensiveFeedback => {
  const overallScore = Math.round(
  (contentScore * 0.7) + // Content is 70% of score
  (behavioralScore * 0.2) + // Behavior is 20%
  (voiceScore * 0.1) // Voice is only 10%
);

  const strengths = generateStrengths(contentScore, behavioralScore, voiceScore);
  const improvements = generateImprovements(contentScore, behavioralScore, voiceScore);
  const contentSuggestions: string[] = [];
  const deliverySuggestions: string[] = [];
  const behaviorSuggestions: string[] = [];

  // Content feedback
  if (contentScore < 70) {
    contentSuggestions.push("Include more concrete examples from your experience");
    contentSuggestions.push("Provide measurable outcomes and results");
    contentSuggestions.push("Structure your answer with clear beginning, middle, and end");
  }

  if (contentScore < 60) {
    contentSuggestions.push("Connect your experience directly to the question asked");
    contentSuggestions.push("Use the STAR method (Situation, Task, Action, Result)");
  }

  // Behavioral feedback
  if (behavioralData) {
    if (behavioralData.eyeContact < 60) {
      behaviorSuggestions.push("Look directly at the camera when speaking to simulate eye contact");
    }

    if (behavioralData.posture < 60) {
      behaviorSuggestions.push("Sit straight and avoid slouching during the interview");
    }

    if (behavioralData.gestures < 50) {
      behaviorSuggestions.push("Use occasional hand gestures to appear more engaging");
    } else if (behavioralData.gestures > 90) {
      behaviorSuggestions.push("Keep gestures controlled and purposeful");
    }

    if (behavioralData.confidenceLevel < 60) {
      behaviorSuggestions.push("Practice power poses before the interview to boost confidence");
    }
  }

  // Voice feedback
  if (voiceData) {
    if (voiceData.volume < 60) {
      deliverySuggestions.push("Practice speaking at a volume that carries authority");
    }

    if (voiceData.clarity < 70) {
      deliverySuggestions.push("Practice articulating words clearly and deliberately");
    }

    if (voiceData.pace < 120) {
      deliverySuggestions.push("Aim for 150-160 words per minute for optimal engagement");
    } else if (voiceData.pace > 180) {
      deliverySuggestions.push("Use strategic pauses to emphasize key points");
    }

    if (voiceData.fillerWords > 5) {
      deliverySuggestions.push("Practice pausing instead of using filler words");
    }

    if (voiceData.tone < 60) {
      deliverySuggestions.push("Use vocal inflection to emphasize important points");
    }
  }

  let detailedFeedback = `Overall Performance: ${overallScore}/100\n\n`;
  
  if (strengths.length > 0) {
    detailedFeedback += "Strengths:\n• " + strengths.join("\n• ") + "\n\n";
  }

  if (improvements.length > 0) {
    detailedFeedback += "Areas for Improvement:\n• " + improvements.join("\n• ") + "\n\n";
  }

  detailedFeedback += "Breakdown:\n";
  detailedFeedback += `• Content Quality: ${contentScore}/100\n`;
  detailedFeedback += `• Delivery & Voice: ${voiceScore}/100\n`;
  detailedFeedback += `• Body Language: ${behavioralScore}/100`;

  return {
    contentScore,
    behavioralScore,
    voiceScore,
    overallScore,
    strengths,
    improvements,
    detailedFeedback,
    contentAnalysis: {
      relevance: Math.min(contentScore + 10, 100),
      structure: Math.min(contentScore + 5, 100),
      examples: Math.min(contentScore, 100),
      depth: Math.min(contentScore - 5, 100)
    },
    behavioralAnalysis: behavioralData || getFallbackBehavioralAnalysis(),
    voiceAnalysis: voiceData || getFallbackVoiceAnalysis(),
    specificSuggestions: {
      content: contentSuggestions,
      delivery: deliverySuggestions,
      behavior: behaviorSuggestions
    }
  };
};

// Fallback functions
const getFallbackBehavioralAnalysis = (): BehavioralAnalysis => ({
  score: 25,
  eyeContact: 30,
  posture: 35,
  gestures: 25,
  facialExpressions: 20,
  confidenceLevel: 25,
  engagement: 30,
  professionalism: 35,
  analysis: {
    gazeDirection: [0.5, 0.5],
    headPose: [0, 0, 0],
    smileIntensity: 0.2,
    gestureFrequency: 0.3
  }
});

const getFallbackVoiceAnalysis = (): VoiceAnalysis => ({
  volume: 0,
  clarity: 0,
  pace: 0,
  tone: 0,
  fillerWords: 0,
  pauses: 0,
  confidence: 0
});
// FIXED: Enhanced analyzeAnswerWithAI with proper follow-up handling
const analyzeAnswerWithAI = async (
  question: Question, 
  answer: string, 
  state: InterviewState,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis,
  userName: string = '',
  isUserQuestion: boolean = false,
  userQuestion: string = '',
  followUpCount: number = 0,
  mediaStream: MediaStream | null = null,
  isVideoEnabled: boolean = false
): Promise<any> => {
  try {
    console.log('🔍 AI Analysis Request:', {
      questionType: question.type,
      answerLength: answer.length,
      followUpCount,
      isUserQuestion
    });

    // Handle user questions to interviewer
    if (isUserQuestion) {
      const interviewerResponse = await handleUserQuestionWithAPI(userQuestion, question, state, userName);
      
      return {
        score: 0,
        contentScore: 0,
        behavioralScore: 0,
        voiceScore: 0,
        strengths: [],
        improvements: [],
        suggestions: [],
        skillAssessment: {},
        detailedFeedback: `Thank you for your question. ${userName ? `${userName}, ` : ''}I appreciate your engagement.`,
        confidenceLevel: 0,
        behavioralAnalysis: behavioralData || getFallbackBehavioralAnalysis(),
        voiceAnalysis: voiceData || getFallbackVoiceAnalysis(),
        comprehensiveFeedback: null,
        interviewerResponse,
        correctedAnswer: "",
        expectedAnswer: "",
        followUpQuestion: null,
        isUserQuestionResponse: true
      };
    }

    // ENHANCED: Always call real AI analysis for ALL questions
    const analysis = await callAnalysisAPI(question, answer, state, behavioralData, voiceData, userName, followUpCount);

    console.log('✅ AI Analysis Result:', {
      score: analysis.score,
      hasFollowUp: !!analysis.followUpQuestion,
      followUpCount,
      answerLength: answer.length
    });
// In the analyzeAnswerWithAI function, modify the follow-up generation logic:

// CRITICAL FIX: Only return the follow-up question if we haven't reached max follow-ups
let finalFollowUpQuestion = analysis.followUpQuestion;

// Don't generate follow-ups if we've reached the maximum
if (followUpCount >= MAX_FOLLOW_UPS_PER_QUESTION) {
  finalFollowUpQuestion = undefined;
  console.log('🛑 MAX FOLLOW-UPS REACHED - No more follow-ups will be generated');
}

return {
  ...analysis,
  followUpQuestion: finalFollowUpQuestion
};

  } catch (error) {
    console.error('❌ AI analysis error:', error);
    
    // Enhanced fallback with natural follow-up questions
    const fallbackAnalysis = await getEnhancedRealAnalysisWithFollowUps(
      question, 
      answer, 
      behavioralData || getFallbackBehavioralAnalysis(),
      voiceData || getFallbackVoiceAnalysis(),
      userName,
      followUpCount,
      state
    );

    return fallbackAnalysis;
  }
};


// NEW: Natural follow-up decision making
// NEW: Natural follow-up decision making
const shouldAskNaturalFollowUp = (
  question: Question, 
  answer: string, 
  score: number, 
  followUpCount: number
): boolean => {
  // CRITICAL: Don't ask follow-ups if we've reached the limit
  if (followUpCount >= MAX_FOLLOW_UPS_PER_QUESTION) {
    return false;
  }

  const wordCount = answer.trim().split(/\s+/).length;
  
  // Only ask natural follow-ups when it makes sense
  if (followUpCount === 0) {
    // Ask first follow-up for incomplete or low-scoring answers
    return score < 75 || wordCount < 40;
  }
  
  if (followUpCount === 1) {
    // Ask second follow-up only if answer was substantial but needs clarification
    return score < 70 && wordCount > 25;
  }
  
  if (followUpCount === 2) {
    // Ask third follow-up only for very specific cases
    return score < 60 && wordCount > 40;
  }

  return false;
};

// NEW: Generate natural, context-aware follow-up questions
const generateNaturalFollowUp = (
  question: Question,
  answer: string,
  score: number,
  followUpCount: number
): string => {
  const answerLower = answer.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).length;

  // Analyze the actual answer content
  const isVague = /maybe|perhaps|probably|I think|I guess|kind of|sort of/i.test(answerLower);
  const lacksExamples = !/example|for instance|such as|specifically|in my experience/i.test(answerLower);
  const lacksDetails = !/because|therefore|however|although|reason|why/i.test(answerLower);
  const lacksMetrics = !/\d+%|\d+ years|\d+ projects|\d+ team|\d+ users/i.test(answerLower);
  const isConfused = /don't understand|don't know|not sure|confused|can you repeat/i.test(answerLower);

  // First follow-up: Address the most obvious gap
  if (followUpCount === 0) {
    if (isConfused) {
      return "I notice you seem unsure. Could you tell me what part you'd like me to clarify?";
    }
    if (lacksExamples && wordCount > 10) {
      return "That's a good start. Could you provide a specific example from your experience to illustrate this point?";
    }
    if (isVague) {
      return "I appreciate your response. Could you be more specific about your actual approach or methodology?";
    }
    if (wordCount < 25) {
      return "Could you elaborate more on that point? I'd like to understand your perspective in more detail.";
    }
    
    // Default natural follow-up
    return "Thank you for that. Could you tell me more about how you would apply this in a practical scenario?";
  }

  // Second follow-up: Dig deeper into specifics
  if (followUpCount === 1) {
    if (lacksMetrics && wordCount > 30) {
      return "That's helpful context. What measurable results or outcomes have you seen from this approach?";
    }
    if (lacksDetails) {
      return "I'd like to understand your thought process better. What factors would influence your decision here?";
    }
    
    return "How would you handle a situation where this approach didn't work as expected?";
  }

  // Third follow-up: Explore alternatives and learnings
  if (followUpCount === 2) {
    return "Looking back, what would you do differently if you faced this situation again, and what did you learn from the experience?";
  }

  return "Could you expand on that point with more details from your experience?";
};
// NEW: Force follow-up questions for most scenarios
const shouldForceFollowUp = (
  question: Question, 
  answer: string, 
  score: number, 
  followUpCount: number
): boolean => {
  // Don't force follow-ups if we've reached the limit
  if (followUpCount >= MAX_FOLLOW_UPS_PER_QUESTION) {
    return false;
  }

  // For main questions (not follow-ups), always ask at least one follow-up
  if (!question.isFollowUp && followUpCount === 0) {
    return true; // ALWAYS ask first follow-up for main questions
  }

  // For follow-up questions, ask more based on score and content
  if (question.isFollowUp) {
    const wordCount = answer.trim().split(/\s+/).length;
    
    // Second follow-up for incomplete answers
    if (followUpCount === 1 && (score < 70 || wordCount < 25)) {
      return true;
    }
    
    // Third follow-up only for very poor answers
    if (followUpCount === 2 && score < 60 && wordCount > 15) {
      return true;
    }
  }

  return false;
};

// NEW: Generate forced follow-up questions
const generateForcedFollowUp = (
  question: Question,
  answer: string,
  score: number,
  followUpCount: number
): string => {
  const answerLower = answer.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).length;

  // First follow-up: Always ask for more details
  if (followUpCount === 0) {
    const options = [
      "Could you provide more specific details about that?",
      "Can you give me a concrete example from your experience?",
      "I'd like to understand your thought process better. Could you elaborate?",
      "What specific steps would you take in that situation?",
      "Could you walk me through a real scenario where you applied this?"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  // Second follow-up: Ask for outcomes and results
  if (followUpCount === 1) {
    const options = [
      "What were the results or outcomes of that approach?",
      "How would you measure success in that situation?",
      "What challenges did you face and how did you overcome them?",
      "What did you learn from that experience?",
      "How would you apply this differently next time?"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  // Third follow-up: Ask for alternatives and reflections
  if (followUpCount === 2) {
    const options = [
      "What alternative approaches did you consider?",
      "Looking back, what would you do differently?",
      "How does this experience relate to the role you're applying for?",
      "What was the most valuable lesson you learned?",
      "How would you mentor someone else facing this situation?"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  return "Could you tell me more about that?";
};
// ENHANCED: Better follow-up decision making
const shouldGenerateFollowUp = (
  question: Question, 
  answer: string, 
  score: number, 
  followUpCount: number
): boolean => {
  // Don't ask follow-ups for user questions or if we've reached the limit
  if (followUpCount >= MAX_FOLLOW_UPS_PER_QUESTION) {
    return false;
  }

  const answerLength = answer.trim().length;
  const wordCount = answer.trim().split(/\s+/).length;

  // Always ask at least one follow-up for main questions with brief answers
  if (followUpCount === 0) {
    // Ask follow-up for very short answers
    if (answerLength < 20 || wordCount < 10) {
      return true;
    }
    
    // Ask follow-up for low scores
    if (score < 70) {
      return true;
    }

    // Ask exploratory follow-up for good answers to test depth
    if (score >= 80 && Math.random() > 0.3) { // 70% chance for good answers
      return true;
    }
  }

  // Second follow-up for moderately low scores or incomplete answers
  if (followUpCount === 1 && score < 75 && wordCount > 15) {
    return true;
  }

  // Third follow-up only for very low scores with some content
  if (followUpCount === 2 && score < 60 && wordCount > 25) {
    return true;
  }

  return false;
};

// ENHANCED: Generate context-aware follow-up questions
const generateContextAwareFollowUp = (
  question: Question,
  answer: string,
  score: number,
  followUpCount: number
): string => {
  const answerLower = answer.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).length;

  // Analyze answer content for specific gaps
  const isConfused = /don't understand|don't know|not sure|confused|repeat|what do you mean/i.test(answerLower);
  const isVague = /maybe|perhaps|probably|I think|I guess|kind of|sort of/i.test(answerLower);
  const isVeryShort = wordCount < 15;
  const lacksExamples = !/example|for instance|such as|specifically|in my experience/i.test(answerLower);
  const lacksDetails = !/because|therefore|however|although|reason|why/i.test(answerLower);
  const lacksMetrics = !/\d+%|\d+ years|\d+ projects|\d+ team|\d+ users/i.test(answerLower);

  // First follow-up: Address confusion or request examples
  if (followUpCount === 0) {
    if (isConfused) {
      return "Let me clarify that question. Could you tell me what part you'd like me to explain further?";
    }
    if (isVeryShort) {
      return "Could you elaborate more on that point? I'd like to understand your perspective in more detail.";
    }
    if (lacksExamples) {
      return "That's a good start. Could you provide a specific example from your experience to illustrate this?";
    }
    if (isVague) {
      return "I appreciate your response. Could you be more specific about your approach or methodology?";
    }
    
    // Default first follow-up
    return "Thank you for that answer. Could you tell me more about how you would apply this in a practical scenario?";
  }

  // Second follow-up: Request specifics and metrics
  if (followUpCount === 1) {
    if (lacksMetrics) {
      return "That's helpful context. What measurable results or outcomes have you seen from this approach?";
    }
    if (lacksDetails) {
      return "I'd like to understand your thought process better. What factors would influence your decision here?";
    }
    
    // Default second follow-up
    return "How would you handle a situation where this approach didn't work as expected?";
  }

  // Third follow-up: Explore alternatives and learnings
  if (followUpCount === 2) {
    return "Looking back, what would you do differently if you faced this situation again, and what did you learn from the experience?";
  }

  // Fallback follow-up
  return "Could you expand on that point with more details from your experience?";
};
// In callAnalysisAPI function, replace the follow-up logic:
const callAnalysisAPI = async (
  question: Question,
  answer: string,
  state: InterviewState,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis,
  userName: string = '',
  followUpCount: number = 0
) => {
  const requestBody = {
    question: question.question,
    answer: answer,
    questionType: question.type,
    difficulty: question.difficulty,
    category: question.category || '',
    userName: userName,
    followUpCount: followUpCount,
    isFollowUpResponse: followUpCount > 0,
    performanceScore: state.performanceScore,
    conversationContext: state.conversationContext.slice(-3),
    skillProficiency: state.skillProficiency,
    behavioralData: behavioralData || {},
    voiceData: voiceData || {},
    // REMOVE forced follow-up generation - let AI decide naturally
  };

  try {
    const response = await fetch('/api/analyze-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }

    const analysis = await response.json();
    
    // CRITICAL: Trust the AI's follow-up decision completely
    // Don't generate additional follow-ups that break the flow
    return analysis;

  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
};
// NEW: Enhanced fallback specifically for first question chain
const getEnhancedFirstQuestionFallback = (
  question: Question,
  answer: string,
  userName: string,
  followUpCount: number,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis
) => {
  const userPrefix = userName ? `${userName}, ` : '';
  
  // Analyze the actual answer content for dynamic feedback
  const wordCount = answer.trim().split(/\s+/).length;
  const hasExamples = /example|for instance|such as|specifically/i.test(answer.toLowerCase());
  const hasMetrics = /\d+%|\d+ years|\d+ projects|\d+ team/i.test(answer);
  const hasStructure = /first|then|next|finally|because|therefore/i.test(answer.toLowerCase());
  
  // Dynamic scoring based on actual content
  let contentScore = 50;
  if (wordCount > 100) contentScore += 25;
  else if (wordCount > 60) contentScore += 20;
  else if (wordCount > 30) contentScore += 15;
  else if (wordCount > 15) contentScore += 10;
  
  if (hasExamples) contentScore += 15;
  if (hasMetrics) contentScore += 15;
  if (hasStructure) contentScore += 10;
  
  contentScore = Math.min(95, Math.max(30, contentScore));
  const overallScore = contentScore;

  // Dynamic feedback based on actual answer quality
  let detailedFeedback = '';
  let interviewerResponse = '';
  let correctedAnswer = '';
  let followUpQuestion = null;

  if (overallScore >= 80) {
    detailedFeedback = `${userPrefix}Excellent response! You provided comprehensive details ${hasExamples ? 'with specific examples' : ''} ${hasMetrics ? 'and measurable results' : ''}. Your answer demonstrates strong understanding and clear communication.`;
    interviewerResponse = `${userPrefix}Thank you for that thorough answer. You clearly have solid experience in this area.`;
    correctedAnswer = "Your answer was already strong. To make it even better, consider discussing alternative approaches or key learnings from your experience.";
  } else if (overallScore >= 70) {
    detailedFeedback = `${userPrefix}Good response addressing the main points. ${hasExamples ? 'The examples helped illustrate your points well.' : 'Consider adding specific examples to strengthen your answer.'}`;
    interviewerResponse = `${userPrefix}Thank you for your response. You covered the key aspects well.`;
    correctedAnswer = "Try to include more specific metrics and outcomes. For example, instead of 'improved performance', say 'increased efficiency by 25% through process optimization'.";
  } else if (overallScore >= 60) {
    detailedFeedback = `${userPrefix}You've made a good attempt at answering the question. The response would be stronger with more specific details and examples from your experience.`;
    interviewerResponse = `${userPrefix}Thank you for your answer. Let me ask a follow-up to better understand your approach.`;
    correctedAnswer = "An improved answer would include: 1) A specific example from your experience, 2) Your step-by-step approach, 3) Measurable results or outcomes, 4) Key learnings gained.";
  } else {
    detailedFeedback = `${userPrefix}Your response was ${wordCount < 20 ? 'quite brief' : 'a good start'}. In professional interviews, it's important to provide comprehensive answers with specific examples and measurable outcomes.`;
    interviewerResponse = `${userPrefix}Thank you for attempting the question. Let me ask a follow-up to help you provide more detail.`;
    correctedAnswer = "For stronger responses, use the STAR method: Describe the Situation, Task, Action you took, and Results achieved. Include specific numbers and outcomes.";
  }

  // Dynamic follow-up questions for first question chain
  if (followUpCount < 3 && overallScore < 85) {
    if (!hasExamples && followUpCount === 0) {
      followUpQuestion = "Could you provide a specific example from your experience that illustrates this point?";
    } else if (!hasMetrics && followUpCount === 1) {
      followUpQuestion = "What were the measurable outcomes or results in that situation? Can you quantify the impact?";
    } else if (followUpCount === 2) {
      followUpQuestion = "Could you walk me through your thought process in more detail? What alternative approaches did you consider?";
    } else {
      followUpQuestion = "How would you apply this experience to the requirements of this role?";
    }
  }

  return {
    score: overallScore,
    contentScore,
    behavioralScore: behavioralData?.score || Math.max(50, contentScore - 5),
    voiceScore: voiceData?.confidence || Math.max(50, contentScore - 5),
    strengths: hasExamples ? 
      ['Used specific examples to illustrate points', 'Good structure and clarity'] : 
      ['Addressed the question directly', 'Clear communication style'],
    improvements: !hasExamples ? 
      ['Add more specific examples from experience', 'Include measurable results and outcomes'] : 
      ['Provide more detailed explanations', 'Connect experience more directly to role requirements'],
    suggestions: [
      'Use the STAR method (Situation, Task, Action, Result) for behavioral questions',
      'Include quantifiable metrics whenever possible',
      'Connect your experience directly to the role requirements',
      'Explain your thought process and decision-making'
    ],
    skillAssessment: {
      'Communication': contentScore,
      'Problem Solving': Math.max(50, contentScore - 5),
      'Technical Knowledge': contentScore,
      'Confidence': Math.max(50, contentScore - 10),
      'Professionalism': Math.max(50, contentScore - 5)
    },
    detailedFeedback,
    confidenceLevel: overallScore,
    behavioralAnalysis: behavioralData || getFallbackBehavioralAnalysis(),
    voiceAnalysis: voiceData || getFallbackVoiceAnalysis(),
    comprehensiveFeedback: generateComprehensiveFeedback(
      contentScore,
      behavioralData?.score || 65,
      voiceData?.confidence || 65,
      { score: contentScore },
      behavioralData,
      voiceData
    ),
    interviewerResponse,
    correctedAnswer,
    expectedAnswer: `An ideal response would include specific examples, measurable outcomes, clear problem-solving methodology, and relevant experience details. For ${question.type} questions, focus on ${question.type === 'behavioral' ? 'concrete examples from your past experience' : question.type === 'technical' ? 'your technical approach and methodology' : 'your relevant skills and capabilities'}.`,
    followUpQuestion
  };
};

// NEW: Handle user questions with API - MAKE SURE THIS FUNCTION EXISTS
const handleUserQuestionWithAPI = async (
  userQuestion: string,
  currentQuestion: Question,
  interviewState: InterviewState,
  userName: string = ''
): Promise<string> => {
  try {
    const response = await fetch('/api/analyze-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: currentQuestion.question,
        answer: '', // Empty since user is asking, not answering
        userQuestion: userQuestion,
        isUserQuestion: true,
        userName: userName,
        performanceScore: interviewState.performanceScore,
        conversationContext: interviewState.conversationContext
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.interviewerResponse || getDefaultUserQuestionResponse(userQuestion, userName);
    } else {
      console.error('User question API error:', response.status);
    }
  } catch (error) {
    console.error('Error handling user question with API:', error);
  }

  return getDefaultUserQuestionResponse(userQuestion, userName);
};
// NEW: Call actual Groq API for analysis
const callAIAnalysisAPI = async (
  question: Question,
  answer: string,
  state: InterviewState,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis,
  userName: string = '',
  followUpCount: number = 0
) => {
  const apiUrl = '/api/analyze-answer'; // Your API route
  
 // In callAnalysisAPI, ensure the request body includes:
const requestBody = {
  question: question.question,
  answer: answer,
  questionType: question.type,
  difficulty: question.difficulty,
  category: question.category || '',
  userName: userName,
  followUpCount: followUpCount,
  isFollowUpResponse: followUpCount > 0,
  performanceScore: state.performanceScore,
  conversationContext: state.conversationContext.slice(-3),
  skillProficiency: state.skillProficiency,
  behavioralData: behavioralData || {},
  voiceData: voiceData || {},
  // ADD THIS: Explicitly request follow-up generation
  forceFollowUp: followUpCount < MAX_FOLLOW_UPS_PER_QUESTION
};

  console.log('Sending to AI API:', {
    questionType: question.type,
    answerLength: answer.length,
    followUpCount
  });

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`API response error: ${response.status}`);
  }

  const analysis = await response.json();
  
  // Ensure we have valid data structure
  return {
    score: analysis.score || 70,
    contentScore: analysis.contentScore || analysis.score || 70,
    behavioralScore: analysis.behavioralScore || behavioralData?.score || 70,
    voiceScore: analysis.voiceScore || voiceData?.confidence || 70,
    strengths: analysis.strengths || ['Good engagement with the question'],
    improvements: analysis.improvements || ['Provide more specific examples'],
    suggestions: analysis.suggestions || ['Include measurable results in your answers'],
    skillAssessment: analysis.skillAssessment || generateSkillAssessment(
      analysis.contentScore || analysis.score || 70,
      analysis.behavioralScore || behavioralData?.score || 70,
      analysis.voiceScore || voiceData?.confidence || 70,
      question.type
    ),
    detailedFeedback: analysis.detailedFeedback || 'Thank you for your response. Please provide more specific examples from your experience.',
    confidenceLevel: analysis.confidenceLevel || analysis.score || 70,
    behavioralAnalysis: analysis.behavioralAnalysis || behavioralData || getFallbackBehavioralAnalysis(),
    voiceAnalysis: analysis.voiceAnalysis || voiceData || getFallbackVoiceAnalysis(),
    comprehensiveFeedback: analysis.comprehensiveFeedback || generateComprehensiveFeedback(
      analysis.contentScore || analysis.score || 70,
      analysis.behavioralScore || behavioralData?.score || 70,
      analysis.voiceScore || voiceData?.confidence || 70,
      { score: analysis.contentScore || analysis.score || 70 },
      behavioralData,
      voiceData
    ),
    interviewerResponse: analysis.interviewerResponse || 'Thank you for your answer. Let me ask a follow-up question to better understand your experience.',
    correctedAnswer: analysis.correctedAnswer || 'Try to include specific examples, measurable results, and your thought process in your responses.',
    expectedAnswer: analysis.expectedAnswer || 'An ideal response would include specific examples, measurable outcomes, clear problem-solving approach, and relevant experience details.',
    followUpQuestion: analysis.followUpQuestion || (followUpCount < 3 ? 'Could you provide a specific example to illustrate your point?' : null)
  };
};

// NEW: Handle user questions with AI
const handleUserQuestionWithAI = async (
  userQuestion: string,
  currentQuestion: Question,
  interviewState: InterviewState,
  userName: string = ''
): Promise<string> => {
  try {
    const response = await fetch('/api/analyze-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: currentQuestion.question,
        answer: '', // Empty since user is asking, not answering
        userQuestion: userQuestion,
        isUserQuestion: true,
        userName: userName,
        performanceScore: interviewState.performanceScore,
        conversationContext: interviewState.conversationContext
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.interviewerResponse || getDefaultUserQuestionResponse(userQuestion, userName);
    }
  } catch (error) {
    console.error('Error handling user question with AI:', error);
  }

  return getDefaultUserQuestionResponse(userQuestion, userName);
};

// Helper function for user question responses
const getDefaultUserQuestionResponse = (userQuestion: string, userName: string): string => {
  const lowerQuestion = userQuestion.toLowerCase();
  
  if (/repeat|say that again|didn't catch|missed that/i.test(lowerQuestion)) {
    return `Of course${userName ? `, ${userName}` : ''}. I'd be happy to repeat the question. Please listen carefully.`;
  }
  
  if (/clarify|explain|what do you mean|don't understand/i.test(lowerQuestion)) {
    return `I'd be happy to clarify${userName ? `, ${userName}` : ''}. Could you let me know which specific part you'd like me to explain in more detail?`;
  }
  
  return `Thank you for your question${userName ? `, ${userName}` : ''}. That shows good engagement. Let me address that before we continue.`;
};
// NEW: Content-based answer analysis function
const analyzeAnswerContent = async (
  question: Question,
  answer: string,
  behavioralData?: BehavioralAnalysis,
  voiceData?: VoiceAnalysis,
  userName: string = '',
  followUpCount: number = 0,
  interviewState?: InterviewState
) => {
  // Calculate scores based on actual answer content
  const contentScore = calculateContentScore(answer, question);
  const behavioralScore = behavioralData?.score || 60;
  const voiceScore = voiceData?.confidence || 60;

const overallScore = Math.round(
  (contentScore * 0.7) + // Content is 70% of score
  (behavioralScore * 0.2) + // Behavior is 20%
  (voiceScore * 0.1) // Voice is only 10%
);

  // Analyze answer quality for specific feedback
  const answerAnalysis = analyzeAnswerQuality(answer, question);
  
  // Generate follow-up questions based on answer gaps
  const followUpQuestion = generateContentBasedFollowUp(
    question, 
    answer, 
    answerAnalysis, 
    followUpCount,
    overallScore
  );

// In analyzeAnswerWithAI function calls, replace with
// In analyzeAnswerWithAI function calls, replace with:
const skillAssessment = generateSkillAssessment(
  contentScore,
  behavioralScore,
  voiceScore,
  question.type,
  answer.trim().length > 0, // hasUserSpoken - use the answer parameter
  behavioralData ? behavioralData.score > 30 : false // hasUserEngaged
);

  const comprehensiveFeedback = generateComprehensiveFeedback(
    contentScore,
    behavioralScore,
    voiceScore,
    { score: contentScore },
    behavioralData,
    voiceData
  );

  const userPrefix = userName ? `${userName}, ` : '';
  
  // Generate feedback based on actual answer content
  const { feedback, interviewerResponse, correctedAnswer } = generateContentBasedFeedback(
    answerAnalysis,
    overallScore,
    userPrefix,
    followUpCount
  );

  return {
    score: overallScore,
    contentScore,
    behavioralScore,
    voiceScore,
    strengths: answerAnalysis.strengths,
    improvements: answerAnalysis.improvements,
    suggestions: answerAnalysis.suggestions,
    skillAssessment,
    detailedFeedback: feedback,
    confidenceLevel: overallScore,
    behavioralAnalysis: behavioralData || getFallbackBehavioralAnalysis(),
    voiceAnalysis: voiceData || getFallbackVoiceAnalysis(),
    comprehensiveFeedback,
    interviewerResponse,
    correctedAnswer,
    expectedAnswer: answerAnalysis.expectedAnswer,
    followUpQuestion
  };
};

// NEW: Analyze answer quality based on content
const analyzeAnswerQuality = (answer: string, question: Question) => {
  const words = answer.trim().split(/\s+/);
  const wordCount = words.length;
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Check for specific content indicators
  const hasExamples = /example|for instance|such as|specifically|e\.g|in my experience/i.test(answer);
  const hasMetrics = /\d+%|\d+ hours|\d+ dollars|\d+ users|\d+ projects|\d+ years/i.test(answer);
  const hasStructure = /first|then|next|finally|because|therefore|however|although/i.test(answer);
  const hasOutcomes = /result|outcome|achieved|accomplished|saved|improved|increased|reduced|solved/i.test(answer);
  const hasProcess = /process|approach|method|steps|plan|strategy/i.test(answer);
  const hasChallenges = /challenge|difficult|problem|obstacle|setback|issue/i.test(answer);
  const hasLearnings = /learned|realized|understood|discovered|found out/i.test(answer);

  // Calculate content quality score
  let contentQuality = 0;
  if (wordCount > 100) contentQuality += 25;
  else if (wordCount > 60) contentQuality += 20;
  else if (wordCount > 30) contentQuality += 15;
  else if (wordCount > 15) contentQuality += 10;
  
  if (hasExamples) contentQuality += 20;
  if (hasMetrics) contentQuality += 15;
  if (hasStructure) contentQuality += 15;
  if (hasOutcomes) contentQuality += 15;
  if (hasProcess) contentQuality += 10;

  // Generate strengths and improvements
  const strengths: string[] = [];
  const improvements: string[] = [];
  const suggestions: string[] = [];

  if (wordCount > 60) strengths.push("Comprehensive response");
  else improvements.push("Provide more detailed answers");

  if (hasExamples) strengths.push("Good use of specific examples");
  else improvements.push("Include concrete examples from your experience");

  if (hasMetrics) strengths.push("Effective use of measurable results");
  else suggestions.push("Add quantifiable metrics to strengthen your answer");

  if (hasStructure) strengths.push("Well-structured response");
  else suggestions.push("Use clear structure (e.g., STAR method)");

  if (hasOutcomes) strengths.push("Clear focus on results and outcomes");
  else improvements.push("Emphasize the outcomes and impact of your actions");

  if (strengths.length === 0) {
    strengths.push("Engaged with the question");
  }

  // Generate expected answer based on question type
  let expectedAnswer = "An ideal response would include specific examples, measurable outcomes, clear problem-solving approach, and relevant experience details.";
  
  if (question.type === 'behavioral') {
    expectedAnswer = "Use the STAR method: Describe the Situation, Task, Action you took, and Results achieved with specific metrics.";
  } else if (question.type === 'technical') {
    expectedAnswer = "Explain your technical approach, tools/methods used, challenges faced, and measurable outcomes with specific examples.";
  } else if (question.type === 'problem-solving') {
    expectedAnswer = "Describe your problem-solving methodology, steps taken, alternatives considered, and the final solution with results.";
  }

  return {
    wordCount,
    hasExamples,
    hasMetrics,
    hasStructure,
    hasOutcomes,
    hasProcess,
    hasChallenges,
    hasLearnings,
    contentQuality,
    strengths,
    improvements,
    suggestions,
    expectedAnswer
  };
};

// NEW: Generate content-based follow-up questions
const generateContentBasedFollowUp = (
  question: Question,
  answer: string,
  analysis: any,
  followUpCount: number,
  score: number
): string | null => {
  // Don't generate follow-up if score is excellent and we've already asked some
  if (score >= 85 && followUpCount >= 1) {
    return null;
  }

  // Maximum 3 follow-ups per question
  if (followUpCount >= 3) {
    return null;
  }

  const followUps = [];

  // First follow-up: Ask for examples if missing
  if (followUpCount === 0 && !analysis.hasExamples) {
    followUps.push(
      "Could you provide a specific example from your experience that illustrates this?",
      "Can you share a real-world scenario where you applied this knowledge?",
      "What's a concrete example that demonstrates this in practice?"
    );
  }

  // Second follow-up: Ask for metrics or outcomes
  if (followUpCount === 1 && !analysis.hasMetrics) {
    followUps.push(
      "What were the measurable results or outcomes in that situation?",
      "Can you quantify the impact with specific numbers or percentages?",
      "What metrics would you use to measure success in this context?"
    );
  }

  // Third follow-up: Ask for process or challenges
  if (followUpCount === 2 && !analysis.hasProcess) {
    followUps.push(
      "Could you walk me through your specific approach or methodology?",
      "What challenges did you face and how did you overcome them?",
      "What alternative approaches did you consider and why?"
    );
  }

  // General follow-ups based on answer gaps
  if (followUps.length === 0) {
    if (!analysis.hasOutcomes) {
      followUps.push("What was the final outcome or result of this experience?");
    } else if (!analysis.hasLearnings) {
      followUps.push("What did you learn from this experience that you applied later?");
    } else if (!analysis.hasChallenges) {
      followUps.push("What were the main challenges you encountered and how did you address them?");
    } else {
      // Exploratory follow-up for good answers
      followUps.push(
        "How would you apply this approach in a different context?",
        "What would you do differently if you faced this situation today?",
        "How does this experience relate to the requirements of this role?"
      );
    }
  }

  return followUps.length > 0 ? followUps[Math.floor(Math.random() * followUps.length)] : null;
};

// NEW: Generate feedback based on answer content
const generateContentBasedFeedback = (
  analysis: any,
  score: number,
  userPrefix: string,
  followUpCount: number
) => {
  let feedback = '';
  let interviewerResponse = '';
  let correctedAnswer = '';

  if (score >= 85) {
    feedback = `${userPrefix}excellent response! You provided comprehensive details with specific examples and demonstrated strong communication skills.`;
    interviewerResponse = `${userPrefix}thank you for that outstanding answer. You clearly have deep expertise in this area.`;
    correctedAnswer = "Your answer was already strong. To make it even better, you could consider adding more specific metrics or discussing alternative approaches.";
  } else if (score >= 75) {
    feedback = `${userPrefix}very good response. You covered the main points well with relevant examples and good structure.`;
    interviewerResponse = `${userPrefix}thank you for that detailed answer. It gives me a clear picture of your capabilities.`;
    correctedAnswer = "Consider adding more specific metrics to quantify your achievements and emphasizing the key learnings from your experience.";
  } else if (score >= 65) {
    feedback = `${userPrefix}good response. You addressed the question appropriately. Consider adding more specific examples and measurable outcomes.`;
    interviewerResponse = `${userPrefix}thank you for your response. That helps me understand your approach.`;
    correctedAnswer = "Try to use the STAR method: Describe a specific Situation, the Task required, Actions you took, and Results achieved with numbers.";
  } else {
    feedback = `${userPrefix}your response was quite brief. In professional settings, it's important to provide comprehensive answers with specific examples, confident delivery, and professional body language.`;
    interviewerResponse = `${userPrefix}thank you for attempting the question. Let me ask a follow-up to help you provide more detail.`;
    correctedAnswer = "An improved answer would include: 1) A specific example from your experience, 2) Your step-by-step approach, 3) Measurable results or outcomes, 4) Key learnings or insights gained.";
  }

  // Add specific suggestions based on analysis
  if (!analysis.hasExamples && score < 80) {
    correctedAnswer += " Include concrete examples from your actual work experience to make your answer more credible and engaging.";
  }

  if (!analysis.hasMetrics && score < 80) {
    correctedAnswer += " Add quantifiable results like percentages, time saved, costs reduced, or performance improvements to demonstrate impact.";
  }

  return { feedback, interviewerResponse, correctedAnswer };
};

// NEW: Fallback content-based analysis
const generateContentBasedAnalysis = (
  question: Question,
  answer: string,
  behavioralData: BehavioralAnalysis,
  voiceData: VoiceAnalysis,
  userName: string = '',
  followUpCount: number = 0
) => {
  const analysis = analyzeAnswerQuality(answer, question);
  const contentScore = analysis.contentQuality;
  const behavioralScore = behavioralData.score;
  const voiceScore = voiceData.confidence;

const overallScore = Math.round(
  (contentScore * 0.7) + // Content is 70% of score
  (behavioralScore * 0.2) + // Behavior is 20%
  (voiceScore * 0.1) // Voice is only 10%
);
  const followUpQuestion = generateContentBasedFollowUp(
    question, 
    answer, 
    analysis, 
    followUpCount,
    overallScore
  );

  const userPrefix = userName ? `${userName}, ` : '';
  const { feedback, interviewerResponse, correctedAnswer } = generateContentBasedFeedback(
    analysis,
    overallScore,
    userPrefix,
    followUpCount
  );

  return {
    score: overallScore,
    contentScore,
    behavioralScore,
    voiceScore,
    strengths: analysis.strengths,
    improvements: analysis.improvements,
    suggestions: analysis.suggestions,
    skillAssessment: generateSkillAssessment(
  contentScore, 
  behavioralScore, 
  voiceScore, 
  question.type,
  behavioralData ? behavioralData.score > 30 : false // Add this
),
    detailedFeedback: feedback,
    confidenceLevel: overallScore,
    behavioralAnalysis: behavioralData,
    voiceAnalysis: voiceData,
    comprehensiveFeedback: generateComprehensiveFeedback(contentScore, behavioralScore, voiceScore, { score: contentScore }, behavioralData, voiceData),
    interviewerResponse,
    correctedAnswer,
    expectedAnswer: analysis.expectedAnswer,
    followUpQuestion
  };
};

// NEW: Enhanced real analysis function with proper follow-up generation
const getEnhancedRealAnalysisWithFollowUps = async (
  question: Question,
  answer: string,
  behavioralData: BehavioralAnalysis,
  voiceData: VoiceAnalysis,
  userName: string = '',
  currentFollowUpCount: number = 0,
  interviewState?: InterviewState
) => {
  const hasUserSpoken = answer.trim().length > 0;
  const contentScore = calculateContentScore(answer, question);
  const behavioralScore = behavioralData.score;
const voiceScore = calculateVoiceScore(
  voiceData, 
  answer.trim().length > 10, // hasUserSpoken
  answer.trim().length
);
 const overallScore = Math.round(
  (contentScore * 0.7) + // Content is 70% of score
  (behavioralScore * 0.2) + // Behavior is 20%
  (voiceScore * 0.1) // Voice is only 10%
);

// In analyzeAnswerWithAI function calls, replace with:
// In analyzeAnswerWithAI function calls, replace with:
const skillAssessment = generateSkillAssessment(
  contentScore,
  behavioralScore,
  voiceScore,
  question.type,
  answer.trim().length > 0, // hasUserSpoken - use the answer parameter
  behavioralData ? behavioralData.score > 30 : false // hasUserEngaged
);
  const comprehensiveFeedback = generateComprehensiveFeedback(
    contentScore,
    behavioralScore,
    voiceScore,
    { score: contentScore },
    behavioralData,
    voiceData
  );

  const userPrefix = userName ? `${userName}, ` : '';
  
  let feedback = '';
  let interviewerResponse = '';
  let followUpQuestion = null;

  // ENHANCED: Better answer analysis and feedback generation
  const answerLower = answer.toLowerCase();
  
  // Analyze answer quality for follow-up decisions
  const isConfused = /don't understand|don't know|not sure|confused|can you repeat|what do you mean/i.test(answerLower);
  const isVague = /maybe|perhaps|probably|I think|I guess|kind of|sort of/i.test(answerLower);
  const isShort = answer.trim().split(/\s+/).length < 20;
  const lacksExamples = !/example|for instance|such as|specifically|in my experience/i.test(answerLower);
  const lacksStructure = !/first|then|next|finally|because|therefore|however/i.test(answerLower);
  const lacksMetrics = !/\d+%|\d+ hours|\d+ dollars|\d+ users|\d+ projects/i.test(answerLower);

  // Generate appropriate feedback based on answer quality
  if (isConfused) {
    feedback = `${userPrefix}I notice you seem unsure about this question. Let me clarify what I'm looking for and give you another chance to answer.`;
    interviewerResponse = `${userPrefix}I understand this might be challenging. Let me rephrase the question to make it clearer for you.`;
    followUpQuestion = generateClarificationFollowUp(question, answer);
  } 
  else if (overallScore >= 90 && currentFollowUpCount === 0) {
    feedback = `${userPrefix}excellent response! You provided comprehensive details with specific examples and demonstrated strong communication skills.`;
    interviewerResponse = `${userPrefix}thank you for that outstanding answer. You clearly have deep expertise in this area.`;
    // Even with high scores, ask one follow-up to explore depth
    if (currentFollowUpCount < 1) {
      followUpQuestion = generateExploratoryFollowUp(question, answer, overallScore);
    }
  } else if (overallScore >= 85) {
    feedback = `${userPrefix}that was a very good response. You covered the main points well with relevant examples and good delivery.`;
    interviewerResponse = `${userPrefix}thank you for that detailed answer. It gives me a clear picture of your capabilities.`;
    if (shouldAskFollowUp(overallScore, currentFollowUpCount)) {
      followUpQuestion = generateFirstFollowUp(question, answer, overallScore);
    }
  } else if (overallScore >= 75) {
    feedback = `${userPrefix}good response. You addressed the question appropriately. Consider improving your delivery and adding more specific examples.`;
    interviewerResponse = `${userPrefix}thank you for your response. That helps me understand your approach.`;
    if (shouldAskFollowUp(overallScore, currentFollowUpCount)) {
      followUpQuestion = generateFirstFollowUp(question, answer, overallScore);
    }
  } else if (overallScore >= 65) {
    feedback = `${userPrefix}you've made a good attempt. The response would be stronger with more specific details, better vocal delivery, and confident body language.`;
    interviewerResponse = `${userPrefix}I appreciate your answer. Let me ask a follow-up to better understand your experience.`;
    if (shouldAskFollowUp(overallScore, currentFollowUpCount)) {
      followUpQuestion = currentFollowUpCount === 0 ? 
        generateFirstFollowUp(question, answer, overallScore) : 
        generateSecondFollowUp(question, answer, overallScore);
    }
  } else {
    feedback = `${userPrefix}your response was quite brief. In professional settings, it's important to provide comprehensive answers with specific examples, confident delivery, and professional body language.`;
    interviewerResponse = `${userPrefix}thank you for attempting the question. Let me ask a follow-up to help you provide more detail.`;
    if (shouldAskFollowUp(overallScore, currentFollowUpCount)) {
      followUpQuestion = currentFollowUpCount === 0 ? 
        generateFirstFollowUp(question, answer, overallScore) :
        currentFollowUpCount === 1 ?
        generateSecondFollowUp(question, answer, overallScore) :
        generateThirdFollowUp(question, answer, overallScore);
    }
  }

  // ENHANCED: Generate more specific corrected answer based on actual response issues
  let correctedAnswer = "An improved answer would include specific examples, measurable results, clearer connections to the role requirements, confident vocal delivery, and professional body language.";
  
  if (isVague) {
    correctedAnswer = "Try to be more definitive in your responses. Instead of 'I think maybe...' say 'Based on my experience...' and provide concrete examples.";
  }
  if (lacksExamples) {
    correctedAnswer = "Include specific examples from your experience. For instance, instead of saying 'I handled projects,' say 'I managed a team of 5 on Project X which resulted in 20% efficiency improvement.'";
  }
  if (lacksStructure) {
    correctedAnswer = "Structure your answer clearly. Start with your main point, provide supporting evidence or examples, then conclude with the outcome or learning.";
  }
  if (lacksMetrics) {
    correctedAnswer = "Include measurable results when possible. Instead of 'improved performance,' say 'increased efficiency by 25%' or 'reduced costs by $50,000 annually.'";
  }

  return {
    score: overallScore,
    contentScore,
    behavioralScore,
    voiceScore,
    strengths: generateStrengths(contentScore, behavioralScore, voiceScore),
    improvements: generateImprovements(contentScore, behavioralScore, voiceScore),
    suggestions: [
      "Include specific metrics when possible",
      "Use concrete examples from your experience",
      "Explain your thought process clearly",
      "Highlight measurable outcomes and achievements"
    ],
    skillAssessment,
    detailedFeedback: feedback,
    confidenceLevel: overallScore,
    behavioralAnalysis: behavioralData,
    voiceAnalysis: voiceData,
    comprehensiveFeedback,
    interviewerResponse,
    correctedAnswer,
    expectedAnswer: "An ideal response demonstrates expertise through specific examples, shows problem-solving methodology, highlights relevant outcomes with metrics, uses confident and clear communication, and maintains professional presence.",
    followUpQuestion
  };
};

// ENHANCED: Improved follow-up question generators with better context awareness

const generateClarificationFollowUp = (question: Question, answer: string): string => {
  const clarifications = [
    "Let me simplify that question for you. Could you tell me about a time when you faced a similar challenge and how you approached it?",
    "I understand this might be complex. Let me rephrase: What would be your first steps if you encountered this situation in your work?",
    "Let me make this clearer. Can you share an example from your past experience that relates to this topic?",
    "I'll break this down differently. What skills or knowledge would you apply to address this kind of problem?"
  ];
  return clarifications[Math.floor(Math.random() * clarifications.length)];
};

const generateExploratoryFollowUp = (question: Question, answer: string, score: number): string => {
  const followUps = [
    "That's very insightful. Could you tell me more about how you would apply this approach in a different context?",
    "Excellent answer. What would you say was the most challenging aspect of implementing this solution?",
    "Great perspective. How do you stay updated with the latest developments in this area?",
    "Very comprehensive. What advice would you give to someone just starting in this field?"
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
};

const generateFirstFollowUp = (question: Question, answer: string, score: number): string => {
  const followUps = [
    "Could you provide a specific example to illustrate your experience with this?",
    "Can you elaborate more on your thought process behind that approach?",
    "What were the measurable outcomes or results from that experience?",
    "How did you handle any obstacles or challenges you encountered?",
    "Could you walk me through a real-world scenario where you applied this knowledge?"
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
};

const generateSecondFollowUp = (question: Question, answer: string, score: number): string => {
  const followUps = [
    "I'd like to understand this better. Could you provide more details about your specific role and contributions?",
    "Can you give me a concrete example with specific numbers or metrics?",
    "What was the impact of your actions on the team or project?",
    "How does this experience relate to the requirements of this position?",
    "Could you break down your approach step by step for me?"
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
};

const generateThirdFollowUp = (question: Question, answer: string, score: number): string => {
  const followUps = [
    "Let me rephrase that - could you tell me more about your direct experience with this?",
    "I want to make sure I understand correctly. Could you provide a specific instance?",
    "What specific skills or knowledge did you gain from this experience?",
    "How would you apply what you learned to this role specifically?",
    "Could you share a bit more about the context and your specific responsibilities?"
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
};

// ENHANCED: Improved follow-up decision logic
const shouldAskFollowUp = (score: number, followUpCount: number): boolean => {
  // Always ask at least one follow-up for scores below 85
  if (followUpCount === 0 && score < 85) {
    return true;
  }
  
  // Ask second follow-up for scores below 75
  if (followUpCount === 1 && score < 75) {
    return true;
  }
  
  // Ask third follow-up for scores below 65
  if (followUpCount === 2 && score < 65) {
    return true;
  }
  
  // Maximum of 3 follow-ups
  return followUpCount < 3 && score < 85;
};

// Main Component with Enhanced Features
export default function EnhancedActiveInterviewPage() {
  const router = useRouter();
  
  // Basic state
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [profile, setProfile] = useState<InterviewProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasUserActuallySpoken, setHasUserActuallySpoken] = useState(false);
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number | null>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<string>('');
  const [useAI, setUseAI] = useState(true);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const [isDynamicMode, setIsDynamicMode] = useState(true);
  const [interviewPhase, setInterviewPhase] = useState<'intro' | 'main' | 'closing'>('intro');
  const [userName, setUserName] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  // ENHANCED: Improved flow management with question chat states
  const [interviewFlow, setInterviewFlow] = useState<
    'welcome' | 
    'question-asked' | 
    'waiting-for-answer' | 
    'processing' | 
    'showing-feedback' | 
    'showing-corrected-answers' | 
    'asking-followup' |
    'proceeding-to-next' |
    'user-question' |
    'user-question-response' |
    'feedback-complete'
  >('welcome');
  
  const [pendingFollowUpQuestion, setPendingFollowUpQuestion] = useState<string | null>(null);
  const [isFollowUpRound, setIsFollowUpRound] = useState(false);
  const [currentInterviewerMessage, setCurrentInterviewerMessage] = useState<string>('');

  // ENHANCED: Improved state management for question chat
  const [showCorrectedAnswer, setShowCorrectedAnswer] = useState(false);
  const [currentCorrectedAnswer, setCurrentCorrectedAnswer] = useState('');
  const [currentExpectedAnswer, setCurrentExpectedAnswer] = useState('');
  const [currentQuestionScore, setCurrentQuestionScore] = useState<number>(0);
  const [comprehensiveFeedback, setComprehensiveFeedback] = useState<ComprehensiveFeedback | null>(null);

  // ENHANCED: Improved user question state with resume functionality
  const [currentUserQuestion, setCurrentUserQuestion] = useState<string>('');
  const [showUserQuestionInput, setShowUserQuestionInput] = useState<boolean>(false);
  const [userQuestionResponse, setUserQuestionResponse] = useState<string>('');
  const [isQuestionChatActive, setIsQuestionChatActive] = useState<boolean>(false);

  // Video Interviewer State
  const [isVideoInterviewerEnabled, setIsVideoInterviewerEnabled] = useState(true);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [shouldShowVideo, setShouldShowVideo] = useState(true);
  const [isUserAnswering, setIsUserAnswering] = useState(false);

  // Interview state - FIXED: Initialize with proper question counting
  const [interviewState, setInterviewState] = useState<InterviewState>({
    performanceScore: 0,
    skillProficiency: {},
    difficultyLevel: 'medium',
    answeredQuestions: 0,
    conversationContext: [],
    weakAreas: [],
    strongAreas: [],
    adaptiveInsights: [],
    interviewStage: 'introduction',
    currentFollowUpCount: 0,
    currentMainQuestionId: undefined,
    currentQuestionHasFollowUps: false
  });

  // Media state
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [hasMediaPermissions, setHasMediaPermissions] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [cameraError, setCameraError] = useState<string>('');

  // Speech recognition state
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Track interview flow
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [hasAskedFirstQuestion, setHasAskedFirstQuestion] = useState(false);

  // Interview question limits - FIXED: Proper question countinue

  const MAX_MAIN_QUESTIONS = 10;
const MAX_FOLLOW_UPS_PER_QUESTION = 3;


 const shouldAskFollowUp = (score: number, followUpCount: number, answerLength: number): boolean => {
  // Don't ask follow-ups if answer is very brief
  if (answerLength < 10) {
    return false;
  }

  // Always ask at least one follow-up for scores below 85
  if (followUpCount === 0 && score < 85) {
    return true;
  }
  
  // Ask second follow-up for scores below 75 with meaningful answers
  if (followUpCount === 1 && score < 75 && answerLength > 20) {
    return true;
  }
  
  // Ask third follow-up only for scores below 65 with substantial answers
  if (followUpCount === 2 && score < 65 && answerLength > 30) {
    return true;
  }
  
  // Maximum of 3 follow-ups
  return followUpCount < 3;
};
// FIXED: Enhanced answer submission with proper follow-up flow
// FIXED: Enhanced answer submission with accurate scoring and TypeScript fixes
const handleSubmitAnswer = async () => {
  if (!currentAnswer.trim() && recordedChunks.length === 0) {
    alert('Please provide an answer before proceeding');
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    setError('No current question found');
    return;
  }

  setInterviewFlow('processing');
  setIsAnalyzing(true);

  try {
    if (currentQuestion.type === 'introduction' && !userName) {
      const extractedName = extractUserName(currentAnswer);
      if (extractedName) {
        setUserName(extractedName);
      }
    }

    // ENHANCED: Better gibberish detection for current answer
    const hasGibberish = detectGibberish(currentAnswer);
    const wordCount = currentAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Get real-time analysis data
    const currentAnalysis = realTimeAnalyzer.getCurrentAnalysis();
    
    let behavioralData: BehavioralAnalysis | undefined;
    let voiceData: VoiceAnalysis | undefined;

    // Only analyze behavior if user is engaged and visible
    if (mediaStream && isVideoEnabled && videoRef.current) {
      behavioralData = await analyzeBehaviorFromVideo(videoRef.current, isUserAnswering);
    } else {
      behavioralData = getFallbackBehavioralAnalysis();
    }

    // ENHANCED: Force low scores for gibberish answers
    let contentScore, behavioralScore, voiceScore, overallScore;

    if (hasGibberish || wordCount < 3) {
      // FORCE LOW SCORES FOR GIBBERISH
      contentScore = Math.max(1, Math.min(10, wordCount * 2));
      behavioralScore = Math.max(1, behavioralData?.score ? behavioralData.score / 4 : 10);
      voiceScore = 0;
      overallScore = Math.max(1, Math.round(
        (contentScore * 0.7) + 
        (behavioralScore * 0.2) + 
        (voiceScore * 0.1)
      ));
      
      console.log('🔴 GIBBERISH DETECTED - Forcing low scores:', {
        answer: currentAnswer,
        contentScore,
        overallScore,
        wordCount
      });
    } else {
      // Normal scoring for legitimate answers
      if (mediaStream && isMicEnabled) {
        const answerDuration = Math.max(10, wordCount / 3);
        voiceData = analyzeVoiceFromAudio(mediaStream, currentAnswer, answerDuration);
      } else {
        voiceData = getFallbackVoiceAnalysis();
      }

      contentScore = calculateContentScore(currentAnswer, currentQuestion);
      behavioralScore = behavioralData?.score || 10;
      voiceScore = calculateVoiceScore(voiceData, wordCount > 5, currentAnswer.trim().length);

      overallScore = Math.round(
        (contentScore * 0.7) + 
        (behavioralScore * 0.2) + 
        (voiceScore * 0.1)
      );
    }

    const skillAssessment = generateSkillAssessment(
      contentScore,
      behavioralScore,
      voiceScore,
      currentQuestion.type,
      wordCount > 3,
      behavioralData ? behavioralData.score > 30 : false
    );

    // Create analysis object with accurate scores and proper typing
    const analysis = {
      score: overallScore,
      contentScore,
      behavioralScore,
      voiceScore,
      strengths: contentScore > 50 ? ['Attempted to answer'] : ['Willing to participate'],
      improvements: contentScore < 30 ? ['Provide meaningful responses with specific examples'] : ['Continue developing detailed answers'],
      suggestions: [
        "Include specific examples from your experience",
        "Use concrete metrics when possible",
        "Explain your thought process clearly"
      ],
      skillAssessment,
      detailedFeedback: contentScore < 20 
        ? "Your response was very brief and didn't demonstrate understanding of the question. Please provide more detailed answers with specific examples." 
        : `You scored ${overallScore}% on this question. ${contentScore < 50 ? 'Try to provide more specific examples and detailed explanations.' : 'Good effort on this response.'}`,
      confidenceLevel: overallScore,
      behavioralAnalysis: behavioralData,
      voiceAnalysis: voiceData,
      comprehensiveFeedback: generateComprehensiveFeedback(
        contentScore,
        behavioralScore,
        voiceScore,
        { score: contentScore },
        behavioralData,
        voiceData
      ),
      interviewerResponse: contentScore < 30 
        ? "Thank you for your attempt. Let me ask a follow-up question to help you provide more detail."
        : "Thank you for your response. Let me ask a follow-up to better understand your approach.",
      correctedAnswer: "An improved answer would include specific examples, measurable results, and clear explanations of your thought process.",
      expectedAnswer: "A strong response demonstrates expertise through specific examples, shows problem-solving methodology, and highlights relevant outcomes.",
      followUpQuestion: contentScore < 60 ? "Could you provide a specific example to illustrate your experience with this?" : undefined // Use undefined instead of null
    };

    const answer: Answer = {
      questionId: currentQuestion.id,
      answer: currentAnswer,
      timestamp: new Date().toISOString(),
      score: overallScore,
      aiEvaluation: analysis
    };

    if (recordedChunks.length > 0) {
      answer.audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
    }

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    
    // SET CURRENT QUESTION SCORE FOR DISPLAY
    setCurrentQuestionScore(overallScore);
    
    // Set comprehensive feedback for display
    if (analysis.comprehensiveFeedback) {
      setComprehensiveFeedback(analysis.comprehensiveFeedback);
    }

    // Count main questions correctly (exclude follow-ups)
    const mainQuestionsAnswered = updatedAnswers.filter(a => {
      const question = questions.find(q => q.id === a.questionId);
      return question && !question.isFollowUp;
    }).length;

    // FIXED: Update performance score to be average of ALL answers
    const totalScore = updatedAnswers.reduce((acc, ans) => acc + (ans.score || 0), 0);
    const avgScore = updatedAnswers.length > 0 ? Math.round(totalScore / updatedAnswers.length) : 0;
    
    // Update interview state with accurate performance score
    const newSkillProficiency = {
      ...interviewState.skillProficiency,
      ...skillAssessment
    };

    const newState: InterviewState = {
      ...interviewState,
      performanceScore: avgScore, // This is the AVERAGE of all answers
      answeredQuestions: mainQuestionsAnswered,
      conversationContext: [
        ...interviewState.conversationContext.slice(-3),
        `Q: ${currentQuestion.question.substring(0, 100)}... A: ${currentAnswer.substring(0, 100)}...`
      ],
      skillProficiency: newSkillProficiency,
    };
    setInterviewState(newState);

    console.log('📊 SCORING BREAKDOWN:', {
      currentAnswer: currentAnswer,
      wordCount: wordCount,
      hasGibberish: hasGibberish,
      contentScore: contentScore,
      overallScore: overallScore,
      performanceScore: avgScore,
      answerCount: updatedAnswers.length
    });

    // Check if interview should end using main questions count
    if (shouldEndInterview(mainQuestionsAnswered)) {
      completeInterview(updatedAnswers, newSkillProficiency, avgScore, analysis);
      return;
    }

    // Set feedback
    setCurrentFeedback(analysis.detailedFeedback);
    setInterviewFlow('showing-feedback');
    
    // Set corrected answers for display
    setCurrentCorrectedAnswer(analysis.correctedAnswer);
    setCurrentExpectedAnswer(analysis.expectedAnswer);

    // Speak interviewer response
    await speakInterviewerMessage(analysis.interviewerResponse);

    // Wait for speech to complete, then check for next follow-up
    setTimeout(() => {
      const hasReachedMaxFollowUps = interviewState.currentFollowUpCount >= MAX_FOLLOW_UPS_PER_QUESTION;
      const shouldAskFollowUpQuestion = analysis.followUpQuestion && !hasReachedMaxFollowUps;

      if (shouldAskFollowUpQuestion && analysis.followUpQuestion) {
        setInterviewState(prev => ({
          ...prev,
          currentFollowUpCount: prev.currentFollowUpCount + 1,
          currentQuestionHasFollowUps: true,
          currentMainQuestionId: currentQuestion.id
        }));

        setPendingFollowUpQuestion(analysis.followUpQuestion);
        setInterviewFlow('asking-followup');
        setIsUserAnswering(false);
        
        setTimeout(() => {
          speakInterviewerMessage(analysis.followUpQuestion!);
        }, 1500);
      } else {
        setShowCorrectedAnswer(true);
        setInterviewFlow('showing-corrected-answers');
        
        setTimeout(() => {
          setInterviewState(prev => ({
            ...prev,
            currentFollowUpCount: 0,
            currentQuestionHasFollowUps: false,
            currentMainQuestionId: undefined
          }));
          
          handleProceedToNextQuestion();
        }, 30000);
      }
    }, 2000);
  } catch (error) {
    console.error('Error processing answer:', error);
    setError(`Error processing answer: ${error}`);
    setInterviewFlow('waiting-for-answer');
  } finally {
    setIsAnalyzing(false);
  }
};
// Add this function to make the flow more natural
const getRealisticFlowTiming = (message: string): number => {
  const wordCount = message.split(' ').length;
  const baseTime = Math.max(1500, (wordCount / 3) * 1000); // Realistic speaking pace
  return Math.min(baseTime, 5000); // Cap at 5 seconds max
};
// FIXED: Enhanced follow-up answer handling with automatic progression
// FIXED: Enhanced follow-up answer handling with automatic progression after 3 follow-ups
const handleFollowUpAnswer = async () => {
  if (!currentAnswer.trim() && recordedChunks.length === 0) {
    alert('Please provide an answer to the follow-up question');
    return;
  }

  setInterviewFlow('processing');
  setIsAnalyzing(true);

  try {
    // Check if user actually spoke - use the existing answer length as indicator
    const hasUserActuallySpoken = currentAnswer.trim().length > 10;
    const userEngagementLevel = realTimeAnalyzer.getUserEngagementLevel ? realTimeAnalyzer.getUserEngagementLevel() : 0;

    const followUpQuestion: Question = {
      id: `followup-${Date.now()}`,
      question: pendingFollowUpQuestion || 'Could you elaborate on that?',
      type: 'follow-up',
      difficulty: interviewState.difficultyLevel,
      category: questions[currentQuestionIndex]?.category || 'General',
      timeLimit: 120,
      fieldRelevant: true,
      followsUp: true,
      isFollowUp: true,
      parentQuestionId: interviewState.currentMainQuestionId || questions[currentQuestionIndex]?.id
    };

    // Get real-time analysis
    const currentAnalysis = realTimeAnalyzer.getCurrentAnalysis();
    
    let behavioralData: BehavioralAnalysis | undefined;
    let voiceData: VoiceAnalysis | undefined;

    if (mediaStream && isVideoEnabled && videoRef.current && userEngagementLevel > 20) {
      behavioralData = await analyzeBehaviorFromVideo(videoRef.current, isUserAnswering);
    } else {
      behavioralData = getFallbackBehavioralAnalysis();
    }

    if (hasUserActuallySpoken && mediaStream && isMicEnabled) {
      const answerDuration = Math.max(10, currentAnswer.split(/\s+/).length / 3);
      voiceData = analyzeVoiceFromAudio(mediaStream, currentAnswer, answerDuration);
    } else {
      voiceData = {
        volume: 0,
        clarity: 0,
        pace: 0,
        tone: 0,
        fillerWords: 0,
        pauses: 0,
        confidence: 0
      };
    }

    // Get REAL AI analysis for follow-up
    const analysis = await analyzeAnswerWithAI(
      followUpQuestion, 
      currentAnswer, 
      interviewState,
      behavioralData,
      voiceData,
      userName || '',
      false,
      '',
      interviewState.currentFollowUpCount,
      mediaStream,
      isVideoEnabled
    );

    // Calculate scores for display
    const contentScore = calculateContentScore(currentAnswer, followUpQuestion);
    const behavioralScore = behavioralData.score;
    const voiceScore = calculateVoiceScore(voiceData, hasUserActuallySpoken, currentAnswer.trim().length);

    const overallScore = Math.round(
      (contentScore * 0.7) + // Content is 70% of score
      (behavioralScore * 0.2) + // Behavior is 20%
      (voiceScore * 0.1) // Voice is only 10%
    );

    const skillAssessment = generateSkillAssessment(
      contentScore,
      behavioralScore,
      voiceScore,
      followUpQuestion.type,
      currentAnswer.trim().length > 0,
      behavioralData ? behavioralData.score > 30 : false
    );

    const answer: Answer = {
      questionId: followUpQuestion.id,
      answer: currentAnswer,
      timestamp: new Date().toISOString(),
      score: analysis.score,
      aiEvaluation: {
        ...analysis,
        contentScore,
        behavioralScore,
        voiceScore,
        skillAssessment
      }
    };

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    setCurrentQuestionScore(analysis.score);

    // Set comprehensive feedback
    if (analysis.comprehensiveFeedback) {
      setComprehensiveFeedback(analysis.comprehensiveFeedback);
    }

    const newSkillProficiency = {
      ...interviewState.skillProficiency,
      ...skillAssessment
    };
    
    const totalScore = updatedAnswers.reduce((acc, ans) => acc + (ans.score || 0), 0);
    const avgScore = updatedAnswers.length > 0 ? Math.round(totalScore / updatedAnswers.length) : interviewState.performanceScore;

    const newState: InterviewState = {
      ...interviewState,
      performanceScore: avgScore,
      skillProficiency: newSkillProficiency,
    };
    setInterviewState(newState);

    // Check if interview should end using main questions count
    const mainQuestionsAnswered = updatedAnswers.filter(a => {
      const question = questions.find(q => q.id === a.questionId);
      return question && !question.isFollowUp;
    }).length;
    
    if (shouldEndInterview(mainQuestionsAnswered)) {
      completeInterview(updatedAnswers, newSkillProficiency, avgScore, analysis);
      return;
    }

    setCurrentFeedback(analysis.detailedFeedback);
    setInterviewFlow('showing-feedback');
    
    setCurrentCorrectedAnswer(analysis.correctedAnswer);
    setCurrentExpectedAnswer(analysis.expectedAnswer);
    
    // Speak natural interviewer response immediately
    await speakInterviewerMessage(analysis.interviewerResponse);

    // Wait for speech to complete, then check for next follow-up
    setTimeout(() => {
      const hasReachedMaxFollowUps = interviewState.currentFollowUpCount >= MAX_FOLLOW_UPS_PER_QUESTION;
      
      // CRITICAL FIX: After 3 follow-ups, show feedback and move to next question
      if (hasReachedMaxFollowUps) {
        console.log('🎯 MAX FOLLOW-UPS REACHED - Moving to next question');
        
        // Show comprehensive feedback for the final follow-up
        setShowCorrectedAnswer(true);
        setInterviewFlow('showing-corrected-answers');
        
        // Auto-proceed to next question after showing feedback
        setTimeout(() => {
          // Reset follow-up state and auto-proceed
          setInterviewState(prev => ({
            ...prev,
            currentFollowUpCount: 0,
            currentQuestionHasFollowUps: false,
            currentMainQuestionId: undefined
          }));
          
          // Auto-proceed to next question
          handleProceedToNextQuestion();
        }, 25000); // Show feedback for 25 seconds then move on
      } 
      // Ask next follow-up if we haven't reached max
      else if (analysis.followUpQuestion) {
        // Update follow-up count and ask next follow-up
        setInterviewState(prev => ({
          ...prev,
          currentFollowUpCount: prev.currentFollowUpCount + 1
        }));

        setPendingFollowUpQuestion(analysis.followUpQuestion);
        setInterviewFlow('asking-followup');
        setIsUserAnswering(false);
        
        setTimeout(() => {
          speakInterviewerMessage(analysis.followUpQuestion || '');
        }, 1000);
      } 
      // No more follow-ups but haven't reached max - move to next question
      else {
        setShowCorrectedAnswer(true);
        setInterviewFlow('showing-corrected-answers');
        
        setTimeout(() => {
          // Reset follow-up state and auto-proceed
          setInterviewState(prev => ({
            ...prev,
            currentFollowUpCount: 0,
            currentQuestionHasFollowUps: false,
            currentMainQuestionId: undefined
          }));
          
          // Auto-proceed to next question
          handleProceedToNextQuestion();
        }, 25000);
      }
    }, 2000);

  } catch (error) {
    console.error('Error processing follow-up answer:', error);
    setError(`Error processing follow-up answer: ${error}`);
    setInterviewFlow('asking-followup');
  } finally {
    setIsAnalyzing(false);
  }
};
 // ENHANCED: Improved user question handling with resume functionality
const handleUserQuestion = async (userQuestion: string) => {
  if (!userQuestion.trim()) return;

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return;

  // Save the current interview flow state before processing user question
  const previousFlowState = interviewFlow;
  
  setInterviewFlow('processing');
  setIsAnalyzing(true);
  setCurrentUserQuestion('');
  setIsQuestionChatActive(true);

  try {
    // REAL ANALYSIS: Analyze behavioral and voice data for user question context
    let behavioralData: BehavioralAnalysis | undefined;
    let voiceData: VoiceAnalysis | undefined;

    // Analyze behavior from video if available
    if (mediaStream && isVideoEnabled && videoRef.current) {
    behavioralData = await analyzeBehaviorFromVideo(videoRef.current, isUserAnswering);
    }

    // Analyze voice from audio stream
    if (mediaStream && isMicEnabled) {
      const questionDuration = Math.max(5, userQuestion.split(/\s+/).length / 3);
      voiceData = analyzeVoiceFromAudio(mediaStream, userQuestion, questionDuration);
    }

    // FIXED: Call analyzeAnswerWithAI with ALL required parameters
    const analysis = await analyzeAnswerWithAI(
      currentQuestion,
      '', // Empty answer since user is asking, not answering
      interviewState,
      behavioralData,
      voiceData,
      userName || '',
      true, // isUserQuestion flag
      userQuestion,
      interviewState.currentFollowUpCount,
      mediaStream,  // ADD THIS
      isVideoEnabled  // ADD THIS
    );

    // Update interview state with the analysis of user's question behavior
    if (analysis.score > 0) {
      const newSkillProficiency = {
        ...interviewState.skillProficiency,
        ...analysis.skillAssessment
      };
      
      const updatedAnswers = [...answers];
      const totalScore = updatedAnswers.reduce((acc, ans) => acc + (ans.score || 0), 0);
      const avgScore = updatedAnswers.length > 0 ? Math.round(totalScore / updatedAnswers.length) : interviewState.performanceScore;

      setInterviewState(prev => ({
        ...prev,
        performanceScore: avgScore,
        skillProficiency: newSkillProficiency,
      }));
    }

    setUserQuestionResponse(analysis.interviewerResponse);
    setShowUserQuestionInput(false);
    
    // Set comprehensive feedback if available
    if (analysis.comprehensiveFeedback) {
      setComprehensiveFeedback(analysis.comprehensiveFeedback);
    }
    
    // Set the flow to user question response
    setInterviewFlow('user-question-response');
    
    // Speak the interviewer's response with real analysis context
    setTimeout(() => {
      speakInterviewerMessage(analysis.interviewerResponse);
    }, 1000);

  } catch (error) {
    console.error('Error processing user question:', error);
    setError('Error processing your question');
    // Restore previous flow state on error
    setInterviewFlow(previousFlowState === 'processing' ? 'waiting-for-answer' : previousFlowState);
  } finally {
    setIsAnalyzing(false);
  }
};
 // ENHANCED: Resume interview function
  const handleResumeInterview = () => {
    setIsQuestionChatActive(false);
    setUserQuestionResponse('');
    setShowUserQuestionInput(false);
    
    // Determine the correct question to resume with
    const currentQuestion = questions[currentQuestionIndex];
    
    // If there's a pending follow-up, resume with follow-up flow
    if (pendingFollowUpQuestion) {
      setInterviewFlow('asking-followup');
      setTimeout(() => {
        speakInterviewerMessage(`Let's continue. ${pendingFollowUpQuestion}`);
      }, 500);
    } 
    // Otherwise, resume with the current main question
    else if (currentQuestion) {
      setInterviewFlow('question-asked');
      setTimeout(() => {
        speakInterviewerMessage(`Let's continue with our interview. ${currentQuestion.question}`);
        // Transition to waiting for answer after speaking
        setTimeout(() => {
          setInterviewFlow('waiting-for-answer');
        }, 3000);
      }, 500);
    }
  };

  // Handle skip follow-up - FIXED: Proper flow transition
  const handleSkipFollowUp = () => {
  // Reset follow-up state
  setPendingFollowUpQuestion(null);
  setIsFollowUpRound(false);
  setCurrentAnswer('');
  setRecordedChunks([]);
  
  // Reset follow-up count for next question
  setInterviewState(prev => ({
    ...prev,
    currentFollowUpCount: 0,
    currentQuestionHasFollowUps: false,
    currentMainQuestionId: undefined
  }));

  // Automatically proceed to next question
  setInterviewFlow('proceeding-to-next');
  
  // Show the next question after a brief delay
  setTimeout(() => {
    handleProceedToNextQuestion();
  }, 1000);
};

  // Skip to next question without answering
  const handleSkipQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Create a skip answer
    const skipAnswer: Answer = {
      questionId: currentQuestion.id,
      answer: "[Skipped]",
      timestamp: new Date().toISOString(),
      score: 0,
      aiEvaluation: {
        strengths: ["Willing to proceed"],
        improvements: ["Consider providing answers to all questions for better assessment"],
        suggestions: ["Try to answer each question to demonstrate your knowledge and skills"],
        skillAssessment: {
          'Communication': 10,
          'Problem Solving': 10,
          'Technical Knowledge': 10,
          'Confidence': 20,
          'Professionalism': 30
        },
        detailedFeedback: "You chose to skip this question. In a real interview, it's better to attempt an answer even if you're unsure.",
        confidenceLevel: 20,
        interviewerResponse: "I understand you'd like to move on. Let's proceed to the next question.",
        correctedAnswer: "In the future, try to provide at least a basic answer showing your thought process.",
        expectedAnswer: "A good response would demonstrate your approach to unfamiliar questions.",
        followUpQuestion:""
      }
    };

    const updatedAnswers = [...answers, skipAnswer];
    setAnswers(updatedAnswers);

    // Reset follow-up count and proceed to next question
    setInterviewState(prev => ({
      ...prev,
      currentFollowUpCount: 0,
      currentQuestionHasFollowUps: false,
      currentMainQuestionId: undefined
    }));

    setInterviewFlow('proceeding-to-next');
    setIsUserAnswering(false);
    
    setTimeout(() => {
      handleProceedToNextQuestion();
    }, 1000);
  };
  // Add this useEffect to load MediaPipe scripts dynamically
useEffect(() => {
  const loadMediaPipeScripts = async () => {
    // Check if MediaPipe is already loaded
    if (typeof window !== 'undefined' && (window as any).FaceMesh) {
      console.log('MediaPipe already loaded');
      return;
    }

    console.log('Loading MediaPipe scripts...');
    
    const scripts = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js'
    ];

    try {
      for (const src of scripts) {
        await new Promise((resolve, reject) => {
          // Check if script is already loaded
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve(true);
            return;
          }

          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = () => {
            console.warn(`Failed to load script: ${src}`);
            resolve(true); // Continue even if one script fails
          };
          document.head.appendChild(script);
        });
      }
      console.log('All MediaPipe scripts loaded successfully');
    } catch (error) {
      console.error('Error loading MediaPipe scripts:', error);
    }
  };

  // Load scripts when interview starts
  if (interviewStarted && !interviewCompleted) {
    loadMediaPipeScripts();
  }
}, [interviewStarted, interviewCompleted]);

  // Initialize real-time analyzer
  useEffect(() => {
    const initializeAnalyzer = async () => {
      await realTimeAnalyzer.initialize();
    };

    initializeAnalyzer();

    return () => {
      realTimeAnalyzer.stopAnalysis();
    };
  }, []);
// FIXED: Start real-time analysis when media is ready
useEffect(() => {
  if (mediaStream && interviewStarted) {
    const startAnalysis = async () => {
      try {
        // Wait a bit for video to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (videoRef.current) {
          console.log('🎯 Starting real-time analysis');
          realTimeAnalyzer.startRealTimeAnalysis(videoRef.current, mediaStream);
        }
      } catch (error) {
        console.error('Failed to start real-time analysis:', error);
      }
    };

    startAnalysis();

    return () => {
      realTimeAnalyzer.stopAnalysis();
    };
  }
}, [mediaStream, interviewStarted]);

// FIXED: Speech recognition with proper initialization
useEffect(() => {
  if (typeof window !== 'undefined') {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      let speechStartTime = Date.now();
      let finalTranscript = '';

      recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
        speechStartTime = Date.now();
        finalTranscript = '';
        realTimeAnalyzer.resetUserSpeech();
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Update the answer with both final and interim results
        const fullTranscript = finalTranscript + interimTranscript;
        if (fullTranscript.trim()) {
          setCurrentAnswer(fullTranscript);
          
          // Calculate duration and update voice metrics
          const duration = Math.max(1, (Date.now() - speechStartTime) / 1000);
          realTimeAnalyzer.updateSpeechMetrics(fullTranscript, duration);
          
          if (!isUserAnswering) {
            setIsUserAnswering(true);
          }
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'not-allowed') {
          console.warn('Microphone permission denied');
        } else if (event.error === 'audio-capture') {
          console.warn('No microphone found');
        }
      };
      
      recognition.onend = () => {
        console.log('🎤 Speech recognition ended');
        // Don't auto-restart - let user control it
      };
      
      setSpeechRecognition(recognition);
      speechRecognitionRef.current = recognition;
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }
}, [isUserAnswering]);

// FIXED: Toggle speech recognition with better error handling
const toggleSpeechRecognition = () => {
  if (!speechRecognitionRef.current) {
    console.warn('Speech recognition not available');
    return;
  }

  try {
    if (isSpeechRecognitionActive) {
      // Stop recognition
      speechRecognitionRef.current.stop();
      setIsSpeechRecognitionActive(false);
      console.log('🎤 Speech recognition stopped');
    } else {
      // Start recognition
      speechRecognitionRef.current.start();
      setIsSpeechRecognitionActive(true);
      setIsUserAnswering(true);
      console.log('🎤 Speech recognition started');
    }
  } catch (error) {
    console.error('Error toggling speech recognition:', error);
    setIsSpeechRecognitionActive(false);
  }
};
  // Effect to detect when user starts typing
  useEffect(() => {
    if (!isUserAnswering && currentAnswer.trim().length > 0) {
      setIsUserAnswering(true);
    }
  }, [currentAnswer, isUserAnswering]);

  // Effect to reset answering state when question changes or AI starts speaking
  useEffect(() => {
    if (isInterviewerSpeaking) {
      setIsUserAnswering(false);
    }
    
    if (interviewFlow === 'waiting-for-answer' && currentQuestionIndex >= 0 && !isInterviewerSpeaking) {
      setIsUserAnswering(false);
    }
  }, [interviewFlow, currentQuestionIndex, isInterviewerSpeaking]);

  // Load interview data from localStorage - FIXED: Proper question initialization
  useEffect(() => {
    setMounted(true);
    
    const loadInterviewData = () => {
      try {
        const activeInterview = localStorage.getItem('activeInterview');
        const interviewProfile = localStorage.getItem('interviewProfile');
        
        if (!activeInterview || !interviewProfile) {
          setError('No active interview found. Please create an interview first.');
          setLoading(false);
          return;
        }

        const interviewData: ActiveInterview = JSON.parse(activeInterview);
        const profileData: InterviewProfile = JSON.parse(interviewProfile);

        setProfile(profileData);
        
        // FIXED: Generate proper initial questions starting from question 1
        if (!interviewData.questions || interviewData.questions.length === 0) {
          const initialQuestions = generateInitialQuestions(profileData);
          setQuestions(initialQuestions);
          setCurrentQuestionIndex(0);
          setQuestionTimeLeft(initialQuestions[0]?.timeLimit || 180);
        } else {
          setQuestions(interviewData.questions);
          setCurrentQuestionIndex(interviewData.currentQuestionIndex || 0);
          setQuestionTimeLeft(interviewData.questions[interviewData.currentQuestionIndex || 0]?.timeLimit || 180);
        }
        
        setAnswers(interviewData.answers || []);
        setIsDynamicMode(true);
        setInterviewStarted(true);

        const initialSkills: { [key: string]: number } = {};
        
        (profileData.skills || []).forEach((skill: string) => {
          initialSkills[skill] = 0;
        });
        
        initialSkills['Communication'] = 0;
        initialSkills['Problem Solving'] = 0;
        initialSkills['Technical Knowledge'] = 0;
        initialSkills['Confidence'] = 0;
        initialSkills['Algorithms'] = 0;
        
        const existingAnswers = interviewData.answers || [];
        
        // FIXED: Count only main questions for progress
        const mainQuestionsAnswered = existingAnswers.filter(a => 
          !interviewData.questions.find(q => q.id === a.questionId)?.isFollowUp
        ).length;
        
        const actualPerformanceScore = existingAnswers.length > 0 ? 
          Math.round(existingAnswers.reduce((acc: number, ans: Answer) => acc + (ans.score || 0), 0) / existingAnswers.length) : 0;

        setInterviewState(prev => ({
          ...prev,
          skillProficiency: initialSkills,
          answeredQuestions: mainQuestionsAnswered,
          performanceScore: actualPerformanceScore,
          currentFollowUpCount: 0,
          currentQuestionHasFollowUps: false,
          currentMainQuestionId: undefined
        }));

      } catch (error) {
        console.error('Error loading interview data:', error);
        setError('Failed to load interview data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadInterviewData();
  }, []);

 // FIXED: Improved welcome flow with proper timing
useEffect(() => {
  if (interviewStarted && questions.length > 0 && !hasWelcomed && !isInterviewerSpeaking) {
    const welcomeMessage = `Welcome to your Talkgenious AI assessment! I'll be presenting questions to evaluate your knowledge and problem-solving abilities. Let's begin with your first question.`;
    
    setHasWelcomed(true);
    speakInterviewerMessage(welcomeMessage);
    
    // FIXED: Proper timing for first question
    const welcomeDuration = Math.max(4000, (welcomeMessage.split(' ').length / 3) * 1000);
    
    setTimeout(() => {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        setHasAskedFirstQuestion(true);
        setInterviewFlow('question-asked');
        
        // Speak the first question
        speakInterviewerMessage(currentQuestion.question);
        
        // Set timeout to move to waiting for answer after question is spoken
        const questionDuration = Math.max(3000, (currentQuestion.question.split(' ').length / 3) * 1000);
        
        setTimeout(() => {
          setInterviewFlow('waiting-for-answer');
          setQuestionTimeLeft(currentQuestion.timeLimit || 180);
        }, questionDuration);
      }
    }, welcomeDuration);
  }
}, [interviewStarted, questions, currentQuestionIndex, hasWelcomed, isInterviewerSpeaking]);

// Improved immediate speech function
const speakInterviewerMessage = async (message: string): Promise<void> => {
  if (!isSpeakerEnabled) return;

  return new Promise((resolve) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any previous speech
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 1.0;
      
      utterance.onend = () => {
        setIsInterviewerSpeaking(false);
        resolve();
      };
      
      utterance.onerror = () => {
        setIsInterviewerSpeaking(false);
        resolve();
      };
      
      setIsInterviewerSpeaking(true);
      setCurrentInterviewerMessage(message);
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback: resolve immediately if no speech synthesis
      setIsInterviewerSpeaking(false);
      resolve();
    }
  });
};
  // FIXED: Enhanced initial question generation to ensure enough questions
const generateInitialQuestions = (profileData: InterviewProfile): Question[] => {
  const introQuestions: Question[] = [
    {
      id: 'intro-1',
      question: `Hello and welcome! I'm Alex from the hiring team at ${profileData.companyName || 'our company'}. Thank you for taking the time to interview for the ${profileData.jobTitle} position. Could you please start by introducing yourself and telling me a bit about your background?`,
      type: 'introduction',
      difficulty: 'easy',
      category: 'Introduction',
      timeLimit: 180,
      fieldRelevant: true
    },
    {
      id: 'intro-2',
      question: `Nice to meet you. What interests you about this ${profileData.jobTitle} role, and why do you believe you would be a good fit for our team?`,
      type: 'introduction',
      difficulty: 'easy',
      category: 'Motivation',
      timeLimit: 120,
      fieldRelevant: true
    }
  ];

  const skillQuestions: Question[] = (profileData.skills || []).slice(0, 4).map((skill, index) => ({
    id: `skill-${index + 1}`,
    question: `I see you've listed ${skill} as one of your key skills. Could you tell me about your experience with this and provide a specific example of how you've used ${skill} in a professional setting?`,
    type: 'skill-assessment',
    difficulty: 'medium',
    category: skill,
    timeLimit: 180,
    fieldRelevant: true,
    skillFocus: [skill]
  }));

  // Add more diverse question types to reach 10+ questions
  const problemSolvingQuestions: Question[] = [
    {
      id: 'problem-1',
      question: `Describe a challenging problem you faced in your previous role and walk me through how you approached solving it.`,
      type: 'problem-solving',
      difficulty: 'medium',
      category: 'Problem Solving',
      timeLimit: 180,
      fieldRelevant: true
    },
    {
      id: 'behavioral-1',
      question: `Tell me about a time you had to work with a difficult team member. How did you handle the situation and what was the outcome?`,
      type: 'behavioral',
      difficulty: 'medium',
      category: 'Teamwork',
      timeLimit: 150,
      fieldRelevant: true
    },
    {
      id: 'technical-1',
      question: `What methodologies or frameworks do you typically use in your work, and how do you decide which approach to take for a new project?`,
      type: 'technical',
      difficulty: 'medium',
      category: 'Methodology',
      timeLimit: 150,
      fieldRelevant: true
    },
    {
      id: 'situational-1',
      question: `Imagine you're leading a project with a tight deadline, and a key team member unexpectedly leaves. How would you handle this situation?`,
      type: 'situational',
      difficulty: 'hard',
      category: 'Leadership',
      timeLimit: 180,
      fieldRelevant: true
    },
    {
      id: 'domain-1',
      question: `What do you consider the most important trends or developments in ${profileData.fieldCategory || 'your field'} right now, and how are you preparing for them?`,
      type: 'domain-specific',
      difficulty: 'medium',
      category: 'Industry Knowledge',
      timeLimit: 150,
      fieldRelevant: true
    }
  ];

  // Generate 10-12 initial questions to ensure we have enough
  const allQuestions = [...introQuestions, ...skillQuestions, ...problemSolvingQuestions];
  
  // If we still don't have enough questions, add some generic ones
  while (allQuestions.length < 12) {
    allQuestions.push({
      id: `generic-${allQuestions.length + 1}`,
      question: `Could you describe your approach to continuous learning and professional development in your field?`,
      type: 'behavioral',
      difficulty: 'medium',
      category: 'Professional Development',
      timeLimit: 120,
      fieldRelevant: true
    });
  }

  return allQuestions.slice(0, 12); // Start with 12 questions to be safe
};

  // Extract user name from introduction answer
  const extractUserName = (answer: string): string => {
    const patterns = [
      /my name is (\w+)/i,
      /i am (\w+)/i,
      /i'm (\w+)/i,
      /call me (\w+)/i,
      /^(\w+) here/i,
      /this is (\w+)/i
    ];
    
    for (const pattern of patterns) {
      const match = answer.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return '';
  };

  // FIXED: Improved interview completion logic
const shouldEndInterview = (currentMainQuestionsCount: number): boolean => {
  // Only end when we've reached the maximum main questions
  if (currentMainQuestionsCount >= MAX_MAIN_QUESTIONS) {
    return true;
  }
  
  // Don't end early based on score - complete all questions
  return false;
};
// FIXED: Enhanced proceed to next question with proper flow
const handleProceedToNextQuestion = async () => {
  // Reset all answer-related states
  setCurrentAnswer('');
  setRecordedChunks([]);
  setCurrentFeedback('');
  setIsFollowUpRound(false);
  setPendingFollowUpQuestion(null);
  setIsUserAnswering(false);
  setComprehensiveFeedback(null);
  setShowCorrectedAnswer(false);
  setShowUserQuestionInput(false);
  setUserQuestionResponse('');
  setIsQuestionChatActive(false);
  
  // FIXED: Count main questions correctly for end condition
  const mainQuestionsAnswered = answers.filter(a => {
    const question = questions.find(q => q.id === a.questionId);
    return question && !question.isFollowUp;
  }).length;
  
  console.log('Proceeding to next question:', {
    currentIndex: currentQuestionIndex,
    totalQuestions: questions.length,
    mainQuestionsAnswered,
    maxMainQuestions: MAX_MAIN_QUESTIONS
  });

  // FIXED: Only end when we reach MAX_MAIN_QUESTIONS
  if (shouldEndInterview(mainQuestionsAnswered)) {
    console.log('Interview completion triggered - reached max questions');
    completeInterview(answers, interviewState.skillProficiency, interviewState.performanceScore, answers[answers.length - 1]?.aiEvaluation);
    return;
  }

  const shouldContinue = (currentQuestionIndex < questions.length - 1 || 
                       (isDynamicMode && mainQuestionsAnswered < MAX_MAIN_QUESTIONS)) &&
                       mainQuestionsAnswered < MAX_MAIN_QUESTIONS;

  console.log('Should continue interview:', shouldContinue);

  if (shouldContinue && !interviewCompleted) {
    let nextQuestion: Question | null = null;
    
    // Use existing questions first
    if (currentQuestionIndex < questions.length - 1) {
      // Use next existing question
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const existingNextQuestion = questions[nextIndex];
      
      if (existingNextQuestion) {
        setQuestionTimeLeft(existingNextQuestion.timeLimit || 180);
        
        // FIXED: Proper question flow with speaking
        setInterviewFlow('question-asked');
        setTimeout(() => {
          speakInterviewerMessage(existingNextQuestion.question);
          
          const questionDuration = Math.max(3000, (existingNextQuestion.question.split(' ').length / 3) * 1000);
          setTimeout(() => {
            setInterviewFlow('waiting-for-answer');
          }, questionDuration);
        }, 1000);
        return;
      }
    } else if (isDynamicMode && mainQuestionsAnswered < MAX_MAIN_QUESTIONS) {
      // Generate only ONE dynamic question when needed
      console.log('Generating dynamic question. Main questions so far:', mainQuestionsAnswered);
      nextQuestion = await generateDynamicNextQuestion();
    }
    
    if (nextQuestion) {
      const updatedQuestions = [...questions, nextQuestion];
      setQuestions(updatedQuestions);
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestionTimeLeft(nextQuestion.timeLimit || 180);
      
      // FIXED: Proper question flow with speaking
      setInterviewFlow('question-asked');
      setTimeout(() => {
        speakInterviewerMessage(nextQuestion!.question);
        
        const questionDuration = Math.max(3000, (nextQuestion!.question.split(' ').length / 3) * 1000);
        setTimeout(() => {
          setInterviewFlow('waiting-for-answer');
        }, questionDuration);
      }, 1000);
    } else {
      // Fallback: complete interview if no more questions can be generated
      console.log('No more questions available, completing interview');
      completeInterview(answers, interviewState.skillProficiency, interviewState.performanceScore, answers[answers.length - 1]?.aiEvaluation);
    }
  } else {
    console.log('Interview completion conditions met');
    completeInterview(answers, interviewState.skillProficiency, interviewState.performanceScore, answers[answers.length - 1]?.aiEvaluation);
  }
};
  // REPLACE your generateDynamicNextQuestion function:
const generateDynamicNextQuestion = async (): Promise<Question | null> => {
  if (!isDynamicMode) return null;
  
  try {
    setIsGeneratingNext(true);
    
    const lastQuestion = questions[currentQuestionIndex];
    const lastAnswer = answers[answers.length - 1];
    
    // Add delay to prevent rapid question generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Generating dynamic question based on:', {
      lastQuestionType: lastQuestion?.type,
      lastAnswerScore: lastAnswer?.score,
      performanceScore: interviewState.performanceScore
    });

    const response = await fetch('/api/generate-next-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobTitle: profile?.jobTitle || '',
        fieldCategory: profile?.fieldCategory || '',
        experience: profile?.experience || '',
        skills: profile?.skills || [],
        currentQuestionIndex: currentQuestionIndex,
        lastQuestion: lastQuestion?.question || '',
        lastAnswer: lastAnswer?.answer || '',
        answerScore: lastAnswer?.score || 0,
        performanceScore: interviewState.performanceScore,
        difficultyLevel: interviewState.difficultyLevel,
        userName: userName || '',
        assessmentType: profile?.assessmentType || 'default',
        isFollowUp: false,
        // Add conversation context to maintain continuity
        conversationContext: interviewState.conversationContext.slice(-2)
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.warn('Dynamic question generation failed with status:', response.status);
      return null;
    }

    const result = await response.json();
    
    if (result.success && result.question) {
      console.log('✅ Successfully generated dynamic question');
      return {
        id: `dynamic-${Date.now()}`,
        question: result.question.question,
        type: result.question.type || 'technical',
        difficulty: result.question.difficulty || 'medium',
        category: result.question.category || 'Technical',
        timeLimit: result.question.timeLimit || 180,
        fieldRelevant: true,
        skillFocus: result.question.skillFocus || ['Problem Solving']
      };
    }
    
    console.warn('Dynamic question generation returned no question');
    return null;
  } catch (error) {
if (error instanceof Error && error.name === 'TimeoutError') {      console.warn('Dynamic question generation timed out');
    } else {
      console.warn('Dynamic question generation error:', error);
    }
    return null;
  } finally {
    setIsGeneratingNext(false);
  }
};

  // Generate fallback question
  const generateFallbackQuestion = (): Question => {
    const weakSkills = Object.entries(interviewState.skillProficiency)
      .filter(([_, score]) => score < 60)
      .map(([skill]) => skill);
    
    const followUpSkill = weakSkills.length > 0 ? weakSkills[0] : profile?.skills?.[0] || 'your skills';
    const userNamePrefix = userName ? `${userName}, ` : '';
    
    return {
      id: `fallback-${Date.now()}`,
      question: `${userNamePrefix}could you tell me more about your experience with ${followUpSkill}?`,
      type: 'skill-assessment',
      difficulty: 'medium',
      category: followUpSkill,
      timeLimit: 150,
      fieldRelevant: true,
      skillFocus: [followUpSkill]
    };
  };
// FIXED: Enhanced completeInterview with formal closing
const completeInterview = (
  updatedAnswers: Answer[], 
  newSkillProficiency: { [key: string]: number }, 
  avgScore: number, 
  analysis: any
) => {
  setInterviewCompleted(true);
  setInterviewFlow('waiting-for-answer');
  setShowCorrectedAnswer(false);
  
  const mainQuestionsAnswered = updatedAnswers.filter(a => {
    const question = questions.find(q => q.id === a.questionId);
    return question && !question.isFollowUp;
  }).length;

  const topSkills = Object.entries(newSkillProficiency)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([skill]) => skill);

  // FIXED: Create proper completed interview data
  const completedInterview = {
    id: `assessment-${Date.now()}`,
    jobTitle: profile?.jobTitle || 'Talkgenious AI Assessment',
    date: new Date().toISOString(),
    totalScore: Math.round(avgScore),
    questions: questions,
    answers: updatedAnswers,
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    duration: timeElapsed,
    type: isDynamicMode ? 'dynamic-ai-interview' : 'smart-field-specific',
    isDynamic: isDynamicMode,
    profile: profile,
    summary: {
      strengths: analysis?.strengths || ['Good communication skills'],
      improvements: analysis?.improvements || ['Could use more specific examples'],
      overallFeedback: analysis?.detailedFeedback || 'Solid performance with room for improvement',
      questionsAnswered: mainQuestionsAnswered,
      totalQuestions: MAX_MAIN_QUESTIONS
    },
    assessmentType: detectAssessmentTypeFromProfile(profile)
  };
  
  // Save to localStorage
  localStorage.setItem('completedInterview', JSON.stringify(completedInterview));
  localStorage.removeItem('activeInterview');

  // Trigger dashboard update
  window.dispatchEvent(new Event('interviewCompleted'));
  localStorage.setItem('interviewUpdated', Date.now().toString());

  // FIXED: Formal closing message
  const finalMessage = 
    `Thank you for completing the Talkgenious AI assessment${userName ? `, ${userName}` : ''}. ` +
    `You have answered ${mainQuestionsAnswered} main questions with an overall performance score of ${Math.round(avgScore)} percent. ` +
    `Your strongest areas were ${topSkills.join(', ')}. ` +
    `This concludes our assessment. The detailed results have been saved to your dashboard. ` +
    `We appreciate your time and participation.`;
  
  speakInterviewerMessage(finalMessage);

  // FIXED: Enhanced completion alert
  setTimeout(() => {
    alert(`🎉 Assessment Complete!

📊 Final Score: ${Math.round(avgScore)}%
❓ Questions Answered: ${mainQuestionsAnswered} of ${MAX_MAIN_QUESTIONS}
🏆 Top Skills: ${topSkills.join(', ')}
⚡ Assessment Type: ${isDynamicMode ? 'AI-Powered Dynamic' : 'Standard'}

${avgScore >= 80 ? '🎯 Outstanding performance! You demonstrated excellent knowledge and communication skills.' : 
  avgScore >= 70 ? '👍 Strong performance with good technical understanding and room for growth.' :
  '💡 Solid foundation with opportunities to enhance detailed examples and specific scenarios.'}

Thank you for participating in the Talkgenious AI assessment! Your results have been saved to your dashboard.`);
  }, 4000);
};
// FIXED: Enhanced assessment type detection
const detectAssessmentTypeFromProfile = (profile: InterviewProfile | null): string => {
  if (!profile) return 'interview';
  
  const jobTitle = profile.jobTitle?.toLowerCase() || '';
  const fieldCategory = profile.fieldCategory?.toLowerCase() || '';
  const assessmentType = profile.assessmentType?.toLowerCase() || '';
  
  // First check if there's an explicit assessment type
  if (assessmentType) {
    return assessmentType;
  }
  
  // Then check job title and field category
  if (jobTitle.includes('academic') || fieldCategory.includes('academic') || jobTitle.includes('viva')) {
    return 'academic-viva';
  }
  if (jobTitle.includes('communication') || fieldCategory.includes('communication')) {
    return 'communication-test';
  }
  if (jobTitle.includes('knowledge') || fieldCategory.includes('knowledge')) {
    return 'knowledge-assessment';
  }
  if (jobTitle.includes('confidence') || fieldCategory.includes('confidence')) {
    return 'confidence-building';
  }
  if (jobTitle.includes('practice') || fieldCategory.includes('practice')) {
    return 'general-practice';
  }
  
  return 'interview'; // default
};
  // FIXED: Media initialization with better audio handling
// Enhanced media initialization with better error handling
const initializeMedia = async () => {
  try {
    setCameraError('');
    
    // Request higher quality video for better MediaPipe analysis
    const constraints = {
      video: {
        width: { ideal: 1280, min: 640 },
        height: { ideal: 720, min: 480 },
        frameRate: { ideal: 30, min: 15 },
        facingMode: 'user'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 44100,
        sampleSize: 16
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    if (stream) {
      setMediaStream(stream);
      setHasMediaPermissions(true);
      setIsVideoEnabled(true);
      setIsMicEnabled(true);
      
      // Initialize real-time analysis
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.warn);
          
          // Start MediaPipe analysis
          setTimeout(() => {
            realTimeAnalyzer.startRealTimeAnalysis(videoRef.current!, stream);
          }, 1000);
        };
      }
      
      console.log('✅ Media stream initialized with MediaPipe');
      return true;
    }
  } catch (error: any) {
    console.error('Media access error:', error);
    setHasMediaPermissions(false);
    
    // Fallback to audio only
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      setMediaStream(audioStream);
      setIsMicEnabled(true);
      
      console.log('✅ Audio-only stream initialized');
      return true;
    } catch (audioError) {
      console.warn('Audio access also failed:', audioError);
      setCameraError('Unable to access microphone. Voice analysis will not work.');
      return false;
    }
  }
};

  // Toggle camera on/off
  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  // Toggle microphone
  const toggleMicrophone = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicEnabled;
        setIsMicEnabled(!isMicEnabled);
      }
    }
  };

  // Recording functions
  const startRecording = async () => {
    if (!mediaStream || !isMicEnabled) {
      alert('Microphone not available');
      return;
    }

    try {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }

      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio tracks available');
      }

      const audioStream = new MediaStream();
      audioTracks.forEach(track => audioStream.addTrack(track));

      const mediaRecorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;
      setRecordedChunks([]);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.start(500);
      setIsRecording(true);
      setIsUserAnswering(true);

    } catch (error) {
      console.error('Recording error:', error);
      alert('Unable to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };
  // FIXED: Accurate time tracking
useEffect(() => {
  let interval: NodeJS.Timeout;
  
  if (interviewStarted && !interviewCompleted) {
    const startTime = Date.now();
    
    interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setTimeElapsed(elapsedSeconds);
      
      // Only count down question time when user is answering
      if (interviewFlow === 'waiting-for-answer' && questionTimeLeft !== null && questionTimeLeft > 0) {
        setQuestionTimeLeft(prev => prev !== null ? prev - 1 : null);
      } else if (questionTimeLeft === 0 && (currentAnswer.trim() || recordedChunks.length > 0)) {
        // Auto-submit when time runs out
        if (pendingFollowUpQuestion) {
          handleFollowUpAnswer();
        } else {
          handleSubmitAnswer();
        }
      }
    }, 1000);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [interviewStarted, interviewCompleted, interviewFlow, questionTimeLeft, currentAnswer, pendingFollowUpQuestion]);

// Add this useEffect to load MediaPipe and initialize analyzer
useEffect(() => {
  const initializeMediaPipe = async () => {
    try {
      await realTimeAnalyzer.initialize();
      console.log('✅ MediaPipe initialized successfully');
    } catch (error) {
      console.error('❌ MediaPipe initialization failed:', error);
    }
  };

  if (interviewStarted) {
    initializeMediaPipe();
  }

  return () => {
    realTimeAnalyzer.stopAnalysis();
  };
}, [interviewStarted]);
  // Initialize media when component mounts
  useEffect(() => {
    if (interviewStarted && profile) {
      initializeMedia();
    }
  }, [interviewStarted, profile]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current interview stage text
  const getInterviewStageText = () => {
    switch (interviewState.interviewStage) {
      case 'introduction': return 'Introduction';
      case 'skill-assessment': return 'Skill Assessment';
      case 'technical-evaluation': return 'Technical Evaluation';
      case 'behavioral-assessment': return 'Behavioral Assessment';
      case 'closing': return 'Closing';
      default: return 'Assessment in Progress';
    }
  };

  // Get assessment type display name
  const getAssessmentDisplayName = () => {
    return 'TalkGenius AI Roleplay Assessment Platform ';
  };
// FIXED: Real-time analysis display with accurate values
// Enhanced Real-time Analysis Display with MediaPipe data
const RealTimeAnalysisDisplay = ({ 
  isVisible,
  gestureAnalysis,
  voiceAnalysis 
}: { 
  isVisible: boolean;
  gestureAnalysis: GestureAnalysis | null;
  voiceAnalysis: VoiceAnalysis | null;
}) => {
  if (!isVisible) return null;

  const hasActualVoiceData = voiceAnalysis && voiceAnalysis.volume > 15 && voiceAnalysis.confidence > 20;
  const hasActualGestureData = gestureAnalysis && gestureAnalysis.attention > 25;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-4 mb-4 rounded-lg">
      <h4 className="text-blue-800 font-medium mb-3 text-sm flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Real-time MediaPipe Analysis
        {(!hasActualVoiceData || !hasActualGestureData) && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Waiting for input...
          </span>
        )}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Voice Analysis */}
        <div className="bg-white p-3 rounded border border-blue-200">
          <h5 className="text-blue-700 font-medium mb-2 text-xs flex items-center gap-1">
            <Volume2 className="h-3 w-3" />
            Voice Analysis (Web Audio API)
            {!hasActualVoiceData && (
              <span className="text-xs text-gray-600 ml-1">(Speak to see analysis)</span>
            )}
          </h5>
          <div className="space-y-2 text-xs">
            {[
              { label: 'Volume', value: voiceAnalysis?.volume || 0, color: 'bg-green-500' },
              { label: 'Clarity', value: voiceAnalysis?.clarity || 0, color: 'bg-blue-500' },
              { label: 'Confidence', value: voiceAnalysis?.confidence || 0, color: 'bg-purple-500' },
              { label: 'Tone', value: voiceAnalysis?.tone || 0, color: 'bg-orange-500' },
              { label: 'Pace', value: voiceAnalysis?.pace ? Math.min(100, (voiceAnalysis.pace / 200) * 100) : 0, color: 'bg-teal-500' }
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between">
                <span>{label}:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-12 text-right">
                    {label === 'Pace' ? `${Math.round(value)}%` : `${Math.round(value)}%`}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${color}`}
                      style={{ width: `${Math.min(100, value)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Behavior Analysis */}
        <div className="bg-white p-3 rounded border border-purple-200">
          <h5 className="text-purple-700 font-medium mb-2 text-xs flex items-center gap-1">
            <User className="h-3 w-3" />
            Behavior Analysis (MediaPipe)
            {!hasActualGestureData && (
              <span className="text-xs text-gray-600 ml-1">(Be visible for analysis)</span>
            )}
          </h5>
          <div className="space-y-2 text-xs">
            {[
              { label: 'Eye Contact', value: gestureAnalysis?.eyeContact || 0, color: 'bg-green-500' },
              { label: 'Posture', value: gestureAnalysis?.posture || 0, color: 'bg-blue-500' },
              { label: 'Attention', value: gestureAnalysis?.attention || 0, color: 'bg-purple-500' },
              { label: 'Gestures', value: gestureAnalysis?.gestures || 0, color: 'bg-orange-500' },
              { label: 'Smiling', value: gestureAnalysis?.smiling || 0, color: 'bg-pink-500' }
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between">
                <span>{label}:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-12 text-right">{Math.round(value)}%</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${color}`}
                      style={{ width: `${Math.min(100, value)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Status Indicator */}
      <div className="mt-3 text-xs text-center text-gray-600">
        {!hasActualVoiceData && !hasActualGestureData ? 
          "Start speaking and ensure you're visible for MediaPipe analysis" :
          hasActualVoiceData && !hasActualGestureData ?
          "Voice detected! Ensure you're visible for MediaPipe behavior analysis" :
          "MediaPipe analysis active - keep speaking naturally"
        }
      </div>
    </div>
  );
};
  // Get current action text based on flow state - FIXED: Added new flow states
  const getCurrentActionText = () => {
    switch (interviewFlow) {
      case 'welcome':
        return 'Welcome message...';
      case 'question-asked':
        return 'Interviewer is asking question...';
      case 'waiting-for-answer':
        return pendingFollowUpQuestion ? 'Answer the follow-up question' : 'Answer the question';
      case 'processing':
        return 'AI is analyzing your response...';
      case 'showing-feedback':
        return 'Reviewing feedback...';
      case 'showing-corrected-answers':
        return 'Review suggested improvements';
      case 'asking-followup':
        return 'Follow-up question';
      case 'proceeding-to-next':
        return 'Moving to next question...';
      case 'user-question':
        return 'Asking interviewer a question...';
      case 'user-question-response':
        return 'Interviewer is responding to your question...';
      case 'feedback-complete':
        return 'Ready for next question';
      default:
        return 'Ready for your response';
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (loading && !interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Talkgenious assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/dashboard/interview/create')}>
            Create New Assessment
          </Button>
        </div>
      </div>
    );
  }

  if (interviewCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Completed!</h2>
          <p className="text-gray-600 mb-6">
            Your {isDynamicMode ? 'AI-powered dynamic' : 'smart'} Talkgenious session has been completed successfully.
          </p>
          <div className="space-y-3">
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
            <Button 
              onClick={() => router.push('/dashboard/interview/create')}
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              Create New Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Brain className="h-8 w-8 text-blue-600" />
                {getAssessmentDisplayName()}
                <span className="text-sm bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-1 rounded-full ml-2">
                  {profile?.fieldCategory || 'Professional'}
                </span>
                {isDynamicMode && (
                  <span className="text-xs bg-gradient-to-r from-green-100 to-teal-100 text-green-800 px-2 py-1 rounded-full ml-1 flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    AI DYNAMIC
                  </span>
                )}
              </h1>
              {profile && (
                <p className="text-gray-600 mt-1">
                  {profile.jobTitle || getAssessmentDisplayName()} • {profile.experience}
                  {userName && ` • Participant: ${userName}`}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {getInterviewStageText()}
                </div>
                <div className="text-xs text-gray-500">
                  {/* FIXED: Show proper question count */}
                  Main Question {interviewState.answeredQuestions + 1} of {MAX_MAIN_QUESTIONS}
                  {interviewState.currentFollowUpCount > 0 && ` • Follow-up ${interviewState.currentFollowUpCount} of ${MAX_FOLLOW_UPS_PER_QUESTION}`}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  interviewFlow === 'welcome' ? 'bg-blue-100 text-blue-800' :
                  interviewFlow === 'question-asked' ? 'bg-purple-100 text-purple-800' :
                  interviewFlow === 'waiting-for-answer' ? 'bg-green-100 text-green-800' :
                  interviewFlow === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  interviewFlow === 'showing-feedback' ? 'bg-blue-100 text-blue-800' :
                  interviewFlow === 'showing-corrected-answers' ? 'bg-purple-100 text-purple-800' :
                  interviewFlow === 'asking-followup' ? 'bg-orange-100 text-orange-800' :
                  interviewFlow === 'user-question' ? 'bg-purple-100 text-purple-800' :
                  interviewFlow === 'user-question-response' ? 'bg-purple-100 text-purple-800' :
                  interviewFlow === 'feedback-complete' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getCurrentActionText()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  interviewState.performanceScore >= 80 ? 'text-green-600' :
                  interviewState.performanceScore >= 70 ? 'text-blue-600' : 
                  interviewState.performanceScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(interviewState.performanceScore)}%
                </div>
                <div className="text-sm text-gray-500">Performance</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-mono text-gray-700">
                  {formatTime(timeElapsed)}
                </div>
                <div className="text-sm text-gray-500">Duration</div>
              </div>

              {questionTimeLeft !== null && interviewFlow === 'waiting-for-answer' && (
                <div className="text-center">
                  <div className={`text-xl font-mono ${
                    questionTimeLeft < 30 ? 'text-red-600' : 
                    questionTimeLeft < 60 ? 'text-yellow-600' : 'text-gray-700'
                  }`}>
                    {formatTime(questionTimeLeft)}
                  </div>
                  <div className="text-sm text-gray-500">Time Left</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <h4 className="text-red-800 font-medium">System Error</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Assessment Panel - Larger */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Enhanced Video Section with Real Interviewer */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User Camera View */}
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                    {isVideoEnabled && hasMediaPermissions && !cameraError ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white">
                        {cameraError ? (
                          <div className="text-center p-2">
                            <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">{cameraError}</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <User className="h-8 w-8 mx-auto mb-1" />
                            <p className="text-xs">You</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* User Camera Controls */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <Button
                        onClick={toggleVideo}
                        className={`p-2 rounded-full ${isVideoEnabled && !cameraError ? 'bg-blue-600' : 'bg-red-600'}`}
                      >
                        {isVideoEnabled && !cameraError ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        onClick={toggleMicrophone}
                        className={`p-2 rounded-full ${isMicEnabled ? 'bg-blue-600' : 'bg-red-600'}`}
                      >
                        {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Enhanced Video Interviewer View */}
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                    <VideoInterviewer
                      isSpeaking={isInterviewerSpeaking}
                      currentQuestion={currentInterviewerMessage}
                      onVideoEnd={() => {}}
                      isVideoEnabled={isVideoInterviewerEnabled}
                      shouldShowVideo={shouldShowVideo}
                      isUserAnswering={isUserAnswering}
                    />
                    
                    {/* Video Interviewer Controls */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <Button
                        onClick={() => setIsVideoInterviewerEnabled(!isVideoInterviewerEnabled)}
                        className={`p-2 rounded-full ${isVideoInterviewerEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}
                        title={isVideoInterviewerEnabled ? 'Hide video interviewer' : 'Show video interviewer'}
                      >
                        {isVideoInterviewerEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        onClick={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
                        className={`p-2 rounded-full ${isSpeakerEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}
                      >
                        {isSpeakerEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Additional Controls */}
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    onClick={initializeMedia}
                    className="p-2 bg-green-600 hover:bg-green-700"
                    title="Retry camera access"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>

                  {/* Speech Recognition Button */}
                  <Button
                    onClick={toggleSpeechRecognition}
                    className={`p-2 ${isSpeechRecognitionActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                  >
                    {isSpeechRecognitionActive ? (
                      <div className="flex items-center">
                        <Square className="h-3 w-3 mr-1" />
                        <span className="text-xs">Stop</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Mic className="h-3 w-3 mr-1" />
                        <span className="text-xs">Speak</span>
                      </div>
                    )}
                  </Button>

                  {/* Ask Question Button */}
                  <Button
                    onClick={() => setShowUserQuestionInput(!showUserQuestionInput)}
                    className="p-2 bg-purple-600 hover:bg-purple-700"
                    title="Ask interviewer a question"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* ENHANCED: User Question Input with Resume Functionality */}
              <UserQuestionInput
                isVisible={showUserQuestionInput}
                onAskQuestion={handleUserQuestion}
                currentUserQuestion={currentUserQuestion}
                setCurrentUserQuestion={setCurrentUserQuestion}
                isMicEnabled={isMicEnabled}
                hasMediaPermissions={hasMediaPermissions}
                onResumeInterview={handleResumeInterview}
                isQuestionChatActive={isQuestionChatActive}
              />

              {/* ENHANCED: Interviewer Response Display with Resume Button */}
              <InterviewerResponseDisplay
                response={userQuestionResponse}
                isVisible={interviewFlow === 'user-question-response'}
                onResumeInterview={handleResumeInterview}
              />

              {/* Follow-up Question Display */}
              <FollowUpQuestionDisplay
                followUpQuestion={pendingFollowUpQuestion || ''}
                followUpCount={interviewState.currentFollowUpCount}
                maxFollowUps={MAX_FOLLOW_UPS_PER_QUESTION}
                isVisible={interviewFlow === 'asking-followup'}
                onAnswer={handleFollowUpAnswer}
                onSkip={handleSkipFollowUp}
                currentAnswer={currentAnswer}
                setCurrentAnswer={setCurrentAnswer}
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
                recordedChunks={recordedChunks}
                hasMediaPermissions={hasMediaPermissions}
                isMicEnabled={isMicEnabled}
                isSpeechRecognitionActive={isSpeechRecognitionActive}
                loading={loading}
                isGeneratingNext={isGeneratingNext}
              />

              {/* Next Question Prompt - FIXED: Show only when feedback is complete */}
              <NextQuestionPrompt
                isVisible={interviewFlow === 'feedback-complete'}
                onProceed={handleProceedToNextQuestion}
              />

              {/* Welcome Message Display */}
              {interviewFlow === 'welcome' && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-6 mb-6 rounded-lg">
                  <div className="flex items-center">
                    <Sparkles className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800 mb-2">Welcome to Talkgenious AI Assessment</h3>
                      <p className="text-blue-700">
                        The AI is introducing the session. Please wait for the first question...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Question Asked Display */}
              {interviewFlow === 'question-asked' && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-400 p-6 mb-6 rounded-lg">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-purple-600 mr-4" />
                    <div>
                      <h3 className="text-xl font-semibold text-purple-800 mb-2">Question Asked</h3>
                      <p className="text-purple-700">
                        The AI is asking the question. Please listen carefully...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time Analysis Display */}
<RealTimeAnalysisDisplay
  isVisible={interviewStarted && (interviewFlow === 'waiting-for-answer' || interviewFlow === 'asking-followup')}
  gestureAnalysis={realTimeAnalyzer.getCurrentAnalysis().gestures}
  voiceAnalysis={realTimeAnalyzer.getCurrentAnalysis().voice}
/>

              {/* Dynamic Question Generation Indicator */}
              {isGeneratingNext && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-400 p-4 mb-6 rounded">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="h-6 w-6 text-purple-600 animate-pulse" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                    <div className="ml-3">
                      <span className="text-purple-800 font-medium">
                        AI generating next question based on your response...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Analysis Indicator */}
              {isAnalyzing && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                    <div className="ml-3">
                      <span className="text-blue-800 font-medium">
                        AI analyzing response and preparing personalized feedback...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Feedback Display */}
          
{currentFeedback && (interviewFlow === 'showing-feedback' || interviewFlow === 'showing-corrected-answers') && (
  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 p-4 mb-6 rounded">
    <div className="flex">
      <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
      <div>
        <h4 className="text-green-800 font-medium mb-2">Assessment Feedback</h4>
        <p className="text-green-700">{currentFeedback}</p>
        
        {/* Alternative: Get analysis from the latest answer */}
{answers.length > 0 && answers[answers.length - 1]?.aiEvaluation?.followUpQuestion && (
  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
    <div className="flex items-center gap-2 text-yellow-800 text-sm font-medium mb-1">
      <MessageSquare className="h-4 w-4" />
    </div>
    <p className="text-yellow-700 text-sm">
{answers.length > 0 && answers[answers.length - 1]?.aiEvaluation?.followUpQuestion && (
  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
    <div className="flex items-center gap-2 text-yellow-800 text-sm font-medium mb-1">
      <MessageSquare className="h-4 w-4" />
      Follow-up Question:
    </div>
    <p className="text-yellow-700 text-sm">
      {answers[answers.length - 1]?.aiEvaluation?.followUpQuestion || ''}
    </p>
  </div>
)}
    </p>
  </div>
)}
        
        {currentQuestionScore > 0 && (
          <div className="mt-2 text-sm text-green-600">
            <strong>Score for this question:</strong> {currentQuestionScore}%
          </div>
        )}
      </div>
    </div>
  </div>
)}

              {/* Corrected Answer Display */}
<CorrectedAnswerDisplay 
  correctedAnswer={currentCorrectedAnswer}
  expectedAnswer={currentExpectedAnswer}
  isVisible={showCorrectedAnswer}
  onClose={() => setShowCorrectedAnswer(false)}
  autoCloseDelay={30000} // 30 seconds
/>

              {/* Answer Input Section for Regular Questions */}
              {(interviewFlow === 'waiting-for-answer' && !pendingFollowUpQuestion && !isQuestionChatActive && !showUserQuestionInput) && (  // ← ADDED: !showUserQuestionInput
               <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Your Response:
                      </span>
                      {isRecording && (
                        <div className="flex items-center gap-2 text-red-600 animate-pulse">
                          <div className="h-3 w-3 bg-red-600 rounded-full"></div>
                          <span className="text-sm font-medium">Recording in progress...</span>
                        </div>
                      )}
                      {isSpeechRecognitionActive && (
                        <div className="flex items-center gap-2 text-green-600 animate-pulse">
                          <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                          <span className="text-sm font-medium">Listening...</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentAnswer.trim().split(/\s+/).length} words • Target: 50-150 words
                    </div>
                  </div>
                  
                  <Textarea
                    placeholder="Share your detailed response here... Include specific examples, your thought process, and outcomes where relevant. You can also use the microphone button to speak your response."
                    value={currentAnswer}
                    onChange={(e: any) => setCurrentAnswer(e.target.value)}
                    className="mb-4 min-h-32"
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {hasMediaPermissions && (
                        <>
                          <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`p-3 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            disabled={!isMicEnabled}
                          >
                            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                          </Button>
                          
                          {recordedChunks.length > 0 && (
                            <Button
                              onClick={() => {
                                const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
                                const audioUrl = URL.createObjectURL(audioBlob);
                                const audio = new Audio(audioUrl);
                                audio.play().catch(console.error);
                              }}
                              className="p-3 bg-green-600 hover:bg-green-700"
                              title="Play recorded response"
                              >
                              <Play className="h-5 w-5" />
                            </Button>
                          )}
                        </>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
                        <span>Response quality:</span>
                        <div className={`px-2 py-1 rounded text-xs ${
                          currentAnswer.trim().split(/\s+/).length > 80 ? 'bg-green-100 text-green-700' :
                          currentAnswer.trim().split(/\s+/).length > 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {currentAnswer.trim().split(/\s+/).length > 80 ? 'Detailed' :
                           currentAnswer.trim().split(/\s+/).length > 40 ? 'Good' : 'Brief'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSkipQuestion}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700"
                      >
                        <ArrowRight className="h-5 w-5" />
                        <span>Skip Question</span>
                      </Button>
                      
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={(!currentAnswer.trim() && recordedChunks.length === 0) || loading || isGeneratingNext}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700"
                      >
                        {loading || isGeneratingNext ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            <span>{isGeneratingNext ? 'Generating...' : 'Processing...'}</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Answer</span>
                            <ArrowRight className="h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Question Display */}
{currentQuestion && (interviewFlow === 'waiting-for-answer' || interviewFlow === 'question-asked') && !showUserQuestionInput && (
  <div className="bg-gray-50 border-l-4 border-blue-400 p-4 rounded">
    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
      <MessageSquare className="h-5 w-5 text-blue-600" />
      Current Question
    </h3>
    <p className="text-gray-700">
      {pendingFollowUpQuestion || currentQuestion.question}
    </p>
    <div className="flex gap-2 mt-2">
      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
        {pendingFollowUpQuestion ? 'follow-up' : currentQuestion.type}
      </span>
      <span className={`px-2 py-1 text-xs rounded-full ${
        currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
        currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {currentQuestion.difficulty}
      </span>
    </div>
  </div>
)}
            </div>
          </div>

          {/* Sidebar - Smaller */}
          <div className="space-y-6">
            {/* Real-time Performance */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Overall Score</span>
                    <span>{Math.round(interviewState.performanceScore)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        interviewState.performanceScore >= 80 ? 'bg-green-500' :
                        interviewState.performanceScore >= 70 ? 'bg-blue-500' :
                        interviewState.performanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${interviewState.performanceScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    {/* FIXED: Show main questions count */}
                    <div className="text-2xl font-bold text-blue-700">{interviewState.answeredQuestions}</div>
                    <div className="text-xs text-blue-600">Main Questions</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {answers.length > 0 ? Math.round(answers.reduce((acc, ans) => acc + (ans.score || 0), 0) / answers.length) : 0}%
                    </div>
                    <div className="text-xs text-green-600">Avg Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Assessment */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Skill Assessment
              </h3>
              
              <div className="space-y-3">
                {Object.entries(interviewState.skillProficiency)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([skill, score]) => (
                    <div key={skill}>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{skill}</span>
                        <span>{Math.round(score as number)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            (score as number) >= 80 ? 'bg-green-500' :
                            (score as number) >= 60 ? 'bg-blue-500' :
                            (score as number) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Interview Flow Status */}
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg shadow-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Assessment Status
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-700">Current Phase:</span>
                  <span className="font-medium text-purple-800">{getInterviewStageText()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Flow State:</span>
                  <span className="font-medium text-purple-800">
                    {interviewFlow === 'welcome' ? 'Welcome' :
                     interviewFlow === 'question-asked' ? 'Asking Question' :
                     interviewFlow === 'waiting-for-answer' ? 'Answering' :
                     interviewFlow === 'processing' ? 'Analyzing' :
                     interviewFlow === 'showing-feedback' ? 'Feedback' :
                     interviewFlow === 'showing-corrected-answers' ? 'Reviewing' :
                     interviewFlow === 'asking-followup' ? 'Follow-up' : 
                     interviewFlow === 'user-question' ? 'User Question' :
                     interviewFlow === 'user-question-response' ? 'Interviewer Response' :
                     interviewFlow === 'proceeding-to-next' ? 'Transitioning' : 
                     interviewFlow === 'feedback-complete' ? 'Ready for Next' : 'Ready'}
                  </span>
                </div>
                {/* FIXED: Show proper question counts */}
                <div className="flex justify-between">
                  <span className="text-purple-700">Main Questions:</span>
                  <span className="font-medium text-purple-800">{interviewState.answeredQuestions} of {MAX_MAIN_QUESTIONS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Follow-ups:</span>
                  <span className="font-medium text-purple-800">{interviewState.currentFollowUpCount} of {MAX_FOLLOW_UPS_PER_QUESTION}</span>
                </div>
                {isDynamicMode && (
                  <div className="mt-3 p-2 bg-purple-50 rounded text-xs text-purple-600">
                    AI adapts questions based on your performance
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Controls</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gray-600 hover:bg-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Exit to Dashboard
                </Button>
                <Button
                  onClick={() => {
                    const currentInterview = {
                      profile,
                      questions,
                      startTime: new Date().toISOString(),
                      currentQuestionIndex,
                      answers,
                      isActive: true,
                      type: 'dynamic-ai-interview',
                      isDynamic: true
                    };
                    localStorage.setItem('activeInterview', JSON.stringify(currentInterview));
                    router.push('/dashboard');
                  }}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save & Exit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}