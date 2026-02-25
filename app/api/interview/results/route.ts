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
export async function GET() {
  try {
    const results = await prisma.interviewResult.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("❌ GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview results" },
      { status: 500 }
    );
  }
}