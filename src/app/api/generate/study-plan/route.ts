import { NextResponse } from "next/server";
import { generateStudyPlan } from "@/lib/generation/service";
import { parseStudyPlanBody } from "@/lib/generation/validate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseStudyPlanBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await generateStudyPlan(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[generate/study-plan]", error);
    return NextResponse.json(
      { error: "Couldn't generate study plan. Please try again." },
      { status: 500 },
    );
  }
}
