import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/curriculum.ts';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Preamble: everything up to and including "export const tracks: Track[] = ["
// That's lines 0..22 (0-indexed), i.e., lines 1..23 in 1-indexed
const ARRAY_START = 22; // 0-indexed line of "export const tracks: Track[] = ["

// Track start lines (1-indexed from grep), converted to 0-indexed by -1, then -1 more for the `{` line before it
const trackIds = [
  { id: "strong-ledes",         idLine: 25 },
  { id: "two-weeks",            idLine: 214 },
  { id: "sentences-that-land",  idLine: 534 },
  { id: "nut-graf",             idLine: 606 },
  { id: "fiction-first-lines",  idLine: 677 },
  { id: "writing-voice",        idLine: 779 },
  { id: "scene-vs-summary",     idLine: 864 },
  { id: "writing-people",       idLine: 936 },
  { id: "personal-essay",       idLine: 1023 },
  { id: "opinion-writing",      idLine: 1110 },
  { id: "writing-numbers",      idLine: 1197 },
  { id: "writing-dialogue",     idLine: 1269 },
  { id: "character-voice",      idLine: 1355 },
  { id: "setting-atmosphere",   idLine: 1442 },
  { id: "show-dont-tell",       idLine: 1529 },
  { id: "tension-pacing",       idLine: 1616 },
  { id: "pov-perspective",      idLine: 1703 },
  { id: "paragraph-structure",  idLine: 1774 },
  { id: "writing-arguments",    idLine: 1854 },
  { id: "interview-on-page",    idLine: 1934 },
  { id: "writing-conflict",     idLine: 2014 },
  { id: "story-endings",        idLine: 2094 },
  { id: "research-on-the-page", idLine: 2174 },
  { id: "grammar-mechanics",    idLine: 2253 },
  { id: "word-level-editing",   idLine: 2340 },
  { id: "sentence-clarity",     idLine: 2427 },
  { id: "sentence-architecture",idLine: 2514 },
  { id: "revision-pass",        idLine: 2602 },
  { id: "subtext",              idLine: 2689 },
  { id: "interiority",          idLine: 2765 },
  { id: "emotional-beat",       idLine: 2841 },
  { id: "scene-construction",   idLine: 2917 },
  { id: "prose-rhythm",         idLine: 2994 },
  { id: "unreliable-narrator",  idLine: 3071 },
  { id: "structure-and-plot",   idLine: 3148 },
  { id: "foreshadowing-payoff", idLine: 3224 },
];

// Find the actual start of each track block (the `  {` line just before `    id:`)
// idLine is 1-indexed; idLine-2 (0-indexed) should be `  {`
// Actually looking at the file, the track `{` is on idLine-1 (1-indexed), 
// which is idLine-2 in 0-indexed. Let's verify by checking a couple.

// For strong-ledes: idLine=25, so the `{` should be on line 24 (1-indexed) = index 23 (0-indexed)
// For two-weeks: idLine=214, `{` should be on line 213 = index 212

// Build start indices (0-indexed)
const trackStarts = trackIds.map(t => t.idLine - 2); // 0-indexed line of `  {`

// Build end indices: each track ends just before the next one starts
// The last track ends at the `  },` before `];`
const trackBlocks = [];
for (let i = 0; i < trackStarts.length; i++) {
  const start = trackStarts[i];
  const end = i + 1 < trackStarts.length ? trackStarts[i + 1] - 1 : lines.length - 5; // -5 to exclude postamble
  trackBlocks.push({ id: trackIds[i].id, lines: lines.slice(start, end + 1) });
}

// Read genre and difficulty from each block
function readMeta(blockLines) {
  let genre = '', difficulty = '';
  for (const l of blockLines) {
    const gm = l.match(/genre:\s*"(\w+)"/);
    if (gm) genre = gm[1];
    const dm = l.match(/difficulty:\s*"(\w+)"/);
    if (dm) difficulty = dm[1];
    if (genre && difficulty) break;
  }
  return { genre, difficulty };
}

const DIFF_ORDER = { beginner: 0, intermediate: 1, advanced: 2 };
const GENRE_ORDER = { fiction: 0, nonfiction: 1, grammar: 2 };

const blocksWithMeta = trackBlocks.map(b => ({ ...b, ...readMeta(b.lines) }));
blocksWithMeta.sort((a, b) => {
  const gd = GENRE_ORDER[a.genre] - GENRE_ORDER[b.genre];
  if (gd !== 0) return gd;
  return DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty];
});

// Rebuild file
const preamble = lines.slice(0, ARRAY_START + 1).join('\n'); // up to and including "export const tracks: Track[] = ["
const postamble = lines.slice(lines.length - 8).join('\n');  // "];\n\nexport function..."

// Each block: trim trailing blank lines, ensure ends with `  },`
function cleanBlock(bl) {
  // Remove trailing empty lines
  let arr = [...bl];
  while (arr.length && arr[arr.length - 1].trim() === '') arr.pop();
  // Ensure last non-empty is `  },`
  return arr.join('\n');
}

const blocksText = blocksWithMeta.map(b => cleanBlock(b.lines)).join('\n\n');

const newContent = preamble + '\n' + blocksText + '\n\n' + '];\n\n' + lines.slice(lines.length - 6).join('\n');

// Verify we have all 36 tracks
console.log('Track count:', blocksWithMeta.length);
console.log('Order:');
blocksWithMeta.forEach(b => console.log(`  ${b.genre.padEnd(12)} ${b.difficulty.padEnd(14)} ${b.id}`));

writeFileSync(filePath, newContent, 'utf8');
console.log('\nDone.');
