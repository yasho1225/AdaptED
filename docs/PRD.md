# AdaptED — Product Requirements Document (MVP)

**Version:** 1.0 · **Scope:** Hackathon MVP · **Last updated:** May 2026

---

## 1. Executive Summary

**AdaptED** helps teachers instantly transform assignments, worksheets, and learning materials into accessible formats for students with dyslexia, autism, visual impairment, and hearing impairment.

**One-sentence pitch:** One lesson. Every learner.

**MVP goal:** A polished, frontend-only demo that judges understand in under 30 seconds—no auth, no database, no backend.

---

## 2. Problem & Opportunity

| Problem | Impact |
|--------|--------|
| One-size-fits-all instruction | Students with diverse needs are left behind |
| Manual adaptation is slow | Teachers lack time to rewrite every assignment |
| Inconsistent accessibility | Materials rarely match how each student learns |

**Opportunity:** Show instant, mode-specific transformations of the same content so teachers see one source lesson serving every learner.

---

## 3. Target Users

| User | Need | MVP role |
|------|------|----------|
| **Primary — Teachers** | Fast, trustworthy adaptation of existing materials | Paste/upload → pick mode → compare outputs |
| **Secondary — Students & parents** | Readable formats that match learning style | View adapted output (read-only in demo) |

---

## 4. Product Principles (Hackathon)

1. **Demo-first** — Interactive split-screen is the hero of the product story.
2. **Instant feedback** — Mode switches update output with smooth motion (&lt;300ms perceived).
3. **Visibly different modes** — Each mode’s output must feel distinct, not cosmetic.
4. **No overbuild** — Mock transformations; no accounts, LMS, or analytics.
5. **Premium feel** — Apple/Notion/Linear-level spacing, typography, and motion.

---

## 5. Core User Flow

```
Landing → Scroll to Demo → Paste/Example → Select Mode → Compare Modes
```

| Step | Action | Success criteria |
|------|--------|------------------|
| 1 | Paste text or load example / PDF | Input visible in left panel |
| 2 | Select accessibility mode | Tab/card highlights; output updates |
| 3 | View transformation | Right panel shows mode-specific content |
| 4 | Switch modes | Same input, four clearly different outputs |

---

## 6. Accessibility Modes (Functional Spec)

### 6.1 Dyslexia Mode
- **Purpose:** Reduce reading overwhelm.
- **Transforms:** Shorter sentences, simpler words, chunked blocks, key-idea emphasis, extra spacing.
- **Feel:** Clean, scannable, less intimidating.

### 6.2 Autism Mode
- **Purpose:** Predictability and lower cognitive load.
- **Transforms:** Numbered steps, bullets, consistent headings, minimal fluff.
- **Feel:** Calm, structured, predictable.

### 6.3 Visual Impairment Mode
- **Purpose:** Non-visual access to visual content.
- **Transforms:** Describe diagrams/charts, audio-description style prose, high-clarity structure.
- **Feel:** Descriptive, explicit, easy to follow without seeing visuals.

### 6.4 Hearing Impairment Mode
- **Purpose:** Visual-first replacement for spoken/audio content.
- **Transforms:** Caption-style sections, key points, visual summaries, structured notes.
- **Feel:** Organized, text-forward, scannable blocks.

**Engine (MVP):** Client-side helper functions that rewrite input text per mode (simulated AI). Outputs must be noticeably different per mode.

---

## 7. Page Structure & Requirements

### 7.1 Hero
- Headline: **"One lesson. Every learner."**
- Subhead: Transform educational content into accessible formats instantly.
- Primary CTA → scroll to interactive demo.
- Premium startup aesthetic.

### 7.2 Interactive Demo *(P0 — highest priority)*
- **Layout:** Split screen (input left, output right).
- **Input:** Textarea, "Paste example", optional PDF upload (client-side text extraction or placeholder).
- **Output:** Transformed content with mode tabs: Dyslexia | Autism | Visual | Hearing.
- **Behavior:** Instant update on mode change; smooth Framer Motion transitions.

### 7.3 Scroll-Based Features
- Four sections (one per mode), sticky scroll storytelling.
- Same sample assignment morphs visually through each mode.
- Blink-inspired *feel* (not copy): Framer Motion, sticky sections, premium transitions.

### 7.4 How It Works
- Three steps: Upload/Paste → Choose Mode → Generate.
- Minimal copy, clear icons.

### 7.5 Impact
- 3–4 stat cards with placeholder but credible figures (e.g. 1 in 5 students).
- Short labels; no paragraph walls.

### 7.6 Footer
- Logo/name, tagline, minimal links (optional: GitHub, demo).

---

## 8. Design System

| Element | Direction |
|---------|-----------|
| Typography | Strong hierarchy; readable body (16px+), display for headlines |
| Color | Neutral base + one accent (education/trust: teal or indigo) |
| Shape | Rounded corners (lg–2xl), soft shadows |
| Motion | Framer Motion: fade/slide on mode change; scroll-triggered reveals |
| Components | shadcn/ui + Tailwind; consistent spacing scale (4/8/16/24/32) |
| A11y UI | High contrast, focus states, semantic HTML |

---

## 9. Technical Architecture

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| Motion | Framer Motion |
| Data | None (in-memory state) |
| Transform | `lib/transform.ts` — pure functions per mode |
| Deploy | Vercel-ready static/SSR marketing page |

**Non-goals:** Auth, DB, API routes (unless PDF parsing needs a tiny client lib), LMS, grading, chat, dashboards.

---

## 10. Success Metrics (Hackathon)

| Metric | Target |
|--------|--------|
| Time to “aha” | &lt; 30 seconds from landing to mode comparison |
| Mode distinction | Judges can articulate 4 different outputs |
| Visual polish | Feels like a funded startup landing page |
| Stability | Demo works offline after build; no broken CTAs |

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Transformations feel fake | Invest in copy rules per mode; use realistic classroom examples |
| Scope creep | PRD non-goals enforced; PDF optional only |
| Performance | Client-only transforms; debounce only if needed |
| Accessibility irony | WCAG basics on marketing site itself |

---

## 12. Delivery Checklist

- [ ] PRD approved (this document)
- [ ] Landing: Hero, Demo, Features scroll, How It Works, Impact, Footer
- [ ] Four modes with distinct mock transforms
- [ ] Example content + paste flow
- [ ] `npm run build` passes
- [ ] README with run instructions

---

## Appendix: Example Transform

**Input:**  
"Photosynthesis is the process by which plants convert sunlight into energy."

| Mode | Sample output direction |
|------|-------------------------|
| Dyslexia | Short chunks + bold key terms |
| Autism | Step 1 / Step 2 / Step 3 numbered |
| Visual | "Imagine green leaves in sunlight…" descriptive |
| Hearing | `[KEY IDEA]` blocks, caption-style headers |

---

*End of PRD — AdaptED Hackathon MVP*
