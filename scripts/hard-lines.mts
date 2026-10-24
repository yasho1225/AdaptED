// Usage: npx tsx scripts/hard-lines.mts <textFile> — lines ranked by estimated reading grade.
import { readFileSync } from "node:fs";
import { computeMetrics } from "../src/lib/adapt/analyze";
const lines = readFileSync(process.argv[2], "utf8").split("\n").filter((l) => l.split(/\s+/).length >= 6);
const scored = [...new Set(lines)].map((l) => ({ l, g: computeMetrics(l).gradeLevel, w: l.split(/\s+/).length }));
scored.sort((a, b) => b.g * Math.log(b.w) - a.g * Math.log(a.w));
for (const s of scored.slice(0, 30)) console.log(s.g.toFixed(1).padStart(5), s.l.slice(0, 150));
