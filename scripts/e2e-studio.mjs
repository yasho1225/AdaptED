// Usage: node scripts/e2e-studio.mjs [calm=true|false] — drives the studio end to end against `npm start` on :3100.
// Checks: nothing runs until asked, the Adapt button, quick switch to each need, compare all four, student view (text size, checklist tick),
// what changed, teacher notes, copy, print, "Make it with AI now" fallback labelling, and hero → studio hand-off.
import { chromium } from "playwright";

const calm = process.argv[2] ?? "true";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
await ctx.addInitScript((c) => {
  localStorage.setItem("adapted-calm", c);
  window.__printed = 0;
  window.print = () => (window.__printed += 1);
}, calm);
const p = await ctx.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
const results = [];
const check = (name, ok, detail = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);

await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
const studio = p.locator("#studio");

// Nothing runs on its own: the result appears when the teacher asks for it.
await studio.scrollIntoViewIfNeeded();
await p.waitForTimeout(1500);
check("no result before the Adapt button", (await studio.getByText(/Here’s the new version|Making the new version/).count()) === 0);
await studio.getByRole("button", { name: /^Adapt for/ }).click();
await studio.getByText("Here’s the new version").waitFor({ timeout: 15000 });
check("Adapt button shows a result", true, await studio.getByText(/Pre-made example/).first().innerText());

// Quick switch through every need.
for (const need of ["ADHD", "Auditory Processing", "Autism", "Dyslexia"]) {
  await studio.getByRole("button", { name: need, exact: true }).click();
  await studio.getByText(`New version for ${need}`).waitFor({ timeout: 15000 });
  const kept = await studio.locator("dl").getByText(/of \d+/).first().innerText();
  check(`quick switch → ${need}`, /of 5/.test(kept), `questions kept: 5 ${kept}`);
}

// Result tabs.
await studio.getByRole("tab", { name: "Student view" }).click();
await studio.getByRole("button", { name: "Larger text" }).click();
check("student view: larger text", await studio.getByRole("button", { name: "Smaller text" }).isEnabled());
await studio.getByRole("button", { name: "ADHD", exact: true }).click();
await studio.getByText(`New version for ADHD`).waitFor({ timeout: 15000 });
await studio.getByRole("tab", { name: "Student view" }).click();
await studio.getByLabel("One section at a time").uncheck(); // ADHD opens one section at a time
const box = studio.locator('ul[aria-label="Checklist"] input[type=checkbox]').first();
await box.locator("xpath=..").click();
check("student view: checklist box ticks", await box.isChecked());

await studio.getByRole("tab", { name: "What changed" }).click();
const changes = await studio.locator("#panel-why h4").count();
check("what changed lists changes", changes >= 4, `${changes} headings`);
await studio.getByRole("tab", { name: "Teacher notes" }).click();
check("teacher notes", await studio.getByText("Tips for giving this to your student").isVisible());

// Copy and print.
await studio.getByRole("button", { name: /Copy text/ }).click();
const clip = await p.evaluate(() => navigator.clipboard.readText());
check("copy text puts the worksheet on the clipboard", clip.includes("Photosynthesis"), `${clip.length} chars`);
await studio.getByRole("button", { name: /^Print/ }).click();
check("print opens the print dialog", (await p.evaluate(() => window.__printed)) === 1);

// Compare all four.
await studio.getByRole("button", { name: "Compare all four" }).click();
await studio.getByText("One lesson, four versions").waitFor();
const cols = await studio.locator('[aria-label$="adapted assignment, scrollable"]').count();
check("compare all four", cols === 4, `${cols} versions`);
await studio.getByRole("button", { name: "Close comparison" }).click();

// Live AI without a key: must say plainly that AI was not used.
await studio.getByRole("button", { name: "Make it with AI now" }).click();
await studio.getByText(/Made without AI|Made just now by AI/).first().waitFor({ timeout: 30000 });
check("live AI request is labelled honestly", true, await studio.getByText(/Made without AI|Made just now by AI/).first().innerText());

// Language switch: without AI on the server it must say the version stayed in English.
await studio.getByRole("combobox", { name: /Language:/ }).selectOption("spanish");
await studio.getByText(/Translating needs AI|New version for/).first().waitFor({ timeout: 30000 });
await p.waitForTimeout(2500);
const translated = await studio.locator('article[lang="es"]').count();
const note = await studio.getByText(/Translating needs AI/).isVisible().catch(() => false);
check("language switch: translated, or says plainly that it couldn't", translated > 0 || note, translated ? "Spanish version shown" : "English kept, with a note");
await studio.getByRole("combobox", { name: /Language:/ }).selectOption("english");
await p.waitForTimeout(2500);

// Create one with AI (or the labelled starter outline when AI isn't set up).
await studio.getByRole("tab", { name: "Create one with AI" }).click();
await studio.getByLabel("What should it be about?").fill("the water cycle");
await studio.getByRole("button", { name: "Create assignment" }).click();
await studio.locator("#source-status").getByText(/Created just now by AI|starter outline/).waitFor({ timeout: 45000 });
const made = await p.locator("#assignment-text").inputValue();
const status = await studio.locator("#source-status").innerText();
check("create: fills the assignment box and labels where it came from", /^the water cycle|^The water cycle|\n1\. /i.test(made) && made.includes("1. "), status.slice(0, 70));

// Hero → studio hand-off.
await p.evaluate(() => scrollTo(0, 0));
await p.waitForTimeout(600);
await p.getByRole("tab", { name: "Autism" }).first().click();
await p.getByRole("link", { name: "Open the Autism version" }).click();
await studio.getByText("New version for Autism").waitFor({ timeout: 15000 });
await p.waitForTimeout(2000);
const top = await p.evaluate(() => Math.round(document.querySelector("#studio [aria-busy]").getBoundingClientRect().top));
check("hero hand-off opens Autism and scrolls to it", top > 0 && top < 200, `result top at ${top}px`);

check("no page or console errors", errors.length === 0, errors.join(" | "));
console.log(`calm=${calm}\n${results.join("\n")}`);
await b.close();
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
