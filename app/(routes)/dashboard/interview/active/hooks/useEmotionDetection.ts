'use client';
import { useState, useEffect } from 'react';

export type EmotionType = 'neutral' | 'happy' | 'listening' | 'thinking' | 'speaking' | 'curious' | 'encouraging';

interface EmotionDetectionProps {
  userAnswer: string;
  aiQuestion: string;
  isAISpeaking: boolean;
}

export const useEmotionDetection = ({
  userAnswer,
  aiQuestion,
  isAISpeaking
}: EmotionDetectionProps) => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  const [emotionIntensity, setEmotionIntensity] = useState(1.0);

  useEffect(() => {
    if (isAISpeaking) {
      // AI is speaking - set speaking emotion
      setCurrentEmotion('speaking');
      setEmotionIntensity(1.2);
      return;
    }

    // Analyze user answer to determine emotion response
    const analyzeAnswer = () => {
      const answer = userAnswer.toLowerCase();
      const question = aiQuestion.toLowerCase();

      // Default emotion
      let emotion: EmotionType = 'listening';
      let intensity = 1.0;

      // Detect based on keywords in answer
      if (answer.includes('?')) {
        emotion = 'curious';
        intensity = 1.1;
      } else if (answer.includes('!') || answer.includes('amazing') || answer.includes('great')) {
        emotion = 'happy';
        intensity = 1.3;
      } else if (answer.length < 20) {
        emotion = 'curious';
        intensity = 1.1;
      } else if (answer.length > 100) {
        emotion = 'thinking';
        intensity = 1.0;
      }

      // Adjust based on question type
      if (question.includes('challenge') || question.includes('difficult')) {
        emotion = 'thinking';
      } else if (question.includes('achievement') || question.includes('success')) {
        emotion = 'encouraging';
      }

      setCurrentEmotion(emotion);
      setEmotionIntensity(intensity);
    };

    if (userAnswer.trim()) {
      analyzeAnswer();
    } else {
      // No answer yet - neutral listening
      setCurrentEmotion('listening');
      setEmotionIntensity(1.0);
    }
  }, [userAnswer, aiQuestion, isAISpeaking]);

  // Get animation name for Ready Player Me
  const getAnimationForEmotion = (emotion: EmotionType): string => {
    const animationMap: Record<EmotionType, string> = {
      neutral: 'idle',
      happy: 'wave',
      listening: 'agree',
      thinking: 'thinking',
      speaking: 'talking',
      curious: 'gesturing',
      encouraging: 'agree'
    };
    return animationMap[emotion] || 'idle';
  };

  return {
    currentEmotion,
    emotionIntensity,
    getAnimationForEmotion
  };
};