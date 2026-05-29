import { NextResponse } from "next/server";
import { generateAssignment } from "@/lib/generation/service";
import { parseAssignmentBody } from "@/lib/generation/validate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseAssignmentBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await generateAssignment(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[generate/assignment]", error);
    return NextResponse.json(
      { error: "Couldn't generate assignment. Please try again." },
      { status: 500 },
    );
  }
}
