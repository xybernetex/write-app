"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTrack } from "@/lib/curriculum";
import { scoreTier, TIER_LABEL } from "@/lib/tiers";

type ProgressRow = {
  exerciseId: string;
  completed: boolean;
  bestScore: number | null;
  attempts: number;
};

const GENRE_COLOR: Record<string, string> = {
  nonfiction: "from-blue-500 to-cyan-500",
  fiction: "from-violet-500 to-purple-500",
  grammar: "from-amber-500 to-yellow-500",
};

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: "bg-emerald-900 text-emerald-300",
  intermediate: "bg-blue-900 text-blue-300",
  advanced: "bg-violet-900 text-violet-300",
};

export default function TrackPage() {
  const params = useParams();
  const trackId = params.id as string;
  const track = getTrack(trackId);
  const [progressMap, setProgressMap] = useState<Record<string, ProgressRow>>({});

  useEffect(() => {
    fetch(`/api/progress?trackId=${trackId}`)
      .then((r) => r.json())
      .then((rows: ProgressRow[]) => {
        const map: Record<string, ProgressRow> = {};
        for (const row of rows) map[row.exerciseId] = row;
        setProgressMap(map);
      })
      .catch(() => {});
  }, [trackId]);

  if (!track) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-400">Track not found.</p>
      </main>
    );
  }

  const completedCount = Object.values(progressMap).filter((p) => p.completed).length;
  const pct = Math.round((completedCount / track.exercises.length) * 100);
  const gradient = GENRE_COLOR[track.genre] ?? "from-zinc-500 to-zinc-400";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-8 py-14">
        <div className="mb-6">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← All tracks
          </Link>
        </div>

        {/* Track header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_BADGE[track.difficulty] ?? "bg-zinc-800 text-zinc-400"}`}>
              {track.difficulty.charAt(0).toUpperCase() + track.difficulty.slice(1)}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">{track.title}</h1>
          <p className="text-zinc-400 leading-relaxed text-sm">{track.description}</p>

          {/* Progress bar */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-medium text-zinc-400 shrink-0">
              {completedCount}/{track.exercises.length} complete
            </span>
          </div>
        </header>

        {/* Skill path */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-zinc-800" />

          <div className="space-y-2">
            {track.exercises.map((exercise, index) => {
              const prog = progressMap[exercise.id];
              const isCompleted = prog?.completed ?? false;
              const isLocked = index > 0 && !progressMap[track.exercises[index - 1].id]?.completed;
              const isCurrent = !isCompleted && !isLocked;

              const nodeClass = isCompleted
                ? `bg-gradient-to-br ${gradient} text-white shadow-lg`
                : isCurrent
                  ? "bg-zinc-800 border-2 border-zinc-500 text-zinc-200 ring-2 ring-zinc-700"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-600";

              const content = (
                <div className="flex items-center gap-4 py-3 pl-0 pr-4 relative">
                  {/* Node */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${nodeClass}`}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isLocked ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${isLocked ? "text-zinc-600" : "text-zinc-100"}`}>
                      {exercise.title}
                    </p>
                    {prog ? (
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {TIER_LABEL[scoreTier(prog.bestScore ?? 0)]} · {prog.attempts} attempt{prog.attempts !== 1 ? "s" : ""}
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {exercise.criteria.length} criteria · {exercise.wordCountMin}–{exercise.wordCountMax} words
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  {!isLocked && (
                    <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              );

              return isLocked ? (
                <div key={exercise.id} className="opacity-40 cursor-not-allowed">
                  {content}
                </div>
              ) : (
                <Link
                  key={exercise.id}
                  href={`/track/${trackId}/exercise/${exercise.id}`}
                  className="block rounded-xl hover:bg-zinc-900 transition-colors"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Track complete banner */}
        {completedCount === track.exercises.length && track.exercises.length > 0 && (
          <div className={`mt-10 rounded-xl p-5 bg-gradient-to-r ${gradient} text-white text-center`}>
            <div className="text-2xl mb-1">🏆</div>
            <div className="font-bold text-lg">Track Complete!</div>
            <div className="text-sm opacity-90 mt-1">You finished every exercise in this track.</div>
          </div>
        )}

        {/* Keep Practicing */}
        <div className="mt-8 border border-zinc-800 rounded-xl p-5 bg-zinc-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">∞ Infinite Practice</div>
              <p className="text-sm text-zinc-300 font-medium">Keep building this skill</p>
              <p className="text-xs text-zinc-500 mt-0.5">AI-generated prompts using the same craft techniques — never run out of reps.</p>
            </div>
            <a
              href={`/track/${trackId}/practice`}
              className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r ${gradient} text-white hover:opacity-90 transition-opacity`}
            >
              Keep Practicing →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
