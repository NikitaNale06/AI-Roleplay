// Phoneme to viseme mapping for realistic mouth shapes
export interface VisemeData {
  phoneme: string;
  blendShape: string;  // VRM blend shape name
  intensity: number;
  duration: number;
}

// Map English phonemes to VRM blend shapes
export const PHONEME_TO_VISEME: Record<string, VisemeData> = {
  // Vowels - mouth shapes
  'AA': { phoneme: 'AA', blendShape: 'aa', intensity: 1.0, duration: 0.15 }, // "father" - wide open
  'E': { phoneme: 'E', blendShape: 'ee', intensity: 0.9, duration: 0.12 },   // "bed" - slight smile
  'I': { phoneme: 'I', blendShape: 'ih', intensity: 0.8, duration: 0.1 },    // "sit" - slight open
  'O': { phoneme: 'O', blendShape: 'oh', intensity: 1.0, duration: 0.15 },   // "go" - rounded
  'U': { phoneme: 'U', blendShape: 'ou', intensity: 0.9, duration: 0.12 },   // "you" - pursed
  'UH': { phoneme: 'UH', blendShape: 'oh', intensity: 0.8, duration: 0.12 }, // "book" - rounded less
  
  // Consonants
  'M': { phoneme: 'M', blendShape: 'm', intensity: 0.7, duration: 0.08 },    // closed lips
  'B': { phoneme: 'B', blendShape: 'm', intensity: 0.8, duration: 0.06 },    // lip pop
  'P': { phoneme: 'P', blendShape: 'm', intensity: 0.8, duration: 0.06 },    // lip pop
  'F': { phoneme: 'F', blendShape: 'f', intensity: 0.6, duration: 0.1 },     // teeth on lip
  'V': { phoneme: 'V', blendShape: 'f', intensity: 0.7, duration: 0.1 },     // teeth on lip
  'TH': { phoneme: 'TH', blendShape: 'th', intensity: 0.8, duration: 0.1 },  // tongue out
  'S': { phoneme: 'S', blendShape: 'ss', intensity: 0.6, duration: 0.15 },   // teeth together
  'Z': { phoneme: 'Z', blendShape: 'ss', intensity: 0.7, duration: 0.15 },   // teeth together
  'SH': { phoneme: 'SH', blendShape: 'ch', intensity: 0.7, duration: 0.15 }, // rounded
  'CH': { phoneme: 'CH', blendShape: 'ch', intensity: 0.8, duration: 0.12 }, // rounded
  'J': { phoneme: 'J', blendShape: 'ch', intensity: 0.8, duration: 0.12 },   // rounded
  'K': { phoneme: 'K', blendShape: 'k', intensity: 0.6, duration: 0.08 },    // back of mouth
  'G': { phoneme: 'G', blendShape: 'k', intensity: 0.6, duration: 0.08 },    // back of mouth
  'NG': { phoneme: 'NG', blendShape: 'k', intensity: 0.5, duration: 0.1 },   // nasal
  'L': { phoneme: 'L', blendShape: 'l', intensity: 0.7, duration: 0.1 },     // tongue up
  'R': { phoneme: 'R', blendShape: 'r', intensity: 0.8, duration: 0.1 },     // rounded
  'W': { phoneme: 'W', blendShape: 'w', intensity: 0.8, duration: 0.1 },     // rounded
  'Y': { phoneme: 'Y', blendShape: 'ee', intensity: 0.7, duration: 0.1 },    // smile
  
  // Silence/rest
  'sil': { phoneme: 'sil', blendShape: 'neutral', intensity: 0.0, duration: 0.1 }
};

