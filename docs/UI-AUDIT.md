# UI audit and redesign, October 2026

A full audit of the AdaptED front end, followed by the redesign it called for. The brief from the team: the site was good but cluttered, with too much information; use consistent colours on a dark background with light text; make the logo and navigation look right; keep the hero transformation and make it better; keep every feature working.

Tools: Impeccable (audit, distill, craft floor), tasteskill v2 (house rules, the browser inspector, the critique rubric), Emil Kowalski's design-engineering rules (motion and interaction), awesome-design-md (dark-surface systems from Linear and Raycast), and the Playwright CLI (walkthroughs). Every number below was measured in a real browser.

## Health score (Impeccable audit)

| Dimension | Before | After | What moved it |
| --- | --- | --- | --- |
| Accessibility | 3 | 4 | Phones had no navigation; source links had 20px hit areas |
| Performance | 3 | 3 | Lighthouse unchanged: 100 desktop, 93 mobile, no layout shift |
| Theming | 2 | 4 | Five section colours and 20 hard-coded colours, now one token ladder and none |
| Responsive | 2 | 4 | Long stacked sections on phones; four metric rows; no menu |
| Implementation integrity | 3 | 4 | The before/after was shown three times |
| **Total** | **13 / 20** | **19 / 20** | |

## Findings

**P1 Phones had no navigation.** Below 768px the bar showed only the logo and Calm mode: no section links, no "Try it". *Fixed:* a "Try it" action and a menu that takes focus, closes on Escape, on a tap outside, or when the screen widens.

**P1 Five ground colours read as patchwork.** Blue, navy, light grey, white tiles and yellow fields, with white studio panels on blue. *Fixed:* one blue-black canvas and a ladder of three lighter surfaces; soft-white type; yellow as the only accent. One rule makes it consistent: everything a student reads is paper, everything a teacher operates is dark.

**P1 The studio showed 53 controls at once.** *Fixed:* needs, grade and language stay visible; kinds of help, learning goals and notes fold into "Fine-tune", whose summary line says what they are set to ("4 kinds of help on · same goals as the class"). The Adapt button now closes the student panel, right after the settings it uses.

**P2 The same before/after appeared three times** (hero, a showcase section, the studio). *Fixed:* the showcase section is gone; the hero carries the transformation.

**P2 "How it works" took 3.8 screens of scrolling with no controls.** *Fixed:* one bar of four steps, each as wide as the step really takes; the bar is the step picker, with that step's working picture beside it.

**P2 "What each version adds" listed 21 items at once (5.7 screens on a phone).** *Fixed:* four tabs, one version at a time, with its picture, purpose, and each kind of help with its source.

**P2 Twenty hard-coded colours across six files.** *Fixed:* none left; every colour is a token.

