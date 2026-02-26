'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarScene from './components/AvatarScene';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import VRMAvatar, { type VRMAvatarHandle } from "./components/VRMAvatar";
import { 
  Mic, MicOff, ArrowRight, CheckCircle, Video, VideoOff, Volume2, VolumeX,
  RefreshCw, Brain, AlertCircle, Play, Sparkles, TrendingUp, MessageSquare,
  ArrowLeft, Save, Square, Eye, EyeOff, User, Zap, Clock,
  Pause, RotateCcw, Loader2, HelpCircle, Activity, Users, Target,
  Ear, Eye as EyeIcon, Smile, AlertTriangle, ThumbsUp, Shield,
  ZapOff, Waves, Volume, Volume1, BarChart3, Gauge, Focus,
  Cpu, CpuIcon, Radio, RadioTower, Star, Trophy, Medal, StopCircle
} from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
      FaceDetection: any; 
  }
}

/* ======================================================
   ULTRA FUTURISTIC AI BACKGROUND
====================================================== */

function AILabBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-black" />

      {/* Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.25),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.25),transparent_40%)] animate-pulse" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Neon Blobs */}
      <div className="absolute top-[-250px] left-[-250px] w-[700px] h-[700px] bg-purple-600/20 blur-[200px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-250px] right-[-250px] w-[700px] h-[700px] bg-blue-600/20 blur-[200px] rounded-full animate-pulse" />
      
      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-px bg-white/30 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100],
            x: [0, Math.random() * 100 - 50],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Animated grid lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
}

// Define EmotionType locally
type EmotionType = 'neutral' | 'happy' | 'thinking' | 'speaking' | 'listening';

interface PhonemeData {
  phoneme: string;
  start: number;
  end: number;
  duration: number;
  intensity: number;
}

interface VoiceMetrics {
  volume: number;
  clarity: number;
  pace: number;
  confidence: number;
  fillerWords: string[];
  pauses: number;
  speechPattern: 'fluent' | 'hesitant' | 'rushed' | 'moderate';
  recommendations: string[];
  isSpeaking: boolean;
  hasValidData: boolean;
}

interface BehavioralMetrics {
  eyeContact: number;
  smiling: number;
  posture: number;
  attention: number;
  gestures: number;
  headMovement: number;
  overallEngagement: number;
  recommendations: string[];
  faceDetected: boolean;
  cameraWorking: boolean;
  hasValidData: boolean;
}

class ElevenLabsClient {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async generateSpeechWithLipSync(text: string): Promise<{
    audioUrl: string;
    phonemes: PhonemeData[];
  }> {
    try {
      console.log('🎤 Generating speech with lip-sync for:', text.substring(0, 50));
      
      const words = text.toLowerCase().split(/\s+/);
      const phonemes: PhonemeData[] = [];
      let currentTime = 0;
      
      for (const word of words) {
        const syllables = Math.max(1, word.length / 2);
        const syllableDuration = 0.2;
        
        for (let i = 0; i < syllables; i++) {
          const phoneme = this.getRandomPhoneme();
          phonemes.push({
            phoneme,
            start: currentTime,
            end: currentTime + syllableDuration,
            duration: syllableDuration,
            intensity: 0.5 + Math.random() * 0.5
          });
          currentTime += syllableDuration;
        }
        
        currentTime += 0.1;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        audioUrl: `data:audio/mp3;base64,${btoa('simulated-audio')}`,
        phonemes
      };
      
    } catch (error) {
      console.error('ElevenLabs error:', error);
      throw error;
    }
  }
  
  private getRandomPhoneme(): string {
    const phonemes = ['AA', 'E', 'I', 'O', 'U', 'PP', 'FF', 'DD', 'SS', 'kk', 'RR', 'sil'];
    return phonemes[Math.floor(Math.random() * phonemes.length)];
  }
}

const elevenLabsClient = new ElevenLabsClient(process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '');

// Real Voice Analyzer using Web Audio API
// ======================================================
// REPLACE YOUR EXISTING RealVoiceAnalyzer WITH THIS:
// ======================================================
class RealVoiceAnalyzer {
  private deepgramSocket: WebSocket | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private isAnalyzing = false;
  private audioTracksEnabled = true;
  private currentVolume = 0;
  
  private voiceMetrics: VoiceMetrics = {
    volume: 0,
    clarity: 0,
    pace: 0,
    confidence: 0,
    fillerWords: [],
    pauses: 0,
    speechPattern: 'moderate',
    recommendations: [],
    isSpeaking: false,
    hasValidData: false
  };

async startRealTimeAnalysis(audioStream: MediaStream) {
  this.stopAnalysis();
  
  // Check if audio tracks are enabled
  const audioTracks = audioStream.getAudioTracks();
  this.audioTracksEnabled = audioTracks.length > 0 && audioTracks[0].enabled;
  
  if (!this.audioTracksEnabled) {
    console.warn("⚠️ No audio tracks or audio disabled - voice analysis paused");
    this.isAnalyzing = false;
    
    // Reset voice metrics to show no data
    this.voiceMetrics = {
      volume: 0,
      clarity: 0,
      pace: 0,
      confidence: 0,
      fillerWords: [],
      pauses: 0,
      speechPattern: 'moderate',
      recommendations: ["Turn on your microphone to enable voice analysis"],
      isSpeaking: false,
      hasValidData: false
    };
    return; // Exit early - don't connect to Deepgram
  }

  try {
    console.log('🔊 Starting real voice analyzer with enabled microphone...');
    
    // Setup Web Audio for volume detection
    this.audioContext = new AudioContext();
    await this.audioContext.resume();
    this.analyser = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaStreamSource(audioStream);
    source.connect(this.analyser);
    this.analyser.fftSize = 256;
    
    // Start volume monitoring
    this.startVolumeMonitoring();

    // Connect to Deepgram for REAL voice analysis
    const DEEPGRAM_API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
    
    if (!DEEPGRAM_API_KEY) {
      console.warn("⚠️ No Deepgram API key found");
      return;
    }

   this.deepgramSocket = new WebSocket(
  'wss://api.deepgram.com/v1/listen?' + new URLSearchParams({
    model: 'nova-2',
    language: 'en-US',
    punctuate: 'true',
    filler_words: 'true',
    utterances: 'true',
    interim_results: 'true',
    endpointing: '300',
    vad_events: 'true',
    encoding: 'opus' // ← ADD THIS LINE - crucial for WebSocket!
  }),
  ['token', DEEPGRAM_API_KEY]
);

    this.deepgramSocket.onopen = () => {
      console.log('✅ Deepgram connected - REAL voice analysis started');
      
      // Check if audio is still enabled
      const currentTracks = audioStream.getAudioTracks();
      if (currentTracks.length === 0 || !currentTracks[0].enabled) {
        console.warn("⚠️ Audio was disabled before recorder could start");
        return;
      }
      
      // In the onopen handler, when creating MediaRecorder:
let mimeType = 'audio/webm;codecs=opus'; // Try this first
if (!MediaRecorder.isTypeSupported(mimeType)) {
  mimeType = 'audio/webm';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = ''; // Let browser choose
  }
} 
      // Find a supported MIME type
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/mp4',
        'audio/mpeg',
        ''
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (mimeType === '') {
          selectedMimeType = '';
          break;
        }
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log(`✅ Using MIME type: ${selectedMimeType}`);
          break;
        }
      }
      
      try {
        // Create MediaRecorder with options
        const options = selectedMimeType ? { mimeType: selectedMimeType } : {};
        this.mediaRecorder = new MediaRecorder(audioStream, options);
        
        // Set up data handler
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && this.deepgramSocket?.readyState === WebSocket.OPEN) {
            this.deepgramSocket.send(event.data);
          }
        };
        
        // Handle recorder errors
        this.mediaRecorder.onerror = (error) => {
          console.error('MediaRecorder error:', error);
        };
        
        // Start recording with timeslice for real-time streaming
        this.mediaRecorder.start(100); // Send data every 100ms
        
        console.log('✅ MediaRecorder started successfully');
        
      } catch (recorderError) {
        console.error('❌ Failed to create MediaRecorder:', recorderError);
        
        // Fallback: Try without any options
        try {
          console.log('Attempting fallback MediaRecorder without options...');
          this.mediaRecorder = new MediaRecorder(audioStream);
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && this.deepgramSocket?.readyState === WebSocket.OPEN) {
              this.deepgramSocket.send(event.data);
            }
          };
          this.mediaRecorder.start(100);
          console.log('✅ Fallback MediaRecorder started');
        } catch (fallbackError) {
          console.error('❌ Fallback MediaRecorder also failed:', fallbackError);
        }
      }
    };

    this.deepgramSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'Results' && data.channel?.alternatives?.[0]) {
          const alternative = data.channel.alternatives[0];
          const transcript = alternative.transcript;
          const confidence = alternative.confidence || 0;
          const words = alternative.words || [];
          const isFinal = data.is_final;
          
          if (isFinal && transcript) {
            // Calculate REAL metrics from Deepgram
            const wordCount = words.length;
            const duration = data.duration || 1;
            const wpm = wordCount > 0 && duration > 0 
              ? Math.round((wordCount / duration) * 60) 
              : 0;
            
            // Detect filler words
           // Detect filler words - IMPROVED VERSION
const fillerWordsList = [
  'um', 'uh', 'like', 'ah', 'er', 'hmm', 
  'actually', 'basically', 'you know', 'sort of',
  'kind of', 'i mean', 'you see', 'well', 'so',
  'anyway', 'literally', 'honestly', 'right',
  'okay', 'yeah', 'maybe', 'perhaps', 'probably',
   'i', 'o', 'a', 'uhh', 'umm'
];

// Get all words from the transcript
const detectedFillers = [];

// Check each word
if (words && words.length > 0) {
  for (const word of words) {
    const wordText = word.word?.toLowerCase();
    if (wordText && fillerWordsList.includes(wordText)) {
      detectedFillers.push(wordText);
    }
  }
}

// Also check the transcript itself for multi-word fillers
const transcriptLower = transcript.toLowerCase();
const multiWordFillers = ['you know', 'sort of', 'kind of', 'i mean', 'you see'];
for (const filler of multiWordFillers) {
  if (transcriptLower.includes(filler)) {
    detectedFillers.push(filler);
  }
}

// Remove duplicates
const uniqueFillers = Array.from(new Set(detectedFillers));

console.log('🎤 Filler words detected:', uniqueFillers);
            
            // Calculate clarity based on confidence
            const clarity = Math.round(confidence * 100);
            
            // Determine speech pattern
            let speechPattern: 'fluent' | 'hesitant' | 'rushed' | 'moderate' = 'moderate';
            if (wpm > 180) speechPattern = 'rushed';
            else if (wpm < 110) speechPattern = 'hesitant';
            else if (wpm >= 130 && wpm <= 170) speechPattern = 'fluent';
            
            // Update metrics with REAL Deepgram data
            this.voiceMetrics = {
              volume: this.currentVolume,
              clarity,
              pace: wpm,
              confidence: Math.round(confidence * 100),
              fillerWords: Array.from(new Set(detectedFillers)) as string[],
              pauses: data.pause_count || 0,
              speechPattern,
              recommendations: this.generateRecommendations(clarity, wpm, detectedFillers),
              isSpeaking: true,
              hasValidData: true
            };
            
            console.log('📊 Deepgram analysis:', { clarity, wpm, confidence, fillerWords: detectedFillers.length });
          }
        }
      } catch (parseError) {
        console.error('Error parsing Deepgram message:', parseError);
      }
    };

    this.deepgramSocket.onerror = (error) => {
      console.error('Deepgram WebSocket error:', error);
    };

    this.deepgramSocket.onclose = (event) => {
      console.log('Deepgram connection closed:', event.code, event.reason);
    };

    this.isAnalyzing = true;

  } catch (error) {
    console.error("❌ Voice analysis initialization failed:", error);
  }
}

  private startVolumeMonitoring() {
    if (!this.analyser) return;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    setInterval(() => {
      if (!this.analyser || !this.isAnalyzing) return;
      
      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      this.currentVolume = Math.min(100, Math.round((sum / bufferLength) * 0.8));
    }, 200);
  }

 private generateRecommendations(clarity: number, wpm: number, fillers: string[]): string[] {
  const recs: string[] = [];
  
  if (clarity < 70) recs.push("Speak more clearly and enunciate your words");
  if (wpm > 170) recs.push("Try to slow down your speaking pace");
  if (wpm < 80) recs.push("Try to speak a bit faster to maintain engagement");
  
  // Filler word recommendation - make sure this appears
  if (fillers && fillers.length > 0) {
    const fillerStr = fillers.slice(0, 3).join(', ');
    recs.push(`Try to reduce filler words like "${fillerStr}"`);
  }
  
  return recs.slice(0, 3); // Show up to 3 recommendations
}

  stopAnalysis() {
    this.mediaRecorder?.stop();
    this.deepgramSocket?.close();
    this.isAnalyzing = false;
  }

  getCurrentAnalysis() {
    const overallScore = this.voiceMetrics.hasValidData 
      ? Math.round(
          (this.voiceMetrics.clarity * 0.4) +
          (this.voiceMetrics.confidence * 0.4) +
          (Math.min(100, (this.voiceMetrics.pace / 1.7)) * 0.2)
        )
      : 0;
    
    return { 
      voice: this.voiceMetrics, 
      overallScore,
      summary: {
        clarity: this.voiceMetrics.clarity,
        confidence: this.voiceMetrics.confidence,
        paceScore: Math.min(100, this.voiceMetrics.pace / 1.7),
        overallScore: overallScore
      },
      recommendations: this.voiceMetrics.recommendations,
      hasValidData: this.voiceMetrics.hasValidData,
      isSpeaking: this.voiceMetrics.isSpeaking
    };
  }
}

