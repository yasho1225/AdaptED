import { NextResponse } from "next/server";
import { sanitizeProfile } from "@/lib/adapt/profile";
import { adaptAssignment } from "@/lib/adapt/service";

export const maxDuration = 60;

const MAX_CHARS = 12_000;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests — please wait a minute and try again." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { source, profile: rawProfile } = (body ?? {}) as { source?: unknown; profile?: unknown };

  if (typeof source !== "string" || !source.trim()) {
    return NextResponse.json({ error: "Add an assignment to adapt." }, { status: 400 });
  }
  if (source.length > MAX_CHARS) {
    return NextResponse.json({ error: `That assignment is too long (max ${MAX_CHARS.toLocaleString()} characters). Try one section at a time.` }, { status: 413 });
  }
  const profile = sanitizeProfile(rawProfile);
  if (!profile) {
    return NextResponse.json({ error: "Choose at least one learning need." }, { status: 400 });
  }

  try {
    const result = await adaptAssignment(source, profile);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[adapt]", error);
    return NextResponse.json({ error: "Something went wrong while adapting. Please try again." }, { status: 500 });
  }
}
