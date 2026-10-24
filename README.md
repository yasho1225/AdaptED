# AdaptED

**One lesson. Every learner.**

AdaptED helps teachers turn an assignment they already have into a version a specific student can access — for dyslexia, ADHD, auditory processing differences (APD), and autism — **without lowering what the student is expected to learn**. It shows the original and the adapted version side by side, highlights the barriers it found, and explains every change with the research behind it.

Built for the 2026 Congressional App Challenge.

## What it does

1. **Input** — paste text, pick a sample, or upload a PDF / Word / text file (parsed in the browser). Or **create a new assignment with AI**: give a topic, grade, level, number of questions, and whether to include a reading; AdaptED writes a grade-level assignment and adapts it for the chosen student right away. Without AI it gives a clearly labelled starter outline (question stems and a marked spot for the teacher's reading — no made-up facts).
2. **Learner profile** — choose one or more needs, then turn individual supports on or off (vocabulary preview, timed chunks, guided notes, literal wording, and 17 more). Set grade, language, and whether goals stay grade-level (accommodation, the default) or may be modified.
   **Languages:** English, Simpler English (for English learners), Spanish, French, Hindi, Chinese, Vietnamese, and Arabic (right to left). Switch language from the results bar at any time. Student-facing text is translated with each key term followed by the English word; teacher notes stay in English. Translation needs AI; without it the version stays in English and says so.
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

Without a key, the three samples show **pre-made example outputs** (labelled "Pre-made example · not made just now"), and everything else uses the offline engine.

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Server-only Gemini key. Optional; enables live AI. |
| `GEMINI_MODEL` | Optional model override (default `gemini-2.5-flash`, falls back to `gemini-flash-latest` if retired). |

## Quality checks

```bash
npm test          # 60 unit tests: analysis, offline engine, curated outputs, mocked AI pipeline, creation, languages
npm run eval:ai   # live AI evaluation (needs GEMINI_API_KEY): 3 samples × 6 profiles
npm run lint
npm run build
npm run a11y      # axe-core WCAG 2.2 AA audit (needs `npm start` on :3100)
npm run audit:ui -- <outDir>   # 4 breakpoints: overflow, tap targets, text size, headings, axe, console errors
npm run e2e:studio -- false    # 17 studio checks with motion on (pass `true` for calm mode), incl. create + language
```

Measured on a local production build (Lighthouse 12.8, October 2026): mobile (simulated slow 4G, 4× slower CPU) Performance 89–90, Accessibility 100, Best Practices 100, SEO 100; desktop 100 in all four.

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
  create.ts, create-server.ts   "create an assignment": request checks, model prompt, starter outline
src/app/api/adapt/   POST endpoint (input limits, rate limiting)
src/app/api/create/  POST endpoint for new assignments (same rate limiting)
src/components/      studio (the tool), doc renderers, site sections, motion (GSAP + Lenis)
docs/                PRD and research basis
```

## Privacy

No accounts, no database, no analytics. Uploaded files are read in the browser. Before text is sent to the AI, emails, phone numbers, ID-like numbers, and `Name:` fields are removed. The learner profile never asks for names or medical details.

## Accessibility of the site itself

Designed to WCAG 2.2 AA and audited with axe-core (0 violations at 1440, 1024, 768, and 390px). Keyboard operable, visible focus, semantic structure, text alternatives for icon cues, 44px touch targets, no text under 12px. **Calm mode** (and the OS reduced-motion setting) turns off smooth scrolling and all decorative motion, and swaps animated pictures for still ones. Body type is Atkinson Hyperlegible Next; headlines use Bricolage Grotesque. Design decisions are in [DESIGN.md](DESIGN.md); the latest UI audit, and the before/after measurements of the redesign it led to, are in [docs/UI-AUDIT.md](docs/UI-AUDIT.md).

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

### Assistant tooling

`.claude/skills/` holds third-party "skills" (design and browser-testing guidance) that an AI coding assistant reads while working on this repository: taste-skill, Emil Kowalski's animation skills, Impeccable, Playwright CLI, and a library of reference DESIGN.md files. They are development aids only, they are not part of the website, and the build, lint and tests ignore them. Sources and licenses are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Impeccable is installed as a plain skill. Its plugin hooks (which would download and run a program from the network on every edit) and its sub-agent definitions are deliberately not included. Delete `.claude/skills/` to remove everything.

## Credits and licenses

- The button "magnet" effect is the Magnet component from [React Bits](https://reactbits.dev) by David Haz (MIT + Commons Clause), in `src/components/vendor/magnet.tsx` with its notice.
- Fonts: Atkinson Hyperlegible Next (Braille Institute) and Bricolage Grotesque, both SIL Open Font License 1.1.
- Animation by [GSAP](https://gsap.com) (standard no-charge license) and smooth scrolling by [Lenis](https://lenis.darkroom.engineering) (MIT).

Full texts and the dependency list: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
