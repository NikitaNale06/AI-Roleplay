import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  try {
    const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

    if (!HUGGING_FACE_API_KEY) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured' },
        { status: 500 }
      );
    }

    // Safely handle the route parameter
    const routeSegments = params.route || [];
    
    if (routeSegments.length === 0) {
      return NextResponse.json(
        { error: 'Model route is required' },
        { status: 400 }
      );
    }

    const modelPath = routeSegments.join('/');
    const requestBody = await request.json();

    console.log('Calling Hugging Face model:', modelPath);

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelPath}`,
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Hugging Face API error: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Hugging Face API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process Hugging Face request' },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for model info
export async function GET(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  try {
    const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

    if (!HUGGING_FACE_API_KEY) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured' },
        { status: 500 }
      );
    }

    const routeSegments = params.route || [];
    
    if (routeSegments.length === 0) {
      return NextResponse.json(
        { error: 'Model route is required' },
        { status: 400 }
      );
    }

    const modelPath = routeSegments.join('/');

    const response = await fetch(
      `https://huggingface.co/api/models/${modelPath}`,
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch model info: ${response.status}` },
        { status: response.status }
      );
    }

    const modelInfo = await response.json();
    return NextResponse.json(modelInfo);
    
  } catch (error) {
    console.error('Hugging Face model info error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model information' },
      { status: 500 }
    );
  }
}