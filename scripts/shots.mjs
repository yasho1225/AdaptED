// Usage: node scripts/shots.mjs <baseUrl> <outDir>
import { chromium } from "playwright";
const [base = "http://localhost:3100", out = "shots"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const errors = [];

async function page(viewport, { calm = true, theme = "light" } = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  await ctx.addInitScript(([c, t]) => { localStorage.setItem("adapted-calm", c); localStorage.setItem("adapted-theme", t); }, [String(calm), theme]);
  const p = await ctx.newPage();
  p.on("console", (m) => m.type() === "error" && errors.push(`[${viewport.width}] ${m.text()}`));
  p.on("pageerror", (e) => errors.push(`[${viewport.width}] pageerror ${e.message}`));
  await p.goto(base, { waitUntil: "networkidle" });
  return p;
}

// Desktop, calm: full page with studio auto-run
let p = await page({ width: 1440, height: 900 });
await p.locator("#studio").scrollIntoViewIfNeeded();
await p.waitForTimeout(1500);
await p.screenshot({ path: `${out}/desktop-full.png`, fullPage: true });
await p.locator("#studio").screenshot({ path: `${out}/desktop-studio.png` });
for (const tab of ["Student view", "Why it changed", "Teacher notes"]) {
  await p.locator("#studio").getByRole("tab", { name: tab }).click();
  await p.waitForTimeout(400);
  await p.locator("#studio [role=tabpanel]").screenshot({ path: `${out}/tab-${tab.split(" ")[0].toLowerCase()}.png` });
}
await p.locator("#studio").getByRole("tab", { name: "Transformation" }).click();
await p.getByRole("button", { name: "Compare all four needs" }).click();
await p.waitForTimeout(1200);
await p.getByRole("heading", { name: "One lesson, four versions" }).scrollIntoViewIfNeeded();
await p.screenshot({ path: `${out}/compare.png` });
for (const n of ["ADHD", "Auditory Processing", "Autism"]) {
  await p.locator("#studio").getByRole("button", { name: n, exact: true }).last().click();
  await p.waitForTimeout(800);
  await p.locator(".adapted-pane").screenshot({ path: `${out}/adapted-${n.split(" ")[0].toLowerCase()}.png` });
}

// Desktop, motion: hero frames during scroll
p = await page({ width: 1440, height: 900 }, { calm: false });
await p.waitForTimeout(1600);
await p.screenshot({ path: `${out}/hero-0.png` });
for (const y of [350, 700, 1000]) {
  await p.mouse.wheel(0, y === 350 ? 350 : 350);
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `${out}/hero-${y}.png` });
}

// Mobile
p = await page({ width: 390, height: 844 });
await p.screenshot({ path: `${out}/mobile-hero.png` });
await p.locator("#studio").scrollIntoViewIfNeeded();
await p.waitForTimeout(1500);
await p.screenshot({ path: `${out}/mobile-full.png`, fullPage: true });
const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log("mobile horizontal overflow px:", overflow);


console.log("console errors:", errors.length ? errors.join("\n") : "none");
await browser.close();
