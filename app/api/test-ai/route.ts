// app/api/test-ai/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: 'GROQ_API_KEY not found in environment variables',
        envKeys: Object.keys(process.env).filter(key => key.includes('GROQ') || key.includes('API'))
      });
    }
    
    // Test with a simple prompt
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
            role: 'user',
            content: 'Hello! Can you analyze this simple test?'
          }
        ],
        temperature: 0.7,
        max_tokens: 50,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        message: 'API is working!',
        response: data.choices[0]?.message?.content,
        model: data.model
      });
    } else {
      return NextResponse.json({
        success: false,
        status: response.status,
        message: 'API returned error status'
      });
    }
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}