**P3 The logo was text only.** *Fixed:* a logomark (a worksheet's lines with one on a highlighter stroke, the same drawing as the favicon) beside the wordmark.

**P3 The hero's notes block carried about 330 words.** *Fixed:* one caption that quotes what AdaptED's code measured for the version on screen: reading level, words per sentence, and questions kept.

**P3 Seven studies always open under the research tiles.** *Fixed:* behind one "Peer-reviewed studies (7)" disclosure.

Also fixed along the way: the inspector read hidden text inside a closed disclosure as a label (closed content now leaves layout entirely), and source links got 44px hit areas.

## Before and after

| Measure | Before | After |
| --- | --- | --- |
| Page length, desktop | 15.8 screens | 10.2 screens |
| Page length, phone (with a result) | about 26 screens | 16.6 screens |
| Words on the page | 3,469 | 2,652 |
| Headings | 22 | 14 |
| Ground colours | 5 | 1, plus three surface steps |
| Font sizes outside product UI | 8 | 8 |
| Hard-coded colours in components | 20 | 0 |
| Controls visible in the studio, with a result showing | 53 | 30 |
| tasteskill inspector | 0 FAIL, 7 WARN | 0 FAIL, 4 WARN |
| axe (WCAG 2.2 AA), 4 widths | 0 violations | 0 violations |
| Lighthouse desktop | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Lighthouse mobile | 93 / 100 / 100 / 100 | 93 / 100 / 100 / 100 |
| Studio end-to-end checks | 17 / 17 | 17 / 17, motion on and off |

The four inspector warnings that remain are deliberate: the statement under "Where students get stuck" runs to four lines at desktop width (25 words; the fourth line comes from its two inline pictures); the research sources are a grid of tiles (they are links, set large, and scan well); there is no video (the hero transformation is the moving picture); and the faces are Bricolage Grotesque and Atkinson Hyperlegible rather than the inspector's dealt face, for readability.

## Critique (tasteskill rubric)

```
ROUND 2
Seen in one second: "One lesson. Every learner." beside a yellow stage holding a worksheet.
Idea (one sentence): A teacher's highlighter, the tool for marking what is hard, becomes the page's one shape and one colour.
Live thing: switch versions in the hero; the key words fly to their new places and the caption quotes the measured change.
Layout words by section: hero=stage split / stuck=statement / studio=app / how=step bar + picture / versions=tabs + picture list / research=tiles / principles=two lists / close=picture split / footer=wordmark blocks
Scores: design 8 · usability 8.5 · creativity 7.5 · content 8 → overall 8.1
Caps applied: none.
Top three problems remaining:
1. The page is dark only; worksheets and the student view stay readable on paper, but there is no light theme for the page itself.
2. On phones the hero tabs scroll sideways (five versions do not fit); the selected tab always shows.
3. No footage. The open photo and video collections were unreachable from the build environment.
```

## Final pass: less to take in

The team's next note: the site was easy to be overwhelmed by. This pass removed anything gimmicky or unnecessary. Motion was audited with Emil Kowalski's improve-animations rules (purpose and frequency first: a movement that repeats, or that the reader didn't ask for, goes); content with Impeccable's distill (one idea per section, said once). Locations refer to the code before this pass (commit `1313791`).

| # | Severity | Category | Location | Finding | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Purpose and frequency | `site/hero.tsx` | The hero moved through all five versions on its own, every 5.2 seconds, with a progress bar and a pause button. The worksheet changed while people were reading it. | Removed. A version changes only when someone picks it. |
| 2 | HIGH | Purpose and frequency | `studio/studio.tsx` (`MIN_SCAN_MS`), `studio/transform-view.tsx` | Every result was held back at least 1.5 seconds so a scan line could play, then the new version assembled section by section. Switching versions took 1.6 seconds every time. | Removed the wait, the scan line and the assembly. A version now shows in about 0.1 seconds. |
| 3 | HIGH | Interruptibility | `motion/motion-provider.tsx` | Lenis replaced the browser's own scrolling. It needed a guard so that scrollbar drags and find-in-page during a glide weren't pulled back. | Removed Lenis and ScrollTrigger. Scrolling is native, and in-page links use CSS smooth scrolling, which is off in Calm mode. |
| 4 | MEDIUM | Purpose | `motion/calm-magnet.tsx`, `vendor/magnet.tsx` | The main buttons drifted toward the pointer. | Removed. Buttons stay put. This also drops the one MIT + Commons Clause component. |
| 5 | MEDIUM | Cohesion | `motion/reveals.tsx`, `motion/heading-reveal.tsx` | Every section's heading, intro and blocks rose in as they scrolled into view: the same move about 20 times a visit. Content stayed hidden until the script ran. | Removed. Sections are simply there. |
| 6 | MEDIUM | Purpose and frequency | `site/how-visuals.tsx` | Each "How it works" picture replayed an entrance whenever it was chosen: a scan line, chips springing in with overshoot, a card deal, ticks drawing. | Removed. The picture shows at once. |
| 7 | LOW | Easing | `doc/adapted-document.tsx` | Ticking a box on the student's checklist bounced (an overshoot curve) and drew the check. Students tick it many times. | A plain filled box with a check. |
| 8 | LOW | Purpose | `studio/result-panel.tsx` | The check beside each measurement drew itself on every result. | Static. |
| 9 | HIGH | Content | `studio/studio.tsx` | The studio ran itself when it scrolled into view: tabs, measurements and two document frames appeared before anyone asked. | It waits for the Adapt button. The studio first shows 15 controls instead of 29. |
| 10 | MEDIUM | Content | `site/sections.tsx` (`Principles`) | "What you can count on" repeated promises made elsewhere: questions kept, no answers given away and key words kept (How it works); free and nothing saved (the close); no names (the student step); dyslexia fonts (the studies); no promised results (the footer). | Removed. |
| 11 | MEDIUM | Content | `site/versions.tsx`, `site/sections.tsx` (`Research`) | Two sections, "What each version adds" and "Built on research", covered the same sources. | Merged into one "Built on research": the version tabs, each kind of help with its source, one sentence naming the guidance, and the studies behind a disclosure. Six large tiles became one sentence. |
| 12 | LOW | Content | `site/sections.tsx` (`Stuck`) | Two thumbnail pictures inside the statement pushed it to four lines. | Removed. The statement is two sentences on three lines, and "Rewriting it by hand takes hours." is body text. |
| 13 | LOW | Content | `site/sections.tsx` (`Footer`) | The footer opened with the wordmark built from seven tall chisel blocks, 20 to 30% of a screen. | The logo and three links on one row. |
| 14 | LOW | Navigation | `site/nav.tsx` | Three links, one of them for the section that was merged. | Two links: How it works, Research. |

What still moves, and why it earns it:

- **The hero on load**, once: the headline rises out of its lines and the stage opens like a highlighter stroke. This is the page's one authored moment.
- **The key-word flight**, only when someone picks a version in the hero. It shows the product's promise (the key words stay; the way in changes). It is off in Calm mode.
- **Small feedback**: buttons respond to a press, colours change on hover, the mobile menu drops 8px in 200ms, a disclosure's chevron turns. All of it is under 300ms.
- **Progress while AI writes**: a spinner and a pulsing outline, because a live AI version takes about 20 seconds.

### Measured before and after

Both builds ran on the same machine and were measured with the same scripts. Lighthouse runs were interleaved. "First visit" means loading the page and scrolling through it without touching anything.

| Measure | Before | After |
| --- | --- | --- |
| Page length, desktop, first visit | 10.1 screens | 6.6 screens |
| Page length, desktop, with a result | 10.1 screens | 8.0 screens |
| Page length, phone, first visit | 16.3 screens | 10.1 screens |
| Page length, phone, with a result | 16.3 screens | 12.6 screens |
| Words, first visit | 2,311 | 1,156 |
| Words, with a result | 2,311 | 2,149 |
| Sections / section headings | 8 / 7 | 6 / 5 |
| Nav links | 3 | 2 |
| Controls on the page, first visit | 69 | 52 |
| Elements that move while the page loads and scrolls (tasteskill inspector) | 93, 40 of them scripted | 10, none scripted |
| Time from choosing a version to seeing it, motion on | 1.6 s, every time | 0.1 s (1.0 s the first time) |
| JavaScript transferred | 270 KB | 242 KB |
| Animation dependencies | gsap, @gsap/react, lenis | gsap |
| Lighthouse mobile performance, three runs each | 89–90 (LCP 3.5–3.6 s, Speed Index 2.0 s) | 87–92 (LCP 3.4 s, Speed Index 1.3–1.4 s) |
| Lighthouse desktop | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| tasteskill inspector | 0 FAIL, 4 WARN | 0 FAIL, 3 WARN |
| axe (WCAG 2.2 AA), 4 widths | 0 violations | 0 violations |
| Studio end-to-end checks | 17 / 17, motion on and off | 18 / 18, motion on and off (new check: nothing runs until asked) |

The earlier table reports Lighthouse mobile at 93. That was a single run. Run three times alongside the new build, the same code scores 89–90.

The three inspector warnings that remain are deliberate:

- **still-page.** The inspector asks for an entrance in every section. That is what this pass removed, because the audience includes students with ADHD and autistic students, and teachers who are short on time.
- **No video.** The hero transformation is the moving picture.
- **The typefaces.** The page uses Bricolage Grotesque and Atkinson Hyperlegible, chosen for readability.

## What was kept

Every feature: the hero transformation, pasting or uploading an assignment, "Create one with AI", the four needs and 21 kinds of help, language choice and translation, before/after, student view (text size, spacing, backgrounds, one section at a time, read aloud), what changed and why with sources, teacher notes, compare all four, PDF, print, copy, Calm mode, and every research link.
