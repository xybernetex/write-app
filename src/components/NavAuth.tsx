"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = {
  xp: number;
  streak: number;
  level: number;
  title: string;
  nextLevelXp: number | null;
  progressToNext: number;
};

export function NavAuth() {
  const { isSignedIn, isLoaded } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/user-stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, [isSignedIn]);

  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        {stats && (
          <div className="flex items-center gap-3">
            {/* Streak */}
            {stats.streak > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium text-amber-400">
                <span>🔥</span>
                <span>{stats.streak}</span>
              </div>
            )}

            {/* XP + level */}
            <div className="flex items-center gap-1.5 group relative">
              <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                Lv{stats.level}
              </div>
              <span className="text-xs text-zinc-500">{stats.xp} XP</span>

              {/* Level progress tooltip */}
              <div className="absolute top-7 right-0 hidden group-hover:block z-50 bg-zinc-900 border border-zinc-700 rounded-lg p-3 w-48 shadow-xl">
                <div className="text-xs font-semibold text-zinc-200 mb-1">{stats.title}</div>
                <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${stats.progressToNext}%` }}
                  />
                </div>
                <div className="text-xs text-zinc-500">
                  {stats.nextLevelXp
                    ? `${stats.xp} / ${stats.nextLevelXp} XP`
                    : "Max level"}
                </div>
              </div>
            </div>
          </div>
        )}

        <Link
          href="/settings"
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </Link>
        <UserButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/sign-in" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="text-sm font-medium px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
      >
        Sign up free
      </Link>
    </div>
  );
}
