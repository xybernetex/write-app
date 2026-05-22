import { NextRequest, NextResponse } from "next/server";
import { getTrack } from "@/lib/curriculum";
import type { Criterion } from "@/lib/cloudflare-ai";

export type GeneratedTrackPrompt = {
  title: string;
  prompt: string;
  wordCountMin: number;
  wordCountMax: number;
  criteria: Criterion[];
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { trackId, avoidTopics } = body as { trackId: string; avoidTopics?: string[] };

  const track = getTrack(trackId);
  if (!track) return NextResponse.json({ error: "Track not found" }, { status: 404 });

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    return NextResponse.json({ error: "Missing Cloudflare credentials" }, { status: 500 });
  }

  // Pull the core skills from first 3 exercises (keep prompt size reasonable)
  const skillSummary = track.exercises
    .slice(0, 3)
    .map((e) => `- ${e.title}: ${e.lesson.slice(0, 120)}`)
    .join("\n");

  const SYSTEM = `You are a writing coach creating a new practice drill for the track: "${track.title}".

Track description: ${track.description}

Core skills this track teaches:
${skillSummary}

Generate a FRESH practice prompt that drills the same craft skill but with entirely different content and scenario. The student practices the same techniques, applied to a new situation.

Respond with ONLY a valid JSON object — no markdown, no explanation:
{
  "title": "<5-7 words describing this specific exercise>",
  "prompt": "<2-4 sentences. Specific enough to be actionable. Tells the writer exactly what to write. Include the word count at the end.>",
  "wordCountMin": <integer, 20–250 based on exercise complexity>,
  "wordCountMax": <integer, must be at least 40% higher than wordCountMin>,
  "criteria": [
    {
      "name": "<criterion name, 3-6 words>",
      "description": "<one sentence: what to look for when evaluating>",
      "weight": <number>
    }
  ]
}

Rules:
- 2–3 criteria only, weights summing to exactly 1.0
- Criteria must mirror the core craft skills of this specific track
- Prompts must be completable without research or external knowledge
- Vary the subject matter: avoid generic topics, find specific and unexpected angles
- Word count ranges should match the exercise complexity (short drills: 20–80 words; medium: 80–200 words; longer: 150–300 words)`;

  const avoidNote = avoidTopics?.length
    ? `\n\nTopics/angles already practiced (avoid repeating): ${avoidTopics.join(", ")}`
    : "";

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
          {
            role: "user",
            content: `Generate one fresh practice prompt for "${track.title}". Be creative and specific — find an unexpected angle.${avoidNote}`,
          },
        ],
        max_tokens: 800,
        temperature: 0.9,
        stream: false,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: `Cloudflare AI error: ${err}` }, { status: 500 });
  }

  const data = await response.json();
  const result = data?.result;

  let parsed: GeneratedTrackPrompt;
  try {
    const raw =
      typeof result?.response === "object"
        ? result.response
        : JSON.parse(
            (typeof result?.response === "string"
              ? result.response
              : JSON.stringify(result)
            )
              .replace(/^```(?:json)?\n?/, "")
              .replace(/\n?```$/, "")
              .match(/\{[\s\S]*\}/)?.[0] ?? "{}"
          );
    parsed = raw as GeneratedTrackPrompt;
    if (!parsed.title || !parsed.prompt || !parsed.criteria) {
      throw new Error("Missing required fields");
    }
  } catch {
    return NextResponse.json(
      { error: `Failed to parse AI response: ${JSON.stringify(data).slice(0, 200)}` },
      { status: 500 }
    );
  }

  return NextResponse.json(parsed);
}
