import Link from "next/link";

const modes = [
  {
    href: "/start/freewrite",
    icon: "✦",
    label: "Freewrite",
    tagline: "A prompt to get you moving",
    description:
      "We give you one question about your own life. You write. No grade, no craft criteria — just the habit of putting words down.",
    color: "hover:border-emerald-800/60 hover:shadow-emerald-950/40",
    accent: "text-emerald-400",
    badge: "bg-emerald-900/40 text-emerald-400 border border-emerald-800/50",
    top: "bg-emerald-500",
  },
  {
    href: "/start/sentence-starter",
    icon: "◆",
    label: "Sentence Starter",
    tagline: "Steal a first line",
    description:
      "We give you a first sentence. You take it somewhere. The hardest part of writing is starting — so we start for you.",
    color: "hover:border-blue-800/60 hover:shadow-blue-950/40",
    accent: "text-blue-400",
    badge: "bg-blue-900/40 text-blue-400 border border-blue-800/50",
    top: "bg-blue-500",
  },
  {
    href: "/start/unfolding",
    icon: "◎",
    label: "Guided Unfolding",
    tagline: "Follow the questions",
    description:
      "Five questions, revealed one at a time, that slowly draw something real out of you. A place. A person. A moment.",
    color: "hover:border-violet-800/60 hover:shadow-violet-950/40",
    accent: "text-violet-400",
    badge: "bg-violet-900/40 text-violet-400 border border-violet-800/50",
    top: "bg-violet-500",
  },
];

export default function StartPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-8 pt-20 pb-24">
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="inline-block text-xs font-bold uppercase tracking-widest text-amber-500 mb-4 px-3 py-1 rounded-full border border-amber-800/50 bg-amber-900/20">
            Start Here
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-4">
            No assignment. No grade.
            <br />
            <span className="text-zinc-500">Just put words down.</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xl mx-auto">
            Pick a mode. Write something. The only rule is that you start.
          </p>
        </div>

        {/* Mode cards */}
        <div className="flex flex-col gap-4">
          {modes.map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              className={`group flex items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/60 transition-all hover:shadow-xl overflow-hidden ${mode.color}`}
            >
              <div className={`w-1.5 self-stretch ${mode.top} opacity-70 group-hover:opacity-100 transition-opacity shrink-0`} />

              <div className="py-6 pr-6 flex items-center gap-5 flex-1 min-w-0">
                <div className={`text-3xl shrink-0 ${mode.accent} w-10 text-center`}>
                  {mode.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h2 className="font-bold text-zinc-100 text-lg group-hover:text-white transition-colors">
                      {mode.label}
                    </h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${mode.badge}`}>
                      {mode.tagline}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {mode.description}
                  </p>
                </div>
                <span className="text-zinc-600 text-lg group-hover:text-zinc-400 group-hover:translate-x-1 transition-all shrink-0">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer nudge */}
        <p className="text-center text-zinc-600 text-sm mt-12">
          When you&apos;re ready for structured practice,{" "}
          <Link href="/" className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition-colors">
            explore the tracks →
          </Link>
        </p>
      </div>
    </main>
  );
}
