// Usage: npm run build && npx tsx scripts/e2e-ai-mock.mts
// Tests AdaptED's AI path end to end without a real key: a local stand-in for Gemini's REST API
// answers the requests the real @google/genai client sends, and `next start` points at it
// (GEMINI_BASE_URL). Checks the routes and the browser flows under four kinds of answer:
//   ok             the AI answers well: create, adapt, translate are "Made just now by AI"
//   bad-key        Google rejects the key: the app falls back, and /api/status shows Google's message
//   slow           the AI takes 70 s: every request still answers inside Vercel's 60 s limit
//   drop-question  the AI leaves a question out: AdaptED puts it back
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { chromium } from "playwright";
import { SCIENCE } from "../src/lib/adapt/curated/science";
import { SAMPLES } from "../src/lib/adapt/samples";

const MOCK_PORT = 4010;
const APP_PORT = 3101;
const APP = `http://127.0.0.1:${APP_PORT}`;
let mode: "ok" | "bad-key" | "slow" | "drop-question" = "ok";
const seen: { kind: string; thinking?: unknown; schema: boolean }[] = [];

const created = {
  title: "The Water Cycle",
  directions: "Read the passage, then answer the questions in complete sentences.",
  reading: ["Water moves between the land, the oceans, and the sky. The sun warms water so it evaporates into water vapor.", "The vapor cools and condenses into clouds. When the drops get heavy, they fall as precipitation."],
  questions: [
    { text: "What makes water evaporate?", choices: [] },
    { text: "What forms when water vapor cools?", choices: ["Clouds", "Rocks", "Soil", "Sand"] },
    { text: "Explain how rain is part of the water cycle.", choices: [] },
  ],
};

/** The science sample's pre-made dyslexia version, with question 2 left out. */
function withoutQuestion2() {
  const a = structuredClone(SCIENCE.dyslexia);
  for (const s of a.sections) s.blocks = s.blocks.filter((b) => !(b.type === "question" && b.number === "2"));
  return a;
}

const mock = createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    const kind = body.includes("health check") ? "ping" : body.includes("You write original classroom assignments") ? "create" : "adapt";
    const cfg = JSON.parse(body || "{}").generationConfig ?? {};
    seen.push({ kind, thinking: cfg.thinkingConfig, schema: Boolean(cfg.responseJsonSchema) });
    const send = (status: number, payload: unknown) => {
      if (res.writableEnded || res.destroyed) return;
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(payload));
    };
    if (mode === "bad-key") return send(400, { error: { code: 400, message: "API key not valid. Please pass a valid API key.", status: "INVALID_ARGUMENT" } });
    const adaptCalls = seen.filter((s) => s.kind === "adapt").length;
    const data = kind === "ping" ? { ok: true } : kind === "create" ? created : mode === "drop-question" ? withoutQuestion2() : SCIENCE.dyslexia;
    const answer = { candidates: [{ content: { role: "model", parts: [{ text: JSON.stringify(data) }] }, finishReason: "STOP", index: 0 }] };
    // In drop-question mode the corrective second call is slow, so the code must restore the question itself.
    const delay = mode === "slow" ? 70_000 : mode === "drop-question" && adaptCalls > 1 ? 70_000 : 300;
    setTimeout(() => send(200, answer), delay);
  });
});
await new Promise<void>((r) => mock.listen(MOCK_PORT, "127.0.0.1", r));

const app = spawn("npx", ["next", "start", "-p", String(APP_PORT)], {
  env: { ...process.env, GEMINI_API_KEY: "test-key-not-real", GEMINI_BASE_URL: `http://127.0.0.1:${MOCK_PORT}` },
  stdio: "ignore",
});
for (let i = 0; i < 60; i++) {
  const up = await fetch(APP).then((r) => r.ok).catch(() => false);
  if (up) break;
  await new Promise((r) => setTimeout(r, 500));
}

