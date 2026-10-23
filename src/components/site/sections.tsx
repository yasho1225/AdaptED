"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Ban, BookCheck, Cpu, ListChecks, Lock, ScanLine, ShieldCheck, SlidersHorizontal, Target } from "lucide-react";
import { useMotion } from "@/components/motion/motion-provider";
import { Reveal } from "@/components/motion/reveal";
import { NEEDS } from "@/lib/adapt/profile";
import { RESEARCH } from "@/lib/adapt/research";
import { NEED_IDS, type NeedId } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";
import { Logo } from "./nav";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ------------------------------------------------------------------ */

export function Problem() {
  return (
    <Reveal as="section" className="border-y border-rule bg-paper-2/60 py-20 sm:py-24">
      <div className="container-page" aria-labelledby="problem-heading">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div data-reveal>
            <p className="eyebrow">The problem</p>
            <h2 id="problem-heading" className="mt-3 text-4xl font-semibold sm:text-5xl">
              The same worksheet hits different walls.
            </h2>
          </div>
          <p data-reveal className="text-lg text-ink-2">
            In 2022–23, about <strong className="text-ink">7.5 million</strong> U.S. public school students — <strong className="text-ink">15%</strong> — received special education services, and specific learning disabilities such as dyslexia were the largest group.{" "}
            <a className="whitespace-nowrap font-semibold text-brand-ink underline underline-offset-4" href="https://nces.ed.gov/programs/coe/indicator/cgg/students-with-disabilities" target="_blank" rel="noreferrer">
              NCES, 2024<span className="sr-only"> (opens in a new tab)</span>
            </a>
            . Most of them learn from the same handouts as everyone else. Adapting each one by hand takes time teachers rarely have.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NEED_IDS.map((n) => (
            <li key={n} data-reveal className={cn(`need-${n}`, "sheet flex flex-col p-5")}>
              <p className="font-display text-xl font-semibold text-[color:var(--need)]">{NEEDS[n].label}</p>
              <p className="mt-2 text-[0.95rem] text-ink-2">
                <span className="font-semibold text-ink">The wall: </span>
                {NEEDS[n].barrier}
              </p>
              <p className="mt-auto border-t border-rule pt-3 text-[0.95rem]">
                <span className="font-semibold">AdaptED: </span>
                {NEEDS[n].tagline}
              </p>
            </li>
          ))}
        </ul>
        <p data-reveal className="mt-6 text-sm text-ink-3">
          No two students with the same diagnosis are identical — so AdaptED treats the label as a starting point and lets the teacher choose the specific supports.
        </p>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */

const STEPS = [
  {
    Icon: ScanLine,
    title: "Barrier scan",
    body: "Code reads the original and marks exact phrases that could block access: long sentences, multi-step directions, figurative language, spoken-only instructions, undefined length.",
    tag: "Instant · runs in your browser",
  },
  {
    Icon: SlidersHorizontal,
    title: "Learner profile",
    body: "One or more needs plus specific supports the teacher toggles. Grade, language, and whether goals stay grade-level (accommodation) or may change (modification).",
    tag: "No names · no medical details",
  },
  {
    Icon: Cpu,
    title: "Constrained generation",
    body: "Gemini writes a structured JSON assignment under nine non-negotiable rules — keep every question, never give answers, keep academic vocabulary, never rewrite a text being studied — guided by research playbooks for each need.",
    tag: "Schema-validated output",
  },
  {
    Icon: ShieldCheck,
    title: "Fidelity check",
    body: "AdaptED's own code counts every original question, answer choice, and key term. If anything is missing it asks the model to fix it, and as a last resort restores the question word-for-word.",
    tag: "Verified, not assumed",
  },
];

export function HowItWorks() {
  const { calm } = useMotion();
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (calm) return;
      gsap.fromTo(".how-line", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 60%", scrub: 0.6 } });
    },
    { scope: ref, dependencies: [calm] },
  );
  return (
    <section id="how" className="scroll-mt-16 py-20 sm:py-28" aria-labelledby="how-heading">
      <Reveal className="container-page">
        <div className="max-w-3xl" data-reveal>
          <p className="eyebrow">How it decides</p>
          <h2 id="how-heading" className="mt-3 text-4xl font-semibold sm:text-5xl">
            AI writes. Code checks. You decide.
          </h2>
          <p className="mt-4 text-lg text-ink-2">
            AdaptED doesn&apos;t just ask an AI to &ldquo;make it easier.&rdquo; Deterministic analysis, a research-based prompt, a strict output schema, and an automatic fidelity check work together — so the result is accessible <em>and</em> academically faithful.
          </p>
        </div>
        <div ref={ref} className="relative mt-14">
          <div className="how-line absolute left-0 right-0 top-6 hidden h-0.5 origin-left bg-ink lg:block" aria-hidden />
          <ol className="relative grid gap-6 lg:grid-cols-4">
            {STEPS.map(({ Icon, title, body, tag }, i) => (
              <li key={title} data-reveal className="relative">
                <span className="relative z-10 grid size-12 place-items-center rounded-full border-2 border-ink bg-paper font-display text-lg font-semibold">
                  {i + 1}
                </span>
                <h3 className="mt-4 flex items-center gap-2 font-sans text-lg font-bold">
                  <Icon className="size-5 text-brand" aria-hidden /> {title}
                </h3>
                <p className="mt-2 text-ink-2">{body}</p>
                <p className="mt-3 inline-block rounded-full bg-paper-2 px-2.5 py-0.5 font-mono text-xs text-ink-3">{tag}</p>
              </li>
            ))}
          </ol>
        </div>
        <p data-reveal className="mt-10 max-w-3xl text-ink-2">
          If the AI is unavailable, an offline rule engine still produces a structured version from the teacher&apos;s chosen supports — clearly labelled, never presented as AI output.
        </p>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const RESEARCH_BY_NEED: Record<NeedId, { moves: string[]; sources: string[] }> = {
  dyslexia: {
    moves: [
      "Pre-teach academic words with syllable breaks — and keep them in the text",
      "Short sentences, chunked passages, headings",
      "Read-aloud ready text; text-to-speech in the student view",
      "Starters, spelling banks, and other ways to answer when writing isn't the skill",
      "Clear standard type, wider spacing, soft backgrounds — no novelty fonts",
    ],
    sources: ["ida-definition", "ida-accommodations", "tts-meta", "letter-spacing", "dyslexia-fonts", "bda-style"],
  },
  adhd: {
    moves: ["A no-decision first step", "Short timed chunks with outcome-named headings", "Questions next to the reading they need", "Visible checklists and a concrete self-check", "Planned, structured movement breaks"],
    sources: ["adhd-classroom", "self-regulation", "udl-strategy", "segmenting"],
  },
  apd: {
    moves: ["Every spoken direction also written, one step per line", "Guided notes for anything taught orally", "Written alternatives to listening-only tasks", "Teacher notes on noise and checking understanding", "Leave the reading alone — listening is the barrier, not reading"],
    sources: ["asha-capd", "asha-portal", "guided-notes", "udl-perception"],
  },
  autism: {
    moves: ["Same predictable section order", "What, how much, how long, finished when, then what", "Literal wording — unless figurative language is the lesson", "A model answer on a different example", "Concrete steps for open-ended or perspective questions"],
    sources: ["teacch", "ncaep", "figurative", "udl-language"],
  },
};

export function Research() {
  return (
    <section id="research" className="scroll-mt-16 border-t border-rule bg-paper-2/60 py-20 sm:py-28" aria-labelledby="research-heading">
      <Reveal className="container-page">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end" data-reveal>
          <div>
            <p className="eyebrow">The research</p>
            <h2 id="research-heading" className="mt-3 text-4xl font-semibold sm:text-5xl">
              Built on evidence, not stereotypes.
            </h2>
          </div>
          <p className="text-lg text-ink-2">
            The adaptation playbooks start from CAST&apos;s <strong className="text-ink">Universal Design for Learning Guidelines 3.0</strong>, the <strong className="text-ink">International Dyslexia Association</strong>&apos;s accommodation guidance, and <strong className="text-ink">ASHA</strong>&apos;s guidance on auditory processing — then peer-reviewed studies for specific moves. Every change AdaptED makes cites one of these.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {NEED_IDS.map((n) => (
            <article key={n} data-reveal className={cn(`need-${n}`, "sheet p-6")}>
              <h3 className="font-display text-2xl font-semibold text-[color:var(--need)]">{NEEDS[n].label}</h3>
              <p className="mt-1 text-ink-2">{NEEDS[n].barrier}</p>
              <ul className="mt-4 space-y-1.5">
                {RESEARCH_BY_NEED[n].moves.map((m) => (
                  <li key={m} className="flex gap-2.5">
                    <BookCheck className="mt-1 size-4 shrink-0 text-[color:var(--need)]" aria-hidden />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-rule pt-4">
                {RESEARCH_BY_NEED[n].sources.map((id) => {
                  const r = RESEARCH[id];
                  return (
                    <li key={id}>
                      <a href={r.url} target="_blank" rel="noreferrer" title={r.citation} className="inline-flex items-center gap-1 rounded-full border border-rule-strong px-2.5 py-1 text-xs font-semibold text-ink-2 hover:border-ink hover:text-ink">
                        {r.label} <ArrowUpRight className="size-3" aria-hidden />
                        <span className="sr-only">: {r.citation} (opens in a new tab)</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>

        <div data-reveal className="sheet mt-6 p-6">
          <h3 className="flex items-center gap-2 font-sans text-lg font-bold">
            <Ban className="size-5 text-warn" aria-hidden /> What AdaptED deliberately won&apos;t do
          </h3>
          <ul className="mt-3 grid gap-x-8 gap-y-2 text-ink-2 md:grid-cols-2">
            <li>Swap academic words for easier ones — students still need to learn them.</li>
            <li>Rewrite a speech, poem, or primary source that students are analyzing.</li>
            <li>Give away answers in hints, starters, or examples.</li>
            <li>Assume every student with a diagnosis needs the same thing.</li>
            <li>Use &ldquo;dyslexia fonts&rdquo; — the evidence doesn&apos;t support them.</li>
            <li>Claim to be proven effective. The research supports the strategies; AdaptED is a tool to apply them.</li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Principles() {
  const items = [
    { Icon: Target, title: "Same learning goals", body: "Accommodation by default. Modified goals only when the teacher chooses them." },
    { Icon: ListChecks, title: "Every question kept", body: "Counted by code after generation. Missing questions are restored, word for word." },
    { Icon: ShieldCheck, title: "No answers given", body: "Supports frame thinking; models use different examples." },
    { Icon: Lock, title: "Private by design", body: "No accounts, no database. Files are read in the browser; contact details are stripped before AI." },
  ];
  return (
    <Reveal as="section" className="py-20 sm:py-24">
      <div className="container-page" aria-label="Principles">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, title, body }) => (
            <li key={title} data-reveal className="border-t-2 border-ink pt-4">
              <Icon className="size-6 text-brand" aria-hidden />
              <h3 className="mt-3 font-sans text-lg font-bold">{title}</h3>
              <p className="mt-1 text-ink-2">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="no-print border-t border-rule bg-paper-2/60 py-12">
      <div className="container-page grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Logo />
          <p className="mt-2 max-w-md text-ink-2">One lesson. Every learner. An accessibility tool for teachers, built for the 2026 Congressional App Challenge.</p>
          <p className="mt-4 max-w-md text-sm text-ink-3">
            AdaptED helps apply research-based accommodations; it does not diagnose, replace IEP/504 decisions, or guarantee outcomes. Always review AI-generated material before using it with students. AI tools assisted in developing this project — see the README for disclosure.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-bold">Accessibility of this site</p>
          <ul className="mt-2 space-y-1.5 text-ink-2">
            <li>Calm mode removes smooth scrolling and animation (it also follows your system&apos;s reduced-motion setting).</li>
            <li>Keyboard and screen-reader friendly; designed to WCAG 2.2 AA.</li>
            <li>Body type is Atkinson Hyperlegible, designed for legibility.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
