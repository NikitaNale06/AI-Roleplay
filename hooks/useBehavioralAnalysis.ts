import { useState, useRef } from "react";

export const useBehavioralAnalysis = (videoRef: any) => {
  const [behavioralEngagement, setBehavioralEngagement] = useState(50);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const analyzeFrame = () => {
    if (!videoRef.current) return;

    // Replace this with real mediapipe logic later
    const randomScore = 60 + Math.random() * 20;

    setBehavioralEngagement(Math.round(randomScore));
  };

  const startBehavioralAnalysis = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      analyzeFrame();
    }, 300);
  };

  const stopBehavioralAnalysis = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return {
    behavioralEngagement,
    startBehavioralAnalysis,
    stopBehavioralAnalysis
  };
};