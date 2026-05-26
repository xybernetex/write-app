import { NextResponse } from "next/server";
import { db } from "@/db";
import { SOLO_USER_ID } from "@/lib/solo";
import { progress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { tracks } from "@/lib/curriculum";
import {
  groupByPhase,
  isPhaseUnlocked,
  type PhaseNumber,
} from "@/lib/phases";

export async function GET() {
  const completedRows = await db
    .select({ trackId: progress.trackId, exerciseId: progress.exerciseId })
    .from(progress)
    .where(and(eq(progress.userId, SOLO_USER_ID), eq(progress.completed, true)));

  // Build map: trackId → Set of completed exerciseIds
  const completedByTrack = new Map<string, Set<string>>();
  for (const row of completedRows) {
    if (!completedByTrack.has(row.trackId)) completedByTrack.set(row.trackId, new Set());
    completedByTrack.get(row.trackId)!.add(row.exerciseId);
  }

  // A track is complete when every exercise is done
  const completedTrackIds = new Set<string>();
  const visibleTracks = tracks.filter((t) => t.genre !== "fiction");
  for (const track of visibleTracks) {
    const done = completedByTrack.get(track.id);
    if (done && done.size >= track.exercises.length) {
      completedTrackIds.add(track.id);
    }
  }

  const tracksByPhase = groupByPhase(visibleTracks);

  const result: Record<number, boolean> = {};
  for (const phase of [1, 2, 3, 4] as PhaseNumber[]) {
    result[phase] = isPhaseUnlocked(phase, tracksByPhase, completedTrackIds);
  }

  return NextResponse.json(result);
}
