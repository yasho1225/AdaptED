/**
 * Live AI evaluation: every sample × every need (+ a combined profile and a
 * translation), through the real pipeline. Reports fidelity, answer leaks,
 * distinctness between needs, and latency; saves outputs to eval-output/.
 *
 *    GEMINI_API_KEY=... npm run eval:ai
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { adaptAssignment } from "../src/lib/adapt/service";
import { defaultProfile, supportsForNeeds } from "../src/lib/adapt/profile";
import { SAMPLES } from "../src/lib/adapt/samples";
import { studentText } from "../src/lib/adapt/fidelity";
import { NEED_IDS, type AdaptResult, type LearnerProfile } from "../src/lib/adapt/types";
import { similarity } from "../tests/distinctness";

const LEAKS: Record<string, RegExp[]> = {
  science: [/inputs are (sunlight|carbon dioxide|water)/i],
  math: [/\b16 cups\b/i, /11:15/, /\$?253(\.00)?\b/, /jamal is not correct/i],
  ela: [/1776/, /87 years/i],
};

if (!process.env.GEMINI_API_KEY) {
  console.error("Set GEMINI_API_KEY to run the live evaluation.");
  process.exit(1);
}
mkdirSync("eval-output", { recursive: true });
let failures = 0;

for (const sample of SAMPLES) {
  const results: Record<string, AdaptResult> = {};
  const profiles: [string, LearnerProfile][] = [
    ...NEED_IDS.map((n) => [n, { ...defaultProfile(n), grade: sample.grade }] as [string, LearnerProfile]),
    ["dyslexia+adhd", { needs: ["dyslexia", "adhd"], supports: supportsForNeeds(["dyslexia", "adhd"]), expectations: "accommodate", language: "english", grade: sample.grade }],
    ["autism-es", { ...defaultProfile("autism"), language: "spanish", grade: sample.grade }],
  ];
  for (const [name, profile] of profiles) {
    const t = Date.now();
    const r = await adaptAssignment(sample.text, profile);
    results[name] = r;
    const leaks = LEAKS[sample.id].filter((re) => re.test(studentText(r.assignment))).map(String);
    const ok = r.source === "ai" && r.fidelity.missing.length === 0 && r.fidelity.restored.length === 0 && leaks.length === 0;
    if (!ok) failures++;
    console.log(
      `${ok ? "PASS" : "FAIL"} ${sample.id.padEnd(7)} ${name.padEnd(14)} src=${r.source}${r.fallbackReason ? `(${r.fallbackReason})` : ""} q=${r.fidelity.matchedQuestions}/${r.fidelity.originalQuestions} restored=[${r.fidelity.restored}] altered=[${r.fidelity.altered}] dropped=[${r.fidelity.vocabularyDropped}] leaks=[${leaks}] grade ${r.metrics.before.gradeLevel}->${r.metrics.after.gradeLevel} ${((Date.now() - t) / 1000).toFixed(1)}s`,
    );
    writeFileSync(`eval-output/${sample.id}-${name}.json`, JSON.stringify(r, null, 2));
  }
  const rows: string[] = [];
  for (let i = 0; i < NEED_IDS.length; i++)
    for (let j = i + 1; j < NEED_IDS.length; j++) {
      const s = similarity(results[NEED_IDS[i]].assignment, results[NEED_IDS[j]].assignment);
      rows.push(`${NEED_IDS[i]}/${NEED_IDS[j]} struct=${s.structure.toFixed(2)} text=${s.text.toFixed(2)}`);
    }
  console.log(`  distinctness ${sample.id}: ${rows.join(" | ")}`);
}
console.log(failures ? `\n${failures} run(s) need review — see eval-output/` : "\nAll runs passed.");
process.exit(failures ? 1 : 0);
