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
      isFollowUp: body.isFollowUp || false,
      lastAnswer: body.lastAnswer ? body.lastAnswer.substring(0, 100) + '...' : 'No answer'
    });

    // If this is a follow-up question, generate a specific follow-up based on the actual answer
    if (body.isFollowUp && body.lastQuestion && body.lastAnswer) {
      const followUpPrompt = `You are an expert interviewer conducting a natural conversation. Generate a SPECIFIC follow-up question based on the candidate's ACTUAL response.

CONTEXT:
JOB POSITION: ${body.jobTitle || 'Not specified'}
PREVIOUS QUESTION: "${body.lastQuestion}"
CANDIDATE'S ACTUAL ANSWER: "${body.lastAnswer}"
ANSWER SCORE: ${body.answerScore || 'No score'}%
CONVERSATION CONTEXT: ${body.conversationContext ? body.conversationContext.join(' | ') : 'No context'}

Generate a NATURAL follow-up question that:
1. DIRECTLY addresses something specific from their actual answer
2. Asks for clarification, more details, or examples about what they just said
3. Feels like a natural continuation of the conversation
4. Helps explore their answer more deeply
5. Is conversational and flows naturally from their response

IMPORTANT: 
- Make it feel like a real conversation, not an interrogation
- Reference something specific from their answer if possible
- Don't ask generic follow-ups - be specific to their response
- Keep it concise (1 sentence if possible)

Examples of good follow-ups:
- "You mentioned [specific thing from their answer], could you tell me more about that?"
- "That's interesting. What was the outcome of that approach?"
- "Could you give me a specific example of when you used that method?"
- "What challenges did you face when implementing that solution?"

Respond with valid JSON only using this structure:
{
  "question": "The natural, conversational follow-up question",
  "type": "follow-up",
  "difficulty": "easy/medium/hard",
  "category": "Same as previous question",
  "timeLimit": 120,
  "fieldRelevant": true,
  "reasoning": "Brief explanation of why this specific follow-up was chosen based on their answer",
  "followsUp": true,
  "skillFocus": ["Primary skill being assessed"],
  "expectedAnswer": "What a good response to this specific follow-up would contain",
  "correctedAnswer": "How to improve a weak response to this specific follow-up"
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
              content: `You are a skilled interviewer having a natural conversation. Generate follow-up questions that flow naturally from the candidate's specific responses. Always make questions conversational and specific to what they actually said. Respond with valid JSON only.`
            },
            {
              role: 'user',
              content: followUpPrompt
            }
          ],
          temperature: 0.8, // Slightly higher temperature for more natural conversation
          max_tokens: 800,
          response_format: { type: 'json_object' }
        })
      });

      if (groqResponse.ok) {
        const data = await groqResponse.json();
        const questionData = JSON.parse(data.choices[0].message.content);
        
        console.log('✅ Generated natural follow-up question:', questionData.question);
        console.log('📝 Reasoning:', questionData.reasoning);
        
        return NextResponse.json({
          success: true,
          question: questionData,
          isFollowUp: true
        });
      }
    }

    // Use Groq API to generate a more contextual next question
    const prompt = `You are an expert interviewer conducting a mock interview. Generate the next MAIN question based on the conversation context.

INTERVIEW CONTEXT:
JOB POSITION: ${body.jobTitle || 'Not specified'}
FIELD/CATEGORY: ${body.fieldCategory || 'General'}
EXPERIENCE LEVEL: ${body.experience || 'Not specified'}
REQUIRED SKILLS: ${body.skills ? body.skills.join(', ') : 'Not specified'}
CURRENT PERFORMANCE: ${body.performanceScore || body.answerScore || 'No score'}%
QUESTIONS ANSWERED: ${body.currentQuestionIndex || 0}
CONVERSATION HISTORY: ${body.conversationContext ? body.conversationContext.slice(-2).join(' | ') : 'No history'}

Generate a relevant NEXT MAIN question that:
1. Is appropriate for the job position and experience level
2. Builds naturally on the conversation so far OR introduces a relevant new topic
3. Matches the difficulty based on their performance (${body.performanceScore || body.answerScore || 'unknown'}%)
4. Tests relevant skills for the position
5. Feels like a natural progression in the interview

DIFFICULTY GUIDE:
- Score < 60: Use easy questions to build confidence
- Score 60-75: Use medium questions to challenge appropriately  
- Score > 75: Use hard questions to test depth of knowledge

QUESTION TYPE GUIDE:
- Technical roles: Focus on technical problems, methodologies, tools
- Behavioral questions: Focus on experiences, teamwork, challenges
- Situational questions: Focus on hypothetical scenarios, problem-solving

Respond with valid JSON only using this structure:
{
  "question": "The interview question that continues the conversation naturally",
  "type": "technical/behavioral/situational/problem-solving",
  "difficulty": "easy/medium/hard",
  "category": "Relevant category based on job field",
  "timeLimit": 180,
  "fieldRelevant": true,
  "reasoning": "Brief explanation of why this question was chosen based on job context and performance",
  "followsUp": false,
  "skillFocus": ["Primary skill being assessed"],
  "expectedAnswer": "A comprehensive ideal answer that demonstrates expertise and relevance to the role",
  "correctedAnswer": "An example of how to improve a basic answer with specific examples and measurable outcomes"
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
            content: `You are an expert interviewer. Generate relevant, contextual interview questions that flow naturally in conversation. Adjust difficulty based on candidate performance. Always respond with valid JSON only.`
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
    
    console.log('✅ Generated main question:', questionData.question);
    console.log('📝 Reasoning:', questionData.reasoning);
    
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

// Enhanced fallback question generation with better context
function generateFallbackQuestion(body: any) {
  const field = body.fieldCategory || 'default';
  const performance = body.performanceScore || body.answerScore || 50;
  
  // Enhanced question banks with better categorization
  const questionBanks = {
    'Engineering & Technology': {
      easy: [
        "Can you walk me through your experience with version control systems like Git?",
        "What programming languages are you most comfortable with and why?",
        "How do you approach learning new technologies?",
        "Can you describe a simple project you've worked on recently?",
      ],
      medium: [
        "How do you approach debugging a complex technical issue?",
        "What's your experience with agile development methodologies?",
        "Can you describe a challenging technical problem you solved recently?",
        "How do you ensure code quality in your projects?",
      ],
      hard: [
        "How do you handle technical debt in long-term projects?",
        "Can you explain a complex technical concept to a non-technical stakeholder?",
        "What's your approach to system design for scalable applications?",
        "How do you stay updated with the latest technology trends and evaluate which to adopt?",
      ]
    },
    'Business & Management': {
      easy: [
        "How do you prioritize tasks when managing multiple projects?",
        "Can you describe your experience with team collaboration?",
        "What tools do you use for project management?",
        "How do you handle routine day-to-day responsibilities?",
      ],
      medium: [
        "Can you describe your experience with budget management?",
        "How do you handle conflicts within a team?",
        "What's your approach to strategic planning?",
        "How do you measure project success beyond basic metrics?",
      ],
      hard: [
        "How do you align team objectives with overall business strategy?",
        "Can you describe a time you had to make a difficult decision with limited information?",
        "How do you foster innovation while maintaining operational efficiency?",
        "What's your approach to managing organizational change?",
      ]
    },
    'default': {
      easy: [
        "Can you tell me more about that experience?",
        "What aspects of this role interest you most?",
        "How do you typically approach new challenges?",
        "Can you describe a recent accomplishment you're proud of?",
      ],
      medium: [
        "What were the key learnings from that situation?",
        "How would you approach this differently today?",
        "What specific skills did you develop from that experience?",
        "Can you provide an example that demonstrates your problem-solving approach?",
      ],
      hard: [
        "How does this experience prepare you for the challenges of this specific role?",
        "What would you do if you faced a situation where your preferred approach wasn't working?",
        "How do you balance competing priorities when resources are limited?",
        "What's the most valuable lesson you've learned from past failures?",
      ]
    }
  };

  // Determine difficulty based on performance
  let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  if (performance < 60) difficulty = 'easy';
  else if (performance > 75) difficulty = 'hard';

  // Get appropriate question bank
  const bank = (questionBanks as any)[field] || questionBanks.default;
  const questions = bank[difficulty] || bank.medium; // Fallback to medium if difficulty not found
  
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  
  // Determine question type based on context
  let questionType = 'behavioral';
  if (field.includes('Engineering') || field.includes('Technology')) {
    questionType = Math.random() > 0.5 ? 'technical' : 'problem-solving';
  } else if (field.includes('Business') || field.includes('Management')) {
    questionType = Math.random() > 0.5 ? 'situational' : 'behavioral';
  }

  return {
    success: true,
    question: {
      question: randomQuestion,
      type: questionType,
      difficulty: difficulty,
      category: body.fieldCategory || 'General',
      timeLimit: 180,
      fieldRelevant: true,
      reasoning: `Generated ${difficulty} question for ${body.fieldCategory || 'general'} field based on performance score of ${performance}`,
      followsUp: false,
      skillFocus: body.skills?.[0] ? [body.skills[0]] : ['Problem Solving'],
      expectedAnswer: "A comprehensive answer addressing all aspects of the question with specific examples, clear reasoning, and relevance to the role.",
      correctedAnswer: "An improved answer would include more specific examples, measurable outcomes, a clearer thought process, and direct connections to the role requirements."
    },
    isFollowUp: false
  };
}