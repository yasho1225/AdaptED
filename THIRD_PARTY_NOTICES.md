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

- **Atkinson Hyperlegible Next** and **Atkinson Hyperlegible Mono**, by the Braille Institute of America. Body text, measurements, and syllable notation.
- **Bricolage Grotesque**, by Mathieu Triay. Headlines on the blue page only.

The site loads the Atkinson faces through `next/font/google`. Bricolage Grotesque is self-hosted as `src/app/fonts/BricolageGrotesque-Variable-subset.woff2`: the Google Fonts variable font (optical size, width, weight) reduced with fontTools to basic Latin plus curly quotes and dashes, and weights 700–800, as the OFL permits. Static copies of the cuts used by the share image (`src/app/opengraph-image.tsx`) are in `assets/fonts/`, each with its license file (`OFL-*.txt`).

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
