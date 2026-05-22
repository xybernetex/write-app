"use client";

import { useEffect, useState } from "react";
import type { FeedbackTone } from "@/lib/cloudflare-ai";

const TONES: {
  id: FeedbackTone;
  label: string;
  tagline: string;
  description: string;
  accent: string;
  border: string;
  bg: string;
  tag: string;
}[] = [
  {
    id: "coach",
    label: "Coach",
    tagline: "Encouraging & specific",
    description: "Leads with what worked. Frames weaknesses as the next thing to work on. Leaves you motivated. Good for when you're building habits or working on something hard.",
    accent: "text-emerald-400",
    border: "border-emerald-500",
    bg: "bg-emerald-950/30",
    tag: "bg-emerald-900/50 text-emerald-400",
  },
  {
    id: "editor",
    label: "Editor",
    tagline: "Direct & professional",
    description: "Names what worked and what didn't with equal honesty. No cheerleading, no cruelty. Treats you like a capable adult who wants the truth.",
    accent: "text-blue-400",
    border: "border-blue-500",
    bg: "bg-blue-950/30",
    tag: "bg-blue-900/50 text-blue-400",
  },
  {
    id: "brutal",
    label: "Brutal",
    tagline: "No softening",
    description: "Pure craft assessment. If it doesn't work, it says so directly. No encouragement, no framing. For when you want to know exactly where you stand.",
    accent: "text-red-400",
    border: "border-red-500",
    bg: "bg-red-950/30",
    tag: "bg-red-900/50 text-red-400",
  },
];

export default function SettingsPage() {
  const [tone, setTone] = useState<FeedbackTone>("coach");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { if (d.feedbackTone) setTone(d.feedbackTone); })
      .catch(() => {});
  }, []);

  async function selectTone(next: FeedbackTone) {
    setTone(next);
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackTone: next }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-6 py-16">

        <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
          Settings
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">
          Feedback intensity
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-10">
          Controls the tone of the coaching feedback on every submission. Scores are always honest — this only changes how the feedback is delivered.
        </p>

        <div className="flex flex-col gap-4">
          {TONES.map((t) => {
            const selected = tone === t.id;
            return (
              <button
                key={t.id}
                onClick={() => selectTone(t.id)}
                className={`text-left w-full rounded-xl border p-5 transition-all ${
                  selected
                    ? `${t.border} ${t.bg}`
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`font-bold text-base ${selected ? t.accent : "text-zinc-200"}`}>
                        {t.label}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selected ? t.tag : "bg-zinc-800 text-zinc-500"}`}>
                        {t.tagline}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selected ? `${t.border} ${t.accent}` : "border-zinc-700"
                  }`}>
                    {selected && <div className={`w-2.5 h-2.5 rounded-full ${t.accent.replace("text-", "bg-")}`} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 h-5 text-xs text-zinc-500">
          {saving && "Saving…"}
          {saved && !saving && "Saved."}
        </div>

      </div>
    </main>
  );
}
