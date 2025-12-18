//C:\Users\AATMAJA\ai-mock-interview\app\api\generate-next-question\route.ts
/*import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🧠 Generating next question with data:', {
      jobTitle: body.jobTitle,
      fieldCategory: body.fieldCategory,
      currentIndex: body.currentQuestionIndex,
      lastScore: body.answerScore
    });

    // Enhanced question generation with better context
    const fallbackQuestions = {
      'Engineering & Technology': [
        "Can you walk me through your experience with version control systems like Git?",
        "How do you approach debugging a complex technical issue?",
        "What's your experience with agile development methodologies?",
        "Can you describe a challenging technical problem you solved recently?",
        "How do you stay updated with the latest technology trends?",
        "What's your experience with testing and quality assurance processes?",
        "How would you optimize a website for performance?",
        "Can you explain the difference between REST and GraphQL APIs?",
        "What's your experience with responsive design principles?",
        "How do you handle cross-browser compatibility issues?"
      ],
      'Business & Management': [
        "How do you prioritize tasks when managing multiple projects?",
        "Can you describe your experience with budget management?",
        "How do you handle conflicts within a team?",
        "What's your approach to strategic planning?",
        "How do you measure project success?",
        "Can you describe your leadership style?",
        "How do you motivate team members during challenging projects?",
        "What's your experience with stakeholder management?",
        "How do you handle tight deadlines and competing priorities?",
        "Can you describe a time you had to make a difficult business decision?"
      ],
      'default': [
        "Can you elaborate more on that experience?",
        "What were the key learnings from that situation?",
        "How would you approach this differently today?",
        "What specific skills did you develop from that experience?",
        "Can you provide another example that demonstrates this?",
        "How does this experience relate to the role you're applying for?",
        "What challenges did you face in that situation?",
        "How did you measure success in that project?",
        "What feedback did you receive on your performance?",
        "How would you apply this experience to our company?"
      ]
    };

    const field = body.fieldCategory || 'default';
    const questions = (fallbackQuestions as any)[field] || fallbackQuestions.default;
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    // Determine question type based on context
    let questionType = 'follow-up';
    if (body.lastQuestion && body.lastQuestion.includes('experience')) {
      questionType = 'behavioral';
    } else if (body.lastQuestion && (body.lastQuestion.includes('technical') || body.lastQuestion.includes('technology'))) {
      questionType = 'technical';
    }

    const response = {
      success: true,
      question: {
        question: randomQuestion,
        type: questionType,
        difficulty: body.answerScore > 70 ? 'hard' : body.answerScore > 50 ? 'medium' : 'easy',
        category: body.fieldCategory || 'General',
        timeLimit: 180,
        fieldRelevant: true,
        reasoning: `Generated based on ${body.fieldCategory || 'general'} field and previous score of ${body.answerScore || 'N/A'}`,
        followsUp: true,
        skillFocus: body.skills?.[0] ? [body.skills[0]] : ['Problem Solving'],
        expectedAnswer: "A comprehensive answer addressing all aspects of the question with specific examples and clear reasoning."
      }
    };

    console.log('✅ Generated question:', response.question.question);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating next question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}*/












//C:\Users\AATMAJA\ai-mock-interview\app\api\generate-next-question
// app/api/generate-next-question/route.ts
//C:\Users\AATMAJA\ai-mock-interview\app\api\generate-next-question


