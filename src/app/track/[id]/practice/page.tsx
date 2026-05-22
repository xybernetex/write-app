"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTrack } from "@/lib/curriculum";
import type { FeedbackResult } from "@/lib/cloudflare-ai";
import type { GeneratedTrackPrompt } from "@/app/api/generate-track-prompt/route";
import { scoreTier, TIER_LABEL, TIER_STYLE } from "@/lib/tiers";

type PromptStatus = "idle" | "loading" | "ready" | "error";
type SubmitStatus = "idle" | "submitting" | "done" | "error";
type HintStatus = "idle" | "loading" | "shown" | "error";

type GrammarMatch = {
  message: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
  rule: { category: { id: string } };
};

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

export default function PracticePage() {
  const params = useParams();
  const trackId = params.id as string;
  const track = getTrack(trackId);

  const [promptStatus, setPromptStatus] = useState<PromptStatus>("idle");
  const [generated, setGenerated] = useState<GeneratedTrackPrompt | null>(null);
  const [usedTitles, setUsedTitles] = useState<string[]>([]);

  const [content, setContent] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [visibleCriteria, setVisibleCriteria] = useState(0);

  const [hintStatus, setHintStatus] = useState<HintStatus>("idle");
  const [hint, setHint] = useState<{ text: string; explanation: string } | null>(null);

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
    const body = new URLSearchParams({ text, language: "en-US" });
    fetch("https://api.languagetool.org/v2/check", { method: "POST", body })
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

  // Stagger criteria reveal
  useEffect(() => {
    if (!feedback) return;
    setVisibleCriteria(0);
    feedback.criteriaResults.forEach((_, i) => {
      setTimeout(() => setVisibleCriteria(i + 1), 150 + i * 120);
    });
  }, [feedback]);

  async function generatePrompt() {
    setPromptStatus("loading");
    setGenerated(null);
    setContent("");
    setFeedback(null);
    setSubmitStatus("idle");
    setErrorMsg("");
    setGrammarMatches([]);
    setHint(null);
    setHintStatus("idle");

    try {
      const res = await fetch("/api/generate-track-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId, avoidTopics: usedTitles.slice(-5) }),
      });
      const data = await res.json();
      if (!res.ok) { setPromptStatus("error"); return; }
      setGenerated(data);
      setUsedTitles((prev) => [...prev, data.title]);
      setPromptStatus("ready");
    } catch {
      setPromptStatus("error");
    }
  }

  // Auto-generate on mount
  useEffect(() => {
    generatePrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadHint() {
    if (!generated) return;
    if (hint) { setHintStatus("shown"); return; }
    setHintStatus("loading");
    try {
      const res = await fetch("/api/exercise-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId,
          exerciseId: "practice",
          generatedPrompt: generated.prompt,
          generatedCriteria: generated.criteria,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setHintStatus("error"); return; }
      setHint(data);
      setHintStatus("shown");
    } catch {
      setHintStatus("error");
    }
  }

  async function handleSubmit() {
    if (!generated || !content.trim()) return;
    setSubmitStatus("submitting");
    setFeedback(null);
    setErrorMsg("");
    setVisibleCriteria(0);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId,
          exerciseId: "practice",
          content,
          generatedPrompt: generated.prompt,
          generatedTitle: generated.title,
          generatedCriteria: generated.criteria,
          wordCountMin: generated.wordCountMin,
          wordCountMax: generated.wordCountMax,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error ?? "Something went wrong."); setSubmitStatus("error"); return; }
      setFeedback(data);
      setSubmitStatus("done");
    } catch {
      setErrorMsg("Network error. Are you connected?");
      setSubmitStatus("error");
    }
  }

  const withinWordCount = generated
    ? wordCount >= generated.wordCountMin && wordCount <= generated.wordCountMax
    : false;

  const errorMatches = grammarMatches.filter(
    (m) => m.rule.category.id === "TYPOS" || m.rule.category.id === "GRAMMAR"
  );
  const styleMatches = grammarMatches.filter(
    (m) => m.rule.category.id !== "TYPOS" && m.rule.category.id !== "GRAMMAR"
  );

  if (!track) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-400">Track not found.</p>
      </main>
    );
  }

  const GENRE_GRADIENT: Record<string, string> = {
    nonfiction: "from-blue-500 to-cyan-500",
    fiction: "from-violet-500 to-purple-500",
    grammar: "from-amber-500 to-yellow-500",
  };
  const gradient = GENRE_GRADIENT[track.genre] ?? "from-zinc-500 to-zinc-400";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-8 py-12">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Tracks</Link>
          <span>›</span>
          <Link href={`/track/${trackId}`} className="hover:text-zinc-300 transition-colors">{track.title}</Link>
          <span>›</span>
          <span className="text-zinc-300">Practice Mode</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              ∞ Infinite Practice
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{track.title}</h1>
          <p className="text-sm text-zinc-500 mt-1">
            AI-generated prompts using the same craft skills. Every rep is different.
          </p>
        </div>

        {/* Loading state */}
        {promptStatus === "loading" && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
            <p className="text-sm text-zinc-500">Generating your next prompt…</p>
          </div>
        )}

        {promptStatus === "error" && (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">Couldn't generate a prompt. Check your connection and try again.</p>
            <button
              onClick={generatePrompt}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {promptStatus === "ready" && generated && (
          <>
            {/* ── PROMPT ── */}
            <section className="mb-6 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Your Exercise</div>
                  <h2 className="text-base font-semibold text-zinc-100">{generated.title}</h2>
                </div>
                {submitStatus !== "done" && (
                  <button
                    onClick={generatePrompt}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ↺ New prompt
                  </button>
                )}
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm">{generated.prompt}</p>
              <p className="mt-2 text-xs text-zinc-500">{generated.wordCountMin}–{generated.wordCountMax} words</p>
            </section>

            {/* ── CRITERIA ── */}
            <section className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Scoring Criteria</h2>
              <div className="space-y-2">
                {generated.criteria.map((c) => (
                  <div key={c.name} className="flex gap-3 text-sm">
                    <span className="text-zinc-500 shrink-0">{Math.round(c.weight * 100)}%</span>
                    <div>
                      <span className="text-zinc-300 font-medium">{c.name}</span>
                      <span className="text-zinc-500"> — {c.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── EDITOR ── */}
            {submitStatus !== "done" && (
              <>
                <section className="mb-4">
                  <textarea
                    className="w-full min-h-[180px] bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 text-base leading-relaxed resize-y focus:outline-none focus:border-zinc-500 transition-colors"
                    placeholder="Write your response here…"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={submitStatus === "submitting"}
                  />
                  <div className="mt-2 text-xs">
                    <span className={wordCount > 0 && !withinWordCount ? "text-amber-500" : "text-zinc-500"}>
                      {wordCount} word{wordCount !== 1 ? "s" : ""}
                      {wordCount > 0 && !withinWordCount && ` (need ${generated.wordCountMin}–${generated.wordCountMax})`}
                    </span>
                  </div>
                </section>

                {/* Grammar panel */}
                {(grammarMatches.length > 0 || grammarLoading) && (
                  <div className="mb-4 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Grammar & Style</span>
                        {grammarLoading && (
                          <span className="w-3 h-3 border border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
                        )}
                      </div>
                      <button
                        onClick={() => setGrammarMatches([])}
                        className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                      >
                        dismiss
                      </button>
                    </div>
                    {errorMatches.length > 0 && (
                      <div className="divide-y divide-zinc-800/60">
                        {errorMatches.map((m, i) => <GrammarIssue key={i} match={m} />)}
                      </div>
                    )}
                    {styleMatches.length > 0 && (
                      <div className="border-t border-zinc-800/60 divide-y divide-zinc-800/60 opacity-70">
                        {styleMatches.slice(0, 3).map((m, i) => <GrammarIssue key={i} match={m} />)}
                      </div>
                    )}
                  </div>
                )}

                {/* I'm stuck */}
                <div className="mt-3 mb-4 flex items-center">
                  {hintStatus === "idle" && (
                    <button
                      onClick={loadHint}
                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>💡</span> I&apos;m stuck — show me an example
                    </button>
                  )}
                  {hintStatus === "loading" && (
                    <span className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="w-3 h-3 border border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
                      Generating example…
                    </span>
                  )}
                  {hintStatus === "error" && (
                    <button
                      onClick={loadHint}
                      className="text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Couldn&apos;t load example — try again
                    </button>
                  )}
                </div>

                {/* Hint panel */}
                {hint && hintStatus === "shown" && (
                  <div className="mb-4 border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900">
                    <div className="px-5 py-4 border-b border-zinc-800">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Example response</span>
                        <button
                          onClick={() => setHintStatus("idle")}
                          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                        >
                          hide
                        </button>
                      </div>
                      <p className="text-zinc-200 text-sm leading-relaxed italic">&ldquo;{hint.text}&rdquo;</p>
                    </div>
                    <div className="px-5 py-4">
                      <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Why it works</div>
                      <p className="text-zinc-400 text-sm leading-relaxed">{hint.explanation}</p>
                      <p className="mt-3 text-xs text-zinc-600">For inspiration — write your own version, don&apos;t copy this directly.</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitStatus === "submitting" || !content.trim() || !withinWordCount}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {submitStatus === "submitting" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
                      Evaluating…
                    </span>
                  ) : "Submit for Feedback"}
                </button>

                {submitStatus === "error" && (
                  <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
                )}
              </>
            )}

            {/* ── FEEDBACK ── */}
            {feedback && (() => {
              const tier = scoreTier(feedback.overallScore);
              const ts = TIER_STYLE[tier];
              return (
              <section className="mt-8 border border-zinc-800 rounded-xl overflow-hidden">
                <div className={`px-6 py-5 ${ts.headerBg} border-b ${ts.headerBorder}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Result</div>
                      <div className={`text-4xl font-black tracking-tight ${ts.labelColor}`}>
                        {ts.dot} {TIER_LABEL[tier]}
                      </div>
                      {tier === "exceptional" && (
                        <p className="text-xs text-yellow-400/60 mt-1">Outstanding work.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-5">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Criteria Breakdown</h3>
                    <div className="space-y-4">
                      {feedback.criteriaResults.map((cr, i) => (
                        <div
                          key={cr.name}
                          className="transition-all duration-300"
                          style={{ opacity: i < visibleCriteria ? 1 : 0, transform: i < visibleCriteria ? "translateY(0)" : "translateY(8px)" }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${cr.passed ? "bg-emerald-500 text-white" : "bg-red-900 text-red-300"}`}>
                              {cr.passed ? "✓" : "✗"}
                            </span>
                            <span className="text-sm font-semibold text-zinc-200">{cr.name}</span>
                            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden mx-2">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${cr.passed ? "bg-emerald-500" : "bg-zinc-600"}`}
                                style={{ width: `${cr.score * 100}%`, transitionDelay: `${i * 120}ms` }}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-zinc-400 ml-7 leading-relaxed">{cr.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Coach Feedback</h3>
                    <p className="text-zinc-300 leading-relaxed text-sm">{feedback.coachFeedback}</p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-zinc-800 flex gap-3">
                  <button
                    onClick={() => {
                      setContent("");
                      setFeedback(null);
                      setSubmitStatus("idle");
                      setGrammarMatches([]);
                      setHint(null);
                      setHintStatus("idle");
                    }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    Try again
                  </button>
                  <button
                    onClick={generatePrompt}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
                  >
                    Another rep →
                  </button>
                </div>
              </section>
              );
            })()}
          </>
        )}

      </div>
    </main>
  );
}
