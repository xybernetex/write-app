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

/** Wide topic pool — one is sampled per generation to force variety */
const TOPIC_SEEDS = [
  // Work & careers
  "remote work and the performance of presence",
  "the myth of meritocracy in hiring",
  "how meetings replaced actual thinking",
  "equity vs. salary and who wins that bet",
  "the hustle-era hangover",
  "why managers protect bad systems instead of fixing them",
  "credentialism vs. actual competence",
  "the open-office as control mechanism",
  "why feedback culture produces worse work",
  "the résumé as fiction",
  // Technology & media
  "algorithmic feeds and how they form opinions",
  "subscription fatigue and the attention tax",
  "AI replacing jobs people actually liked doing",
  "how smartphones colonized boredom",
  "the death of the homepage and what it cost us",
  "platform dependency and the illusion of creative control",
  "why tech predictions keep failing",
  "the notification economy",
  "social media and the collapse of private thought",
  "the newsletter bubble",
  // Money & class
  "why personal finance advice doesn't scale past a certain income",
  "rent vs. buy as a class-reveal question",
  "the cost of keeping your options open",
  "wealth and the illusion of safety",
  "the gig economy's broken promise",
  "tipping culture as a symptom",
  "status signaling through consumption",
  "financial advice as moral instruction",
  // Culture & society
  "why satire stopped working",
  "the collapse of expert authority",
  "irony as a defense mechanism against commitment",
  "status games in progressive spaces",
  "the professionalization of every hobby",
  "how cities stopped being affordable or interesting",
  "the suburbs as a failed experiment",
  "moral panic cycles and who benefits",
  "the aestheticization of politics",
  "why nostalgia is a policy failure",
  // Relationships & parenting
  "friendship decline in adulthood and why we don't talk about it",
  "parenting as optimization project",
  "the loneliness economy",
  "why we're bad at asking for help",
  "the cost of keeping all relationships low-stakes",
  "relationship advice as cultural artifact",
  "how social media changed breakups",
  "the way adults stopped making new friends",
  // Institutions & power
  "why institutions protect themselves before serving anyone",
  "the bureaucratization of nonprofits",
  "how journalism broke its own business model",
  "universities selling prestige instead of education",
  "why government technology keeps failing",
  "the legal system as barrier to justice",
  "the HR department as institutional liability shield",
  "accreditation as cartel behavior",
  // Ideas & epistemics
  "why smart people believe obviously wrong things",
  "the limits of data-driven decision making",
  "how framing determines conclusions before argument starts",
  "motivated reasoning in everyday life",
  "why consensus lags behind evidence",
  "the problem with 'best practices'",
  "contrarianism as a brand strategy",
  "the difference between being right and being persuasive",
  // Health & wellness
  "the medicalization of normal human variation",
  "why wellness culture makes people more anxious",
  "sleep optimization as productivity theater",
  "the diet industry's permanent failure as a feature not a bug",
  "self-care as consumer category",
  "the gym selfie and motivation theater",
  // Attention & habits
  "why productivity culture backfires at scale",
  "the attention-restoration failure",
  "reading less while knowing more",
  "morning routines as class performance",
  "dopamine culture and delayed gratification",
  "the second-phone problem",
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
- Every prompt should feel like a real Substack idea — something someone would actually read and forward
- Do NOT generate prompts about childhood memories, physical spaces, sensory details, or purely descriptive exercises
- Make the prompts feel slightly dangerous — like the writer has to commit to something
- Take an unexpected angle — not the most obvious take on the topic seed provided`;

export async function POST(req: NextRequest) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return NextResponse.json({ error: "Missing Cloudflare credentials" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const requestedCategory: string | undefined = body.category;
  const category = requestedCategory ?? CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const topicSeed = TOPIC_SEEDS[Math.floor(Math.random() * TOPIC_SEEDS.length)];

  const userMsg = `Generate a daily writing drill prompt.
Category: ${category}
Topic seed: ${topicSeed}

Take an angle on this topic that isn't the first thing that comes to mind. The writer should have to commit to a real, arguable position using only their own experience and thinking. No research required. Should feel like a real Substack post someone would actually write and send.`;

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
        temperature: 0.9,
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
