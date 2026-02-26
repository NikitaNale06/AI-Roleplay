export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= POST =================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 POST /api/interview/results - Body:", body);

    // Validate required fields
    if (!body.finalScore && body.finalScore !== 0) {
      return NextResponse.json(
        { error: "finalScore is required" },
        { status: 400 }
      );
    }

    const result = await prisma.interviewResult.create({
      data: {
        userId: body.userId || "guest-user",
        finalScore: Number(body.finalScore) || 0,
        answers: JSON.stringify(body.answers || []),
        totalTime: Number(body.totalTime) || 0,
        questionsAsked: Number(body.questionsAsked) || 0,
        assessmentType: body.assessmentType || null,
        fieldCategory: body.fieldCategory || null,
        voiceAnalysis: body.voiceAnalysis ? JSON.stringify(body.voiceAnalysis) : null,
        behavioralAnalysis: body.behavioralAnalysis ? JSON.stringify(body.behavioralAnalysis) : null,
        feedback: body.feedback || null,
      },
    });

    console.log("✅ POST successful - ID:", result.id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("🔥 POST ERROR:", error);
    return NextResponse.json(
      { 
        error: error?.message || "Unknown database error",
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

// ================= GET =================
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = url.searchParams.get("limit");
    const userId = url.searchParams.get("userId") || "guest-user";

    console.log(`📥 GET /api/interview/results - userId: ${userId}, limit: ${limit || 'all'}`);

    // Test database connection first
    try {
      await prisma.$connect();
      console.log("✅ Database connected successfully");
    } catch (connError) {
      console.error("❌ Database connection failed:", connError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Get ALL results for stats calculation
    const allResults = await prisma.interviewResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    console.log(`✅ Found ${allResults.length} total results`);

    // Get limited results for display (if limit specified)
    let recentResults = allResults;
    if (limit) {
      recentResults = allResults.slice(0, parseInt(limit));
      console.log(`✅ Returning ${recentResults.length} recent results`);
    }

    return NextResponse.json({
      all: allResults,
      recent: recentResults
    });
  } catch (error: any) {
    console.error("❌ GET ERROR:", error);
    return NextResponse.json(
      { 
        error: error?.message || "Failed to fetch interview results",
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}