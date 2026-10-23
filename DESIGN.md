# AdaptED design system

Reviewed against the Impeccable craft floor and the UI UX Pro Max checklist (Swiss/minimal style for an education tool).

## World
A committed blue field with white type. Worksheets are the only paper objects on it — the reading surfaces stay dark-on-paper, because that is where students read. A highlighter yellow marks barriers and the single primary action; nothing else is yellow.

## Color (canvas)
| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `--paper` | `#1E40AF` | page field | — |
| `--paper-2` | `#1A3794` | alternating bands | — |
| `--ink` | `#FFFFFF` | headings, body | 8.7:1 |
| `--ink-2` | `#DCE5FF` | secondary text | 6.9:1 |
| `--ink-3` | `#BCCBF7` | tertiary text | 5.4:1 |
| `--brand` | `#FFD43B` | primary button, marks, step numerals | 6.1:1 as text |
| `--on-brand` | `#0F1F5C` | text on yellow | 10.7:1 |
| need accents | `#A9D4FF` `#FFC891` `#9EEBC8` `#E2C6FF` | dyslexia, ADHD, APD, autism | ≥5.6:1 |

Paper surfaces (`.sheet`, `.on-paper`) redefine the same tokens for dark ink on warm paper (BDA: avoid stark white).

## Type
One family: **Atkinson Hyperlegible Next** (Braille Institute) for display (800, −0.025em) and body (17px, 1.6); **Atkinson Hyperlegible Mono** only for measurements and syllable notation. Display max 6rem; body measure ≤ 70ch.

## Layout
12-column Swiss grid, flush-left. Sections are separated by full-width rules and alternating bands — not rows of identical cards. No labels above headings. Radii: 4 / 8 / 12px.

## Motion
One authored moment: the hero worksheet wipes between versions like a highlighter stroke, with a visible pause control; the studio's barrier scan is functional feedback. Calm mode and `prefers-reduced-motion` remove both.

## Browser surfaces
Themed selection (yellow on navy), caret, scrollbar, focus ring (3px yellow on canvas, indigo on paper), underline offset, tabular numerals in measurements.
