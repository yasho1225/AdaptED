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
One family: **Atkinson Hyperlegible Next** (Braille Institute) for display (800, −0.025em) and body (17px, 1.6); **Atkinson Hyperlegible Mono** only for measurements and syllable notation. Display max 6rem; body measure ≤ 70ch.

## Layout
12-column Swiss grid, flush-left. Sections are separated by full-width rules and alternating bands — not rows of identical cards. No labels above headings. Radii: 4 / 8 / 12px.

## Motion (emotional arc)
Three moments, each tied to a feeling, all removed by Calm mode and `prefers-reduced-motion`:
1. **Mood fade** — the page color eases between section moods as you scroll (GSAP on `--canvas`). Calm mode shows each section's color still, with no fading.
2. **Stuck → can start** — in the problem section, the real 139-word sample passage loosens into the real adapted chunks while the section holds in place (large screens) or as it scrolls past (small screens).
3. **Relief** — when every question is confirmed kept, a check mark draws itself in the results.

The hero worksheet still wipes between versions like a highlighter stroke, with a visible pause control.

## Writing
Plain language, short sentences, everyday words. Site copy measured with AdaptED's own scorer: about grade 8.8 → grade 3.9 (Flesch–Kincaid), excluding citations and sample worksheet text.

## Browser surfaces
Themed selection (yellow on navy), caret, scrollbar, focus ring (3px yellow on canvas, indigo on paper), underline offset, tabular numerals in measurements.
