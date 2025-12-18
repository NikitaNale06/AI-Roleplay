//C:\Users\AATMAJA\ai-mock-interview\app\api\analyze-answer\route.ts
/*export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Debug logging for API key
    console.log('GROQ key present:', !!process.env.GROQ_API_KEY, 'len:', process.env.GROQ_API_KEY?.length);
    
    // Check if Groq API key is available
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 503 }
      );
    }

    const { 
      question, 
      answer, 
      questionType, 
      jobTitle, 
      skills, 
      experience,
      userName,
      previousAnswers = [],
      companyName = '',
      correctAnswer = ''
    } = await request.json();

    // Create a comprehensive prompt for dynamic feedback
    const prompt = `You are an expert AI interviewer conducting a professional interview. Analyze this candidate's response and provide personalized, constructive feedback.

INTERVIEW CONTEXT:
- Position: ${jobTitle}
- Company: ${companyName || 'the company'}
- Required Experience: ${experience}
- Key Skills: ${skills?.join(', ') || 'General skills'}
- Candidate Name: ${userName || 'the candidate'}
- Question Type: ${questionType}

QUESTION ASKED:
"${question}"

CANDIDATE'S RESPONSE:
"${answer}"

${correctAnswer ? `IDEAL ANSWER REFERENCE:
"${correctAnswer}"` : ''}

${previousAnswers.length > 0 ? `
PREVIOUS PERFORMANCE:
${previousAnswers.map((prev: any, idx: number) => 
  `Q${idx + 1}: Score ${prev.score}% - ${prev.answer.substring(0, 100)}...`
).join('\n')}` : ''}

ANALYSIS REQUIREMENTS:
1. Provide a realistic score (20-95 range, most answers should be 60-85)
2. Give specific, actionable feedback based on the actual content
3. Reference the candidate by name when possible
4. Compare their answer to what excellent candidates typically say
5. Suggest specific improvements for this exact scenario
6. Assess communication skills, content depth, and relevance
7. If provided, compare against the ideal answer reference

You must respond with valid JSON only. Use this exact structure:
{
  "score": 75,
  "strengths": [
    "specific strength based on their actual words",
    "another strength they demonstrated"
  ],
  "improvements": [
    "specific area to improve based on their response",
    "another specific improvement"
  ],
  "suggestions": [
    "actionable suggestion for better answers",
    "specific technique they should use",
    "example of what they could have added"
  ],
  "skillAssessment": {
    "Communication": 80,
    "Technical Knowledge": 70,
    "Problem Solving": 75,
    "Leadership": 65,
    "Confidence": 80
  },
  "detailedFeedback": "Personalized paragraph addressing them by name, explaining their performance, what they did well, what needs work, and how to improve. Make it sound like a real interviewer speaking to them.",
  "confidenceLevel": 75,
  "behavioralAnalysis": {
    "score": 75,
    "hesitations": 2,
    "fillerWords": 1,
    "confidentLanguage": 8,
    "suggestions": [
      "specific behavioral improvement suggestion"
    ]
  },
  "interviewerResponse": "What the AI interviewer would say next - personalized feedback as if speaking directly to the candidate, acknowledging their specific answer content and providing guidance."
}`;

    // Use Groq API with enhanced JSON mode - UPDATED MODEL
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Updated to currently supported model
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview analyst providing detailed, personalized feedback. Always respond with valid JSON only. Do not include any markdown formatting or code blocks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errorData);
      
      // Fallback to enhanced static analysis if API fails
      return NextResponse.json(getEnhancedFallbackAnalysis(question, answer, userName, questionType));
    }

    const data = await groqResponse.json();
    console.log('Groq API success:', data.choices?.[0]?.message?.content?.substring(0, 100));
    
    // Extract the AI response
    const analysisText = data.choices[0].message.content;
    
    // Clean and parse the JSON response
    const cleanAnalysisText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
    
    let analysis;
    try {
      analysis = JSON.parse(cleanAnalysisText);
      console.log('Successfully parsed Groq response');
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', analysisText);
      
      // Return enhanced fallback response if parsing fails
      return NextResponse.json(getEnhancedFallbackAnalysis(question, answer, userName, questionType));
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error analyzing answer with Groq:', error);
    return NextResponse.json(
      { error: 'Failed to analyze answer' },
      { status: 500 }
    );
  }
}

// Enhanced fallback analysis that's more dynamic
function getEnhancedFallbackAnalysis(question: string, answer: string, userName: string, questionType: string) {
  const answerWords = answer.trim().split(/\s+/);
  const answerLength = answerWords.length;
  
  // More sophisticated scoring
  let baseScore = 45;
  
  // Length scoring
  if (answerLength > 100) baseScore += 25;
  else if (answerLength > 60) baseScore += 20;
  else if (answerLength > 30) baseScore += 15;
  else if (answerLength > 15) baseScore += 10;
  else baseScore -= 15;
  
  // Content analysis
  const qualityWords = ['experience', 'project', 'team', 'result', 'achieved', 'implemented', 'developed', 'managed', 'improved', 'solved', 'challenge', 'solution', 'learned', 'successful', 'led', 'created', 'designed', 'optimized'];
  const qualityCount = qualityWords.filter(word => answer.toLowerCase().includes(word)).length;
  baseScore += qualityCount * 3;
  
  // Question-specific adjustments
  if (questionType === 'technical' && (answer.includes('code') || answer.includes('algorithm') || answer.includes('system'))) {
    baseScore += 10;
  }
  if (questionType === 'behavioral' && (answer.includes('situation') || answer.includes('action') || answer.includes('result'))) {
    baseScore += 12;
  }
  
  // Cap the score
  const finalScore = Math.min(Math.max(baseScore, 25), 90);
  
  // Generate dynamic feedback
  const userPrefix = userName ? `${userName}, ` : '';
  
  let feedback = '';
  let interviewerResponse = '';
  
  if (finalScore >= 80) {
    feedback = `${userPrefix}that was an excellent response! You provided comprehensive details and demonstrated strong understanding of the topic.`;
    interviewerResponse = `${userPrefix}I'm impressed with your detailed answer. You clearly have solid experience in this area. Let me ask you something that builds on this...`;
  } else if (finalScore >= 65) {
    feedback = `${userPrefix}that was a solid response. You addressed the key points well, though you could enhance it with more specific examples.`;
    interviewerResponse = `${userPrefix}thank you for that answer. I'd like to dive deeper into your experience. Can you tell me more about...`;
  } else if (finalScore >= 45) {
    feedback = `${userPrefix}you touched on the right areas, but I'd encourage you to provide more detailed examples and specific outcomes.`;
    interviewerResponse = `${userPrefix}I appreciate your response. For our next question, try to include more specific examples from your experience...`;
  } else {
    feedback = `${userPrefix}your answer was quite brief. In interviews, it's valuable to provide comprehensive responses with specific examples from your experience.`;
    interviewerResponse = `${userPrefix}let's try to elaborate more on your experiences. For this next question, think about specific examples you can share...`;
  }

  return {
    score: finalScore,
    strengths: finalScore >= 70 ? ["Demonstrated relevant experience", "Clear communication"] : ["Addressed the question"],
    improvements: finalScore < 70 ? ["Provide more specific examples", "Elaborate on outcomes and results"] : ["Continue with detailed responses"],
    suggestions: [
      "Include specific metrics and results when possible",
      "Use the STAR method for behavioral questions (Situation, Task, Action, Result)",
      "Connect your examples directly to the role requirements"
    ],
    skillAssessment: {
      "Communication": Math.min(finalScore + 5, 95),
      "Technical Knowledge": questionType === 'technical' ? finalScore : finalScore - 10,
      "Problem Solving": finalScore,
      "Leadership": answerLength > 50 && answer.toLowerCase().includes('team') ? finalScore + 5 : finalScore - 15,
      "Confidence": finalScore
    },
    detailedFeedback: feedback,
    confidenceLevel: finalScore,
    behavioralAnalysis: {
      score: finalScore,
      hesitations: Math.floor(Math.random() * 3),
      fillerWords: Math.floor(Math.random() * 2),
      confidentLanguage: Math.floor(finalScore / 10),
      suggestions: ["Continue with clear, confident communication"]
    },
    interviewerResponse: interviewerResponse
  };
}*/





