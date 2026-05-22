export type Tier = "not-yet" | "solid" | "strong" | "exceptional";

export function scoreTier(score: number): Tier {
  if (score >= 95) return "exceptional";
  if (score >= 85) return "strong";
  if (score >= 70) return "solid";
  return "not-yet";
}

export const TIER_LABEL: Record<Tier, string> = {
  "not-yet": "Not Yet",
  solid: "Solid",
  strong: "Strong",
  exceptional: "Exceptional",
};

export const TIER_STYLE: Record<Tier, {
  headerBg: string;
  headerBorder: string;
  labelColor: string;
  badge: string;
  dot: string;
}> = {
  "not-yet": {
    headerBg: "bg-red-950",
    headerBorder: "border-red-900",
    labelColor: "text-red-300",
    badge: "bg-red-900 text-red-300",
    dot: "🔴",
  },
  solid: {
    headerBg: "bg-amber-950",
    headerBorder: "border-amber-900",
    labelColor: "text-amber-200",
    badge: "bg-amber-900 text-amber-200",
    dot: "🟡",
  },
  strong: {
    headerBg: "bg-emerald-950",
    headerBorder: "border-emerald-800",
    labelColor: "text-emerald-300",
    badge: "bg-emerald-900 text-emerald-300",
    dot: "🟢",
  },
  exceptional: {
    headerBg: "bg-yellow-950",
    headerBorder: "border-yellow-800",
    labelColor: "text-yellow-200",
    badge: "bg-yellow-800 text-yellow-100",
    dot: "✨",
  },
};
