import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { SOLO_USER_ID } from "@/lib/solo";
import { submissions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const userId = SOLO_USER_ID;

  const { searchParams } = new URL(req.url);
  const trackId = searchParams.get("trackId");

  const where = trackId
    ? and(eq(submissions.userId, userId), eq(submissions.trackId, trackId))
    : eq(submissions.userId, userId);

  const rows = await db
    .select()
    .from(submissions)
    .where(where)
    .orderBy(desc(submissions.submittedAt))
    .limit(50);

  return NextResponse.json(rows);
}
