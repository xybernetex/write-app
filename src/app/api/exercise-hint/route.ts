import { NextRequest, NextResponse } from "next/server";
import { getExercise, getTrack } from "@/lib/curriculum";
import { generateExerciseHint, type Criterion } from "@/lib/cloudflare-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      trackId: string;
      exerciseId: string;
      generatedPrompt?: string;
      generatedCriteria?: Criterion[];
    };

    let prompt: string;
    let criteria: Criterion[];
    const genre = getTrack(body.trackId)?.genre;

    if (body.generatedPrompt && body.generatedCriteria) {
      prompt = body.generatedPrompt;
      criteria = body.generatedCriteria;
    } else {
      const exercise = getExercise(body.trackId, body.exerciseId);
      if (!exercise) return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
      prompt = exercise.prompt;
      criteria = exercise.criteria;
    }

    const hint = await generateExerciseHint(prompt, criteria, genre);
    return NextResponse.json(hint);
  } catch (err) {
    console.error("[exercise-hint]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
