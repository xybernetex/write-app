import { NextRequest } from "next/server";

const SYSTEM = `You are a writing teacher reading a student's draft. Give specific, honest craft feedback tied directly to their actual words. Quote their text. Be direct — not harsh, but not soft either. Writers need to know what's actually happening.

Respond with EXACTLY these four sections, starting with the exact headers shown. No preamble before the first section.

## WHAT'S WORKING
[1–2 genuine strengths. Quote words or phrases directly from the draft. No generic praise like "great voice" — name the specific thing and why it works.]

## THE MAIN ISSUE
[The single most important craft problem in this draft. Name the pattern clearly. 2–3 sentences. Be specific about what it costs the reader.]

## SPECIFIC MOMENTS
[Pick 3 sentences or phrases from the draft. For each, write one line of feedback. Format exactly like this — one per line:
"[exact quote from their draft]" — [what it does and why it matters]]

## ONE FIX
[The one thing they should do to this draft right now. Specific and actionable. Start with a verb. 2–3 sentences max.]

Rules:
- Quote directly from their text — exact words, in quotes
- Focus on craft: sentence-level writing, structure, voice, specificity, rhythm — not whether the topic is interesting
- If they tell you what they're trying to do, factor that in when assessing whether it's working
- Stay under 300 words total
- If the draft is genuinely strong, say so — don't manufacture problems`;

export async function POST(req: NextRequest) {
  const { draft, context } = await req.json();
  if (!draft?.trim()) {
    return new Response("Missing draft", { status: 400 });
  }

  const words = draft.trim().split(/\s+/).length;
  if (words > 1600) {
    return new Response("Draft too long (max 1,500 words)", { status: 400 });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    return new Response("Missing credentials", { status: 500 });
  }

  const userMessage = context?.trim()
    ? `My draft (what I'm trying to do: ${context.trim()}):\n\n${draft.trim()}`
    : `My draft:\n\n${draft.trim()}`;

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
          { role: "user", content: userMessage },
        ],
        max_tokens: 700,
        temperature: 0.5,
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
