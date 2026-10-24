// Usage: node scripts/mood-shots.mjs <outDir> — motion-mode frames at each section heading.
import { chromium } from "playwright";
const out = process.argv[2] ?? "shots";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem("adapted-calm", "false"));
const p = await ctx.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
const targets = ["#stuck-heading", "#studio-heading", "#how-heading", "#research-heading", "#close-heading"];
let i = 0;
for (const sel of targets) {
  const y = await p.locator(sel).first().evaluate((e) => e.getBoundingClientRect().top + scrollY);
  await p.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y - 160);
  await p.waitForTimeout(1600);
  const canvas = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--canvas"));
  await p.screenshot({ path: `${out}/mood-${i}.png` });
  console.log(i, sel, "canvas=", canvas.trim());
  i++;
}
console.log("errors:", errors.length ? errors : "none");
await b.close();