/*    media pipe
import { NextRequest, NextResponse } from 'next/server';

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

    const body = await request.json();
    
    console.log('🧠 Generating next question with data:', {
      jobTitle: body.jobTitle,
      fieldCategory: body.fieldCategory,
      currentIndex: body.currentQuestionIndex,
      lastScore: body.answerScore,
      isFollowUp: body.isFollowUp || false
    });

    // If this is a follow-up question, generate a specific follow-up
    if (body.isFollowUp && body.lastQuestion) {
      const followUpPrompt = `You are an expert interviewer. Generate a specific follow-up question based on the candidate's previous response.

PREVIOUS QUESTION: "${body.lastQuestion}"
CANDIDATE'S SCORE: ${body.answerScore}%
JOB POSITION: ${body.jobTitle || 'Not specified'}

Generate a focused follow-up question that:
1. Asks for clarification or more details about their previous response
2. Is directly related to the previous question
3. Helps you better understand their skills and experience
4. Is appropriate for their performance level

Respond with valid JSON only using this structure:
{
  "question": "The follow-up question",
  "type": "follow-up",
  "difficulty": "easy/medium/hard",
  "category": "Same as previous question",
  "timeLimit": 120,
  "fieldRelevant": true,
  "reasoning": "Brief explanation of why this follow-up was chosen",
  "followsUp": true,
  "skillFocus": ["Primary skill being assessed"],
  "expectedAnswer": "What a good response to this follow-up would contain",
  "correctedAnswer": "How to improve a weak response to this follow-up"
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
              content: 'You are an expert interviewer. Generate specific follow-up questions. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: followUpPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
          response_format: { type: 'json_object' }
        })
      });

      if (groqResponse.ok) {
        const data = await groqResponse.json();
        const questionData = JSON.parse(data.choices[0].message.content);
        
        console.log('✅ Generated follow-up question:', questionData.question);
        
        return NextResponse.json({
          success: true,
          question: questionData,
          isFollowUp: true
        });
      }
    }

    // Use Groq API to generate a more contextual next question
    const prompt = `You are an expert interviewer conducting a mock interview. Generate the next question based on the following context:

JOB POSITION: ${body.jobTitle || 'Not specified'}
FIELD/CATEGORY: ${body.fieldCategory || 'General'}
PREVIOUS QUESTION: ${body.lastQuestion || 'No previous question'}
CANDIDATE'S SCORE ON PREVIOUS ANSWER: ${body.answerScore || 'No score'}%
CURRENT QUESTION INDEX: ${body.currentQuestionIndex || 0}
REQUIRED SKILLS: ${body.skills ? body.skills.join(', ') : 'Not specified'}

Generate a relevant next question that:
1. Is appropriate for the job position and field
2. Builds upon the previous question or explores a related area
3. Is challenging but appropriate based on the candidate's previous performance
4. Includes an expected answer that demonstrates what an ideal response would contain
5. Includes a corrected answer example that shows how to improve a mediocre response

Respond with valid JSON only using this structure:
{
  "question": "The generated interview question",
  "type": "technical/behavioral/situational",
  "difficulty": "easy/medium/hard",
  "category": "Field category",
  "timeLimit": 180,
  "fieldRelevant": true,
  "reasoning": "Brief explanation of why this question was chosen",
  "followsUp": false,
  "skillFocus": ["Primary skill being assessed"],
  "expectedAnswer": "A comprehensive ideal answer that demonstrates expertise",
  "correctedAnswer": "An example of how to improve a mediocre answer to this question"
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
            content: 'You are an expert interviewer. Generate relevant, contextual interview questions. Always respond with valid JSON only. Adjust difficulty based on previous performance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errorData);
      
      // Fallback to static questions if API fails
      return NextResponse.json(generateFallbackQuestion(body));
    }

    const data = await groqResponse.json();
    const questionData = JSON.parse(data.choices[0].message.content);
    
    console.log('✅ Generated question:', questionData.question);
    
    return NextResponse.json({
      success: true,
      question: questionData,
      isFollowUp: false
    });

  } catch (error) {
    console.error('Error generating next question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}

// Fallback question generation
function generateFallbackQuestion(body: any) {
  const fallbackQuestions = {
    'Engineering & Technology': [
      "Can you walk me through your experience with version control systems like Git?",
      "How do you approach debugging a complex technical issue?",
      "What's your experience with agile development methodologies?",
      "Can you describe a challenging technical problem you solved recently?",
      "How do you stay updated with the latest technology trends?",
    ],
    'Business & Management': [
      "How do you prioritize tasks when managing multiple projects?",
      "Can you describe your experience with budget management?",
      "How do you handle conflicts within a team?",
      "What's your approach to strategic planning?",
      "How do you measure project success?",
    ],
    'default': [
      "Can you elaborate more on that experience?",
      "What were the key learnings from that situation?",
      "How would you approach this differently today?",
      "What specific skills did you develop from that experience?",
      "Can you provide another example that demonstrates this?",
    ]
  };

  const field = body.fieldCategory || 'default';
  const questions = (fallbackQuestions as any)[field] || fallbackQuestions.default;
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  
  // Determine question type based on context
  let questionType = 'general';
  if (body.lastQuestion && body.lastQuestion.includes('experience')) {
    questionType = 'behavioral';
  } else if (body.lastQuestion && (body.lastQuestion.includes('technical') || body.lastQuestion.includes('technology'))) {
    questionType = 'technical';
  }

  return {
    success: true,
    question: {
      question: randomQuestion,
      type: questionType,
      difficulty: body.answerScore > 70 ? 'hard' : body.answerScore > 50 ? 'medium' : 'easy',
      category: body.fieldCategory || 'General',
      timeLimit: 180,
      fieldRelevant: true,
      reasoning: `Generated based on ${body.fieldCategory || 'general'} field and previous score of ${body.answerScore || 'N/A'}`,
      followsUp: false,
      skillFocus: body.skills?.[0] ? [body.skills[0]] : ['Problem Solving'],
      expectedAnswer: "A comprehensive answer addressing all aspects of the question with specific examples and clear reasoning.",
      correctedAnswer: "An improved answer would include more specific examples, measurable outcomes, and a clearer connection to the role requirements."
    },
    isFollowUp: false
  };
}


*/

