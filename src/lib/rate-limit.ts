import "server-only";

const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

/** Simple per-IP sliding window, shared by the AI routes (per server instance). */
export function rateLimited(request: Request, maxPerWindow = 12): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > maxPerWindow;
}
