export type SentenceVariety = "monotone" | "some" | "varied";

export type WritingStats = {
  words: number;
  sentences: number;
  avgSentenceWords: number;
  minSentenceWords: number;
  maxSentenceWords: number;
  variety: SentenceVariety;
  passiveCount: number;
  passiveExamples: string[];
  fillerCount: number;
  fillerBreakdown: Array<{ word: string; count: number }>;
  adverbCount: number;
  adverbExamples: string[];
};

const FILLER_WORDS = [
  "very", "really", "just", "quite", "basically", "actually",
  "literally", "totally", "honestly", "definitely", "probably",
  "maybe", "absolutely", "essentially",
];

const ADVERB_EXCLUDES = new Set([
  "really", "only", "early", "daily", "nightly", "monthly", "yearly",
  "weekly", "hourly", "likely", "lonely", "lovely", "lively", "timely",
  "deadly", "costly", "worldly", "earthly", "heavenly", "friendly",
  "orderly", "fatherly", "motherly", "brotherly", "sisterly", "elderly",
]);

export function analyzeText(text: string): WritingStats | null {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/) : [];
  if (words.length < 20) return null;

  const rawSentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/[.!?]+$/, "").trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length >= 2);

  const sentenceLengths = rawSentences.map(
    (s) => s.split(/\s+/).filter(Boolean).length
  );

  const avgSentenceWords =
    sentenceLengths.length
      ? Math.round(
          sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
        )
      : 0;
  const minSentenceWords = sentenceLengths.length
    ? Math.min(...sentenceLengths)
    : 0;
  const maxSentenceWords = sentenceLengths.length
    ? Math.max(...sentenceLengths)
    : 0;

  let variety: SentenceVariety = "monotone";
  if (sentenceLengths.length >= 3) {
    const spread = maxSentenceWords - minSentenceWords;
    const ratio = maxSentenceWords / Math.max(minSentenceWords, 1);
    if (spread >= 12 || ratio >= 3) variety = "varied";
    else if (spread >= 5 || ratio >= 1.8) variety = "some";
  }

  const passiveRegex =
    /\b(am|is|are|was|were|be|been|being)\s+(\w+(?:ed|en))\b/gi;
  const passiveExamples: string[] = [];
  let pm;
  while ((pm = passiveRegex.exec(trimmed)) !== null) {
    passiveExamples.push(pm[0]);
  }

  const lowerText = trimmed.toLowerCase();
  const fillerBreakdown: Array<{ word: string; count: number }> = [];
  let fillerCount = 0;
  for (const fw of FILLER_WORDS) {
    const re = new RegExp(`\\b${fw}\\b`, "gi");
    const cnt = (lowerText.match(re) ?? []).length;
    if (cnt > 0) {
      fillerBreakdown.push({ word: fw, count: cnt });
      fillerCount += cnt;
    }
  }
  fillerBreakdown.sort((a, b) => b.count - a.count);

  const adverbExamples = Array.from(
    new Set(
      (trimmed.match(/\b\w{6,}ly\b/gi) ?? [])
        .map((w) => w.toLowerCase())
        .filter((w) => !ADVERB_EXCLUDES.has(w))
    )
  ).slice(0, 5);

  return {
    words: words.length,
    sentences: rawSentences.length,
    avgSentenceWords,
    minSentenceWords,
    maxSentenceWords,
    variety,
    passiveCount: passiveExamples.length,
    passiveExamples: passiveExamples.slice(0, 3),
    fillerCount,
    fillerBreakdown: fillerBreakdown.slice(0, 5),
    adverbCount: adverbExamples.length,
    adverbExamples,
  };
}