// C:\Users\AATMAJA\ai-mock-interview\app\api\generate-next-question\route.ts
/*import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if OpenRouter API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    
    console.log('🧠 Generating next question with data:', {
      jobTitle: body.jobTitle,
      fieldCategory: body.fieldCategory,
      currentIndex: body.currentQuestionIndex,
      lastScore: body.answerScore,
      isFollowUp: body.isFollowUp || false
    });

    // If this is a follow-up question, generate a specific follow-up
    if (body.isFollowUp && body.lastQuestion) {
      const followUpPrompt = `You are an expert interviewer. Generate a specific follow-up question based on the candidate's previous response.

PREVIOUS QUESTION: "${body.lastQuestion}"
CANDIDATE'S SCORE: ${body.answerScore}%
JOB POSITION: ${body.jobTitle || 'Not specified'}

Generate a focused follow-up question that:
1. Asks for clarification or more details about their previous response
2. Is directly related to the previous question
3. Helps you better understand their skills and experience
4. Is appropriate for their performance level

Respond with valid JSON only using this structure:
{
  "question": "The follow-up question",
  "type": "follow-up",
  "difficulty": "easy/medium/hard",
  "category": "Same as previous question",
  "timeLimit": 120,
  "fieldRelevant": true,
  "reasoning": "Brief explanation of why this follow-up was chosen",
  "followsUp": true,
  "skillFocus": ["Primary skill being assessed"],
  "expectedAnswer": "What a good response to this follow-up would contain",
  "correctedAnswer": "How to improve a weak response to this follow-up"
}`;

      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'AI Mock Interview'
        },
        body: JSON.stringify({
          model: 'google/gemini-flash-1.5:free',
          messages: [
            {
              role: 'system',
              content: 'You are an expert interviewer. Generate specific follow-up questions. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: followUpPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
          response_format: { type: 'json_object' }
        })
      });

      if (openRouterResponse.ok) {
        const data = await openRouterResponse.json();
        const questionData = JSON.parse(data.choices[0].message.content);
        
        console.log('✅ Generated follow-up question:', questionData.question);
        
        return NextResponse.json({
          success: true,
          question: questionData,
          isFollowUp: true
        });
      }
    }

    // Use OpenRouter API to generate a more contextual next question
    const prompt = `You are an expert interviewer conducting a mock interview. Generate the next question based on the following context:

JOB POSITION: ${body.jobTitle || 'Not specified'}
FIELD/CATEGORY: ${body.fieldCategory || 'General'}
PREVIOUS QUESTION: ${body.lastQuestion || 'No previous question'}
CANDIDATE'S SCORE ON PREVIOUS ANSWER: ${body.answerScore || 'No score'}%
CURRENT QUESTION INDEX: ${body.currentQuestionIndex || 0}
REQUIRED SKILLS: ${body.skills ? body.skills.join(', ') : 'Not specified'}

Generate a relevant next question that:
1. Is appropriate for the job position and field
2. Builds upon the previous question or explores a related area
3. Is challenging but appropriate based on the candidate's previous performance
4. Includes an expected answer that demonstrates what an ideal response would contain
5. Includes a corrected answer example that shows how to improve a mediocre response

Respond with valid JSON only using this structure:
{
  "question": "The generated interview question",
  "type": "technical/behavioral/situational",
  "difficulty": "easy/medium/hard",
  "category": "Field category",
  "timeLimit": 180,
  "fieldRelevant": true,
  "reasoning": "Brief explanation of why this question was chosen",
  "followsUp": false,
  "skillFocus": ["Primary skill being assessed"],
  "expectedAnswer": "A comprehensive ideal answer that demonstrates expertise",
  "correctedAnswer": "An example of how to improve a mediocre answer to this question"
}`;

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Mock Interview'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interviewer. Generate relevant, contextual interview questions. Always respond with valid JSON only. Adjust difficulty based on previous performance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.text();
      console.error('OpenRouter API error:', openRouterResponse.status, errorData);
      
      // Fallback to static questions if API fails
      return NextResponse.json(generateFallbackQuestion(body));
    }

    const data = await openRouterResponse.json();
    const questionData = JSON.parse(data.choices[0].message.content);
    
    console.log('✅ Generated question:', questionData.question);
    
    return NextResponse.json({
      success: true,
      question: questionData,
      isFollowUp: false
    });

  } catch (error) {
    console.error('Error generating next question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
// Fallback question generation
function generateFallbackQuestion(body: any) {
  const fallbackQuestions = {
    'Engineering & Technology': [
      "Can you walk me through your experience with version control systems like Git?",
      "How do you approach debugging a complex technical issue?",
      "What's your experience with agile development methodologies?",
      "Can you describe a challenging technical problem you solved recently?",
      "How do you stay updated with the latest technology trends?",
    ],
    'Business & Management': [
      "How do you prioritize tasks when managing multiple projects?",
      "Can you describe your experience with budget management?",
      "How do you handle conflicts within a team?",
      "What's your approach to strategic planning?",
      "How do you measure project success?",
    ],
    'default': [
      "Can you elaborate more on that experience?",
      "What were the key learnings from that situation?",
      "How would you approach this differently today?",
      "What specific skills did you develop from that experience?",
      "Can you provide another example that demonstrates this?",
    ]
  };

  const field = body.fieldCategory || 'default';
  const questions = (fallbackQuestions as any)[field] || fallbackQuestions.default;
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  
  // Determine question type based on context
  let questionType = 'general';
  if (body.lastQuestion && body.lastQuestion.includes('experience')) {
    questionType = 'behavioral';
  } else if (body.lastQuestion && (body.lastQuestion.includes('technical') || body.lastQuestion.includes('technology'))) {
    questionType = 'technical';
  }

  return {
    success: true,
    question: {
      question: randomQuestion,
      type: questionType,
      difficulty: body.answerScore > 70 ? 'hard' : body.answerScore > 50 ? 'medium' : 'easy',
      category: body.fieldCategory || 'General',
      timeLimit: 180,
      fieldRelevant: true,
      reasoning: `Generated based on ${body.fieldCategory || 'general'} field and previous score of ${body.answerScore || 'N/A'}`,
      followsUp: false,
      skillFocus: body.skills?.[0] ? [body.skills[0]] : ['Problem Solving'],
      expectedAnswer: "A comprehensive answer addressing all aspects of the question with specific examples and clear reasoning.",
      correctedAnswer: "An improved answer would include more specific examples, measurable outcomes, and a clearer connection to the role requirements."
    },
    isFollowUp: false
  };
}
*/