// ======================================================
// REPLACE YOUR EXISTING RealBehavioralAnalyzer WITH THIS:
// ======================================================
class RealBehavioralAnalyzer {
  private faceLandmarker: FaceLandmarker | null = null;
  private isAnalyzing = false;
  private videoElement: HTMLVideoElement | null = null;
   private faceDetected = false;
   private cameraWorking = false; 
  private behavioralMetrics: BehavioralMetrics = {
    eyeContact: 0,
    smiling: 0,
    posture: 0,
    attention: 0,
    gestures: 0,
    headMovement: 0,
    overallEngagement: 0,
    recommendations: [],
    faceDetected: false,
    cameraWorking: false,
    hasValidData: false
  };

  async startRealTimeAnalysis(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
    
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      
      this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,      // For smile/expression detection
        outputFacialTransformationMatrixes: true, // For head pose
        runningMode: "VIDEO",
        numFaces: 1
      });
      
      console.log('✅ FaceLandmarker initialized');
      this.isAnalyzing = true;
      this.detectFrame();
      
    } catch (error) {
      console.error('❌ Failed to initialize FaceLandmarker:', error);
    }
  }

  private async detectFrame() {
    if (!this.videoElement || !this.faceLandmarker || !this.isAnalyzing) return;
    
    const startTimeMs = performance.now();
    const results = await this.faceLandmarker.detectForVideo(this.videoElement, startTimeMs);
    
    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];
      const blendshapes = results.faceBlendshapes?.[0];
      
      // Calculate ALL metrics from 478 facial landmarks
      
      // 1. Eye Contact (based on head pose and eye landmarks)
      const headPose = this.calculateHeadPose(landmarks);
      const eyeContact = this.calculateEyeContact(landmarks, headPose);
      
      // 2. Smile Detection (using blendshapes)
      // Fix for blendshapes - add type assertion or check properly
let smiling = 50;
if (blendshapes && blendshapes.categories && Array.isArray(blendshapes.categories)) {
  const smileCategory = blendshapes.categories.find((c: any) => c.categoryName === 'mouthSmile');
  if (smileCategory) {
    smiling = Math.round(smileCategory.score * 100);
  }
}
      // 3. Posture (face position and size)
      const posture = this.calculatePosture(landmarks);
      
      // 4. Attention (head stability + eye gaze)
      const attention = this.calculateAttention(landmarks, headPose);
      
      // 5. Gestures (eyebrow movements, head movements)
      const gestures = this.calculateGestures(landmarks, blendshapes);
      
      // 6. Head Movement
      const headMovement = this.calculateHeadMovement(headPose);
      
      const overallEngagement = Math.round(
        (eyeContact * 0.25) + (smiling * 0.2) + (posture * 0.2) + 
        (attention * 0.2) + (gestures * 0.15)
      );
      
      this.behavioralMetrics = {
        eyeContact,
        smiling,
        posture,
        attention,
        gestures,
        headMovement,
        overallEngagement,
        recommendations: this.generateRecommendations(eyeContact, smiling, posture, attention),
        faceDetected: true,
        cameraWorking: true,
        hasValidData: true
      };
      
    } else {
      this.behavioralMetrics = {
        ...this.behavioralMetrics,
        faceDetected: false,
        hasValidData: false,
        recommendations: ["No face detected - please position yourself in front of the camera"]
      };
    }
    
    requestAnimationFrame(() => this.detectFrame());
  }

  private calculateHeadPose(landmarks: any): { pitch: number; yaw: number; roll: number } {
    // Use nose tip and eye positions to calculate head orientation
    const nose = landmarks[1]; // Nose tip
    const leftEye = landmarks[33]; // Left eye outer corner
    const rightEye = landmarks[263]; // Right eye outer corner
    
    // Calculate head pose (simplified)
    const yaw = (nose.x - ((leftEye.x + rightEye.x) / 2)) * 100;
    const pitch = (nose.y - ((leftEye.y + rightEye.y) / 2)) * 100;
    const roll = Math.atan2(leftEye.y - rightEye.y, leftEye.x - rightEye.x) * 180 / Math.PI;
    
    return { pitch, yaw, roll };
  }

  private calculateEyeContact(landmarks: any, headPose: any): number {
    // Check if eyes are looking at camera
    const leftIris = landmarks[468]; // Left iris center
    const rightIris = landmarks[473]; // Right iris center
    
    // If irises are centered relative to eye corners, good eye contact
    const leftEyeCenter = landmarks[33]; // Left eye center
    const rightEyeCenter = landmarks[263]; // Right eye center
    
    const leftOffset = Math.abs(leftIris.x - leftEyeCenter.x);
    const rightOffset = Math.abs(rightIris.x - rightEyeCenter.x);
    
    const eyeGazeScore = 100 - ((leftOffset + rightOffset) * 200);
    
    // Combine with head pose (should be facing forward)
    const headPoseScore = 100 - (Math.abs(headPose.yaw) + Math.abs(headPose.pitch)) / 2;
    
    return Math.round((eyeGazeScore * 0.6) + (headPoseScore * 0.4));
  }

  private calculatePosture(landmarks: any): number {
    // Calculate face bounding box size relative to video frame
    const xs = landmarks.map((l: any) => l.x);
    const ys = landmarks.map((l: any) => l.y);
    
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    const faceSize = width * height;
    
    // Ideal face size (20-30% of frame)
    if (faceSize < 0.1) return 30; // Too far
    if (faceSize > 0.4) return 40; // Too close
    if (faceSize > 0.15 && faceSize < 0.25) return 90; // Perfect
    return 60; // Acceptable
  }

  private calculateAttention(landmarks: any, headPose: any): number {
    // Attention based on head stability and eye focus
    const headStability = 100 - (Math.abs(headPose.yaw) + Math.abs(headPose.pitch)) / 2;
    
    // Check if eyes are open (using eye landmarks)
    const leftEyeTop = landmarks[159];
    const leftEyeBottom = landmarks[145];
    const rightEyeTop = landmarks[386];
    const rightEyeBottom = landmarks[374];
    
    const leftEyeOpen = Math.abs(leftEyeTop.y - leftEyeBottom.y);
    const rightEyeOpen = Math.abs(rightEyeTop.y - rightEyeBottom.y);
    const eyesOpenScore = ((leftEyeOpen + rightEyeOpen) / 2) * 100;
    
    return Math.round((headStability * 0.4) + (eyesOpenScore * 0.6));
  }

 private calculateGestures(landmarks: any, blendshapes: any): number {
  // Detect gestures from blendshapes and movements
  if (!blendshapes || !blendshapes.categories) return 50;
  
  const categories = blendshapes.categories;
  const browRaise = categories.find((b: any) => b.categoryName === 'browRaise')?.score || 0;
  const browFurrow = categories.find((b: any) => b.categoryName === 'browFurrow')?.score || 0;
  
  // Gesture score based on eyebrow movement
  const gestureScore = (browRaise + browFurrow) * 50;
  
  return Math.min(100, Math.round(gestureScore));
}

  private calculateHeadMovement(headPose: any): number {
    // Track head movement between frames (simplified)
    return 50 + Math.random() * 20; // Placeholder for actual movement tracking
  }

  private generateRecommendations(eyeContact: number, smiling: number, posture: number, attention: number): string[] {
    const recs: string[] = [];
    
    if (eyeContact < 40) recs.push("👁️ Look directly at the camera for better eye contact");
    if (smiling < 30) recs.push("😊 Try to smile more - it conveys confidence and warmth");
    if (posture < 40) recs.push("🪑 Sit up straight and position yourself closer to the camera");
    if (attention < 50) recs.push("🎯 Stay focused - avoid looking away from the screen");
    
    return recs.slice(0, 2);
  }

  stopAnalysis() {
    this.isAnalyzing = false;
    this.faceLandmarker?.close();
  }

  getCurrentAnalysis() {
    return {
      behavior: this.behavioralMetrics,
      overallScore: this.behavioralMetrics.overallEngagement,
      cameraWorking: this.cameraWorking,
      faceDetected: this.behavioralMetrics.faceDetected,
      hasValidData: this.behavioralMetrics.hasValidData,
      recommendations: this.behavioralMetrics.recommendations
    };
  }
}

