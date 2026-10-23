# AdaptED

**One lesson. Every learner.**

AdaptED helps teachers turn an assignment they already have into a version a specific student can access — for dyslexia, ADHD, auditory processing differences (APD), and autism — **without lowering what the student is expected to learn**. It shows the original and the adapted version side by side, highlights the barriers it found, and explains every change with the research behind it.

Built for the 2026 Congressional App Challenge.

## What it does

1. **Input** — paste text, pick a sample, or upload a PDF / Word / text file. Files are parsed in the browser.
2. **Learner profile** — choose one or more needs, then turn individual supports on or off (vocabulary preview, timed chunks, guided notes, literal wording, and 17 more). Set grade, language, and whether goals stay grade-level (accommodation, the default) or may be modified.
3. **Barrier Lens** — deterministic analysis highlights the exact phrases in the original that could block this learner: long sentences, multi-step directions, figurative language, spoken-only instructions, open prompts with no length.
4. **Adaptation** — Gemini writes a structured assignment (JSON schema-constrained) under nine non-negotiable rules: keep every question, never give answers, keep academic vocabulary, never rewrite a text being studied, no invented facts, and more.
5. **Fidelity check** — AdaptED's own code counts every original question, answer choice, and key term. If something is missing it asks the model to fix it once; as a last resort it restores the question word-for-word. The result shows this check.
6. **Results** — Transformation (original ↔ adapted), Student view (read-aloud, text size, spacing, background tint, one-section-at-a-time focus mode, interactive checklists and guided notes), Why it changed (change cards with citations), Teacher notes, and **Compare all four needs**. Export as PDF (with a teacher page), print, or copy.

If no AI key is configured or the AI fails, an **offline rule engine** builds a structured version from the selected supports. It is always labelled as such.

## Run it

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY (https://aistudio.google.com/apikey)
npm run dev
```

Without a key, the three samples show **pre-built example outputs** (labelled "Pre-built example · not generated live"), and everything else uses the offline engine.

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Server-only Gemini key. Optional; enables live AI. |
| `GEMINI_MODEL` | Optional model override (default `gemini-2.5-flash`, falls back to `gemini-flash-latest` if retired). |

## Quality checks

```bash
npm test          # 48 unit tests: analysis, offline engine, curated outputs, mocked AI pipeline
npm run eval:ai   # live AI evaluation (needs GEMINI_API_KEY): 3 samples × 6 profiles
npm run lint
npm run build
npm run a11y      # axe-core WCAG 2.2 AA audit (needs `npm start` on :3100)
```

The tests enforce, for every curated and offline output: all questions preserved, answer choices kept, barrier quotes verbatim from the original, citations that resolve, no leaked answers, and structural distinctness between needs.

## Project structure

```
src/lib/adapt/
  analyze.ts         question inventory, Barrier Lens, readability metrics, syllables
  profile.ts         needs, the 21 supports (with model instructions), profile sanitizing
  research.ts        evidence registry — every change cites one of these
  prompt.ts          system prompt (rules + research playbooks) and user prompt
  schema.ts          zod validator + Gemini response JSON schema
  fidelity.ts        question/choice/vocabulary checks, corrective feedback, restoration
  gemini.ts          @google/genai client with retry and model fallback (server-only)
  service.ts         pipeline: redact → generate → validate → fidelity → fallback
  offline-engine.ts  rule-based fallback driven by the selected supports
  samples.ts, curated/   three samples and their pre-built reference outputs
src/app/api/adapt/   POST endpoint (input limits, rate limiting)
src/components/      studio (the tool), doc renderers, site sections, motion (GSAP + Lenis)
docs/                PRD and research basis
```

## Privacy

No accounts, no database, no analytics. Uploaded files are read in the browser. Before text is sent to the AI, emails, phone numbers, ID-like numbers, and `Name:` fields are removed. The learner profile never asks for names or medical details.

## Accessibility of the site itself

Designed to WCAG 2.2 AA and audited with axe-core (0 violations across all views, light and dark). Keyboard operable, visible focus, semantic structure, text alternatives for icon cues. **Calm mode** (and the OS reduced-motion setting) turns off smooth scrolling and all decorative motion. Body type is Atkinson Hyperlegible Next.

## Limitations

- The AI path was implemented and tested with a mocked model and a live call that reached Gemini's API, but output quality must be confirmed with a real key using `npm run eval:ai`.
- Scanned (image-only) PDFs have no extractable text; OCR is not included.
- Readability scores (Flesch–Kincaid) are rough estimates and only meaningful for English.
- The offline engine cannot paraphrase or translate; it structures and supports the original wording.
- AdaptED applies research-based strategies; it has not itself been studied for effectiveness. It does not replace IEP/504 decisions or teacher judgment.

## Development and AI disclosure

> **Team:** add your names and describe your own contributions here before submitting.

AI coding assistants (including Anthropic's Claude) were used to help write and review code, draft the research summaries, and author the pre-built sample outputs, under the team's direction and review. At runtime, the app uses Google's Gemini model to generate adaptations; those outputs are labelled as AI-generated in the interface.

See [docs/PRD.md](docs/PRD.md) and [docs/RESEARCH.md](docs/RESEARCH.md).
