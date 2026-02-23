import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { performanceData, profile } = body;
    
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        feedback: "Great work on completing the assessment! To improve your communication skills: 1) Practice speaking clearly and confidently, 2) Use specific examples in your answers, 3) Maintain good posture and eye contact."
      });
    }
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{
          role: 'user',
          content: `Generate personalized feedback for interview performance:
          
          Assessment: ${profile?.assessmentType} - ${profile?.fieldCategory}
          Score: ${performanceData.finalScore}%
          
          Voice Analysis:
          - Clarity: ${performanceData.voiceAnalysis?.summary?.clarity || 0}%
          - Confidence: ${performanceData.voiceAnalysis?.summary?.confidence || 0}%
          
          Behavioral Analysis:
          - Eye Contact: ${performanceData.behavioralAnalysis?.behavior?.eyeContact || 0}%
          - Engagement: ${performanceData.behavioralAnalysis?.behavior?.overallEngagement || 0}%
          
          Provide 3 specific, actionable tips to improve communication skills.`
        }],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        feedback: data.choices[0]?.message?.content || "Well done! Keep practicing your communication skills."
      });
    }
    
    throw new Error('API call failed');
    
  } catch (error: any) {
    console.error('❌ Error generating feedback:', error);
    return NextResponse.json({
      feedback: "Congratulations on completing the assessment! Continue practicing to improve your communication skills."
    });
  }
}