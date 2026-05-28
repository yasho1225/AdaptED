import { NextResponse } from "next/server";
import type { AccessibilityMode } from "@/lib/types";
import { transformContent } from "@/lib/transform-service";

const MODES: AccessibilityMode[] = ["dyslexia", "adhd", "apd", "autism"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = typeof body.input === "string" ? body.input : "";
    const mode = body.mode as AccessibilityMode;

    if (!MODES.includes(mode)) {
      return NextResponse.json({ error: "Invalid accessibility mode." }, { status: 400 });
    }

    const trimmed = input.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Content is required." }, { status: 400 });
    }

    if (trimmed.length > 8000) {
      return NextResponse.json(
        { error: "Content is too long. Please use a shorter passage for the demo." },
        { status: 400 },
      );
    }

    const result = await transformContent(trimmed, mode);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[transform]", error);
    return NextResponse.json(
      { error: "Couldn't transform content. Please try again." },
      { status: 500 },
    );
  }
}
