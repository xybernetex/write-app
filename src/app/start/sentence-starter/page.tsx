"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { sentenceStarters } from "@/lib/start-prompts";

function countWords(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function randomIndex(len: number, exclude: number) {
  if (len <= 1) return 0;
  let next;
  do { next = Math.floor(Math.random() * len); } while (next === exclude);
  return next;
}

export default function SentenceStarterPage() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setIdx(Math.floor(Math.random() * sentenceStarters.length));
    setRevealed(true);
  }, []);

  const next = useCallback(() => {
    setRevealed(false);
    setTimeout(() => {
      setIdx((i) => randomIndex(sentenceStarters.length, i));
      setText("");
      setRevealed(true);
    }, 150);
  }, []);

  const starter = sentenceStarters[idx] ?? sentenceStarters[0];
  const wordCount = countWords(text);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-8 pt-12 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-10">
          <Link href="/start" className="hover:text-zinc-400 transition-colors">Start Here</Link>
          <span>›</span>
          <span className="text-zinc-400">Sentence Starter</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
            Your first line
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed">
            This sentence belongs to you now. Take it somewhere real.
            Don&apos;t explain it — just continue it.
          </p>
        </div>

        {/* First line */}
        <div
          className={`rounded-2xl border border-blue-800/40 bg-blue-950/20 p-7 mb-6 transition-opacity duration-150 ${revealed ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-2xl text-zinc-100 font-medium leading-relaxed tracking-tight italic">
            &ldquo;{starter}&rdquo;
          </p>
          <button
            onClick={next}
            className="mt-5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1.5"
          >
            <span>↺</span> Different starter
          </button>
        </div>

        {/* Writing area */}
        <div className="mb-2">
          <label className="text-xs text-zinc-600 uppercase tracking-widest font-medium block mb-2">
            Continue here
          </label>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`"${starter.slice(0, 40)}…" — then what?`}
              className="w-full min-h-[380px] bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-base text-zinc-100 leading-relaxed placeholder:text-zinc-700 resize-none focus:outline-none focus:border-blue-800/60 transition-colors"
              autoFocus
            />
            <div className="absolute bottom-4 right-4 text-xs text-zinc-600 tabular-nums">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </div>
          </div>
        </div>

        {wordCount >= 50 && (
          <div className="mt-4 rounded-xl border border-blue-800/30 bg-blue-900/10 p-4 flex items-center justify-between">
            <p className="text-sm text-blue-300">
              {wordCount >= 200
                ? "That's a real piece of writing."
                : wordCount >= 100
                ? "Keep going — you're finding it."
                : "Good start. Don't stop."}
            </p>
            <button
              onClick={next}
              className="text-xs text-blue-400 hover:text-blue-300 border border-blue-800/50 px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              New starter
            </button>
          </div>
        )}

        <p className="text-xs text-zinc-700 mt-6 text-center">
          Nothing here is saved or scored. This is just for you.
        </p>
      </div>
    </main>
  );
}
