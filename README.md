# AdaptED

**One lesson. Every learner.**

AdaptED helps teachers instantly transform assignments and learning materials into accessible formats for students with dyslexia, autism, visual impairment, and hearing impairment.

Hackathon MVP — no auth or database.

**Uses Gemini when a key is set.** If the free tier is exhausted or the API errors, AdaptED **automatically falls back** to built-in local transforms so your demo never breaks.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Gemini (recommended)

```bash
cp .env.example .env.local
# Set GEMINI_API_KEY from https://aistudio.google.com/apikey
npm run dev
```

When quota/rate limits hit, the app switches to local mode for ~10 minutes and shows a small banner—no crash, no empty screen.

## Demo flow (30 seconds)

1. Skim **Hero** → scroll through **Modes** and **How it works**
2. Reach **Try it yourself** (interactive demo)
3. Review the pre-loaded assignment, then click **Dyslexia → Autism → Visual → Hearing**
4. Paste your own text or load the example

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Framer Motion
- Local transform engine (default, no key) or Gemini via `/api/transform` when `GEMINI_API_KEY` is set

## Project structure

```
src/
  app/api/transform/  # Gemini API route (server-side key)
  hooks/              # useTransform + caching
  lib/gemini/         # Prompts, parsing, server client
  components/         # UI + landing sections
docs/
  PRD.md              # Product requirements
```

## Build

```bash
npm run build
npm start
```

## Non-goals (MVP)

- User accounts, LMS, grading, analytics dashboards

## Environment

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Optional. Google AI Studio key (server only). Omit to use local transforms. |

---

See [docs/PRD.md](docs/PRD.md) for full product requirements.
