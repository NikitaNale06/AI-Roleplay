import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      question,
      answer,
      performanceScore,
      conversationContext,
      profile,
      voiceMetrics,
      behavioralMetrics
    } = body;

    const systemPrompt = `
You are an intelligent adaptive AI interviewer.

Your job:
1. Analyze the candidate answer deeply.
2. Score between 0-100.
3. Detect:
   - clarity
   - structure
   - examples
   - measurable results
4. Adjust difficulty:
   - score >= 80 → hard
   - score >= 60 → medium
   - otherwise → easy
5. If answer is weak or unclear, ask follow-up.
6. Avoid repeating previous questions.
7. Consider voice & behavioral metrics if provided.

Return ONLY valid JSON in this exact format:

{
  "score": number,
  "difficultyLevel": "easy" | "medium" | "hard",
  "detailedFeedback": "string",
  "strengths": ["string"],
  "improvements": ["string"],
  "hasFollowUp": boolean,
  "followUpQuestion": "string or null",
  "needsClarification": boolean,
  "voiceRecommendations": ["string"],
  "behavioralRecommendations": ["string"]
}
`;

    const userPrompt = `
Interview Type: ${profile?.assessmentType}
Field: ${profile?.fieldCategory}

Question:
${question}

Candidate Answer:
${answer}

Previous Conversation:
${conversationContext?.join("\n")}

Voice Metrics:
${JSON.stringify(voiceMetrics)}

Behavioral Metrics:
${JSON.stringify(behavioralMetrics)}

Analyze and respond in JSON only.
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Analyze error:", error);

    return NextResponse.json({
      score: 50,
      difficultyLevel: "medium",
      detailedFeedback: "There was an issue analyzing the response.",
      strengths: [],
      improvements: ["Try structuring your answer better."],
      hasFollowUp: true,
      followUpQuestion: "Can you clarify your answer with a specific example?",
      needsClarification: true,
      voiceRecommendations: [],
      behavioralRecommendations: []
    });
  }
}