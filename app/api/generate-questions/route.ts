import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface GenerateRequest {
  assessmentType: string;
  title: string;
  skills: string[];
  fieldCategory: string;
  difficulty: string;
  questions?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { 
      assessmentType = 'general-practice',
      title = 'Interview Preparation', 
      skills = [], 
      fieldCategory = 'General',
      difficulty = 'medium',
      questions = 8 
    } = body;

    console.log('📝 Generating questions for:', { 
      type: assessmentType, 
      title, 
      fieldCategory, 
      difficulty, 
      skills 
    });

    // Try to use GROQ API, but have strong fallback
    const questionsList = await generateQuestionsWithFallback(
      assessmentType,
      title,
      fieldCategory,
      skills,
      difficulty,
      questions
    );

    console.log(`✅ Generated ${questionsList.length} questions for ${assessmentType}`);
    
    return NextResponse.json({
      questions: questionsList,
      assessmentType,
      fieldCategory,
      difficulty,
      count: questionsList.length,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Error generating questions:', error);
    
    // Fallback questions
    const fallbackQuestions = getFallbackQuestions(
      'general-practice',
      'General',
      [],
      8
    );
    
    return NextResponse.json({
      error: 'Failed to generate questions', 
      details: error.message,
      questions: fallbackQuestions,
      isFallback: true
    });
  }
}

async function generateQuestionsWithFallback(
  assessmentType: string,
  title: string,
  fieldCategory: string,
  skills: string[],
  difficulty: string,
  count: number
): Promise<string[]> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ GROQ_API_KEY not found in environment');
    return getFallbackQuestions(assessmentType, fieldCategory, skills, count);
  }

  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // Build a more detailed prompt based on actual profile data
    const prompt = `Generate ${count} ${difficulty} difficulty interview questions for a ${assessmentType} assessment.

SPECIFIC CONTEXT:
- Job/Position: ${title}
- Field/Category: ${fieldCategory}
- Skills to assess: ${skills.join(', ') || 'General communication skills'}
- Assessment Type: ${assessmentType}

INSTRUCTIONS:
1. Generate questions specifically relevant to ${fieldCategory} field
2. Focus on assessing ${skills.length > 0 ? skills.join(', ') : 'communication'} skills
3. Questions should be practical and interview-relevant
4. Vary question types (conceptual, practical, situational)
5. Make questions specific to the ${fieldCategory} domain

OUTPUT FORMAT: Return as a numbered list (1. Question 2. Question ...)`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview coach. Generate specific, relevant interview questions based on the provided field, skills, and assessment type.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`⚠️ GROQ API returned ${response.status}`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    console.log('📝 API Response content preview:', content.substring(0, 200));
    
    if (!content.trim()) {
      throw new Error('Empty response from API');
    }

    // Parse questions from response
    const questions = parseQuestionsFromText(content, count);
    
    if (questions.length >= count) {
      console.log(`✅ Generated ${questions.length} questions via API`);
      return questions.slice(0, count);
    }

    // If we didn't get enough questions, fill with fallback
    console.log(`⚠️ Only got ${questions.length} questions from API, adding fallback`);
    const fallbackQuestions = getFallbackQuestions(assessmentType, fieldCategory, skills, count - questions.length);
    return [...questions, ...fallbackQuestions];

  } catch (error) {
    console.warn('⚠️ GROQ API failed, using fallback questions:', error);
    return getFallbackQuestions(assessmentType, fieldCategory, skills, count);
  }
}

function parseQuestionsFromText(text: string, expectedCount: number): string[] {
  const questions: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Match patterns: 1. Question, Q1: Question, - Question, * Question
    const cleanLine = line.trim();
    
    if (cleanLine.match(/^(\d+[\.\)]|Q\d+[:\.]|[-*])\s+(.+[?])/i)) {
      const match = cleanLine.match(/^(\d+[\.\)]|Q\d+[:\.]|[-*])\s+(.+)/i);
      if (match && match[2]) {
        questions.push(match[2].trim());
      }
    } else if (cleanLine.endsWith('?') && cleanLine.length > 20) {
      questions.push(cleanLine);
    }
    
    if (questions.length >= expectedCount) break;
  }
  
  return questions;
}

