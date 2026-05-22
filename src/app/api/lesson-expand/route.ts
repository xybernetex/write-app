import { NextRequest, NextResponse } from "next/server";
import { getExercise, getTrack } from "@/lib/curriculum";

const SYSTEM = `You are a master writing coach and educator. Generate a detailed, practical lesson on a specific writing skill. Write for someone who genuinely wants to improve — not theory, not fluff. Be direct. Be specific. Use examples constantly.

Your lesson must follow this exact structure:

## The Concept
2–3 paragraphs explaining the skill clearly. What is it, why does it matter, when do writers reach for it?

## What It Looks Like Wrong
One concrete bad example (invented or based on common mistakes), followed by 2–3 sentences explaining precisely what fails and why.

## What It Looks Like Right
One concrete good example that addresses the same situation as the bad example. 2–3 sentences explaining what works and why.

## In Published Writing
One real, specific example from published writing. For nonfiction tracks, draw from journalism, essays, or nonfiction books (The Atlantic, New Yorker, ProPublica, or book-length nonfiction). For fiction tracks, draw from literary fiction. Name the author and work. Analyze what makes it effective in 2–3 sentences.

## The Mental Model
One sentence. The rule the student can hold in their head while writing.

## For This Exercise
2–3 sentences of specific advice for the exercise they're about to attempt. What should they focus on? What's the trap to avoid?

Format with markdown headers. Total length: 450–650 words. Write with authority and warmth — you are a coach who has seen thousands of writers make the same mistakes and knows exactly where they go wrong.`;

export async function POST(req: NextRequest) {
  const { trackId, exerciseId } = await req.json();

  const track = getTrack(trackId);
  const exercise = getExercise(trackId, exerciseId);
  if (!track || !exercise) {
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    return NextResponse.json({ error: "Missing Cloudflare credentials" }, { status: 500 });
  }

  const genreInstruction = track.genre === "nonfiction"
    ? "IMPORTANT: This is a NONFICTION track. Every example you write must reflect journalism, essays, or serious nonfiction — not fiction. No invented melodramatic scenes or literary prose. Examples should feel like they belong in The Atlantic, The New Yorker, or a serious nonfiction book. The bad example and good example must both be in a journalistic register."
    : track.genre === "fiction"
    ? "This is a fiction track. Examples should be drawn from literary fiction craft."
    : "";

  const userMsg = `Generate the full lesson for this writing exercise.

Track: "${track.title}" (${track.genre}, ${track.difficulty})
Exercise: "${exercise.title}"
Short lesson summary: ${exercise.lesson}
Exercise prompt: ${exercise.prompt}
Scoring criteria: ${exercise.criteria.map(c => `${c.name}: ${c.description}`).join("; ")}

${genreInstruction}

Expand the short lesson into a full, deep lesson using the required structure.`;

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
        max_tokens: 1200,
        temperature: 0.7,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: `AI error: ${err}` }, { status: 500 });
  }

  const data = await response.json();
  const result = data?.result;
  const content = typeof result?.response === "string"
    ? result.response
    : typeof result?.response === "object"
      ? JSON.stringify(result.response)
      : "";

  if (!content) {
    return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
  }

  return NextResponse.json({ content });
}