/*

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// Define interfaces for the analysis response
interface SkillAssessment {
  Communication: number;
  TechnicalKnowledge: number;
  ProblemSolving: number;
  Leadership: number;
  Confidence: number;
}

interface BehavioralAnalysis {
  score: number;
  hesitations: number;
  fillerWords: number;
  confidentLanguage: number;
  suggestions: string[];
}

interface AnalysisResponse {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  skillAssessment: SkillAssessment;
  detailedFeedback: string;
  confidenceLevel: number;
  behavioralAnalysis: BehavioralAnalysis;
  interviewerResponse: string;
  correctedAnswer: string;
  expectedAnswer: string;
  followUpQuestion: string | null;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Groq API key is available
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 503 }
      );
    }

    const { 
      question, 
      answer, 
      questionType, 
      jobTitle, 
      skills, 
      experience,
      userName,
      previousAnswers = [],
      companyName = '',
      assessmentType = 'default',
      isFollowUpResponse = false,
      isFirstQuestion = false
    } = await request.json();

    // Handle empty or very short responses
    if (!answer || answer.trim().length < 5) {
      if (isFirstQuestion) {
        return NextResponse.json(getFirstQuestionAnalysis(question, userName));
      } else {
        return NextResponse.json(getEmptyResponseAnalysis(question, userName, isFollowUpResponse));
      }
    }

    // Create a comprehensive prompt for realistic interview feedback
    const prompt = `You are an expert AI interviewer conducting a professional interview. Analyze this candidate's response and provide personalized, constructive feedback.

INTERVIEW CONTEXT:
- Position: ${jobTitle}
- Company: ${companyName || 'the company'}
- Assessment Type: ${assessmentType}
- Required Experience: ${experience}
- Key Skills: ${skills?.join(', ') || 'General skills'}
- Candidate Name: ${userName || 'the candidate'}
- Question Type: ${questionType}
- Is Follow-up Response: ${isFollowUpResponse ? 'Yes' : 'No'}
- Is First Question: ${isFirstQuestion ? 'Yes' : 'No'}

QUESTION ASKED:
"${question}"

CANDIDATE'S RESPONSE:
"${answer}"

ANALYSIS REQUIREMENTS:
1. Provide a realistic score (50-95 range)
2. Give specific, actionable feedback based on their actual response
3. Reference the candidate by name when possible
4. Assess communication skills, content depth, and relevance
5. Provide a CORRECTED_ANSWER that shows how to improve their specific response
6. Provide an EXPECTED_ANSWER that represents an ideal response
7. If the answer was weak (score < 70), ask a FOLLOW-UP_QUESTION to clarify or explore further
8. Make the INTERVIEWER_RESPONSE sound natural and conversational
9. Be encouraging and constructive
10. Base scoring on: relevance (30%), depth (30%), clarity (20%), examples (20%)

SCORING GUIDELINES:
- 85-95: Excellent - comprehensive, specific examples, clear structure
- 75-84: Good - relevant, good details, could use more examples
- 65-74: Satisfactory - addresses question, needs more depth
- 50-64: Needs improvement - brief, lacks specifics, unclear

You must respond with valid JSON only. Use this exact structure:
{
  "score": 75,
  "strengths": ["specific strength based on their actual words"],
  "improvements": ["specific area to improve based on their response"],
  "suggestions": ["actionable suggestion for better answers"],
  "skillAssessment": {
    "Communication": 80,
    "Technical Knowledge": 70,
    "Problem Solving": 75,
    "Leadership": 65,
    "Confidence": 80
  },
  "detailedFeedback": "Personalized paragraph explaining their performance, what they did well, what needs work.",
  "confidenceLevel": 75,
  "behavioralAnalysis": {
    "score": 75,
    "hesitations": 2,
    "fillerWords": 1,
    "confidentLanguage": 8,
    "suggestions": ["specific behavioral improvement"]
  },
  "interviewerResponse": "What the AI interviewer would say next - natural, conversational feedback that acknowledges their specific answer and provides guidance. Sound like a real person.",
  "correctedAnswer": "An improved version of the candidate's actual answer that addresses the weaknesses while keeping their original intent",
  "expectedAnswer": "An ideal answer for this question that demonstrates expertise and best practices",
  "followUpQuestion": ${isFollowUpResponse ? 'null' : '"A natural follow-up question to ask for clarification or more details, or null if no follow-up is needed"'}
}`;

    // Use Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview analyst providing realistic, conversational feedback. Always respond with valid JSON only. Be natural and constructive.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errorData);
      
      return NextResponse.json(getEnhancedFallbackAnalysis(question, answer, userName, questionType, isFollowUpResponse));
    }

    const data = await groqResponse.json();
    const analysisText = data.choices[0].message.content;
    
    const cleanAnalysisText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
    
    let analysis: AnalysisResponse;
    try {
      analysis = JSON.parse(cleanAnalysisText) as AnalysisResponse;
      
      // Ensure score is within reasonable bounds
      if (analysis.score < 50) {
        analysis.score = Math.max(50, analysis.score);
      }
      
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(getEnhancedFallbackAnalysis(question, answer, userName, questionType, isFollowUpResponse));
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error analyzing answer with Groq:', error);
    return NextResponse.json(
      { error: 'Failed to analyze answer' },
      { status: 500 }
    );
  }
}

// Special analysis for first question with short answer
function getFirstQuestionAnalysis(question: string, userName: string): AnalysisResponse {
  const userPrefix = userName ? `${userName}, ` : '';
  
  return {
    score: 60,
    strengths: ["Willingness to begin the interview", "Engagement with the process"],
    improvements: ["Provide more detailed responses as we continue", "Share specific examples from your experience"],
    suggestions: [
      "Try to provide at least 2-3 sentences in your responses",
      "Include specific examples from your work experience",
      "Use the STAR method (Situation, Task, Action, Result) for behavioral questions"
    ],
    skillAssessment: {
      Communication: 60,
      TechnicalKnowledge: 60,
      ProblemSolving: 60,
      Leadership: 60,
      Confidence: 60
    },
    detailedFeedback: `${userPrefix}thank you for starting our interview. I appreciate your engagement. As we continue, please try to provide more detailed responses with specific examples from your experience.`,
    confidenceLevel: 60,
    behavioralAnalysis: {
      score: 60,
      hesitations: 2,
      fillerWords: 1,
      confidentLanguage: 5,
      suggestions: ["Continue to speak clearly and provide detailed examples"]
    },
    interviewerResponse: `${userPrefix}thank you for that introduction. Let's continue with our next question to learn more about your background and experience.`,
    correctedAnswer: "A better response would include specific examples from your experience, your educational background, and your professional interests.",
    expectedAnswer: "An ideal introduction would cover your educational background, key professional experiences, specific skills, and what motivates you in this field.",
    followUpQuestion: null
  };
}

// Special analysis for empty or very short responses
function getEmptyResponseAnalysis(question: string, userName: string, isFollowUpResponse: boolean): AnalysisResponse {
  const userPrefix = userName ? `${userName}, ` : '';
  
  return {
    score: 50,
    strengths: ["Willingness to attempt the question"],
    improvements: ["Provide a more detailed response", "Share specific examples from your experience"],
    suggestions: [
      "Try to provide at least 2-3 sentences in your response",
      "Include specific examples from your work experience",
      "Use the STAR method (Situation, Task, Action, Result) for behavioral questions"
    ],
    skillAssessment: {
      Communication: 50,
      TechnicalKnowledge: 50,
      ProblemSolving: 50,
      Leadership: 50,
      Confidence: 45
    },
    detailedFeedback: `${userPrefix}your response was quite brief. For interview questions, it's important to provide comprehensive answers with specific examples from your experience.`,
    confidenceLevel: 50,
    behavioralAnalysis: {
      score: 50,
      hesitations: 3,
      fillerWords: 2,
      confidentLanguage: 3,
      suggestions: ["Practice speaking more confidently and elaborating on your points"]
    },
    interviewerResponse: `${userPrefix}I appreciate your attempt. Let me ask that question again with some guidance - please try to provide more detail about your experience and thought process.`,
    correctedAnswer: "A better response would include specific examples from your experience, your thought process in approaching the problem, and the outcomes or results of your actions.",
    expectedAnswer: "An ideal answer would demonstrate your expertise through specific examples, show your problem-solving process, and highlight measurable results or outcomes.",
    followUpQuestion: isFollowUpResponse ? null : "Could you elaborate on your experience with this topic? Please provide a specific example."
  };
}

// Enhanced fallback analysis
function getEnhancedFallbackAnalysis(question: string, answer: string, userName: string, questionType: string, isFollowUpResponse: boolean = false): AnalysisResponse {
  const answerWords = answer.trim().split(/\s+/);
  const answerLength = answerWords.length;
  
  let baseScore = 65;
  
  // More realistic scoring based on content
  if (answerLength > 80) baseScore = 80;
  else if (answerLength > 40) baseScore = 70;
  else if (answerLength > 15) baseScore = 60;
  else if (answerLength > 5) baseScore = 55;
  else baseScore = 50;

  const userPrefix = userName ? `${userName}, ` : '';
  
  let feedback = '';
  let interviewerResponse = '';
  let followUpQuestion = null;

  if (baseScore >= 75) {
    feedback = `${userPrefix}that was a good response. You provided relevant details and demonstrated understanding of the topic.`;
    interviewerResponse = `${userPrefix}thank you for that comprehensive answer. You clearly have solid experience in this area.`;
  } else if (baseScore >= 65) {
    feedback = `${userPrefix}you addressed the main points well. Consider adding more specific examples to strengthen your response.`;
    interviewerResponse = `${userPrefix}thank you for your response. That gives me a good understanding of your approach.`;
    if (!isFollowUpResponse) {
      followUpQuestion = "Could you provide a specific example to illustrate your point?";
    }
  } else {
    feedback = `${userPrefix}your response was quite brief. In professional settings, it's important to provide comprehensive answers with specific examples.`;
    interviewerResponse = `${userPrefix}I appreciate your attempt. Let me ask a follow-up question to better understand your experience.`;
    if (!isFollowUpResponse) {
      followUpQuestion = "Can you elaborate more on your experience with this topic? Please provide a specific example.";
    }
  }

  return {
    score: baseScore,
    strengths: baseScore >= 60 ? ["Relevant response", "Clear communication"] : ["Attempted to answer"],
    improvements: baseScore < 65 ? ["Add more specific examples", "Provide more detail"] : ["Continue with detailed responses"],
    suggestions: [
      "Include specific metrics when possible",
      "Use concrete examples from your experience",
      "Explain your thought process clearly"
    ],
    skillAssessment: {
      Communication: Math.max(50, baseScore),
      TechnicalKnowledge: questionType === 'technical' ? baseScore : Math.max(45, baseScore - 5),
      ProblemSolving: baseScore,
      Leadership: baseScore,
      Confidence: Math.max(45, baseScore - 5)
    },
    detailedFeedback: feedback,
    confidenceLevel: baseScore,
    behavioralAnalysis: {
      score: baseScore,
      hesitations: 0,
      fillerWords: 0,
      confidentLanguage: 0,
      suggestions: ["Maintain clear and confident communication"]
    },
    interviewerResponse: interviewerResponse,
    correctedAnswer: "An improved answer would include specific examples, measurable results, and clearer connections to the role requirements.",
    expectedAnswer: "An ideal response demonstrates expertise through specific examples, shows problem-solving approach, and highlights relevant outcomes.",
    followUpQuestion: followUpQuestion
  };
}


*/












// OpenRouter API key