const results: string[] = [];
const check = (name: string, ok: boolean, detail = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
let ip = 0;
const post = async (path: string, body: unknown) => {
  const t = Date.now();
  const res = await fetch(`${APP}${path}`, { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": `10.8.0.${++ip}` }, body: JSON.stringify(body) });
  return { status: res.status, data: await res.json(), seconds: (Date.now() - t) / 1000 };
};
const status = async (q = "") => (await fetch(`${APP}/api/status${q}`, { headers: { "x-forwarded-for": `10.8.1.${++ip}` } })).json();
const science = SAMPLES[0].text;
const spanish = { needs: ["dyslexia"], supports: ["vocab-preview", "chunked-text", "read-aloud", "reduced-writing"], expectations: "accommodate", language: "spanish" };
const createReq = { topic: "the water cycle", grade: "5", include: "reading", questions: 3, level: "on-level" };

try {
  // ok
  mode = "ok";
  const s = await status();
  check("ok · /api/status reports AI working", s.works === true && /GEMINI_API_KEY/.test(s.key), JSON.stringify(s));
  const tr = await post("/api/adapt", { source: science, profile: spanish });
  check("ok · translate to Spanish is made by AI", tr.data.source === "ai" && tr.data.profile?.language === "spanish", `${tr.data.source}, ${tr.seconds}s`);
  const cr = await post("/api/create", createReq);
  check("ok · create is made by AI", cr.data.source === "ai" && /Water Cycle/.test(cr.data.text), `${cr.data.source}: ${cr.data.title}`);
  const sent = seen.find((x) => x.kind === "adapt");
  check("ok · requests carry the JSON schema and a thinking budget", !!sent?.schema && JSON.stringify(sent?.thinking).includes("thinkingBudget"), JSON.stringify(sent));

  // Browser: create with AI, then translate, as a teacher would.
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(() => localStorage.setItem("adapted-calm", "true"));
  const errors: string[] = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(APP, { waitUntil: "networkidle" });
  const studio = p.locator("#studio");
  await studio.getByRole("tab", { name: "Create one with AI" }).click();
  await studio.getByLabel("What should it be about?").fill("the water cycle");
  await studio.getByRole("button", { name: "Create assignment" }).click();
  await studio.locator("#source-status").getByText(/Created just now by AI/).waitFor({ timeout: 30000 });
  await studio.getByText("Made just now by AI").first().waitFor({ timeout: 30000 });
  check("ok · browser: Create one with AI fills the box and adapts it with AI", true, (await studio.locator("#source-status").innerText()).slice(0, 60));
  await studio.getByRole("combobox", { name: /Language:/ }).selectOption("spanish");
  await p.waitForFunction(() => document.querySelector('#studio article[lang="es"]') && document.body.innerText.includes("Made just now by AI"), null, { timeout: 30000 });
  check("ok · browser: switching to Spanish gives an AI version marked Spanish", true);
  check("ok · browser: no page errors", errors.length === 0, errors.join(" | "));
  await b.close();

  // bad-key
  mode = "bad-key";
  const sb = await status();
  check("bad-key · /api/status shows Google's message", sb.works === false && /API key not valid/.test(sb.message ?? ""), sb.message);
  const ab = await post("/api/adapt", { source: science, profile: spanish });
  check("bad-key · adapt falls back with a reason", ab.data.source === "offline" && ab.data.fallbackReason === "api_error", `${ab.data.source} (${ab.data.fallbackReason})`);
  const tb = await status("?check=translate");
  check("bad-key · /api/status?check=translate explains why", tb.works === false && /API key not valid/.test(tb.message ?? ""), tb.madeBy);

  // drop-question
  mode = "drop-question";
  seen.length = 0;
  const dq = await post("/api/adapt", { source: science, profile: { ...spanish, language: "english", supports: ["chunked-text"] } });
  const f = dq.data.fidelity;
  check("drop-question · the missing question is put back, inside the time limit", dq.data.source === "ai" && f.matchedQuestions === f.originalQuestions && dq.seconds < 58, `${f.matchedQuestions}/${f.originalQuestions}, ${dq.seconds}s`);

  // slow
  mode = "slow";
  const as = await post("/api/adapt", { source: science, profile: spanish });
  check("slow · adapt answers inside 60 s, labelled 'took too long'", as.data.source === "offline" && as.data.fallbackReason === "timeout" && as.seconds < 58, `${as.data.fallbackReason}, ${as.seconds}s`);
  const cs = await post("/api/create", createReq);
  check("slow · create answers inside 60 s with a starter outline", cs.data.source === "outline" && cs.data.fallbackReason === "timeout" && cs.seconds < 58, `${cs.data.fallbackReason}, ${cs.seconds}s`);
} finally {
  app.kill();
  mock.close();
}
console.log(results.join("\n"));
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
