'use client';
import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

interface AIVoiceOptions {
  emotion?: 'neutral' | 'happy' | 'serious' | 'encouraging' | 'questioning';
  speed?: number;
  pitch?: number;
}

export const useAIVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Text-to-speech with emotion modulation
  const speakWithEmotion = useCallback(async (
    text: string,
    options: AIVoiceOptions = {}
  ) => {
    const {
      emotion = 'neutral',
      speed = 1.0,
      pitch = 1.0
    } = options;

    return new Promise<void>((resolve) => {
      if (!window.speechSynthesis) {
        console.warn('Speech synthesis not supported');
        resolve();
        return;
      }

      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      speechRef.current = utterance;

      // Configure voice based on emotion
      let rate = speed;
      let voicePitch = pitch;
      let volume = 1.0;

      switch (emotion) {
        case 'happy':
          rate = 1.1;
          voicePitch = 1.2;
          volume = 1.1;
          break;
        case 'serious':
          rate = 0.9;
          voicePitch = 0.9;
          volume = 1.0;
          break;
        case 'encouraging':
          rate = 1.0;
          voicePitch = 1.1;
          volume = 1.05;
          break;
        case 'questioning':
          rate = 1.0;
          voicePitch = 1.15;
          volume = 1.0;
          break;
        default: // neutral
          rate = 1.0;
          voicePitch = 1.0;
          volume = 1.0;
      }

      utterance.rate = rate;
      utterance.pitch = voicePitch;
      utterance.volume = volume;

      // Try to get a female voice for more natural sound
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = voices.filter(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Samantha')
      );
      
      if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      }

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log(`🎤 Speaking with ${emotion} emotion:`, text.substring(0, 50));
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        speechRef.current = null;
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
        speechRef.current = null;
        resolve();
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // Stop current speech
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speechRef.current = null;
    }
  }, []);

  // Generate AI response using OpenAI (optional)
  const generateAIResponse = useCallback(async (
    userMessage: string,
    context: string[]
  ): Promise<string> => {
    setIsLoading(true);
    
    try {
      // Using a local fallback for now
      // In production, you would use OpenAI API
      const responses = [
        "That's an interesting perspective. Could you elaborate more on that?",
        "I see what you mean. How does this relate to your overall experience?",
        "Thank you for sharing that. What was the most challenging part?",
        "That's a good point. Can you provide a specific example?",
        "I understand. How did you approach that situation?",
        "Interesting! What did you learn from that experience?",
        "Good answer. How would you apply that in a different context?",
        "Thanks for explaining. What was the outcome of that situation?"
      ];

      // Simple response selection based on context
      const lastContext = context[context.length - 1] || '';
      let selectedResponse = responses[Math.floor(Math.random() * responses.length)];

      // Add some context-awareness
      if (userMessage.toLowerCase().includes('challenge') || userMessage.toLowerCase().includes('difficult')) {
        selectedResponse = "Challenges are great learning opportunities. How did you overcome that particular challenge?";
      } else if (userMessage.toLowerCase().includes('team') || userMessage.toLowerCase().includes('colleague')) {
        selectedResponse = "Team dynamics are important. How did you ensure effective collaboration in that situation?";
      } else if (userMessage.toLowerCase().includes('success') || userMessage.toLowerCase().includes('achieve')) {
        selectedResponse = "Congratulations on that achievement! What factors contributed most to your success?";
      }

      setIsLoading(false);
      return selectedResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsLoading(false);
      return "Thank you for your response. Could you please elaborate a bit more?";
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