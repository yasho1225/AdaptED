---
version: 3
name: AdaptED
description: A dark, calm workspace for teachers. One blue-black ground with a ladder of lighter surfaces, soft-white type, and one accent, highlighter yellow. Everything a student reads is paper; everything a teacher operates is dark. The only ornament is a highlighter's chisel cut.

colors:
  canvas: "#070B1D"
  surface: "#0C1330"
  surface-2: "#141D42"
  surface-3: "#1D2856"
  ink: "#F2F4FB"
  ink-2: "#C5CCE2"
  ink-3: "#9AA4C6"
  yellow: "#FFD43B"
  on-yellow: "#0A1028"
  paper: "#F6F7FB"
  paper-ink: "#0F1D4A"
  need-dyslexia: "#7CC4F2"
  need-adhd: "#FF9F66"
  need-apd: "#5ED6A6"
  need-autism: "#BBA2F5"

typography:
  display: "Bricolage Grotesque, 700–800, width 80–94%"
  text: "Atkinson Hyperlegible Next, 400/700"
  scale: [14, 16, 18, 24, 32, "head clamp(40–80)", "display clamp(64–136)"]

rounded:
  panel: 12px
  field: 8px
  button: chisel (no radius)
  tile: 0

motion:
  ease-out: "cubic-bezier(0.23, 1, 0.32, 1)"
  ease-expo: "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-in-out: "cubic-bezier(0.77, 0, 0.175, 1)"
  press: 140ms
  hover: 180ms
  ui: 240ms
---

# AdaptED — DESIGN.md

The design system for the AdaptED site, in the DESIGN.md format. Version 3 replaces the blue page and its colour-block sections with one consistent dark ground, at the team's request, and removes the clutter an audit found (see [docs/UI-AUDIT.md](docs/UI-AUDIT.md)). House rules come from tasteskill and Impeccable, motion rules from Emil Kowalski's design-engineering skill, and the dark-surface ladder from studying Linear's and Raycast's DESIGN.md files (awesome-design-md).

## Overview

**The idea.** A teacher marks what is hard with a highlighter. Its chisel tip makes a stroke that starts and ends on a slant, and that one slanted cut is the only ornament on the page: the hero stage, every button, every picture frame, the list bullets, the footer's wordmark blocks.

