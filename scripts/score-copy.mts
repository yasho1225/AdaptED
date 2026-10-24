// Usage: npx tsx scripts/score-copy.mts <textFile> — Flesch–Kincaid metrics for extracted site copy.
import { readFileSync } from "node:fs";
import { computeMetrics } from "../src/lib/adapt/analyze";
const lines = readFileSync(process.argv[2], "utf8").split("\n").filter(Boolean);
console.log(JSON.stringify(computeMetrics(lines.map((l) => (/[.!?]$/.test(l) ? l : `${l}.`)).join("\n"))));
