"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getExercise, getTrack } from "@/lib/curriculum";
import type { FeedbackResult } from "@/lib/cloudflare-ai";
import { WritingPanel } from "@/components/WritingPanel";
import { scoreTier, TIER_LABEL, TIER_STYLE } from "@/lib/tiers";

type Status = "idle" | "submitting" | "done" | "error";
type LessonStatus = "collapsed" | "loading" | "expanded" | "error";
type HintStatus = "idle" | "loading" | "shown" | "error";

type ChatMessage = { role: "user" | "assistant"; content: string };

type GrammarMatch = {
  message: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
  rule: { category: { id: string } };
};

// Renders markdown-ish lesson content (headers, bold, paragraphs)
function LessonContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="text-xs font-bold uppercase tracking-widest text-zinc-400 mt-5 first:mt-0">
              {line.slice(3)}
            </h3>
          );
        }
        if (line.trim() === "") return null;
        // Inline bold: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-zinc-300">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j} className="text-zinc-100 font-semibold">{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      })}
    </div>
  );
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

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const trackId = params.id as string;
  const exerciseId = params.exerciseId as string;

  const track = getTrack(trackId);
  const exercise = getExercise(trackId, exerciseId);

  // Stage + variant state (for multi-round exercises)
  const [stageIdx, setStageIdx] = useState(0);
  const [variantIdx, setVariantIdx] = useState(0);
  const [passedVariants, setPassedVariants] = useState<boolean[]>([]);

  // Writing state
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [visibleCriteria, setVisibleCriteria] = useState(0);

  // Lesson expansion state
  const [lessonStatus, setLessonStatus] = useState<LessonStatus>("collapsed");
  const [fullLesson, setFullLesson] = useState<string | null>(null);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatStreaming, setChatStreaming] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Hint state
  const [hintStatus, setHintStatus] = useState<HintStatus>("idle");
  const [hint, setHint] = useState<{ text: string; explanation: string } | null>(null);

  // Grammar state
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

  // Reset on exercise change — then restore stage progress from localStorage
  useEffect(() => {
    // Always reset writing/UI state
    setContent(""); setFeedback(null); setStatus("idle"); setErrorMsg("");
    setGrammarMatches([]); setVisibleCriteria(0);
    setLessonStatus("collapsed"); setFullLesson(null);
    setChatMessages([]); setChatOpen(false); setChatInput("");
    setHint(null); setHintStatus("idle");

    // Restore saved stage progress (staged exercises only)
    const defaultVariantCount = exercise?.stages?.[0]?.variants.length ?? 0;
    if (exercise?.stages?.length) {
      try {
        const saved = localStorage.getItem(`wg-prog-${exerciseId}`);
        if (saved) {
          const { stageIdx: s, passedVariants: p } = JSON.parse(saved) as {
            stageIdx: number;
            passedVariants: boolean[];
          };
          const validStage = Math.min(s, exercise.stages.length - 1);
          const restoredPassed: boolean[] = Array.isArray(p) ? p : new Array(defaultVariantCount).fill(false);
          setStageIdx(validStage);
          setPassedVariants(restoredPassed);
          // Jump to first unpassed variant in the restored stage
          const firstUnpassed = restoredPassed.findIndex((v) => !v);
          setVariantIdx(firstUnpassed !== -1 ? firstUnpassed : 0);
          return;
        }
      } catch {}
    }
    // No saved progress — start fresh
    setStageIdx(0);
    setVariantIdx(0);
    setPassedVariants(new Array(defaultVariantCount).fill(false));
  }, [exerciseId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stagger criteria reveal
  useEffect(() => {
    if (!feedback) return;
    setVisibleCriteria(0);
    feedback.criteriaResults.forEach((_, i) => {
      setTimeout(() => setVisibleCriteria(i + 1), 150 + i * 120);
    });
  }, [feedback]);

  // Confetti on track complete
  useEffect(() => {
    if (!feedback?.passed) return;
    const idx = track?.exercises.findIndex((e) => e.id === exerciseId) ?? -1;
    if (idx !== (track?.exercises.length ?? 0) - 1) return;
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { x: 0.1, y: 0.5 } }), 300);
      setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { x: 0.9, y: 0.5 } }), 500);
    });
  }, [feedback, track, exerciseId]);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatStreaming]);

  if (!track || !exercise) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-400">Exercise not found.</p>
      </main>
    );
  }

  const exerciseIndex = track.exercises.findIndex((e) => e.id === exerciseId);
  const nextExercise = track.exercises[exerciseIndex + 1];

  // Active stage + variant values (fall back to exercise-level if no stages)
  const stages = exercise.stages;
  const currentStage = stages?.[stageIdx];
  const variants = currentStage?.variants;
  const currentVariant = variants?.[variantIdx];
  const activeGiven = currentVariant?.given ?? exercise.given;
  const activePrompt = currentVariant?.prompt ?? exercise.prompt;
  const activeCriteria = currentStage?.criteria ?? exercise.criteria;
  const activeWordCountMin = currentStage?.wordCountMin ?? exercise.wordCountMin;
  const activeWordCountMax = currentStage?.wordCountMax ?? exercise.wordCountMax;
  const activePassThreshold = currentStage?.passThreshold ?? 65;
  const isLastStage = !stages || stageIdx === stages.length - 1;
  const totalVariants = variants?.length ?? 0;

  // Navigation helpers
  function resetForPrompt() {
    setContent(""); setFeedback(null); setStatus("idle"); setErrorMsg(""); setGrammarMatches([]);
    setHint(null); setHintStatus("idle");
  }
  function goToVariant(idx: number) {
    setVariantIdx(idx);
    resetForPrompt();
  }
  function saveStageProgress(newStageIdx: number, newPassed: boolean[]) {
    if (!exercise?.stages?.length) return;
    try {
      localStorage.setItem(`wg-prog-${exerciseId}`, JSON.stringify({
        stageIdx: newStageIdx,
        passedVariants: newPassed,
      }));
    } catch {}
  }

  function markPassedAndAdvance() {
    const newPassed = [...passedVariants];
    newPassed[variantIdx] = true;
    saveStageProgress(stageIdx, newPassed);
    setPassedVariants(newPassed);
    // Find next unpassed, searching forward first then wrapping
    const nextForward = newPassed.findIndex((p, i) => !p && i > variantIdx);
    const nextAny = newPassed.findIndex((p) => !p);
    const nextIdx = nextForward !== -1 ? nextForward : nextAny;
    if (nextIdx !== -1) {
      goToVariant(nextIdx);
    } else {
      // All passed — clear so user sees the "stage complete" buttons
      resetForPrompt();
    }
  }

  function advanceToNextStage() {
    const next = stageIdx + 1;
    const newPassed = new Array(stages?.[next]?.variants.length ?? 0).fill(false);
    saveStageProgress(next, newPassed);
    setStageIdx(next);
    setVariantIdx(0);
    setPassedVariants(newPassed);
    resetForPrompt();
  }

  async function markExerciseComplete() {
    // Clear saved stage progress — exercise is done
    try { localStorage.removeItem(`wg-prog-${exerciseId}`); } catch {}
    // Mark completed in DB (staged exercises only reach here after all variants cleared)
    try {
      await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId, exerciseId }),
      });
    } catch {}
  }

  async function expandLesson() {
    if (fullLesson) { setLessonStatus("expanded"); return; }
    setLessonStatus("loading");
    try {
      const res = await fetch("/api/lesson-expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId, exerciseId }),
      });
      const data = await res.json();
      if (!res.ok) { setLessonStatus("error"); return; }
      setFullLesson(data.content);
      setLessonStatus("expanded");
    } catch {
      setLessonStatus("error");
    }
  }

  async function sendChat() {
    const text = chatInput.trim();
    if (!text || chatStreaming) return;

    const newMessages: ChatMessage[] = [...chatMessages, { role: "user", content: text }];
    setChatMessages(newMessages);
    setChatInput("");
    setChatStreaming(true);

    // Add empty assistant message for streaming into
    setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/lesson-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          trackId,
          exerciseId,
        }),
      });

      if (!res.ok || !res.body) {
        setChatMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: "Sorry, something went wrong. Try again." },
        ]);
        setChatStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assembled = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
        setChatMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: assembled },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Network error. Try again." },
      ]);
    } finally {
      setChatStreaming(false);
    }
  }

  async function loadHint() {
    if (hint) { setHintStatus("shown"); return; }
    setHintStatus("loading");
    try {
      const res = await fetch("/api/exercise-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId, exerciseId }),
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
    if (!content.trim()) return;
    setStatus("submitting"); setFeedback(null); setErrorMsg(""); setVisibleCriteria(0);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId,
          exerciseId,
          content,
          // Pass variant prompt + stage criteria so the AI grades against the right bar
          ...(currentStage ? {
            generatedPrompt: currentVariant?.prompt ?? activePrompt,
            generatedCriteria: currentStage.criteria,
            wordCountMin: currentStage.wordCountMin,
            wordCountMax: currentStage.wordCountMax,
          } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error ?? "Something went wrong."); setStatus("error"); return; }
      setFeedback(data); setStatus("done");
    } catch {
      setErrorMsg("Network error. Are you connected?"); setStatus("error");
    }
  }

  const isSubmitting = status === "submitting";
  const withinWordCount = wordCount >= activeWordCountMin && wordCount <= activeWordCountMax;
  const errorMatches = grammarMatches.filter(m => m.rule.category.id === "TYPOS" || m.rule.category.id === "GRAMMAR");
  const styleMatches = grammarMatches.filter(m => m.rule.category.id !== "TYPOS" && m.rule.category.id !== "GRAMMAR");

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-8 py-12">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Tracks</Link>
          <span>›</span>
          <Link href={`/track/${trackId}`} className="hover:text-zinc-300 transition-colors">{track.title}</Link>
          <span>›</span>
          <span className="text-zinc-300">{exercise.title}</span>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            Exercise {exerciseIndex + 1} of {track.exercises.length}
          </span>
          {stages && currentStage && (
            <div className="flex flex-col items-end gap-2">
              {/* Round progress */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {stages.map((s, i) => (
                    <div key={i} title={s.label} className={`h-1 w-8 rounded-full transition-colors ${
                      i < stageIdx ? "bg-emerald-500" : i === stageIdx ? "bg-zinc-300" : "bg-zinc-700"
                    }`} />
                  ))}
                </div>
                <span className="text-xs text-zinc-500">
                  Round {stageIdx + 1}/{stages.length} · <span className="text-zinc-400">{currentStage.label}</span>
                </span>
              </div>
              {/* Variant (prompt) progress */}
              {variants && (
                <div className="flex items-center gap-1.5">
                  {variants.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToVariant(i)}
                      title={`Prompt ${i + 1}${passedVariants[i] ? " ✓" : ""}`}
                      className={`w-5 h-5 rounded-full text-xs font-bold transition-colors ${
                        passedVariants[i]
                          ? "bg-emerald-500 text-white"
                          : i === variantIdx
                          ? "bg-zinc-200 text-zinc-900"
                          : "bg-zinc-700 text-zinc-500 hover:bg-zinc-600"
                      }`}
                    >
                      {passedVariants[i] ? "✓" : i + 1}
                    </button>
                  ))}
                  <span className="text-xs text-zinc-600 ml-1">
                    {passedVariants.filter(Boolean).length}/{totalVariants} done
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── LESSON PANEL ─────────────────────────────────────────────── */}
        <section className="mb-7 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900">
          <div className="px-5 pt-5 pb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">The Lesson</div>

            {/* Short summary — always visible */}
            <p className="text-zinc-300 leading-relaxed text-sm">{exercise.lesson}</p>

            {/* Expanded lesson */}
            {lessonStatus === "expanded" && fullLesson && (
              <div className="mt-5 pt-5 border-t border-zinc-800">
                <LessonContent content={fullLesson} />
              </div>
            )}

            {lessonStatus === "error" && (
              <p className="mt-3 text-xs text-red-400">Couldn't load full lesson. Try again.</p>
            )}
          </div>

          {/* Lesson footer: expand + ask the coach */}
          <div className="border-t border-zinc-800 px-5 py-3 flex items-center justify-between gap-3">
            <button
              onClick={lessonStatus === "expanded" ? () => setLessonStatus("collapsed") : expandLesson}
              disabled={lessonStatus === "loading"}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors disabled:opacity-50"
            >
              {lessonStatus === "loading" ? (
                <>
                  <span className="w-3 h-3 border border-zinc-500 border-t-zinc-200 rounded-full animate-spin" />
                  Generating full lesson…
                </>
              ) : lessonStatus === "expanded" ? (
                <>
                  <span className="text-zinc-600">▲</span> Collapse lesson
                </>
              ) : (
                <>
                  <span className="text-zinc-600">▼</span> Read full lesson
                </>
              )}
            </button>

            <button
              onClick={() => {
                setChatOpen((v) => !v);
                if (!chatOpen) setTimeout(() => chatInputRef.current?.focus(), 100);
              }}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                chatOpen
                  ? "bg-zinc-700 text-zinc-100"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
              }`}
            >
              <span>💬</span> Ask the Coach
              {chatMessages.length > 0 && (
                <span className="ml-1 bg-zinc-600 text-zinc-200 text-xs px-1.5 py-0.5 rounded-full">
                  {chatMessages.filter(m => m.role === "user").length}
                </span>
              )}
            </button>
          </div>

          {/* ── COACH CHAT PANEL ─────────────────────────────────────── */}
          {chatOpen && (
            <div className="border-t border-zinc-800">
              {/* Messages */}
              <div className="max-h-80 overflow-y-auto px-5 py-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-sm text-zinc-400 font-medium">Ask anything about this lesson.</p>
                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                      {[
                        "Give me another example",
                        "What's the most common mistake?",
                        "How do I know if I'm doing this right?",
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => { setChatInput(q); chatInputRef.current?.focus(); }}
                          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-full transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        ✍
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-zinc-700 text-zinc-100"
                          : "bg-zinc-800 text-zinc-200"
                      }`}
                    >
                      {msg.content || (
                        <span className="flex gap-1 items-center text-zinc-500">
                          <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-zinc-800 px-4 py-3 flex gap-2 items-end">
                <textarea
                  ref={chatInputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendChat();
                    }
                  }}
                  placeholder="Ask about the lesson, request examples, or share a draft…"
                  disabled={chatStreaming}
                  rows={1}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
                  style={{ minHeight: "38px", maxHeight: "120px" }}
                />
                <button
                  onClick={sendChat}
                  disabled={!chatInput.trim() || chatStreaming}
                  className="shrink-0 w-9 h-9 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm font-bold"
                >
                  ↑
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── SOURCE MATERIAL ──────────────────────────────────────────── */}
        {activeGiven && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Source Material</h2>
            <div className="border-l-4 border-amber-700/60 bg-amber-950/20 rounded-r-xl px-5 py-4">
              <p className="text-zinc-300 leading-relaxed text-sm italic whitespace-pre-line">{activeGiven}</p>
            </div>
          </section>
        )}

        {/* ── PROMPT ───────────────────────────────────────────────────── */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Your Exercise</h2>
          <p className="text-zinc-100 leading-relaxed">{activePrompt}</p>
          <p className="mt-2 text-xs text-zinc-500">{activeWordCountMin}–{activeWordCountMax} words</p>
        </section>

        {/* ── CRITERIA ─────────────────────────────────────────────────── */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Scoring Criteria</h2>
          <div className="space-y-2">
            {activeCriteria.map((c) => (
              <div key={c.name} className="flex gap-3 text-sm">
                <span className="text-zinc-500 shrink-0">{Math.round(c.weight * 100)}%</span>
                <div>
                  <span className="text-zinc-300 font-medium">{c.name}</span>
                  <span className="text-zinc-500"> — {c.description}</span>
                </div>
              </div>
            ))}
          </div>
          {stages && (
            <p className="mt-3 text-xs text-zinc-600">
              Pass threshold: {activePassThreshold}/100 — gets stricter each round
            </p>
          )}
        </section>

        {/* ── EDITOR ───────────────────────────────────────────────────── */}
        <section className="mb-4">
          <textarea
            className="w-full min-h-[180px] bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 text-base leading-relaxed resize-y focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="Write your response here…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="mt-2 text-xs">
            <span className={wordCount > 0 && !withinWordCount ? "text-amber-500" : "text-zinc-500"}>
              {wordCount} word{wordCount !== 1 ? "s" : ""}
              {wordCount > 0 && !withinWordCount && ` (need ${activeWordCountMin}–${activeWordCountMax})`}
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

        {/* I'm stuck */}
        {!feedback && (
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
        )}

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
          disabled={isSubmitting || !content.trim() || !withinWordCount}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
              Evaluating…
            </span>
          ) : "Submit for Feedback"}
        </button>

        {status === "error" && <p className="mt-3 text-sm text-red-400">{errorMsg}</p>}

        {/* ── FEEDBACK PANEL ───────────────────────────────────────────── */}
        {feedback && (() => {
          const tier = scoreTier(feedback.overallScore);
          const ts = TIER_STYLE[tier];
          const variantPassed = feedback.overallScore >= activePassThreshold;
          const alreadyMarked = passedVariants[variantIdx] ?? false;
          const passedCount = passedVariants.filter(Boolean).length;
          const newPassCount = alreadyMarked ? passedCount : passedCount + (variantPassed ? 1 : 0);
          const stageComplete = totalVariants > 0 && newPassCount >= totalVariants;
          const score = feedback.overallScore;
          const barPct = Math.min(100, score);
          const thresholdPct = Math.min(100, activePassThreshold);

          // For staged exercises: show score-vs-threshold as primary, tier as secondary
          // For non-staged: show tier as primary (original design)
          const isStaged = !!stages;

          return (
          <section className="mt-8 border border-zinc-800 rounded-xl overflow-hidden">
            {isStaged ? (
              /* ── Staged header: score bar + threshold ── */
              <div className="px-6 py-5 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className={`text-3xl font-black tabular-nums ${variantPassed ? "text-emerald-300" : "text-zinc-200"}`}>
                        {score}
                      </span>
                      <span className="text-zinc-600 text-sm font-medium">/ 100</span>
                      {variantPassed ? (
                        <span className="ml-2 text-sm font-semibold text-emerald-400">✓ Prompt cleared</span>
                      ) : (
                        <span className="ml-2 text-sm font-semibold text-zinc-500">
                          need {activePassThreshold} to clear
                        </span>
                      )}
                    </div>
                    {/* Score bar with threshold marker */}
                    <div className="relative h-2 bg-zinc-800 rounded-full overflow-visible">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${variantPassed ? "bg-emerald-500" : "bg-zinc-500"}`}
                        style={{ width: `${barPct}%` }}
                      />
                      {/* Threshold tick */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber-500/70 rounded-full"
                        style={{ left: `${thresholdPct}%` }}
                        title={`Round bar: ${activePassThreshold}`}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5 text-xs text-zinc-600">
                      <span>0</span>
                      <span className="text-amber-600/70" style={{ marginLeft: `${thresholdPct - 5}%` }}>
                        bar: {activePassThreshold}
                      </span>
                      <span>100</span>
                    </div>
                  </div>
                  {/* Qualitative tier — small, secondary */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ts.badge}`}>
                      {ts.dot} {TIER_LABEL[tier]}
                    </span>
                    {variants && (
                      <>
                        <div className="flex gap-1 mt-2">
                          {variants.map((_, i) => (
                            <div key={i} className={`h-1 w-4 rounded-full transition-colors ${
                              passedVariants[i] ? "bg-emerald-500" :
                              i === variantIdx && variantPassed ? "bg-emerald-400" :
                              i === variantIdx ? "bg-zinc-500" :
                              "bg-zinc-700"
                            }`} />
                          ))}
                        </div>
                        <span className="text-xs text-zinc-600">{passedCount}/{totalVariants} cleared</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* ── Non-staged header: original tier-dominant design ── */
              <div className={`px-6 py-5 ${ts.headerBg} border-b ${ts.headerBorder}`}>
                <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Result</div>
                <div className={`text-4xl font-black tracking-tight ${ts.labelColor}`}>
                  {ts.dot} {TIER_LABEL[tier]}
                </div>
              </div>
            )}

            <div className="px-6 py-5 space-y-5">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Criteria Breakdown</h3>
                <div className="space-y-4">
                  {feedback.criteriaResults.map((cr, i) => (
                    <div key={cr.name} className="transition-all duration-300" style={{ opacity: i < visibleCriteria ? 1 : 0, transform: i < visibleCriteria ? "translateY(0)" : "translateY(8px)" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${cr.passed ? "bg-emerald-500 text-white" : "bg-red-900 text-red-300"}`}>
                          {cr.passed ? "✓" : "✗"}
                        </span>
                        <span className="text-sm font-semibold text-zinc-200">{cr.name}</span>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden mx-2">
                          <div className={`h-full rounded-full transition-all duration-700 ${cr.passed ? "bg-emerald-500" : "bg-zinc-600"}`} style={{ width: `${cr.score * 100}%`, transitionDelay: `${i * 120}ms` }} />
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
              {/* Always offer a retry */}
              <button
                onClick={() => { setContent(""); setFeedback(null); setStatus("idle"); setGrammarMatches([]); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Try again
              </button>

              {/* ── NON-STAGED exercises: advance directly when server says passed ── */}
              {!stages && feedback.passed && nextExercise && (
                <button
                  onClick={() => router.push(`/track/${trackId}/exercise/${nextExercise.id}`)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
                >
                  Next exercise →
                </button>
              )}
              {!stages && feedback.passed && !nextExercise && (
                <button
                  onClick={() => router.push(`/track/${trackId}`)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition-colors"
                >
                  Track complete! →
                </button>
              )}

              {/* ── STAGED exercises: variant / stage / exercise advancement ── */}

              {/* Passed this variant, stage not yet complete — advance to next prompt */}
              {stages && variantPassed && !alreadyMarked && !stageComplete && (
                <button
                  onClick={markPassedAndAdvance}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
                >
                  Next prompt →
                </button>
              )}

              {/* Passed this variant AND it completes the stage — advance to next round */}
              {stages && variantPassed && !alreadyMarked && stageComplete && !isLastStage && (
                <button
                  onClick={advanceToNextStage}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
                >
                  Round {stageIdx + 2}: {stages![stageIdx + 1].label} →
                </button>
              )}

              {/* Completed final round of final stage */}
              {stages && variantPassed && !alreadyMarked && stageComplete && isLastStage && nextExercise && (
                <button
                  onClick={async () => {
                    await markExerciseComplete();
                    router.push(`/track/${trackId}/exercise/${nextExercise.id}`);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
                >
                  Next exercise →
                </button>
              )}
              {stages && variantPassed && !alreadyMarked && stageComplete && isLastStage && !nextExercise && (
                <button
                  onClick={async () => {
                    await markExerciseComplete();
                    router.push(`/track/${trackId}`);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition-colors"
                >
                  Track complete! →
                </button>
              )}
            </div>
          </section>
          );
        })()}
      </div>
    </main>
  );
}
