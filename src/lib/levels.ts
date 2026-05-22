export const LEVELS = [
  { level: 1, title: "Apprentice", minXp: 0 },
  { level: 2, title: "Journeyman", minXp: 250 },
  { level: 3, title: "Craftsman", minXp: 700 },
  { level: 4, title: "Wordsmith", minXp: 1500 },
  { level: 5, title: "Master", minXp: 3000 },
] as const;

export const XP_PASS = 50;
export const XP_FIRST_ATTEMPT_BONUS = 25;
export const XP_DAILY_DRILL = 30;
export const XP_TRACK_COMPLETE = 100;
export const XP_PROJECT_PHASE = 75;
export const XP_PROJECT_COMPLETE = 200;

export function getLevel(xp: number) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) idx = i;
  }
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1] as (typeof LEVELS)[number] | undefined;
  return {
    level: current.level,
    title: current.title,
    xp,
    nextLevelXp: next?.minXp ?? null,
    progressToNext: next
      ? Math.min(100, ((xp - current.minXp) / (next.minXp - current.minXp)) * 100)
      : 100,
  };
}
