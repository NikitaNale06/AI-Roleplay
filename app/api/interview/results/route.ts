// app/api/interview/results/route.ts

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= POST =================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming body:", body);

    const result = await prisma.interviewResult.create({
      data: {
        userId: "guest-user",
        finalScore: Number(body.finalScore) || 0,
        answers: JSON.stringify(body.answers || []),
        totalTime: Number(body.totalTime) || 0,
        questionsAsked: Number(body.questionsAsked) || 0,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("🔥 FULL BACKEND ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "Unknown database error" },
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

    // Get ALL results for stats calculation
    const allResults = await prisma.interviewResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Get limited results for display (if limit specified)
    let recentResults = allResults;
    if (limit) {
      recentResults = allResults.slice(0, parseInt(limit));
    }

    return NextResponse.json({
      all: allResults,      // All results for stats
      recent: recentResults  // Limited results for display
    });
  } catch (error) {
    console.error("❌ GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview results" },
      { status: 500 }
    );
  }
}