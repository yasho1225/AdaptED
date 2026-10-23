// Usage: node scripts/a11y.mjs [baseUrl]  — axe-core WCAG 2.2 AA audit of every main view, blue canvas.
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
const base = process.argv[2] ?? "http://localhost:3100";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
let total = 0;
for (const theme of ["blue"]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript((t) => { localStorage.setItem("adapted-calm", "true"); localStorage.setItem("adapted-theme", t); }, theme);
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: "networkidle" });
  await p.locator("#studio").scrollIntoViewIfNeeded();
  await p.waitForTimeout(1500);
  const views = [["Before and after"], ["Student view"], ["What changed"], ["Teacher notes"]];
  for (const [tab] of views) {
    await p.locator("#studio").getByRole("tab", { name: tab }).click();
    await p.waitForTimeout(300);
    if (tab === "Teacher notes") {
      await p.getByRole("button", { name: "Compare all four" }).click();
      await p.waitForTimeout(800);
    }
    const r = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    total += r.violations.length;
    console.log(`[${theme}] ${tab}: ${r.violations.length} violation types`);
    for (const v of r.violations) {
      console.log(`  - ${v.id} (${v.impact}) x${v.nodes.length}: ${v.help}`);
      v.nodes.slice(0, 3).forEach((n) => console.log(`      ${n.target.join(" ")} :: ${(n.failureSummary ?? "").split("\n").slice(1, 2).join(" ")}`));
    }
  }
  await ctx.close();
}
await b.close();
process.exit(total ? 1 : 0);
