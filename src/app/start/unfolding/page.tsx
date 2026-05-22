"use client";

import { useState } from "react";
import Link from "next/link";
import { unfoldingPaths, type UnfoldingPath } from "@/lib/start-prompts";

function countWords(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

type Answer = { question: string; text: string };

function PathCard({
  path,
  onSelect,
}: {
  path: UnfoldingPath;
  onSelect: (p: UnfoldingPath) => void;
}) {
  return (
    <button
      onClick={() => onSelect(path)}
      className="group w-full text-left rounded-2xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/60 hover:border-violet-800/40 transition-all p-6 hover:shadow-xl hover:shadow-violet-950/20"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl text-violet-400 mt-0.5 group-hover:scale-110 transition-transform">
          {path.icon}
        </span>
        <div>
          <h3 className="font-bold text-zinc-100 text-lg mb-1 group-hover:text-white transition-colors">
            {path.title}
          </h3>
          <p className="text-sm text-zinc-500">{path.subtitle}</p>
          <p className="text-xs text-zinc-600 mt-2">{path.questions.length} questions</p>
        </div>
      </div>
    </button>
  );
}

function WritingStep({
  path,
  stepIdx,
  answers,
  onAnswer,
  onNext,
}: {
  path: UnfoldingPath;
  stepIdx: number;
  answers: Answer[];
  onAnswer: (text: string) => void;
  onNext: () => void;
}) {
  const question = path.questions[stepIdx];
  const currentText = answers[stepIdx]?.text ?? "";
  const wordCount = countWords(currentText);
  const isLast = stepIdx === path.questions.length - 1;
  const canAdvance = wordCount >= 5;

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {path.questions.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < stepIdx
                ? "bg-violet-500"
                : i === stepIdx
                ? "bg-violet-400"
                : "bg-zinc-800"
            }`}
          />
        ))}
        <span className="text-xs text-zinc-500 font-medium tabular-nums ml-1 shrink-0">
          {stepIdx + 1} / {path.questions.length}
        </span>
      </div>

      {/* Path label */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-violet-400">{path.icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          {path.title}
        </span>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 mb-6">
        <p className="text-lg text-zinc-100 font-medium leading-relaxed">
          {question}
        </p>
      </div>

      {/* Previous answers (collapsed summary) */}
      {answers.filter((a, i) => i < stepIdx && a.text).length > 0 && (
        <div className="mb-5">
          {answers.filter((a, i) => i < stepIdx && a.text).map((a, i) => (
            <details key={i} className="group mb-1">
              <summary className="text-xs text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors list-none flex items-center gap-1.5 py-1">
                <span className="group-open:rotate-90 transition-transform inline-block">›</span>
                Question {i + 1}
              </summary>
              <div className="mt-1 ml-4 text-sm text-zinc-500 leading-relaxed border-l border-zinc-800 pl-4 py-1">
                {a.text}
              </div>
            </details>
          ))}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          key={stepIdx}
          value={currentText}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Write your answer here..."
          className="w-full min-h-[220px] bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-base text-zinc-100 leading-relaxed placeholder:text-zinc-700 resize-none focus:outline-none focus:border-violet-800/50 transition-colors"
          autoFocus
        />
        <div className="absolute bottom-3 right-4 text-xs text-zinc-600 tabular-nums">
          {wordCount}w
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-zinc-700">
          {canAdvance ? "" : "Write at least a few words to continue."}
        </p>
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="px-5 py-2 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {isLast ? "Finish →" : "Next question →"}
        </button>
      </div>
    </div>
  );
}

function FinalView({
  path,
  answers,
  onRestart,
}: {
  path: UnfoldingPath;
  answers: Answer[];
  onRestart: () => void;
}) {
  const totalWords = answers.reduce((s, a) => s + countWords(a.text), 0);

  return (
    <div>
      <div className="text-center mb-10">
        <div className="text-4xl mb-3">{path.icon}</div>
        <h2 className="text-2xl font-bold text-white mb-2">You finished.</h2>
        <p className="text-zinc-400 text-sm">
          {totalWords} words. {path.title}.
        </p>
      </div>

      <div className="space-y-6">
        {answers.map((a, i) => (
          <div key={i} className="border-l-2 border-zinc-800 pl-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">
              {path.questions[i]}
            </p>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
              {a.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <p className="text-zinc-500 text-sm text-center max-w-sm">
          This is raw material. If something in here matters to you,
          copy it somewhere and keep going.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition-all"
          >
            Try another path
          </button>
          <Link
            href="/start"
            className="text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition-all"
          >
            Back to Start Here
          </Link>
        </div>
      </div>
    </div>
  );
}

type Stage = "pick" | "writing" | "done";

export default function UnfoldingPage() {
  const [stage, setStage] = useState<Stage>("pick");
  const [path, setPath] = useState<UnfoldingPath | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const selectPath = (p: UnfoldingPath) => {
    setPath(p);
    setAnswers(p.questions.map((q) => ({ question: q, text: "" })));
    setStepIdx(0);
    setStage("writing");
  };

  const handleAnswer = (text: string) => {
    setAnswers((prev) => prev.map((a, i) => (i === stepIdx ? { ...a, text } : a)));
  };

  const advance = () => {
    if (!path) return;
    if (stepIdx < path.questions.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      setStage("done");
    }
  };

  const restart = () => {
    setPath(null);
    setStepIdx(0);
    setAnswers([]);
    setStage("pick");
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-8 pt-12 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-10">
          <Link href="/start" className="hover:text-zinc-400 transition-colors">Start Here</Link>
          <span>›</span>
          <span className="text-zinc-400">Guided Unfolding</span>
        </div>

        {stage === "pick" && (
          <div>
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">
                Choose a path
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Five questions, one at a time. They&apos;ll draw something real out of you.
                Pick whatever you have the most of right now.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {unfoldingPaths.map((p) => (
                <PathCard key={p.id} path={p} onSelect={selectPath} />
              ))}
            </div>
          </div>
        )}

        {stage === "writing" && path && (
          <WritingStep
            path={path}
            stepIdx={stepIdx}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={advance}
          />
        )}

        {stage === "done" && path && (
          <FinalView path={path} answers={answers} onRestart={restart} />
        )}

        {stage !== "done" && (
          <p className="text-xs text-zinc-700 mt-8 text-center">
            Nothing here is saved or scored. This is just for you.
          </p>
        )}
      </div>
    </main>
  );
}
