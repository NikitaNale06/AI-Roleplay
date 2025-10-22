// lib/enhanced-analyzer.ts

// Enhanced Types for Real Analysis
export interface MediaPipeAnalysis {
  faceLandmarks: any[];
  handLandmarks: any[];
  poseLandmarks: any[];
  faceDetectionScore: number;
  gestureConfidence: number;
}

export interface EnhancedGestureAnalysis {
  eyeContact: number;
  posture: number;
  headMovement: number;
  smiling: number;
  attention: number;
  gestures: number;
  mediaPipeData: MediaPipeAnalysis;
  grammaticalErrors: number;
  sentenceStructure: number;
  vocabularyComplexity: number;
}

export interface EnhancedVoiceAnalysis {
  volume: number;
  clarity: number;
  pace: number;
  tone: number;
  fillerWords: number;
  pauses: number;
  confidence: number;
  grammaticalMistakes: string[];
  sentenceComplexity: number;
  vocabularyScore: number;
  fluencyScore: number;
}

export interface BehavioralAnalysis {
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

// Enhanced RealTimeAnalyzer Class with MediaPipe
// In lib/enhanced-analyzer.ts - update the constructor and methods:

export class EnhancedRealTimeAnalyzer {
  private isInitialized = false;
  private analysisInterval: NodeJS.Timeout | null = null;
  private gestureData: EnhancedGestureAnalysis;
  private voiceData: EnhancedVoiceAnalysis;

  // MediaPipe instances
  private faceMesh: any = null;
  private hands: any = null;
  private pose: any = null;
  private camera: any = null;
  
  // Audio analysis
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private speechStartTime: number = 0;
  private wordCount: number = 0;
  private isAudioContextClosed = false;
  private hasUserSpoken: boolean = false;

  constructor() {
    this.gestureData = this.getDefaultGestureData();
    this.voiceData = this.getDefaultVoiceData();
    
    // Only load MediaPipe in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.loadMediaPipeFromCDN().catch(error => {
        console.warn('MediaPipe CDN loading failed:', error);
      });
    }
  }

  // Add these methods to your EnhancedRealTimeAnalyzer class:

public getCurrentEnhancedAnalysis(): { gestures: EnhancedGestureAnalysis; voice: EnhancedVoiceAnalysis } {
  return {
    gestures: this.gestureData,
    voice: this.voiceData
  };
}

private getDefaultGestureData(): EnhancedGestureAnalysis {
  return {
    eyeContact: 0,
    posture: 0,
    headMovement: 0,
    smiling: 0,
    attention: 0,
    gestures: 0,
    mediaPipeData: {
      faceLandmarks: [],
      handLandmarks: [],
      poseLandmarks: [],
      faceDetectionScore: 0,
      gestureConfidence: 0
    },
    grammaticalErrors: 0,
    sentenceStructure: 0,
    vocabularyComplexity: 0
  };
}