/*
// C:\Users\AATMAJA\ai-mock-interview\app\api\analyze-answer\route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// ... (keep all your existing interfaces)
// Define interfaces for the analysis response
interface SkillAssessment {
  Communication: number;
  TechnicalKnowledge: number;
  ProblemSolving: number;
  Leadership: number;
  Confidence: number;
}

interface BehavioralAnalysis {
  score: number;
  hesitations: number;
  fillerWords: number;
  confidentLanguage: number;
  suggestions: string[];
}

interface AnalysisResponse {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  skillAssessment: SkillAssessment;
  detailedFeedback: string;
  confidenceLevel: number;
  behavioralAnalysis: BehavioralAnalysis;
  interviewerResponse: string;
  correctedAnswer: string;
  expectedAnswer: string;
  followUpQuestion: string | null;
}

export async function POST(request: NextRequest) {
  try {
    // Debug logging for API key
    console.log('OpenRouter key present:', !!process.env.OPENROUTER_API_KEY, 'len:', process.env.OPENROUTER_API_KEY?.length);
    
    // Check if OpenRouter API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 503 }
      );
    }

    const { 
      question, 
      answer, 
      questionType, 
      jobTitle, 
      skills, 
      experience,
      userName,
      previousAnswers = [],
      companyName = '',
      correctAnswer = '',
      isFollowUpResponse = false,
      isFirstQuestion = false
    } = await request.json();

    // Handle empty or very short responses - but don't penalize for first question
    if (!answer || answer.trim().length < 5) {
      if (isFirstQuestion) {
        console.log('First question with short answer, providing gentle guidance');
        return NextResponse.json(getFirstQuestionAnalysis(question, userName));
      } else {
        console.log('Empty or very short answer detected, providing guidance');
        return NextResponse.json(getEmptyResponseAnalysis(question, userName, isFollowUpResponse));
      }
    }

    // Create a comprehensive prompt for dynamic feedback
    const prompt = `You are an expert AI interviewer conducting a professional interview. Analyze this candidate's response and provide personalized, constructive feedback.

INTERVIEW CONTEXT:
- Position: ${jobTitle}
- Company: ${companyName || 'the company'}
- Required Experience: ${experience}
- Key Skills: ${skills?.join(', ') || 'General skills'}
- Candidate Name: ${userName || 'the candidate'}
- Question Type: ${questionType}
- Is Follow-up Response: ${isFollowUpResponse ? 'Yes' : 'No'}
- Is First Question: ${isFirstQuestion ? 'Yes' : 'No'}

QUESTION ASKED:
"${question}"

CANDIDATE'S RESPONSE:
"${answer}"

${correctAnswer ? `IDEAL ANSWER REFERENCE:
"${correctAnswer}"` : ''}

${previousAnswers.length > 0 ? `
PREVIOUS PERFORMANCE:
${previousAnswers.map((prev: any, idx: number) => 
  `Q${idx + 1}: Score ${prev.score}% - ${prev.answer.substring(0, 100)}...`
).join('\n')}` : ''}

ANALYSIS REQUIREMENTS:
1. Provide a realistic score (50-95 range, avoid scores below 50 unless the answer is completely wrong or irrelevant)
2. Give specific, actionable feedback based on the actual content of their response
3. Reference the candidate by name when possible
4. Compare their answer to what excellent candidates typically say
5. Suggest specific improvements for this exact scenario
6. Assess communication skills, content depth, and relevance BASED ON THEIR ACTUAL WORDS
7. If provided, compare against the ideal answer reference
8. Provide a CORRECTED_ANSWER that shows how the candidate could improve their response
9. Provide an EXPECTED_ANSWER that represents an ideal response for this question
10. If the answer was poor (score < 65), ask a FOLLOW-UP_QUESTION to clarify or explore the topic further
11. If this is a response to a follow-up question (isFollowUpResponse=true), provide more detailed analysis
12. Be encouraging and constructive, not overly critical
13. DO NOT ASSUME what the candidate knows or doesn't know - base everything on their actual response
14. If they didn't mention something, don't penalize them for it unless it's directly relevant to the question

IMPORTANT SCORING GUIDELINES:
- Minimum score should be 50 for any substantive attempt to answer
- Scores 50-65: Needs improvement but shows some understanding
- Scores 65-75: Solid response with room for improvement
- Scores 75-85: Good to very good response
- Scores 85-95: Excellent response

You must respond with valid JSON only. Use this exact structure:
{
  "score": 75,
  "strengths": [
    "specific strength based on their actual words",
    "another strength they demonstrated"
  ],
  "improvements": [
    "specific area to improve based on their response",
    "another specific improvement"
  ],
  "suggestions": [
    "actionable suggestion for better answers",
    "specific technique they should use",
    "example of what they could have added"
  ],
  "skillAssessment": {
    "Communication": 80,
    "Technical Knowledge": 70,
    "Problem Solving": 75,
    "Leadership": 65,
    "Confidence": 80
  },
  "detailedFeedback": "Personalized paragraph addressing them by name, explaining their performance, what they did well, what needs work, and how to improve. Make it sound like a real interviewer speaking to them.",
  "confidenceLevel": 75,
  "behavioralAnalysis": {
    "score": 75,
    "hesitations": 2,
    "fillerWords": 1,
    "confidentLanguage": 8,
    "suggestions": [
      "specific behavioral improvement suggestion"
    ]
  },
  "interviewerResponse": "What the AI interviewer would say next - personalized feedback as if speaking directly to the candidate, acknowledging their specific answer content and providing guidance.",
  "correctedAnswer": "An improved version of the candidate's answer that addresses the weaknesses while keeping their original intent",
  "expectedAnswer": "An ideal answer for this question that demonstrates expertise and best practices",
  "followUpQuestion": ${isFollowUpResponse ? 'null' : '"A follow-up question to ask the candidate to clarify or expand on their response, or null if no follow-up is needed"'}
}`;

    // Use OpenRouter API with enhanced JSON mode
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000', // Required by OpenRouter
        'X-Title': 'AI Mock Interview' // Required by OpenRouter
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5:free', // Free model option
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview analyst providing detailed, personalized feedback. Always respond with valid JSON only. Do not include any markdown formatting or code blocks. Adjust skill assessment scores based on actual answer quality. Be encouraging and constructive. Base all assessments ONLY on what the candidate actually said.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.text();
      console.error('OpenRouter API error:', openRouterResponse.status, errorData);
      
      // Fallback to enhanced static analysis if API fails
      return NextResponse.json(getEnhancedFallbackAnalysis(question, answer, userName, questionType, isFollowUpResponse));
    }

    const data = await openRouterResponse.json();
    console.log('OpenRouter API success:', data.choices?.[0]?.message?.content?.substring(0, 100));
    
    // Extract the AI response
    const analysisText = data.choices[0].message.content;
    
    // Clean and parse the JSON response
    const cleanAnalysisText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
    
    let analysis: AnalysisResponse;
    try {
      analysis = JSON.parse(cleanAnalysisText) as AnalysisResponse;
      console.log('Successfully parsed OpenRouter response');
      
      // Ensure score is within reasonable bounds
      if (analysis.score < 50) {
        analysis.score = Math.max(50, analysis.score);
      }
      
      // Ensure skill assessments are reasonable
      Object.keys(analysis.skillAssessment).forEach(skill => {
        const skillKey = skill as keyof SkillAssessment;
        analysis.skillAssessment[skillKey] = Math.max(40, Math.min(analysis.skillAssessment[skillKey], 95));
      });
      
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', analysisText);
      
      // Return enhanced fallback response if parsing fails
      return NextResponse.json(getEnhancedFallbackAnalysis(question, answer, userName, questionType, isFollowUpResponse));
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error analyzing answer with OpenRouter:', error);
    return NextResponse.json(
      { error: 'Failed to analyze answer' },
      { status: 500 }
    );
  }
}
function getFirstQuestionAnalysis(question: string, userName: string): AnalysisResponse {
  const userPrefix = userName ? `${userName}, ` : '';
  
  return {
    score: 60,
    strengths: ["Willingness to begin the interview", "Engagement with the process"],
    improvements: ["Provide more detailed responses as we continue", "Share specific examples from your experience"],
    suggestions: [
      "Try to provide at least 2-3 sentences in your responses",
      "Include specific examples from your work experience",
      "Use the STAR method (Situation, Task, Action, Result) for behavioral questions"
    ],
    skillAssessment: {
      Communication: 60,
      TechnicalKnowledge: 60,
      ProblemSolving: 60,
      Leadership: 60,
      Confidence: 60
    },
    detailedFeedback: `${userPrefix}thank you for starting our interview. I appreciate your engagement. As we continue, please try to provide more detailed responses with specific examples from your experience.`,
    confidenceLevel: 60,
    behavioralAnalysis: {
      score: 60,
      hesitations: 2,
      fillerWords: 1,
      confidentLanguage: 5,
      suggestions: ["Continue to speak clearly and provide detailed examples"]
    },
    interviewerResponse: `${userPrefix}let's continue with our interview. Remember to provide specific examples from your experience.`,
    correctedAnswer: "A better response would include specific examples from your experience, your thought process in approaching web application design, and the outcomes or results of your approach.",
    expectedAnswer: "An ideal answer would demonstrate your expertise through specific examples, show your design process, and highlight measurable results or outcomes from your approach.",
    followUpQuestion: null
  };
}

// Special analysis for empty or very short responses
function getEmptyResponseAnalysis(question: string, userName: string, isFollowUpResponse: boolean): AnalysisResponse {
  const userPrefix = userName ? `${userName}, ` : '';
  
  return {
    score: 50,
    strengths: ["Willingness to attempt the question"],
    improvements: ["Provide a more detailed response", "Share specific examples from your experience"],
    suggestions: [
      "Try to provide at least 2-3 sentences in your response",
      "Include specific examples from your work experience",
      "Use the STAR method (Situation, Task, Action, Result) for behavioral questions"
    ],
    skillAssessment: {
      Communication: 50,
      TechnicalKnowledge: 50,
      ProblemSolving: 50,
      Leadership: 50,
      Confidence: 45
    },
    detailedFeedback: `${userPrefix}your response was quite brief. For interview questions, it's important to provide comprehensive answers with specific examples from your experience.`,
    confidenceLevel: 50,
    behavioralAnalysis: {
      score: 50,
      hesitations: 3,
      fillerWords: 2,
      confidentLanguage: 3,
      suggestions: ["Practice speaking more confidently and elaborating on your points"]
    },
    interviewerResponse: `${userPrefix}let me ask that question again. Please try to provide more detail about your experience and thought process.`,
    correctedAnswer: "A better response would include specific examples from your experience, your thought process in approaching the problem, and the outcomes or results of your actions.",
    expectedAnswer: "An ideal answer would demonstrate your expertise through specific examples, show your problem-solving process, and highlight measurable results or outcomes.",
    followUpQuestion: isFollowUpResponse ? null : "Could you elaborate on your experience with this topic? Please provide a specific example."
  };
}

// Enhanced fallback analysis that's more dynamic
function getEnhancedFallbackAnalysis(question: string, answer: string, userName: string, questionType: string, isFollowUpResponse: boolean = false): AnalysisResponse {
  const answerWords = answer.trim().split(/\s+/);
  const answerLength = answerWords.length;
  
  // More sophisticated scoring - ensure minimum score of 50
  let baseScore = 55;
  
  // Length scoring
  if (answerLength > 100) baseScore += 20;
  else if (answerLength > 60) baseScore += 15;
  else if (answerLength > 30) baseScore += 10;
  else if (answerLength > 15) baseScore += 5;
  else if (answerLength > 5) baseScore += 2;
  else baseScore = 50; // Minimum score
  
  // Content analysis
  const qualityWords = ['experience', 'project', 'team', 'result', 'achieved', 'implemented', 'developed', 'managed', 'improved', 'solved', 'challenge', 'solution', 'learned', 'successful', 'led', 'created', 'designed', 'optimized'];
  const qualityCount = qualityWords.filter(word => answer.toLowerCase().includes(word)).length;
  baseScore += qualityCount * 2;
  
  // Question-specific adjustments
  if (questionType === 'technical' && (answer.includes('code') || answer.includes('algorithm') || answer.includes('system'))) {
    baseScore += 8;
  }
  if (questionType === 'behavioral' && (answer.includes('situation') || answer.includes('action') || answer.includes('result'))) {
    baseScore += 10;
  }
  
  // Cap the score
  const finalScore = Math.min(Math.max(baseScore, 50), 90); // Ensure minimum of 50
  
  // Generate dynamic feedback
  const userPrefix = userName ? `${userName}, ` : '';
  
  let feedback = '';
  let interviewerResponse = '';
  let followUpQuestion = null;
  
  if (finalScore >= 80) {
    feedback = `${userPrefix}that was an excellent response! You provided comprehensive details and demonstrated strong understanding of the topic.`;
    interviewerResponse = `${userPrefix}I'm impressed with your detailed answer. You clearly have solid experience in this area. Let me ask you something that builds on this...`;
  } else if (finalScore >= 65) {
    feedback = `${userPrefix}that was a solid response. You addressed the key points well, though you could enhance it with more specific examples.`;
    interviewerResponse = `${userPrefix}thank you for that answer. I'd like to dive deeper into your experience.`;
  } else if (finalScore >= 55) {
    feedback = `${userPrefix}you touched on the right areas, but I'd encourage you to provide more detailed examples and specific outcomes.`;
    interviewerResponse = `${userPrefix}I appreciate your response. Let me ask a follow-up to better understand your approach...`;
    followUpQuestion = "Can you provide a specific example to illustrate your point?";
  } else {
    feedback = `${userPrefix}your answer was quite brief. In interviews, it's valuable to provide comprehensive responses with specific examples from your experience.`;
    interviewerResponse = `${userPrefix}let me ask a follow-up question to better understand your experience in this area.`;
    followUpQuestion = "Can you elaborate on your experience with this topic? Please provide a specific example.";
  }

  // Only include follow-up question if this is not already a response to a follow-up
  if (isFollowUpResponse) {
    followUpQuestion = null;
  }

  return {
    score: finalScore,
    strengths: finalScore >= 60 ? ["Demonstrated relevant experience", "Clear communication"] : ["Attempted to address the question"],
    improvements: finalScore < 60 ? ["Provide more specific examples", "Elaborate on outcomes and results"] : ["Continue with detailed responses"],
    suggestions: [
      "Include specific metrics and results when possible",
      "Use the STAR method for behavioral questions (Situation, Task, Action, Result)",
      "Connect your examples directly to the role requirements"
    ],
    skillAssessment: {
      Communication: Math.min(finalScore + 5, 95),
      TechnicalKnowledge: questionType === 'technical' ? finalScore : finalScore - 5,
      ProblemSolving: finalScore,
      Leadership: answerLength > 50 && answer.toLowerCase().includes('team') ? finalScore + 5 : finalScore - 10,
      Confidence: finalScore
    },
    detailedFeedback: feedback,
    confidenceLevel: finalScore,
    behavioralAnalysis: {
      score: finalScore,
      hesitations: Math.floor(Math.random() * 3),
      fillerWords: Math.floor(Math.random() * 2),
      confidentLanguage: Math.floor(finalScore / 10),
      suggestions: ["Continue with clear, confident communication"]
    },
    interviewerResponse: interviewerResponse,
    correctedAnswer: "An improved version of your answer would include more specific examples, measurable results, and a clearer connection to the role requirements.",
    expectedAnswer: "An ideal answer for this question would demonstrate deep expertise, provide specific examples with measurable outcomes, and clearly articulate how your experience aligns with the role requirements.",
    followUpQuestion: followUpQuestion
  };
}
*/