const generateRealisticLipSync = (text: string, duration: number): PhonemeData[] => {
  const words = text.toLowerCase().split(/\s+/);
  const phonemes: PhonemeData[] = [];
  let currentTime = 0;
  
  const wordToPhonemes: Record<string, string[]> = {
    'hello': ['HH', 'E', 'LL', 'O'],
    'welcome': ['W', 'E', 'LL', 'K', 'AA', 'M'],
    'thank': ['TH', 'AE', 'NG', 'K'],
    'you': ['Y', 'U'],
    'can': ['K', 'AE', 'N'],
    'please': ['P', 'L', 'IY', 'Z'],
    'describe': ['D', 'IY', 'S', 'K', 'R', 'AY', 'B'],
    'explain': ['IY', 'K', 'S', 'P', 'L', 'EY', 'N'],
    'experience': ['IY', 'K', 'S', 'P', 'IY', 'R', 'IY', 'AE', 'N', 'S'],
    'project': ['P', 'R', 'AA', 'JH', 'EH', 'K', 'T'],
    'team': ['T', 'IY', 'M'],
    'work': ['W', 'ER', 'K'],
    'challenge': ['CH', 'AE', 'L', 'AH', 'N', 'JH'],
  };
  
  for (const word of words) {
    let wordPhonemes: string[] = [];
    
    if (wordToPhonemes[word]) {
      wordPhonemes = wordToPhonemes[word];
    } else {
      const syllableCount = Math.max(1, Math.floor(word.length / 2.5));
      for (let i = 0; i < syllableCount; i++) {
        wordPhonemes.push(i === 0 ? 'AA' : (i % 2 === 0 ? 'E' : 'PP'));
      }
    }
    
    for (let i = 0; i < wordPhonemes.length; i++) {
      const phoneme = wordPhonemes[i];
      const phonemeDuration = 0.15 * (0.8 + Math.random() * 0.4);
      
      phonemes.push({
        phoneme,
        start: currentTime,
        end: currentTime + phonemeDuration,
        duration: phonemeDuration,
        intensity: 0.7 + Math.random() * 0.3
      });
      
      currentTime += phonemeDuration;
    }
    
    currentTime += 0.08;
  }
  
  if (currentTime > duration) {
    const scale = duration / currentTime;
    phonemes.forEach(p => {
      p.start *= scale;
      p.end *= scale;
      p.duration *= scale;
    });
  }
  
  return phonemes;
};

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
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setTranscript(prev => {
              const newTranscript = prev + finalTranscript;
              console.log('✅ Final transcript:', finalTranscript);
              return newTranscript;
            });
          }
          
          if (interimTranscript) {
            console.log('🔄 Interim:', interimTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          console.log('🎤 Speech recognition ended');
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
      console.log('🎤 Started listening...');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      console.log('🎤 Stopped listening');
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

const getQuestionText = (question: any): string => {
  if (typeof question === 'string') return question;
  if (question?.question) return question.question;
  if (question) return String(question);
  return 'Question not available';
};

const calculateRealisticScore = (
  answer: string, 
  baseScore: number, 
  voiceData?: any, 
  behavioralData?: any
): number => {
  const wordCount = answer.trim().split(/\s+/).length;
  const answerLower = answer.toLowerCase();
  
  // Penalize very short or non-answers
  if (wordCount < 3) return 10; // "I don't know" = 3 words, should be low
  if (wordCount < 5) return 25; // Very short answers
  
  // Check for common weak answer patterns
  const weakPatterns = [
    "i don't know", "i dont know", "idk", 
    "not sure", "no idea", "i'm not sure",
    "i am not sure", "can't answer", "cannot answer"
  ];
  
  for (const pattern of weakPatterns) {
    if (answerLower.includes(pattern)) {
      return 20; // Weak answer penalty
    }
  }
  
  let qualityScore = 50; // Base score
  
  // Content quality metrics (more aggressive penalties)
  if (wordCount < 10) qualityScore -= 25;
  else if (wordCount < 20) qualityScore -= 15;
  else if (wordCount > 50) qualityScore += 15;
  else if (wordCount > 30) qualityScore += 10;
  
  const sentenceCount = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  if (sentenceCount >= 3) qualityScore += 20;
  else if (sentenceCount >= 2) qualityScore += 10;
  else if (sentenceCount === 1) qualityScore -= 10;
  
  // Quality indicators
  if (answer.includes('because') || answer.includes('therefore')) qualityScore += 15;
  if (answer.includes('example') || answer.includes('for instance')) qualityScore += 20;
  if (answer.includes('first') || answer.includes('second') || answer.includes('finally')) qualityScore += 15;
  if (/\d+%|\d+ years|\d+ projects|\d+ people/i.test(answer)) qualityScore += 15;
  
  // Voice metrics contribution
  let voiceContribution = 0;
  if (voiceData && voiceData.hasValidData && voiceData.isSpeaking) {
    const clarity = voiceData.voice?.clarity || 0;
    const confidence = voiceData.voice?.confidence || 0;
    const pace = voiceData.voice?.pace || 0;
    const fillerCount = voiceData.voice?.fillerWords?.length || 0;
    
    // Calculate voice score with penalties for filler words
    let voiceScore = (clarity * 0.3) + (confidence * 0.3);
    
    // Penalize for filler words
    voiceScore -= fillerCount * 8;
    
    // Penalize for bad pace (too fast or too slow)
    if (pace > 180) voiceScore -= 15;
    else if (pace < 80) voiceScore -= 10;
    
    voiceContribution = Math.max(0, voiceScore * 0.3);
  }
  
  // Behavioral metrics contribution
  let behavioralContribution = 0;
  if (behavioralData && behavioralData.hasValidData && behavioralData.faceDetected) {
    const eyeContact = behavioralData.behavior?.eyeContact || 0;
    const smiling = behavioralData.behavior?.smiling || 0;
    const posture = behavioralData.behavior?.posture || 0;
    
    const behaviorScore = (eyeContact * 0.4) + (smiling * 0.3) + (posture * 0.3);
    behavioralContribution = behaviorScore * 0.2;
  }
  
  // Calculate final score
  let finalScore = qualityScore;
  
  if (voiceContribution > 0 && behavioralContribution > 0) {
    finalScore = Math.round((qualityScore * 0.5) + voiceContribution + behavioralContribution);
  } else if (voiceContribution > 0) {
    finalScore = Math.round((qualityScore * 0.7) + voiceContribution);
  } else if (behavioralContribution > 0) {
    finalScore = Math.round((qualityScore * 0.8) + behavioralContribution);
  }
  
  // Ensure score is within reasonable range
  finalScore = Math.max(10, Math.min(95, Math.round(finalScore)));
  
  // Log for debugging
  console.log('📊 Score calculation:', {
    wordCount,
    qualityScore,
    voiceContribution,
    behavioralContribution,
    finalScore,
    fillerWords: voiceData?.voice?.fillerWords
  });
  
  return finalScore;
};

const generateFeedbackWithQuestion = (score: number, answer: string, originalQuestion: string, voiceData?: any, behavioralData?: any): { feedback: string, feedbackQuestion: string | null } => {
  const wordCount = answer.split(/\s+/).length;
  
  let feedbackPrefix = "";
  
  // Add voice feedback only if valid data exists
  if (voiceData && voiceData.hasValidData && voiceData.voice) {
    if (voiceData.voice.pace > 170) {
      feedbackPrefix += " You were speaking a bit quickly. ";
    } else if (voiceData.voice.pace < 120 && voiceData.voice.volume > 0) {
      feedbackPrefix += " Try to speak a bit faster for more impact. ";
    }
    
    if (voiceData.voice.fillerWords.length > 0) {
      feedbackPrefix += ` Watch out for filler words like "${voiceData.voice.fillerWords.slice(0, 2).join('", "')}". `;
    }
  }
  
  // Add behavioral feedback only if valid data exists
  if (behavioralData && behavioralData.hasValidData && behavioralData.behavior) {
    if (behavioralData.behavior.eyeContact < 40) {
      feedbackPrefix += " Try to maintain better eye contact with the camera. ";
    }
    
    if (behavioralData.behavior.smiling < 30) {
      feedbackPrefix += " A smile would make you appear more confident. ";
    }
  }
  
  if (wordCount < 15) {
    return {
      feedback: `${feedbackPrefix}Your answer is quite brief. Can you expand on that with more details?`,
      feedbackQuestion: "Can you expand on that with more details?"
    };
  }

  const feedbackTemplates = [
    {
      condition: score >= 80,
      feedback: `${feedbackPrefix}Excellent detailed response with good structure and specific examples. Could you elaborate more on the specific challenges you faced?`,
      question: "Could you elaborate more on the specific challenges you faced?"
    },
    {
      condition: score >= 60,
      feedback: `${feedbackPrefix}Good answer with clear points. Consider adding more specific examples. What specific metrics or results did you achieve?`,
      question: "What specific metrics or results did you achieve?"
    },
    {
      condition: score >= 40,
      feedback: `${feedbackPrefix}Adequate response. Try to provide more structure and detail in your answers. Can you provide a concrete example?`,
      question: "Can you provide a concrete example?"
    },
    {
      condition: true,
      feedback: `${feedbackPrefix}Please provide more detailed answers with specific examples from your experience. What was the most important lesson you learned?`,
      question: "What was the most important lesson you learned?"
    }
  ];
  
  const template = feedbackTemplates.find(t => t.condition) || feedbackTemplates[feedbackTemplates.length - 1];
  
  return {
    feedback: template.feedback,
    feedbackQuestion: template.question
  };
};

const performEnhancedFallbackAnalysis = (question: string, answer: string, profile: any, voiceData?: any, behavioralData?: any) => {
  const score = calculateRealisticScore(answer, 50, voiceData, behavioralData);
  const wordCount = answer.split(/\s+/).length;
  
  const { feedback, feedbackQuestion } = generateFeedbackWithQuestion(score, answer, question, voiceData, behavioralData);
  
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
    detailedFeedback: `Thank you for your response. ${feedback} ${followUpQuestion}`,
    strengths: wordCount > 20 ? ['Good detail level'] : ['Clear communication'],
    improvements: wordCount < 30 ? ['Provide more detail'] : ['Continue practicing'],
    hasFollowUp: true,
    followUpQuestion: followUpQuestion,
    feedbackQuestion: feedbackQuestion,
    voiceRecommendations: voiceData?.recommendations || [],
    behavioralRecommendations: behavioralData?.recommendations || []
  };
};

const analyzeAnswerWithAI = async (
  question: string,
  answer: string,
  performanceScore: number,
  conversationContext: string[],
  profile: any,
  voiceMetrics?: any,
  behavioralMetrics?: any
): Promise<any> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const payload = {
      question,
      answer,
      performanceScore,
      conversationContext,
      profile,
      voiceMetrics: voiceMetrics || null,
      behavioralMetrics: behavioralMetrics || null,
      timestamp: Date.now()
    };

    console.log('📦 Sending to API with:', {
      hasVoice: !!voiceMetrics,
      hasBehavioral: !!behavioralMetrics
    });

    const response = await fetch('/api/analyze-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      
      return {
        score: data.score || 50,
        detailedFeedback: data.detailedFeedback || "Thank you for your response.",
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        hasFollowUp: data.hasFollowUp ?? true,
        followUpQuestion: data.followUpQuestion || "Can you elaborate on that?",
        feedbackQuestion: data.feedbackQuestion || data.followUpQuestion,
        needsClarification: data.needsClarification ?? (data.score < 50),
        voiceRecommendations: data.voiceRecommendations || voiceMetrics?.recommendations || [],
        behavioralRecommendations: data.behavioralRecommendations || behavioralMetrics?.recommendations || [],
        questionSource: 'feedback',
        shouldAskQuestion: !!(data.followUpQuestion || data.feedbackQuestion)
      };
    }
  } catch (error) {
    console.warn('⚠️ AI analysis failed, using enhanced fallback:', error);
  }

  const fallbackResult = performEnhancedFallbackAnalysis(question, answer, profile, voiceMetrics, behavioralMetrics);
  
  return {
    ...fallbackResult,
    voiceRecommendations: voiceMetrics?.recommendations || fallbackResult.voiceRecommendations || [],
    behavioralRecommendations: behavioralMetrics?.recommendations || fallbackResult.behavioralRecommendations || [],
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
  lastAnswer: string = '',
  voiceMetrics?: any,
  behavioralMetrics?: any,
  mainQuestions?: string[],
  currentQuestionIndex?: number
): Promise<string> => {
  
  console.log('🔍 generateNextQuestion CALLED with:', {
    profileAssessmentType: profile?.assessmentType,
    profileFieldCategory: profile?.fieldCategory,
    mainQuestionsCount: mainQuestions?.length || 0,
    currentQuestionIndex: currentQuestionIndex || 0,
    hasProfile: !!profile
  });
  
  let actualProfile = profile;
  if (!actualProfile || Object.keys(actualProfile).length === 0) {
    const savedProfile = localStorage.getItem('interviewProfile');
    if (savedProfile) {
      try {
        actualProfile = JSON.parse(savedProfile);
        console.log('🔄 Loaded profile from localStorage');
      } catch (e) {
        console.error('❌ Error parsing profile from localStorage:', e);
      }
    }
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const requestBody = {
      profile: actualProfile,
      currentPerformance,
      previousQuestions,
      conversationHistory,
      isFollowUp,
      lastAnswer,
      sessionId: 'current-interview',
      voiceMetrics,
      behavioralMetrics,
      mainQuestions: mainQuestions || [],
      currentQuestionIndex: currentQuestionIndex || 0
    };

    console.log('📤 Sending to generate-next-question API:', {
      assessmentType: requestBody.profile?.assessmentType,
      fieldCategory: requestBody.profile?.fieldCategory,
      mainQuestionsCount: requestBody.mainQuestions.length,
      currentQuestionIndex: requestBody.currentQuestionIndex
    });

    const response = await fetch('/api/generate-next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      
      console.log('📥 Received from API:', {
        questionPreview: data.question?.substring(0, 50),
        assessmentType: data.assessmentType,
        fieldCategory: data.fieldCategory
      });
      
      if (data.isComplete) {
        return "COMPLETED";
      }
      
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
  
  console.log('🎯 Generating fallback question with profile:', {
    assessmentType: profile?.assessmentType,
    fieldCategory: profile?.fieldCategory,
    skills: profile?.skills,
    subject: profile?.subject,
    scenario: profile?.scenario,
    focusArea: profile?.focusArea
  });

  const actualProfile = profile || JSON.parse(localStorage.getItem('interviewProfile') || '{}');
  
  if (isFollowUp && previousQuestions.length > 0) {
    const lastQuestion = previousQuestions[previousQuestions.length - 1];
    
    if (actualProfile?.skills?.[0]) {
      return `Based on that, how would you apply your ${actualProfile.skills[0]} skills in practice?`;
    }
    
    if (actualProfile?.subject) {
      return `To follow up on that - what specific aspects of ${actualProfile.subject} are most relevant?`;
    }
    
    return `Can you provide more details about that experience?`;
  }

  const questionsByType: Record<string, string[]> = {
    'technical': [
      actualProfile?.subject ? `Can you explain a key concept in ${actualProfile.subject}?` : "Can you describe a complex technical problem you solved?",
      actualProfile?.skills?.[0] ? `What's your experience with ${actualProfile.skills[0]}?` : "How do you stay updated with the latest technologies?",
      actualProfile?.fieldCategory ? `How does ${actualProfile.fieldCategory} impact your work?` : "Can you walk me through your approach to debugging?",
      actualProfile?.skills?.[0] ? `How do you apply ${actualProfile.skills[0]} in your projects?` : "Tell me about a challenging technical project."
    ],
    'academic-viva': [
      actualProfile?.subject ? `What was your research focus in ${actualProfile.subject}?` : "Can you explain the main contributions of your research?",
      actualProfile?.skills?.[0] ? `How did you develop your ${actualProfile.skills[0]} skills?` : "What were the limitations of your methodology?",
      actualProfile?.fieldCategory ? `How does your work contribute to ${actualProfile.fieldCategory}?` : "What motivated your research direction?",
      actualProfile?.subject ? `What were the key findings in your ${actualProfile.subject} study?` : "How does your work build on existing research?"
    ],
    'communication-test': [
      actualProfile?.skills?.[0] ? `How do you approach ${actualProfile.skills[0]} in presentations?` : "How do you prepare for an important presentation?",
      "What techniques do you use to engage your audience?",
      "How do you handle questions during a presentation?",
      "What makes an effective communicator in your field?"
    ],
    'behavioral': [
      actualProfile?.fieldCategory ? `Describe a challenging situation in ${actualProfile.fieldCategory}.` : "Tell me about a time you faced a conflict.",
      actualProfile?.skills?.[0] ? `How have you demonstrated ${actualProfile.skills[0]} in a team setting?` : "How do you handle receiving critical feedback?",
      "Describe a situation where you had to meet a tight deadline.",
      "Tell me about a successful collaboration experience."
    ],
    'domain-specific': [
      actualProfile?.scenario ? `What challenges are unique to the ${actualProfile.scenario} domain?` : "What industry-specific challenges have you faced?",
      actualProfile?.fieldCategory ? `How do regulations impact ${actualProfile.fieldCategory}?` : "What trends are shaping your industry?",
      actualProfile?.scenario ? `What skills are most valuable in ${actualProfile.scenario}?` : "How do you stay current in your industry?",
      actualProfile?.fieldCategory ? `What innovations are changing ${actualProfile.fieldCategory}?` : "Describe a domain-specific problem you solved."
    ],
    'conceptual': [
      actualProfile?.focusArea ? `Explain the fundamental concepts of ${actualProfile.focusArea}.` : "How do you approach complex conceptual problems?",
      actualProfile?.subject ? `What theories are important in ${actualProfile.subject}?` : "What's the difference between theory and practice in your field?",
      actualProfile?.focusArea ? `What are the key debates in ${actualProfile.focusArea}?` : "How do you evaluate competing theories?",
      actualProfile?.subject ? `How has ${actualProfile.subject} evolved conceptually?` : "What conceptual frameworks guide your work?"
    ],
    'confidence-building': [
      "Tell me about a time you felt confident speaking in public.",
      "What strategies do you use to build confidence before speaking?",
      "How do you handle nervousness during important conversations?",
      "What helps you feel most confident when communicating?"
    ],
    'general-practice': [
      "Tell me about yourself and your background.",
      "What are your greatest strengths?",
      "What areas are you looking to improve?",
      "Where do you see yourself in 5 years?"
    ],
    'default': [
      actualProfile?.skills?.[0] ? `Can you describe your experience with ${actualProfile.skills[0]}?` : "Can you describe a challenging project?",
      actualProfile?.fieldCategory ? `How does your background relate to ${actualProfile.fieldCategory}?` : "What's your process for learning new skills?",
      actualProfile?.subject ? `What interests you about ${actualProfile.subject}?` : "How do you handle professional disagreements?"
    ]
  };

  const questionBank = questionsByType[actualProfile?.assessmentType] || questionsByType.default;
  
  const availableQuestions = questionBank.filter((q: string) => !previousQuestions.includes(q));
  const questions = availableQuestions.length > 0 ? availableQuestions : questionBank;
  
  const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
  console.log('✅ Selected fallback question:', selectedQuestion);
  
  return selectedQuestion;
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
  const [performanceScore, setPerformanceScore] = useState(0); // Start at 0
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [answerTime, setAnswerTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [questionSource, setQuestionSource] = useState<'feedback' | 'follow-up' | 'main'>('main');
  const [avatarText, setAvatarText] = useState<string>('');
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  const [mainQuestions, setMainQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(8);
  const [interviewStage, setInterviewStage] = useState<'welcome' | 'main' | 'followup' | 'complete'>('welcome');
  
  // Interview Adaptive States
  const [currentPerformance, setCurrentPerformance] = useState<number>(0); // Start at 0
  const [isFollowUp, setIsFollowUp] = useState<boolean>(false);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [hasInterviewStarted, setHasInterviewStarted] = useState(false);
  // Voice and Behavioral Analysis State
  const [voiceAnalysis, setVoiceAnalysis] = useState<any>(null);
  const [behavioralAnalysis, setBehavioralAnalysis] = useState<any>(null);
  const [voiceRecommendations, setVoiceRecommendations] = useState<string[]>([]);
  const [behavioralRecommendations, setBehavioralRecommendations] = useState<string[]>([]);
  
  // Declare refs FIRST
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const answerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef(false);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lipSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const avatarRef = useRef<VRMAvatarHandle>(null);
  
  // Lip-sync state
  const [lipSyncData, setLipSyncData] = useState<PhonemeData[]>([]);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isLipSyncGenerating, setIsLipSyncGenerating] = useState(false);
  
  // Initialize real analyzers
  const realVoiceAnalyzerRef = useRef(new RealVoiceAnalyzer());
  const realBehavioralAnalyzerRef = useRef(new RealBehavioralAnalyzer());

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    setTranscript 
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && isListening) {
      setCurrentAnswer(transcript);
      console.log('🎤 Speech captured:', transcript.substring(0, 50));
    }
  }, [transcript, isListening]);

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
        
        const savedQuestions = localStorage.getItem('generatedQuestions');
        if (savedQuestions) {
          const parsed = JSON.parse(savedQuestions);
          setMainQuestions(parsed.questions || []);
          setTotalQuestions(parsed.questions?.length || 8);
        }
        
        setLoading(false);
      } catch (error) { 
        setError('Failed to load interview data'); 
        setLoading(false);
      }
    };
    
    loadInterviewData();
  }, []);

  // Preload voices and set default male voice
  useEffect(() => {
    const preloadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('🎤 Preloaded voices:', voices.map(v => `${v.name} - ${v.lang}`));
      
      const maleVoice = voices.find(voice => 
        (voice.lang.includes('en') && 
         (voice.name.toLowerCase().includes('david') ||
          voice.name.toLowerCase().includes('mark') ||
          voice.name.toLowerCase().includes('james') ||
          voice.name.toLowerCase().includes('mike') ||
          voice.name.toLowerCase().includes('daniel') ||
          voice.name.toLowerCase().includes('alex') ||
          voice.name.includes('Google UK English Male') ||
          voice.name.includes('Microsoft David') ||
          voice.name.includes('Microsoft Mark')))
      );
      
      if (maleVoice) {
        localStorage.setItem('preferredVoice', maleVoice.name);
        console.log('✅ Preferred male voice set:', maleVoice.name);
      }
    };

    if (typeof window !== 'undefined') {
      if (window.speechSynthesis.getVoices().length > 0) {
        preloadVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = preloadVoices;
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Answer timer
  useEffect(() => {
    if (interviewStarted && !isPaused && !isAnalyzing && !isAISpeaking && !isLipSyncGenerating && currentQuestion) {
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
  }, [interviewStarted, isPaused, isAnalyzing, isAISpeaking, isLipSyncGenerating, currentQuestion]);

  // Update analysis data from real analyzers
  useEffect(() => {
    if (interviewStarted && !isPaused) {
      analysisIntervalRef.current = setInterval(() => {
        try {
          const voiceData = realVoiceAnalyzerRef.current.getCurrentAnalysis();
          const behavioralData = realBehavioralAnalyzerRef.current.getCurrentAnalysis();
          
          setVoiceAnalysis(voiceData);
          setBehavioralAnalysis(behavioralData);
          
          // Only show recommendations if we have valid data
          if (voiceData.hasValidData) {
            setVoiceRecommendations(voiceData.recommendations || []);
          } else {
            setVoiceRecommendations([]);
          }
          
          if (behavioralData.hasValidData) {
            setBehavioralRecommendations(behavioralData.recommendations || []);
          } else {
            setBehavioralRecommendations([]);
          }
        } catch (error) {
          console.error('❌ Analyzer error:', error);
        }
      }, 1000);
    } else if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [interviewStarted, isPaused]);

  // Initialize media with real analyzers
  const initializeMedia = useCallback(async () => {
    try {
      console.log('🎥 Initializing media with real analyzers...');
      
      realVoiceAnalyzerRef.current.stopAnalysis();
      realBehavioralAnalyzerRef.current.stopAnalysis();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setMediaStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        await videoRef.current.play();
        
        console.log('👁️ Starting real behavioral analyzer...');
        realBehavioralAnalyzerRef.current.startRealTimeAnalysis(videoRef.current);
      }
      
      console.log('🔊 Starting real voice analyzer...');
      await realVoiceAnalyzerRef.current.startRealTimeAnalysis(stream);
      
      console.log('✅ All real analyzers started');
      
    } catch (error) {
      console.warn('❌ Media access failed:', error);
    }
  }, []);

const toggleVideo = useCallback(() => {
  if (mediaStream) {
    const videoTrack = mediaStream.getVideoTracks()[0];
    if (videoTrack) {
      const newVideoState = !isVideoEnabled;
      videoTrack.enabled = newVideoState;
      setIsVideoEnabled(newVideoState);
      
      console.log(`📹 Camera turned ${newVideoState ? 'ON' : 'OFF'}`);
      
      // Re-initialize behavioral analyzer based on new state
      if (newVideoState && videoRef.current) {
        // Turning ON - start analysis
        console.log('👁️ Starting behavioral analyzer (camera just turned on)...');
        setTimeout(() => {
          realBehavioralAnalyzerRef.current.startRealTimeAnalysis(videoRef.current!);
        }, 300);
      } else {
        // Turning OFF - stop analysis
        console.log('🚫 Stopping behavioral analyzer (camera turned off)');
        realBehavioralAnalyzerRef.current.stopAnalysis();
        
        // Reset behavioral recommendations
        setBehavioralRecommendations(["Camera is off - turn it on to enable behavioral analysis"]);
        
        // Update behavioral analysis state to show no data
        setBehavioralAnalysis({
          behavior: {
            eyeContact: 0,
            smiling: 0,
            posture: 0,
            attention: 0,
            gestures: 0,
            headMovement: 0,
            overallEngagement: 0,
            faceDetected: false,
            hasValidData: false
          },
          overallScore: 0,
          hasValidData: false,
          faceDetected: false,
          cameraWorking: false,
          recommendations: ["Camera is off"]
        });
      }
    }
  }
}, [mediaStream, isVideoEnabled, videoRef]);

const toggleMicrophone = useCallback(() => {
  if (mediaStream) {
    const audioTrack = mediaStream.getAudioTracks()[0];
    if (audioTrack) {
      const newMicState = !isMicEnabled;
      audioTrack.enabled = newMicState;
      setIsMicEnabled(newMicState);
      
      console.log(`🎤 Microphone turned ${newMicState ? 'ON' : 'OFF'}`);
      
      // Re-initialize voice analyzer based on new state
      if (newMicState) {
        // Turning ON - start analysis
        console.log('🔊 Starting voice analyzer (mic just turned on)...');
        setTimeout(() => {
          realVoiceAnalyzerRef.current.startRealTimeAnalysis(mediaStream);
        }, 300); // Small delay to ensure track is fully enabled
      } else {
        // Turning OFF - stop analysis
        console.log('🔇 Stopping voice analyzer (mic turned off)');
        realVoiceAnalyzerRef.current.stopAnalysis();
        
        // Reset voice recommendations
        setVoiceRecommendations(["Microphone is off - turn it on to enable voice analysis"]);
        
        // Update voice analysis state to show no data
        setVoiceAnalysis({
          voice: {
            volume: 0,
            clarity: 0,
            pace: 0,
            confidence: 0,
            fillerWords: [],
            isSpeaking: false,
            hasValidData: false
          },
          overallScore: 0,
          hasValidData: false,
          isSpeaking: false,
          recommendations: ["Microphone is off"]
        });
      }
    }
  }
}, [mediaStream, isMicEnabled]);

  // Emotion mapping
  const getEmotionForContext = useCallback((): EmotionType => {
    if (isAISpeaking || isLipSyncGenerating) return 'speaking';
    if (isListening) return 'listening';
    if (isAnalyzing) return 'thinking';
    if (currentFeedback?.includes('Excellent') || currentFeedback?.includes('Great') || currentFeedback?.includes('Good')) {
      return 'happy';
    }
    if (currentFeedback?.includes('brief') || currentFeedback?.includes('expand') || currentFeedback?.includes('elaborate')) {
      return 'thinking';
    }
    return 'neutral';
  }, [isAISpeaking, isLipSyncGenerating, isListening, isAnalyzing, currentFeedback]);

  useEffect(() => {
    setCurrentEmotion(getEmotionForContext());
  }, [getEmotionForContext]);

  const speakWithLipSync = useCallback(async (
  text: string,
  emotion: EmotionType = 'speaking'
) => {
  // Don't speak if interview is completed
  if (interviewCompleted) {
    console.log('⏭️ Interview completed - not speaking');
    return;
  }
  
  if (!avatarRef.current) return;

  const waitForVoices = () =>
    new Promise<void>((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve();
      } else {
        window.speechSynthesis.onvoiceschanged = () => resolve();
      }
    });

  await waitForVoices();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = emotion === 'happy' ? 1.05 : 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  const preferredVoice =
    voices.find(v => v.name.includes('Microsoft David')) ||
    voices.find(v => v.lang === 'en-US') ||
    voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  setIsAISpeaking(true);
  setAvatarText(text);

  try {
    await avatarRef.current.speak(text, utterance, emotion);
  } catch (e) {
    console.error("Speech failed:", e);
  }

  setIsAISpeaking(false);
  setCurrentEmotion('listening');
  setAvatarText('');

}, [avatarRef, interviewCompleted]); // Add interviewCompleted to dependencies
  


const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if (lipSyncIntervalRef.current) {
      clearInterval(lipSyncIntervalRef.current);
      lipSyncIntervalRef.current = null;
    }
    
    setIsAISpeaking(false);
    setIsAILoading(false);
    setIsLipSyncGenerating(false);
    setCurrentEmotion('listening');
    setAvatarText('');
    setLipSyncData([]);
    setCurrentAudioTime(0);
  }, []);

  // Reset answer state
  const resetAnswerState = useCallback(() => {
    setCurrentAnswer('');
    setTranscript('');
    setAnswerTime(0);
    setCurrentFeedback('');
  }, [setTranscript]);

  // ============== COMPLETE INTERVIEW ==============
// ============== COMPLETE INTERVIEW ==============
const completeInterview = useCallback(async (manualStop = false) => {
  console.log('🏁 Completing interview...');
  
  // If manually stopped, don't duplicate the process
  if (manualStop) {
    console.log('Interview already stopped manually');
    return;
  }
  
  // CRITICAL: Set these FIRST to prevent any further interview progress
  setIsPaused(true);
  setInterviewStarted(false);
  setHasInterviewStarted(false);
  setCurrentQuestion('');
  setIsAnalyzing(false);
  setIsAISpeaking(false);
  setIsLipSyncGenerating(false);
  processingRef.current = true; // Prevent any further submissions
  
  // Stop all active processes
  stopSpeaking();
  if (isListening) stopListening();
  
  // Stop all analyzers
  realVoiceAnalyzerRef.current.stopAnalysis();
  realBehavioralAnalyzerRef.current.stopAnalysis();
  
  // Stop media tracks
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => {
      track.stop();
      console.log(`⏹️ Stopped ${track.kind} track`);
    });
  }
  
  // Clear all intervals
  if (answerTimerRef.current) {
    clearInterval(answerTimerRef.current);
    answerTimerRef.current = null;
  }
  
  if (analysisIntervalRef.current) {
    clearInterval(analysisIntervalRef.current);
    analysisIntervalRef.current = null;
  }
  
  if (lipSyncIntervalRef.current) {
    clearInterval(lipSyncIntervalRef.current);
    lipSyncIntervalRef.current = null;
  }
  
  // Calculate final score based on actual answers
  let finalScore = 0;
  let totalScore = 0;
  
  console.log('📊 Calculating final score from:', {
    answersCount: answers.length,
    performanceScore,
    questionsAsked,
    finalTime: answerTime,
    hasInterviewStarted
  });
  
  // Calculate from answers array
  if (answers.length > 0) {
    answers.forEach((answer, index) => {
      const answerScore = answer.score || 
                         answer.contentScore || 
                         answer.analysis?.score || 
                         (answer.voiceMetrics?.overallScore ? answer.voiceMetrics.overallScore * 0.6 : 0) ||
                         (answer.behavioralMetrics?.overallScore ? answer.behavioralMetrics.overallScore * 0.4 : 0) ||
                         0;
      
      if (answerScore > 0) {
        totalScore += answerScore;
        console.log(`✅ Answer ${index + 1} score:`, answerScore);
      }
    });
    
    if (answers.length > 0) {
      finalScore = Math.round(totalScore / answers.length);
    }
  }
  
  // If no answers but interview was started, set a default score
  if (finalScore === 0 && questionsAsked > 0) {
    finalScore = 45; // Default score for attempted interview
    console.log('📊 No answers but questions asked, using default score:', finalScore);
  } else if (finalScore === 0 && hasInterviewStarted) {
    finalScore = 30; // Interview started but no questions answered
    console.log('📊 Interview started but no answers, using score:', finalScore);
  }
  
  // Ensure finalScore is a number between 0-100
  finalScore = Math.min(100, Math.max(0, Math.round(finalScore || 0)));
  
  // Get latest analysis data
  const voiceData = realVoiceAnalyzerRef.current.getCurrentAnalysis();
  const behavioralData = realBehavioralAnalyzerRef.current.getCurrentAnalysis();
  
  // Update performance score state with final calculated score
  setPerformanceScore(finalScore);
  
  console.log('🎯 Final calculated score:', finalScore);
  console.log('⏱️ Final time:', answerTime);
  
  // Generate improvement tips based on score
  let improvementMessage = "";
  if (finalScore >= 80) {
    improvementMessage = "Excellent work! Your communication skills are very strong. Keep practicing to maintain this level.";
  } else if (finalScore >= 60) {
    improvementMessage = "Good job! You have solid communication skills. Focus on providing more specific examples and maintaining better eye contact.";
  } else if (finalScore >= 40) {
    improvementMessage = "You're on the right track. Work on structuring your answers better and reducing filler words. Practice more to build confidence.";
  } else {
    improvementMessage = "Keep practicing! Focus on speaking clearly, maintaining eye contact, and providing detailed answers. Every practice session helps you improve.";
  }
  
  // Create interview results object
  const interviewResults = {
    profile,
    answers: answers || [],
    finalScore,
    performanceScore: finalScore,
    voiceAnalysis: voiceData,
    behavioralAnalysis: behavioralData,
    completedAt: new Date().toISOString(),
    totalQuestions: questionsAsked || 0,
    assessmentType: profile?.assessmentType || 'interview',
    fieldCategory: profile?.fieldCategory || 'general',
    skills: profile?.skills || [],
    subject: profile?.subject || '',
    scenario: profile?.scenario || '',
    focusArea: profile?.focusArea || '',
    totalTime: answerTime || 0,
    difficulty: profile?.difficulty || 'medium',
    manuallyStopped: manualStop,
    answerCount: answers.length || 0,
    interviewPhase: hasInterviewStarted ? 'started' : 'not_started',
    improvementTips: improvementMessage
  };
  
  // Save to localStorage (backup)
  localStorage.setItem('interviewResults', JSON.stringify(interviewResults));
  localStorage.setItem('improvementTips', improvementMessage);
  
  // Try to save to database via API
  try {
    console.log('📤 Sending to database:', interviewResults);
    const response = await fetch('/api/interview/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interviewResults)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Results saved to database:', data);
    } else {
      const error = await response.text();
      console.error('❌ Failed to save to database:', error);
    }
  } catch (error) {
    console.error('Error saving to database:', error);
  }
  
  console.log('💾 Saved interview results:', {
    finalScore,
    questionsAnswered: questionsAsked,
    answerCount: answers.length,
    totalTime: answerTime
  });
  
  // CRITICAL: Show results section
  setInterviewCompleted(true);
  setInterviewStage('complete');
  processingRef.current = false;
  
  // Speak congratulatory message
  setTimeout(async () => {
    const attemptedCount = questionsAsked > 0 ? questionsAsked : answers.length;
    const message = `Congratulations! Your score is ${finalScore} percent. You attempted ${attemptedCount} questions. ${improvementMessage} Best of luck for next time!`;
    await speakWithLipSync(message, 'happy');
  }, 1000);
  
  console.log('✅ Results section should now be visible');
  
}, [answers, performanceScore, questionsAsked, answerTime, profile, mediaStream, isListening, stopListening, stopSpeaking, voiceAnalysis, behavioralAnalysis, hasInterviewStarted]);
// ============== STOP INTERVIEW (Manual Stop) ==============
// ============== STOP INTERVIEW (Manual Stop) ==============
const stopInterview = useCallback(async () => {
  console.log('🛑 Manually stopping interview...');
  
  // CRITICAL: Set these FIRST to prevent any further progress
  setIsPaused(true);
  setInterviewStarted(false);
  setHasInterviewStarted(false);
  setCurrentQuestion(''); // Clear the current question
  setIsAnalyzing(false);
  setIsAISpeaking(false);
  setIsLipSyncGenerating(false);
  processingRef.current = true; // Prevent any further submissions
  
  // Immediately cancel any ongoing speech
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  
  // Stop listening if active
  if (isListening) {
    stopListening();
  }
  
  // Stop speaking
  stopSpeaking();
  
  // Stop all analyzers immediately
  realVoiceAnalyzerRef.current.stopAnalysis();
  realBehavioralAnalyzerRef.current.stopAnalysis();
  
  // Check if any questions were actually answered
  const hasAnswers = answers.length > 0;
  const attemptedCount = questionsAsked > 0 ? questionsAsked : answers.length;
  
  // Calculate final score - ONLY if there are answers
  let finalScore = 0;
  if (hasAnswers) {
    // Calculate from answers array
    let totalScore = 0;
    answers.forEach((answer, index) => {
      const answerScore = answer.score || 
                         answer.contentScore || 
                         answer.analysis?.score || 
                         (answer.voiceMetrics?.overallScore ? answer.voiceMetrics.overallScore * 0.6 : 0) ||
                         (answer.behavioralMetrics?.overallScore ? answer.behavioralMetrics.overallScore * 0.4 : 0) ||
                         0;
      
      if (answerScore > 0) {
        totalScore += answerScore;
      }
    });
    
    if (answers.length > 0) {
      finalScore = Math.round(totalScore / answers.length);
    }
  } else {
    // No answers were given - score should be 0
    finalScore = 0;
    console.log('📊 No answers provided - score set to 0');
  }
  
  // Update states for results
  setPerformanceScore(finalScore);
  setQuestionsAsked(attemptedCount);
  
  // Generate improvement tips based on score
  let improvementMessage = "";
  if (finalScore >= 80) {
    improvementMessage = "Excellent work! Your communication skills are very strong. Keep practicing to maintain this level.";
  } else if (finalScore >= 60) {
    improvementMessage = "Good job! You have solid communication skills. Focus on providing more specific examples and maintaining better eye contact.";
  } else if (finalScore >= 40) {
    improvementMessage = "You're on the right track. Work on structuring your answers better and reducing filler words. Practice more to build confidence.";
  } else if (finalScore > 0) {
    improvementMessage = "Keep practicing! Focus on speaking clearly, maintaining eye contact, and providing detailed answers. Every practice session helps you improve.";
  } else {
    improvementMessage = "You didn't attempt any questions this time. Don't worry! Next time, try to answer at least a few questions to get personalized feedback. Every practice session helps you improve!";
  }
  
  // Save improvement message for results
  localStorage.setItem('improvementTips', improvementMessage);
  
  // Stop media tracks
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => {
      track.stop();
      console.log(`⏹️ Stopped ${track.kind} track`);
    });
  }
  
  // Clear all intervals
  if (answerTimerRef.current) {
    clearInterval(answerTimerRef.current);
    answerTimerRef.current = null;
  }
  
  if (analysisIntervalRef.current) {
    clearInterval(analysisIntervalRef.current);
    analysisIntervalRef.current = null;
  }
  
  if (lipSyncIntervalRef.current) {
    clearInterval(lipSyncIntervalRef.current);
    lipSyncIntervalRef.current = null;
  }
  
  // Show results section FIRST
  setInterviewCompleted(true);
  setInterviewStage('complete');
  
  // Small delay to ensure UI updates before speaking
  setTimeout(() => {
    // Speak congratulatory message
    let message = "";
    if (finalScore > 0) {
      message = `Congratulations! Your score is ${finalScore} percent. You attempted ${attemptedCount} questions. ${improvementMessage} Best of luck for next time!`;
    } else {
      message = `You didn't attempt any questions this time. ${improvementMessage} Best of luck for next time!`;
    }
    
    // Speak the message
    speakWithLipSync(message, 'happy').then(() => {
      console.log('✅ Final message spoken, interview complete');
      processingRef.current = false;
    });
  }, 500);
  
}, [answers, performanceScore, questionsAsked, isListening, stopListening, stopSpeaking, mediaStream, speakWithLipSync]);
//========== GO TO DASHBOARD ==============
const goToDashboard = useCallback(() => {
  router.push('/dashboard');
}, [router]);

