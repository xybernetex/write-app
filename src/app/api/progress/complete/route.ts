import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { SOLO_USER_ID } from "@/lib/solo";
import { progress } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * POST /api/progress/complete
 * Called by the exercise page when the student has cleared all variants of all stages.
 * Staged exercises never auto-complete from the feedback API — this is the only way
 * their progress row gets marked complete.
 */
export async function POST(req: NextRequest) {
  try {
    const { trackId, exerciseId } = await req.json() as {
      trackId: string;
      exerciseId: string;
    };

    if (!trackId || !exerciseId) {
      return NextResponse.json({ error: "Missing trackId or exerciseId" }, { status: 400 });
    }

    const userId = SOLO_USER_ID;
    const nowSec = Math.floor(Date.now() / 1000);

    const [existing] = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.userId, userId),
          eq(progress.trackId, trackId),
          eq(progress.exerciseId, exerciseId)
        )
      )
      .limit(1);

    if (existing) {
      if (!existing.completed) {
        await db
          .update(progress)
          .set({ completed: true, completedAt: nowSec })
          .where(eq(progress.id, existing.id));
      }
      // Already completed — idempotent, nothing to do
    } else {
      // No submissions yet (shouldn't happen in practice, but handle gracefully)
      await db.insert(progress).values({
        userId,
        trackId,
        exerciseId,
        completed: true,
        bestScore: null,
        attempts: 0,
        completedAt: nowSec,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[progress/complete]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
