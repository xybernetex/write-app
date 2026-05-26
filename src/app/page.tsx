import Link from "next/link";
import { tracks } from "@/lib/curriculum";
import { projects } from "@/lib/projects";
import { db } from "@/db";
import { progress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { SOLO_USER_ID } from "@/lib/solo";
import {
  PHASE_META,
  TRACK_PHASE,
  groupByPhase,
  phaseCompletedCount,
  isPhaseUnlocked,
  type PhaseNumber,
} from "@/lib/phases";
import type { Track } from "@/lib/curriculum";

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: "bg-emerald-900/60 text-emerald-400 border border-emerald-800/50",
  intermediate: "bg-blue-900/60 text-blue-400 border border-blue-800/50",
  advanced: "bg-violet-900/60 text-violet-400 border border-violet-800/50",
};

const PHASE_COLOR: Record<number, { bar: string; accent: string; badge: string; lock: string }> = {
  1: { bar: "bg-emerald-500", accent: "text-emerald-400", badge: "bg-emerald-950 text-emerald-400 border border-emerald-800/50", lock: "border-emerald-900/30" },
  2: { bar: "bg-blue-500",    accent: "text-blue-400",    badge: "bg-blue-950 text-blue-400 border border-blue-800/50",          lock: "border-blue-900/30" },
  3: { bar: "bg-violet-500",  accent: "text-violet-400",  badge: "bg-violet-950 text-violet-400 border border-violet-800/50",    lock: "border-violet-900/30" },
  4: { bar: "bg-amber-500",   accent: "text-amber-400",   badge: "bg-amber-950 text-amber-400 border border-amber-800/50",       lock: "border-amber-900/30" },
};

