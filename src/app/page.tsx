import Link from "next/link";
import { tracks } from "@/lib/curriculum";
import { projects } from "@/lib/projects";

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: "bg-emerald-900/60 text-emerald-400 border border-emerald-800/50",
  intermediate: "bg-blue-900/60 text-blue-400 border border-blue-800/50",
  advanced: "bg-violet-900/60 text-violet-400 border border-violet-800/50",
};

const GENRE_TOP: Record<string, string> = {
  nonfiction: "bg-blue-500",
  grammar: "bg-amber-500",
};
const GENRE_GLOW: Record<string, string> = {
  nonfiction: "hover:border-blue-800/60 hover:shadow-blue-950/40",
  grammar: "hover:border-amber-800/60 hover:shadow-amber-950/40",
};

function GenreSection({ title, icon, description, genre, tracks: trackList }: {
  title: string; icon: string; description: string; genre: string; tracks: typeof tracks;
}) {
  const topColor = GENRE_TOP[genre] ?? "bg-zinc-500";
  const glow = GENRE_GLOW[genre] ?? "";
  return (
    <section className="mb-12">
      <div className="flex items-baseline gap-3 mb-1.5">
        <span className="text-base">{icon}</span>
        <h2 className="text-base font-bold text-zinc-200">{title}</h2>
        <span className="text-xs text-zinc-600 font-medium">{trackList.length} tracks</span>
      </div>
      <p className="text-sm text-zinc-500 mb-5">{description}</p>
      <div className="grid grid-cols-2 gap-4">
        {trackList.map((track) => (
          <Link key={track.id} href={`/track/${track.id}`}
            className={`group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/60 transition-all hover:shadow-xl overflow-hidden ${glow}`}
          >
            <div className={`h-1 w-full ${topColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-zinc-100 text-base leading-snug group-hover:text-white transition-colors">{track.title}</h3>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_BADGE[track.difficulty] ?? "bg-zinc-800 text-zinc-500"}`}>
                  {track.difficulty.charAt(0).toUpperCase() + track.difficulty.slice(1)}
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed flex-1 line-clamp-2 mb-4">{track.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 font-medium">{track.exercises.length} exercises</span>
                <span className="text-zinc-600 text-sm group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const nonfiction = tracks.filter((t) => t.genre === "nonfiction");
  const grammar = tracks.filter((t) => t.genre === "grammar");
  const totalExercises = [...nonfiction, ...grammar].reduce((sum, t) => sum + t.exercises.length, 0);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-8">
        <section className="pt-16 pb-12 flex flex-col items-start">
          <h1 className="text-4xl font-black tracking-tight text-white leading-tight">
            The Writing Gym
          </h1>
          <p className="mt-3 text-base text-zinc-400 leading-relaxed max-w-xl">
            Deliberate practice for essays, Substack, and the book.
            Short reps. Real criteria. Feedback that tells you exactly what to fix.
          </p>
        </section>

        <div className="border-y border-zinc-800 py-4 flex items-center gap-6 text-sm mb-10">
          {[
            { value: `${nonfiction.length + grammar.length}`, label: "skill tracks" },
            { value: `${totalExercises}+`, label: "exercises" },
            { value: "✦", label: "Craft scoring" },
            { value: "✓", label: "Grammar check" },
          ].map((item, i, arr) => (
            <span key={item.label} className="flex items-center gap-2.5">
              <span className="text-zinc-400"><strong className="text-white font-bold">{item.value}</strong>{" "}{item.label}</span>
              {i < arr.length - 1 && <span className="text-zinc-700 select-none">·</span>}
            </span>
          ))}
        </div>

        <section className="mb-10">
          <Link href="/daily"
            className="group flex items-center justify-between gap-6 rounded-2xl border border-zinc-700/60 bg-gradient-to-r from-zinc-900 to-zinc-900 hover:from-zinc-800/80 hover:to-zinc-900 hover:border-amber-800/40 transition-all p-7 shadow-xl shadow-black/20"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl shrink-0">🔥</div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Daily Practice</div>
                <h2 className="text-lg font-bold text-white mb-1">Daily Drill</h2>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
                  Fresh essay prompt every session. Arguments, hot takes, patterns, ledes. 100–250 words. No research. No editing. Just reps.
                </p>
              </div>
            </div>
            <span className="text-zinc-400 text-lg shrink-0 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </section>

        <GenreSection
          title="Nonfiction"
          icon="✍️"
          description="Essays, arguments, longform — the craft of making true things compelling."
          genre="nonfiction"
          tracks={nonfiction}
        />
        <GenreSection
          title="Grammar & Mechanics"
          icon="✏️"
          description="Sentence-level work: rhythm, active voice, structure, punctuation."
          genre="grammar"
          tracks={grammar}
        />

        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-baseline gap-3 mb-1">
                <span>✦</span>
                <h2 className="text-base font-bold text-zinc-200">Projects</h2>
                <span className="text-xs text-zinc-600 font-medium">{projects.length} available</span>
              </div>
              <p className="text-sm text-zinc-500">Tracks build skills. Projects put them together — pitch, draft, and revise a complete piece.</p>
            </div>
            <Link href="/projects" className="shrink-0 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">See all →</Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {projects.slice(0, 3).map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all p-4"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-1.5 capitalize">{project.difficulty}</div>
                <h3 className="font-semibold text-zinc-100 text-sm leading-snug mb-2 group-hover:text-white transition-colors">{project.title}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">{project.deliverable}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {project.phases.map((ph, i) => (
                    <span key={ph.id} className="flex items-center gap-1.5">
                      <span className="text-xs text-zinc-600">{ph.title}</span>
                      {i < project.phases.length - 1 && <span className="text-zinc-700 text-xs">·</span>}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
        <div className="h-20" />
      </div>
    </main>
  );
}
