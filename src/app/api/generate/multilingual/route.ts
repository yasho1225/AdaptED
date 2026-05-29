import { NextResponse } from "next/server";
import { generateMultilingual } from "@/lib/generation/service";
import { parseMultilingualBody } from "@/lib/generation/validate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseMultilingualBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await generateMultilingual(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[generate/multilingual]", error);
    return NextResponse.json(
      { error: "Couldn't adapt content. Please try again." },
      { status: 500 },
    );
  }
}