private getDefaultVoiceData(): EnhancedVoiceAnalysis {
  return {
    volume: 0,
    clarity: 0,
    pace: 150,
    tone: 0,
    fillerWords: 0,
    pauses: 0,
    confidence: 0,
    grammaticalMistakes: [],
    sentenceComplexity: 0,
    vocabularyScore: 0,
    fluencyScore: 0
  };
}

  private async loadMediaPipeFromCDN() {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }

      await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
      await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');
      await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
      
      this.initializeMediaPipe();
    } catch (error) {
      console.error('Failed to load MediaPipe from CDN:', error);
    }
  }

  private loadScript(src: string): Promise<void> {
    // Double check for browser environment
    if (typeof document === 'undefined') {
      return Promise.reject(new Error('Document not available'));
    }

    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  // ... rest of your methods remain the same

  // Load MediaPipe from CDN
  

  
  private initializeMediaPipe() {
    // Initialize FaceMesh
    if (typeof window !== 'undefined' && (window as any).FaceMesh) {
      this.faceMesh = new (window as any).FaceMesh({
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

      this.faceMesh.onResults(this.handleFaceResults.bind(this));
    }
  }

  // MediaPipe Results Handlers
  private handleFaceResults(results: any) {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      this.gestureData.mediaPipeData.faceLandmarks = landmarks;
      this.gestureData.mediaPipeData.faceDetectionScore = results.detections?.[0]?.score || 0.8;
      
      // Enhanced analysis with MediaPipe landmarks
      this.analyzeFaceWithMediaPipe(landmarks);
    }
  }

  // Enhanced MediaPipe-based Analysis
  private analyzeFaceWithMediaPipe(landmarks: any[]) {
    if (!landmarks || landmarks.length === 0) return;

    // Eye contact analysis using MediaPipe landmarks
    const leftEye = landmarks[33];  // Left eye center
    const rightEye = landmarks[263]; // Right eye center
    const noseTip = landmarks[1];   // Nose tip
    
    if (leftEye && rightEye && noseTip) {
      const eyeDirection = this.calculateGazeDirection(leftEye, rightEye, noseTip);
      this.gestureData.eyeContact = Math.max(0, 100 - Math.abs(eyeDirection.x) * 200);
      
      // Smile detection using lip landmarks
      const smileIntensity = this.detectSmile(landmarks);
      this.gestureData.smiling = Math.min(100, smileIntensity * 150);
      
      // Head pose analysis
      const headPose = this.analyzeHeadPose(landmarks);
      this.gestureData.headMovement = Math.min(100, Math.abs(headPose.yaw) * 50 + Math.abs(headPose.pitch) * 50);
      
      // Attention score based on multiple factors
      this.gestureData.attention = (this.gestureData.eyeContact + (100 - this.gestureData.headMovement) + this.gestureData.smiling) / 3;
    }
  }

  // MediaPipe Utility Methods
  private calculateGazeDirection(leftEye: any, rightEye: any, noseTip: any): { x: number; y: number } {
    if (!leftEye || !rightEye || !noseTip) return { x: 0, y: 0 };
    
    const eyeCenter = {
      x: (leftEye.x + rightEye.x) / 2,
      y: (leftEye.y + rightEye.y) / 2
    };
    
    return {
      x: eyeCenter.x - noseTip.x,
      y: eyeCenter.y - noseTip.y
    };
  }

  private detectSmile(landmarks: any[]): number {
    // Use lip landmarks to detect smile
    const upperLip = landmarks[13];
    const lowerLip = landmarks[14];
    const lipLeft = landmarks[78];
    const lipRight = landmarks[308];
    
    if (!upperLip || !lowerLip || !lipLeft || !lipRight) return 0;
    
    const lipHeight = Math.abs(upperLip.y - lowerLip.y);
    const lipWidth = Math.abs(lipLeft.x - lipRight.x);
    const smileRatio = lipWidth / (lipHeight + 0.001);
    
    return Math.min(1, smileRatio * 2);
  }

  private analyzeHeadPose(landmarks: any[]): { yaw: number; pitch: number; roll: number } {
    const nose = landmarks[1];
    const forehead = landmarks[10];
    const leftEar = landmarks[234];
    const rightEar = landmarks[454];
    
    if (!nose || !forehead || !leftEar || !rightEar) {
      return { yaw: 0, pitch: 0, roll: 0 };
    }
    
    return {
      yaw: (nose.x - 0.5) * 2,
      pitch: (nose.y - 0.5) * 2,
      roll: (leftEar.y - rightEar.y) * 2
    };
  }

  // Audio Analysis
  public analyzeAudio(audioStream: MediaStream): EnhancedVoiceAnalysis {
    if (!this.isInitialized || !this.audioContext || this.isAudioContextClosed) {
      return this.getFallbackEnhancedVoiceAnalysis();
    }

    try {
      if (!audioStream.active) {
        return this.getFallbackEnhancedVoiceAnalysis();
      }

      if (!this.analyzer) {
        const source = this.audioContext.createMediaStreamSource(audioStream);
        this.analyzer = this.audioContext.createAnalyser();
        this.analyzer.fftSize = 512;
        this.analyzer.smoothingTimeConstant = 0.8;
        source.connect(this.analyzer);
      }
      
      const bufferLength = this.analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const timeDomainArray = new Uint8Array(bufferLength);
      
      // Get frequency data for volume analysis
      this.analyzer.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / bufferLength;
      
      // Get time domain data for pitch and clarity analysis
      this.analyzer.getByteTimeDomainData(timeDomainArray);
      const tone = this.analyzePitch(timeDomainArray);
      const clarity = this.calculateClarity(timeDomainArray);
      
      // Calculate confidence if user has spoken
      let confidence = this.voiceData.confidence;
      if (this.hasUserSpoken) {
        confidence = Math.min(100, (volume * 0.3 + clarity * 0.4 + tone * 0.3) * 100);
      } else {
        confidence = 0;
      }
      
      return {
        ...this.voiceData,
        volume: Math.min(100, (volume / 256) * 100),
        clarity: Math.min(100, clarity),
        pace: this.voiceData.pace,
        tone: Math.min(100, tone * 100),
        confidence: confidence
      };
    } catch (error) {
      console.error('Enhanced audio analysis error:', error);
      return this.getFallbackEnhancedVoiceAnalysis();
    }
  }

  private analyzePitch(dataArray: Uint8Array): number {
    let zeroCrossings = 0;
    let prevSample = dataArray[0] - 128;
    
    for (let i = 1; i < dataArray.length; i++) {
      const sample = dataArray[i] - 128;
      if ((prevSample < 0 && sample >= 0) || (prevSample >= 0 && sample < 0)) {
        zeroCrossings++;
      }
      prevSample = sample;
    }
    
    const pitch = zeroCrossings / dataArray.length;
    return Math.min(1, pitch * 8);
  }

  private calculateClarity(dataArray: Uint8Array): number {
    let clarity = 0;
    let significantSamples = 0;
    let totalAmplitude = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const amplitude = Math.abs(dataArray[i] - 128);
      totalAmplitude += amplitude;
      
      if (amplitude > 20) {
        significantSamples++;
      }
    }
    
    const avgAmplitude = totalAmplitude / dataArray.length;
    const amplitudeScore = Math.min(100, (avgAmplitude / 64) * 100);
    const clarityScore = (significantSamples / dataArray.length) * 100;
    
    clarity = (amplitudeScore * 0.6 + clarityScore * 0.4);
    return Math.min(100, clarity);
  }

  // Enhanced Speech Metrics with Grammar Analysis
  public updateSpeechMetrics(transcript: string, duration: number) {
    const words = transcript.split(/\s+/).filter(word => word.length > 0);
    this.wordCount = words.length;
    
    if (words.length > 0) {
      this.hasUserSpoken = true;
    }
    
    // Calculate speaking pace
    if (duration > 0 && words.length > 5) {
      this.voiceData.pace = Math.max(50, Math.min(300, (words.length / duration) * 60));
    }
    
    // Enhanced filler words detection
    const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'so', 'well', 'okay', 'right'];
    const fillerCount = words.filter(word => 
      fillerWords.includes(word.toLowerCase().replace(/[.,!?;:]/g, ''))
    ).length;
    
    this.voiceData.fillerWords = fillerCount;
    
    // Enhanced pause detection
    const pauseIndicators = ['.', '?', '!', ',', ';', ':'];
    const pauseCount = words.filter(word => 
      pauseIndicators.some(p => word.includes(p))
    ).length;
    
    this.voiceData.pauses = pauseCount;
    
    // Enhanced grammar and language analysis
    this.analyzeGrammarAndLanguage(transcript, words);
  }

  // Enhanced Grammar and Language Analysis
  private analyzeGrammarAndLanguage(transcript: string, words: string[]) {
    const grammaticalErrors = this.detectGrammaticalErrors(transcript);
    this.voiceData.grammaticalMistakes = grammaticalErrors;
    this.gestureData.grammaticalErrors = grammaticalErrors.length;
    
    this.voiceData.sentenceComplexity = this.analyzeSentenceComplexity(transcript);
    this.gestureData.sentenceStructure = this.voiceData.sentenceComplexity;
    
    this.voiceData.vocabularyScore = this.analyzeVocabularyComplexity(words);
    this.gestureData.vocabularyComplexity = this.voiceData.vocabularyScore;
    
    this.voiceData.fluencyScore = this.calculateFluencyScore(transcript, words.length);
  }

  // Grammar Detection Methods
  private detectGrammaticalErrors(text: string): string[] {
    const errors: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      
      if (this.hasSubjectVerbDisagreement(trimmed)) {
        errors.push(`Subject-verb agreement: "${trimmed}"`);
      }
      
      if (this.hasTenseInconsistency(trimmed)) {
        errors.push(`Tense inconsistency: "${trimmed}"`);
      }
      
      if (this.hasArticleError(trimmed)) {
        errors.push(`Article usage: "${trimmed}"`);
      }
      
      if (this.hasPrepositionError(trimmed)) {
        errors.push(`Preposition usage: "${trimmed}"`);
      }
      
      if (this.isRunOnSentence(trimmed)) {
        errors.push(`Run-on sentence: "${trimmed}"`);
      }
      
      if (this.isSentenceFragment(trimmed)) {
        errors.push(`Sentence fragment: "${trimmed}"`);
      }
    });
    
    return errors;
  }

  private hasSubjectVerbDisagreement(sentence: string): boolean {
    const disagreementPatterns = [
      /\b(they|we|you|I) (is|was)\b/i,
      /\b(he|she|it) (are|were)\b/i,
      /\b(there) (are|were) (a|an)\b/i,
      /\b(there) (is|was) (many|several|few|both)\b/i
    ];
    
    return disagreementPatterns.some(pattern => pattern.test(sentence));
  }

  private hasTenseInconsistency(sentence: string): boolean {
    const pastPresentMix = /\b(was|were|had|did|went|came|saw)\b.*\b(is|are|have|do|go|come|see)\b/i;
    const presentPastMix = /\b(is|are|have|do|go|come|see)\b.*\b(was|were|had|did|went|came|saw)\b/i;
    
    return pastPresentMix.test(sentence) || presentPastMix.test(sentence);
  }

  private hasArticleError(sentence: string): boolean {
    const articleErrors = [
      /\b(a) (hour|honest|honor|heir)\b/i,
      /\b(an) (book|car|dog|table)\b/i,
      /\b(the) (Paris|London|John)\b.*\b(the)\b/i
    ];
    
    return articleErrors.some(pattern => pattern.test(sentence));
  }

  private hasPrepositionError(sentence: string): boolean {
    const commonPrepositionErrors = [
      /\b(interested about)\b/i,
      /\b(depending of)\b/i,
      /\b(complain for)\b/i,
      /\b(arrive to)\b/i
    ];
    
    return commonPrepositionErrors.some(pattern => pattern.test(sentence));
  }

  private isRunOnSentence(sentence: string): boolean {
    const clauses = sentence.split(/[,;]/);
    if (clauses.length > 3) {
      const wordCount = sentence.split(/\s+/).length;
      return wordCount > 25 && clauses.length > 2;
    }
    return false;
  }

  private isSentenceFragment(sentence: string): boolean {
    const hasSubject = /\b(I|you|he|she|it|we|they|this|that|these|those|[A-Z][a-z]+)\b/i.test(sentence);
    const hasVerb = /\b(am|is|are|was|were|have|has|had|do|does|did|can|could|will|would|shall|should|may|might|must)\b|\b[a-z]+ed\b|\b[a-z]+ing\b/i.test(sentence);
    
    return !hasSubject || !hasVerb;
  }

  private analyzeSentenceComplexity(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;
    
    let complexityScore = 0;
    
    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      const wordCount = words.length;
      
      if (wordCount > 15) complexityScore += 25;
      else if (wordCount > 10) complexityScore += 15;
      else if (wordCount > 5) complexityScore += 10;
      
      if (/(because|although|however|therefore|furthermore|moreover|nevertheless|consequently)/i.test(sentence)) {
        complexityScore += 20;
      }
      
      const clauseCount = (sentence.match(/(that|which|who|whom|whose|when|where|why)/gi) || []).length;
      complexityScore += clauseCount * 10;
    });
    
    return Math.min(100, complexityScore / sentences.length);
  }

  private analyzeVocabularyComplexity(words: string[]): number {
    if (words.length === 0) return 0;
    
    const commonWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at']);
    const complexWords = words.filter(word => 
      word.length > 6 && !commonWords.has(word.toLowerCase())
    );
    
    const complexityRatio = complexWords.length / words.length;
    return Math.min(100, complexityRatio * 200);
  }

  private calculateFluencyScore(transcript: string, wordCount: number): number {
    if (wordCount === 0) return 0;
    
    let fluencyScore = 100;
    
    const fillerWords = ['um', 'uh', 'like', 'you know'];
    const fillerCount = fillerWords.reduce((count, filler) => {
      return count + (transcript.toLowerCase().split(filler).length - 1);
    }, 0);
    
    fluencyScore -= fillerCount * 5;
    
    const pauseIndicators = /\.{3,}|\s{3,}/g;
    const pauseCount = (transcript.match(pauseIndicators) || []).length;
    fluencyScore -= pauseCount * 3;
    
    const sentenceCount = (transcript.match(/[.!?]+/g) || []).length;
    if (sentenceCount > 0) {
      const avgWordsPerSentence = wordCount / sentenceCount;
      if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 20) {
        fluencyScore += 10;
      }
    }
    
    return Math.max(0, Math.min(100, fluencyScore));
  }

  public async initialize() {
    try {
      if (!this.audioContext || this.isAudioContextClosed) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.isAudioContextClosed = false;
      }
      this.isInitialized = true;
      console.log('Enhanced real-time analyzer with MediaPipe initialized');
    } catch (error) {
      console.error('Error initializing enhanced analyzer:', error);
      this.isInitialized = false;
    }
  }

  // Start enhanced real-time analysis with MediaPipe
  public async startEnhancedRealTimeAnalysis(videoElement: HTMLVideoElement, audioStream: MediaStream) {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }

    if (!this.audioContext || this.isAudioContextClosed) {
      await this.initialize();
    }

    // Wait for MediaPipe to load
    if (!this.faceMesh) {
      console.warn('MediaPipe not loaded yet, waiting...');
      setTimeout(() => {
        this.startEnhancedRealTimeAnalysis(videoElement, audioStream);
      }, 1000);
      return;
    }

    // Start MediaPipe camera
    if ((window as any).Camera) {
      this.camera = new (window as any).Camera(videoElement, {
        onFrame: async () => {
          if (this.faceMesh) {
            await this.faceMesh.send({ image: videoElement });
          }
        },
        width: 640,
        height: 480
      });
      this.camera.start();
    }

    this.analysisInterval = setInterval(async () => {
      try {
        if (videoElement.readyState >= 2 && audioStream.active) {
          const voiceAnalysis = this.analyzeAudio(audioStream);
          this.voiceData = { ...this.voiceData, ...voiceAnalysis };
        }
      } catch (error) {
        console.error('Enhanced real-time analysis error:', error);
      }
    }, 2000);
  }

  public stopAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
    
    if (this.audioContext && !this.isAudioContextClosed) {
      try {
        this.audioContext.close().then(() => {
          this.isAudioContextClosed = true;
          this.analyzer = null;
        }).catch(error => {
          console.warn('Error closing audio context:', error);
          this.isAudioContextClosed = true;
          this.analyzer = null;
        });
      } catch (error) {
        console.warn('Error closing audio context:', error);
        this.isAudioContextClosed = true;
        this.analyzer = null;
      }
    }
  }

  public resetUserSpeech() {
    this.hasUserSpoken = false;
    this.voiceData.confidence = 0;
    this.voiceData.pace = 150;
    this.voiceData.fillerWords = 0;
    this.voiceData.pauses = 0;
    this.voiceData.grammaticalMistakes = [];
    this.voiceData.sentenceComplexity = 0;
    this.voiceData.vocabularyScore = 0;
    this.voiceData.fluencyScore = 0;
    this.gestureData.grammaticalErrors = 0;
    this.gestureData.sentenceStructure = 0;
    this.gestureData.vocabularyComplexity = 0;
  }

  private getFallbackEnhancedVoiceAnalysis(): EnhancedVoiceAnalysis {
    return {
      volume: 0,
      clarity: 0,
      pace: 0,
      tone: 0,
      fillerWords: 0,
      pauses: 0,
      confidence: 0,
      grammaticalMistakes: [],
      sentenceComplexity: 0,
      vocabularyScore: 0,
      fluencyScore: 0
    };
  }
}