**The rule that makes it consistent.** Everything a student reads is paper (`paper` #F6F7FB, dark ink). Everything a teacher operates is dark (the canvas and its surfaces, light ink). A worksheet always sits in a dark frame, like a document in an app window.

**The live thing.** The hero worksheet in its dark app frame: switch versions and the science words lift off as highlighted copies and land where the same words sit in the new version, while the caption quotes what AdaptED's own code measured for that version (reading level, words per sentence, questions kept: the same numbers the studio shows). The studio below is the whole working product.

**Pictures.** The product is the picture: live HTML fragments marked `data-ui`, and crops of real worksheet versions captured from the app (`scripts/capture-ui.mjs`). No stock photos, no illustrations of "AI".

## Colors

Restrained: one ground family, one ink family, one accent.

| Token | Value | Role |
| --- | --- | --- |
| `canvas` | `#070B1D` | The page ground: blue-black, never pure black |
| `surface` | `#0C1330` | One step up: panels, frames, bands that mark a chapter |
| `surface-2` | `#141D42` | Two steps up: fields, chips, tab rails, tiles on a band |
| `surface-3` | `#1D2856` | Three steps up: hover, the logomark tile |
| `ink` | `#F2F4FB` | Headings and running text (17.8:1 on canvas) |
| `ink-2` | `#C5CCE2` | Secondary text (12.2:1 on canvas) |
| `ink-3` | `#9AA4C6` | Notes and metadata (7.9:1 on canvas, 5.7:1 on surface-3) |
| `yellow` | `#FFD43B` | The one accent: primary actions, the hero stage, highlights, the active step, focus rings |
| `on-yellow` | `#0A1028` | Type on yellow (13.2:1) |
| `paper` | `#F6F7FB` | Worksheets only: a soft cool off-white, never stark white (BDA style guide) |

Need colours label the four versions and nothing else: sky `#7CC4F2`, apricot `#FF9F66`, mint `#5ED6A6`, lavender `#BBA2F5` on dark (6:1 or better on every surface); deeper tones of the same hues on paper. Barriers are yellow, never red: the barrier is in the worksheet, not the student. The highlighter always carries dark ink, on paper or on the dark ground.

Tokens in code: `--paper` and `--paper-2` always mean "the ground here" and "one step up", so a component reads right on the canvas, inside a panel, on a band, or on paper (`.sheet` resets them to the light values).

## Typography

- **Display: Bricolage Grotesque** (variable, self-hosted subset, weights 700–800). Page headings only. h1 at 800 and width 80%; h2 and h3 at 700, one weight lighter because light type on a dark ground reads heavier.
- **Text: Atkinson Hyperlegible Next** (Braille Institute). Everything people read, including every heading inside a worksheet. Tabular figures for numbers. No monospace.

Eight sizes in all outside product fragments at 1440px (14, 16, 18, 24, 32, 77, 131 and the footer mark):

| Step | Size | Use |
| --- | --- | --- |
| display | `clamp(4rem, 2.4rem + 6.4vw, 8.5rem)` | The hero headline |
| head | `clamp(2.5rem, 1.6rem + 3.6vw, 5rem)` | Section headings, two lines or fewer at every width |
| title | `2rem` | The statement, step headings |
| lead | `clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)` | The hero sentence, tile names, the studies summary |
| body | `1.125rem` / 1.6 | Running text |
| small | `0.875rem` | Captions, sources, notes. Nothing anyone reads goes below 13px |

## Layout

- One container: max 76rem, margins 16 / 24 / 32px, equal on both sides.
- A 12-column grid with 40px gutters in every section; a section heading sits on columns 1–7 with its one-sentence intro on 8–12.
- Sections are 96–128px apart; bands (a full-width `surface`) mark every other chapter instead of lines.
- One idea per section, said once.

| Section | Ground | Composition |
| --- | --- | --- |
| Nav | canvas, 85% with blur | Logomark and wordmark; three links with an active-section bar; Calm mode; Try it. Phones: Try it and a menu |
| Hero | canvas | Headline top-left; one sentence; one action; the measured caption. The yellow chisel stage bleeds off the right edge, holding the worksheet in a dark app frame |
| Where students get stuck | canvas | Statement with two inline pictures, from column 6 |
| Try it (studio) | canvas | Two dark panels (assignment, student); the Adapt button closes the student panel; results below |
| How it works | band | One bar of four steps, each as wide as the step really takes; the bar is the step picker, with that step's working picture below |
| What each version adds | canvas | Four tabs; the chosen version's picture, purpose, and kinds of help with sources |
| Built on research | band | Six source tiles; the seven studies behind one disclosure |
| What you can count on | canvas | Heading across the top, two columns of plain statements |
| Close | band | The four versions on a canvas chisel slab, cropped by the section edges; the closing line and action |
| Footer | canvas | The wordmark built from chisel blocks ("Adapt" in ink, "ED" in yellow); links; disclaimers |

## Elevation & Depth

Flat. Depth comes from the surface ladder: each step lighter is one step closer. No shadows, no glows, no gradients. Lines appear only inside product fragments (`data-ui`), where a form field or a table needs them.

## Shapes

- **The chisel:** a parallelogram whose short sides slant at about 18° (horizontal offset ≈ 0.32 × height). Custom property `--cut`.
- Buttons, picture frames, bullets, the hero stage and the footer blocks are chisels. Tiles are square. Panels and worksheets keep a 12px radius (they are the product, not the page).

## Components

**Logo.** A logomark (a worksheet's three lines, the middle one on a yellow chisel stroke, on a `surface-3` tile; the same drawing as the favicon) and the wordmark "Adapt" + "ED", with ED in yellow.

**Navigation.** Sticky, canvas at 85% with a 12px blur (the one blurred surface). Three links; the section on screen gets a 3px yellow bar and `aria-current="location"`. On phones the links move into a menu that opens below the bar (200ms, from 8px above), takes focus, and closes on Escape, on a tap outside, or when the screen widens.

**Buttons.** Flat chisels, 48px tall (40px small, 44px on touch). Primary: yellow with `on-yellow` type. Neutral: ink with dark type. Quiet: one surface step up. Press `scale(0.97)` in 140ms; hover only on fine pointers; on keyboard focus the button squares up and shows a 3px yellow ring.

**Panels.** `surface` on the canvas (`surface-2` on a band), 12px radius, no border. Never a panel inside a panel.

**Document frames.** A panel whose header names the document (with the need dot) and whose body is paper. Used for the hero worksheet, before/after, the four-up comparison and the student view.

**Tabs.** Text tabs on a `surface` rail; the selected tab is ink with dark type. In the hero frame the selected tab is paper, joined to the worksheet below it. Arrow keys move between tabs.

**Chips and fields.** Filled one step up from their ground; a selected chip is ink with dark type and a check. Fields carry a quiet 1px line and a yellow focus ring.

**Disclosures.** A plain row with a bold label, a one-line summary of what is inside ("4 kinds of help on · same goals as the class"), and a chevron that turns in 200ms. Closed content is out of layout (`display: none`).

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entrances, press, menus |
| `--ease-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals of 800ms and longer |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | The stage wipe |
| `--t-press` / `--t-hover` / `--t-ui` | 140 / 180 / 240ms | Press, colour hover, UI changes |

- **Signature move:** the hero stage opens like a highlighter stroke, a clip-path wipe from its slanted edge, while the worksheet settles from a slight scale.
- **The live move:** the key-word flight in the hero.
- **Entrances:** a section's heading, intro and main block arrive in order, 70ms apart, rising 24px, once. Only content present on first render is marked; anything a tab mounts later appears at once.
- **Feedback:** every control responds to press; hover only behind `(hover: hover) and (pointer: fine)`; UI changes stay under 300ms.
- **Smooth scrolling:** Lenis at `lerp: 0.12`; a native scroll during a glide hands the scroll back to the browser.
- **Calm mode** (and `prefers-reduced-motion`): the finished page; no travel, no smoothing, no autoplay.

## Do's and Don'ts

**Do**
- Put student-facing text on paper and teacher controls on dark.
- Use yellow for one thing per screen region: the action, the highlight, or the selected step.
- Show measured numbers, computed by code, and label estimates as estimates.
- Hide the finer options behind a disclosure that says what they are set to.
- Keep headings to two lines and running text in full ink at 16px or more.

**Don't**
- No second accent colour, no gradients, glows, glass panels or shadows at rest.
- No colour-block sections: chapters change by one surface step, never by hue.
- No eyebrow labels, index numbering, tiny letter-spaced capitals or monospace.
- No icon-topped feature cards; no panel inside a panel.
- No invented proof: no testimonials, logos or statistics that are not sourced.

## Responsive Behavior

| Width | Changes |
| --- | --- |
| < 768px | Nav: logo, Try it, menu. One column. The hero stage runs full width under the action; the caption follows it. Studio panels stack, the Adapt button closing the student panel. Result numbers two by two. Step bar and version tabs stack. |
| 768–1023px | Nav links visible; tiles two across. |
| ≥ 1024px | Full compositions: the stage on the right columns, panels side by side, the step bar in one row sized by time, tiles three across. |

Touch targets: 44px on coarse pointers (source links get a 44px hit area). Text never under 13px.

## Iteration Guide

- Add a section by choosing its ground (canvas or band, alternating) and one composition not used by its neighbours.
- Add a control inside the studio from the existing chip, field, tab and button classes; never introduce a new colour.
- Re-run `scripts/capture-ui.mjs` whenever the worksheet design or the studio's look changes, so the pictures match.

## Known Gaps

- The page is dark only. Worksheets stay on paper, and the student view offers cream, soft-blue and grey reading backgrounds, but there is no light theme for the page itself.
- No video: the hero transformation is the moving picture.
