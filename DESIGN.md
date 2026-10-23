# AdaptED — DESIGN.md

The design system for the AdaptED site, written in the DESIGN.md format (Overview, Colors, Typography, Layout, Elevation, Shapes, Components, Motion, Do's and Don'ts, Responsive). Art direction was dealt with tasteskill v2 (direction **One motif**, seed 792400633) and kept to the brand where the brand is fixed: the blue page with white type the team asked for, and Atkinson Hyperlegible for everything people read. House rules from tasteskill and Impeccable, motion rules from Emil Kowalski's design-engineering skill.

## Overview

**The idea.** On this page, the Barrier Lens's highlighter stroke becomes the shape of every stage, button, bullet and band.

A highlighter has a chisel tip, so its stroke starts and ends on a slant. That one slanted cut is the only ornament on the page. It appears at four scales:

| Scale | Where |
| --- | --- |
| Enormous | The hero stage: a flat yellow field, its top-left corner cut on the slant, bleeding off the right and bottom edges, carrying the live worksheet |
| Large | The closing band, the footer's block-built wordmark |
| Medium | Every button and every picture frame |
| Text size | List bullets, the "ED" in the wordmark, inline picture frames inside a sentence |

**The live thing.** The hero worksheet: switch versions and the science words lift off as highlighted copies and land where the same words sit in the new version. The studio below is the whole working product.

**Pictures.** The product is the picture. Every image is the real interface: live HTML fragments marked `data-ui`, and raster crops of real worksheet versions captured from the app (`scripts/capture-ui.mjs`). No stock photos of classrooms; no illustrations of "AI".

## Colors

One ground, one ink, one accent; sections change the whole field as hard cuts, never fades.

| Token | Value | Role |
| --- | --- | --- |
| `blue` | `#0E2FA3` | The page ground (hero, statement, showcase, studio, principles, footer). White on it: 10.8:1 |
| `navy` | `#0A1B52` | Second field for the "How it works" chapter and ink on light fields |
| `paper` | `#F3F4F8` | Light field for the research chapter (cool, never cream) |
| `white` | `#FFFFFF` | Type on blue; surfaces on paper |
| `yellow` | `#FFD43B` | The accent: the motif, the primary action, barrier highlights. Never a text colour on light grounds |
| `on-yellow` | `#0A1B52` | Type and buttons on yellow |
| `sheet` | `#FEFDF8` | Worksheets only (inside `data-ui`): warm paper, per the BDA style guide |

Text on blue uses white at 100% (headings, body) and 82% (secondary); never below 74%. On paper: navy 100% and `#3A4675` secondary. Need colours (sky `#A9D4FF`, apricot `#FFC891`, mint `#9EEBC8`, lavender `#E2C6FF` on blue; deeper tones on paper) label the four versions and nothing else.

Barriers are yellow, never red: the barrier is in the worksheet, not the student.

## Typography

Two faces.

- **Display — Bricolage Grotesque** (variable, self-hosted subset, weights 700–800): headings only, on blue, navy, paper and yellow fields. Weight 800, width 80% (h1) / 86% (h2), tracking −0.015em, leading 0.9.
- **Text — Atkinson Hyperlegible Next** (Braille Institute): everything people read, including every heading inside a worksheet. Tabular figures for numbers. No monospace anywhere.

Six steps do the visible work (outside the product fragments the page uses eight sizes in all at 1440px: 14, 16, 18, 24, 32, 77, 131, and the footer mark):

| Step | Size | Use |
| --- | --- | --- |
| display | `clamp(4rem, 2.4rem + 6.4vw, 8.5rem)` | The hero headline, the footer wordmark |
| head | `clamp(2.5rem, 1.6rem + 3.6vw, 5rem)` | Section headings (two lines or fewer at every width) |
| title | `2rem` | The statement, step and version headings |
| lead | `clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)` | The hero sentence, tile names, list headings |
| body | `1.125rem` / 1.6 | Running text, max 60ch |
| small | `0.875rem` | Captions, sources, notes. Nothing anyone reads goes below 13px |

## Layout

- One container: max 76rem, side margins 16px (phone) / 24px (tablet) / 32px (desktop); equal on both sides everywhere.
- 12-column grid with 40px gutters in every section, so all splits land on the same column lines: text starts on column 1, and second columns start on column 5, 6, 7, or 8.
- Sections are 128–192px apart on desktop, 96px on phones; nothing inside a section is spaced that far.
- Neighbouring sections never share a composition.

Page order and blueprint per section:

