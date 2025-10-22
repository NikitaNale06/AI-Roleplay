import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audio, transcript } = req.body;

    // Analyze speech characteristics
    const analysis = await analyzeSpeechCharacteristics(audio, transcript);
    
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Voice analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze voice' });
  }
}

async function analyzeSpeechCharacteristics(audio: string, transcript: string) {
  // Calculate speaking rate
  const words = transcript.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Analyze filler words
  const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically'];
  const fillerCount = words.filter(word => 
    fillerWords.includes(word.toLowerCase().replace(/[.,!?;:]/g, ''))
  ).length;

  // Analyze pauses (simplified - in real implementation, use audio analysis)
  const pauseIndicators = ['.', '?', '!', ',', ';', ':'];
  const pauseCount = words.filter(word => 
    pauseIndicators.some(p => word.includes(p))
  ).length;

  // Use Wav2Vec2 for more advanced analysis if needed
  const advancedAnalysis = await fetch('http://localhost:3000/api/huggingface/facebook/wav2vec2-base-960h', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: audio,
    }),
  }).then(res => res.json());

  return {
    volume: calculateVolume(audio), // Implement audio volume analysis
    clarity: calculateClarity(advancedAnalysis),
    pace: Math.max(50, Math.min(300, (wordCount / 60) * 60)), // words per minute estimate
    tone: analyzeTone(advancedAnalysis),
    fillerWords: fillerCount,
    pauses: pauseCount,
    confidence: calculateConfidence(wordCount, fillerCount, pauseCount),
    wordCount,
    speakingRate: wordCount / 60, // words per second
  };
}

function calculateVolume(audioData: string): number {
  // Implement audio volume analysis from base64 data
  // This is a simplified version
  return Math.random() * 40 + 60; // Placeholder
}

function calculateClarity(analysis: any): number {
  // Analyze speech clarity from advanced analysis
  return Math.random() * 30 + 70; // Placeholder
}

function analyzeTone(analysis: any): number {
  // Analyze voice tone/pitch
  return Math.random() * 40 + 60; // Placeholder
}

function calculateConfidence(wordCount: number, fillerCount: number, pauseCount: number): number {
  const baseScore = Math.min(100, (wordCount / 2));
  const fillerPenalty = Math.min(20, fillerCount * 3);
  const pausePenalty = Math.min(15, pauseCount * 2);
  
  return Math.max(0, baseScore - fillerPenalty - pausePenalty);
}