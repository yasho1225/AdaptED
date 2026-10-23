// Usage: node scripts/copy-readability.mjs <outFile> — saves the site's own copy (outside worksheets) for readability scoring.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem("adapted-calm", "true"));
const p = await ctx.newPage();
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
const text = await p.evaluate(() => {
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll(".sheet, .on-paper, [data-citation], [data-sample], script, style, .sr-only, [aria-hidden=true]").forEach((n) => n.remove());
  return [...clone.querySelectorAll("h1,h2,h3,h4,p,li,dt,dd,a,button")].map((n) => n.textContent.trim()).filter((t) => t.split(/\s+/).length >= 4)
    // Citations are references, not prose.
    .filter((t) => !/\(\d{4}\)|et al\.|\d+\(\d+\)/.test(t))
    .join("\n");
});
writeFileSync(process.argv[2], text);
await b.close();
