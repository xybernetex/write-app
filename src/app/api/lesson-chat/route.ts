import { NextRequest } from "next/server";
import { getExercise, getTrack } from "@/lib/curriculum";

export async function POST(req: NextRequest) {
  const { messages, trackId, exerciseId } = await req.json();

  const track = getTrack(trackId);
  const exercise = getExercise(trackId, exerciseId);
  if (!track || !exercise) return new Response("Not found", { status: 404 });

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return new Response("Missing credentials", { status: 500 });

  const system = `You are a writing coach helping a student work through a specific lesson. Answer questions about craft, clarify concepts, give examples, and coach them before they attempt the exercise. Be direct, warm, and specific — always tie answers back to the lesson and exercise at hand.

Track: "${track.title}" (${track.genre}, ${track.difficulty})
Exercise: "${exercise.title}"
Lesson summary: ${exercise.lesson}
Exercise prompt: ${exercise.prompt}
Scoring criteria: ${exercise.criteria.map(c => `${c.name}: ${c.description}`).join("; ")}

Rules:
- Keep responses under 200 words unless the student explicitly asks for more
- Always give at least one concrete example when explaining a concept
- If the student shares a draft or attempt, give specific, actionable feedback tied to the criteria
- If they ask "is this right" or share writing, evaluate it honestly against the exercise criteria
- Never be vague — say the actual thing`;

  const cfMessages = [
    { role: "system", content: system },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const cfResponse = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: cfMessages,
        max_tokens: 600,
        temperature: 0.7,
        stream: true,
      }),
    }
  );

  if (!cfResponse.ok || !cfResponse.body) {
    return new Response("AI error", { status: 500 });
  }

  // Transform Cloudflare SSE stream → plain text stream
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
