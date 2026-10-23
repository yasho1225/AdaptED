# AdaptED design system

Reviewed against the Impeccable craft floor and the UI UX Pro Max checklist (Swiss/minimal style for an education tool).

## World
A committed blue field with white type. Worksheets are the only paper objects on it — the reading surfaces stay dark-on-paper, because that is where students read. A highlighter yellow marks barriers and the single primary action; nothing else is yellow.

## Color psychology: one feeling per section
The page color changes with the story. Each color was picked for the feeling it should carry, and every one passes WCAG AA with white text, including the in-between colors while the page fades.

| Section | Mood | Color | Why |
| --- | --- | --- | --- |
| Opening, tool, footer | Trust | `#1E40AF` | Blue reads as calm and dependable; teachers are asked to trust an AI tool. |
| The problem | Weight | `#2B2766` | Dusk indigo: the darkest, most serious point, where we name what is hard. |
| How it works | Steady | `#162B6B` | Navy: structure and reliability. |
| Research | Grounded | `#0E4A5A` | Deep teal: blue's trust plus green's growth, for credibility. |
| Promises | Safe | `#14532D` | Green means safe and "go": reassurance. |
| Closing call to action | Hope | `#FFD43B` | Yellow: optimism and attention, used once at full strength. |

Other color jobs:
- **Barrier highlights are yellow, never red.** Red says "wrong"; the barrier is in the worksheet, not the student.
- **Success is mint** (`#9EEBC8`); warnings are warm amber (`#FFD99A`), never alarm red.
- **Need colors** are soft and low-saturation (sky, apricot, mint, lavender) so they can label without shouting.

Text on the canvas uses translucent white (`--ink-2` 88%, `--ink-3` 74%) so contrast holds on every mood: lowest 5.5:1.

Paper surfaces (`.sheet`, `.on-paper`) keep dark ink on warm paper (BDA: avoid stark white).

## Type
Two jobs, two faces:
- **Bricolage Grotesque** (variable width and optical size) for headlines on the blue page only: weight 800, condensed (h1 80% width, h2 86%), tight leading. Hero up to 9rem, section heads up to 4.5rem. It gives the page a confident, poster-like voice.
- **Atkinson Hyperlegible Next** (Braille Institute) for everything people read: body (17px, 1.6), labels, and every heading inside a worksheet. **Atkinson Hyperlegible Mono** only for measurements and syllable notation. Body measure ≤ 70ch; nothing under 12px.

Worksheets never use the display face: a student's page is for reading, not for personality.

## Touch and targets
Controls are at least 40px tall with a mouse and 44px on touch screens (`pointer: coarse`); a radio inside a card is hit through the whole card.

## Layout
12-column Swiss grid, flush-left. Sections are separated by full-width rules and alternating bands — not rows of identical cards. No labels above headings. Radii: 4 / 8 / 12px.

## Motion (emotional arc)
Every moment is tied to a feeling or a fact, and all of it is removed by Calm mode and `prefers-reduced-motion`:
1. **"The key words stay"** (hero, the signature moment) — switching versions of the real worksheet lifts its science vocabulary off as highlighted copies that land where the same words sit in the new version, while the new layout fades in around them. It shows the product's promise — the vocabulary is kept, only the way in changes — instead of claiming it. Auto-tours once, with a visible pause button. The headline rises out of line masks in pure CSS on first paint.
2. **Mood fade** — the page color eases between section moods as you scroll (GSAP on `--canvas`). Calm mode shows each section's color still.
3. **Stuck → can start** — in the problem section, the real 139-word passage loosens into the real adapted chunks while the section holds (large screens) or as it scrolls past (small screens). This is the only pinned section.
4. **How it works** — the picture beside the steps stays put (CSS sticky) and changes with each step: barriers highlighted under a scan, the student profile, the four real versions dealt out as a fan, then a ledger of fidelity checks computed live. Small screens and Calm mode show each picture under its step.
5. **Relief** — when every question is confirmed kept, a check mark draws itself; ticking a student checklist box springs and draws its check.
6. **Pull** — the three main buttons lean slightly toward the pointer (React Bits Magnet); off on touch and in Calm mode.

## Imagery
The product is the imagery: every picture on the page is a real worksheet, a real adapted version, or a number the code computed. No stock photos of classrooms, no illustrations of "AI". See `IMAGES.md` for where photography could be added and the rules for it.

## Writing
Plain language, short sentences, everyday words. Site copy measured with AdaptED's own scorer: about grade 8.8 → grade 3.9 (Flesch–Kincaid), excluding citations and sample worksheet text.

## Browser surfaces
Themed selection (yellow on navy), caret, scrollbar, focus ring (3px yellow on canvas, indigo on paper), underline offset, tabular numerals in measurements.
