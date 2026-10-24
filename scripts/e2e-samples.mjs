// Usage: node scripts/e2e-samples.mjs [baseUrl] — checks that the three samples work without AI.
// Run against `npm start` on :3100. With no GEMINI_API_KEY on the server this is exactly the no-AI case;
// with a key, part 1 still must not call the server, and parts 2–3 accept an AI result too.
//  1. Every sample × every need opens its pre-made version in the browser, with no request to the server.
//  2. A sample with settings outside the pre-made set (two needs, help changed, Spanish) still gets a full version.
//  3. The server's answer for each sample and a range of settings keeps every question and answer choice.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const SAMPLES = [
  ["Science", /^Science/],
  ["Math", /^Math/],
  ["English / History", /^English \/ History/],
];
const NEEDS = ["Dyslexia", "ADHD", "Auditory Processing", "Autism"];
const results = [];
const check = (name, ok, detail = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);

const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem("adapted-calm", "true"));
const p = await ctx.newPage();
const errors = [];
const calls = [];
p.on("pageerror", (e) => errors.push(e.message));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
p.on("request", (r) => r.url().includes("/api/adapt") && calls.push(r.url()));
await p.goto(base, { waitUntil: "networkidle" });
const studio = p.locator("#studio");
const card = (need) => studio.getByRole("button", { name: new RegExp(`^${need}`) }).first();
const keptText = () => studio.locator("dl > div", { hasText: "Questions kept" }).innerText().then((t) => t.replace(/\s+/g, " "));
const allKept = (t) => {
  const m = t.match(/(\d+) of (\d+)/);
  return !!m && m[1] === m[2] && m[2] !== "0";
};

/** Picks exactly one need on the student panel. */
async function onlyNeed(need) {
  if ((await card(need).getAttribute("aria-pressed")) !== "true") await card(need).click();
  for (const other of NEEDS.filter((n) => n !== need)) if ((await card(other).getAttribute("aria-pressed")) === "true") await card(other).click();
}
async function adapt() {
  await studio.getByRole("button", { name: /^Adapt for/ }).click();
  await p.waitForFunction(() => document.querySelector("#studio [aria-busy]")?.getAttribute("aria-busy") === "false" && document.body.innerText.includes("Here’s the new version"), null, { timeout: 45000 });
}

// 1. Pre-made: every sample × need, no server request. Also keeps each sample's text for part 3.
const sampleTexts = [];
for (const [label, name] of SAMPLES) {
  await studio.getByRole("button", { name }).click();
  sampleTexts.push([label, await p.locator("#assignment-text").inputValue()]);
  for (const need of NEEDS) {
    await onlyNeed(need);
    const before = calls.length;
    await adapt();
    const badge = await studio.getByText(/Pre-made example|Made without AI|Made just now by AI/).first().innerText();
    const kept = await keptText();
    const heading = await studio.locator(".adapted-pane article h1, .adapted-pane article h2, .adapted-pane article h3").first().innerText().catch(() => "");
    check(`${label} · ${need}: pre-made, no server call`, calls.length === before && /Pre-made/.test(badge) && allKept(kept) && heading.length > 0, `${kept.replace("Questions kept ", "")}; ${calls.length - before} server calls`);
  }
}

// 2. Outside the pre-made set: two needs, then Spanish. Must still produce a complete version.
await studio.getByRole("button", { name: /^Science/ }).click();
await onlyNeed("Dyslexia");
await card("ADHD").click();
let before = calls.length;
await adapt();
let badge = await studio.getByText(/Pre-made example|Made without AI|Made just now by AI/).first().innerText();
check("Science · Dyslexia + ADHD: complete version from the server", calls.length > before && allKept(await keptText()), badge);
await card("ADHD").click();
await studio.getByLabel("Language for the student").selectOption("spanish");
before = calls.length;
await adapt();
badge = await studio.getByText(/Pre-made example|Made without AI|Made just now by AI/).first().innerText();
const spanishNote = await studio.getByText(/Translating needs AI/).isVisible().catch(() => false);
const spanish = await studio.locator('article[lang="es"]').count();
check("Science · Spanish: translated, or says plainly it stayed in English", calls.length > before && allKept(await keptText()) && (spanish > 0 || spanishNote), spanish ? "Spanish version" : "English kept, with a note");
check("no page or console errors", errors.length === 0, errors.join(" | "));
await ctx.close();

// 3. The server, directly: each sample with settings the pre-made set doesn't cover.
await b.close();
const plain = { expectations: "accommodate", language: "english", notes: "" };
const PROFILES = [
  ["two needs", { ...plain, needs: ["dyslexia", "adhd"], supports: ["vocab-preview", "chunked-text", "task-chunks", "checklist"] }],
  ["all four needs", { ...plain, needs: ["dyslexia", "adhd", "apd", "autism"], supports: ["vocab-preview", "task-chunks", "written-directions", "literal-language"] }],
  ["one kind of help", { ...plain, needs: ["autism"], supports: ["literal-language"] }],
  ["changed goals + a note", { ...plain, needs: ["adhd"], supports: ["task-chunks", "checklist"], expectations: "modify", notes: "Likes soccer." }],
  ["simpler English", { ...plain, needs: ["dyslexia"], supports: ["chunked-text"], language: "simple-english" }],
  ["grade 5", { ...plain, needs: ["apd"], supports: ["written-directions", "visual-cues"], grade: "5" }],
];
let ip = 0;
for (const [label, text] of sampleTexts) {
  for (const [name, profile] of PROFILES) {
    // A fresh address per request, so these checks aren't stopped by the per-visitor limit (12 a minute).
    const res = await fetch(`${base}/api/adapt`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": `10.9.0.${++ip}` },
      body: JSON.stringify({ source: text, profile }),
    });
    const data = await res.json().catch(() => ({}));
    const f = data.fidelity ?? {};
    const ok = res.ok && f.originalQuestions > 0 && f.matchedQuestions === f.originalQuestions && f.choicesPreserved !== false && (data.assignment?.sections?.length ?? 0) > 0;
    check(`server · ${label} · ${name}`, ok, res.ok ? `${data.source}${data.fallbackReason ? ` (${data.fallbackReason})` : ""}, ${f.matchedQuestions}/${f.originalQuestions} questions` : `HTTP ${res.status} ${data.error ?? ""}`);
  }
}

console.log(results.join("\n"));
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
