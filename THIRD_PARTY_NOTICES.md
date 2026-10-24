# Third-party notices

AdaptED's own code is in this repository. These are the outside pieces it includes or depends on, and their licenses.

## Included in this repository

### React Bits — Magnet component

`src/components/vendor/magnet.tsx` is the Magnet animation from [React Bits](https://reactbits.dev) ([source](https://github.com/DavidHDev/react-bits)) by David Haz. It is used as part of this website, which the license allows. The component is not offered for sale or redistributed on its own. License text, as shipped with React Bits:

```
MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

The same restriction covers the React Bits tools (Background Studio, Texture Lab, Shape Magic, Center Stage, Sound Lab and any tools added later) and the sounds in the sound library. **You may not sell, sublicense, or redistribute the tools or the sounds themselves, or offer the tools or a substantially similar copy of them as a hosted service-whether alone, in a bundle, or as a ported version.**

What you make with the tools is yours to use. You can use exported code, images, videos, and audio files in any personal or commercial application, website, or product, including paid ones. **You may not sell or redistribute the exports on their own, either individually or as the product itself, such as a sound, texture, background, or template pack.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Fonts (SIL Open Font License 1.1)

- **Atkinson Hyperlegible Next**, by the Braille Institute of America. Body text, measurements, and syllable notation.
- **Bricolage Grotesque**, by Mathieu Triay. Headlines and the wordmark.

The site loads Atkinson Hyperlegible Next through `next/font/google`. Bricolage Grotesque is self-hosted as `src/app/fonts/BricolageGrotesque-Variable-subset.woff2`: the Google Fonts variable font (optical size, width, weight) reduced with fontTools to basic Latin plus curly quotes and dashes, and weights 700–800, as the OFL permits. Static copies of the cuts used by the share image (`src/app/opengraph-image.tsx`) are in `assets/fonts/`, each with its license file (`OFL-*.txt`).

### Agent skills for AI coding assistants (`.claude/skills/`)

These are instructions and helper scripts that an AI coding assistant reads while working on this repository. They are development tools only: nothing in them is part of the website, and the site's build, lint and tests ignore them. Each is copied unchanged from its source, and the full license for each is in `.claude/skills/LICENSES/`.

| Skill | Author | Source | License |
| --- | --- | --- | --- |
| `taste-skill` | Leonxlnx | https://github.com/Leonxlnx/taste-skill | MIT |
| `animate`, `animate-expo`, `animation-performance`, `animation-vocabulary`, `apple-design`, `ask-sonner`, `break-ui`, `emil-design-eng`, `find-animation-opportunities`, `improve-animations`, `mobile-native`, `pick-ui-library`, `prototype`, `review-animations`, `write-swift` | Emil Kowalski | https://github.com/emilkowalski/skill | MIT |
| `impeccable` | Paul Bakaus | https://github.com/pbakaus/impeccable | Apache 2.0 |
| `playwright-cli` | Microsoft | https://github.com/microsoft/playwright-cli | Apache 2.0 |
| `awesome-design-md` (the `design-md/` library) | VoltAgent | https://github.com/VoltAgent/awesome-design-md | MIT |

`awesome-design-md/SKILL.md` was written for this repository (it is the only file in that folder that is not upstream). Impeccable's automatic hooks and sub-agent definitions, which belong to its plugin form, were left out on purpose; see the README note on tooling.

## Dependencies (installed from npm, not copied here)

| Package | Use | License |
| --- | --- | --- |
| [GSAP](https://gsap.com) and `@gsap/react` | Animation (ScrollTrigger, timelines) | [Standard "no charge" license](https://gsap.com/standard-license) |
| [Lenis](https://lenis.darkroom.engineering) | Smooth scrolling (off in calm mode) | MIT |
| [Lucide](https://lucide.dev) (`lucide-react`) | Icons | ISC |
| [Next.js](https://nextjs.org), [React](https://react.dev) | Framework | MIT |
| [Zod](https://zod.dev) | Checking the AI's answer format | MIT |
| `@google/genai` | Gemini API client | Apache-2.0 |

See `package.json` for the full list.