// C:\Users\AATMAJA\ai-mock-interview\app\api\generate-next-question\route.ts
// File: app/api/generate-next-question/route.ts

// File: app/api/generate-next-question/route.ts

// File: app/api/generate-next-question/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Memory for each session
const sessionMemory = new Map<string, {
  questionsAsked: string[];
  topicsCovered: string[];
  userInterests: string[];
  performanceTrend: number[];
}>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      profile,
      currentPerformance = 50,
      previousQuestions = [] as string[],
      conversationHistory = [] as string[],
      isFollowUp = false,
      lastAnswer = '',
      sessionId = 'default'
    } = body;

    // Extract data
    const actualProfile = profile || {};
    const jobTitle = actualProfile.title || '';
    const fieldCategory = actualProfile.fieldCategory || '';
    const assessmentType = actualProfile.assessmentType || 'general-practice';
    const skills = actualProfile.skills || [];
    const experience = actualProfile.experience || '';
    const difficulty = actualProfile.difficulty || 'medium';

    // Initialize session memory
    if (!sessionMemory.has(sessionId)) {
      sessionMemory.set(sessionId, {
        questionsAsked: [],
        topicsCovered: [],
        userInterests: [],
        performanceTrend: []
      });
    }
    const memory = sessionMemory.get(sessionId)!;

    console.log('🧠 Generating next question with context:', {
      jobTitle,
      fieldCategory,
      assessmentType,
      skills: skills.slice(0, 3),
      isFollowUp,
      lastAnswerPreview: lastAnswer?.substring(0, 30),
      previousQuestionsCount: previousQuestions.length,
      conversationLength: conversationHistory.length
    });

    // Analyze conversation to extract topics and interests
    if (lastAnswer) {
      const topics = extractTopicsFromAnswer(lastAnswer);
      const interests = extractInterestsFromAnswer(lastAnswer);
      
      topics.forEach(topic => {
        if (!memory.topicsCovered.includes(topic)) {
          memory.topicsCovered.push(topic);
        }
      });
      
      interests.forEach(interest => {
        if (!memory.userInterests.includes(interest)) {
          memory.userInterests.push(interest);
        }
      });
    }

    // Track performance
    memory.performanceTrend.push(currentPerformance);
    if (memory.performanceTrend.length > 5) {
      memory.performanceTrend = memory.performanceTrend.slice(-5);
    }

    let question = '';
    let isDynamic = false;

    // 1. Check for specific user requests (highest priority)
    if (lastAnswer?.toLowerCase().includes('ask question based on') || 
        lastAnswer?.toLowerCase().includes('question about')) {
      const topic = extractRequestedTopic(lastAnswer);
      question = generateTopicSpecificQuestion(topic, fieldCategory, memory);
      isDynamic = true;
    }
    // 2. Check for programming requests
    else if (lastAnswer?.toLowerCase().includes('programming') || 
             lastAnswer?.toLowerCase().includes('code') ||
             lastAnswer?.toLowerCase().includes('java')) {
      question = generateProgrammingQuestion(lastAnswer, skills, difficulty, memory);
      isDynamic = true;
    }
    // 3. Generate follow-up based on last answer
    else if (isFollowUp && lastAnswer) {
      question = generateFollowUpQuestion(lastAnswer, fieldCategory, memory);
      isDynamic = true;
    }
    // 4. Generate based on user interests from conversation
    else if (memory.userInterests.length > 0) {
      const interest = memory.userInterests[memory.userInterests.length - 1];
      question = generateInterestBasedQuestion(interest, fieldCategory, memory);
      isDynamic = true;
    }
    // 5. Generate based on assessment type with conversation context
    else {
      question = generateContextualQuestion({
        assessmentType,
        jobTitle,
        fieldCategory,
        skills,
        difficulty,
        conversationHistory,
        previousQuestions,
        memory
      });
    }

    // Ensure question is not repetitive
    if (isQuestionSimilar(question, [...memory.questionsAsked, ...previousQuestions])) {
      console.log('⚠️ Question similar to previous, generating alternative');
      question = generateAlternativeQuestion(fieldCategory, assessmentType, [
        ...memory.questionsAsked,
        ...previousQuestions,
        question
      ]);
    }

    // Add to memory
    memory.questionsAsked.push(question);
    if (memory.questionsAsked.length > 10) {
      memory.questionsAsked = memory.questionsAsked.slice(-10);
    }

    console.log('✅ Generated question:', {
      question: question.substring(0, 100),
      isDynamic,
      topicsCovered: memory.topicsCovered.slice(-3),
      userInterests: memory.userInterests.slice(-3),
      questionsAskedCount: memory.questionsAsked.length
    });

    return NextResponse.json({
      question,
      isDynamic,
      context: {
        jobTitle,
        fieldCategory,
        assessmentType,
        difficulty,
        topics: memory.topicsCovered.slice(-3),
        interests: memory.userInterests.slice(-3)
      }
    });

  } catch (error) {
    console.error('❌ Error generating next question:', error);
    
    // More contextual fallback
    const fallbackQuestions = [
      "Based on our conversation so far, what area would you like to explore further?",
      "What's a professional challenge you've been thinking about recently?",
      "How do you see your skills evolving in the next year?",
      "What's something you're currently learning or want to learn?"
    ];
    
    return NextResponse.json({
      question: fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)],
      isDynamic: false,
      context: { error: 'Fallback mode' }
    });
  }
}

