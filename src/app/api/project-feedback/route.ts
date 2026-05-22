import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { SOLO_USER_ID } from "@/lib/solo";
import { users, projectProgress } from "@/db/schema";
import { evaluateSubmission, type FeedbackTone } from "@/lib/cloudflare-ai";
import { getProject, getPhase } from "@/lib/projects";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const userId = SOLO_USER_ID;

    const { projectId, phaseId, content } = await req.json() as {
      projectId: string;
      phaseId: string;
      content: string;
    };

    if (!projectId || !phaseId || !content?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = getProject(projectId);
    const phase = getPhase(projectId, phaseId);
    if (!project || !phase) {
      return NextResponse.json({ error: "Project or phase not found" }, { status: 404 });
    }

    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < phase.wordCountMin) {
      return NextResponse.json({ error: `Too short. Minimum ${phase.wordCountMin} words.` }, { status: 400 });
    }
    if (wordCount > phase.wordCountMax) {
      return NextResponse.json({ error: `Too long. Maximum ${phase.wordCountMax} words.` }, { status: 400 });
    }

    // For revision phase, optionally fetch previous draft as extra context
    let promptText = phase.prompt;
    if (phaseId === "revision" || phaseId === "revision") {
      const draftPhase = project.phases.find((p) => p.id === "draft");
      if (draftPhase) {
        const [prevRow] = await db
          .select()
          .from(projectProgress)
          .where(and(
            eq(projectProgress.userId, userId),
            eq(projectProgress.projectId, projectId),
            eq(projectProgress.phaseId, "draft"),
          ))
          .limit(1);
        if (prevRow?.content) {
          promptText = `${phase.prompt}\n\n[ORIGINAL DRAFT FOR REFERENCE]\n${prevRow.content.slice(0, 800)}…`;
        }
      }
    }

    const [userRow] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const tone = (userRow?.feedbackTone ?? "coach") as FeedbackTone;

    const result = await evaluateSubmission(promptText, content, phase.criteria, tone);
    const passed = result.overallScore >= phase.passThreshold;
    const nowSec = Math.floor(Date.now() / 1000);

    // Upsert project_progress row
    const [existing] = await db
      .select()
      .from(projectProgress)
      .where(and(
        eq(projectProgress.userId, userId),
        eq(projectProgress.projectId, projectId),
        eq(projectProgress.phaseId, phaseId),
      ))
      .limit(1);

    if (existing) {
      await db.update(projectProgress).set({
        content,
        score: result.overallScore,
        feedback: result.coachFeedback,
        criteriaResults: JSON.stringify(result.criteriaResults),
        passed: existing.passed || passed,
        attempts: existing.attempts + 1,
        completedAt: existing.passed ? existing.completedAt : passed ? nowSec : null,
      }).where(eq(projectProgress.id, existing.id));
    } else {
      await db.insert(projectProgress).values({
        userId,
        projectId,
        phaseId,
        content,
        score: result.overallScore,
        feedback: result.coachFeedback,
        criteriaResults: JSON.stringify(result.criteriaResults),
        passed,
        attempts: 1,
        completedAt: passed ? nowSec : null,
      });
    }

    return NextResponse.json({ ...result, passed });
  } catch (err) {
    console.error("[project-feedback]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
