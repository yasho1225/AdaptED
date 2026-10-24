# Third-party notices

AdaptED's own code is in this repository. These are the outside pieces it includes or depends on, and their licenses.

## Included in this repository

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
| [GSAP](https://gsap.com) | The hero's key-word flight (off in calm mode) | [Standard "no charge" license](https://gsap.com/standard-license) |
| [Lucide](https://lucide.dev) (`lucide-react`) | Icons | ISC |
| [Next.js](https://nextjs.org), [React](https://react.dev) | Framework | MIT |
| [Zod](https://zod.dev) | Checking the AI's answer format | MIT |
| `@google/genai` | Gemini API client | Apache-2.0 |

See `package.json` for the full list.