// ========== DYNAMIC QUESTION GENERATORS ==========

function extractTopicsFromAnswer(answer: string): string[] {
  if (!answer) return [];
  
  const topics: string[] = [];
  const answerLower = answer.toLowerCase();
  
  const topicKeywords = [
    { words: ['team', 'collaborat', 'work with'], topic: 'teamwork' },
    { words: ['project', 'initiative', 'undertaking'], topic: 'project management' },
    { words: ['problem', 'challenge', 'issue'], topic: 'problem solving' },
    { words: ['learn', 'study', 'educat'], topic: 'learning' },
    { words: ['communicat', 'explain', 'present'], topic: 'communication' },
    { words: ['lead', 'manage', 'supervise'], topic: 'leadership' },
    { words: ['java', 'code', 'program'], topic: 'programming' },
    { words: ['client', 'customer', 'stakeholder'], topic: 'client relations' },
    { words: ['deadline', 'time', 'schedule'], topic: 'time management' }
  ];
  
  topicKeywords.forEach(({ words, topic }) => {
    if (words.some(word => answerLower.includes(word))) {
      topics.push(topic);
    }
  });
  
  return Array.from(new Set(topics)); // Remove duplicates
}

function extractInterestsFromAnswer(answer: string): string[] {
  if (!answer) return [];
  
  const interests: string[] = [];
  const answerLower = answer.toLowerCase();
  
  // Look for phrases indicating interest
  const interestPhrases = [
    { phrase: 'interested in', extractAfter: true },
    { phrase: 'enjoy', extractContext: true },
    { phrase: 'passionate about', extractAfter: true },
    { phrase: 'like to', extractContext: true },
    { phrase: 'want to learn', extractAfter: true }
  ];
  
  interestPhrases.forEach(({ phrase, extractAfter }) => {
    const index = answerLower.indexOf(phrase);
    if (index !== -1) {
      if (extractAfter) {
        const afterPhrase = answer.substring(index + phrase.length, index + phrase.length + 30);
        const words = afterPhrase.split(/\s+/).slice(0, 3).join(' ');
        if (words.trim()) interests.push(words.trim());
      }
    }
  });
  
  return interests;
}

