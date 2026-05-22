"use client";

import { useMemo } from "react";
import { analyzeText } from "@/lib/writing-stats";

export type GrammarMatch = {
  message: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
  rule: { category: { id: string } };
};

type Props = {
  text: string;
  withinWordCount: boolean;
  grammarMatches?: GrammarMatch[];
  grammarLoading?: boolean;
  onDismissGrammar?: () => void;
};

function GrammarIssueItem({ match }: { match: GrammarMatch }) {
  const top3 = match.replacements.slice(0, 3).map((r) => r.value);
  return (
    <div className="px-4 py-2.5 flex gap-3 items-start">
      <span className="text-amber-500 text-xs mt-0.5 shrink-0">⚠</span>
      <div className="min-w-0">
        <p className="text-xs text-zinc-300 leading-relaxed">{match.message}</p>
        {top3.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {top3.map((s) => (
              <span key={s} className="text-xs bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function WritingPanel({
  text,
  withinWordCount,
  grammarMatches = [],
  grammarLoading = false,
  onDismissGrammar,
}: Props) {
  const stats = useMemo(() => analyzeText(text), [text]);

  const errorMatches = grammarMatches.filter(
    (m) => m.rule.category.id === "TYPOS" || m.rule.category.id === "GRAMMAR"
  );
  const styleMatches = grammarMatches.filter(
    (m) => m.rule.category.id !== "TYPOS" && m.rule.category.id !== "GRAMMAR"
  );

  const hasStats = stats !== null;
  const hasGrammar = grammarMatches.length > 0;

  if (!hasStats && !hasGrammar && !grammarLoading) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Compact stats strip — shown while writing, before word count is met */}
      {hasStats && !withinWordCount && (
        <div className="flex items-center gap-2 text-xs text-zinc-700 flex-wrap">
          <span>{stats.sentences} sent</span>
          <span>·</span>
          <span>avg {stats.avgSentenceWords}w</span>
          <span>·</span>
          <span
            className={
              stats.variety === "varied"
                ? "text-emerald-700"
                : stats.variety === "some"
                ? "text-zinc-600"
                : "text-amber-700"
            }
          >
            {stats.variety === "varied"
              ? "varied ✓"
              : stats.variety === "some"
              ? "some variety"
              : "monotone"}
          </span>
          {stats.passiveCount > 0 && (
            <>
              <span>·</span>
              <span className={stats.passiveCount > 3 ? "text-amber-700" : "text-zinc-600"}>
                {stats.passiveCount} passive
              </span>
            </>
          )}
          {stats.fillerCount > 0 && (
            <>
              <span>·</span>
              <span className={stats.fillerCount > 3 ? "text-amber-700" : "text-zinc-600"}>
                {stats.fillerCount} filler
              </span>
            </>
          )}
        </div>
      )}

      {/* Before-you-submit panel — shown when word count target is met */}
      {hasStats && withinWordCount && (
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
          <div className="px-4 py-2.5 border-b border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Before you submit
            </span>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {/* Sentence variety */}
            <div className="px-4 py-3 flex items-start gap-4">
              <span className="text-xs text-zinc-600 w-32 shrink-0 pt-0.5">Sentence length</span>
              <div>
                <span
                  className={`text-xs font-semibold ${
                    stats.variety === "varied"
                      ? "text-emerald-400"
                      : stats.variety === "some"
                      ? "text-zinc-300"
                      : "text-amber-400"
                  }`}
                >
                  {stats.variety === "varied"
                    ? "Varied ✓"
                    : stats.variety === "some"
                    ? "Some variety"
                    : "All similar — mix it up"}
                </span>
                <span className="text-xs text-zinc-600 ml-2">
                  {stats.minSentenceWords}–{stats.maxSentenceWords} words, avg {stats.avgSentenceWords}
                </span>
              </div>
            </div>

            {/* Passive voice */}
            {stats.passiveCount > 0 && (
              <div className="px-4 py-3 flex items-start gap-4">
                <span className="text-xs text-zinc-600 w-32 shrink-0 pt-0.5">Passive voice</span>
                <div>
                  <span
                    className={`text-xs font-semibold ${
                      stats.passiveCount > 3 ? "text-amber-400" : "text-zinc-400"
                    }`}
                  >
                    {stats.passiveCount} {stats.passiveCount === 1 ? "instance" : "instances"}
                  </span>
                  {stats.passiveExamples.length > 0 && (
                    <span className="text-xs text-zinc-600 ml-2 italic">
                      {stats.passiveExamples.slice(0, 2).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Filler words */}
            {stats.fillerCount > 0 && (
              <div className="px-4 py-3 flex items-start gap-4">
                <span className="text-xs text-zinc-600 w-32 shrink-0 pt-0.5">Filler words</span>
                <div className="flex flex-wrap gap-1.5">
                  {stats.fillerBreakdown.map(({ word, count }) => (
                    <span
                      key={word}
                      className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono"
                    >
                      {word} ×{count}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Adverbs */}
            {stats.adverbCount > 0 && (
              <div className="px-4 py-3 flex items-start gap-4">
                <span className="text-xs text-zinc-600 w-32 shrink-0 pt-0.5">-ly adverbs</span>
                <div className="flex flex-wrap gap-1.5">
                  {stats.adverbExamples.map((w) => (
                    <span
                      key={w}
                      className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grammar issues */}
      {(hasGrammar || grammarLoading) && (
        <div className="border border-amber-900/40 rounded-xl overflow-hidden bg-amber-950/10">
          <div className="px-4 py-2.5 border-b border-amber-900/40 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500/80">
              {grammarLoading && !hasGrammar
                ? "Checking…"
                : `${grammarMatches.length} grammar ${
                    grammarMatches.length === 1 ? "issue" : "issues"
                  }`}
            </span>
            {hasGrammar && onDismissGrammar && (
              <button
                onClick={onDismissGrammar}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                dismiss
              </button>
            )}
          </div>
          {hasGrammar && (
            <div className="divide-y divide-zinc-800/50">
              {errorMatches.map((m, i) => (
                <GrammarIssueItem key={i} match={m} />
              ))}
              {styleMatches.length > 0 && (
                <>
                  <div className="px-4 py-1.5 bg-zinc-900/30">
                    <span className="text-xs text-zinc-600 font-medium">Style</span>
                  </div>
                  {styleMatches.slice(0, 3).map((m, i) => (
                    <GrammarIssueItem key={`s${i}`} match={m} />
                  ))}
                  {styleMatches.length > 3 && (
                    <div className="px-4 py-2 text-xs text-zinc-700">
                      +{styleMatches.length - 3} more
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
