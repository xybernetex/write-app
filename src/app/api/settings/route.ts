import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { SOLO_USER_ID } from "@/lib/solo";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { FeedbackTone } from "@/lib/cloudflare-ai";

const VALID_TONES: FeedbackTone[] = ["coach", "editor", "brutal"];

export async function GET() {
  const userId = SOLO_USER_ID;

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return NextResponse.json({ feedbackTone: user?.feedbackTone ?? "coach" });
}

export async function POST(req: NextRequest) {
  const userId = SOLO_USER_ID;

  const { feedbackTone } = await req.json() as { feedbackTone: FeedbackTone };
  if (!VALID_TONES.includes(feedbackTone)) {
    return NextResponse.json({ error: "Invalid tone" }, { status: 400 });
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const [existing] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (existing) {
    await db.update(users).set({ feedbackTone }).where(eq(users.id, userId));
  } else {
    await db.insert(users).values({ id: userId, createdAt: nowSec, xp: 0, streak: 0, feedbackTone });
  }

  return NextResponse.json({ feedbackTone });
}
