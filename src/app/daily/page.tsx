"use client";
// Daily Drill page
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { GeneratedPrompt } from "@/app/api/generate-prompt/route";
import type { FeedbackResult } from "@/lib/cloudflare-ai";
import { WritingPanel } from "@/components/WritingPanel";
import type { GrammarMatch } from "@/components/WritingPanel";
import { scoreTier, TIER_LABEL, TIER_STYLE } from "@/lib/tiers";

const CATEGORIES = ["Argument", "Hot Take", "Pattern", "Essay Lede", "Nut Graf", "Counter"];

type HistoryRow = {
  id: number;
  generatedTitle: string | null;
  generatedCategory: string | null;
  generatedPrompt: string | null;
  content: string;
  score: number | null;
  passed: boolean | null;
  feedback: string | null;
  submittedAt: number;
};

type Status = "idle" | "generating" | "ready" | "submitting" | "done" | "error";

export default function DailyDrillPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [prompt, setPrompt] = useState<GeneratedPrompt | null>(null);
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("random");
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [grammarMatches, setGrammarMatches] = useState<GrammarMatch[]>([]);
  const [grammarLoading, setGrammarLoading] = useState(false);
  const grammarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const withinWordCount = prompt
    ? wordCount >= prompt.wordCountMin && wordCount <= prompt.wordCountMax
    : false;

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

  useEffect(() => {
    fetch(`/api/history?trackId=daily-drill`)
      .then((r) => r.json())
      .then((rows) => setHistory(rows))
      .catch(() => {});
  }, []);

  async function generatePrompt() {
    setStatus("generating");
    setPrompt(null);
    setContent("");
    setFeedback(null);
    setErrorMsg("");

    try {
      const body = selectedCategory === "random" ? {} : { category: selectedCategory };
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Failed to generate prompt.");
        setStatus("error");
        return;
      }

      setPrompt(data as GeneratedPrompt);
      setStatus("ready");
    } catch {
      setErrorMsg("Network error.");
      setStatus("error");
    }
  }

  async function handleSubmit() {
    if (!prompt || !content.trim()) return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: "daily-drill",
          exerciseId: sessionId,
          content,
          generatedPrompt: prompt.prompt,
          generatedTitle: prompt.title,
          generatedCategory: prompt.category,
          generatedCriteria: prompt.criteria,
          wordCountMin: prompt.wordCountMin,
          wordCountMax: prompt.wordCountMax,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      setFeedback(data as FeedbackResult);
      setStatus("done");

      fetch(`/api/history?trackId=daily-drill`)
        .then((r) => r.json())
        .then((rows) => setHistory(rows))
        .catch(() => {});
    } catch {
      setErrorMsg("Network error.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Home
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Daily Drill</h1>
          <p className="text-zinc-400 text-sm">
            A fresh essay prompt every session. 100–250 words. No research. No editing. Just reps.
          </p>
        </header>

        {/* Category selector */}
        <section className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("random")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === "random"
                  ? "bg-zinc-100 text-zinc-950"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              Random
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-zinc-100 text-zinc-950"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Generate button */}
        {(status === "idle" || status === "error") && (
          <button
            onClick={generatePrompt}
            className="w-full py-4 rounded-lg font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-colors mb-6"
          >
            Generate Prompt
          </button>
        )}

        {status === "generating" && (
          <div className="w-full py-4 rounded-lg border border-zinc-800 text-center text-zinc-400 text-sm mb-6 animate-pulse">
            Generating your prompt…
          </div>
        )}

        {status === "error" && errorMsg && (
          <p className="text-sm text-red-400 mb-4">{errorMsg}</p>
        )}

        {/* Prompt display */}
        {prompt && status !== "idle" && (
          <section className="mb-6">
            <div className="border border-zinc-800 rounded-lg p-5 bg-zinc-900">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    {prompt.category}
                  </span>
                </div>
                {status === "ready" && (
                  <button
                    onClick={generatePrompt}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Different prompt →
                  </button>
                )}
              </div>
              <h2 className="font-semibold text-zinc-100 mb-2">{prompt.title}</h2>
              <p className="text-zinc-300 leading-relaxed text-sm">{prompt.prompt}</p>
            </div>

            {/* Criteria */}
            {status !== "done" && (
              <div className="mt-3 space-y-1.5">
                {prompt.criteria.map((c) => (
                  <div key={c.name} className="flex gap-3 text-sm">
                    <span className="text-zinc-500 shrink-0">{Math.round(c.weight * 100)}%</span>
                    <div>
                      <span className="text-zinc-400 font-medium">{c.name}</span>
                      <span className="text-zinc-600"> — {c.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Editor */}
        {(status === "ready" || status === "submitting" || status === "error") && prompt && (
          <>
            <section className="mb-4">
              <textarea
                className="w-full min-h-[180px] bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-600 text-base leading-relaxed resize-y focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="Write your response here…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={status === "submitting"}
                autoFocus
              />
              <div className="flex justify-between mt-2 text-xs">
                <span className={wordCount > 0 && !withinWordCount ? "text-amber-500" : "text-zinc-500"}>
                  {wordCount} word{wordCount !== 1 ? "s" : ""}
                  {wordCount > 0 && !withinWordCount && (
                    <> (need {prompt.wordCountMin}–{prompt.wordCountMax})</>
                  )}
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

            <button
              onClick={handleSubmit}
              disabled={status === "submitting" || !content.trim() || !withinWordCount}
              className="w-full py-3 rounded-lg font-semibold text-sm bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-4"
            >
              {status === "submitting" ? "Evaluating…" : "Submit for Feedback"}
            </button>

            {status === "error" && errorMsg && (
              <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
            )}
          </>
        )}

        {/* Feedback panel */}
        {status === "done" && feedback && (() => {
          const tier = scoreTier(feedback.overallScore);
          const ts = TIER_STYLE[tier];
          return (
          <section className="mt-2 border border-zinc-800 rounded-lg overflow-hidden">
            <div className={`px-5 py-4 ${ts.headerBg} border-b ${ts.headerBorder}`}>
              <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Result</div>
              <div className={`text-3xl font-black tracking-tight ${ts.labelColor}`}>
                {ts.dot} {TIER_LABEL[tier]}
              </div>
              {tier === "exceptional" && (
                <p className="text-xs text-yellow-400/60 mt-1">Outstanding work.</p>
              )}
            </div>

            <div className="px-5 py-4 space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                  Criteria breakdown
                </h3>
                <div className="space-y-3">
                  {feedback.criteriaResults.map((cr) => (
                    <div key={cr.name}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          cr.passed ? "bg-emerald-900 text-emerald-300" : "bg-red-950 text-red-400"
                        }`}>
                          {cr.passed ? "✓" : "✗"}
                        </span>
                        <span className="text-sm font-medium text-zinc-200">{cr.name}</span>
                        <span className="ml-auto text-xs text-zinc-500">{Math.round(cr.score * 100)}/100</span>
                      </div>
                      <p className="text-sm text-zinc-400 ml-6 leading-relaxed">{cr.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                  Coach feedback
                </h3>
                <p className="text-zinc-300 leading-relaxed text-sm">{feedback.coachFeedback}</p>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-zinc-800">
              <button
                onClick={() => {
                  setStatus("idle");
                  setPrompt(null);
                  setContent("");
                  setFeedback(null);
                  setGrammarMatches([]);
                }}
                className="w-full py-2.5 rounded-lg font-semibold text-sm bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
              >
                New prompt →
              </button>
            </div>
          </section>
          );
        })()}

        {/* History */}
        {history.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
              Recent drills
            </h2>
            <div className="space-y-1">
              {history.slice(0, 10).map((row) => {
                const isOpen = expandedId === row.id;
                return (
                  <div key={row.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedId(isOpen ? null : row.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-zinc-900 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${TIER_STYLE[scoreTier(row.score ?? 0)].badge}`}>
                          {TIER_LABEL[scoreTier(row.score ?? 0)]}
                        </span>
                        <span className="text-zinc-300 truncate">{row.generatedTitle ?? "Untitled"}</span>
                        {row.generatedCategory && (
                          <span className="text-xs text-zinc-600 shrink-0">{row.generatedCategory}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span className="text-xs text-zinc-600">
                          {new Date(row.submittedAt * 1000).toLocaleDateString()}
                        </span>
                        <span className="text-zinc-600 text-xs">{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 space-y-4 border-t border-zinc-800 pt-3 bg-zinc-950">
                        {row.generatedPrompt && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Prompt</p>
                            <p className="text-sm text-zinc-400 leading-relaxed">{row.generatedPrompt}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Your response</p>
                          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{row.content}</p>
                        </div>
                        {row.feedback && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Feedback</p>
                            <p className="text-sm text-zinc-400 leading-relaxed">{row.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
