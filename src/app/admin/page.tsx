"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AnalyticsData = {
  totals: { submissions: number; passed: number; avgScore: number; passRate: number };
  projectTotals: { phases: number; passed: number; avgScore: number };
  userCount: number;
  byExercise: {
    trackId: string; exerciseId: string;
    trackTitle: string; exerciseTitle: string;
    attempts: number; passed: number; passRate: number; avgScore: string | null;
  }[];
  criteriaBreakdown: { name: string; total: number; failRate: number }[];
  recent: {
    id: number; trackId: string; exerciseId: string;
    score: number | null; passed: boolean | null;
    submittedAt: number; generatedTitle: string | null;
  }[];
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">{label}</div>
      <div className="text-3xl font-black text-zinc-100">{value}</div>
      {sub && <div className="text-xs text-zinc-500 mt-1">{sub}</div>}
    </div>
  );
}

function timeAgo(sec: number) {
  const diff = Math.floor(Date.now() / 1000) - sec;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AdminPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Failed to load analytics"));
  }, []);

  if (error) return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </main>
  );

  if (!data) return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <span className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
    </main>
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-8 py-12">

        <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Admin</div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-8">Analytics</h1>

        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total users" value={data.userCount} />
          <StatCard label="Track submissions" value={data.totals.submissions} sub={`${data.totals.passRate}% pass rate`} />
          <StatCard label="Avg score" value={`${data.totals.avgScore}/100`} sub="track exercises" />
          <StatCard label="Project phases" value={data.projectTotals.phases} sub={`${data.projectTotals.phases > 0 ? Math.round((data.projectTotals.passed / data.projectTotals.phases) * 100) : 0}% passed`} />
        </div>

        {/* Criteria failure rates */}
        {data.criteriaBreakdown.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Criteria — failure rate</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {data.criteriaBreakdown.map((c, i) => (
                <div key={c.name} className={`flex items-center gap-4 px-5 py-3 ${i > 0 ? "border-t border-zinc-800" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-zinc-200 truncate">{c.name}</div>
                    <div className="text-xs text-zinc-500">{c.total} evaluated</div>
                  </div>
                  <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.failRate > 60 ? "bg-red-500" : c.failRate > 35 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${c.failRate}%` }}
                    />
                  </div>
                  <div className={`text-sm font-bold w-12 text-right shrink-0 ${c.failRate > 60 ? "text-red-400" : c.failRate > 35 ? "text-amber-400" : "text-emerald-400"}`}>
                    {c.failRate}%
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Exercise breakdown */}
        {data.byExercise.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Exercise performance</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 text-xs font-bold uppercase tracking-widest text-zinc-600 px-5 py-2 border-b border-zinc-800">
                <span>Exercise</span>
                <span className="text-right pr-6">Attempts</span>
                <span className="text-right pr-6">Pass rate</span>
                <span className="text-right">Avg score</span>
              </div>
              {data.byExercise.map((r, i) => (
                <div key={`${r.trackId}-${r.exerciseId}`} className={`grid grid-cols-[1fr_auto_auto_auto] gap-0 items-center px-5 py-3 ${i > 0 ? "border-t border-zinc-800" : ""}`}>
                  <div className="min-w-0">
                    <div className="text-sm text-zinc-200 truncate">{r.exerciseTitle}</div>
                    <div className="text-xs text-zinc-500">{r.trackTitle}</div>
                  </div>
                  <div className="text-sm text-zinc-400 text-right pr-6">{r.attempts}</div>
                  <div className={`text-sm font-semibold text-right pr-6 ${(r.passRate ?? 0) >= 60 ? "text-emerald-400" : "text-amber-400"}`}>
                    {r.passRate ?? 0}%
                  </div>
                  <div className="text-sm text-zinc-400 text-right">
                    {r.avgScore ? Math.round(Number(r.avgScore)) : "—"}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent submissions */}
        {data.recent.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Recent submissions</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {data.recent.map((r, i) => (
                <div key={r.id} className={`flex items-center gap-4 px-5 py-3 ${i > 0 ? "border-t border-zinc-800" : ""}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${r.passed ? "bg-emerald-500" : "bg-zinc-600"}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-zinc-200">
                      {r.generatedTitle ?? r.exerciseId}
                    </span>
                    <span className="text-xs text-zinc-500 ml-2">{r.trackId}</span>
                  </div>
                  <div className="text-sm text-zinc-400 shrink-0">{r.score ?? "—"}/100</div>
                  <div className="text-xs text-zinc-600 shrink-0 w-16 text-right">{timeAgo(r.submittedAt)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.totals.submissions === 0 && data.projectTotals.phases === 0 && (
          <div className="text-center py-16 text-zinc-600">No submissions yet.</div>
        )}

      </div>
    </main>
  );
}
