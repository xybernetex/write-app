import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { SOLO_USER_ID } from "@/lib/solo";
import { progress } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const userId = SOLO_USER_ID;

  const { searchParams } = new URL(req.url);
  const trackId = searchParams.get("trackId");

  const where = trackId
    ? and(eq(progress.userId, userId), eq(progress.trackId, trackId))
    : eq(progress.userId, userId);

  const rows = await db.select().from(progress).where(where);

  return NextResponse.json(rows);
}