| Section | Field | Blueprint |
| --- | --- | --- |
| Hero | blue | Fragment on a shaped stage: headline top-left, one action, the yellow chisel stage from 42% down holding the live worksheet |
| Where students get stuck | blue | Statement with inline thumbnails (32px max), starting on column 6 |
| One idea at a time | blue | Square plate, spare text: the before/after reading on a paper plate; tabs, title, two action cells |
| Try it (studio) | blue | The working product; panels are `data-ui` fragments |
| How it works | navy | Stages as one bar: four segments sized by how long each stage really takes, then the pictures for each stage |
| Built on research | paper | Large marks on tiles: one yellow heading tile, sources set large |
| What each version adds | paper | Two-column menu with picture bullets: each need, its supports, the source of each |
| What you can count on | blue | Heading across the top, then two columns of plain statements |
| Close | yellow | The object returns: the four versions on a blue chisel slab, cropped by the section edges, with the closing line |
| Footer | navy | The mark, built large: the wordmark knocked out of chisel blocks |

## Elevation & Depth

Flat. Surfaces are separated by a tone step (blue → white sheet, paper → white tile), never by a line or a shadow. Shadows only on things that float above the page (none on this site). Inside `data-ui` fragments the product keeps its own form-field borders.

## Shapes

- **The chisel**: a parallelogram whose short sides slant at about 18° (horizontal offset = 0.32 × height). Custom property `--cut`.
- Buttons, picture frames, bullets, the hero stage corner and the footer blocks use the chisel. Tiles and fields are square. Worksheets keep their 12px paper radius (they are the product, not the page).
- One button shape on the whole site: the chisel.

## Components

**Buttons.** Flat chisel, 48px tall (40px small, 44px on touch). Primary: yellow on blue/navy, navy on yellow. Secondary: white at 12% on blue, navy at 8% on paper. Press: `scale(0.97)` in 140ms. Hover (fine pointers only): fill steps lighter in 180ms. On keyboard focus the button squares up and shows a 3px ring, so the chisel never clips the ring.

**Navigation.** A plain bar on the page's blue: wordmark left (the "ED" on a yellow chisel), three text links, Calm mode, one action. No border, no blur.

**Tabs.** Text tabs with a filled active state; arrow-key navigation; inactive text stays at full contrast.

**Tiles.** Square, a tone step from the field, no border; the name set large, one line of what it informs, the source linked.

**Lists.** No rules between rows; space and a chisel bullet in the need colour.

## Motion

Emil Kowalski's rules with tasteskill's budget.

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entrances, press, anything under 600ms |
| `--ease-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals of 800ms and longer, line rises |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Wipes and shutters, things that travel while visible |
| `--t-press` / `--t-hover` / `--t-ui` | 140 / 180 / 240ms | Press, colour hover, UI changes |

- **Signature move (one):** the hero stage opens like a highlighter stroke, a clip-path wipe from its slanted left edge over 1.1s, while the worksheet settles from a slight scale.
- **The live move:** the key-word flight in the hero.
- **Entrances:** each section's parts arrive in reading order, 70ms apart, rising 24px with opacity, once, when 85% of the way up the viewport. Lists arrive row by row; tiles in sequence; headings rise out of line masks.
- **Feedback:** every control responds to press; hover only behind `(hover: hover) and (pointer: fine)`.
- **Never:** ease-in on anything the visitor waits for, `transition: all`, scale from 0, bounce, layout-property animation, scroll hijacking, content left hidden if a script fails.
- **Smooth scrolling:** Lenis at `lerp: 0.12`. A native scroll during a glide (scrollbar drag, keyboard, find-in-page) hands the scroll straight back to the browser.
- **Calm mode** (and `prefers-reduced-motion`) shows the finished page: no travel, no smoothing, no autoplay.

## Do's and Don'ts

**Do**
- Use the chisel for every action and picture frame.
- Keep headings to two lines at every width; say what the section is.
- Show the real product: live fragments and captured crops.
- Change fields with hard cuts at section edges.
- Keep running text in full ink at 16px or more.

**Don't**
- No gradients, glows, glass, or shadows at rest.
- No hairline rules or 1px outlined boxes outside real form fields and product fragments.
- No eyebrow labels, no index numbering (01/02), no tiny letter-spaced capitals, no monospace.
- No styled accent word in a headline.
- No icon-topped feature cards, no rows of identical cards.
- No invented proof: no testimonials, logos, or statistics that are not sourced.

## Responsive Behavior

| Width | Changes |
| --- | --- |
| < 640px | One column. Hero headline 2 lines at ~10vw; the yellow stage runs full width under the action, its corner cut kept, the worksheet cropped on the right rather than scaled. Statement left-aligned at 24px. Studio panels stack. Tiles two across. Menu one column. |
| 640–1023px | Two-column showcase and menu; tiles three across. |
| ≥ 1024px | Full compositions: stage on columns 5–12; sticky picture beside the stages; tiles four across. |

Touch targets: 44px on coarse pointers, 40px on fine. Text never under 13px.
