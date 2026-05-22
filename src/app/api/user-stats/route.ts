import { NextResponse } from "next/server";
import { db } from "@/db";
import { SOLO_USER_ID } from "@/lib/solo";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getLevel } from "@/lib/levels";

export async function GET() {
  const userId = SOLO_USER_ID;

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  const xp = user?.xp ?? 0;
  const streak = user?.streak ?? 0;

  return NextResponse.json({ streak, ...getLevel(xp) });
}