function extractRequestedTopic(answer: string): string {
  const answerLower = answer.toLowerCase();
  
  const topics = [
    'java', 'javascript', 'python', 'react', 'node', 'database',
    'programming', 'software', 'web development', 'mobile',
    'ai', 'machine learning', 'cloud', 'devops'
  ];
  
  for (const topic of topics) {
    if (answerLower.includes(topic)) {
      return topic;
    }
  }
  
  return 'technology';
}

function generateTopicSpecificQuestion(topic: string, fieldCategory: string, memory: any): string {
  const recentQuestions = memory.questionsAsked.slice(-5);
  
  const questionTemplates = {
    'java': [
      `How would you apply Java ${fieldCategory ? `in ${fieldCategory.toLowerCase()}` : 'in real-world applications'}?`,
      `What Java concepts do you find most challenging when working on ${fieldCategory || 'software'} projects?`,
      `Can you describe a situation where Java was particularly well-suited for a ${fieldCategory || 'technical'} challenge?`
    ],
    'programming': [
      `How has programming influenced your approach to ${fieldCategory || 'professional'} challenges?`,
      `What programming principle has been most valuable in your ${fieldCategory || 'work'}?`,
      `Can you share an example of how programming skills helped solve a ${fieldCategory || 'complex'} problem?`
    ],
    'default': [
      `How does ${topic} relate to your experience in ${fieldCategory || 'your field'}?`,
      `What aspects of ${topic} are most relevant to ${fieldCategory || 'professional'} development?`,
      `Can you connect ${topic} to your work in ${fieldCategory || 'this industry'}?`
    ]
  };
  
  let templates = questionTemplates[topic as keyof typeof questionTemplates] || questionTemplates.default;
  
  // Filter out recent similar questions
  templates = templates.filter((template: string) => 
  !recentQuestions.some((q: string) => isQuestionSimilar(q, [template]))
);
  
  return templates.length > 0 
    ? templates[Math.floor(Math.random() * templates.length)]
    : questionTemplates.default[0];
}

