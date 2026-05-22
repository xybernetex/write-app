import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { SOLO_USER_ID } from "@/lib/solo";
import { projectProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const userId = SOLO_USER_ID;

  const projectId = req.nextUrl.searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "Missing projectId" }, { status: 400 });

  const rows = await db
    .select()
    .from(projectProgress)
    .where(and(eq(projectProgress.userId, userId), eq(projectProgress.projectId, projectId)));

  return NextResponse.json(rows.map((r) => ({
    phaseId: r.phaseId,
    content: r.content,
    score: r.score,
    feedback: r.feedback,
    criteriaResults: r.criteriaResults ? JSON.parse(r.criteriaResults) : null,
    passed: r.passed,
    attempts: r.attempts,
    completedAt: r.completedAt,
  })));
}
