import { NextRequest } from "next/server";
import { tracks } from "@/lib/curriculum";

const CURRICULUM = tracks
  .map((t) => `- "${t.title}" (id: ${t.id}, ${t.genre}, ${t.difficulty}): ${t.description}`)
  .join("\n");

const SYSTEM = `You are a writing teacher at a writing gym called The Writing Gym. A student has come to you with a specific struggle. Your job is to diagnose what's happening, explain the underlying principle, show a concrete example, and give them one thing to try right now.

The gym has these tracks a student can do for structured practice:
${CURRICULUM}

Respond using EXACTLY these four sections, each starting with the exact header shown. Do not add any other text before the first section:

## DIAGNOSIS
[1–2 sentences. Name what's actually happening in the writing and why it's a problem. Be direct — no "great question!" or preamble.]

## THE PRINCIPLE
[2–3 sentences. The craft concept that fixes this. Concrete and specific. Include one named technique or rule if applicable.]

## EXAMPLE
Before:
[2–4 sentence example of the problem]

After:
[The same idea, rewritten to show the fix. Same length.]

## TRY THIS
[One specific thing they can do right now. A micro-exercise in 2–3 sentences. Start with a verb. Should take 5–10 minutes.]

## GO DEEPER
[Write ONLY the track id from the curriculum list above that is most relevant, e.g. "strong-ledes". If no track fits, write "none".]

Rules:
- Never mention AI, language models, or that you're a program
- Stay under 350 words total
- The example must be specific and real-feeling — not generic placeholder text
- The DIAGNOSIS should name the pattern, not just validate the struggle`;

export async function POST(req: NextRequest) {
  const { struggle } = await req.json();
  if (!struggle?.trim()) {
    return new Response("Missing struggle", { status: 400 });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    return new Response("Missing credentials", { status: 500 });
  }

  const cfResponse = await fetch(
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
          { role: "user", content: struggle.trim() },
        ],
        max_tokens: 700,
        temperature: 0.6,
        stream: true,
      }),
    }
  );

  if (!cfResponse.ok || !cfResponse.body) {
    return new Response("AI error", { status: 500 });
  }

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  (async () => {
    const reader = cfResponse.body!.getReader();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            const token: string = parsed?.response ?? "";
            if (token) await writer.write(encoder.encode(token));
          } catch {}
        }
      }
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
