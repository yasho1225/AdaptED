// Usage: node scripts/audit.mjs <outDir> — multi-breakpoint frontend audit: overflow, tap targets, tiny text, headings, axe, console.
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
const out = process.argv[2] ?? "audit";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const VPS = [
  ["desktop", 1440, 900],
  ["laptop", 1024, 768],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
];
for (const [name, width, height] of VPS) {
  const ctx = await b.newContext({ viewport: { width, height }, hasTouch: width < 800 });
  await ctx.addInitScript(() => localStorage.setItem("adapted-calm", "true"));
  const p = await ctx.newPage();
  const errors = [];
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
  await p.locator("#studio").scrollIntoViewIfNeeded();
  await p.locator("#studio").getByRole("button", { name: /^Adapt for/ }).click();
  await p.locator("#studio").getByText("Here’s the new version").waitFor({ timeout: 15000 });
  await p.evaluate(() => scrollTo(0, 0));
  await p.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  // Touch layouts must meet 44px (Apple/Google guidance); pointer layouts 36px (well above WCAG 2.5.8's 24px).
  const minTarget = width < 800 ? 44 : 36;
  const report = await p.evaluate((minTarget) => {
    const vw = innerWidth;
    const overflow = document.documentElement.scrollWidth - vw;
    const small = [];
    for (const el of document.querySelectorAll("a, button, input, select, textarea, summary, [role=tab]")) {
      // A control wrapped in a <label> is hit through the whole label.
      const r = (el.matches("input") && el.closest("label")) ? el.closest("label").getBoundingClientRect() : el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (r.width === 0 || s.visibility === "hidden" || el.closest(".sr-only")) continue;
      if (el.matches("input[type=checkbox], input[type=radio]") && el.classList.contains("sr-only")) continue;
      if (r.height < minTarget && !(el.tagName === "A" && s.display === "inline")) small.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || el.getAttribute("placeholder") || "").trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
    const tiny = new Set();
    for (const el of document.querySelectorAll("body *")) {
      if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 12 && !el.closest(".sr-only") && el.getBoundingClientRect().width > 0) tiny.add(`${fs}px "${el.textContent.trim().slice(0, 30)}"`);
    }
    const heads = [...document.querySelectorAll("h1,h2,h3")].map((h) => `${h.tagName}:${h.textContent.trim().slice(0, 40)}`);
    const imgsNoAlt = [...document.querySelectorAll("img:not([alt])")].length;
    return { overflow, small: small.slice(0, 40), smallCount: small.length, tiny: [...tiny].slice(0, 20), heads, imgsNoAlt, title: document.title };
  }, minTarget);
  const axe = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  console.log(`\n===== ${name} ${width}x${height}`);
  console.log("overflow:", report.overflow, "| imgs without alt:", report.imgsNoAlt, "| console errors:", errors.length ? errors : "none");
  console.log("axe:", axe.violations.map((v) => `${v.id}(${v.nodes.length})`).join(", ") || "none");
  console.log(`tap targets < ${minTarget}px tall: ${report.smallCount}`);
  report.small.forEach((s) => console.log("   ", s));
  console.log("text < 12px:", report.tiny.length ? report.tiny : "none");
  if (name === "desktop") console.log("headings:", report.heads.join(" | "));
  await ctx.close();
}
await b.close();