function generateProgrammingQuestion(lastAnswer: string, skills: string[], difficulty: string, memory: any): string {
  const recentQuestions = memory.questionsAsked.slice(-5);
  const answerLower = lastAnswer.toLowerCase();
  
  let language = 'programming';
  const languages = ['java', 'python', 'javascript', 'c++', 'c#', 'typescript'];
  
  for (const lang of languages) {
    if (answerLower.includes(lang)) {
      language = lang;
      break;
    }
  }
  
  // Check skills for languages
  if (language === 'programming' && skills.length > 0) {
    for (const skill of skills) {
      const skillLower = skill.toLowerCase();
      for (const lang of languages) {
        if (skillLower.includes(lang)) {
          language = lang;
          break;
        }
      }
      if (language !== 'programming') break;
    }
  }
  
  const questions = [
    `What makes ${language} a good choice for certain types of projects?`,
    `How do you stay current with best practices in ${language} development?`,
    `What's been your most challenging ${language} project and why?`,
    `How would you mentor someone new to ${language}?`
  ];
  
  // Filter recent questions
 const filtered = questions.filter((q: string) => 
  !recentQuestions.some((rq: string) => isQuestionSimilar(rq, [q]))
);

  return filtered.length > 0 
    ? filtered[Math.floor(Math.random() * filtered.length)]
    : questions[0];
}

function generateFollowUpQuestion(lastAnswer: string, fieldCategory: string, memory: any): string {
  const recentQuestions = memory.questionsAsked.slice(-5);
  const topics = extractTopicsFromAnswer(lastAnswer);
  
  if (topics.length > 0) {
    const topic = topics[topics.length - 1];
    
    const followUps = [
      `You mentioned ${topic}. How has that influenced your approach to ${fieldCategory || 'work'}?`,
      `Building on your experience with ${topic}, what would you do differently next time?`,
      `What did you learn from that ${topic} experience that you still apply today?`
    ];
    
    const filtered = followUps.filter((q: string) => 
  !recentQuestions.some((rq: string) => isQuestionSimilar(rq, [q]))
);
    
    if (filtered.length > 0) return filtered[0];
  }
  
  // Generic but contextual follow-ups
  const genericFollowUps = [
    "What was the most important lesson from that experience?",
    "How would you apply what you learned in a different context?",
    "What factors would make you approach this differently now?"
  ];
  
  return genericFollowUps[Math.floor(Math.random() * genericFollowUps.length)];
}

function generateInterestBasedQuestion(interest: string, fieldCategory: string, memory: any): string {
  const recentQuestions = memory.questionsAsked.slice(-5);
  
  const questions = [
    `How does your interest in ${interest} connect to your work in ${fieldCategory || 'your field'}?`,
    `What opportunities do you see to apply ${interest} professionally?`,
    `How has ${interest} influenced your career development?`
  ];
  
  const filtered = questions.filter((q: string) => 
  !recentQuestions.some((rq: string) => isQuestionSimilar(rq, [q]))
);

  
  return filtered.length > 0 
    ? filtered[Math.floor(Math.random() * filtered.length)]
    : `Tell me more about your interest in ${interest}.`;
}