//C:\Users\AATMAJA\ai-mock-interview\app\api\analyze-answer\route.ts

//C:\Users\AATMAJA\ai-mock-interview\app\api\analyze-answer\route.ts

//C:\Users\AATMAJA\ai-mock-interview\app\api\analyze-answer\route.ts

// app/api/analyze-answer/route.ts
// app/api/analyze-answer/route.ts
/*import { NextRequest, NextResponse } from 'next/server';

interface AnalysisResponse {
  score: number;
  contentScore: number;
  behavioralScore: number;
  voiceScore: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  skillAssessment: {
    [key: string]: number;
  };
  detailedFeedback: string;
  confidenceLevel: number;
  behavioralAnalysis?: any;
  voiceAnalysis?: any;
  comprehensiveFeedback?: any;
  interviewerResponse: string;
  correctedAnswer: string;
  expectedAnswer: string;
  followUpQuestion: string | null;
}

// NEW: Enhance first question analysis - MOVED BEFORE getRealAIAnalysis
function enhanceFirstQuestionAnalysis(analysis: AnalysisResponse, answer: string, userName: string): AnalysisResponse {
  const userPrefix = userName ? `${userName}, ` : '';
  const wordCount = answer.trim().split(/\s+/).length;
  
  // Ensure first questions get proper, varied scores
  if (analysis.score > 80 && wordCount < 50) {
    analysis.score = Math.min(75, analysis.score - 10);
    analysis.contentScore = Math.min(75, analysis.contentScore - 10);
  }
  
  // Ensure detailed feedback for first questions
  if (analysis.detailedFeedback?.includes('thank you') && !analysis.detailedFeedback.includes('specific')) {
    analysis.detailedFeedback = `${userPrefix}For your first response, ${wordCount > 30 ? 'you provided a good amount of detail' : 'try to provide more specific examples'}. ${analysis.detailedFeedback}`;
  }
  
  return analysis;
}

// ENHANCED: Update prompt builder with context
function buildDynamicPrompt(
  question: string,
  answer: string,
  userName: string,
  questionType: string,
  difficulty: string,
  category: string,
  followUpCount: number,
  isFollowUpResponse: boolean,
  performanceScore: number,
  conversationContext: string[],
  behavioralData: any,
  voiceData: any,
  context?: any
): string {
  
  const contextInfo = context ? `
ADDITIONAL CONTEXT:
- Assessment Type: ${context.assessmentType || 'Interview'}
- Job Title: ${context.jobTitle || 'Not specified'}
- Field: ${context.fieldCategory || 'General'}
- Skills: ${context.skills?.join(', ') || 'Not specified'}
- Experience: ${context.experience || 'Not specified'}
- First Question Chain: ${context.isFirstQuestionChain ? 'Yes' : 'No'}
` : '';

  return `Analyze this interview response and provide SPECIFIC, DYNAMIC feedback based on the ACTUAL answer content.

INTERVIEW DETAILS:
Question: "${question}"
Question Type: ${questionType}
Difficulty: ${difficulty}
Category: ${category}
${isFollowUpResponse ? `Follow-up Round: ${followUpCount + 1}` : 'Main Question'}
${contextInfo}

CANDIDATE'S ACTUAL ANSWER:
"${answer}"

CRITICAL REQUIREMENTS:
1. Provide REALISTIC scores (40-95) based on actual answer quality
2. Give SPECIFIC feedback about THIS answer, not generic advice
3. Suggest follow-up questions that probe deeper into THIS response
4. Vary scores based on content quality, length, and relevance

SCORING GUIDELINES:
- 85-95: Excellent (comprehensive, specific examples, well-structured)
- 75-84: Good (covers main points, some examples, clear)
- 65-74: Satisfactory (addresses question, needs more detail)
- 50-64: Needs Improvement (brief, vague, lacks examples)
- Below 50: Poor (very brief, irrelevant, or unclear)

RESPONSE FORMAT (JSON):
{
  "score": <REAL score based on guidelines above>,
  "contentScore": <score for answer content>,
  "behavioralScore": <score for delivery and professionalism>,
  "voiceScore": <score for vocal qualities>,
  "strengths": [<2-3 SPECIFIC strengths from this answer>],
  "improvements": [<2-3 SPECIFIC areas this answer needs work>],
  "suggestions": [<3-4 ACTIONABLE tips for this type of answer>],
  "skillAssessment": {
    "Communication": <score>,
    "Problem Solving": <score>,
    "Technical Knowledge": <score>,
    "Confidence": <score>,
    "Professionalism": <score>
  },
  "detailedFeedback": "<SPECIFIC technical assessment of THIS answer - 3-4 sentences>",
  "confidenceLevel": <score>,
  "interviewerResponse": "<NATURAL 1-2 sentence response an interviewer would say>",
  "correctedAnswer": "<SPECIFIC improvements for THIS answer - 2-3 sentences>",
  "expectedAnswer": "<What an ideal answer would include for THIS question>",
  "followUpQuestion": "<follow-up question that probes deeper into THIS answer OR null if not needed>"
}

IMPORTANT: Make ALL feedback SPECIFIC to this actual answer content!`;
}

// REAL AI ANALYSIS using Groq - UPDATED SIGNATURE
async function getRealAIAnalysis(
  question: string,
  answer: string,
  userName: string,
  questionType: string,
  difficulty: string,
  category: string,
  followUpCount: number,
  isFollowUpResponse: boolean,
  performanceScore: number,
  conversationContext: string[],
  behavioralData: any,
  voiceData: any,
  // ADD THIS NEW PARAMETER
  context?: any
): Promise<AnalysisResponse> {
  
  const prompt = buildDynamicPrompt(
    question,
    answer,
    userName,
    questionType,
    difficulty,
    category,
    followUpCount,
    isFollowUpResponse,
    performanceScore,
    conversationContext,
    behavioralData,
    voiceData,
    context // PASS THE CONTEXT HERE
  );

  try {
    // ENSURE GROQ API KEY IS AVAILABLE
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not configured');
      throw new Error('AI service not configured');
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are an expert interview coach analyzing candidate responses. Provide SPECIFIC, ACTIONABLE feedback based on the actual answer content. Be constructive and professional.

IMPORTANT: 
- Analyze the ACTUAL answer content, not generic feedback
- Provide DIFFERENT feedback for display vs spoken responses
- Score based on answer quality, not predetermined scores
- Suggest follow-up questions that probe deeper into the specific answer given`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    const analysisText = data.choices[0].message.content;
    
    const cleanAnalysisText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
    
    let analysis: AnalysisResponse;
    try {
      analysis = JSON.parse(cleanAnalysisText) as AnalysisResponse;
      
      // Validate and enhance the analysis
      analysis = validateAndEnhanceAnalysis(analysis, question, answer, userName);
      
      // Apply first question enhancements if needed
      if (context?.isFirstQuestionChain) {
        analysis = enhanceFirstQuestionAnalysis(analysis, answer, userName);
      }
      
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse AI response');
    }

    return analysis;

  } catch (error) {
    console.error('Groq API error:', error);
    // Fallback to dynamic analysis based on content - PASS CONTEXT HERE TOO
    return generateContentBasedAnalysis(question, answer, userName, questionType, followUpCount, context);
  }
}

function validateAndEnhanceAnalysis(
  analysis: AnalysisResponse, 
  question: string, 
  answer: string, 
  userName: string
): AnalysisResponse {
  const userPrefix = userName ? `${userName}, ` : '';
  
  // Ensure scores are realistic
  analysis.score = Math.max(40, Math.min(95, analysis.score || 70));
  analysis.contentScore = Math.max(40, Math.min(95, analysis.contentScore || analysis.score));
  analysis.behavioralScore = Math.max(40, Math.min(95, analysis.behavioralScore || 70));
  analysis.voiceScore = Math.max(40, Math.min(95, analysis.voiceScore || 70));
  analysis.confidenceLevel = Math.max(40, Math.min(95, analysis.confidenceLevel || analysis.score));

  // Ensure feedback is specific and not generic
  if (analysis.detailedFeedback?.includes('good answer') && !analysis.detailedFeedback.includes('specific')) {
    analysis.detailedFeedback = `${userPrefix}Your answer ${answer.length > 100 ? 'provides good detail' : 'is quite brief'}. ${analysis.detailedFeedback}`;
  }

  if (analysis.interviewerResponse?.includes('thank you') && analysis.interviewerResponse.length < 50) {
    analysis.interviewerResponse = `${userPrefix}Thank you for that response. ${analysis.score >= 70 ? 'You addressed the key points well.' : 'Let me ask a follow-up to better understand your approach.'}`;
  }

  // Ensure skill assessment exists
  if (!analysis.skillAssessment || Object.keys(analysis.skillAssessment).length === 0) {
    analysis.skillAssessment = {
      'Communication': analysis.contentScore,
      'Problem Solving': Math.max(40, analysis.contentScore - 5),
      'Technical Knowledge': analysis.contentScore,
      'Confidence': analysis.behavioralScore,
      'Professionalism': analysis.behavioralScore
    };
  }

  // Ensure arrays are not empty
  if (!analysis.strengths || analysis.strengths.length === 0) {
    analysis.strengths = answer.length > 50 ? 
      ['Provided detailed response', 'Good engagement with question'] : 
      ['Attempted to answer the question'];
  }

  if (!analysis.improvements || analysis.improvements.length === 0) {
    analysis.improvements = answer.length < 100 ? 
      ['Add more specific examples', 'Provide more detailed explanations'] : 
      ['Consider adding measurable results', 'Structure response more clearly'];
  }

  if (!analysis.suggestions || analysis.suggestions.length === 0) {
    analysis.suggestions = [
      'Include specific metrics when possible',
      'Use concrete examples from experience',
      'Explain your thought process clearly'
    ];
  }

  return analysis;
}

function generateContentBasedAnalysis(
  question: string,
  answer: string,
  userName: string,
  questionType: string,
  followUpCount: number,
  // ADD CONTEXT PARAMETER
  context?: any
): AnalysisResponse {
  const userPrefix = userName ? `${userName}, ` : '';
  
  // Analyze answer content dynamically
  const wordCount = answer.trim().split(/\s+/).length;
  const hasExamples = /example|for instance|such as|specifically/i.test(answer.toLowerCase());
  const hasMetrics = /\d+%|\d+ years|\d+ projects|\d+ team/i.test(answer);
  const hasStructure = /first|then|next|finally|because|therefore/i.test(answer.toLowerCase());
  
  // Use context for better analysis if available
  const fieldInfo = context?.fieldCategory ? ` in ${context.fieldCategory}` : '';
  const jobContext = context?.jobTitle ? ` for ${context.jobTitle}` : '';
  
  // Dynamic scoring based on content
  let contentScore = 50;
  if (wordCount > 100) contentScore += 20;
  else if (wordCount > 50) contentScore += 15;
  else if (wordCount > 25) contentScore += 10;
  
  if (hasExamples) contentScore += 15;
  if (hasMetrics) contentScore += 10;
  if (hasStructure) contentScore += 10;
  
  contentScore = Math.min(90, contentScore);
  const overallScore = contentScore;

  // Dynamic feedback based on content
  let detailedFeedback = '';
  let interviewerResponse = '';
  let correctedAnswer = '';

  if (contentScore >= 80) {
    detailedFeedback = `${userPrefix}Excellent response${jobContext}! You provided comprehensive details ${hasExamples ? 'with specific examples' : ''} ${hasMetrics ? 'and measurable results' : ''}. Your answer demonstrates strong understanding${fieldInfo}.`;
    interviewerResponse = `${userPrefix}Thank you for that thorough answer. You clearly have solid experience in this area.`;
    correctedAnswer = "Your answer was already strong. To make it even better, you could consider discussing alternative approaches or lessons learned.";
  } else if (contentScore >= 70) {
    detailedFeedback = `${userPrefix}Good response addressing the main points${jobContext}. ${hasExamples ? 'The examples helped illustrate your points.' : 'Consider adding specific examples to strengthen your answer.'}`;
    interviewerResponse = `${userPrefix}Thank you for your response. You covered the key aspects well.`;
    correctedAnswer = "Try to include more specific metrics and outcomes. Instead of 'improved performance', say 'increased efficiency by 25% through process optimization'.";
  } else {
    detailedFeedback = `${userPrefix}Your answer was ${wordCount < 30 ? 'quite brief' : 'a good start'}${jobContext}. In professional settings, it's important to provide comprehensive answers with specific examples and measurable outcomes.`;
    interviewerResponse = `${userPrefix}Thank you for that response. Let me ask a follow-up to better understand your approach.`;
    correctedAnswer = "An improved answer would include: 1) A specific example, 2) Your step-by-step approach, 3) Measurable results, 4) Key learnings from the experience.";
  }

  // Dynamic follow-up question
  let followUpQuestion = null;
  if (contentScore < 80 && followUpCount < 3) {
    if (!hasExamples) {
      followUpQuestion = "Could you provide a specific example from your experience that illustrates this?";
    } else if (!hasMetrics) {
      followUpQuestion = "What were the measurable outcomes or results in that situation?";
    } else {
      followUpQuestion = "Could you walk me through your thought process in more detail?";
    }
  }

  return {
    score: overallScore,
    contentScore,
    behavioralScore: Math.max(60, contentScore - 5),
    voiceScore: Math.max(60, contentScore - 5),
    strengths: hasExamples ? 
      ['Used specific examples', 'Good engagement'] : 
      ['Addressed the question', 'Clear communication'],
    improvements: !hasExamples ? 
      ['Add more specific examples', 'Include measurable results'] : 
      ['Provide more detailed explanations', 'Structure response more clearly'],
    suggestions: [
      'Use the STAR method (Situation, Task, Action, Result)',
      'Include quantifiable metrics',
      'Connect experience to role requirements'
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
    interviewerResponse,
    correctedAnswer,
    expectedAnswer: `An ideal response would include specific examples, measurable outcomes, clear problem-solving methodology, and relevant experience details tailored to ${questionType} questions${fieldInfo}.`,
    followUpQuestion
  };
}

async function handleUserQuestionWithAI(
  userQuestion: string,
  currentQuestion: string,
  userName: string,
  performanceScore: number,
  conversationContext: string[]
): Promise<string> {
  try {
    const prompt = `You are an AI Roleplay. The candidate asked: "${userQuestion}"
    
Current interview question: "${currentQuestion}"
Candidate's name: ${userName || 'Candidate'}
Performance so far: ${performanceScore}%

Provide a helpful, professional response (2-3 sentences max) that:
- Directly answers their question
- Maintains interview flow
- Encourages continuation

Respond naturally as an interviewer would speak:`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a professional, friendly interviewer. Respond naturally and helpfully to candidate questions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (groqResponse.ok) {
      const data = await groqResponse.json();
      return data.choices[0].message.content.trim();
    }
  } catch (error) {
    console.error('Error handling user question:', error);
  }

  // Fallback response
  return `That's a good question${userName ? `, ${userName}` : ''}. I'd be happy to address that. Let me clarify that we're focusing on understanding your experience and approach through these questions.`;
}

function getEmptyResponseAnalysis(question: string, userName: string, isFollowUpResponse: boolean): AnalysisResponse {
  const userPrefix = userName ? `${userName}, ` : '';
  
  return {
    score: 50,
    contentScore: 50,
    behavioralScore: 50,
    voiceScore: 50,
    strengths: ['Willingness to attempt the question'],
    improvements: ['Provide more detailed response', 'Share specific examples'],
    suggestions: [
      'Try to provide at least 2-3 sentences',
      'Include specific examples from your experience',
      'Use the STAR method for behavioral questions'
    ],
    skillAssessment: {
      'Communication': 50,
      'Problem Solving': 50,
      'Technical Knowledge': 50,
      'Confidence': 45,
      'Professionalism': 50
    },
    detailedFeedback: `${userPrefix}Your response was quite brief. For interview questions, it's important to provide comprehensive answers with specific examples from your experience.`,
    confidenceLevel: 50,
    interviewerResponse: `${userPrefix}I appreciate your attempt. Let me ask that question again - please try to provide more detail about your experience and thought process.`,
    correctedAnswer: "A better response would include specific examples from your experience, your thought process in approaching similar situations, and the outcomes or results of your actions.",
    expectedAnswer: "An ideal answer would demonstrate your expertise through specific examples, show your problem-solving methodology, and highlight relevant outcomes.",
    followUpQuestion: isFollowUpResponse ? null : "Could you elaborate on your experience with this topic? Please provide a specific example."
  };
}

function generateDynamicFallbackAnalysis(question: string, answer: string, userName: string): AnalysisResponse {
  return generateContentBasedAnalysis(question, answer, userName, 'general', 0);
}

// MAIN POST HANDLER - MOVED TO BOTTOM
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      question,
      answer,
      userName = '',
      isUserQuestion = false,
      userQuestion = '',
      questionType = 'general',
      difficulty = 'medium',
      category = '',
      followUpCount = 0,
      isFollowUpResponse = false,
      performanceScore = 0,
      conversationContext = [],
      skillProficiency = {},
      behavioralData = {},
      voiceData = {},
      isFirstQuestionChain = false,
      assessmentType,
      jobTitle,
      skills = [],
      experience,
      fieldCategory,
      subject,
      domain,
      focusArea
    } = body;

    console.log('🔍 API Received for analysis:', {
      question: question?.substring(0, 100),
      answer: answer?.substring(0, 100),
      questionType,
      followUpCount,
      isFollowUpResponse,
      isFirstQuestionChain
    });

    // Handle user questions to interviewer
    if (isUserQuestion && userQuestion) {
      const interviewerResponse = await handleUserQuestionWithAI(
        userQuestion,
        question,
        userName,
        performanceScore,
        conversationContext
      );
      
      return NextResponse.json({
        interviewerResponse,
        score: 0,
        contentScore: 0,
        behavioralScore: 0,
        voiceScore: 0,
        strengths: [],
        improvements: [],
        suggestions: [],
        skillAssessment: {},
        detailedFeedback: '',
        confidenceLevel: 0,
        behavioralAnalysis: {},
        voiceAnalysis: {},
        correctedAnswer: '',
        expectedAnswer: '',
        followUpQuestion: null
      });
    }

    // Handle empty or very short answers
    if (!answer || answer.trim().length < 3) {
      return NextResponse.json(getEmptyResponseAnalysis(question, userName, isFollowUpResponse));
    }

    // Use REAL AI for analysis with context
    const analysis = await getRealAIAnalysis(
      question,
      answer,
      userName,
      questionType,
      difficulty,
      category,
      followUpCount,
      isFollowUpResponse,
      performanceScore,
      conversationContext,
      behavioralData,
      voiceData,
      // ADD the context object
      {
        isFirstQuestionChain,
        assessmentType,
        jobTitle,
        skills,
        experience,
        fieldCategory,
        subject,
        domain,
        focusArea
      }
    );

    console.log('✅ Real AI Analysis Generated:', {
      score: analysis.score,
      hasFollowUp: !!analysis.followUpQuestion,
      feedbackLength: analysis.detailedFeedback?.length
    });

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('❌ Error in analyze-answer API:', error);
    
    // FIXED: Properly extract the data from the request
    const requestBody = await request.json();
    const { question, answer, userName = '' } = requestBody;
    
    const fallbackAnalysis = generateDynamicFallbackAnalysis(question, answer, userName);
    
    return NextResponse.json(fallbackAnalysis);
  }
}*/



