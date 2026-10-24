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

## What was kept

Every feature: the hero transformation and its tour, pasting or uploading an assignment, "Create one with AI", the four needs and 21 kinds of help, language choice and translation, before/after, student view (text size, spacing, backgrounds, one section at a time, read aloud), what changed and why with sources, teacher notes, compare all four, PDF, print, copy, Calm mode, and every research link.
