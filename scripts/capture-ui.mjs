// Usage: node scripts/capture-ui.mjs [outDir=public/images] — captures crops of AdaptED's own interface
// (the real worksheet versions the app renders; run `npm start -- -p 3100` first) at 2x, as PNGs.
// The page uses WebP copies of them: convert each PNG to public/images/<name>.webp (quality ~82).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const out = process.argv[2] ?? "public/images";
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1500 }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => localStorage.setItem("adapted-calm", "true"));
const p = await ctx.newPage();
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);

const rectOf = (sel, text) =>
  p.evaluate(
    ([sel, text]) => {
      // The deepest element that matches, so a wrapper that merely contains the text is skipped.
      const hits = [...document.querySelectorAll(sel)].filter((e) => !text || e.textContent.includes(text));
      const el = hits.find((e) => !hits.some((o) => o !== e && e.contains(o)));
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
    },
    [sel, text],
  );
const shot = async (name, clip) => {
  await p.screenshot({ path: `${out}/${name}.png`, clip: { x: Math.round(clip.x), y: Math.round(clip.y), width: Math.round(clip.width), height: Math.round(clip.height) }, fullPage: true });
  console.log("captured", name);
};

const sheet = () => rectOf("#hero-sheet");

// 1. The dense original paragraph, with its barrier highlights.
const doc = await rectOf("#hero-sheet .whitespace-pre-wrap");
await shot("thumb-dense", { x: doc.x - 12, y: doc.y - 12, width: doc.w + 24, height: (doc.w + 24) / 1.6 });

// 2–5. The top of each adapted version (title, intro, first part), and the dyslexia key idea.
// The sheet is narrowed first, so the text sets larger in the small picture on the page.
const narrow = (on) =>
  p.evaluate((on) => {
    const sheet = document.getElementById("hero-sheet").closest("[data-ui]");
    sheet.style.maxWidth = on ? "30rem" : "";
  }, on);
for (const need of ["dyslexia", "adhd", "apd", "autism"]) {
  const label = { dyslexia: "Dyslexia", adhd: "ADHD", apd: "Auditory Processing", autism: "Autism" }[need];
  await p.getByRole("tab", { name: label, exact: true }).first().click();
  await narrow(true);
  await p.waitForTimeout(400);
  const [art, box] = [await rectOf("#hero-sheet article"), await sheet()];
  await shot(`need-${need}`, { x: box.x, y: Math.max(box.y, art.y - 24), width: box.w, height: (box.w * 3) / 4 });
  if (need === "dyslexia") {
    await narrow(false);
    await p.waitForTimeout(300);
    // The hero's sheet crops its worksheet at a fixed height, so slide the part with the key idea up into view.
    await p.evaluate(() => {
      const art = document.querySelector("#hero-sheet article");
      const part = [...art.querySelectorAll("section")].find((e) => e.textContent.includes("Photosynthesis turns light energy"));
      const top = document.getElementById("hero-sheet").getBoundingClientRect().top;
      art.style.transform = `translateY(${top + 24 - part.getBoundingClientRect().top}px)`;
    });
    const key = await rectOf("#hero-sheet article section", "Photosynthesis turns light energy");
    await shot("thumb-chunks", { x: key.x - 12, y: key.y - 12, width: key.w + 24, height: (key.w + 24) / 1.6 });
    await p.evaluate(() => (document.querySelector("#hero-sheet article").style.transform = ""));
  }
  await narrow(false);
}

// 6. All four versions side by side (the studio's comparison), each column at its full length,
// with a margin of the studio's blue around them.
const studio = p.locator("#studio");
await studio.scrollIntoViewIfNeeded();
await studio.getByText("Here’s the new version").waitFor({ timeout: 15000 });
await studio.getByRole("button", { name: "Compare all four" }).click();
await studio.getByText("One lesson, four versions").waitFor();
// Lay the comparison out as one row of four, at full length, without its header.
await p.evaluate(() => {
  const grid = document.querySelector("#studio [aria-label$='adapted assignment, scrollable']").closest("section").parentElement;
  grid.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
  grid.previousElementSibling.style.visibility = "hidden";
  grid.querySelectorAll("[aria-label$='adapted assignment, scrollable']").forEach((el) => (el.style.maxHeight = "none"));
});
await p.waitForTimeout(800);
const all = await p.evaluate(() => {
  const els = [...document.querySelectorAll("#studio section[data-ui].sheet")].filter((e) => e.closest(".pt-6"));
  const rs = els.map((e) => e.getBoundingClientRect());
  return { x: Math.min(...rs.map((r) => r.left)) + scrollX, y: Math.min(...rs.map((r) => r.top)) + scrollY, r: Math.max(...rs.map((r) => r.right)) + scrollX };
});
const M = 32;
const width = all.r - all.x + 2 * M;
await shot("versions", { x: all.x - M, y: all.y - M, width, height: width * 1.4 });

await b.close();