function getFallbackQuestions(
  assessmentType: string,
  fieldCategory: string,
  skills: string[] = [],
  count: number = 8
): string[] {
  console.log('🔄 Using dynamic fallback questions for:', {
    assessmentType,
    fieldCategory,
    skills,
    count
  });

  // Helper function to create dynamic questions
  const createQuestion = (template: string) => {
    if (fieldCategory && fieldCategory !== 'General') {
      return template.replace(/\{field\}/g, fieldCategory);
    }
    if (skills.length > 0) {
      return template.replace(/\{field\}/g, skills[0]);
    }
    return template.replace(/\{field\}/g, 'this area');
  };

  // ========== ACADEMIC VIVA QUESTIONS ==========
  if (assessmentType === 'academic-viva') {
    const academicVivaQuestions = [
      // Research Focus
      `What motivated your research focus in {field}?`,
      `How does your work in {field} address gaps in current literature?`,
      `What theoretical frameworks guided your {field} research?`,
      
      // Methodology
      `Explain your research methodology for studying {field}.`,
      `What data collection methods were most appropriate for {field} research?`,
      `How did you ensure validity in your {field} analysis?`,
      
      // Analysis & Contribution
      `What were your key findings in {field} and their significance?`,
      `How does your research contribute to {field} scholarship?`,
      `What limitations did you encounter in your {field} study?`,
      
      // Application & Future
      `What practical applications does your {field} research have?`,
      `How would you extend this research in {field}?`,
      `What ethical considerations were important in your {field} work?`,
      
      // Critical Thinking
      `What current debates in {field} does your research engage with?`,
      `How has your perspective on {field} evolved through your research?`,
      `What methodological innovations did you bring to {field} research?`
    ].map(createQuestion);

    return academicVivaQuestions.slice(0, count);
  }

  // ========== TECHNICAL QUESTIONS ==========
  if (assessmentType === 'technical') {
    const technicalQuestions = [
      // Problem Solving
      `Describe a complex {field} problem you solved and your approach.`,
      `How do you approach debugging difficult issues in {field}?`,
      `What architectural patterns are most effective for {field} systems?`,
      
      // Design & Implementation
      `How would you design a scalable solution for {field}?`,
      `What trade-offs do you consider when designing {field} systems?`,
      `How do you ensure code quality in {field} development?`,
      
      // Tools & Technologies
      `What tools and technologies are essential for modern {field} work?`,
      `How do you stay updated with {field} technologies?`,
      `What emerging technologies are impacting {field}?`,
      
      // Best Practices
      `What security considerations are critical for {field} applications?`,
      `How do you optimize performance in {field} systems?`,
      `What testing strategies work best for {field} projects?`,
      
      // Experience & Learning
      `What challenging {field} project are you most proud of?`,
      `How do you approach learning new {field} technologies?`,
      `What common pitfalls should developers avoid in {field}?`
    ].map(createQuestion);

    return technicalQuestions.slice(0, count);
  }

  // ========== BEHAVIORAL QUESTIONS ==========
  if (assessmentType === 'behavioral') {
    const behavioralQuestions = [
      // Teamwork & Collaboration
      `Describe a challenging team situation in {field} and how you handled it.`,
      `How do you handle disagreements with colleagues in {field} projects?`,
      `What makes an effective team in the {field} industry?`,
      
      // Problem Solving
      `Tell me about a difficult problem you faced in {field} and how you solved it.`,
      `How do you approach making important decisions in {field} work?`,
      `Describe a time you failed in {field} and what you learned.`,
      
      // Leadership & Initiative
      `How do you demonstrate leadership in {field} projects?`,
      `Describe a time you took initiative in a {field} situation.`,
      `How do you mentor junior colleagues in {field}?`,
      
      // Adaptability
      `How do you handle changing priorities in {field} work?`,
      `Describe adapting to significant change in {field}.`,
      `How do you stay productive under pressure in {field}?`,
      
      // Professional Development
      `What skills are most valuable for success in {field}?`,
      `How do you handle receiving critical feedback in {field}?`,
      `Where do you see yourself growing in {field}?`
    ].map(createQuestion);

    return behavioralQuestions.slice(0, count);
  }

  // ========== COMMUNICATION TEST QUESTIONS ==========
  if (assessmentType === 'communication-test') {
    const communicationQuestions = [
      // Presentation Skills
      `How would you explain a complex {field} concept to a non-expert?`,
      `Describe preparing for an important {field} presentation.`,
      `How do you engage different audiences when discussing {field}?`,
      
      // Interpersonal Communication
      `How do you handle difficult conversations about {field} topics?`,
      `What techniques make your {field} communication more effective?`,
      `How do you adapt your communication style for {field} contexts?`,
      
      // Written Communication
      `How do you ensure clarity in written {field} communications?`,
      `What makes effective documentation in {field} work?`,
      `How do you simplify complex {field} information in writing?`,
      
      // Listening & Understanding
      `How do you ensure you understand others in {field} discussions?`,
      `What active listening techniques help in {field} communication?`,
      `How do you handle misunderstandings about {field} topics?`,
      
      // Persuasion & Influence
      `How do you persuade others about {field} ideas or approaches?`,
      `Describe successfully influencing a {field} decision.`,
      `What makes communication persuasive in {field} contexts?`
    ].map(createQuestion);

    return communicationQuestions.slice(0, count);
  }

  // ========== DOMAIN-SPECIFIC QUESTIONS ==========
  if (assessmentType === 'domain-specific') {
    const domainQuestions = [
      // Industry Knowledge
      `What trends are currently shaping the {field} industry?`,
      `What challenges are unique to working in {field}?`,
      `How do regulations impact {field} operations?`,
      
      // Best Practices
      `What are the industry best practices for {field}?`,
      `How do you stay current with {field} developments?`,
      `What innovations are transforming {field}?`,
      
      // Problem Solving
      `Describe a typical problem-solving scenario in {field}.`,
      `How do you approach decision-making in {field} contexts?`,
      `What risk management strategies work in {field}?`,
      
      // Professional Skills
      `What skills are most valuable for success in {field}?`,
      `How do you handle ethical dilemmas in {field}?`,
      `What professional networks are important in {field}?`,
      
      // Future Outlook
      `Where do you see {field} heading in the next 5 years?`,
      `What emerging opportunities exist in {field}?`,
      `How is technology changing {field} practices?`
    ].map(createQuestion);

    return domainQuestions.slice(0, count);
  }

  // ========== CONCEPTUAL QUESTIONS ==========
  if (assessmentType === 'conceptual') {
    const conceptualQuestions = [
      // Fundamental Concepts
      `Explain the core concepts of {field} to someone new to the field.`,
      `What are the foundational theories in {field}?`,
      `How do key concepts in {field} interrelate?`,
      
      // Critical Analysis
      `What are the main debates or controversies in {field}?`,
      `How has thinking about {field} evolved over time?`,
      `What limitations exist in current {field} models?`,
      
      // Application
      `How are {field} concepts applied in practice?`,
      `What real-world problems can {field} thinking help solve?`,
      `How does {field} connect to other disciplines?`,
      
      // Systems Thinking
      `How do you approach complex systems in {field}?`,
      `What patterns or relationships are important in {field}?`,
      `How does {field} thinking help solve complex problems?`,
      
      // Future Development
      `What areas of {field} need further development?`,
      `How might {field} concepts evolve in the future?`,
      `What new approaches are emerging in {field}?`
    ].map(createQuestion);

    return conceptualQuestions.slice(0, count);
  }

  // ========== CONFIDENCE-BUILDING QUESTIONS ==========
  if (assessmentType === 'confidence-building') {
    const confidenceQuestions = [
      // Self-Expression
      `What helps you feel confident discussing {field} topics?`,
      `How do you prepare to speak confidently about {field}?`,
      `What techniques help you overcome nervousness in {field} discussions?`,
      
      // Communication
      `How do you build confidence in {field} presentations?`,
      `What makes you feel most authentic when discussing {field}?`,
      `How do you handle self-doubt in {field} situations?`,
      
      // Growth Mindset
      `How have you grown in confidence with {field} over time?`,
      `What successes have boosted your confidence in {field}?`,
      `How do you learn from mistakes in {field}?`,
      
      // Body Language
      `How does body language affect confidence in {field} settings?`,
      `What physical techniques help you feel confident discussing {field}?`,
      `How do you project confidence in {field} interactions?`,
      
      // Practice & Preparation
      `What practice methods build your {field} confidence?`,
      `How do you mentally prepare for {field} conversations?`,
      `What feedback has helped your confidence in {field}?`
    ].map(createQuestion);

    return confidenceQuestions.slice(0, count);
  }

  // ========== GENERAL PRACTICE QUESTIONS ==========
  if (assessmentType === 'general-practice') {
    const generalQuestions = [
      // Background & Experience
      `What interests you about {field}?`,
      `How did you become interested in {field}?`,
      `What experiences have shaped your approach to {field}?`,
      
      // Skills & Strengths
      `What strengths do you bring to {field} work?`,
      `How do you apply your skills in {field} contexts?`,
      `What makes you effective in {field} situations?`,
      
      // Goals & Aspirations
      `What do you hope to achieve in {field}?`,
      `How do you see yourself growing in {field}?`,
      `What opportunities excite you in {field}?`,
      
      // Problem Approach
      `How do you typically approach {field} challenges?`,
      `What problem-solving methods work well in {field}?`,
      `How do you make decisions about {field} matters?`,
      
      // Collaboration
      `How do you work with others in {field} settings?`,
      `What makes collaboration successful in {field}?`,
      `How do you contribute to {field} teams?`
    ].map(createQuestion);

    return generalQuestions.slice(0, count);
  }

  // ========== DEFAULT FALLBACK ==========
  const defaultQuestions = [
    `Tell me about your experience with {field}.`,
    `What interests you most about {field}?`,
    `How do you approach challenges in {field}?`,
    `What skills are important for success in {field}?`,
    `How have you grown professionally in {field}?`,
    `What recent developments in {field} excite you?`,
    `How do you contribute to {field} projects?`,
    `Where do you see {field} heading in the future?`
  ].map(createQuestion);

  return defaultQuestions.slice(0, count);
}
export async function GET() {
  return NextResponse.json({
    message: 'Question Generation API',
    description: 'Generate interview questions for communication skills assessment',
    endpoints: {
      POST: 'Generate questions with assessment type, title, skills, fieldCategory'
    }
  });
}