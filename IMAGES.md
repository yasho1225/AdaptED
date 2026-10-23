# Imagery

## What ships

AdaptED's pictures are the product itself: the real sample worksheet, the real adapted versions, and numbers AdaptED's code computes (barriers found, questions kept, key words kept). This was chosen on purpose:

- A teacher judging the tool learns more from a real before/after than from a photo of a classroom.
- Stock photos of students are generic, and photos of real children need consent from their families.
- Nothing on the page shows an output the product didn't make.

The pictures in `public/images/` are crops of AdaptED's own interface, made by `scripts/capture-ui.mjs` (run it against `npm start` on port 3100, then convert each PNG to WebP):

| File | What it shows | Where it's used |
| --- | --- | --- |
| `thumb-dense.webp` | The original reading, with the parts that could get in the way highlighted | Inline in "Where students get stuck" |
| `thumb-chunks.webp` | The same reading in the dyslexia version: a heading and a key-idea box | Inline in "Where students get stuck" |
| `need-dyslexia.webp`, `need-adhd.webp`, `need-apd.webp`, `need-autism.webp` | The top of each adapted version | "What each version adds" |
| `versions.webp` | All four versions side by side, from the studio's comparison | The closing section |

Re-run the script whenever the sample worksheet or the document design changes, so the pictures keep matching what the product makes.

The site also has a generated share image (`src/app/opengraph-image.tsx`) and icons (`src/app/icon.svg`, `src/app/apple-icon.tsx`), drawn in code.

## Why there are no photos

Licensed photo libraries (Unsplash, Pexels, Wikimedia Commons, Openverse) could not be reached from the environment this redesign was built in: its network policy refused those hosts (HTTP 403 at the proxy). No placeholder or AI-generated "photos" were added in their place.

## If you add photography later

Two places could use a photo without crowding the product:

| Slot | Where | Good subject |
| --- | --- | --- |
| Problem | Beside "Where students get stuck" (`Stuck` in `src/components/site/sections.tsx`) | A desk with a dense printed worksheet and a pencil. Hands are fine; no faces. |
| Closing | In place of the four-versions picture in "Bring your next lesson" (`CloseCta`) | A teacher's planning desk: lesson plans, sticky notes, a laptop. |

Rules:

1. **License.** Use photos you took yourselves, or ones under the Unsplash or Pexels licenses, or CC0 / CC BY from Wikimedia Commons or Openverse. Record the source URL, author, and license in `THIRD_PARTY_NOTICES.md` (CC BY needs a visible credit).
2. **No identifiable students** unless you have written permission from their families.
3. **Optimize.** Put files in `public/images/`, use `next/image` with explicit `width`/`height` and `sizes`, AVIF/WebP, and keep each under about 200 KB. Only the first visible image gets `priority`.
4. **Alt text** that says what matters ("A worksheet with one long paragraph and no headings"), or `alt=""` if the photo is decoration.
5. **Contrast.** Text must never sit directly on a busy photo. Keep a flat field color behind all text.
6. **Calm mode.** No parallax or motion on photos.
