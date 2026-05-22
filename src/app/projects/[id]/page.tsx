"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProject } from "@/lib/projects";

type PhaseRow = {
  phaseId: string;
  passed: boolean;
  score: number | null;
  attempts: number;
};

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: "bg-emerald-900/60 text-emerald-400 border border-emerald-800/50",
  intermediate: "bg-blue-900/60 text-blue-400 border border-blue-800/50",
  advanced: "bg-violet-900/60 text-violet-400 border border-violet-800/50",
};

const GENRE_GRADIENT: Record<string, string> = {
  nonfiction: "from-blue-500 to-cyan-500",
  fiction: "from-violet-500 to-purple-500",
};

const PHASE_LABELS: Record<string, { color: string; bg: string }> = {
  pitch:     { color: "text-amber-400",   bg: "bg-amber-950/40 border-amber-900/50" },
  proposal:  { color: "text-amber-400",   bg: "bg-amber-950/40 border-amber-900/50" },
  setup:     { color: "text-amber-400",   bg: "bg-amber-950/40 border-amber-900/50" },
  blueprint: { color: "text-amber-400",   bg: "bg-amber-950/40 border-amber-900/50" },
  draft:     { color: "text-blue-400",    bg: "bg-blue-950/40 border-blue-900/50" },
  revision:  { color: "text-emerald-400", bg: "bg-emerald-950/40 border-emerald-900/50" },
};

export default function ProjectOverviewPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProject(projectId);
  const [progressMap, setProgressMap] = useState<Record<string, PhaseRow>>({});

  useEffect(() => {
    fetch(`/api/project-progress?projectId=${projectId}`)
      .then((r) => r.json())
      .then((rows: PhaseRow[]) => {
        const map: Record<string, PhaseRow> = {};
        for (const row of rows) map[row.phaseId] = row;
        setProgressMap(map);
      })
      .catch(() => {});
  }, [projectId]);

  if (!project) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-400">Project not found.</p>
      </main>
    );
  }

  const completedCount = Object.values(progressMap).filter((p) => p.passed).length;
  const isComplete = completedCount === project.phases.length;
  const gradient = GENRE_GRADIENT[project.genre] ?? "from-zinc-500 to-zinc-400";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-8 py-14">

        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/projects" className="hover:text-zinc-300 transition-colors">← Projects</Link>
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_BADGE[project.difficulty] ?? ""}`}>
              {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
            </span>
            <span className="text-xs text-zinc-600 capitalize">{project.genre}</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white mb-3">{project.title}</h1>
          <p className="text-zinc-400 leading-relaxed">{project.description}</p>

          <div className="mt-3 text-sm text-zinc-500">
            Deliverable: <span className="text-zinc-300">{project.deliverable}</span>
          </div>

          {/* Progress bar */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700`}
                style={{ width: `${(completedCount / project.phases.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-zinc-400 shrink-0">
              {completedCount}/{project.phases.length} phases
            </span>
          </div>
        </header>

        {/* Phase path */}
        <div className="relative">
          <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-zinc-800" />

          <div className="space-y-3">
            {project.phases.map((phase, index) => {
              const prog = progressMap[phase.id];
              const isCompleted = prog?.passed ?? false;
              const isLocked = index > 0 && !progressMap[project.phases[index - 1].id]?.passed;
              const isCurrent = !isCompleted && !isLocked;
              const label = PHASE_LABELS[phase.id] ?? PHASE_LABELS["draft"];

              const nodeClass = isCompleted
                ? `bg-gradient-to-br ${gradient} text-white shadow-lg`
                : isCurrent
                  ? "bg-zinc-800 border-2 border-zinc-500 text-zinc-200 ring-2 ring-zinc-700"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-600";

              const content = (
                <div className="flex items-start gap-4 py-3 pl-0 pr-4 relative">
                  {/* Node */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${nodeClass}`}>
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

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase tracking-widest ${isLocked ? "text-zinc-600" : (label?.color ?? "text-zinc-400")}`}>
                        Phase {index + 1}
                      </span>
                    </div>
                    <p className={`font-semibold ${isLocked ? "text-zinc-600" : "text-zinc-100"}`}>
                      {phase.title}
                    </p>
                    <p className={`text-xs mt-0.5 leading-relaxed ${isLocked ? "text-zinc-700" : "text-zinc-500"}`}>
                      {phase.description}
                    </p>
                    {prog && (
                      <p className="text-xs text-zinc-500 mt-1.5">
                        Score: {prog.score ?? 0}/100 · {prog.attempts} attempt{prog.attempts !== 1 ? "s" : ""}
                        {prog.passed && " · ✓ Passed"}
                      </p>
                    )}
                    {!isLocked && !isCompleted && (
                      <p className="text-xs text-zinc-600 mt-1">
                        {phase.wordCountMin}–{phase.wordCountMax} words
                      </p>
                    )}
                  </div>

                  {!isLocked && (
                    <svg className="w-4 h-4 text-zinc-600 shrink-0 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              );

              return isLocked ? (
                <div key={phase.id} className="opacity-40 cursor-not-allowed">{content}</div>
              ) : (
                <Link
                  key={phase.id}
                  href={`/projects/${projectId}/phase/${phase.id}`}
                  className="block rounded-xl hover:bg-zinc-900 transition-colors"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Complete banner */}
        {isComplete && (
          <div className={`mt-10 rounded-xl p-6 bg-gradient-to-r ${gradient} text-white text-center`}>
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-black text-xl">Project Complete!</div>
            <div className="text-sm opacity-90 mt-1">
              You wrote and revised a full {project.deliverable.toLowerCase()}.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
