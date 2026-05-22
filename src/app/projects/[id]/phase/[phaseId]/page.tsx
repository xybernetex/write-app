"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProject, getPhase } from "@/lib/projects";
import type { FeedbackResult } from "@/lib/cloudflare-ai";
import { WritingPanel } from "@/components/WritingPanel";

type Status = "idle" | "submitting" | "done" | "error";

type GrammarMatch = {
  message: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
  rule: { category: { id: string } };
};

function AnimatedScore({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame = 0;
    const total = 40;
    const tick = () => {
      frame++;
      setDisplay(Math.round((frame / total) * target));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{display}</>;
}

function GrammarIssue({ match }: { match: GrammarMatch }) {
  const top3 = match.replacements.slice(0, 3).map((r) => r.value);
  return (
    <div className="px-4 py-2.5 flex gap-3 items-start">
      <span className="text-amber-500 text-xs mt-0.5 shrink-0">⚠</span>
      <div className="min-w-0">
        <p className="text-xs text-zinc-300 leading-relaxed">{match.message}</p>
        {top3.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {top3.map((s) => (
              <span key={s} className="text-xs bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">{s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Renders the phase prompt with bold/numbered list formatting
function PromptContent({ text }: { text: string }) {
  return (
    <div className="space-y-2.5 text-sm leading-relaxed">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return null;
        // Bold (**text**)
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={j} className="text-zinc-100 font-semibold">{p.slice(2, -2)}</strong>
            : p
        );
        if (/^\d+\./.test(line.trim())) {
          return <p key={i} className="text-zinc-300 pl-4">{rendered}</p>;
        }
        return <p key={i} className="text-zinc-300">{rendered}</p>;
      })}
    </div>
  );
}

const PHASE_COLORS: Record<string, string> = {
  pitch: "text-amber-400",
  proposal: "text-amber-400",
  setup: "text-amber-400",
  blueprint: "text-amber-400",
  draft: "text-blue-400",
  revision: "text-emerald-400",
};

export default function PhasePage() {
  const params = useParams();
  const projectId = params.id as string;
  const phaseId = params.phaseId as string;

  const project = getProject(projectId);
  const phase = getPhase(projectId, phaseId);

  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<(FeedbackResult & { passed?: boolean }) | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [visibleCriteria, setVisibleCriteria] = useState(0);

  // Previous phase content (for revision)
  const [prevContent, setPrevContent] = useState<string | null>(null);
  const [prevContentOpen, setPrevContentOpen] = useState(false);

  // Grammar
  const [grammarMatches, setGrammarMatches] = useState<GrammarMatch[]>([]);
  const [grammarLoading, setGrammarLoading] = useState(false);
  const grammarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const checkGrammar = useCallback((text: string) => {
    if (!text.trim() || text.trim().split(/\s+/).length < 5) {
      setGrammarMatches([]);
      return;
    }
    setGrammarLoading(true);
    fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      body: new URLSearchParams({ text, language: "en-US" }),
    })
      .then((r) => r.json())
      .then((d: { matches: GrammarMatch[] }) => setGrammarMatches(d.matches ?? []))
      .catch(() => {})
      .finally(() => setGrammarLoading(false));
  }, []);

  useEffect(() => {
    if (grammarTimer.current) clearTimeout(grammarTimer.current);
    grammarTimer.current = setTimeout(() => checkGrammar(content), 1500);
    return () => { if (grammarTimer.current) clearTimeout(grammarTimer.current); };
  }, [content, checkGrammar]);

  // Fetch previous phase content for revision
  useEffect(() => {
    if (phaseId !== "revision") return;
    fetch(`/api/project-progress?projectId=${projectId}`)
      .then((r) => r.json())
      .then((rows: { phaseId: string; content: string | null }[]) => {
        const draft = rows.find((r) => r.phaseId === "draft");
        if (draft?.content) setPrevContent(draft.content);
      })
      .catch(() => {});
  }, [projectId, phaseId]);

  useEffect(() => {
    setContent(""); setFeedback(null); setStatus("idle"); setErrorMsg("");
    setGrammarMatches([]); setVisibleCriteria(0);
  }, [phaseId]);

  useEffect(() => {
    if (!feedback) return;
    setVisibleCriteria(0);
    feedback.criteriaResults.forEach((_, i) => {
      setTimeout(() => setVisibleCriteria(i + 1), 150 + i * 120);
    });
  }, [feedback]);

  if (!project || !phase) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-400">Phase not found.</p>
      </main>
    );
  }

  const phaseIndex = project.phases.findIndex((p) => p.id === phaseId);
  const nextPhase = project.phases[phaseIndex + 1];
  const isSubmitting = status === "submitting";
  const withinWordCount = wordCount >= phase.wordCountMin && wordCount <= phase.wordCountMax;
  const phaseColor = PHASE_COLORS[phaseId] ?? "text-zinc-400";
  const errorMatches = grammarMatches.filter((m) => m.rule.category.id === "TYPOS" || m.rule.category.id === "GRAMMAR");
  const styleMatches = grammarMatches.filter((m) => m.rule.category.id !== "TYPOS" && m.rule.category.id !== "GRAMMAR");

  async function handleSubmit() {
    if (!content.trim()) return;
    setStatus("submitting"); setFeedback(null); setErrorMsg(""); setVisibleCriteria(0);
    try {
      const res = await fetch("/api/project-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, phaseId, content }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error ?? "Something went wrong."); setStatus("error"); return; }
      setFeedback(data); setStatus("done");
    } catch {
      setErrorMsg("Network error."); setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-8 py-12">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/projects" className="hover:text-zinc-300 transition-colors">Projects</Link>
          <span>›</span>
          <Link href={`/projects/${projectId}`} className="hover:text-zinc-300 transition-colors">{project.title}</Link>
          <span>›</span>
          <span className={`font-medium ${phaseColor}`}>{phase.title}</span>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-widest ${phaseColor}`}>
            Phase {phaseIndex + 1} of {project.phases.length}
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-xs text-zinc-500">{phase.wordCountMin}–{phase.wordCountMax} words</span>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white mb-2">{phase.title}</h1>
        <p className="text-zinc-400 leading-relaxed mb-8">{phase.description}</p>

        {/* Previous draft panel (revision only) */}
        {phaseId === "revision" && prevContent && (
          <section className="mb-7 border border-zinc-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setPrevContentOpen((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-3 bg-zinc-900 hover:bg-zinc-800 transition-colors text-left"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Your Draft (Phase 2)
              </span>
              <span className="text-zinc-500 text-xs">{prevContentOpen ? "▲ hide" : "▼ show"}</span>
            </button>
            {prevContentOpen && (
              <div className="px-5 py-4 bg-zinc-900/50 text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto border-t border-zinc-800">
                {prevContent}
              </div>
            )}
          </section>
        )}

        {/* Prompt */}
        <section className="mb-7 border border-zinc-800 rounded-xl bg-zinc-900 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Your Task
            </div>
            <PromptContent text={phase.prompt} />
          </div>

          {/* Tips */}
          {phase.tips.length > 0 && (
            <div className="px-5 py-3">
              <div className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-2">Tips</div>
              <ul className="space-y-1.5">
                {phase.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-zinc-500 flex gap-2">
                    <span className="text-zinc-700 shrink-0 mt-0.5">›</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Criteria */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            Scoring Criteria
          </h2>
          <div className="space-y-2">
            {phase.criteria.map((c) => (
              <div key={c.name} className="flex gap-3 text-sm">
                <span className="text-zinc-500 shrink-0">{Math.round(c.weight * 100)}%</span>
                <div>
                  <span className="text-zinc-300 font-medium">{c.name}</span>
                  <span className="text-zinc-500"> — {c.description}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-zinc-600">Pass threshold: {phase.passThreshold}/100</div>
        </section>

        {/* Editor */}
        <section className="mb-4">
          <textarea
            className="w-full min-h-[220px] bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 text-base leading-relaxed resize-y focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="Write here…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="mt-2 text-xs">
            <span className={wordCount > 0 && !withinWordCount ? "text-amber-500" : "text-zinc-500"}>
              {wordCount} word{wordCount !== 1 ? "s" : ""}
              {wordCount > 0 && !withinWordCount && ` (need ${phase.wordCountMin}–${phase.wordCountMax})`}
            </span>
          </div>
        </section>

        <WritingPanel
          text={content}
          withinWordCount={withinWordCount}
          grammarMatches={grammarMatches}
          grammarLoading={grammarLoading}
          onDismissGrammar={() => setGrammarMatches([])}
        />

        {/* Submit */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim() || !withinWordCount}
            className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isSubmitting ? "Scoring…" : "Submit for feedback"}
          </button>
          {status === "error" && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}
        </div>

        {/* Feedback */}
        {status === "done" && feedback && (
          <section className="border border-zinc-700 rounded-2xl overflow-hidden bg-zinc-900">
            {/* Score header */}
            <div className={`px-6 py-5 flex items-center justify-between ${feedback.passed ? "bg-emerald-950/40 border-b border-emerald-900/40" : "bg-zinc-800/60 border-b border-zinc-700"}`}>
              <div>
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${feedback.passed ? "text-emerald-400" : "text-zinc-400"}`}>
                  {feedback.passed ? `Phase ${phaseIndex + 1} Passed` : "Keep working"}
                </div>
                <div className="text-3xl font-black text-white">
                  <AnimatedScore target={feedback.overallScore} /><span className="text-zinc-500 text-xl font-normal">/100</span>
                </div>
              </div>
            </div>

            {/* Coach feedback */}
            <div className="px-6 py-4 border-b border-zinc-800">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Coach</div>
              <p className="text-zinc-300 leading-relaxed text-sm">{feedback.coachFeedback}</p>
            </div>

            {/* Criteria breakdown */}
            <div className="px-6 py-4">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Breakdown</div>
              <div className="space-y-3">
                {feedback.criteriaResults.slice(0, visibleCriteria).map((r) => (
                  <div key={r.name} className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 text-right">
                      <span className={`text-sm font-bold ${r.passed ? "text-emerald-400" : "text-zinc-400"}`}>
                        {Math.round(r.score * 100)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-zinc-300">{r.name}</span>
                        {r.passed
                          ? <span className="text-emerald-500 text-xs">✓</span>
                          : <span className="text-zinc-600 text-xs">✗</span>}
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">{r.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next phase CTA */}
            {feedback.passed && nextPhase && (
              <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
                <Link
                  href={`/projects/${projectId}/phase/${nextPhase.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white"
                >
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-0.5">
                      Phase {phaseIndex + 2}
                    </div>
                    <div className="font-bold">{nextPhase.title} →</div>
                  </div>
                  <span className="text-blue-200 text-sm">{nextPhase.wordCountMin}–{nextPhase.wordCountMax} words</span>
                </Link>
              </div>
            )}

            {feedback.passed && !nextPhase && (
              <div className="px-6 py-5 border-t border-zinc-800 bg-emerald-950/20 text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="font-black text-white text-lg">Project Complete!</div>
                <p className="text-sm text-zinc-400 mt-1 mb-4">
                  You wrote, drafted, and revised a full {project.deliverable.toLowerCase()}.
                </p>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition-colors"
                >
                  ← Back to Projects
                </Link>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
