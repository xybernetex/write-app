import { NextResponse } from "next/server";
import { db } from "@/db";
import { submissions, projectProgress, users } from "@/db/schema";
import { count, avg, sql, desc } from "drizzle-orm";
import { getExercise, getTrack } from "@/lib/curriculum";
import { getProject } from "@/lib/projects";

export async function GET() {
  // Total stats
  const [totals] = await db
    .select({
      total: count(),
      passed: sql<number>`SUM(CASE WHEN ${submissions.passed} THEN 1 ELSE 0 END)`,
      avgScore: avg(submissions.score),
    })
    .from(submissions);

  // By exercise
  const byExercise = await db
    .select({
      trackId: submissions.trackId,
      exerciseId: submissions.exerciseId,
      attempts: count(),
      passed: sql<number>`SUM(CASE WHEN ${submissions.passed} THEN 1 ELSE 0 END)`,
      avgScore: avg(submissions.score),
    })
    .from(submissions)
    .groupBy(submissions.trackId, submissions.exerciseId)
    .orderBy(desc(count()));

  // Enrich with names
  const exerciseRows = byExercise.map((r) => {
    if (r.trackId === "daily-drill") {
      return { ...r, trackTitle: "Daily Drill", exerciseTitle: "Generated" };
    }
    const track = getTrack(r.trackId);
    const exercise = getExercise(r.trackId, r.exerciseId);
    return {
      ...r,
      trackTitle: track?.title ?? r.trackId,
      exerciseTitle: exercise?.title ?? r.exerciseId,
      passRate: r.attempts > 0 ? Math.round((Number(r.passed) / r.attempts) * 100) : 0,
    };
  });

  // Recent submissions (last 20)
  const recent = await db
    .select({
      id: submissions.id,
      userId: submissions.userId,
      trackId: submissions.trackId,
      exerciseId: submissions.exerciseId,
      score: submissions.score,
      passed: submissions.passed,
      submittedAt: submissions.submittedAt,
      generatedTitle: submissions.generatedTitle,
    })
    .from(submissions)
    .orderBy(desc(submissions.submittedAt))
    .limit(20);

  // Criteria failure breakdown — parse all criteriaResults
  const allCriteria = await db
    .select({ criteriaResults: submissions.criteriaResults })
    .from(submissions);

  const criteriaStats: Record<string, { total: number; failed: number }> = {};
  for (const row of allCriteria) {
    if (!row.criteriaResults) continue;
    try {
      const parsed = JSON.parse(row.criteriaResults) as { name: string; passed: boolean }[];
      for (const c of parsed) {
        if (!criteriaStats[c.name]) criteriaStats[c.name] = { total: 0, failed: 0 };
        criteriaStats[c.name].total++;
        if (!c.passed) criteriaStats[c.name].failed++;
      }
    } catch {}
  }

  const criteriaBreakdown = Object.entries(criteriaStats)
    .map(([name, s]) => ({
      name,
      total: s.total,
      failRate: s.total > 0 ? Math.round((s.failed / s.total) * 100) : 0,
    }))
    .sort((a, b) => b.failRate - a.failRate);

  // Project stats
  const [projectTotals] = await db
    .select({
      total: count(),
      passed: sql<number>`SUM(CASE WHEN ${projectProgress.passed} THEN 1 ELSE 0 END)`,
      avgScore: avg(projectProgress.score),
    })
    .from(projectProgress);

  // User count
  const [userCount] = await db.select({ total: count() }).from(users);

  return NextResponse.json({
    totals: {
      submissions: totals.total,
      passed: Number(totals.passed ?? 0),
      avgScore: totals.avgScore ? Math.round(Number(totals.avgScore)) : 0,
      passRate: totals.total > 0 ? Math.round((Number(totals.passed ?? 0) / totals.total) * 100) : 0,
    },
    projectTotals: {
      phases: projectTotals.total,
      passed: Number(projectTotals.passed ?? 0),
      avgScore: projectTotals.avgScore ? Math.round(Number(projectTotals.avgScore)) : 0,
    },
    userCount: userCount.total,
    byExercise: exerciseRows,
    criteriaBreakdown,
    recent,
  });
}
