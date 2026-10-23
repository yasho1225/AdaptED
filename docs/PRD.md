# AdaptED — Product Requirements (v2)

**One lesson. Every learner.** Teachers provide one assignment; AdaptED makes it accessible to a specific learner without compromising the learning objectives, and shows exactly what changed and why.

## Users
- **Primary: K–12 teachers** (general and special education) adapting existing materials.
- **Secondary: students**, who use the adapted version (student view, read-aloud, checklists).

## Core flow
1. Provide an assignment (paste, sample, PDF/DOCX/TXT upload — parsed in browser), or create one with AI from a topic, grade, level, question count, and reading/questions-only choice.
2. Build a learner profile: needs (multi-select), individual supports, grade, language, accommodation vs. modification, optional preference note (no names/medical info).
3. Adapt → Barrier Lens scan → AI generation → fidelity check.
4. Review: Transformation, Student view, Why it changed, Teacher notes, Compare all four.
5. Export: PDF (student pages + teacher page), print, copy.

## Requirements
| Area | Requirement | Status |
| --- | --- | --- |
| Fidelity | Every original question appears once with the same label; MC choices preserved; key academic terms kept; verified by code; corrective retry; verbatim restoration | Done, tested |
| Integrity | No answers in supports; no invented facts; texts being studied never rewritten | Prompt rules + curated tests |
| Distinctness | Outputs differ structurally by need, driven by supports | Measured in tests (curated structural Jaccard 0.13–0.38) |
| Personalization | Supports toggle independently of labels; combined needs merge into one assignment | Done |
| Explainability | Each change has a barrier and a citation; barriers quoted verbatim and highlighted | Done |
| Transparency | Output labelled AI / pre-built / offline with reason | Done |
| Privacy | No storage; redaction of contact details/names before AI; files parsed client-side | Done |
| Accessibility | WCAG 2.2 AA; calm mode; keyboard; screen readers; mobile | axe: 0 violations |
| Reliability | Offline engine when AI unavailable; rate limiting; input limits | Done |
| Create | New grade-level assignment from a topic; accuracy rules (no invented facts, quotes, or sources); answers never shown; result flows into the normal adapt + fidelity pipeline; labelled starter outline without AI | Done, tested (mocked model) |
| Languages | 8 output languages incl. Simpler English; switchable from results; key terms paired with English; lang/dir set on documents (Arabic RTL); honest notice when translation isn't possible | Done, tested (mocked model) |

## Non-goals
Accounts, LMS integration, grading, storing student data, diagnosing.

## Success measures for the challenge demo
- A viewer understands the purpose within seconds of landing (hero animation: one worksheet → four).
- The studio shows the transformation on scroll with no setup.
- Switching needs produces visibly different assignments; "Compare all four" proves it.
- Every claim on screen is sourced; no invented statistics.