/*  media pipe

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not available' },
        { status: 503 }
      );
    }

    const body = await request.json();
    
    console.log('🧠 Analyzing answer with data:', {
      questionType: body.questionType,
      answerLength: body.answer?.length || 0,
      isFirstQuestionChain: body.isFirstQuestionChain,
      followUpCount: body.followUpCount
    });

    // Enhanced prompt for better analysis
    const analysisPrompt = `You are an expert interviewer conducting a realistic mock interview. Analyze the candidate's answer and provide comprehensive feedback.

QUESTION: "${body.question}"
CANDIDATE'S ANSWER: "${body.answer || 'No answer provided'}"
QUESTION TYPE: ${body.questionType}
DIFFICULTY: ${body.difficulty || 'medium'}
JOB POSITION: ${body.jobTitle || 'Not specified'}
FIELD: ${body.fieldCategory || 'General'}
SKILLS REQUIRED: ${body.skills ? body.skills.join(', ') : 'Not specified'}
EXPERIENCE LEVEL: ${body.experience || 'Not specified'}
FOLLOW-UP COUNT: ${body.followUpCount || 0}
IS FIRST QUESTION CHAIN: ${body.isFirstQuestionChain ? 'Yes' : 'No'}

Please provide a comprehensive analysis with:

1. CONTENT SCORE (0-100): Based on relevance, depth, examples, and structure
2. BEHAVIORAL SCORE (0-100): Based on confidence, clarity, and professionalism  
3. VOICE SCORE (0-100): Based on delivery, pace, and articulation
4. OVERALL SCORE (0-100): Weighted average
5. SPECIFIC STRENGTHS: 2-3 specific things they did well
6. SPECIFIC IMPROVEMENTS: 2-3 concrete areas for improvement
7. DETAILED FEEDBACK: 2-3 sentences of constructive feedback
8. INTERVIEWER RESPONSE: A natural, conversational response from the interviewer
9. CORRECTED ANSWER: How to improve their specific answer
10. EXPECTED ANSWER: What an ideal answer would include
11. FOLLOW-UP QUESTION: A relevant follow-up question if needed (or null if not needed)

Consider:
- For first questions, be more encouraging and ask clarifying follow-ups
- For technical questions, focus on accuracy and methodology
- For behavioral questions, focus on STAR method and specific examples
- Adjust follow-up questions based on answer quality

Respond with valid JSON only:

{
  "score": 85,
  "contentScore": 80,
  "behavioralScore": 75,
  "voiceScore": 70,
  "strengths": ["Good structure", "Relevant examples"],
  "improvements": ["Add more metrics", "Be more specific"],
  "suggestions": ["Use the STAR method", "Include measurable results"],
  "skillAssessment": {
    "Communication": 80,
    "Problem Solving": 75,
    "Technical Knowledge": 85,
    "Confidence": 70,
    "Professionalism": 75
  },
  "detailedFeedback": "Your answer was good but could be improved with more specific examples...",
  "confidenceLevel": 75,
  "interviewerResponse": "Thank you for that detailed answer. Could you tell me more about...",
  "correctedAnswer": "An improved answer would include...",
  "expectedAnswer": "The ideal response should cover...",
  "followUpQuestion": "Could you provide a specific example of when you used this approach?"
}`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interviewer. Provide detailed, constructive feedback. Always respond with valid JSON only. Be specific and actionable in your feedback.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errorText);
      return NextResponse.json(generateFallbackAnalysis(body));
    }

    const data = await groqResponse.json();
    const analysis = JSON.parse(data.choices[0].message.content);
    
    console.log('✅ Analysis completed:', {
      score: analysis.score,
      hasFollowUp: !!analysis.followUpQuestion,
      feedbackLength: analysis.detailedFeedback?.length
    });

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error in analyze-answer:', error);
    return NextResponse.json(
      generateFallbackAnalysis(await request.json()),
      { status: 500 }
    );
  }
}

function generateFallbackAnalysis(body: any) {
  const answer = body.answer || '';
  const wordCount = answer.split(/\s+/).length;
  
  // Simple content-based scoring as fallback
  let contentScore = 50;
  if (wordCount > 100) contentScore += 20;
  if (wordCount > 50) contentScore += 15;
  if (answer.includes('example')) contentScore += 10;
  if (answer.includes('because')) contentScore += 5;
  
  contentScore = Math.min(85, contentScore);
  
  return {
    score: contentScore,
    contentScore: contentScore,
    behavioralScore: Math.max(50, contentScore - 10),
    voiceScore: Math.max(50, contentScore - 5),
    strengths: ['Good attempt at answering the question', 'Clear communication'],
    improvements: ['Provide more specific examples', 'Include measurable results'],
    suggestions: ['Use the STAR method for behavioral questions', 'Add concrete examples from your experience'],
    skillAssessment: {
      'Communication': contentScore,
      'Problem Solving': Math.max(50, contentScore - 5),
      'Technical Knowledge': contentScore,
      'Confidence': Math.max(50, contentScore - 10),
      'Professionalism': Math.max(50, contentScore - 5)
    },
    detailedFeedback: `Thank you for your response. You've made a good attempt at answering the question. To improve, try to include more specific examples and measurable outcomes.`,
    confidenceLevel: contentScore,
    interviewerResponse: `Thank you for your answer. ${wordCount < 30 ? 'Could you provide more details about that?' : 'Let me ask a follow-up question to better understand your experience.'}`,
    correctedAnswer: "An improved answer would include specific examples, measurable results, and a clearer connection to the role requirements.",
    expectedAnswer: "The ideal response demonstrates expertise through specific examples, shows problem-solving methodology, and highlights relevant outcomes.",
    followUpQuestion: wordCount < 50 ? "Could you provide a specific example to illustrate your point?" : null
  };
}



*/



