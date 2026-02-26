export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= POST =================
export async function POST(req: Request) {
  console.log("📥 POST /api/interview/results - Started");

  try {
    const body = await req.json();
    console.log("📦 POST Body received keys:", Object.keys(body));

    // Validate required field
    if (body.finalScore === undefined && body.finalScore !== 0) {
      return NextResponse.json(
        { error: "finalScore is required" },
        { status: 400 }
      );
    }

    const data: any = {
      userId: body.userId || "guest-user",
      finalScore: Number(body.finalScore) || 0,
      answers:
        typeof body.answers === "string"
          ? body.answers
          : JSON.stringify(body.answers || []),
      totalTime: Number(body.totalTime) || 0,
      questionsAsked: Number(body.questionsAsked) || 0,
    };

    // Optional fields
    if (body.assessmentType) data.assessmentType = body.assessmentType;
    if (body.fieldCategory) data.fieldCategory = body.fieldCategory;
    if (body.feedback) data.feedback = body.feedback;

    if (body.voiceAnalysis) {
      data.voiceAnalysis =
        typeof body.voiceAnalysis === "string"
          ? body.voiceAnalysis
          : JSON.stringify(body.voiceAnalysis);
    }

    if (body.behavioralAnalysis) {
      data.behavioralAnalysis =
        typeof body.behavioralAnalysis === "string"
          ? body.behavioralAnalysis
          : JSON.stringify(body.behavioralAnalysis);
    }

    console.log("📦 Saving to database...");

    const result = await prisma.interviewResult.create({
      data,
    });

    console.log("✅ POST successful - ID:", result.id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("🔥 POST ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to save interview result",
        code: error?.code || "UNKNOWN",
      },
      { status: 500 }
    );
  }
}

// ================= GET =================
export async function GET(req: Request) {
  console.log("📥 GET /api/interview/results - Started");

  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const userId = url.searchParams.get("userId") || "guest-user";

    const limit = limitParam ? parseInt(limitParam) : undefined;

    console.log(`📋 Params - userId: ${userId}, limit: ${limit || "all"}`);

    // Fetch results
    const results = await prisma.interviewResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    console.log(`✅ Found ${results.length} results`);

    // Safe JSON parsing
    const parsedResults = results.map((result) => ({
      ...result,
      answers: safeParse(result.answers),
      voiceAnalysis: safeParse(result.voiceAnalysis),
      behavioralAnalysis: safeParse(result.behavioralAnalysis),
    }));

    return NextResponse.json({
      all: parsedResults,
      recent: parsedResults,
    });
  } catch (error: any) {
    console.error("❌ GET ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to fetch interview results",
        all: [],
        recent: [],
      },
      { status: 200 } // prevent frontend crash
    );
  }
}

// ================= HELPER =================
function safeParse(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}