// ============== EXIT WITHOUT SAVING ==============
const exitInterview = useCallback(() => {
  // Clean up before exiting
  realVoiceAnalyzerRef.current.stopAnalysis();
  realBehavioralAnalyzerRef.current.stopAnalysis();
  stopSpeaking();
  
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }
  
  if (isListening) stopListening();
  
  router.push('/dashboard');
}, [mediaStream, isListening, stopListening, stopSpeaking, router]);

  // ============== STOP INTERVIEW (Manual Stop) ==============

  // ============== ASK NEXT MAIN QUESTION ==============
  const askNextMainQuestion = useCallback(async (index: number) => {
    if (index >= mainQuestions.length) {
      console.log('✅ All main questions completed');
      completeInterview(false);
      return;
    }
    
    const nextQuestion = mainQuestions[index];
    console.log('📝 Asking main question:', {
      index: index + 1,
      total: mainQuestions.length,
      assessmentType: profile?.assessmentType,
      fieldCategory: profile?.fieldCategory,
      question: nextQuestion.substring(0, 100)
    });
    
    setInterviewStage('main');
    setCurrentQuestion(nextQuestion);
    setCurrentQuestionIndex(index);
    setQuestionSource('main');
    resetAnswerState();
    
    await speakWithLipSync(nextQuestion, 'speaking');
  }, [mainQuestions, profile, speakWithLipSync, resetAnswerState, completeInterview]);

 // ============== START INTERVIEW ==============