// app/api/analyze-answer/route.ts
// File: app/api/analyze-answer/route.ts
// File: app/api/analyze-answer/route.ts
// File: app/api/analyze-answer/route.ts
// File: app/api/analyze-answer/route.ts
// File: app/api/analyze-answer/route.ts
// File: app/api/analyze-answer/route.ts
// File: app/api/analyze-answer/route.ts
// File: app/api/analyze-answer/route.ts
import { NextRequest, NextResponse } from 'next/server';

// ========== INTERFACES ==========
interface ConversationEntry {
  question: string;
  answer: string;
  timestamp: number;
  feedback: string;
  score: number;
  intent?: string;
  topic?: string;
  analysis?: string;
}

interface UserIntent {
  type: 'normal' | 'scenario-request' | 'topic-request' | 'programming-request' | 'field-change-request' | 'difficulty-change' | 'topic-query' | 'answer-analysis';
  topic?: string;
  details?: {
    topic?: string;
    language?: string;
    field?: string;
    difficulty?: string;
    analysis?: string;
  };
}

interface AnswerQuality {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  needsClarification: boolean;
  clarificationQuestion?: string;
  analysis?: string;
  extractedTopics?: string[];
  sentiment?: string;
  complexity?: 'low' | 'medium' | 'high';
  suggestedFollowUp?: string;
  answerSummary?: string;
}

interface ProfileContext {
  jobTitle: string;
  fieldCategory: string;
  assessmentType: string;
  skills: string[];
  difficulty: string;
}

// ========== GLOBAL MEMORY ==========
const conversationMemory = new Map<string, ConversationEntry[]>();