interface ContextualQuestionParams {
  assessmentType: string;
  jobTitle: string;
  fieldCategory: string;
  skills: string[];
  difficulty: string;
  conversationHistory: string[];
  previousQuestions: string[];
  memory: any;
}

function generateContextualQuestion(params: ContextualQuestionParams): string {
  const { assessmentType, fieldCategory, skills, conversationHistory, previousQuestions, memory } = params;
  const recentQuestions = [...memory.questionsAsked, ...previousQuestions].slice(-10);
  
  // Analyze conversation history for themes
  const conversationThemes = analyzeConversationThemes(conversationHistory);
  
  // Build question based on context
  let question = '';
  
  if (conversationThemes.length > 0) {
    const theme = conversationThemes[conversationThemes.length - 1];
    question = `Continuing our discussion about ${theme}, how does this relate to ${fieldCategory || 'your professional work'}?`;
  } else if (skills.length > 0) {
    const skill = skills[Math.floor(Math.random() * skills.length)];
    question = `How have you applied ${skill} in practical situations?`;
  } else {
    // Use assessment type with variation
    const questionsByType = {
      'technical': [
        `What technical trends are impacting ${fieldCategory || 'your field'}?`,
        `How do you approach learning new technologies?`,
        `What's your process for solving technical problems?`
      ],
      'behavioral': [
        `How do you handle workplace challenges?`,
        `What's your approach to professional relationships?`,
        `How do you adapt to changing circumstances?`
      ],
      'default': [
        `What professional growth are you currently focused on?`,
        `How do you measure success in your work?`,
        `What's important to you in a professional environment?`
      ]
    };
    
    const bank = questionsByType[assessmentType as keyof typeof questionsByType] || questionsByType.default;
    
    // Filter out recent questions
    const available = bank.filter(q => 
      !recentQuestions.some(rq => isQuestionSimilar(rq, [q]))
    );
    
    question = available.length > 0 
      ? available[Math.floor(Math.random() * available.length)]
      : bank[0];
  }
  
  return question;
}

function analyzeConversationThemes(conversationHistory: string[]): string[] {
  const themes: string[] = [];
  
  conversationHistory.forEach((entry, index) => {
    if (index % 2 === 0) { // User answers
      const topics = extractTopicsFromAnswer(entry);
      topics.forEach(topic => {
        if (!themes.includes(topic)) {
          themes.push(topic);
        }
      });
    }
  });
  
  return themes;
}

function generateAlternativeQuestion(fieldCategory: string, assessmentType: string, recentQuestions: string[]): string {
  const alternatives = [
    `What's been your most valuable learning experience in ${fieldCategory || 'your career'}?`,
    `How do you stay motivated in ${fieldCategory || 'professional'} work?`,
    `What advice would you give someone starting in ${fieldCategory || 'this field'}?`,
    `How has ${fieldCategory || 'your industry'} changed in recent years?`
  ];
  
  const filtered = alternatives.filter(q => 
    !recentQuestions.some(rq => isQuestionSimilar(rq, [q]))
  );
  
  return filtered.length > 0 
    ? filtered[Math.floor(Math.random() * filtered.length)]
    : alternatives[0];
}

function isQuestionSimilar(question1: string, compareQuestions: string[]): boolean {
  if (!question1) return false;
  
  const q1Lower = question1.toLowerCase();
  const q1Words = q1Lower.split(/\s+/).filter(w => w.length > 3);
  
  for (const compare of compareQuestions) {
    if (!compare) continue;
    
    const cLower = compare.toLowerCase();
    
    // Exact match or contains
    if (q1Lower === cLower || q1Lower.includes(cLower) || cLower.includes(q1Lower)) {
      return true;
    }
    
    // Check for significant word overlap
    const cWords = cLower.split(/\s+/).filter(w => w.length > 3);
    const commonWords = q1Words.filter(w => cWords.includes(w));
    
    if (commonWords.length >= 2) {
      return true;
    }
  }
  
  return false;
}