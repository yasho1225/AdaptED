# AdaptED

**One lesson. Every learner.**

AdaptED helps teachers instantly transform assignments and learning materials into accessible formats for students with dyslexia, autism, visual impairment, and hearing impairment.

Hackathon MVP — frontend-only, no auth or database.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo flow (30 seconds)

1. Skim **Hero** → scroll through **Modes** and **How it works**
2. Reach **Try it yourself** (interactive demo)
3. Review the pre-loaded assignment, then click **Dyslexia → Autism → Visual → Hearing**
4. Paste your own text or load the example

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Framer Motion
- Client-side mock transformation engine (`src/lib/transform.ts`)

## Project structure

```
src/
  app/              # Layout & page
  components/       # UI + landing sections
  lib/              # Transform engine, constants, types
docs/
  PRD.md            # Product requirements
```

## Build

```bash
npm run build
npm start
```

## Non-goals (MVP)

- User accounts, LMS, grading, analytics dashboards
- Real AI / backend APIs (transformations are simulated)

---

See [docs/PRD.md](docs/PRD.md) for full product requirements.
