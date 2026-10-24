import { NextResponse } from "next/server";
import { sanitizeCreateRequest } from "@/lib/adapt/create";
import { TopicNotSuitableError, createAssignment } from "@/lib/adapt/create-server";
import { rateLimited } from "@/lib/rate-limit";

export const maxDuration = 60;

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
  const req = sanitizeCreateRequest(body);
  if (!req) return NextResponse.json({ error: "Please type a topic first." }, { status: 400 });

  try {
    return NextResponse.json(await createAssignment(req));
  } catch (error) {
    if (error instanceof TopicNotSuitableError) {
      return NextResponse.json({ error: "That topic doesn't look like a school assignment. Try a different topic." }, { status: 422 });
    }
    console.error("[create]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
