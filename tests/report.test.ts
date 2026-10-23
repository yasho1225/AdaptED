import { it } from "vitest";
import { CURATED } from "@/lib/adapt/curated";
import { adaptOffline } from "@/lib/adapt/offline-engine";
import { defaultProfile } from "@/lib/adapt/profile";
import { SAMPLES } from "@/lib/adapt/samples";
import { NEED_IDS } from "@/lib/adapt/types";
import { similarity } from "./distinctness";

it.skipIf(!process.env.REPORT)("prints distinctness report", () => {
  for (const s of SAMPLES) {
    for (const [label, get] of [["curated", (n: (typeof NEED_IDS)[number]) => CURATED[s.id][n]], ["offline", (n: (typeof NEED_IDS)[number]) => adaptOffline(s.text, defaultProfile(n))]] as const) {
      const rows: string[] = [];
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
        const sim = similarity(get(NEED_IDS[i]), get(NEED_IDS[j]));
        rows.push(`${NEED_IDS[i]}/${NEED_IDS[j]} text=${sim.text.toFixed(2)} struct=${sim.structure.toFixed(2)}`);
      }
      console.log(`${s.id} ${label}: ${rows.join(" | ")}`);
    }
  }
});
