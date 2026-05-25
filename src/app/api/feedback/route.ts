import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { SOLO_USER_ID } from "@/lib/solo";
import { users, submissions, progress } from "@/db/schema";
import { evaluateSubmission, type Criterion, type FeedbackTone } from "@/lib/cloudflare-ai";
import { getExercise } from "@/lib/curriculum";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const userId = SOLO_USER_ID;

    const body = await req.json();
    const {
      trackId, exerciseId, content,
      generatedPrompt, generatedTitle, generatedCategory, generatedCriteria,
      wordCountMin, wordCountMax,
    } = body as {
      trackId: string;
      exerciseId: string;
      content: string;
      generatedPrompt?: string;
      generatedTitle?: string;
      generatedCategory?: string;
      generatedCriteria?: Criterion[];
      wordCountMin?: number;
      wordCountMax?: number;
    };

    if (!trackId || !exerciseId || !content?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let promptText: string;
    let criteria: Criterion[];
    let minWords: number;
    let maxWords: number;

    if (generatedPrompt && generatedCriteria) {
      // Used by daily-drill and track practice mode
      promptText = generatedPrompt;
      criteria = generatedCriteria;
      minWords = wordCountMin ?? 80;
      maxWords = wordCountMax ?? 320;
    } else {
      const exercise = getExercise(trackId, exerciseId);
      if (!exercise) {
        return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
      }
      promptText = exercise.prompt;
      criteria = exercise.criteria;
      minWords = exercise.wordCountMin;
      maxWords = exercise.wordCountMax;
    }

    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < minWords) {
      return NextResponse.json({ error: `Too short. Minimum ${minWords} words.` }, { status: 400 });
    }
    if (wordCount > maxWords) {
      return NextResponse.json({ error: `Too long. Maximum ${maxWords} words.` }, { status: 400 });
    }

    const [userRow] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    // Daily drill always uses the warm "drill" tone regardless of user preference
    const tone = trackId === "daily-drill"
      ? "drill"
      : (userRow?.feedbackTone ?? "coach") as FeedbackTone;

    const rawResult = await evaluateSubmission(promptText, content, criteria, tone);

    // Daily drill: if you showed up and wrote, the rep is done — no pass/fail
    const passed = trackId === "daily-drill" ? true : rawResult.overallScore >= 70;
    const result = { ...rawResult, passed };

    const nowSec = Math.floor(Date.now() / 1000);

    await db.insert(submissions).values({
      userId,
      trackId,
      exerciseId,
      content,
      generatedPrompt: generatedPrompt ?? null,
      generatedTitle: generatedTitle ?? null,
      generatedCategory: generatedCategory ?? null,
      score: result.overallScore,
      feedback: result.coachFeedback,
      criteriaResults: JSON.stringify(result.criteriaResults),
      passed: result.passed,
      submittedAt: nowSec,
    });

    // Check if this is the first attempt for this exercise
    const [existing] = await db
      .select()
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.trackId, trackId), eq(progress.exerciseId, exerciseId)))
      .limit(1);

    if (existing) {
      await db
        .update(progress)
        .set({
          attempts: existing.attempts + 1,
          bestScore: Math.max(existing.bestScore ?? 0, result.overallScore),
          completed: existing.completed || result.passed,
          completedAt: existing.completed ? existing.completedAt : result.passed ? nowSec : null,
        })
        .where(eq(progress.id, existing.id));
    } else {
      await db.insert(progress).values({
        userId,
        trackId,
        exerciseId,
        completed: result.passed,
        bestScore: result.overallScore,
        attempts: 1,
        completedAt: result.passed ? nowSec : null,
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[feedback]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
