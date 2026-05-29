import type { AccessibilityMode } from "@/lib/types";

export function modeFormattingRules(mode: AccessibilityMode): string {
  switch (mode) {
    case "dyslexia":
      return `DYSLEXIA MODE (strict — must look like easy reading, NOT steps or sections):
- Short sentences (≤12 words). Many separate "chunk" blocks with breathing room.
- Simpler vocabulary for the grade level. No academic density.
- Use "key" for 2–4 critical ideas (**bold** inside text).
- Exactly 1 "title" and optional 1 short "note".
- FORBIDDEN: "step", "caption", numbered tasks, long paragraphs.`;

    case "adhd":
      return `ADHD MODE (strict — must look like an action plan, NOT essay chunks):
- Minimum 6 "step" blocks when enough content; each starts with "Step N: " with ONE action only.
- Use "bullet" with "☐ " for every checklist item.
- Short energetic "title" (e.g. "Your Action Plan") and 1 "note".
- FORBIDDEN: "caption", SECTION headers, multi-sentence "chunk" blocks.`;

    case "apd":
      return `APD MODE (strict — must look like written lecture notes, NOT action steps):
- "caption" blocks as headings: "TOPIC: ..." or "SECTION: ..." (never [brackets]).
- "bullet" blocks with "• " for every list item.
- "key" blocks with "★ " for takeaways.
- FORBIDDEN: "Step 1:" format, "step" blocks, checklist ☐, narrative chunks.`;

    case "autism":
      return `AUTISM STRUCTURE MODE (strict — identical skeleton every time):
1. "title" 2. "caption" SECTION 1: WHAT THIS IS 3. 1–2 "chunk"/"key"
4. "caption" SECTION 2: KEY POINTS 5. ≥3 "bullet" items
6. "caption" SECTION 3: STEP-BY-STEP BREAKDOWN 7. ≥3 "step" blocks 8. calm "note"
- Neutral tone. Same section labels verbatim. No extra captions.`;
  }
}
