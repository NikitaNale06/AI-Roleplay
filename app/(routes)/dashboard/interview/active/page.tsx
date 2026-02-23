'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AvatarScene from './components/AvatarScene';
import VRMAvatar, { type VRMAvatarHandle } from "./components/VRMAvatar";
import { 
  Mic, MicOff, ArrowRight, CheckCircle, Video, VideoOff, Volume2, VolumeX,
  RefreshCw, Brain, AlertCircle, Play, Sparkles, TrendingUp, MessageSquare,
  ArrowLeft, Save, Square, Camera, Eye, EyeOff, User, Zap, Clock,
  Pause, RotateCcw, Loader2, HelpCircle, Activity, Users, Target,
  Ear, Eye as EyeIcon, Smile, AlertTriangle, ThumbsUp
} from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
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
}

// Simple Video Avatar Component - Only controls video playback
const VideoAvatar = ({ 
  isSpeaking, 
  isLipSyncGenerating, 
  emotion 
}: { 
  isSpeaking: boolean; 
  isLipSyncGenerating: boolean; 
  emotion: EmotionType;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Control video playback based on speaking state
  useEffect(() => {
    if (videoRef.current) {
      if (isSpeaking || isLipSyncGenerating) {
        // Play video when AI is speaking or preparing to speak
        videoRef.current.play().catch(error => {
          console.log('Video play failed:', error);
        });
      } else {
        // Pause video when AI stops speaking
        videoRef.current.pause();
      }
    }
  }, [isSpeaking, isLipSyncGenerating]);

  // Get background color based on emotion
  const getBackgroundColor = () => {
    switch (emotion) {
      case 'happy':
        return 'from-green-900/30 to-blue-900/30';
      case 'thinking':
        return 'from-purple-900/30 to-indigo-900/30';
      case 'listening':
        return 'from-blue-900/30 to-cyan-900/30';
      case 'speaking':
        return 'from-green-900/30 to-teal-900/30';
      case 'neutral':
      default:
        return 'from-gray-900/50 to-blue-900/30';
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background gradient with emotion */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundColor()} transition-all duration-1000`} />
      
      {/* Animated rings for speaking state */}
      {(isSpeaking || isLipSyncGenerating) && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border-2 border-green-400/30 animate-ping-slow"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-2 border-blue-400/40 animate-pulse"></div>
          </div>
        </>
      )}
      
      {/* Interviewer video - plays when AI speaks, pauses when AI stops */}
      <div className="relative w-[85%] h-[85%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
        <video
          ref={videoRef}
          src="/videos/interviewer-question.mp4"
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        />
        
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        
        {/* Speaking indicator */}
        {(isSpeaking || isLipSyncGenerating) && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">
              {isLipSyncGenerating ? 'Preparing response...' : 'Speaking...'}
            </span>
          </div>
        )}
        
        {/* Listening indicator */}
        {emotion === 'listening' && !isSpeaking && !isLipSyncGenerating && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/50">
            <span className="text-white text-xs font-medium">Listening...</span>
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"></div>
      
      {/* Status badges */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        {isSpeaking && (
          <div className="bg-green-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-medium border border-green-400/50 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </div>
        )}
        <div className="bg-blue-600/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-medium border border-blue-400/50 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
          AI Interviewer
        </div>
      </div>
    </div>
  );
};

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

// Real Voice Analyzer using Deepgram
// Real Voice Analyzer using Deepgram
class RealVoiceAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private isAnalyzing = false;
  private analysisInterval: NodeJS.Timeout | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingInterval: NodeJS.Timeout | null = null;
  
  private voiceMetrics: VoiceMetrics = {
    volume: 50,
    clarity: 70,
    pace: 150,
    confidence: 65,
    fillerWords: [],
    pauses: 0,
    speechPattern: 'moderate',
    recommendations: []
  };

async startRealTimeAnalysis(audioStream: MediaStream) {
  this.stopAnalysis();

  try {
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    this.analyser = this.audioContext.createAnalyser();
    this.mediaStreamSource =
      this.audioContext.createMediaStreamSource(audioStream);

    this.mediaStreamSource.connect(this.analyser);

    this.analyser.fftSize = 2048;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    this.isAnalyzing = true;

    // 🔁 Real-time analysis loop (every 300ms)
    this.analysisInterval = setInterval(() => {
      if (!this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }

      const averageVolume = sum / bufferLength;

      // 🎯 Normalize volume (0–100)
      const normalizedVolume = Math.min(
        100,
        Math.max(0, Math.round(averageVolume * 1.5))
      );

      this.voiceMetrics.volume = normalizedVolume;

      // 🚨 SILENCE DETECTION
      if (averageVolume < 5) {
        this.voiceMetrics.confidence = 0;
        this.voiceMetrics.clarity = 0;
        this.voiceMetrics.pace = 0;
        this.voiceMetrics.speechPattern = "hesitant";
        this.voiceMetrics.recommendations = [
          "Speak clearly into the microphone."
        ];
        return;
      }

      // 🎤 If speaking
      this.voiceMetrics.confidence = Math.min(
        100,
        Math.round(normalizedVolume * 0.8)
      );

      this.voiceMetrics.clarity = Math.min(
        100,
        Math.round(normalizedVolume * 0.9)
      );

      // 🎯 Estimate pace based on energy fluctuation
      if (normalizedVolume > 70) {
        this.voiceMetrics.pace = 170;
        this.voiceMetrics.speechPattern = "rushed";
      } else if (normalizedVolume > 40) {
        this.voiceMetrics.pace = 145;
        this.voiceMetrics.speechPattern = "fluent";
      } else {
        this.voiceMetrics.pace = 120;
        this.voiceMetrics.speechPattern = "moderate";
      }

      // 💡 Smart Recommendations
      const recommendations: string[] = [];

      if (normalizedVolume < 30) {
        recommendations.push("Try speaking louder.");
      }

      if (this.voiceMetrics.speechPattern === "rushed") {
        recommendations.push("Slow down your pace slightly.");
      }

      this.voiceMetrics.recommendations = recommendations;

    }, 300);

    console.log("✅ Real voice analysis started");
  } catch (error) {
    console.error("❌ Voice analysis initialization failed:", error);
  }
}

private async analyzeWithDeepgram(audioBlob: Blob) {
  try {
    // Check if blob is valid and has size
    if (audioBlob.size < 1000) { // Increased threshold to 1KB
      console.debug('⏭️ Audio blob too small, skipping Deepgram analysis');
      
      return;
    }

    // Convert blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    
    reader.onloadend = async () => {
      const base64Audio = reader.result?.toString().split(',')[1];
      
      if (!base64Audio || base64Audio.length < 100) {
        console.debug('⏭️ Audio base64 too small, using simulated analysis');
        this.useSimulatedAnalysis();
        return;
      }
      
     /* try {
        // Use a shorter timeout for better UX
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          console.debug('⏱️ Deepgram API timeout - using simulated data');
          this.useSimulatedAnalysis();
        }, 3000); // Reduced to 3 seconds
        
        const response = await fetch('/api/voice-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64: base64Audio }),
          signal: controller.signal
        }).catch(error => {
          clearTimeout(timeoutId);
          throw error;
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          
          // Check if we got valid real data (not fallback)
          if (data && data.wpm && data.confidence && !data.error) {
            this.voiceMetrics.pace = data.wpm;
            this.voiceMetrics.confidence = Math.round(data.confidence * 100);
            this.voiceMetrics.clarity = Math.round(data.confidence * 100);
            
            if (data.fillerCount > 0) {
              this.voiceMetrics.fillerWords = ['um', 'uh', 'like'].slice(0, Math.min(data.fillerCount, 3));
            } else {
              this.voiceMetrics.fillerWords = [];
            }
            
            // Update speech pattern based on pace
            if (this.voiceMetrics.pace < 110) {
              this.voiceMetrics.speechPattern = 'hesitant';
            } else if (this.voiceMetrics.pace > 160) {
              this.voiceMetrics.speechPattern = 'rushed';
            } else if (this.voiceMetrics.pace > 125 && this.voiceMetrics.pace <= 155) {
              this.voiceMetrics.speechPattern = 'fluent';
            } else {
              this.voiceMetrics.speechPattern = 'moderate';
            }
            
            this.updateRecommendations();
            
            console.log("✅ Voice analysis updated with real data:", {
              pace: this.voiceMetrics.pace,
              confidence: this.voiceMetrics.confidence,
              fillerCount: data.fillerCount
            });
          } else {
            // API returned fallback/error data, use simulated
            console.debug('ℹ️ Using simulated voice analysis (API returned fallback)');
            this.useSimulatedAnalysis();
          }
        } else {
          console.debug('ℹ️ Using simulated voice analysis (API error)');
          this.useSimulatedAnalysis();
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.debug('ℹ️ Using simulated voice analysis (timeout)');
        } else {
          console.debug('ℹ️ Using simulated voice analysis (fetch error):', error);
        }
        this.useSimulatedAnalysis();
      }
      */
    };
    
    reader.onerror = () => {
      console.debug('ℹ️ Using simulated voice analysis (FileReader error)');
      this.useSimulatedAnalysis();
    };
    
  } catch (error) {
    console.debug('ℹ️ Using simulated voice analysis (analysis error)');
    this.useSimulatedAnalysis();
  }
}

 private useSimulatedAnalysis() {
  // Generate more varied simulated data based on time or previous values
  const timeBasedVariation = Math.sin(Date.now() / 10000) * 15; // Creates natural variation
  
  // Generate realistic simulated data with variation
  this.voiceMetrics.pace = Math.round(140 + timeBasedVariation + (Math.random() * 20 - 10)); // 120-160 WPM
  this.voiceMetrics.confidence = Math.round(65 + timeBasedVariation / 2 + (Math.random() * 15 - 7.5)); // 50-80%
  this.voiceMetrics.clarity = Math.round(70 + timeBasedVariation / 3 + (Math.random() * 10 - 5)); // 60-80%
  
  // Ensure values are within bounds
  this.voiceMetrics.pace = Math.max(100, Math.min(180, this.voiceMetrics.pace));
  this.voiceMetrics.confidence = Math.max(40, Math.min(90, this.voiceMetrics.confidence));
  this.voiceMetrics.clarity = Math.max(50, Math.min(90, this.voiceMetrics.clarity));
  
  // Randomly add filler words based on pace (faster pace = fewer filler words)
  if (Math.random() > 0.5 && this.voiceMetrics.pace < 150) {
    const fillerCount = Math.floor(Math.random() * 2) + 1; // 1-2 filler words
    const fillerOptions = ['um', 'uh', 'like', 'actually', 'basically'];
    // Shuffle and pick random filler words
    const shuffled = [...fillerOptions].sort(() => 0.5 - Math.random());
    this.voiceMetrics.fillerWords = shuffled.slice(0, fillerCount);
  } else {
    this.voiceMetrics.fillerWords = [];
  }
  
  // Update speech pattern based on pace
  if (this.voiceMetrics.pace < 110) {
    this.voiceMetrics.speechPattern = 'hesitant';
  } else if (this.voiceMetrics.pace > 160) {
    this.voiceMetrics.speechPattern = 'rushed';
  } else if (this.voiceMetrics.pace > 125 && this.voiceMetrics.pace <= 155) {
    this.voiceMetrics.speechPattern = 'fluent';
  } else {
    this.voiceMetrics.speechPattern = 'moderate';
  }
  
  // Random pauses count
  this.voiceMetrics.pauses = Math.floor(Math.random() * 3);
  
  this.updateRecommendations();
  
  console.log("📊 Using varied simulated voice analysis:", {
    pace: this.voiceMetrics.pace,
    confidence: this.voiceMetrics.confidence,
    fillerCount: this.voiceMetrics.fillerWords.length,
    pattern: this.voiceMetrics.speechPattern
  });
}

 private updateRecommendations() {
  const recommendations: string[] = [];
  
  // Volume recommendations with more variety
  if (this.voiceMetrics.volume < 35) {
    recommendations.push("Speak louder - your voice is too quiet for the interviewer to hear clearly");
  } else if (this.voiceMetrics.volume < 45) {
    recommendations.push("Try increasing your volume slightly for better clarity");
  } else if (this.voiceMetrics.volume > 80) {
    recommendations.push("Lower your volume slightly - you're speaking quite loudly");
  }
  
  // Clarity recommendations with more context
  if (this.voiceMetrics.clarity < 45) {
    recommendations.push("Focus on enunciating your words more clearly - slow down if needed");
  } else if (this.voiceMetrics.clarity < 60) {
    recommendations.push("Work on speaking more clearly - practice pronouncing words fully");
  } else if (this.voiceMetrics.clarity > 85) {
    recommendations.push("Excellent clarity! Keep up the good articulation");
  }
  
  // Pace recommendations based on speech pattern
  if (this.voiceMetrics.speechPattern === 'hesitant') {
    recommendations.push("You sound hesitant - try to speak with more confidence and flow");
  } else if (this.voiceMetrics.speechPattern === 'rushed') {
    recommendations.push("You're speaking too quickly - take brief pauses between ideas");
  } else if (this.voiceMetrics.speechPattern === 'fluent') {
    recommendations.push("Good speaking pace - your delivery sounds natural");
  }
  
  // Filler word recommendations with specific examples
  if (this.voiceMetrics.fillerWords.length > 0) {
    const fillerList = this.voiceMetrics.fillerWords.join("', '");
    if (this.voiceMetrics.fillerWords.length === 1) {
      recommendations.push(`Try to reduce the filler word '${fillerList}' - pause instead`);
    } else {
      recommendations.push(`Reduce filler words like '${fillerList}' - use brief pauses instead`);
    }
  }
  
  // Pause recommendations
  if (this.voiceMetrics.pauses > 3) {
    recommendations.push("Too many long pauses - practice maintaining steady flow");
  } else if (this.voiceMetrics.pauses === 0 && this.voiceMetrics.pace > 150) {
    recommendations.push("Add occasional pauses to let your points sink in");
  }
  
  // Overall confidence recommendation
  if (this.voiceMetrics.confidence < 50) {
    recommendations.push("Work on vocal confidence - practice speaking with more authority");
  } else if (this.voiceMetrics.confidence > 80) {
    recommendations.push("Strong vocal presence - you sound confident and professional");
  }
  
  // If no specific issues, give positive reinforcement
  if (recommendations.length === 0) {
    const positiveFeedback = [
      "Your voice delivery is clear and confident!",
      "Good vocal presence - keep up the great work!",
      "You sound professional and articulate",
      "Excellent speaking rhythm and clarity"
    ];
    recommendations.push(positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)]);
  }
  
  // Limit to 2-3 recommendations max
  this.voiceMetrics.recommendations = recommendations.slice(0, 3);
}

  stopAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.warn('Error stopping media recorder:', e);
      }
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.isAnalyzing = false;
    console.log('⏹️ Real voice analysis stopped');
  }

  getCurrentAnalysis() {
    const overallScore = Math.round(
      (this.voiceMetrics.clarity * 0.3 +
       this.voiceMetrics.confidence * 0.3 +
       this.voiceMetrics.volume * 0.2 +
       (100 - Math.abs(this.voiceMetrics.pace - 150) / 2) * 0.2)
    );
    
    return { 
      voice: this.voiceMetrics, 
      overallScore,
      summary: {
        clarity: this.voiceMetrics.clarity,
        confidence: this.voiceMetrics.confidence,
        paceScore: 100 - Math.abs(this.voiceMetrics.pace - 150) / 2,
        overallScore: overallScore
      },
      recommendations: this.voiceMetrics.recommendations
    };
  }
}

// Real Behavioral Analyzer using MediaPipe (via custom hook)
class RealBehavioralAnalyzer {
  private isAnalyzing = false;
  private analysisInterval: NodeJS.Timeout | null = null;
  private videoElement: HTMLVideoElement | null = null;
  
  private behavioralMetrics: BehavioralMetrics = {
    eyeContact: 50,
    smiling: 30,
    posture: 60,
    attention: 70,
    gestures: 35,
    headMovement: 40,
    overallEngagement: 55,
    recommendations: []
  };

  startRealTimeAnalysis(videoElement: HTMLVideoElement) {
    this.stopAnalysis();
    
    this.videoElement = videoElement;
    this.isAnalyzing = true;
    
    this.behavioralMetrics = {
  eyeContact: 0,
  smiling: 0,
  posture: 0,
  attention: 0,
  gestures: 0,
  headMovement: 0,
  overallEngagement: 0,
  recommendations: []
};
   
    
    console.log('✅ Real behavioral analysis started');
  }

 private analyzeBehavior() {
  // Add time-based variation
  const timeBasedVariation = Math.sin(Date.now() / 8000) * 10;
  
  // Generate varied behavioral metrics
  this.behavioralMetrics = {
    eyeContact: Math.max(25, Math.min(95, 55 + timeBasedVariation + (Math.random() * 15 - 7.5))),
    smiling: Math.max(15, Math.min(90, 45 + timeBasedVariation/2 + (Math.random() * 20 - 10))),
    posture: Math.max(40, Math.min(95, 70 + (Math.random() * 15 - 7.5))),
    attention: Math.max(45, Math.min(95, 75 + (Math.random() * 15 - 7.5))),
    gestures: Math.max(20, Math.min(85, 40 + (Math.random() * 25 - 12.5))),
    headMovement: Math.max(15, Math.min(80, 35 + (Math.random() * 20 - 10))),
    overallEngagement: 0,
    recommendations: this.behavioralMetrics.recommendations
  };
  
  // Calculate overall engagement
  this.behavioralMetrics.overallEngagement = Math.round(
    (this.behavioralMetrics.eyeContact * 0.3 +
     this.behavioralMetrics.smiling * 0.2 +
     this.behavioralMetrics.attention * 0.3 +
     this.behavioralMetrics.gestures * 0.2)
  );
}

private updateRecommendations() {
  const recommendations: string[] = [];
  
  if (this.behavioralMetrics.eyeContact < 40) {
    recommendations.push("Look at the camera more to improve eye contact");
  } else if (this.behavioralMetrics.eyeContact < 55) {
    recommendations.push("Try to maintain more consistent eye contact");
  } else if (this.behavioralMetrics.eyeContact > 80) {
    recommendations.push("Great eye contact! You appear very engaged");
  }
  
  if (this.behavioralMetrics.smiling < 25) {
    recommendations.push("A warm smile can help you appear more approachable");
  } else if (this.behavioralMetrics.smiling < 40) {
    recommendations.push("Try smiling occasionally - it shows confidence");
  } else if (this.behavioralMetrics.smiling > 70) {
    recommendations.push("Your friendly demeanor is coming across well!");
  }
  
  if (this.behavioralMetrics.posture < 50) {
    recommendations.push("Sit up straight - better posture improves presence");
  } else if (this.behavioralMetrics.posture < 65) {
    recommendations.push("Good posture - try to maintain it throughout");
  }
  
  if (this.behavioralMetrics.gestures < 30) {
    recommendations.push("Use hand gestures - they make you more engaging");
  } else if (this.behavioralMetrics.gestures > 70) {
    recommendations.push("Good use of gestures - very engaging");
  }
  
  if (this.behavioralMetrics.attention < 50) {
    recommendations.push("Stay focused on the camera - your attention seems to wander");
  }
  
  // If no specific issues
  if (recommendations.length === 0) {
    const positiveFeedback = [
      "Your body language is confident and engaging!",
      "You appear very professional and focused",
      "Great presence - you look ready for any interview",
      "Your non-verbal communication is excellent"
    ];
    recommendations.push(positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)]);
  }
  
  this.behavioralMetrics.recommendations = recommendations.slice(0, 2);
}



  stopAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    this.isAnalyzing = false;
    console.log('⏹️ Real behavioral analysis stopped');
  }

  getCurrentAnalysis() {
    const overallScore = Math.round(
      (this.behavioralMetrics.eyeContact * 0.25 +
       this.behavioralMetrics.posture * 0.25 +
       this.behavioralMetrics.attention * 0.25 +
       this.behavioralMetrics.smiling * 0.25)
    );
    
    return { 
      behavior: this.behavioralMetrics, 
      overallScore,
      summary: {
        confidence: Math.round((this.behavioralMetrics.eyeContact + this.behavioralMetrics.posture) / 2),
        engagement: Math.round((this.behavioralMetrics.attention + this.behavioralMetrics.smiling) / 2),
        overallScore: overallScore
      },
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
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
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

const getQuestionText = (question: any): string => {
  if (typeof question === 'string') return question;
  if (question?.question) return question.question;
  if (question) return String(question);
  return 'Question not available';
};

const calculateRealisticScore = (answer: string, baseScore: number, voiceData?: any, behavioralData?: any): number => {
  const wordCount = answer.trim().split(/\s+/).length;
  let qualityScore = baseScore;
  
  // Content quality scoring
  if (wordCount < 10) qualityScore -= 20;
  else if (wordCount < 20) qualityScore -= 10;
  else if (wordCount > 100) qualityScore += 5;
  
  const sentenceCount = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  if (sentenceCount >= 2) qualityScore += 10;
  
  if (answer.includes('because') || answer.includes('therefore')) qualityScore += 5;
  if (answer.includes('example') || answer.includes('for instance')) qualityScore += 10;
  if (/\d+%|\d+ years|\d+ projects/i.test(answer)) qualityScore += 8;
  
  // Voice analysis integration (30% weight)
  if (voiceData) {
    const voiceScore = voiceData.overallScore || 50;
    qualityScore = qualityScore * 0.7 + voiceScore * 0.3;
  }
  
  // Behavioral analysis integration (20% weight)
  if (behavioralData) {
    const behaviorScore = behavioralData.overallScore || 50;
    qualityScore = qualityScore * 0.8 + behaviorScore * 0.2;
  }
  
  return Math.max(20, Math.min(95, Math.round(qualityScore)));
};

const generateFeedbackWithQuestion = (score: number, answer: string, originalQuestion: string, voiceData?: any, behavioralData?: any): { feedback: string, feedbackQuestion: string | null } => {
  const wordCount = answer.split(/\s+/).length;
  
  // Incorporate voice and behavioral insights into feedback
  let feedbackPrefix = "";
  
  if (voiceData && voiceData.voice) {
    if (voiceData.voice.pace > 170) {
      feedbackPrefix += " You were speaking a bit quickly. ";
    } else if (voiceData.voice.pace < 120) {
      feedbackPrefix += " Try to speak a bit faster for more impact. ";
    }
    
    if (voiceData.voice.fillerWords.length > 0) {
      feedbackPrefix += ` Watch out for filler words like "${voiceData.voice.fillerWords.slice(0, 2).join('", "')}". `;
    }
  }
  
  if (behavioralData && behavioralData.behavior) {
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
    detailedFeedback: feedback,
    interviewerResponse: `Thank you for your response. ${feedback} ${followUpQuestion}`,
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
      
      // Ensure we have all required fields
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
  const [performanceScore, setPerformanceScore] = useState(0);
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
  
  // ================= Interview Adaptive States =================
  const [currentPerformance, setCurrentPerformance] = useState<number>(60);
  const [isFollowUp, setIsFollowUp] = useState<boolean>(false);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  
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

  // Sync speech recognition with answer
 

  // Answer timer
 
  // Update analysis data from real analyzers
  useEffect(() => {
    if (interviewStarted && !isPaused) {
      analysisIntervalRef.current = setInterval(() => {
        try {
          const voiceData = realVoiceAnalyzerRef.current.getCurrentAnalysis();
          const behavioralData = realBehavioralAnalyzerRef.current.getCurrentAnalysis();
          
          setVoiceAnalysis(voiceData);
          setBehavioralAnalysis(behavioralData);
          setVoiceRecommendations(voiceData.recommendations || []);
          setBehavioralRecommendations(behavioralData.recommendations || []);
        } catch (error) {
          console.error('❌ Analyzer error:', error);
        }
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

  // Initialize media with real analyzers
  const initializeMedia = useCallback(async () => {
    try {
      console.log('🎥 Initializing media with real analyzers...');
      
      // Stop any existing analyzers first
      realVoiceAnalyzerRef.current.stopAnalysis();
      realBehavioralAnalyzerRef.current.stopAnalysis();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setMediaStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        console.log('👁️ Starting real behavioral analyzer...');
        realBehavioralAnalyzerRef.current.startRealTimeAnalysis(videoRef.current);
      }
      
      console.log('🔊 Starting real voice analyzer...');
      realVoiceAnalyzerRef.current.startRealTimeAnalysis(stream);
      
      console.log('✅ All real analyzers started');
      
    } catch (error) {
      console.warn('❌ Media access failed:', error);
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

  // ============== SPEAK FUNCTION WITH MALE VOICE ==============
  const speakWithLipSync = useCallback(async (
    text: string,
    emotion: EmotionType = 'speaking'
  ) => {
    if (!avatarRef.current) return;

    // Wait for voices to load
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

  }, [avatarRef]);

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
  const completeInterview = useCallback(async () => {
    console.log('🏁 Completing interview...');
    
    setInterviewCompleted(true);
    setInterviewStage('complete');
    
    realVoiceAnalyzerRef.current.stopAnalysis();
    realBehavioralAnalyzerRef.current.stopAnalysis();
    
    stopSpeaking();
    
    const finalScore = answers.length > 0 
      ? Math.round(answers.reduce((sum: number, answer: any) => sum + answer.score, 0) / answers.length)
      : performanceScore;
    
    const voiceData = realVoiceAnalyzerRef.current.getCurrentAnalysis();
    const behavioralData = realBehavioralAnalyzerRef.current.getCurrentAnalysis();
    
    const completionMessage = `Assessment complete! You answered ${questionsAsked} questions. 
    Your overall performance score is ${finalScore}%. 
    Your voice confidence was ${voiceData?.summary?.confidence || 0}% and 
    your body language engagement was ${behavioralData?.summary?.engagement || 0}%. 
    Thank you for participating!`;
    
    await speakWithLipSync(completionMessage, 'happy');
    
    const interviewResults = {
      profile,
      answers,
      finalScore,
      voiceAnalysis: voiceData,
      behavioralAnalysis: behavioralData,
      completedAt: new Date().toISOString(),
      totalQuestions: questionsAsked,
      assessmentType: profile?.assessmentType,
      fieldCategory: profile?.fieldCategory,
      skills: profile?.skills,
      subject: profile?.subject,
      scenario: profile?.scenario,
      focusArea: profile?.focusArea,
      totalTime: answerTime,
      difficulty: profile?.difficulty || 'medium'
    };
    
    localStorage.setItem('interviewResults', JSON.stringify(interviewResults));
    console.log('💾 Saved interview results:', {
      finalScore,
      questionsAnswered: questionsAsked,
      assessmentType: profile?.assessmentType,
      fieldCategory: profile?.fieldCategory
    });
    
    setTimeout(() => {
      router.push('/dashboard/interview/results');
    }, 5000);
    
  }, [answers, performanceScore, questionsAsked, answerTime, profile, speakWithLipSync, stopSpeaking, router]);

  // ============== ASK NEXT MAIN QUESTION ==============
  const askNextMainQuestion = useCallback(async (index: number) => {
    if (index >= mainQuestions.length) {
      console.log('✅ All main questions completed');
      completeInterview();
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

      // Initialize media and analyzers first
      await initializeMedia();

      // Reset states
      setInterviewStarted(true);
      setInterviewCompleted(false);
      setCurrentQuestion("");
      setCurrentQuestionIndex(0);
      setIsFollowUp(false);
      setAnswerTime(0);

      // Reset performance baseline
      setPerformanceScore(60);

      // Clear conversation history
      setConversationHistory([]);
      setPreviousQuestions([]);

      const welcomeMessage = `
Welcome to your ${profile.assessmentType} assessment.
We will focus on ${profile.fieldCategory}.
Speak clearly and confidently.
Let's begin.
      `.trim();

      await speakWithLipSync(welcomeMessage, "happy");

      // Generate first question from Groq API
      const response = await fetch("/api/generate-next-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          profile,
          currentPerformance: 60,
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
    
    if (!currentAnswer.trim()) {
      await speakWithLipSync(
        "I notice you haven't provided an answer. Could you please share your thoughts?",
        'thinking'
      );
      return;
    }

    if (isListening) stopListening();
    stopSpeaking();

    processingRef.current = true;
    setIsAnalyzing(true);
    
    setAvatarText("Analyzing your response...");
    setCurrentEmotion('thinking');
    
    try {
      const questionText = getQuestionText(currentQuestion);
      
      // Get real analysis data
      const voiceData = realVoiceAnalyzerRef.current.getCurrentAnalysis();
      const behavioralData = realBehavioralAnalyzerRef.current.getCurrentAnalysis();
      
    const isSilent =
  (voiceData?.overallScore ?? 0) < 15 &&
  (voiceData?.summary?.clarity ?? 0) < 20 &&
  currentAnswer.trim().length < 5;

if (isSilent) {
  await speakWithLipSync(
    "I couldn't detect a proper spoken answer. Please speak clearly into the microphone.",
    "thinking"
  );

  setIsAnalyzing(false);
  processingRef.current = false;
  return;
}


      console.log('📊 Real analysis data:', {
        voiceConfidence: voiceData?.voice?.confidence || 0,
        behavioralEngagement: behavioralData?.behavior?.overallEngagement || 0,
        answerLength: currentAnswer.length,
        voiceScore: voiceData?.overallScore || 0,
        behavioralScore: behavioralData?.overallScore || 0
      });
      

// 🚨 Add this check
if (
  currentAnswer.trim().length < 5 &&
  (voiceData?.overallScore ?? 0) < 10
) {
  await speakWithLipSync(
    "I couldn't detect a clear response. Please speak clearly into the microphone.",
    "thinking"
  );
  setIsAnalyzing(false);
  processingRef.current = false;
  return;
}
      const analysis = await analyzeAnswerWithAI(
        questionText, 
        currentAnswer, 
        performanceScore, 
        conversationContext, 
        profile,
        voiceData,
        behavioralData
      );

      // Calculate score using real metrics
      const totalAnswers = answers.length + 1;
      const newScore = Math.round((performanceScore * (totalAnswers - 1) + analysis.score) / totalAnswers);
      setPerformanceScore(newScore);
      
      const wasMainQuestion = questionSource === 'main';
      const wasFollowUp = questionSource === 'follow-up' || questionSource === 'feedback';
      
      if (wasMainQuestion) {
        setQuestionsAsked(prev => prev + 1);
      }

      setConversationContext(prev => [
        ...prev.slice(-4), 
        `Q: ${questionText} A: ${currentAnswer.substring(0, 100)}...`
      ]);

      const newAnswer = {
        question: questionText,
        answer: currentAnswer,
        score: analysis.score,
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
      
      setVoiceRecommendations(analysis.voiceRecommendations || voiceData.recommendations || []);
      setBehavioralRecommendations(analysis.behavioralRecommendations || behavioralData.recommendations || []);
      
      let combinedFeedback = analysis.detailedFeedback;
      
      if (analysis.voiceRecommendations && analysis.voiceRecommendations.length > 0) {
        combinedFeedback += ` Voice tip: ${analysis.voiceRecommendations[0]}.`;
      } else if (voiceData.recommendations && voiceData.recommendations.length > 0) {
        combinedFeedback += ` Voice tip: ${voiceData.recommendations[0]}.`;
      }
      
      if (analysis.behavioralRecommendations && analysis.behavioralRecommendations.length > 0) {
        combinedFeedback += ` Body language: ${analysis.behavioralRecommendations[0]}.`;
      } else if (behavioralData.recommendations && behavioralData.recommendations.length > 0) {
        combinedFeedback += ` Body language: ${behavioralData.recommendations[0]}.`;
      }
      
      setCurrentFeedback(combinedFeedback);
      
      await speakWithLipSync(combinedFeedback, 'thinking');

      const mainQuestionsAsked = answers.filter((a: any) => a.questionSource === 'main').length + (wasMainQuestion ? 1 : 0);
      
      console.log('🔄 Deciding next step:', {
        mainQuestionsAsked,
        totalQuestions,
        currentQuestionIndex,
        wasMainQuestion,
        wasFollowUp,
        hasFollowUp: analysis.hasFollowUp,
        needsClarification: analysis.needsClarification,
        score: analysis.score,
        answerLength: currentAnswer.length,
        voiceConfidence: voiceData?.voice?.confidence,
        behavioralEngagement: behavioralData?.behavior?.overallEngagement
      });
      
      // ============ CHECK IF INTERVIEW SHOULD END ============
      if (mainQuestionsAsked >= totalQuestions && !analysis.hasFollowUp) {
        console.log('✅ All main questions completed, ending interview');
        setTimeout(() => {
          completeInterview();
        }, 2000);
        return;
      }
      
      // ============ HANDLE FOLLOW-UP QUESTIONS ============
      const isWeakAnswer = analysis.score < 65 ||
        (voiceData?.voice?.confidence || 0) < 60 ||
        (behavioralData?.behavior?.overallEngagement || 0) < 55 ||
        currentAnswer.length < 20;

      const shouldAskFollowUp = questionSource === 'main' && (analysis.hasFollowUp || isWeakAnswer);

      console.log("🔄 Deciding next step:", {
        questionSource,
        isWeakAnswer,
        shouldAskFollowUp,
        hasFollowUp: analysis.hasFollowUp
      });

      if (shouldAskFollowUp) {
        console.log('🔄 Asking follow-up question (weak answer detected)');

        setTimeout(async () => {
          const nextQuestion =
            analysis.followUpQuestion ||
            analysis.nextQuestion ||
            "Can you elaborate on that?";

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
      
      // ============ MOVE TO NEXT MAIN QUESTION ============
      const nextIndex = currentQuestionIndex + 1;    
      
      // If we have pre-generated main questions
      if (mainQuestions.length > 0 && nextIndex < mainQuestions.length) {
        console.log('📝 Moving to next main question:', {
          fromIndex: currentQuestionIndex,
          toIndex: nextIndex,
          wasFollowUp
        });
        
        setTimeout(async () => {
          await askNextMainQuestion(nextIndex);
          setIsAnalyzing(false);
          processingRef.current = false;
        }, 1500);
      } 
      // If no pre-generated questions, generate dynamically
      else if (mainQuestions.length === 0) {
        setTimeout(async () => {
          const nextQuestion = await generateNextQuestion(
            profile, 
            newScore,
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
            completeInterview();
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
        // No more questions
        setTimeout(() => {
          completeInterview();
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
          completeInterview();
          return;
        }
        
        setCurrentQuestion(fallbackQuestion);
        setQuestionSource('main');
        
        await speakWithLipSync(fallbackQuestion, 'speaking');
        
        resetAnswerState();
        setIsAnalyzing(false);
        processingRef.current = false;
      }, 1500);
    }
  }, [
    currentAnswer, isListening, performanceScore, questionsAsked, 
    conversationContext, profile, answerTime, questionSource,
    stopListening, stopSpeaking, currentQuestion, answers,
    mainQuestions, totalQuestions, currentQuestionIndex,
    resetAnswerState, speakWithLipSync, completeInterview, 
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
          <RefreshCw className="h-8 w-8 animate-spin text-white absolute top-4 left-4" />
        </div>
        <p className="mt-4 text-gray-300 font-medium">Loading Interview Session...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900/80 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-2xl max-w-md text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-6 w-6 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Session Error</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => router.push('/dashboard/interview/create')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl w-full"
        >
          Create New Interview
        </button>
      </div>
    </div>
  );
  
  if (interviewCompleted) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900/80 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-2xl max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Assessment Complete!</h2>
        <div className="mb-6">
          <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            {performanceScore}%
          </div>
          <p className="text-gray-400 mt-2">Overall Performance Score</p>
        </div>
        <div className="space-y-3 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Questions Answered:</span>
            <span className="text-white font-medium">{questionsAsked}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Time Spent:</span>
            <span className="text-white font-medium">{formatTime(answerTime)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Voice Confidence:</span>
            <span className="text-green-400 font-medium">{voiceAnalysis?.summary?.confidence || 0}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Body Language:</span>
            <span className="text-blue-400 font-medium">{behavioralAnalysis?.summary?.engagement || 0}%</span>
          </div>
        </div>
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl w-full"
        >
          View Detailed Results
        </button>
      </div>
    </div>
  );

  const voiceScore = voiceAnalysis?.overallScore || 0;
  const behavioralScore = behavioralAnalysis?.overallScore || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 p-3">
      <audio ref={audioRef} className="hidden" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-2xl p-4 mb-4 border border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 animate-pulse border-2 border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Virtual Interviewer</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-blue-300">{profile?.jobTitle || profile?.title}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-xs text-gray-400">With Live Voice & Behavioral Analysis</span>
                </div>
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  performanceScore >= 80 ? 'text-green-400' :
                  performanceScore >= 70 ? 'text-blue-400' : 
                  performanceScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {performanceScore}%
                </div>
                <div className="text-xs text-gray-400 mt-1">Performance</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{currentQuestionIndex + 1}/{totalQuestions}</div>
                <div className="text-xs text-gray-400 mt-1">Progress</div>
              </div>
              
              {interviewStarted && currentQuestion && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{formatTime(answerTime)}</div>
                  <div className="text-xs text-gray-400 mt-1">Time</div>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex space-x-3">
              {!interviewStarted ? (
                <button 
                  onClick={startInterview}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl hover:from-green-700 hover:to-emerald-600 text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled={isAILoading}
                >
                  {isAILoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isAILoading ? 'Starting...' : 'Start Assessment'}
                </button>
              ) : (
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center px-5 py-2.5 bg-gray-800/60 hover:bg-gray-700/60 text-white rounded-xl transition-all duration-300 border border-white/10 text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Exit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Interviewer Section - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-blue-900/40 p-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg">
                      <Users className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-white font-medium text-sm">AI Interviewer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-black/40 px-2 py-1 rounded-lg border border-blue-500/30">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        isAISpeaking ? 'bg-green-400' : 
                        isLipSyncGenerating ? 'bg-yellow-400' :
                        isListening ? 'bg-blue-400' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-white text-[10px] font-medium">
                        {isLipSyncGenerating ? 'PREPARING' :
                         isAISpeaking ? 'SPEAKING' : 
                         isListening ? 'LISTENING' : 'IDLE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 3D Avatar with lip sync */}
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
                
                {/* Status Overlay */}
                <div className="absolute top-3 right-3 flex flex-col space-y-1.5 z-20">
                  <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-lg border border-blue-500/30 flex items-center gap-1">
                    <Ear className="h-3 w-3 text-blue-400" />
                    Voice: <span className="font-bold ml-0.5">{voiceScore}%</span>
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-lg border border-green-500/30 flex items-center gap-1">
                    <EyeIcon className="h-3 w-3 text-green-400" />
                    Body: <span className="font-bold ml-0.5">{behavioralScore}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Question */}
            {currentQuestion && (
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-xl ${
                    questionSource === 'feedback' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' :
                    questionSource === 'follow-up' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' :
                    'bg-gradient-to-r from-blue-500/20 to-cyan-500/20'
                  }`}>
                    <MessageSquare className={`h-5 w-5 ${
                      questionSource === 'feedback' ? 'text-green-400' :
                      questionSource === 'follow-up' ? 'text-purple-400' :
                      'text-blue-400'
                    }`} />
                  </div>
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
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">Q{currentQuestionIndex + 1}/{totalQuestions}</span>
                      </div>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{currentQuestion}</p>
                    {interviewStarted && currentQuestion && !isAnalyzing && !isPaused && (
                      <div className="mt-3 flex items-center text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg w-fit">
                        <Clock className="h-3 w-3 mr-1.5" />
                        <span>Answer time: {formatTime(answerTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Voice & Behavioral Feedback */}
            {(voiceRecommendations.length > 0 || behavioralRecommendations.length > 0) && (
              <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-start">
                  <div className="bg-amber-500/20 p-2 rounded-xl mr-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-amber-300 font-semibold text-sm">Real-time Feedback</h4>
                      <div className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                        Live Analysis
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {voiceRecommendations.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Ear className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-xs font-medium text-blue-300">Voice Tips:</span>
                          </div>
                          <ul className="space-y-1">
                            {voiceRecommendations.slice(0, 2).map((tip, index) => (
                              <li key={index} className="text-xs text-amber-200 flex items-start gap-1.5">
                                <span className="text-amber-400 mt-0.5">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {behavioralRecommendations.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <EyeIcon className="h-3.5 w-3.5 text-green-400" />
                            <span className="text-xs font-medium text-green-300">Body Language Tips:</span>
                          </div>
                          <ul className="space-y-1">
                            {behavioralRecommendations.slice(0, 2).map((tip, index) => (
                              <li key={index} className="text-xs text-amber-200 flex items-start gap-1.5">
                                <span className="text-amber-400 mt-0.5">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - User Section - Takes 1 column */}
          <div className="space-y-4">
            {/* User Camera */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg">
                      <Video className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-white font-medium text-sm">Your Camera with Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      isVideoEnabled ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {isVideoEnabled ? 'Camera ON' : 'Camera OFF'}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      isMicEnabled ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {isMicEnabled ? 'Mic ON' : 'Mic OFF'}
                    </span>
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
                
                {/* Analysis Metrics Overlay */}
                {behavioralAnalysis && (
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] p-2 rounded-xl border border-white/20">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      <div className="flex items-center gap-1">
                        <EyeIcon className="h-2.5 w-2.5 text-blue-400" />
                        <span>Eye: {Math.round(behavioralAnalysis.behavior?.eyeContact || 0)}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Smile className="h-2.5 w-2.5 text-green-400" />
                        <span>Smile: {Math.round(behavioralAnalysis.behavior?.smiling || 0)}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-2.5 w-2.5 text-purple-400" />
                        <span>Posture: {Math.round(behavioralAnalysis.behavior?.posture || 0)}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-2.5 w-2.5 text-amber-400" />
                        <span>Engage: {Math.round(behavioralAnalysis.behavior?.overallEngagement || 0)}%</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Camera Controls */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <button
                    onClick={toggleVideo}
                    className={`p-2.5 rounded-full transition-all duration-300 ${
                      isVideoEnabled 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg'
                    }`}
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={toggleMicrophone}
                    className={`p-2.5 rounded-full transition-all duration-300 ${
                      isMicEnabled 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg'
                    }`}
                  >
                    {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={initializeMedia}
                    className="p-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Your Response</h3>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <button
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
                    </button>
                    
                    {isListening && (
                      <div className="flex items-center space-x-1 text-red-400 animate-pulse">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-[10px] font-medium">Recording...</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => { setCurrentAnswer(''); setTranscript(''); }}
                    className="flex items-center space-x-1 text-[10px] text-gray-400 hover:text-white bg-white/5 px-2 py-1.5 rounded-lg transition-colors"
                    disabled={isAISpeaking || isLipSyncGenerating}
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="w-full h-28 bg-transparent border-none outline-none resize-none text-sm text-white placeholder-gray-500"
                    placeholder="Your spoken response will appear here..."
                    disabled={isAISpeaking || isLipSyncGenerating}
                  />
                  <div className="text-[10px] text-gray-400 mt-1.5 text-right">
                    {currentAnswer.length} characters
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isAnalyzing || isAISpeaking || isLipSyncGenerating}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  !currentAnswer.trim() || isAnalyzing || isAISpeaking || isLipSyncGenerating
                    ? 'bg-gray-800/60 cursor-not-allowed text-gray-500 border border-white/5'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-2 inline" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Submit Answer
                    <ArrowRight className="h-3.5 w-3.5 ml-2 inline" />
                  </>
                )}
              </button>
              
              {/* Lip-sync status indicator */}
              {isLipSyncGenerating && (
                <div className="mt-3 p-2 bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-amber-500/30 rounded-xl flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
                  <span className="text-xs text-amber-300">Preparing interviewer response...</span>
                </div>
              )}
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
}