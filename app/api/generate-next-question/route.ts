import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      profile,
      currentPerformance,
      previousQuestions,
      conversationHistory,
      isFollowUp,
      lastAnswer,
      voiceMetrics,
      behavioralMetrics,
      mainQuestions,
      currentQuestionIndex
    } = body;

    // If predefined main questions exist
    if (mainQuestions?.length > 0) {
      if (currentQuestionIndex >= mainQuestions.length) {
        return NextResponse.json({ isComplete: true });
      }

      return NextResponse.json({
        question: mainQuestions[currentQuestionIndex],
        isComplete: false
      });
    }

    const systemPrompt = `
You are an adaptive AI interviewer.

Rules:
- Adjust difficulty based on currentPerformance.
- >=80 → hard
- >=60 → medium
- else → easy

- Avoid repeating previous questions.
- Ask contextual questions.
- If lastAnswer was weak, simplify.
- If strong, increase complexity.

Return JSON only:

{
  "question": "string",
  "isComplete": false
}
`;

    const userPrompt = `
Interview Type: ${profile?.assessmentType}
Field: ${profile?.fieldCategory}
Skills: ${profile?.skills}

Current Performance: ${currentPerformance}

Previous Questions:
${previousQuestions?.join("\n")}

Conversation Context:
${conversationHistory?.join("\n")}

Last Answer:
${lastAnswer}

Voice Metrics:
${JSON.stringify(voiceMetrics)}

Behavioral Metrics:
${JSON.stringify(behavioralMetrics)}

Generate next adaptive question.
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
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
    console.error("Question generation error:", error);

    return NextResponse.json({
      question: "Can you describe a challenging experience in your field?",
      isComplete: false
    });
  }
}