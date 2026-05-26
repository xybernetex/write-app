export type CriterionResult = {
  name: string;
  passed: boolean;
  score: number; // 0–1
  feedback: string;
};

export type FeedbackResult = {
  overallScore: number; // 0–100
  passed: boolean;
  criteriaResults: CriterionResult[];
  coachFeedback: string;
};

export type Criterion = {
  name: string;
  description: string;
  weight: number; // 0–1, sum of all weights should equal 1
};

export type FeedbackTone = "coach" | "editor" | "brutal" | "drill";

const TONE_CONFIG: Record<FeedbackTone, { persona: string; feedbackInstruction: string }> = {
  drill: {
    persona: "You are a warm writing coach. This was a warm-up rep — the writer just completed a timed drill, not a polished draft. Score honestly but generously.",
    feedbackInstruction: "2 sentences: name one specific thing that landed, then give one small, concrete thing to try next time. Warm, brief, forward-looking — they're building a habit, not submitting for publication.",
  },
  coach: {
    persona: "You are an encouraging writing coach who genuinely wants this writer to improve and succeed. Score criteria honestly — only the prose reflects your voice.",
    feedbackInstruction: "2 sentences: lead with something specific that worked, then name the one most important thing to work on next as an opportunity, not a failure.",
  },
  editor: {
    persona: "You are a professional editor giving honest, craft-focused feedback. Score criteria honestly — only the prose reflects your voice.",
    feedbackInstruction: "2 sentences: name what worked and what didn't with equal specificity. No cheerleading, no cruelty.",
  },
  brutal: {
    persona: "You are a senior editor at a major publication with no patience for weak writing. Score criteria honestly — only the prose reflects your voice.",
    feedbackInstruction: "2 sentences of unvarnished craft assessment. Be direct. If it doesn't work, say exactly why.",
  },
};

const CF_BASE = "https://api.cloudflare.com/client/v4/accounts";

function buildMessages(
  exercisePrompt: string,
  submission: string,
  criteria: Criterion[],
  tone: FeedbackTone = "coach"
): { role: string; content: string }[] {
  const criteriaList = criteria
    .map((c, i) => `${i + 1}. ${c.name}: ${c.description}`)
    .join("\n");

  const { persona, feedbackInstruction } = TONE_CONFIG[tone];

  const system = `${persona} Respond ONLY with a valid JSON object — no markdown, no extra text.`;

  const user = `Evaluate this writing exercise submission.

EXERCISE PROMPT:
${exercisePrompt}

STUDENT SUBMISSION:
${submission}

EVALUATION CRITERIA:
${criteriaList}

PASS/FAIL RULES — apply these strictly:
- Set "passed": true when the submission makes any genuine attempt at the criterion, even if the execution is rough, imperfect, or could be better. Partial counts. Clunky counts. Uncertain counts.
- Set "passed": false ONLY when the criterion is completely absent — ignored entirely, or the submission does the opposite of what is asked.
- "score" (0.0–1.0) reflects execution quality independently of pass/fail. A passing criterion can still score 0.5 if there is obvious room to improve.
- This is deliberate practice, not publication review. If the writer made a real attempt, it passes. Grade for honest engagement, not mastery.

Return this exact JSON structure:
{"criteriaResults":[{"name":"<exact criterion name>","passed":<true|false>,"score":<0.0-1.0>,"feedback":"<one sentence>"}],"coachFeedback":"<${feedbackInstruction}>"}`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

export async function evaluateSubmission(
  exercisePrompt: string,
  submission: string,
  criteria: Criterion[],
  tone: FeedbackTone = "coach"
): Promise<FeedbackResult> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN");
  }

  const messages = buildMessages(exercisePrompt, submission, criteria, tone);

  const response = await fetch(
    `${CF_BASE}/${accountId}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        max_tokens: 1024,
        stream: false,
        temperature: 0.3,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Cloudflare AI error ${response.status}: ${err}`);
  }

  const data = await response.json();

  const result = data?.result;
  let parsed: { criteriaResults: CriterionResult[]; coachFeedback: string };

  if (result?.response && typeof result.response === "object") {
    parsed = result.response as typeof parsed;
  } else {
    let raw: string;
    if (typeof result === "string") {
      raw = result;
    } else if (typeof result?.response === "string") {
      raw = result.response;
    } else if (Array.isArray(result?.choices) && typeof result.choices[0]?.message?.content === "string") {
      raw = result.choices[0].message.content;
    } else {
      throw new Error(`Unexpected AI response shape: ${JSON.stringify(data).slice(0, 300)}`);
    }
    try {
      const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      // Also try extracting just the {...} block in case the model added extra text
      const jsonBlock = clean.startsWith("{") ? clean : (clean.match(/\{[\s\S]*\}/) ?? [""])[0];
      parsed = JSON.parse(jsonBlock || clean);
    } catch {
      throw new Error(`AI returned non-JSON (${raw.length} chars): ${raw.slice(0, 500)}`);
    }
  }

  const overallScore = parsed.criteriaResults.reduce((acc, r, i) => {
    const weight = criteria[i]?.weight ?? 1 / criteria.length;
    return acc + r.score * weight * 100;
  }, 0);

  return {
    overallScore: Math.round(overallScore),
    passed: overallScore >= 70,
    criteriaResults: parsed.criteriaResults,
    coachFeedback: parsed.coachFeedback,
  };
}

export type ExerciseHint = {
  text: string;
  explanation: string;
};

export async function generateExerciseHint(
  exercisePrompt: string,
  criteria: Criterion[],
  genre?: string
): Promise<ExerciseHint> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) throw new Error("Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN");

  const criteriaList = criteria.map((c, i) => `${i + 1}. ${c.name}: ${c.description}`).join("\n");

  const genreNote = genre === "nonfiction"
    ? "\n\nIMPORTANT: This is a NONFICTION writing exercise. Your example must read like published journalism or a serious nonfiction book — not fiction. No invented melodramatic scenes. Use the grounded, specific style of The Atlantic, The New Yorker, or quality long-form reporting. Real-feeling scenes with named people and concrete details, but the voice is journalistic."
    : genre === "fiction"
    ? "\n\nThis is a fiction writing exercise. Write in a literary fiction style."
    : "";

  const messages = [
    {
      role: "system",
      content: `You are a writing teacher creating example responses for students. Respond ONLY with valid JSON — no markdown, no extra text.${genreNote}`,
    },
    {
      role: "user",
      content: `A student is stuck on this writing exercise. Write ONE strong example response that scores well on all criteria. Then explain in 2 sentences exactly why it works, referencing the criteria by name.

EXERCISE PROMPT:
${exercisePrompt}

CRITERIA:
${criteriaList}

Return this JSON structure:
{"text":"<example response>","explanation":"<why it works>"}`,
    },
  ];

  const response = await fetch(
    `${CF_BASE}/${accountId}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messages, max_tokens: 1024, stream: false, temperature: 0.7 }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Cloudflare AI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const result = data?.result;

  if (result?.response && typeof result.response === "object") {
    return result.response as ExerciseHint;
  }

  let raw: string;
  if (typeof result?.response === "string") raw = result.response;
  else if (typeof result === "string") raw = result;
  else throw new Error(`Unexpected hint response: ${JSON.stringify(data).slice(0, 200)}`);

  const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  const jsonBlock = clean.startsWith("{") ? clean : (clean.match(/\{[\s\S]*\}/) ?? [""])[0];
  try {
    return JSON.parse(jsonBlock || clean) as ExerciseHint;
  } catch {
    throw new Error(`Hint non-JSON (${raw.length} chars): ${raw.slice(0, 300)}`);
  }
}
