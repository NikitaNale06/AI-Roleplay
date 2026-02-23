import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";

export async function POST(req: NextRequest) {
  try {
    const { audioBase64 } = await req.json();

    // Check if API key exists
    const apiKey = process.env.DEEPGRAM_API_KEY;
    
    if (!apiKey) {
      console.error("❌ DEEPGRAM_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "Deepgram API key is not configured" },
        { status: 500 }
      );
    }

    const deepgram = createClient(apiKey);

    const audioBuffer = Buffer.from(audioBase64, "base64");

    const response = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova-2",
        smart_format: true,
        filler_words: true,
        sentiment: true
      }
    );

    // Check if response and result exist
    if (!response || !response.result) {
      console.error("❌ Deepgram response or result is null");
      return NextResponse.json(
        { 
          transcript: "",
          confidence: 0.5,
          wpm: 150,
          fillerCount: 0,
          voiceScore: 50
        },
        { status: 200 }
      );
    }

    const result = response.result;
    
    // Safely access nested properties with fallbacks
    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
    const confidence = result?.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0.5;
    const words = result?.results?.channels?.[0]?.alternatives?.[0]?.words || [];
    const duration = result?.metadata?.duration || 1;

    const wordCount = words.length;

    // Calculate WPM safely
    let wpm = 150; // default
    if (duration > 0 && wordCount > 0) {
      wpm = Math.round((wordCount / duration) * 60);
    }

    // Count filler words
    const fillerWords = ["um", "uh", "like", "ah", "er", "hmm"];
    const fillerCount = words.filter((w: any) => 
      fillerWords.includes(w.word?.toLowerCase())
    ).length;

    // Voice Score Calculation
    let voiceScore = 50; // base score
    
    voiceScore += (confidence * 40); // confidence contribution (0-40)
    voiceScore += Math.min((wpm / 150) * 30, 30); // pace contribution (0-30)
    voiceScore -= fillerCount * 2; // penalty for filler words

    voiceScore = Math.max(20, Math.min(100, Math.round(voiceScore)));

    console.log("✅ Deepgram analysis successful:", {
      transcriptLength: transcript.length,
      confidence,
      wpm,
      fillerCount,
      voiceScore
    });

    return NextResponse.json({
      transcript,
      confidence,
      wpm,
      fillerCount,
      voiceScore
    });

  } catch (error) {
    console.error("❌ Deepgram API error:", error);
    
    // Return fallback data instead of error
    return NextResponse.json(
      { 
        transcript: "",
        confidence: 0.5,
        wpm: 150,
        fillerCount: 0,
        voiceScore: 50
      },
      { status: 200 }
    );
  }
}