"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { freewitePrompts } from "@/lib/start-prompts";

function countWords(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function randomIndex(len: number, exclude: number) {
  if (len <= 1) return 0;
  let next;
  do { next = Math.floor(Math.random() * len); } while (next === exclude);
  return next;
}

export default function FreewritePage() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [text, setText] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [timerLimit, setTimerLimit] = useState(600); // 10 min default
  const [done, setDone] = useState(false);

  useEffect(() => {
    setPromptIdx(Math.floor(Math.random() * freewitePrompts.length));
  }, []);

  useEffect(() => {
    if (!timerOn || done) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s + 1 >= timerLimit) {
          clearInterval(id);
          setDone(true);
          return timerLimit;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerOn, timerLimit, done]);

  const newPrompt = useCallback(() => {
    setPromptIdx((i) => randomIndex(freewitePrompts.length, i));
    setText("");
    setSeconds(0);
    setDone(false);
    setTimerOn(false);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const wordCount = countWords(text);
  const prompt = freewitePrompts[promptIdx] ?? freewitePrompts[0];
  const progress = timerOn ? Math.min((seconds / timerLimit) * 100, 100) : null;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-8 pt-12 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-10">
          <Link href="/start" className="hover:text-zinc-400 transition-colors">Start Here</Link>
          <span>›</span>
          <span className="text-zinc-400">Freewrite</span>
        </div>

        {/* Prompt */}
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3">
            Your prompt
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-xl text-zinc-100 font-medium leading-relaxed">
              {prompt}
            </p>
            <button
              onClick={newPrompt}
              className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <span>↺</span> Different prompt
            </button>
          </div>
        </div>

        {/* Timer controls */}
        <div className="flex items-center gap-3 mb-4">
          {!timerOn ? (
            <>
              <button
                onClick={() => { setTimerOn(true); setDone(false); }}
                className="text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-all"
              >
                Start timer
              </button>
              <select
                value={timerLimit}
                onChange={(e) => setTimerLimit(Number(e.target.value))}
                className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5"
              >
                <option value={300}>5 min</option>
                <option value={600}>10 min</option>
                <option value={900}>15 min</option>
                <option value={1200}>20 min</option>
              </select>
            </>
          ) : (
            <div className="flex items-center gap-3 flex-1">
              <span className={`text-sm font-mono font-semibold tabular-nums ${done ? "text-emerald-400" : "text-zinc-300"}`}>
                {done ? "Time's up" : formatTime(seconds)}
              </span>
              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <button
                onClick={() => { setTimerOn(false); setSeconds(0); setDone(false); }}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing here..."
            className="w-full min-h-[400px] bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-base text-zinc-100 leading-relaxed placeholder:text-zinc-700 resize-none focus:outline-none focus:border-emerald-800/60 transition-colors"
            autoFocus
          />
          <div className="absolute bottom-4 right-4 text-xs text-zinc-600 tabular-nums">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </div>
        </div>

        {done && (
          <div className="mt-6 rounded-xl border border-emerald-800/40 bg-emerald-900/10 p-5 text-center">
            <p className="text-emerald-400 font-semibold text-sm mb-1">Time&apos;s up — {wordCount} words.</p>
            <p className="text-zinc-500 text-sm">That&apos;s a rep. Come back tomorrow.</p>
            <button
              onClick={newPrompt}
              className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-800/50 px-4 py-1.5 rounded-lg transition-colors"
            >
              New prompt
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
