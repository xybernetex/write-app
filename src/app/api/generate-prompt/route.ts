import { NextRequest, NextResponse } from "next/server";

export type GeneratedPrompt = {
  title: string;
  category: string;
  prompt: string;
  wordCountMin: number;
  wordCountMax: number;
  criteria: { name: string; description: string; weight: number }[];
};

const CATEGORIES = [
  "Argument",
  "Hot Take",
  "Pattern",
  "Essay Lede",
  "Nut Graf",
  "Counter",
];

const SYSTEM = `You are a writing coach designing daily drills for someone writing Substack essays, opinion pieces, and long-form nonfiction. Every prompt builds a specific essay-writing muscle: staking a position, building an argument, finding the opening, identifying a pattern, or getting clear on what you actually think.

These are NOT creative writing exercises. No "describe a memory." No "observe a neglected space." No sensory detail exercises. Every prompt should feel like the beginning of a real piece — something the writer might actually publish.

Respond with a JSON object ONLY (no markdown, no explanation):
{
  "title": "<5 words max — a punchy essay-style title, e.g. 'The Productivity Trap' or 'Why Advice Fails'>",
  "category": "<one of: Argument | Hot Take | Pattern | Essay Lede | Nut Graf | Counter>",
  "prompt": "<3-5 sentences. Specific, opinionated, and actionable. Tells the writer exactly what position to stake or what idea to develop. No research needed — draws on their own experience and thinking. Ends with the word count and 'No research. No editing. No perfection.'>",
  "wordCountMin": 100,
  "wordCountMax": 250,
  "criteria": [
    {
      "name": "<criterion name, 3-6 words>",
      "description": "<one sentence: what to look for when evaluating this — focused on argument quality and specificity>",
      "weight": 0.33
    },
    {
      "name": "<criterion name>",
      "description": "<evaluation description>",
      "weight": 0.34
    },
    {
      "name": "<criterion name>",
      "description": "<evaluation description>",
      "weight": 0.33
    }
  ]
}

Category definitions:
- Argument: The writer stakes a specific, arguable claim on a topic they actually have opinions about — then defends it and acknowledges the strongest objection in one piece.
- Hot Take: One thing the writer believes that thoughtful people would push back on — written to persuade a skeptic, not just to vent.
- Pattern: Something the writer keeps noticing in culture, work, relationships, or technology that others seem to miss — name the pattern, explain what it reveals.
- Essay Lede: Write the opening paragraph of a piece they actually want to write — hook the reader, establish the tension, leave it unresolved. The output IS the lede, not a description of one.
- Nut Graf: Write the single paragraph that explains why an idea matters right now — the "here's what this is really about" paragraph that anchors an essay.
- Counter: Write the strongest possible case against something the writer currently believes — honestly, not as a straw man.

Rules:
- All criteria weights must sum to 1.0. Use exactly 3 criteria for every prompt, always following this pattern:
  1. Takes a position — did the writer commit to any discernible point of view, stance, or claim? Even tentative or half-formed counts.
  2. Grounds it somehow — did the writer use at least one specific detail, example, observation, or moment? Anything concrete, not purely abstract.
  3. Stays on topic — did the writer mostly address what the prompt asked? Give credit for partial focus.
- These criteria are intentionally minimal. The bar is: did the writer engage with the prompt at all? A rough, imperfect attempt fully clears all three. Do NOT write criteria about quality of argument, persuasiveness, or publication-readiness. Do NOT write criteria that a genuine attempt could fail.
- Topics should be specific and real: technology, media, work culture, money, institutions, relationships, parenting, cities, habits, attention, status, ambition — not abstract or vague
- Every prompt should feel like a real Substack idea — something someone would actually read and forward
- Do NOT generate prompts about childhood memories, physical spaces, sensory details, or purely descriptive exercises
- Make the prompts feel slightly dangerous — like the writer has to commit to something`;

export async function POST(req: NextRequest) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return NextResponse.json({ error: "Missing Cloudflare credentials" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const requestedCategory: string | undefined = body.category;
  const category = requestedCategory ?? CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  const userMsg = `Generate a Substack/essay writing drill prompt in the category: ${category}. Make it specific and a little uncomfortable — avoid the obvious angle. The writer should have to commit to a real position.`;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userMsg },
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: `Cloudflare AI error: ${err}` }, { status: 500 });
  }

  const data = await response.json();
  const result = data?.result;

  let parsed: GeneratedPrompt;
  try {
    const raw = typeof result?.response === "object"
      ? result.response
      : JSON.parse(
          (typeof result?.response === "string" ? result.response : JSON.stringify(result))
            .replace(/^```(?:json)?\n?/, "")
            .replace(/\n?```$/, "")
            .trim()
        );
    parsed = raw as GeneratedPrompt;
  } catch {
    return NextResponse.json(
      { error: `Failed to parse AI response: ${JSON.stringify(data).slice(0, 200)}` },
      { status: 500 }
    );
  }

  return NextResponse.json(parsed);
}
