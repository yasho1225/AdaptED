// Usage: node scripts/mobile-shots.mjs <outDir>
import { chromium } from "playwright";
const out = process.argv[2] ?? "shots";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
await ctx.addInitScript(() => localStorage.setItem("adapted-calm", "true"));
const p = await ctx.newPage();
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
await p.locator("#studio").scrollIntoViewIfNeeded();
await p.waitForTimeout(1200);
const top = await p.locator("#studio").evaluate((e) => e.getBoundingClientRect().top + scrollY);
for (const [i, off] of [[0, 600], [1, 1500], [2, 2300], [3, 3100], [4, 3900]]) {
  await p.evaluate((y) => scrollTo(0, y), top + off);
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${out}/m-studio-${i}.png` });
}
await b.close();
