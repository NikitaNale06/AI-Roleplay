export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

// Initialize Prisma with error handling
const prisma = new PrismaClient();

// ================= POST =================
export async function POST(req: Request) {
  console.log("📥 POST /api/interview/results - Started");
  
  try {
    const body = await req.json();
    console.log("📦 POST Body received keys:", Object.keys(body));

    // Validate required fields
    if (body.finalScore === undefined && body.finalScore !== 0) {
      return NextResponse.json(
        { error: "finalScore is required" },
        { status: 400 }
      );
    }

    // Test database connection
    try {
      await prisma.$connect();
      console.log("✅ Database connected");
    } catch (connError) {
      console.error("❌ Database connection failed:", connError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Prepare data - match schema exactly
    const data: any = {
      userId: body.userId || "guest-user",
      finalScore: Number(body.finalScore) || 0,
      answers: typeof body.answers === 'string' ? body.answers : JSON.stringify(body.answers || []),
      totalTime: Number(body.totalTime) || 0,
      questionsAsked: Number(body.questionsAsked) || 0,
    };

    // Add optional fields only if they exist
    if (body.assessmentType) data.assessmentType = body.assessmentType;
    if (body.fieldCategory) data.fieldCategory = body.fieldCategory;
    if (body.feedback) data.feedback = body.feedback;
    
    // Handle voiceAnalysis (stringify if object)
    if (body.voiceAnalysis) {
      data.voiceAnalysis = typeof body.voiceAnalysis === 'string' 
        ? body.voiceAnalysis 
        : JSON.stringify(body.voiceAnalysis);
    }
    
    // Handle behavioralAnalysis (stringify if object)
    if (body.behavioralAnalysis) {
      data.behavioralAnalysis = typeof body.behavioralAnalysis === 'string' 
        ? body.behavioralAnalysis 
        : JSON.stringify(body.behavioralAnalysis);
    }

    console.log("📦 Saving to database:", Object.keys(data));

    // Create the record
    const result = await prisma.interviewResult.create({
      data: data,
    });

    console.log("✅ POST successful - ID:", result.id);
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error("🔥 POST ERROR:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    return NextResponse.json(
      { 
        error: error?.message || "Unknown database error",
        code: error?.code || "UNKNOWN"
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(e => console.error("Disconnect error:", e));
  }
}

// ================= GET =================
export async function GET(req: Request) {
  console.log("📥 GET /api/interview/results - Started");
  
  try {
    const url = new URL(req.url);
    const limit = url.searchParams.get("limit");
    const userId = url.searchParams.get("userId") || "guest-user";

    console.log(`📋 Params - userId: ${userId}, limit: ${limit || 'all'}`);

    // Test database connection
    try {
      await prisma.$connect();
      console.log("✅ Database connected");
    } catch (connError) {
      console.error("❌ Database connection failed:", connError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Check if table exists and has data
    const totalCount = await prisma.interviewResult.count();
    console.log(`📊 Total records in database: ${totalCount}`);

    // Get ALL results for stats calculation
    const allResults = await prisma.interviewResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    console.log(`✅ Found ${allResults.length} total results for user ${userId}`);

    // Parse JSON fields for easier consumption
    const parsedAllResults = allResults.map(result => ({
      ...result,
      answers: result.answers ? JSON.parse(result.answers) : [],
      voiceAnalysis: result.voiceAnalysis ? JSON.parse(result.voiceAnalysis) : null,
      behavioralAnalysis: result.behavioralAnalysis ? JSON.parse(result.behavioralAnalysis) : null,
    }));

    // Get limited results for display (if limit specified)
    let recentResults = parsedAllResults;
    if (limit) {
      recentResults = parsedAllResults.slice(0, parseInt(limit));
      console.log(`✅ Returning ${recentResults.length} recent results`);
    }

    const response = {
      all: parsedAllResults,
      recent: recentResults
    };

    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error("❌ GET ERROR:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    // Return empty arrays on error so frontend doesn't break
    return NextResponse.json(
      { 
        error: error?.message || "Failed to fetch interview results",
        all: [],
        recent: []
      },
      { status: 200 } // Return 200 with empty data instead of 500
    );
  } finally {
    await prisma.$disconnect().catch(e => console.error("Disconnect error:", e));
  }
}