import { NextResponse } from "next/server";
import { sanitizeProfile } from "@/lib/adapt/profile";
import { adaptAssignment } from "@/lib/adapt/service";
import { rateLimited } from "@/lib/rate-limit";

export const maxDuration = 60;

const MAX_CHARS = 12_000;

export async function POST(request: Request) {
  if (rateLimited(request)) {
    return NextResponse.json({ error: "Too many tries at once. Please wait a minute and try again." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { source, profile: rawProfile } = (body ?? {}) as { source?: unknown; profile?: unknown };

  if (typeof source !== "string" || !source.trim()) {
    return NextResponse.json({ error: "Please add an assignment first." }, { status: 400 });
  }
  if (source.length > MAX_CHARS) {
    return NextResponse.json({ error: `That assignment is too long (the limit is ${MAX_CHARS.toLocaleString()} characters). Try one part at a time.` }, { status: 413 });
  }
  const profile = sanitizeProfile(rawProfile);
  if (!profile) {
    return NextResponse.json({ error: "Please pick at least one thing the student needs." }, { status: 400 });
  }

  try {
    const result = await adaptAssignment(source, profile);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[adapt]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
