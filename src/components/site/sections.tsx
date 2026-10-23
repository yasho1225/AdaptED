import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { NEEDS } from "@/lib/adapt/profile";
import { RESEARCH } from "@/lib/adapt/research";
import { NEED_IDS, type NeedId } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";
import { Logo } from "./nav";

function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cn("group", className)}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/* ------------------------------------------------------------------ */

export function Problem() {
  return (
    <section aria-labelledby="problem-heading" className="border-t border-rule bg-paper-2 py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="problem-heading" className="text-4xl sm:text-5xl">
            One handout. Four different walls.
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-2">
            In 2022–23, about <strong className="font-bold text-ink">7.5 million</strong> U.S. public school students, 15% of all students, received special education services. Specific learning disabilities such as dyslexia were the largest group (
            <ExternalLink href="https://nces.ed.gov/programs/coe/indicator/cgg/students-with-disabilities" className="underline decoration-white/50 hover:decoration-brand">NCES, 2024</ExternalLink>). Most of them learn from the same handouts as everyone else, and adapting each one by hand takes time teachers rarely have.
          </p>
          <p className="mt-6 max-w-[52ch] text-ink-3">
            No two students with the same diagnosis are alike, so AdaptED treats the label as a starting point and lets the teacher choose the specific supports.
          </p>
        </div>
        <dl className="lg:col-span-6">
          {NEED_IDS.map((n) => (
            <div key={n} className={cn(`need-${n}`, "grid gap-1 border-t border-rule py-5 first:border-t-0 first:pt-0 sm:grid-cols-[12rem_1fr] sm:gap-6")}>
              <dt className="flex items-center gap-2.5 font-bold">
                <span aria-hidden className="size-2.5 rounded-full bg-[color:var(--need)]" />
                {NEEDS[n].label}
              </dt>
              <dd className="text-ink-2">{NEEDS[n].barrier}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const STEPS = [
  {
    title: "Barrier scan",
    body: "Code reads the original and marks the exact phrases that could block access: long sentences, multi-step directions, figurative language, spoken-only instructions, answers with no stated length.",
  },
  {
    title: "Learner profile",
    body: "One or more needs, then the specific supports this student uses. Grade, language, and whether goals stay grade-level or may change. No names, no medical details.",
  },
  {
    title: "Constrained generation",
    body: "Gemini writes a structured assignment under nine rules: keep every question, never give answers, keep academic vocabulary, never rewrite a text being studied, invent nothing.",
  },
  {
    title: "Fidelity check",
    body: "AdaptED's own code counts every original question, answer choice, and key term. Anything missing goes back to the model once, and a question still missing is restored word for word.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-heading" className="scroll-mt-16 border-t border-rule py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="how-heading" className="text-4xl sm:text-5xl lg:col-span-6">
            AI writes. Code checks. You decide.
          </h2>
          <p className="max-w-[52ch] text-lg leading-relaxed text-ink-2 lg:col-span-6 lg:pt-2">
            AdaptED doesn&apos;t just ask an AI to make things easier. Deterministic analysis, a research-based prompt, a strict output schema, and an automatic check work together, so the result is accessible and academically faithful.
          </p>
        </div>
        <ol className="mt-14 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t-2 border-ink pt-5 pb-10">
              <p className="tnum text-5xl font-extrabold leading-none text-brand" aria-hidden>
                {i + 1}
              </p>
              <h3 className="mt-4 text-xl tracking-[-0.015em]">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-2 text-ink-2">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="max-w-[60ch] text-ink-3">
          If the AI is unavailable, an offline rule engine builds a structured version from the teacher&apos;s chosen supports. It is always labelled, never presented as AI output.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const RESEARCH_BY_NEED: Record<NeedId, { moves: string[]; sources: string[] }> = {
  dyslexia: {
    moves: [
      "Pre-teach academic words with syllable breaks, and keep them in the text",
      "Short sentences and chunked passages under headings",
      "Read-aloud ready text, with text-to-speech in the student view",
      "Starters, spelling banks, and other ways to answer when writing isn't the skill",
      "Clear standard type, wider spacing, soft backgrounds; no novelty fonts",
    ],
    sources: ["ida-definition", "ida-accommodations", "tts-meta", "letter-spacing", "dyslexia-fonts", "bda-style"],
  },
  adhd: {
    moves: ["A first step that needs no decision", "Short timed chunks with outcome-named headings", "Questions placed right after the reading they need", "Visible checklists and a concrete self-check", "Planned, structured movement breaks"],
    sources: ["adhd-classroom", "self-regulation", "udl-strategy", "segmenting"],
  },
  apd: {
    moves: ["Every spoken direction also written, one step per line", "Guided notes for anything taught orally", "Written alternatives to listening-only tasks", "Teacher notes on noise and checking understanding", "The reading is left alone: listening is the barrier, not reading"],
    sources: ["asha-capd", "asha-portal", "guided-notes", "udl-perception"],
  },
  autism: {
    moves: ["The same predictable section order", "What, how much, how long, finished when, then what", "Literal wording, unless figurative language is the lesson", "A model answer on a different example", "Concrete steps for open-ended or perspective questions"],
    sources: ["teacch", "ncaep", "figurative", "udl-language"],
  },
};

export function Research() {
  return (
    <section id="research" aria-labelledby="research-heading" className="scroll-mt-16 border-t border-rule bg-paper-2 py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="research-heading" className="text-4xl sm:text-5xl lg:col-span-6">
            Built on evidence, not stereotypes.
          </h2>
          <p className="max-w-[54ch] text-lg leading-relaxed text-ink-2 lg:col-span-6 lg:pt-2">
            The playbooks start from CAST&apos;s <strong className="font-bold text-ink">Universal Design for Learning Guidelines 3.0</strong>, the <strong className="font-bold text-ink">International Dyslexia Association</strong>&apos;s accommodation guidance, and <strong className="font-bold text-ink">ASHA</strong>&apos;s guidance on auditory processing, then peer-reviewed studies for specific moves. Every change AdaptED makes cites one of them.
          </p>
        </div>

        <div className="mt-14">
          <div className="hidden grid-cols-12 gap-8 border-b-2 border-ink pb-3 text-sm font-bold text-ink-3 lg:grid" aria-hidden>
            <span className="col-span-3">Need</span>
            <span className="col-span-5">What AdaptED does</span>
            <span className="col-span-4">Grounded in</span>
          </div>
          {NEED_IDS.map((n) => (
            <article key={n} className={cn(`need-${n}`, "grid gap-4 border-b border-rule py-8 lg:grid-cols-12 lg:gap-8")} aria-labelledby={`research-${n}`}>
              <div className="lg:col-span-3">
                <h3 id={`research-${n}`} className="flex items-center gap-2.5 text-2xl tracking-[-0.015em]">
                  <span aria-hidden className="size-3 rounded-full bg-[color:var(--need)]" />
                  {NEEDS[n].label}
                </h3>
                <p className="mt-2 text-[0.95rem] text-ink-3">{NEEDS[n].tagline}</p>
              </div>
              <ul className="space-y-2 lg:col-span-5">
                {RESEARCH_BY_NEED[n].moves.map((m) => (
                  <li key={m} className="flex gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-[color:var(--need)]" aria-hidden />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1.5 text-[0.95rem] lg:col-span-4">
                {RESEARCH_BY_NEED[n].sources.map((id) => {
                  const r = RESEARCH[id];
                  return (
                    <li key={id}>
                      <ExternalLink href={r.url} className="inline-flex items-start gap-1 text-ink-2 hover:text-ink">
                        <span>
                          <span className="underline decoration-white/40 group-hover:decoration-brand">{r.label}</span>
                          <span className="block text-sm text-ink-3">{r.citation}</span>
                        </span>
                        <ArrowUpRight className="mt-1 size-3.5 shrink-0" aria-hidden />
                      </ExternalLink>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const ALWAYS = [
  ["Same learning goals", "Accommodation by default. Goals change only when the teacher chooses to modify them."],
  ["Every question kept", "Counted by code after generation, and restored word for word if the AI drops one."],
  ["No answers given away", "Starters and hints frame the thinking; model answers use a different example."],
  ["Private by design", "No accounts and no database. Files are read in the browser; contact details are removed before AI."],
];

const NEVER = [
  "Swap academic words for easier ones. Students still need to learn them.",
  "Rewrite a speech, poem, or primary source that students are analyzing.",
  "Assume every student with a diagnosis needs the same thing.",
  "Use “dyslexia fonts.” The evidence doesn't support them.",
  "Claim to be proven effective. The research supports the strategies; AdaptED applies them.",
];

export function Principles() {
  return (
    <section aria-labelledby="principles-heading" className="border-t border-rule py-20 sm:py-28">
      <div className="container-page">
        <h2 id="principles-heading" className="max-w-[18ch] text-4xl sm:text-5xl">
          What a teacher can count on.
        </h2>
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="text-lg text-ink-2">AdaptED always</h3>
            <dl className="mt-3">
              {ALWAYS.map(([t, d]) => (
                <div key={t} className="grid gap-1 border-t border-rule py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <dt className="font-bold">{t}</dt>
                  <dd className="text-ink-2">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-5">
            <h3 className="text-lg text-ink-2">AdaptED never</h3>
            <ul className="mt-3">
              {NEVER.map((t) => (
                <li key={t} className="flex gap-3 border-t border-rule py-4 text-ink-2">
                  <X className="mt-1 size-4 shrink-0 text-ink-3" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function CloseCta() {
  return (
    <section aria-labelledby="close-heading" className="bg-brand text-on-brand">
      <div className="container-page flex flex-col items-start justify-between gap-8 py-16 sm:py-20 lg:flex-row lg:items-end">
        <div>
          <h2 id="close-heading" className="max-w-[16ch] text-4xl text-on-brand sm:text-6xl">
            Try it with tomorrow&apos;s assignment.
          </h2>
          <p className="mt-4 max-w-[48ch] text-lg text-on-brand/80">Paste it, pick the learner, and see exactly what changes, in under a minute.</p>
        </div>
        <a href="#studio" className="btn min-h-12 shrink-0 bg-on-brand px-6 text-base text-brand hover:bg-[#0a1748]">
          Open the studio <ArrowRight className="size-4" aria-hidden />
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="no-print border-t border-rule py-12">
      <div className="container-page grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <Logo />
          <p className="mt-3 max-w-[52ch] text-ink-2">One lesson. Every learner. An accessibility tool for teachers, built for the 2026 Congressional App Challenge.</p>
          <p className="mt-4 max-w-[60ch] text-sm text-ink-3">
            AdaptED helps apply research-based accommodations. It does not diagnose, replace IEP or 504 decisions, or guarantee outcomes. Review AI-generated material before using it with students. AI tools assisted in developing this project; see the README for disclosure.
          </p>
        </div>
        <div className="text-sm md:col-span-5">
          <p className="font-bold">Accessibility of this site</p>
          <ul className="mt-2 space-y-1.5 text-ink-2">
            <li>Calm mode turns off smooth scrolling and animation, and follows your system&apos;s reduced-motion setting.</li>
            <li>Keyboard and screen-reader friendly, designed to WCAG 2.2 AA.</li>
            <li>Set in Atkinson Hyperlegible, designed by the Braille Institute for legibility.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