const startInterview = useCallback(async () => {
  try {
    console.log("🚀 Starting interview...");

    if (!profile) {
      console.warn("No profile found.");
      return;
    }

    // Reset all states
    setPerformanceScore(0);
    setCurrentPerformance(0);
    setAnswers([]);
    setQuestionsAsked(0);
    setAnswerTime(0);
    setHasInterviewStarted(false); // Reset this
    
    await initializeMedia();

    setInterviewStarted(true);
    setInterviewCompleted(false);
    setCurrentQuestion("");
    setCurrentQuestionIndex(0);
    setIsFollowUp(false);
    setConversationHistory([]);
    setPreviousQuestions([]);

    const welcomeMessage = `
Welcome to your ${profile.assessmentType} assessment.
We will focus on ${profile.fieldCategory}.
Speak clearly and confidently.
Let's begin.
      `.trim();

    await speakWithLipSync(welcomeMessage, "happy");

    const response = await fetch("/api/generate-next-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        profile,
        currentPerformance: 0,
        previousQuestions: [],
        conversationHistory: [],
        isFollowUp: false,
        lastAnswer: "",
        voiceMetrics: null,
        behavioralMetrics: null
      })
    });

    const data = await response.json();

    if (!data?.question) {
      throw new Error("No question returned from API");
    }

    setCurrentQuestion(data.question);
    setPreviousQuestions([data.question]);
    setHasInterviewStarted(true); // Set this after first question is asked

    await speakWithLipSync(data.question, "speaking");

  } catch (error) {
    console.error("❌ Interview start failed:", error);
  }
}, [
  profile,
  speakWithLipSync,
  initializeMedia
]);

  // ============== HANDLE SUBMIT ANSWER ==============
  const handleSubmitAnswer = useCallback(async () => {
    if (processingRef.current) return;
    
    if (isListening) stopListening();
    stopSpeaking();

    processingRef.current = true;
    setIsAnalyzing(true);
    
    setAvatarText("Analyzing your response...");
    setCurrentEmotion('thinking');
    
    try {
      const questionText = getQuestionText(currentQuestion);
      
      const voiceData = realVoiceAnalyzerRef.current.getCurrentAnalysis();
      const behavioralData = realBehavioralAnalyzerRef.current.getCurrentAnalysis();
      
      console.log('📊 Live Analysis Data:', {
        voiceVolume: voiceData?.voice?.volume || 0,
        voiceConfidence: voiceData?.voice?.confidence || 0,
        voiceClarity: voiceData?.voice?.clarity || 0,
        voiceHasValidData: voiceData?.hasValidData || false,
        voiceIsSpeaking: voiceData?.isSpeaking || false,
        behavioralEngagement: behavioralData?.behavior?.overallEngagement || 0,
        eyeContact: behavioralData?.behavior?.eyeContact || 0,
        behavioralHasValidData: behavioralData?.hasValidData || false,
        behavioralFaceDetected: behavioralData?.faceDetected || false,
        answerLength: currentAnswer.length
      });

      const voiceScore = voiceData?.overallScore || 0;
      const voiceVolume = voiceData?.voice?.volume || 0;
      const voiceHasValidData = voiceData?.hasValidData || false;
      const isActuallySpeaking = voiceData?.isSpeaking || false;
      
      // Check if user actually spoke (either through voice detection OR typed answer)
      const hasSpoken = 
        (currentAnswer.trim().length > 15) || // Typed answer
        (voiceHasValidData && isActuallySpeaking && voiceVolume > 5) || // Spoke with voice
        (voiceScore > 20); // Voice score indicates speech

      console.log('🎤 Speech detection:', {
        hasSpoken,
        textLength: currentAnswer.trim().length,
        voiceScore,
        voiceVolume,
        voiceHasValidData,
        isActuallySpeaking
      });

      if (!hasSpoken) {
        await speakWithLipSync(
          "I didn't catch your response. Please speak clearly into your microphone or type your answer.",
          "thinking"
        );
        
        setIsAnalyzing(false);
        processingRef.current = false;
        return;
      }

      console.log('✅ Valid response detected, analyzing with AI...');

      const analysis = await analyzeAnswerWithAI(
        questionText, 
        currentAnswer, 
        performanceScore, 
        conversationContext, 
        profile,
        voiceData,
        behavioralData
      );

      // Calculate score based on actual data
      let blendedScore = calculateRealisticScore(currentAnswer, 50, voiceData, behavioralData);
      
      // Update performance score based on actual answers
      const totalAnswers = answers.length + 1;
      const newPerformanceScore = totalAnswers === 1 
        ? blendedScore 
        : Math.round((performanceScore * (totalAnswers - 1) + blendedScore) / totalAnswers);
      
      setPerformanceScore(newPerformanceScore);
      setCurrentPerformance(newPerformanceScore);
      
      const wasMainQuestion = questionSource === 'main';
      const wasFollowUp = questionSource === 'follow-up' || questionSource === 'feedback';
      
      if (wasMainQuestion) {
        setQuestionsAsked(prev => prev + 1);
      }

      setConversationContext(prev => [
        ...prev.slice(-4), 
        `Q: ${questionText} A: ${currentAnswer.substring(0, 100)}...`
      ]);

      const voiceContribution = voiceData?.hasValidData ? (voiceData?.overallScore || 0) : 0;
      const behavioralContribution = behavioralData?.hasValidData ? (behavioralData?.overallScore || 0) : 0;

      const newAnswer = {
        question: questionText,
        answer: currentAnswer,
        score: blendedScore,
        contentScore: blendedScore,
        voiceScore: voiceContribution,
        behavioralScore: behavioralContribution,
        feedback: analysis.detailedFeedback,
        voiceMetrics: voiceData,
        behavioralMetrics: behavioralData,
        timestamp: new Date().toISOString(),
        answerTime: answerTime,
        isFollowUp: wasFollowUp,
        questionSource: questionSource,
        questionIndex: wasMainQuestion ? currentQuestionIndex : undefined
      };
      
      setAnswers(prev => [...prev, newAnswer]);
      
      // Only show recommendations if we have valid data
      if (voiceData?.hasValidData) {
        setVoiceRecommendations(analysis.voiceRecommendations || voiceData?.recommendations || []);
      } else {
        setVoiceRecommendations([]);
      }
      
      if (behavioralData?.hasValidData) {
        setBehavioralRecommendations(analysis.behavioralRecommendations || behavioralData?.recommendations || []);
      } else {
        setBehavioralRecommendations([]);
      }
      
      let combinedFeedback = analysis.detailedFeedback;
      
      // Add voice feedback only if valid
      if (voiceData?.hasValidData && voiceData?.voice) {
        if (voiceData.voice.volume < 20 && voiceData.voice.volume > 0) {
          combinedFeedback += " Your voice was quite quiet - try to speak louder for better impact.";
        } else if (voiceData.voice.volume > 80) {
          combinedFeedback += " You were speaking quite loudly - moderate your volume slightly.";
        }
        
        if (voiceData.voice.speechPattern === 'rushed') {
          combinedFeedback += " Try to slow down your pace a bit.";
        }
      }
      
      // Add behavioral feedback only if valid
      if (behavioralData?.hasValidData && behavioralData?.behavior) {
        if (behavioralData.behavior.eyeContact < 40 && behavioralData.behavior.eyeContact > 0) {
          combinedFeedback += " Try to maintain better eye contact with the camera.";
        }
        
        if (behavioralData.behavior.smiling < 30 && behavioralData.behavior.smiling > 0) {
          combinedFeedback += " A smile would make you appear more confident.";
        }
        
        if (behavioralData.behavior.posture < 45 && behavioralData.behavior.posture > 0) {
          combinedFeedback += " Sit up straight for better presence.";
        }
      }
      
      if (analysis.voiceRecommendations?.length > 0 && voiceData?.hasValidData) {
        combinedFeedback += ` ${analysis.voiceRecommendations[0]}`;
      } else if (voiceData?.recommendations?.length > 0 && voiceData?.hasValidData) {
        combinedFeedback += ` ${voiceData.recommendations[0]}`;
      }
      
      if (analysis.behavioralRecommendations?.length > 0 && behavioralData?.hasValidData) {
        combinedFeedback += ` ${analysis.behavioralRecommendations[0]}`;
      } else if (behavioralData?.recommendations?.length > 0 && behavioralData?.hasValidData) {
        combinedFeedback += ` ${behavioralData.recommendations[0]}`;
      }
      
      setCurrentFeedback(combinedFeedback);
      
      await speakWithLipSync(combinedFeedback, 'thinking');

      const mainQuestionsAsked = answers.filter((a: any) => a.questionSource === 'main').length + (wasMainQuestion ? 1 : 0);
      
      console.log('🔄 Interview Progress:', {
        mainQuestionsAsked,
        totalQuestions,
        currentQuestionIndex,
        wasMainQuestion,
        wasFollowUp,
        hasFollowUp: analysis.hasFollowUp,
        needsClarification: analysis.needsClarification,
        score: blendedScore,
        voiceScore: voiceContribution,
        behavioralScore: behavioralContribution,
        answerLength: currentAnswer.length
      });
      
      if (mainQuestionsAsked >= totalQuestions && !analysis.hasFollowUp && !analysis.needsClarification) {
        console.log('✅ All questions completed, ending interview');
        setTimeout(() => {
          completeInterview(false);
        }, 2000);
        return;
      }
      
      const isWeakAnswer = 
        blendedScore < 65 ||
        (voiceData?.hasValidData && voiceContribution < 40) ||
        (behavioralData?.hasValidData && behavioralContribution < 35) ||
        currentAnswer.length < 30 ||
        analysis.needsClarification === true;

      const shouldAskFollowUp = 
        questionSource === 'main' && 
        (analysis.hasFollowUp || isWeakAnswer) &&
        mainQuestionsAsked < totalQuestions;

      console.log("🔄 Next step decision:", {
        shouldAskFollowUp,
        isWeakAnswer,
        hasFollowUp: analysis.hasFollowUp,
        needsClarification: analysis.needsClarification,
        questionSource
      });

      if (shouldAskFollowUp) {
        console.log('🔄 Asking follow-up question...');

        setTimeout(async () => {
          const nextQuestion = 
            analysis.followUpQuestion ||
            analysis.nextQuestion ||
            "Can you elaborate on that with more details?";

          setCurrentQuestion(nextQuestion);
          setQuestionSource('follow-up');

          await speakWithLipSync(nextQuestion, 'speaking');

          resetAnswerState();
          setIsAnalyzing(false);
          processingRef.current = false;
        }, 1500);

        return;
      }

      console.log("➡ Moving to next main question");
      setQuestionSource('main');
      
      const nextIndex = currentQuestionIndex + 1;    
      
      if (mainQuestions.length > 0 && nextIndex < mainQuestions.length) {
        console.log('📝 Using pre-generated question:', {
          fromIndex: currentQuestionIndex,
          toIndex: nextIndex
        });
        
        setTimeout(async () => {
          await askNextMainQuestion(nextIndex);
          setIsAnalyzing(false);
          processingRef.current = false;
        }, 1500);
      } 
      else if (mainQuestions.length === 0) {
        setTimeout(async () => {
          const nextQuestion = await generateNextQuestion(
            profile, 
            newPerformanceScore,
            answers.map((a: any) => a.question),
            conversationContext,
            false,
            currentAnswer,
            voiceData,
            behavioralData,
            mainQuestions,
            nextIndex
          );
          
          if (nextQuestion === "COMPLETED") {
            completeInterview(false);
            return;
          }
          
          setCurrentQuestion(nextQuestion);
          setQuestionSource('main');
          setCurrentQuestionIndex(nextIndex);
          
          await speakWithLipSync(nextQuestion, 'speaking');
          
          resetAnswerState();
          setIsAnalyzing(false);
          processingRef.current = false;
        }, 1500);
      } 
      else {
        console.log('🏁 No more questions available');
        setTimeout(() => {
          completeInterview(false);
        }, 2000);
      }

    } catch (error) {
      console.error('❌ Error processing answer:', error);
      
      setCurrentFeedback("There was an issue processing your answer. Let's continue with the next question.");
      
      await speakWithLipSync(
        "There was an issue processing your answer. Let's continue with the next question.",
        'neutral'
      );
      
      setTimeout(async () => {
        try {
          const fallbackQuestion = await generateNextQuestion(
            profile, 
            performanceScore, 
            answers.map((a: any) => a.question),
            conversationContext,
            false,
            currentAnswer,
            undefined,
            undefined,
            mainQuestions,
            currentQuestionIndex
          );
          
          if (fallbackQuestion === "COMPLETED") {
            completeInterview(false);
            return;
          }
          
          setCurrentQuestion(fallbackQuestion);
          setQuestionSource('main');
          
          await speakWithLipSync(fallbackQuestion, 'speaking');
          
          resetAnswerState();
        } catch (e) {
          console.error('❌ Failed to generate next question:', e);
          completeInterview(false);
        } finally {
          setIsAnalyzing(false);
          processingRef.current = false;
        }
      }, 1500);
    }
  }, [
    currentAnswer, 
    isListening, 
    performanceScore, 
    questionsAsked, 
    conversationContext, 
    profile, 
    answerTime, 
    questionSource,
    stopListening, 
    stopSpeaking, 
    currentQuestion, 
    answers,
    mainQuestions, 
    totalQuestions, 
    currentQuestionIndex,
    resetAnswerState, 
    speakWithLipSync, 
    completeInterview, 
    askNextMainQuestion
  ]);

  const togglePause = useCallback(() => {
    setIsPaused(!isPaused);
    if (isListening) stopListening();
    stopSpeaking();
  }, [isPaused, isListening, stopListening, stopSpeaking]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes ping-slow {
        75%, 100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
      .animate-ping-slow {
        animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.5; filter: blur(20px); }
        50% { opacity: 1; filter: blur(30px); }
      }
      .animate-glow {
        animation: pulse-glow 4s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      realVoiceAnalyzerRef.current.stopAnalysis();
      realBehavioralAnalyzerRef.current.stopAnalysis();
      stopSpeaking();
      
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      
      if (answerTimerRef.current) {
        clearInterval(answerTimerRef.current);
      }
      
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
      
      if (lipSyncIntervalRef.current) {
        clearInterval(lipSyncIntervalRef.current);
      }
    };
  }, [mediaStream, stopSpeaking]);

  if (loading) return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <AILabBackground />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex items-center justify-center min-h-screen"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full mb-6 mx-auto"
          />
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-gray-400 text-lg"
          >
            Initializing AI Interview System...
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
  
  if (error) return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <AILabBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-center min-h-screen p-4"
      >
        <div className="bg-gray-900/90 backdrop-blur-xl border border-red-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.3)] max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Session Error</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard/interview/create')}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl w-full"
          >
            Create New Interview
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
  
