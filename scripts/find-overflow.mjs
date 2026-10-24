// Usage: node scripts/find-overflow.mjs — lists elements wider than a 390px viewport.
import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
await ctx.addInitScript(() => localStorage.setItem("adapted-calm", "true"));
const p = await ctx.newPage();
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
await p.locator("#studio").scrollIntoViewIfNeeded();
await p.locator("#studio").getByRole("button", { name: /^Adapt for/ }).click();
await p.locator("#studio").getByText("Here’s the new version").waitFor({ timeout: 15000 });
const out = await p.evaluate(() => {
  const res = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.right > window.innerWidth + 1 && r.width > 0) {
      let scroller = false;
      for (let a = el.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o === "auto" || o === "hidden" || o === "scroll") { scroller = true; break; } }
      if (!scroller) res.push(`${el.tagName}.${(el.className?.baseVal ?? el.className).toString().slice(0, 80)} right=${Math.round(r.right)}`);
    }
  }
  return res.slice(0, 15);
});
console.log(out.join("\n"));
await b.close();
