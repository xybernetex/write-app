import Link from "next/link";
import { projects } from "@/lib/projects";

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: "bg-emerald-900/60 text-emerald-400 border border-emerald-800/50",
  intermediate: "bg-blue-900/60 text-blue-400 border border-blue-800/50",
  advanced: "bg-violet-900/60 text-violet-400 border border-violet-800/50",
};

const GENRE_TOP: Record<string, string> = {
  nonfiction: "bg-blue-500",
  fiction: "bg-violet-500",
};

export default function ProjectsPage() {
  const nonfiction = projects.filter((p) => p.genre === "nonfiction");
  const fiction = projects.filter((p) => p.genre === "fiction");

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-8 py-14">

        {/* Header */}
        <header className="mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            Projects
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-4">
            Write a complete piece.
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Tracks build individual skills. Projects put them together.
            Each project takes you through three phases — pitch, draft, revision —
            and ends with a finished piece of writing.
          </p>

          <div className="mt-6 flex items-center gap-6 text-sm text-zinc-500 flex-wrap">
            {[
              { icon: "✦", text: "3 phases per project" },
              { icon: "✦", text: "Feedback at every phase" },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-2">
                <span className="text-blue-500 text-xs">{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </header>

        {/* How it works */}
        <section className="mb-12 border border-zinc-800 rounded-2xl p-6 bg-zinc-900/50">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-5">
            How projects work
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                phase: "Phase 1",
                title: "Pitch",
                description: "Plan your piece before you write it. 100–200 words. Get the argument, structure, or story locked in.",
                color: "text-amber-400",
                bg: "bg-amber-950/40 border-amber-900/50",
              },
              {
                phase: "Phase 2",
                title: "Draft",
                description: "Write the full piece. Scored against craft criteria specific to the form you're writing.",
                color: "text-blue-400",
                bg: "bg-blue-950/40 border-blue-900/50",
              },
              {
                phase: "Phase 3",
                title: "Revision",
                description: "Revise with specific targets. Your revision is measured against what a strong version of this form requires.",
                color: "text-emerald-400",
                bg: "bg-emerald-950/40 border-emerald-900/50",
              },
            ].map((item) => (
              <div key={item.phase} className={`rounded-xl border p-4 ${item.bg}`}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${item.color}`}>
                  {item.phase}
                </div>
                <div className="text-sm font-semibold text-white mb-2">{item.title}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nonfiction projects */}
        {nonfiction.length > 0 && (
          <ProjectSection title="Nonfiction" icon="✍️" projects={nonfiction} />
        )}

        {/* Fiction projects */}
        {fiction.length > 0 && (
          <ProjectSection title="Fiction" icon="📖" projects={fiction} />
        )}
      </div>
    </main>
  );
}

function ProjectSection({
  title,
  icon,
  projects: list,
}: {
  title: string;
  icon: string;
  projects: typeof projects;
}) {
  return (
    <section className="mb-12">
      <div className="flex items-baseline gap-3 mb-5">
        <span>{icon}</span>
        <h2 className="text-base font-bold text-zinc-200">{title}</h2>
        <span className="text-xs text-zinc-600 font-medium">{list.length} projects</span>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {list.map((project) => {
          const topColor = GENRE_TOP[project.genre] ?? "bg-zinc-500";
          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all hover:shadow-xl overflow-hidden"
            >
              <div className={`h-1 w-full ${topColor} opacity-70 group-hover:opacity-100 transition-opacity`} />

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-zinc-100 text-lg leading-tight group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_BADGE[project.difficulty] ?? ""}`}>
                    {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed mb-5 flex-1">
                  {project.description}
                </p>

                {/* Phases */}
                <div className="flex items-center gap-2 mb-4">
                  {project.phases.map((phase, i) => (
                    <div key={phase.id} className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-400 font-semibold">
                          {i + 1}
                        </div>
                        <span className="text-xs text-zinc-500">{phase.title}</span>
                      </div>
                      {i < project.phases.length - 1 && (
                        <span className="text-zinc-700 text-xs">→</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">
                    {project.deliverable}
                  </span>
                  <span className="text-zinc-600 text-sm group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