// ========== MAIN FUNCTION ==========
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      const bodyText = await request.text();
      if (!bodyText.trim()) {
        console.warn('⚠️ Empty request body');
        return NextResponse.json(fallbackResponse(), { status: 200 });
      }
      
      body = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      return NextResponse.json(fallbackResponse(), { status: 200 });
    }
    
    const { 
      question = '', 
      answer = '', 
      profile = {},
      jobTitle = profile?.title || 'General Communication',
      skills = profile?.skills || [],
      fieldCategory = profile?.fieldCategory || 'Professional',
      assessmentType = profile?.assessmentType || 'general-practice',
      difficulty = profile?.difficulty || 'medium',
      sessionId = 'default'
    } = body;
    
    console.log('🧠 API Request:', {
      question: question?.substring(0, 100) || '(no question)',
      answer: answer?.substring(0, 100) || '(no answer)',
      fieldCategory,
      skills: skills.slice(0, 3)
    });
  
    // Initialize or get conversation memory
    if (!conversationMemory.has(sessionId)) {
      conversationMemory.set(sessionId, []);
    }
    const memory = conversationMemory.get(sessionId)!;
    
    // Create profile context
    const context: ProfileContext = {
      jobTitle,
      fieldCategory,
      assessmentType,
      skills,
      difficulty
    };
    
    // Detect user intent FIRST - this is critical
    const userIntent = detectUserIntent(answer, question, fieldCategory, memory);
    console.log('🎯 User intent detected:', userIntent);

    // Use intelligent analysis first (since Groq is timing out)
    let answerQuality: AnswerQuality;
    
    console.log('🔄 Using intelligent analysis...');
    answerQuality = await analyzeWithIntelligentFallback(
      answer, question, context, memory, userIntent
    );
    
    console.log('📊 Answer quality analyzed:', {
      score: answerQuality.score,
      needsClarification: answerQuality.needsClarification,
      topics: answerQuality.extractedTopics?.slice(0, 3)
    });

    // Store in memory
    memory.push({
      question: question?.substring(0, 200) || '',
      answer: answer?.substring(0, 200) || '',
      timestamp: Date.now(),
      feedback: answerQuality.feedback,
      score: answerQuality.score,
      intent: userIntent.type,
      topic: userIntent.topic,
      analysis: answerQuality.analysis
    });
    
    if (memory.length > 10) {
      conversationMemory.set(sessionId, memory.slice(-10));
    }

    // Generate follow-up question
    const followUpQuestion = generateDynamicFollowUp(
      question, answer, answerQuality, context, memory, userIntent
    );
    
    // Clean up the follow-up question (ensure it's complete)
    let cleanFollowUp = followUpQuestion.trim();
    if (!cleanFollowUp.endsWith('?')) {
      cleanFollowUp += '?';
    }
    
    // Create interviewer response that combines feedback and follow-up
    const interviewerResponse = `${answerQuality.feedback} ${cleanFollowUp}`.trim();
    
    console.log('✅ Response generated:', {
      score: answerQuality.score,
      feedback: answerQuality.feedback.substring(0, 80),
      followUp: cleanFollowUp
    });

    // Build the complete response - ENSURE ALL FIELDS ARE PRESENT
    const responseData = {
      score: answerQuality.score,
      contentScore: answerQuality.score,
      detailedFeedback: answerQuality.feedback,
      interviewerResponse: interviewerResponse,
      strengths: answerQuality.strengths,
      improvements: answerQuality.improvements,
      hasFollowUp: true,
      followUpQuestion: cleanFollowUp,
      feedbackQuestion: cleanFollowUp,
      needsClarification: answerQuality.needsClarification,
      clarificationQuestion: answerQuality.clarificationQuestion || '',
      analysis: answerQuality.analysis || '',
      extractedTopics: answerQuality.extractedTopics || [],
      sentiment: answerQuality.sentiment || 'neutral',
      complexity: answerQuality.complexity || 'medium',
      aiAnalyzed: false,
      requestedTopic: userIntent.topic || undefined,
      answerSummary: answerQuality.answerSummary || '',
      timestamp: Date.now(),
      // ADD THESE CRITICAL FIELDS:
      question: cleanFollowUp, // Some frontends expect this
      feedback: answerQuality.feedback, // Some frontends expect this
      nextQuestion: cleanFollowUp // Some frontends expect this
    };

    console.log('📤 Sending response to frontend with follow-up:', cleanFollowUp.substring(0, 100));
    
    return NextResponse.json(responseData, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ Error in POST handler:', error);
    return NextResponse.json(fallbackResponse(), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// ========== INTENT DETECTION (FIXED) ==========
function detectUserIntent(answer: string, question: string, fieldCategory: string, memory: ConversationEntry[]): UserIntent {
  if (!answer || typeof answer !== 'string') {
    return { 
      type: 'answer-analysis',
      details: { analysis: 'No answer provided' }
    };
  }
  
  const answerTrimmed = answer.trim();
  const answerLower = answerTrimmed.toLowerCase();
  
  // FIXED: Better topic request detection - extract just the topic, not the whole phrase
  const topicPatterns = [
    // Pattern: "shall we talk about X" -> extract X
    /shall\s+we\s+(?:talk|discuss|chat)\s+(?:about|on)\s+["']?([\w\s\-]+)["']?/i,
    // Pattern: "can we talk about X" -> extract X
    /can\s+we\s+(?:talk|discuss|chat)\s+(?:about|on)\s+["']?([\w\s\-]+)["']?/i,
    // Pattern: "could we talk about X" -> extract X
    /could\s+we\s+(?:talk|discuss|chat)\s+(?:about|on)\s+["']?([\w\s\-]+)["']?/i,
    // Pattern: "let's talk about X" -> extract X
    /let'?s\s+(?:talk|discuss|chat)\s+(?:about|on)\s+["']?([\w\s\-]+)["']?/i,
    // Pattern: "I want to talk about X" -> extract X
    /i\s+(?:want|would like)\s+to\s+(?:talk|discuss|chat)\s+(?:about|on)\s+["']?([\w\s\-]+)["']?/i,
    // Pattern: "ask me about X" -> extract X
    /ask\s+(?:me\s+)?(?:a\s+)?question(?:s)?\s+(?:about|on|based on)\s+["']?([\w\s\-]+)["']?/i,
    // Pattern: "questions about X" -> extract X
    /question(?:s)?\s+(?:about|on|regarding)\s+["']?([\w\s\-]+)["']?/i,
    // Pattern: "topic: X" -> extract X
    /topic\s*[:\-]?\s*["']?([\w\s\-]+)["']?/i,
    // Pattern: "based on X" -> extract X
    /based\s+on\s+["']?([\w\s\-]+)["']?/i,
    // Pattern: "X questions" -> extract X
    /^["']?([\w\s\-]+)\s+questions?["']?$/i,
    // Pattern: just a single word (like "dancing")
    /^\s*(["']?)([a-zA-Z\s\-]+)\1\s*$/i
  ];
  
  for (const pattern of topicPatterns) {
    const match = answerLower.match(pattern);
    if (match && match[1]) {
      let topic = match[1].toLowerCase().trim();
      
      // Clean up the topic - remove phrases like "shall we talk about"
      const cleanupPatterns = [
        /^shall\s+we\s+(?:talk|discuss)\s+(?:about|on)\s+/i,
        /^can\s+we\s+(?:talk|discuss)\s+(?:about|on)\s+/i,
        /^let'?s\s+(?:talk|discuss)\s+(?:about|on)\s+/i,
        /^i\s+(?:want|would like)\s+to\s+(?:talk|discuss)\s+(?:about|on)\s+/i,
        /^ask\s+(?:me\s+)?(?:a\s+)?question(?:s)?\s+(?:about|on)\s+/i,
        /^question(?:s)?\s+(?:about|on)\s+/i,
        /^topic\s*[:\-]?\s*/i,
        /^based\s+on\s+/i,
        /\s+questions?$/i
      ];
      
      for (const cleanupPattern of cleanupPatterns) {
        topic = topic.replace(cleanupPattern, '').trim();
      }
      
      if (topic.length > 1 && topic.length < 50 && !['yes', 'no', 'ok', 'sure', 'maybe'].includes(topic)) {
        console.log('✅ Detected topic request for:', topic);
        return {
          type: 'topic-request',
          topic: topic,
          details: { topic }
        };
      }
    }
  }
  
  // Check if answer is just a single word topic
  const singleWordPattern = /^\s*([a-zA-Z]+)\s*$/;
  const singleWordMatch = answerLower.match(singleWordPattern);
  if (singleWordMatch && singleWordMatch[1]) {
    const singleWord = singleWordMatch[1].toLowerCase().trim();
    if (singleWord.length > 2 && !['yes', 'no', 'ok', 'idk', 'idc'].includes(singleWord)) {
      console.log('✅ Detected single word topic request:', singleWord);
      return {
        type: 'topic-request',
        topic: singleWord,
        details: { topic: singleWord }
      };
    }
  }
  
  // Scenario request detection
  if (answerLower.includes('scenario') || answerLower.includes('situation') || 
      answerLower.includes('real life') || answerLower.includes('example of')) {
    console.log('🎭 Detected scenario request');
    return {
      type: 'scenario-request',
      details: { analysis: 'User requested a scenario-based question' }
    };
  }
  
  // Default: analyze as regular answer
  return { 
    type: 'answer-analysis',
    details: { analysis: 'Analyzing user response' }
  };
}

// ========== IMPROVED INTELLIGENT FALLBACK ==========
async function analyzeWithIntelligentFallback(
  answer: string,
  question: string,
  context: ProfileContext,
  memory: ConversationEntry[],
  intent: UserIntent
): Promise<AnswerQuality> {
  const answerTrimmed = answer.trim();
  
  // Handle empty answers
  if (!answerTrimmed || answerTrimmed.length === 0) {
    return {
      score: 20,
      feedback: "I notice you haven't provided an answer. Could you please share your thoughts on this topic?",
      strengths: ['Attempted engagement'],
      improvements: ['Provide a response', 'Engage with the question'],
      needsClarification: true,
      clarificationQuestion: "Could you share your thoughts on this topic?",
      analysis: "No answer provided.",
      sentiment: 'neutral',
      complexity: 'low',
      answerSummary: "No answer provided"
    };
  }
  
  const wordCount = answerTrimmed.split(/\s+/).length;
  const answerLower = answerTrimmed.toLowerCase();
  
  // CRITICAL: Handle topic requests first - give GOOD scores for topic requests
  if (intent.type === 'topic-request' && intent.topic) {
    const topic = intent.topic;
    console.log(`🎯 Handling topic request for: ${topic}`);
    
    // Clean the topic further
    const cleanTopic = topic.replace(/\s+/g, ' ').trim();
    
    return {
      score: 85, // Excellent score for topic requests
      feedback: `Excellent! I'd be happy to discuss ${cleanTopic} with you. What would you like to focus on first?`,
      strengths: ['Clear topic preference', 'Proactive engagement', 'Good communication'],
      improvements: ['Could specify what aspect interests you'],
      needsClarification: false,
      analysis: `User requested to change topic to ${cleanTopic}. This shows engagement and interest.`,
      extractedTopics: [cleanTopic],
      sentiment: 'positive',
      complexity: 'medium',
      suggestedFollowUp: `What interests you most about ${cleanTopic}?`,
      answerSummary: `Requested to discuss ${cleanTopic}`
    };
  }
  
  // Handle scenario requests
  if (intent.type === 'scenario-request') {
    return {
      score: 80,
      feedback: "Great! You've asked for a real-life scenario. This is an excellent way to practice practical communication skills.",
      strengths: ['Practical learning approach', 'Scenario-based thinking'],
      improvements: ['Could specify the type of scenario'],
      needsClarification: false,
      analysis: "User requested a scenario-based question.",
      extractedTopics: ['scenario', 'real-life'],
      sentiment: 'positive',
      complexity: 'medium',
      suggestedFollowUp: "What type of real-life scenario would you like to practice?",
      answerSummary: "Requested scenario-based questions"
    };
  }
  
  // Handle uncertainty responses
  const uncertaintyPhrases = ["i don't know", "i don't", "not sure", "no idea", "unsure", "idk", "nothing"];
  if (uncertaintyPhrases.some(phrase => answerLower.includes(phrase)) && wordCount < 15) {
    return {
      score: 45,
      feedback: "That's okay - it's normal to encounter questions that require some thought. Let me help you think through this. Perhaps we could explore a related area you're more comfortable with?",
      strengths: ['Honest response', 'Self-awareness'],
      improvements: ['Try to connect with related experiences', 'Think about similar situations', 'Share your thought process even if uncertain'],
      needsClarification: true,
      clarificationQuestion: "Can you think of a related experience or skill that might be relevant here?",
      analysis: "User expressed uncertainty about the topic. This is common in interviews and shows honesty.",
      extractedTopics: [],
      sentiment: 'neutral',
      complexity: 'low',
      answerSummary: "Expressed uncertainty about the topic"
    };
  }
  
  // Handle very short answers
  if (wordCount < 10 && answerLower.length < 50) {
    return {
      score: 50,
      feedback: "Thanks for your brief response. To help me understand your perspective better, could you elaborate a bit more?",
      strengths: ['Concise response'],
      improvements: ['Provide more details', 'Share examples', 'Explain your reasoning'],
      needsClarification: true,
      clarificationQuestion: "Could you expand on that with more details or an example?",
      analysis: "Brief answer provided. User may need encouragement to elaborate.",
      extractedTopics: [],
      sentiment: 'neutral',
      complexity: 'low',
      answerSummary: "Short answer provided"
    };
  }
  
  // Analyze the actual answer content
  let score = 60; // Start higher for engaged responses
  const strengths: string[] = [];
  const improvements: string[] = [];
  const extractedTopics: string[] = [];
  
  // Basic analysis
  if (wordCount < 15) {
    score = 45;
    improvements.push('Provide more detailed response');
  } else if (wordCount > 50) {
    score += 20;
    strengths.push('Comprehensive answer');
  } else if (wordCount > 30) {
    score += 10;
    strengths.push('Detailed response');
  }
  
  // Check for examples
  if (answerLower.includes('example') || answerLower.includes('for instance') || 
      answerLower.includes('such as') || answerLower.includes('like when')) {
    score += 15;
    strengths.push('Used specific examples');
  } else if (wordCount > 20) {
    improvements.push('Add concrete examples');
  }
  
  // Check for reasoning
  if (answerLower.includes('because') || answerLower.includes('reason') || 
      answerLower.includes('therefore') || answerLower.includes('since')) {
    score += 10;
    strengths.push('Provided logical reasoning');
  } else if (wordCount > 15) {
    improvements.push('Explain your thought process');
  }
  
  // Extract topics from answer
  const commonTopics = [
    'history', 'mathematics', 'math', 'politics', 'technology', 'business', 'science',
    'economics', 'psychology', 'sociology', 'philosophy', 'literature', 'art',
    'physics', 'chemistry', 'biology', 'programming', 'python', 'java', 'javascript',
    'software', 'engineering', 'medicine', 'health', 'education', 'law', 'culture',
    'religion', 'sports', 'design', 'ux', 'ui', 'data science', 'ai', 'machine learning'
  ];
  
  commonTopics.forEach(topic => {
    if (answerLower.includes(topic)) {
      extractedTopics.push(topic);
    }
  });
  
  // Check for skills from context
  context.skills.forEach(skill => {
    if (answerLower.includes(skill.toLowerCase())) {
      extractedTopics.push(skill);
    }
  });
  
  // Determine sentiment
  const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'achievement', 'happy', 'enjoy'];
  const negativeWords = ['bad', 'poor', 'negative', 'fail', 'failure', 'problem', 'issue', 'difficult', 'hard'];
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  const positiveCount = positiveWords.filter(word => answerLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => answerLower.includes(word)).length;
  
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';
  
  // Determine complexity
  let complexity: 'low' | 'medium' | 'high' = 'low';
  if (wordCount > 100) complexity = 'high';
  else if (wordCount > 30) complexity = 'medium';
  
  // Check for structure
  const hasStructure = answerLower.includes('first') || answerLower.includes('second') || 
                      answerLower.includes('then') || answerLower.includes('finally') ||
                      answerLower.includes('step') || answerLower.includes('process');
  
  if (hasStructure) {
    score += 5;
    strengths.push('Well-structured response');
  }
  
  // Check for repetition
  const isRepeating = checkForRepetition(answer, memory);
  if (isRepeating) {
    score -= 5;
    improvements.push('Try to add new insights');
  }
  
  // Final score adjustments
  score = Math.max(30, Math.min(95, score));
  
  // Determine if clarification is needed
  const needsClarification = wordCount < 15 || isRepeating || score < 50;
  let clarificationQuestion = '';
  
  if (needsClarification) {
    clarificationQuestion = generateClarificationQuestion(question, context, memory, extractedTopics);
  }
  
  // Generate analysis summary
  const analysis = `Response analysis: ${wordCount} words, ${sentiment} sentiment, ${complexity} complexity. ${
    extractedTopics.length > 0 ? `Topics mentioned: ${extractedTopics.slice(0, 3).join(', ')}.` : ''
  }`;
  
  // Generate feedback
  let feedback = '';
  if (score >= 85) {
    feedback = "Excellent response! You've demonstrated strong understanding with clear examples and reasoning.";
  } else if (score >= 70) {
    feedback = "Very good answer. You've addressed the question well with relevant points and analysis.";
  } else if (score >= 55) {
    feedback = "Good response. You've made a solid start in addressing the question.";
  } else if (score >= 40) {
    feedback = "Thank you for your response. You've engaged with the question appropriately.";
  } else {
    feedback = "I appreciate your response. Let me ask a follow-up to explore this further.";
  }
  
  // Ensure we have strengths and improvements
  if (strengths.length === 0) {
    if (wordCount > 10) {
      strengths.push('Engaged with the question');
      strengths.push('Provided relevant response');
    } else {
      strengths.push('Attempted to answer');
    }
  }
  
  if (improvements.length === 0 && score < 80) {
    improvements.push('Continue developing your responses');
  }
  
  // Generate suggested follow-up
  let suggestedFollowUp = '';
  if (intent.type === 'topic-request' && intent.topic) {
    suggestedFollowUp = `What interests you most about ${intent.topic}?`;
  } else if (extractedTopics.length > 0) {
    const mainTopic = extractedTopics[0];
    suggestedFollowUp = `How does your experience with ${mainTopic} influence your approach to similar situations?`;
  } else {
    suggestedFollowUp = "Could you elaborate on that with a specific example from your experience?";
  }
  
  return {
    score,
    feedback,
    strengths,
    improvements,
    needsClarification,
    clarificationQuestion,
    analysis,
    extractedTopics,
    sentiment,
    complexity,
    suggestedFollowUp,
    answerSummary: generateAnswerSummary(answer)
  };
}

// ========== DYNAMIC FOLLOW-UP GENERATION ==========
function generateDynamicFollowUp(
  question: string,
  answer: string,
  quality: AnswerQuality,
  context: ProfileContext,
  memory: ConversationEntry[],
  intent: UserIntent
): string {
  const recentQuestions = memory.slice(-3).map(m => m.question);
  
  // If user requested a specific topic, ask about that topic
  if (intent.type === 'topic-request' && intent.topic) {
    const topic = intent.topic;
    const topicQuestions = generateTopicSpecificQuestions(topic, context, recentQuestions);
    if (topicQuestions.length > 0) {
      return topicQuestions[0];
    }
  }
  
  // Use extracted topics from the answer to generate relevant follow-up
  if (quality.extractedTopics && quality.extractedTopics.length > 0) {
    const mainTopic = quality.extractedTopics[0];
    const topicQuestions = generateTopicSpecificQuestions(mainTopic, context, recentQuestions);
    if (topicQuestions.length > 0) {
      return topicQuestions[0];
    }
  }
  
  // Generate follow-up based on answer characteristics
  const answerLower = answer.toLowerCase();
  const wordCount = answer.split(/\s+/).length;
  
  // Handle short answers
  if (wordCount < 15) {
    const shortAnswerFollowUps = [
      "Could you elaborate on that with more details?",
      "What specifically about that interests you?",
      "Can you give me an example to illustrate your point?",
      "How would you apply that in a practical situation?",
      "What led you to that perspective?"
    ];
    
    const filtered = shortAnswerFollowUps.filter(q => !isQuestionSimilar(q, recentQuestions));
    if (filtered.length > 0) return filtered[0];
  }
  
  // Handle answers that mention specific skills or tools
  if (context.skills.length > 0) {
    for (const skill of context.skills) {
      if (answerLower.includes(skill.toLowerCase())) {
        const skillQuestions = [
          `You mentioned ${skill}. Can you tell me about a project where you used this?`,
          `How has your experience with ${skill} evolved over time?`,
          `What's the most challenging aspect of working with ${skill}?`,
          `How do you stay updated with the latest developments in ${skill}?`,
          `Can you give me an example of how ${skill} helped solve a difficult problem?`
        ];
        
        const filtered = skillQuestions.filter(q => !isQuestionSimilar(q, recentQuestions));
        if (filtered.length > 0) return filtered[0];
      }
    }
  }
  
  // Generate question based on answer sentiment
  if (quality.sentiment === 'positive') {
    const positiveQuestions = [
      "That sounds like a positive experience. What contributed most to that success?",
      "Great to hear about that achievement. What did you learn from that experience?",
      "Interesting positive outcome. How would you apply those lessons in a different context?"
    ];
    
    const filtered = positiveQuestions.filter(q => !isQuestionSimilar(q, recentQuestions));
    if (filtered.length > 0) return filtered[0];
  }
  
  if (quality.sentiment === 'negative') {
    const constructiveQuestions = [
      "That sounds challenging. How did you work through that situation?",
      "What would you do differently if you faced a similar challenge now?",
      "How did that experience help you grow professionally?"
    ];
    
    const filtered = constructiveQuestions.filter(q => !isQuestionSimilar(q, recentQuestions));
    if (filtered.length > 0) return filtered[0];
  }
  
  // Default contextual follow-ups
  const defaultFollowUps = [
    "Could you elaborate on that with a specific example from your experience?",
    "How would you apply this approach in a completely different situation?",
    "What other factors should be considered that you haven't mentioned yet?",
    "How has this perspective influenced your decision-making in other areas?",
    "What would you do differently if you faced a similar situation now?"
  ];
  
  const filtered = defaultFollowUps.filter(q => !isQuestionSimilar(q, recentQuestions));
  return filtered.length > 0 ? filtered[0] : defaultFollowUps[0];
}

// ========== TOPIC-SPECIFIC QUESTION GENERATION ==========
function generateTopicSpecificQuestions(
  topic: string,
  context: ProfileContext,
  recentQuestions: string[]
): string[] {
  const topicLower = topic.toLowerCase();
  
  // Enhanced topic questions database
  const topicQuestions: Record<string, string[]> = {
    'dancing': [
      "What style of dancing interests you the most, and what draws you to it?",
      "How does dancing contribute to personal expression and creativity?",
      "What health benefits have you experienced or observed from dancing?",
      "How has dancing evolved as an art form throughout history?",
      "What role does dancing play in different cultures around the world?"
    ],
    'mountains': [
      "What's the first thing that comes to mind when you think about mountains, and is there a specific aspect of them that you find particularly fascinating?",
      "Have you ever visited any mountains that left a lasting impression on you?",
      "What do you think mountains teach us about perseverance and overcoming challenges?",
      "How do mountains influence weather patterns and ecosystems in their surrounding areas?",
      "What safety considerations are important when exploring mountainous regions?"
    ],
    'college life': [
      "What was your favorite part about college life that made it stand out for you?",
      "How did your college experiences shape your approach to learning and problem-solving?",
      "What's one lesson from college that you still apply in your professional life today?",
      "What advice would you give to someone starting their college journey?",
      "How do you think college prepares people for real-world challenges?"
    ],
    'farming': [
      "What aspects of farming interest you most - is it the agricultural science, sustainability, or business side?",
      "How do you think modern technology is changing traditional farming practices?",
      "What challenges do you think farmers face today that most people don't know about?",
      "How does sustainable farming contribute to environmental conservation?",
      "What innovations in farming do you find most exciting?"
    ],
    'python': [
      "What Python projects have you worked on and what challenges did you face?",
      "How do you approach debugging complex issues in Python?",
      "What Python libraries or frameworks do you find most useful and why?"
    ],
    'mathematics': [
      "How do you apply mathematical thinking to professional problems?",
      "What mathematical concepts have been most valuable in your work?",
      "Can you give an example of using mathematical modeling for decision-making?"
    ]
  };
  
  // Get questions for specific topic or generate generic ones
  let questions: string[] = [];
  
  // Check for exact match
  if (topicQuestions[topicLower]) {
    questions = topicQuestions[topicLower];
  } else {
    // Check for partial matches
    for (const [key, qs] of Object.entries(topicQuestions)) {
      if (topicLower.includes(key) || key.includes(topicLower)) {
        questions = qs;
        break;
      }
    }
    
    // If no match, generate generic topic questions
    if (questions.length === 0) {
      questions = [
        `What interests you most about ${topic}?`,
        `How does ${topic} relate to your personal or professional experiences?`,
        `What's one surprising thing you've learned about ${topic}?`,
        `How has your perspective on ${topic} changed over time?`,
        `What challenges or opportunities do you see in the field of ${topic}?`
      ];
    }
  }
  
  // Filter out recently asked questions
  return questions.filter(q => !isQuestionSimilar(q, recentQuestions));
}

// ========== HELPER FUNCTIONS ==========
function generateClarificationQuestion(
  question: string,
  context: ProfileContext,
  memory: ConversationEntry[],
  topics: string[]
): string {
  const recentQuestions = memory.slice(-2).map(m => m.question);
  
  if (topics.length > 0) {
    const topic = topics[0];
    const questions = [
      `Could you elaborate more on ${topic}?`,
      `What specifically about ${topic} would you like to discuss?`,
      `How does ${topic} relate to your experience?`
    ];
    
    const filtered = questions.filter(q => !isQuestionSimilar(q, recentQuestions));
    if (filtered.length > 0) return filtered[0];
  }
  
  const clarifications = [
    "Could you explain your thinking process in more detail?",
    "What's your approach to this type of situation?",
    "Can you provide a specific example to illustrate your point?",
    "How would you apply this in a practical scenario?"
  ];
  
  return clarifications[Math.floor(Math.random() * clarifications.length)];
}

function checkForRepetition(answer: string, memory: ConversationEntry[]): boolean {
  if (!answer || memory.length < 2) return false;
  
  const answerWords = answer.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  for (let i = Math.max(0, memory.length - 2); i < memory.length - 1; i++) {
    const prevAnswer = memory[i]?.answer?.toLowerCase() || '';
    const prevWords = prevAnswer.split(/\s+/).filter(w => w.length > 3);
    
    const commonWords = answerWords.filter(word => prevWords.includes(word));
    
    if (commonWords.length > (answerWords.length * 0.4)) {
      return true;
    }
  }
  
  return false;
}

function isQuestionSimilar(question: string, compareQuestions: string[]): boolean {
  if (!question || compareQuestions.length === 0) return false;
  
  const qLower = question.toLowerCase();
  
  for (const compare of compareQuestions) {
    if (!compare) continue;
    
    if (qLower === compare.toLowerCase()) return true;
    
    const qWords = qLower.split(/\s+/).filter(w => w.length > 3);
    const cWords = compare.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    const commonWords = qWords.filter(w => cWords.includes(w));
    if (commonWords.length >= 2) {
      return true;
    }
  }
  
  return false;
}

function generateAnswerSummary(answer: string): string {
  if (!answer || answer.length < 10) return "Short or no answer provided";
  
  const words = answer.split(/\s+/);
  if (words.length <= 15) return words.join(' ');
  
  // Take first 15 words for summary
  return words.slice(0, 15).join(' ') + '...';
}

function fallbackResponse() {
  const fallbackQuestions = [
    "Could you tell me about a challenging project you worked on and how you approached it?",
    "How do you typically handle learning new skills or technologies?",
    "What professional achievement are you most proud of and why?",
    "How do you approach problem-solving in unfamiliar situations?",
    "Can you describe a time when you had to adapt to significant change at work?"
  ];
  
  const question = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
  
  return {
    score: 65,
    contentScore: 65,
    detailedFeedback: "Let's continue our conversation to better understand your perspective.",
    interviewerResponse: question,
    strengths: ['Willingness to engage'],
    improvements: ['Provide more specific examples'],
    hasFollowUp: true,
    followUpQuestion: question,
    feedbackQuestion: question,
    analysis: 'Using fallback response.',
    extractedTopics: [],
    sentiment: 'neutral',
    complexity: 'medium',
    aiAnalyzed: false,
    answerSummary: 'Using fallback response',
    timestamp: Date.now(),
    question: question,
    feedback: "Let's continue our conversation to better understand your perspective.",
    nextQuestion: question
  };
}