// Generate realistic phoneme sequence from text
export function generatePhonemeSequence(text: string, duration: number): VisemeData[] {
  const words = text.toLowerCase().split(/\s+/);
  const visemes: VisemeData[] = [];
  let currentTime = 0;
  
  // Common word to phoneme mapping for natural speech
  const wordPhonemeMap: Record<string, string[]> = {
    'hello': ['HH', 'E', 'L', 'O'],
    'hi': ['HH', 'I'],
    'welcome': ['W', 'E', 'L', 'K', 'AA', 'M'],
    'thank': ['TH', 'AE', 'NG', 'K'],
    'you': ['Y', 'U'],
    'please': ['P', 'L', 'IY', 'Z'],
    'can': ['K', 'AE', 'N'],
    'describe': ['D', 'IY', 'S', 'K', 'R', 'AY', 'B'],
    'explain': ['IY', 'K', 'S', 'P', 'L', 'EY', 'N'],
    'experience': ['IY', 'K', 'S', 'P', 'IY', 'R', 'IY', 'AE', 'N', 'S'],
    'project': ['P', 'R', 'AA', 'JH', 'EH', 'K', 'T'],
    'team': ['T', 'IY', 'M'],
    'work': ['W', 'ER', 'K'],
    'challenge': ['CH', 'AE', 'L', 'EH', 'N', 'JH'],
    'success': ['S', 'AH', 'K', 'S', 'EH', 'S'],
    'important': ['IH', 'M', 'P', 'AO', 'R', 'T', 'AH', 'N', 'T'],
    'about': ['AH', 'B', 'AW', 'T'],
    'would': ['W', 'UH', 'D'],
    'could': ['K', 'UH', 'D'],
    'should': ['SH', 'UH', 'D'],
    'tell': ['T', 'EH', 'L'],
    'speak': ['S', 'P', 'IY', 'K'],
    'question': ['K', 'W', 'EH', 'S', 'CH', 'AH', 'N'],
    'answer': ['AE', 'N', 'S', 'ER']
  };
  
  for (const word of words) {
    // Add slight pause between words
    if (currentTime > 0) {
      visemes.push(PHONEME_TO_VISEME['sil']);
      currentTime += 0.05;
    }
    
    let wordPhonemes: string[];
    
    if (wordPhonemeMap[word]) {
      wordPhonemes = wordPhonemeMap[word];
    } else {
      // Generate plausible phonemes based on word length
      const length = word.length;
      wordPhonemes = [];
      
      for (let i = 0; i < Math.min(4, length); i++) {
        if (i === 0) wordPhonemes.push('AA');
        else if (i === 1) wordPhonemes.push('E');
        else if (i === 2) wordPhonemes.push('I');
        else wordPhonemes.push('O');
      }
    }
    
    // Add phonemes for this word
    for (const phoneme of wordPhonemes) {
      const viseme = PHONEME_TO_VISEME[phoneme] || PHONEME_TO_VISEME['AA'];
      const visemeDuration = 0.1 + Math.random() * 0.1; // Natural variation
      
      visemes.push({
        ...viseme,
        duration: visemeDuration,
        intensity: 0.7 + Math.random() * 0.3
      });
      
      currentTime += visemeDuration;
    }
  }
  
  // Scale to match actual speech duration
  const totalDuration = currentTime;
  const scaleFactor = duration / totalDuration;
  
  return visemes.map(v => ({
    ...v,
    duration: v.duration * scaleFactor
  }));
}

// Smart expression mapping based on content
export function detectEmotionFromText(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('great') || lowerText.includes('excellent') || 
      lowerText.includes('wonderful') || lowerText.includes('fantastic') ||
      lowerText.includes('good job') || lowerText.includes('well done')) {
    return 'happy';
  }
  
  if (lowerText.includes('thinking') || lowerText.includes('consider') ||
      lowerText.includes('maybe') || lowerText.includes('perhaps')) {
    return 'thinking';
  }
  
  if (lowerText.includes('sorry') || lowerText.includes('apologize') ||
      lowerText.includes('unfortunately')) {
    return 'sorry';
  }
  
  if (lowerText.includes('welcome') || lowerText.includes('hello') ||
      lowerText.includes('hi ')) {
    return 'greeting';
  }
  
  if (lowerText.includes('?') && lowerText.length < 100) {
    return 'question';
  }
  
  return 'neutral';
}