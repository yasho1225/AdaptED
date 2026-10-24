// Usage: node scripts/section-shots.mjs <outDir> — viewport shots of each landing section.
import { chromium } from "playwright";
const out = process.argv[2] ?? "shots";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem("adapted-calm", "true"));
const p = await ctx.newPage();
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
for (const sel of ["#stuck-heading", "#studio-heading", "#how-heading", "#research-heading", "footer"]) {
  await p.locator(sel).first().evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 90));
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/sec-${sel.replace(/[#-]/g, "")}.png` });
}
await b.close();