function TrackCard({ track, unlocked, phaseNum }: { track: Track; unlocked: boolean; phaseNum: number }) {
  const colors = PHASE_COLOR[phaseNum];

  if (!unlocked) {
    return (
      <div className={`flex flex-col rounded-xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden opacity-50`}>
        <div className={`h-1 w-full ${colors.bar} opacity-30`} />
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-zinc-500 text-base leading-snug">{track.title}</h3>
            <span className="text-zinc-700 text-lg shrink-0">🔒</span>
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed flex-1 line-clamp-2 mb-4">{track.description}</p>
          <span className="text-xs text-zinc-700">{track.exercises.length} exercises</span>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/track/${track.id}`}
      className={`group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/60 transition-all hover:shadow-xl overflow-hidden hover:border-zinc-700`}
    >
      <div className={`h-1 w-full ${colors.bar} opacity-70 group-hover:opacity-100 transition-opacity`} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-zinc-100 text-base leading-snug group-hover:text-white transition-colors">
            {track.title}
          </h3>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_BADGE[track.difficulty] ?? "bg-zinc-800 text-zinc-500"}`}>
            {track.difficulty.charAt(0).toUpperCase() + track.difficulty.slice(1)}
          </span>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed flex-1 line-clamp-2 mb-4">{track.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-600 font-medium">{track.exercises.length} exercises</span>
          <span className="text-zinc-600 text-sm group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all">→</span>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  // ── Load progress ────────────────────────────────────────────────────────
  const completedRows = await db
    .select({ trackId: progress.trackId, exerciseId: progress.exerciseId })
    .from(progress)
    .where(and(eq(progress.userId, SOLO_USER_ID), eq(progress.completed, true)));

  // Map trackId → Set of completed exerciseIds
  const completedByTrack = new Map<string, Set<string>>();
  for (const row of completedRows) {
    if (!completedByTrack.has(row.trackId)) completedByTrack.set(row.trackId, new Set());
    completedByTrack.get(row.trackId)!.add(row.exerciseId);
  }

  // A track is complete when every exercise has been passed
  const completedTrackIds = new Set<string>();
  const visibleTracks = tracks.filter((t) => t.genre !== "fiction");
  for (const track of visibleTracks) {
    const done = completedByTrack.get(track.id);
    if (done && done.size >= track.exercises.length) {
      completedTrackIds.add(track.id);
    }
  }

  // Group and compute phase unlock status
  const tracksByPhase = groupByPhase(visibleTracks);
  const totalExercises = visibleTracks.reduce((s, t) => s + t.exercises.length, 0);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-8">

        {/* Header */}
        <section className="pt-16 pb-12 flex flex-col items-start">
          <h1 className="text-4xl font-black tracking-tight text-white leading-tight">
            The Writing Gym
          </h1>
          <p className="mt-3 text-base text-zinc-400 leading-relaxed max-w-xl">
            Deliberate practice for essays, Substack, and the book.
            Short reps. Real criteria. Feedback that tells you exactly what to fix.
          </p>
        </section>

        {/* Stats bar */}
        <div className="border-y border-zinc-800 py-4 flex items-center gap-6 text-sm mb-10">
          {[
            { value: `${visibleTracks.length}`, label: "skill tracks" },
            { value: `${totalExercises}+`, label: "exercises" },
            { value: "✦", label: "Craft scoring" },
            { value: "✓", label: "Grammar check" },
          ].map((item, i, arr) => (
            <span key={item.label} className="flex items-center gap-2.5">
              <span className="text-zinc-400">
                <strong className="text-white font-bold">{item.value}</strong>{" "}{item.label}
              </span>
              {i < arr.length - 1 && <span className="text-zinc-700 select-none">·</span>}
            </span>
          ))}
        </div>

        {/* Daily Drill */}
        <section className="mb-12">
          <Link
            href="/daily"
            className="group flex items-center justify-between gap-6 rounded-2xl border border-zinc-700/60 bg-zinc-900 hover:bg-zinc-800/80 hover:border-amber-800/40 transition-all p-7 shadow-xl shadow-black/20"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl shrink-0">🔥</div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Daily Practice</div>
                <h2 className="text-lg font-bold text-white mb-1">Daily Drill</h2>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
                  Fresh essay prompt every session. Arguments, hot takes, patterns, ledes. 100–250 words. No research. No editing. Just reps.
                </p>
              </div>
            </div>
            <span className="text-zinc-400 text-lg shrink-0 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </section>

        {/* Phase sections */}
        {PHASE_META.map((meta) => {
          const phaseNum = meta.phase as PhaseNumber;
          const phaseTracks = tracksByPhase[phaseNum] ?? [];
          const unlocked = isPhaseUnlocked(phaseNum, tracksByPhase, completedTrackIds);
          const completedCount = phaseCompletedCount(phaseTracks, completedTrackIds);
          const colors = PHASE_COLOR[phaseNum];

          // Gate info for the PREVIOUS phase that controls this one
          const prevMeta = phaseNum > 1 ? PHASE_META[phaseNum - 2] : null;
          const prevCompleted = prevMeta
            ? phaseCompletedCount(tracksByPhase[(phaseNum - 1) as PhaseNumber], completedTrackIds)
            : 0;

          return (
            <section key={phaseNum} className="mb-14">
              {/* Phase header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-baseline gap-3">
                  <span className={`text-xs font-bold uppercase tracking-widest ${colors.accent}`}>
                    Phase {phaseNum}
                  </span>
                  <h2 className="text-base font-bold text-zinc-200">{meta.title}</h2>
                  <span className="text-xs text-zinc-600">{phaseTracks.length} tracks</span>
                </div>

                {/* Lock / progress indicator */}
                {!unlocked ? (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors.badge}`}>
                    🔒 Complete {(prevMeta?.gateCount ?? 0) - prevCompleted} more in Phase {phaseNum - 1}
                  </span>
                ) : completedCount > 0 ? (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors.badge}`}>
                    {completedCount}/{phaseTracks.length} complete
                  </span>
                ) : null}
              </div>

              <p className="text-sm text-zinc-500 mb-1">{meta.description}</p>

              {/* Gate progress bar */}
              {meta.gateCount && unlocked && (
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex-1 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.bar} transition-all`}
                      style={{ width: `${Math.min(100, (completedCount / meta.gateCount) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0">
                    {completedCount}/{meta.gateCount} to unlock Phase {phaseNum + 1}
                  </span>
                </div>
              )}
              {!unlocked && (
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex-1 h-0.5 bg-zinc-800/50 rounded-full" />
                </div>
              )}
              {meta.gateCount === null && unlocked && completedCount > 0 && (
                <div className="h-4 mb-1" />
              )}
              {meta.gateCount === null && (completedCount === 0 || !unlocked) && (
                <div className="h-5 mb-0" />
              )}

              {/* Track grid */}
              <div className="grid grid-cols-2 gap-4">
                {phaseTracks.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    unlocked={unlocked}
                    phaseNum={phaseNum}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Projects */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-baseline gap-3 mb-1">
                <span>✦</span>
                <h2 className="text-base font-bold text-zinc-200">Projects</h2>
                <span className="text-xs text-zinc-600 font-medium">{projects.length} available</span>
              </div>
              <p className="text-sm text-zinc-500">Tracks build skills. Projects put them together — pitch, draft, and revise a complete piece.</p>
            </div>
            <Link href="/projects" className="shrink-0 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {projects.slice(0, 3).map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all p-4"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-1.5 capitalize">{project.difficulty}</div>
                <h3 className="font-semibold text-zinc-100 text-sm leading-snug mb-2 group-hover:text-white transition-colors">{project.title}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">{project.deliverable}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {project.phases.map((ph, i) => (
                    <span key={ph.id} className="flex items-center gap-1.5">
                      <span className="text-xs text-zinc-600">{ph.title}</span>
                      {i < project.phases.length - 1 && <span className="text-zinc-700 text-xs">·</span>}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-20" />
      </div>
    </main>
  );
}
