import type { Track } from "./curriculum";

export type PhaseNumber = 1 | 2 | 3 | 4;

/** Maps every track ID to its phase */
export const TRACK_PHASE: Record<string, PhaseNumber> = {
  // ── Phase 1: Foundation ─────────────────────────────────────────────────
  "two-weeks": 1,
  "grammar-mechanics": 1,
  "word-level-editing": 1,
  "sentence-clarity": 1,
  "opinion-development": 1,
  "the-paragraph": 1,

  // ── Phase 2: The Essay ───────────────────────────────────────────────────
  "strong-ledes": 2,
  "sentences-that-land": 2,
  "writing-voice": 2,
  "scene-vs-summary": 2,
  "nut-graf-fundamentals": 2,
  "opinion-writing": 2,
  "argument-fundamentals": 2,
  "nut-graf": 2,
  "writing-arguments": 2,
  "transitions": 2,
  "the-ending": 2,
  "the-turn": 2,

  // ── Phase 3: Craft ───────────────────────────────────────────────────────
  "writing-people": 3,
  "personal-essay": 3,
  "writing-numbers": 3,
  "paragraph-structure": 3,
  "evidence-and-warrant": 3,
  "the-single-idea": 3,
  "essay-architecture": 3,
  "voice-work": 3,
  "reading-like-a-writer": 3,
  "sentence-architecture": 3,
  "revision-pass": 3,
  "revision": 3,

  // ── Phase 4: Long Form ───────────────────────────────────────────────────
  "research-on-the-page": 4,
  "interview-on-page": 4,
  "adult-book-report": 4,
  "substack-format": 4,
  "full-essay": 4,
  "chapter-architecture": 4,
  "book-proposal": 4,
};

export interface PhaseMeta {
  phase: PhaseNumber;
  title: string;
  description: string;
  /** Tracks needed from THIS phase to unlock the next. null = final phase. */
  gateCount: number | null;
  /** Total tracks in this phase — computed at runtime */
  totalCount?: number;
}

export const PHASE_META: PhaseMeta[] = [
  {
    phase: 1,
    title: "Foundation",
    description: "Build the habit. Sentences, opinions, paragraphs — the atoms of nonfiction.",
    gateCount: 4,
  },
  {
    phase: 2,
    title: "The Essay",
    description: "Ledes, arguments, structure — complete pieces that move from opening to kicker.",
    gateCount: 6,
  },
  {
    phase: 3,
    title: "Craft",
    description: "Voice, evidence, revision — the layer beneath the surface that separates good from great.",
    gateCount: 6,
  },
  {
    phase: 4,
    title: "Long Form",
    description: "Substack format, book chapters, proposals — writing at the scale of a career.",
    gateCount: null,
  },
];

/** Group tracks by phase number */
export function groupByPhase(tracks: Track[]): Record<PhaseNumber, Track[]> {
  const out: Record<PhaseNumber, Track[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const track of tracks) {
    const phase = (TRACK_PHASE[track.id] ?? 1) as PhaseNumber;
    out[phase].push(track);
  }
  return out;
}

/** How many tracks in a phase are complete */
export function phaseCompletedCount(
  phaseTracks: Track[],
  completedTrackIds: Set<string>
): number {
  return phaseTracks.filter((t) => completedTrackIds.has(t.id)).length;
}

/** Is this phase accessible? */
export function isPhaseUnlocked(
  phaseNum: PhaseNumber,
  tracksByPhase: Record<PhaseNumber, Track[]>,
  completedTrackIds: Set<string>
): boolean {
  if (phaseNum === 1) return true;
  const prevPhase = (phaseNum - 1) as PhaseNumber;
  const prevMeta = PHASE_META[prevPhase - 1];
  if (!prevMeta.gateCount) return true;
  const completed = phaseCompletedCount(tracksByPhase[prevPhase], completedTrackIds);
  return completed >= prevMeta.gateCount;
}
