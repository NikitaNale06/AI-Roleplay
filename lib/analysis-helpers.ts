// lib/analysis-helpers.ts
import { EnhancedRealTimeAnalyzer, EnhancedVoiceAnalysis, BehavioralAnalysis } from './enhanced-analyzer';

export const getFallbackBehavioralAnalysis = (): BehavioralAnalysis => ({
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

export const analyzeBehaviorWithMediaPipe = async (
  videoElement: HTMLVideoElement, 
  analyzer: EnhancedRealTimeAnalyzer
): Promise<BehavioralAnalysis> => {
  try {
    const currentAnalysis = analyzer.getCurrentEnhancedAnalysis();
    const gestureData = currentAnalysis.gestures;
    
    // Use safe property access with fallbacks
    const behavioralScore = Math.round(
      (gestureData.eyeContact * 0.25) +
      (gestureData.posture * 0.20) +
      (gestureData.gestures * 0.15) +
      (gestureData.smiling * 0.15) +
      (gestureData.attention * 0.25)
    );

    const analysis: BehavioralAnalysis = {
      score: behavioralScore,
      eyeContact: gestureData.eyeContact,
      posture: gestureData.posture,
      gestures: gestureData.gestures,
      facialExpressions: gestureData.smiling,
      confidenceLevel: gestureData.attention,
      engagement: gestureData.eyeContact,
      professionalism: gestureData.posture,
      analysis: {
        gazeDirection: [0.5, 0.5], // Simplified fallback
        headPose: [0, 0, 0], // Simplified fallback
        smileIntensity: gestureData.smiling / 100,
        gestureFrequency: gestureData.gestures / 100
      }
    };

    return analysis;

  } catch (error) {
    console.error('Enhanced behavior analysis error:', error);
    return getFallbackBehavioralAnalysis();
  }
};

export const analyzeVoiceWithGrammar = (
  audioStream: MediaStream, 
  transcript: string, 
  duration: number,
  analyzer: EnhancedRealTimeAnalyzer
): EnhancedVoiceAnalysis => {
  try {
    analyzer.updateSpeechMetrics(transcript, duration);
    const voiceAnalysis = analyzer.analyzeAudio(audioStream);
    
    const hasValidAudio = voiceAnalysis.volume > 5 && voiceAnalysis.clarity > 5;
    
    if (!hasValidAudio) {
      console.warn('Invalid enhanced voice analysis data received');
      return analyzer.getCurrentEnhancedAnalysis().voice;
    }
    
    return voiceAnalysis;
  } catch (error) {
    console.error('Enhanced voice analysis error:', error);
    return analyzer.getCurrentEnhancedAnalysis().voice;
  }
};