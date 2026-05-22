"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { tracks } from "@/lib/curriculum";

const STRUGGLES = [
  "My writing feels flat and lifeless",
  "I can't write a good opening sentence",
  "My sentences all sound the same",
  "I rely too much on adjectives",
  "My paragraphs don't connect",
  "I tell instead of show",
  "I can't cut — everything feels necessary",
  "My dialogue sounds fake",
  "I don't know how to structure an essay",
  "My writing is too wordy",
  "I lose the reader in the middle",
  "I don't know how to end a piece",
  "My argument doesn't land",
  "I repeat myself without realizing it",
  "My writing sounds too formal",
  "I can't write a scene — it feels like a list",
];

const MAX_DRAFT_WORDS = 1500;

function countWords(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function parseSections(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  const parts = text.split(/^## /m);
  for (const part of parts) {
    if (!part.trim()) continue;
    const newline = part.indexOf("\n");
    if (newline === -1) continue;
    const key = part.slice(0, newline).trim();
    const value = part.slice(newline + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

// Renders "quoted text" — feedback lines
function SpecificMoments({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const moments = lines.map((line) => {
    const dashIdx = line.indexOf("\" —");
    if (line.startsWith('"') && dashIdx !== -1) {
      return {
        quote: line.slice(1, dashIdx),
        note: line.slice(dashIdx + 3).trim(),
      };
    }
    return { quote: null, note: line };
  });

  return (
    <div className="space-y-3">
      {moments.map((m, i) =>
        m.quote ? (
          <div key={i} className="border-l-2 border-zinc-700 pl-4">
            <p className="text-sm text-zinc-300 italic mb-1">&ldquo;{m.quote}&rdquo;</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{m.note}</p>
          </div>
        ) : (
          <p key={i} className="text-sm text-zinc-400 leading-relaxed">{m.note}</p>
        )
      )}
    </div>
  );
}

function ExampleBlock({ text }: { text: string }) {
  const beforeMatch = text.match(/Before:\n([\s\S]*?)(?=\nAfter:|$)/i);
  const afterMatch = text.match(/After:\n([\s\S]*?)$/i);
  if (beforeMatch && afterMatch) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg bg-red-950/20 border border-red-900/30 px-4 py-3">
          <div className="text-xs font-bold uppercase tracking-widest text-red-500/70 mb-2">Before</div>
          <p className="text-sm text-zinc-400 leading-relaxed italic">{beforeMatch[1].trim()}</p>
        </div>
        <div className="rounded-lg bg-emerald-950/20 border border-emerald-900/30 px-4 py-3">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-500/70 mb-2">After</div>
          <p className="text-sm text-zinc-300 leading-relaxed italic">{afterMatch[1].trim()}</p>
        </div>
      </div>
    );
  }
  return <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>;
}

function GoDeeper({ trackId }: { trackId: string }) {
  const track = tracks.find((t) => t.id === trackId.trim());
  if (!track) return null;
  return (
    <Link
      href={`/track/${track.id}`}
      className="group flex items-center justify-between gap-4 rounded-xl border border-blue-800/40 bg-blue-950/20 px-5 py-4 hover:bg-blue-950/40 transition-all"
    >
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">Go deeper</div>
        <div className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
          {track.title}
        </div>
        <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{track.description}</div>
      </div>
      <span className="text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all shrink-0">→</span>
    </Link>
  );
}

type Status = "idle" | "streaming" | "done" | "error";
type Mode = "struggle" | "draft";

export default function ClinicPage() {
  const [mode, setMode] = useState<Mode>("struggle");

  // Struggle mode state
  const [struggleInput, setStruggleInput] = useState("");

  // Draft mode state
  const [draft, setDraft] = useState("");
  const [draftContext, setDraftContext] = useState("");

  // Shared response state
  const [activeInput, setActiveInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [rawResponse, setRawResponse] = useState("");
  const [tryItText, setTryItText] = useState("");
  const [activeMode, setActiveMode] = useState<Mode>("struggle");

  const struggleRef = useRef<HTMLTextAreaElement>(null);
  const sections = useMemo(() => parseSections(rawResponse), [rawResponse]);

  const draftWords = countWords(draft);
  const draftOverLimit = draftWords > MAX_DRAFT_WORDS;

  async function stream(url: string, body: object, label: string) {
    setActiveInput(label);
    setActiveMode(mode);
    setStatus("streaming");
    setRawResponse("");
    setTryItText("");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok || !res.body) { setStatus("error"); return; }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setRawResponse(accumulated);
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function handleStruggleSubmit(text: string) {
    if (!text.trim()) return;
    stream("/api/clinic", { struggle: text }, text.trim());
  }

  function handleDraftSubmit() {
    if (!draft.trim() || draftOverLimit) return;
    const label = draftContext.trim()
      ? `Draft analysis (${draftContext.trim()})`
      : "Draft analysis";
    stream("/api/clinic-draft", { draft, context: draftContext }, label);
  }

  function reset() {
    setStatus("idle");
    setRawResponse("");
    setActiveInput("");
    setTryItText("");
    setTimeout(() => struggleRef.current?.focus(), 50);
  }

  const isActive = status === "streaming" || status === "done";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-8 pt-12 pb-24">

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
            Writing Clinic
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-3">
            Get specific feedback on your writing.
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Describe a struggle and get a diagnosis — or paste a draft and get line-level feedback on your actual words.
          </p>
        </div>

        {/* Mode tabs */}
        {!isActive && (
          <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl mb-8 w-fit">
            {(["struggle", "draft"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === m
                    ? "bg-zinc-100 text-zinc-950"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {m === "struggle" ? "I'm stuck on something" : "Analyze my draft"}
              </button>
            ))}
          </div>
        )}

        {/* ── STRUGGLE MODE ─────────────────────────────────────── */}
        {!isActive && mode === "struggle" && (
          <>
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">
                Common struggles
              </div>
              <div className="flex flex-wrap gap-2">
                {STRUGGLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStruggleSubmit(s)}
                    className="text-xs text-zinc-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-full transition-all hover:text-zinc-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">
                Or describe it yourself
              </div>
              <div className="flex gap-2">
                <textarea
                  ref={struggleRef}
                  value={struggleInput}
                  onChange={(e) => setStruggleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleStruggleSubmit(struggleInput);
                    }
                  }}
                  placeholder="e.g. My essays start strong but fall apart in the middle…"
                  rows={2}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none focus:border-zinc-500 transition-colors leading-relaxed"
                />
                <button
                  onClick={() => handleStruggleSubmit(struggleInput)}
                  disabled={!struggleInput.trim()}
                  className="shrink-0 px-5 rounded-xl bg-zinc-100 text-zinc-950 font-bold text-sm hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors self-stretch"
                >
                  →
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── DRAFT MODE ────────────────────────────────────────── */}
        {!isActive && mode === "draft" && (
          <div className="mb-8 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                  Paste your draft
                </div>
                <span className={`text-xs tabular-nums font-medium ${
                  draftOverLimit ? "text-red-400" : draftWords > 1200 ? "text-amber-400" : "text-zinc-600"
                }`}>
                  {draftWords} / {MAX_DRAFT_WORDS} words
                </span>
              </div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Paste a paragraph, a page, or anything up to 1,500 words. The more focused the excerpt, the sharper the feedback."
                rows={10}
                className={`w-full bg-zinc-900 border rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 resize-y focus:outline-none transition-colors leading-relaxed ${
                  draftOverLimit
                    ? "border-red-800 focus:border-red-600"
                    : "border-zinc-700 focus:border-zinc-500"
                }`}
              />
              {draftOverLimit && (
                <p className="text-xs text-red-400 mt-1">
                  Trim to 1,500 words for analysis. Paste a focused excerpt — feedback gets sharper with less.
                </p>
              )}
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">
                What are you trying to do? <span className="font-normal normal-case text-zinc-700">(optional)</span>
              </div>
              <input
                type="text"
                value={draftContext}
                onChange={(e) => setDraftContext(e.target.value)}
                placeholder="e.g. opening paragraph of a personal essay, or scene where two characters argue"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <button
              onClick={handleDraftSubmit}
              disabled={!draft.trim() || draftOverLimit}
              className="w-full py-3 rounded-xl font-bold text-sm bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Analyze my draft →
            </button>
          </div>
        )}

        {/* Active context banner */}
        {isActive && (
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 flex-1 min-w-0">
              <div className="text-xs text-zinc-600 font-medium mb-1">
                {activeMode === "draft" ? "Analyzing your draft" : "Your struggle"}
              </div>
              <p className="text-sm text-zinc-300 truncate">{activeInput}</p>
            </div>
            <button
              onClick={reset}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors shrink-0 mt-3 whitespace-nowrap"
            >
              ← Start over
            </button>
          </div>
        )}

        {/* Loading state */}
        {status === "streaming" && Object.keys(sections).length === 0 && (
          <div className="flex items-center gap-3 text-sm text-zinc-500 py-6">
            <span className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
            {activeMode === "draft" ? "Reading your draft…" : "Reading your struggle…"}
          </div>
        )}

        {/* ── RESPONSE ──────────────────────────────────────────── */}
        {(status === "streaming" || status === "done") && (
          <div className="space-y-4">

            {/* Struggle mode sections */}
            {sections["DIAGNOSIS"] && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 pt-4 pb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">What&apos;s happening</div>
                <p className="text-base text-zinc-200 leading-relaxed">{sections["DIAGNOSIS"]}</p>
              </div>
            )}

            {sections["THE PRINCIPLE"] && (
              <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 pt-4 pb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">The principle</div>
                <p className="text-base text-white font-medium leading-relaxed">{sections["THE PRINCIPLE"]}</p>
              </div>
            )}

            {sections["EXAMPLE"] && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 pt-4 pb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Example</div>
                <ExampleBlock text={sections["EXAMPLE"]} />
              </div>
            )}

            {sections["TRY THIS"] && (
              <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 px-5 pt-4 pb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">Try this now</div>
                <p className="text-sm text-zinc-200 leading-relaxed mb-4">{sections["TRY THIS"]}</p>
                {status === "done" && (
                  <div className="relative">
                    <textarea
                      value={tryItText}
                      onChange={(e) => setTryItText(e.target.value)}
                      placeholder="Write your attempt here…"
                      rows={4}
                      className="w-full bg-zinc-900 border border-amber-900/40 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-700 resize-none focus:outline-none focus:border-amber-700/50 transition-colors leading-relaxed"
                    />
                    {tryItText.trim() && (
                      <div className="absolute bottom-3 right-3 text-xs text-zinc-700 tabular-nums">
                        {countWords(tryItText)}w
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Draft mode sections */}
            {sections["WHAT'S WORKING"] && (
              <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/10 px-5 pt-4 pb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">What&apos;s working</div>
                <p className="text-sm text-zinc-200 leading-relaxed">{sections["WHAT'S WORKING"]}</p>
              </div>
            )}

            {sections["THE MAIN ISSUE"] && (
              <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 pt-4 pb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">The main issue</div>
                <p className="text-base text-white font-medium leading-relaxed">{sections["THE MAIN ISSUE"]}</p>
              </div>
            )}

            {sections["SPECIFIC MOMENTS"] && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 pt-4 pb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Specific moments</div>
                <SpecificMoments text={sections["SPECIFIC MOMENTS"]} />
              </div>
            )}

            {sections["ONE FIX"] && (
              <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 px-5 pt-4 pb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">One fix</div>
                <p className="text-sm text-zinc-200 leading-relaxed">{sections["ONE FIX"]}</p>
              </div>
            )}

            {sections["GO DEEPER"] && sections["GO DEEPER"] !== "none" && status === "done" && (
              <GoDeeper trackId={sections["GO DEEPER"]} />
            )}

          </div>
        )}

        {status === "error" && (
          <div className="text-sm text-red-400 py-4">
            Something went wrong.{" "}
            <button onClick={reset} className="underline hover:text-red-300">Try again.</button>
          </div>
        )}

        {status === "done" && (
          <div className="mt-8 text-center">
            <button
              onClick={reset}
              className="text-sm text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600 px-5 py-2 rounded-xl transition-all"
            >
              {activeMode === "draft" ? "Analyze another draft" : "Ask about something else"}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