// At the top of your component return, BEFORE the main interview UI
// At the top of your component return, BEFORE the main interview UI
if (interviewCompleted) {
  // Get improvement tips from localStorage
  const improvementTips = typeof window !== 'undefined' 
    ? localStorage.getItem('improvementTips') 
    : "Keep practicing to improve your skills!";
  
  const hasScore = performanceScore > 0;
  
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <AILabBackground />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex items-center justify-center min-h-screen p-4"
      >
        <div className="bg-gray-900/90 backdrop-blur-xl border border-green-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.3)] max-w-2xl w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="h-12 w-12 text-white" />
          </motion.div>
          
          <h2 className="text-4xl font-bold text-white mb-2">
            {hasScore ? 'Assessment Complete!' : 'Practice Session Ended'}
          </h2>
          <p className="text-gray-400 mb-6">
            {hasScore 
              ? 'Congratulations on completing your interview practice!' 
              : 'You ended the session without answering any questions.'}
          </p>
          
          {hasScore ? (
            <div className="mb-8">
              <motion.div 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-7xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-2"
              >
                {performanceScore}%
              </motion.div>
              <p className="text-gray-400">Overall Performance Score</p>
            </div>
          ) : (
            <div className="mb-8">
              <div className="text-7xl font-bold text-gray-500 mb-2">—</div>
              <p className="text-gray-400">No score available</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <MessageSquare className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{questionsAsked}</div>
              <div className="text-xs text-gray-400">Questions Attempted</div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <Clock className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{formatTime(answerTime)}</div>
              <div className="text-xs text-gray-400">Time Spent</div>
            </div>
          </div>
          
          {/* Improvement Tips Section */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/30 mb-8 text-left">
            <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Improvement Tips
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {improvementTips}
            </p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl w-full"
          >
            Go to Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
  const voiceScore = voiceAnalysis?.hasValidData ? (voiceAnalysis?.overallScore || 0) : 0;
  const behavioralScore = behavioralAnalysis?.hasValidData ? (behavioralAnalysis?.overallScore || 0) : 0;

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <AILabBackground />
      <audio ref={audioRef} className="hidden" />
      
      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.2)] border border-white/10 p-4 mb-4"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900"
                />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AI-Roleplay Communication Intelligence Platform</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-blue-300">{profile?.jobTitle || profile?.title}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-xs px-2 py-0.5 bg-purple-500/20 rounded-full text-purple-300 border border-purple-500/30">
                    Live Analysis
                  </span>
                </div>
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="flex items-center space-x-6">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`text-3xl font-bold ${
                    performanceScore >= 80 ? 'text-green-400' :
                    performanceScore >= 70 ? 'text-blue-400' : 
                    performanceScore >= 60 ? 'text-yellow-400' : 
                    performanceScore >= 40 ? 'text-orange-400' :
                    performanceScore > 0 ? 'text-red-400' : 'text-gray-500'
                  }`}
                >
                  {performanceScore > 0 ? `${performanceScore}%` : '--'}
                </motion.div>
                <div className="text-xs text-gray-400 mt-1">Performance</div>
              </motion.div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{currentQuestionIndex + 1}/{totalQuestions}</div>
                <div className="text-xs text-gray-400 mt-1">Progress</div>
              </div>
              
              {interviewStarted && currentQuestion && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{formatTime(answerTime)}</div>
                  <div className="text-xs text-gray-400 mt-1">Time</div>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex space-x-3">
              {!interviewStarted ? (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startInterview}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled={isAILoading}
                >
                  {isAILoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isAILoading ? 'Starting...' : 'Start Assessment'}
                </motion.button>
              ) : (
                <>
                  {/* Stop Button */}
{/* Stop Button */}
<motion.button 
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={stopInterview}
  className="flex items-center px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-medium"
>
  <StopCircle className="h-4 w-4 mr-2" />
  Stop
</motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center px-5 py-2.5 bg-gray-800/60 hover:bg-gray-700/60 text-white rounded-xl transition-all duration-300 border border-white/10 text-sm font-medium"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Exit
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Interviewer Section - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.2)] border border-white/10 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-purple-900/40 p-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg">
                      <Users className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-white font-medium text-sm">AI Interviewer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      animate={{ 
                        boxShadow: isAISpeaking ? ['0 0 10px #22c55e', '0 0 30px #22c55e', '0 0 10px #22c55e'] : 'none'
                      }}
                      transition={{ repeat: isAISpeaking ? Infinity : 0, duration: 1.5 }}
                      className="flex items-center space-x-1 bg-black/40 px-2 py-1 rounded-lg border border-blue-500/30"
                    >
                      <motion.div 
                        animate={{ scale: isAISpeaking ? [1, 1.5, 1] : 1 }}
                        transition={{ repeat: isAISpeaking ? Infinity : 0, duration: 1 }}
                        className={`w-2 h-2 rounded-full ${
                          isAISpeaking ? 'bg-green-400' : 
                          isLipSyncGenerating ? 'bg-yellow-400' :
                          isListening ? 'bg-blue-400' : 'bg-gray-400'
                        }`}
                      />
                      <span className="text-white text-[10px] font-medium">
                        {isLipSyncGenerating ? 'PREPARING' :
                         isAISpeaking ? 'SPEAKING' : 
                         isListening ? 'LISTENING' : 'IDLE'}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* 3D Avatar with lip sync - REMOVED Voice/Body indicators */}
              <div className="relative h-[500px]">
                <AvatarScene
                  ref={avatarRef}
                  isSpeaking={isAISpeaking}
                  isListening={isListening}
                  isThinking={isAnalyzing}
                  onSpeak={async (text) => {
                    console.log('Avatar finished speaking:', text);
                  }}
                  currentText={currentQuestion || currentFeedback || avatarText}
                  emotion={
                    currentEmotion === 'happy' ? 'happy' :
                    currentEmotion === 'thinking' ? 'thinking' :
                    currentEmotion === 'listening' ? 'question' :
                    'neutral'
                  }
                />
                
                {/* Status Overlay - REMOVED Voice and Body indicators */}
              </div>
            </motion.div>

            {/* Current Question */}
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div 
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                >
                  <div className="flex items-start space-x-3">
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className={`p-2 rounded-xl ${
                        questionSource === 'feedback' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' :
                        questionSource === 'follow-up' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' :
                        'bg-gradient-to-r from-blue-500/20 to-cyan-500/20'
                      }`}
                    >
                      <MessageSquare className={`h-5 w-5 ${
                        questionSource === 'feedback' ? 'text-green-400' :
                        questionSource === 'follow-up' ? 'text-purple-400' :
                        'text-blue-400'
                      }`} />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-sm font-semibold ${
                          questionSource === 'feedback' ? 'text-green-300' :
                          questionSource === 'follow-up' ? 'text-purple-300' :
                          'text-blue-300'
                        }`}>
                          {questionSource === 'feedback' ? 'Feedback Question' :
                           questionSource === 'follow-up' ? 'Follow-up Question' : 'Current Question'}
                        </h3>
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                            Q{currentQuestionIndex + 1}/{totalQuestions}
                          </span>
                        </motion.div>
                      </div>
                      <p className="text-white text-sm leading-relaxed">{currentQuestion}</p>
                      {interviewStarted && currentQuestion && !isAnalyzing && !isPaused && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-3 flex items-center text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg w-fit border border-white/10"
                        >
                          <Clock className="h-3 w-3 mr-1.5" />
                          <span>Answer time: {formatTime(answerTime)}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Voice & Behavioral Feedback */}
            <AnimatePresence>
              {(voiceRecommendations.length > 0 || behavioralRecommendations.length > 0) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                  <div className="flex items-start">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="bg-amber-500/20 p-2 rounded-xl mr-3"
                    >
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-amber-300 font-semibold text-sm">Real-time Feedback</h4>
                        <motion.div 
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30"
                        >
                          Live Analysis
                        </motion.div>
                      </div>
                      
                      <div className="space-y-3">
                        {voiceRecommendations.length > 0 && (
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <Ear className="h-3.5 w-3.5 text-blue-400" />
                              <span className="text-xs font-medium text-blue-300">Voice Tips:</span>
                            </div>
                            <ul className="space-y-1">
                              {voiceRecommendations.slice(0, 2).map((tip, index) => (
                                <motion.li 
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="text-xs text-amber-200 flex items-start gap-1.5"
                                >
                                  <span className="text-amber-400 mt-0.5">•</span>
                                  {tip}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                        
                        {behavioralRecommendations.length > 0 && (
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <EyeIcon className="h-3.5 w-3.5 text-green-400" />
                              <span className="text-xs font-medium text-green-300">Body Language Tips:</span>
                            </div>
                            <ul className="space-y-1">
                              {behavioralRecommendations.slice(0, 2).map((tip, index) => (
                                <motion.li 
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 + index * 0.1 }}
                                  className="text-xs text-amber-200 flex items-start gap-1.5"
                                >
                                  <span className="text-amber-400 mt-0.5">•</span>
                                  {tip}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - User Section - Takes 1 column */}
          <div className="space-y-4">
            {/* User Camera */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.2)]"
            >
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg">
                      <Video className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-white font-medium text-sm">Your Camera with Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.span 
                      animate={{ opacity: isVideoEnabled ? [1, 0.5, 1] : 1 }}
                      transition={{ repeat: isVideoEnabled ? Infinity : 0, duration: 2 }}
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        isVideoEnabled ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {isVideoEnabled ? 'Camera ON' : 'Camera OFF'}
                    </motion.span>
                    <motion.span 
                      animate={{ opacity: isMicEnabled ? [1, 0.5, 1] : 1 }}
                      transition={{ repeat: isMicEnabled ? Infinity : 0, duration: 2 }}
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        isMicEnabled ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {isMicEnabled ? 'Mic ON' : 'Mic OFF'}
                    </motion.span>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-gray-900 h-[320px]">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <canvas 
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
                
               
                
                {/* Camera Controls */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleVideo}
                    className={`p-2.5 rounded-full transition-all duration-300 ${
                      isVideoEnabled 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg'
                    }`}
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMicrophone}
                    className={`p-2.5 rounded-full transition-all duration-300 ${
                      isMicEnabled 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg'
                    }`}
                  >
                    {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={initializeMedia}
                    className="p-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Answer Input */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
            >
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-400" />
                Your Response
              </h3>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isListening ? stopListening : startListening}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                        isListening 
                          ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg'
                      }`}
                      disabled={isAISpeaking || isLipSyncGenerating}
                    >
                      {isListening ? (
                        <>
                          <Square className="h-3.5 w-3.5" />
                          <span>Stop Recording</span>
                        </>
                      ) : (
                        <>
                          <Mic className="h-3.5 w-3.5" />
                          <span>Start Speaking</span>
                        </>
                      )}
                    </motion.button>
                    
                    {isListening && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center space-x-2"
                      >
                        <div className="flex items-center space-x-1 text-red-400">
                          <motion.div 
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-2 h-2 bg-red-500 rounded-full"
                          />
                          <span className="text-[10px] font-medium">Recording..</span>
                        </div>
                        {transcript && (
                          <div className="text-[10px] text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
                            {transcript.split(' ').length} words
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setCurrentAnswer(''); setTranscript(''); }}
                    className="flex items-center space-x-1 text-[10px] text-gray-400 hover:text-white bg-white/5 px-2 py-1.5 rounded-lg transition-colors border border-white/10"
                    disabled={isAISpeaking || isLipSyncGenerating}
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Clear</span>
                  </motion.button>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="w-full h-28 bg-transparent border-none outline-none resize-none text-sm text-white placeholder-gray-500"
                    placeholder={isListening ? "Listening... Speak now" : "Type your answer here or use microphone..."}
                    disabled={isAISpeaking || isLipSyncGenerating}
                  />
                  <div className="flex justify-between items-center mt-1.5">
                    <div className="text-[10px] text-gray-400">
                      {currentAnswer.length} characters
                    </div>
                    {isListening && transcript && (
                      <div className="text-[10px] text-green-400 flex items-center">
                        <span className="relative flex h-2 w-2 mr-1">
                          <motion.span 
                            animate={{ scale: [1, 2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                          />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live transcription active
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: !currentAnswer.trim() || isAnalyzing || isAISpeaking || isLipSyncGenerating ? 1 : 1.02 }}
                whileTap={{ scale: !currentAnswer.trim() || isAnalyzing || isAISpeaking || isLipSyncGenerating ? 1 : 0.98 }}
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isAnalyzing || isAISpeaking || isLipSyncGenerating}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  !currentAnswer.trim() || isAnalyzing || isAISpeaking || isLipSyncGenerating
                    ? 'bg-gray-800/60 cursor-not-allowed text-gray-500 border border-white/5'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isAnalyzing ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block"
                  >
                    <Loader2 className="h-3.5 w-3.5 mr-2 inline" />
                  </motion.div>
                ) : (
                  <>
                    Submit Answer
                    <ArrowRight className="h-3.5 w-3.5 ml-2 inline" />
                  </>
                )}
                {isAnalyzing && ' Analyzing...'}
              </motion.button>
              
              {/* Lip-sync status indicator */}
              <AnimatePresence>
                {isLipSyncGenerating && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 p-2 bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-amber-500/30 rounded-xl flex items-center gap-2"
                  >
                    <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
                    <span className="text-xs text-amber-300">Preparing  response...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}