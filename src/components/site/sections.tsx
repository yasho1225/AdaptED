import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { CalmMagnet } from "@/components/motion/calm-magnet";
import { NEEDS } from "@/lib/adapt/profile";
import { RESEARCH } from "@/lib/adapt/research";
import { NEED_IDS, type NeedId } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";
import { Logo } from "./nav";
import { ReliefDemo } from "./relief-demo";

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
    <section data-mood="weight" data-relief aria-labelledby="problem-heading" className="py-16 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <h2 id="problem-heading" data-reveal className="text-[2.75rem] sm:text-6xl lg:text-7xl">
            A hard worksheet can stop a student before they start.
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-2">
            About <strong className="font-bold text-ink">7.5 million</strong>{" "}U.S. public school students get special education services. That&apos;s 15% of all students (
            <ExternalLink href="https://nces.ed.gov/programs/coe/indicator/cgg/students-with-disabilities" className="underline decoration-white/50 hover:decoration-brand">
              NCES, 2024
            </ExternalLink>
            ). Most of them use the same worksheets as everyone else.
          </p>
          <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink-2">
            Changing each worksheet by hand takes time most teachers don&apos;t have. And two students with the same label can need very different help.
          </p>
        </div>
        <div className="lg:col-span-7">
          <ReliefDemo />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const RESEARCH_BY_NEED: Record<NeedId, { moves: string[]; sources: string[] }> = {
  dyslexia: {
    moves: [
      "Teaches hard words first, split into parts, and keeps them in the text",
      "Uses short sentences and small chunks with headings",
      "Can read the page out loud",
      "Gives sentence starters, spelling help, and other ways to answer",
      "Uses a clear font and extra space. No special “dyslexia fonts”",
    ],
    sources: ["ida-definition", "ida-accommodations", "tts-meta", "letter-spacing", "dyslexia-fonts", "bda-style"],
  },
  adhd: {
    moves: ["Starts with one tiny, easy step", "Breaks work into short, timed parts", "Puts each question right after the reading it needs", "Adds a checklist so progress is easy to see", "Plans short movement breaks"],
    sources: ["adhd-classroom", "self-regulation", "udl-strategy", "segmenting"],
  },
  apd: {
    moves: ["Writes down every spoken direction, one step per line", "Adds fill-in notes for anything said out loud", "Gives a written option for listening tasks", "Gives the teacher tips on noise and checking in", "Leaves the reading alone, because listening is the hard part"],
    sources: ["asha-capd", "asha-portal", "guided-notes", "udl-perception"],
  },
  autism: {
    moves: ["Uses the same order every time", "Says what to do, how much, how long, and when it's done", "Uses exact words instead of sayings, unless sayings are the lesson", "Shows a sample answer on a different topic", "Breaks open-ended questions into clear steps"],
    sources: ["teacch", "ncaep", "figurative", "udl-language"],
  },
};

export function Research() {
  return (
    <section id="research" data-mood="grounded" aria-labelledby="research-heading" className="scroll-mt-16 py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="research-heading" data-reveal className="text-[2.75rem] sm:text-6xl lg:text-7xl lg:col-span-6">
            Based on research, not guesses.
          </h2>
          <p className="max-w-[50ch] text-lg leading-relaxed text-ink-2 lg:col-span-6 lg:pt-2">
            AdaptED follows advice from learning experts. These include <strong className="font-bold text-ink">CAST</strong>, the <strong className="font-bold text-ink">International Dyslexia Association</strong>, and the <strong className="font-bold text-ink">American Speech-Language-Hearing Association</strong>. Every change shows where the idea came from.
          </p>
        </div>

        <div className="mt-14">
          <div className="hidden grid-cols-12 gap-8 border-b-2 border-ink pb-3 text-sm font-bold text-ink-3 lg:grid" aria-hidden>
            <span className="col-span-3">Need</span>
            <span className="col-span-5">What AdaptED does</span>
            <span className="col-span-4">Sources</span>
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
              <ul data-citation className="space-y-1.5 text-[0.95rem] lg:col-span-4">
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
  ["Same learning goals", "Students learn the same things. Goals only change if you choose."],
  ["Every question kept", "AdaptED checks. If the AI drops a question, it puts it back."],
  ["No answers given away", "Hints help students think. Sample answers use a different topic."],
  ["Private", "No accounts, and AdaptED saves nothing. Emails and phone numbers are removed first."],
];

const NEVER = [
  "Swap important words for easier ones. Students still need to learn them.",
  "Change a poem, speech, or story that students are studying.",
  "Assume everyone with the same label needs the same help.",
  "Use special “dyslexia fonts.” Research doesn't support them.",
  "Claim it's proven to work. Research supports the methods; AdaptED helps you use them.",
];

export function Principles() {
  return (
    <section data-mood="safe" aria-labelledby="principles-heading" className="py-20 sm:py-28">
      <div className="container-page">
        <h2 id="principles-heading" data-reveal className="max-w-[18ch] text-[2.75rem] sm:text-6xl lg:text-7xl">
          What you can count on.
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
          <h2 id="close-heading" data-reveal className="max-w-[16ch] text-[2.75rem] text-on-brand sm:text-6xl lg:text-8xl">
            Try it with tomorrow&apos;s lesson.
          </h2>
          <p className="mt-4 max-w-[48ch] text-lg text-on-brand/80">Paste it in. Pick the student. See what changes in under a minute.</p>
        </div>
        <CalmMagnet className="shrink-0">
          <a href="#studio" className="btn min-h-12 bg-on-brand px-6 text-base text-brand hover:bg-[#0a1748]">
            Try it now <ArrowRight className="size-4" aria-hidden />
          </a>
        </CalmMagnet>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="no-print relative bg-[#0f1f5c] py-14">
      <div className="container-page grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <Logo />
          <p className="mt-3 max-w-[52ch] text-ink-2">One lesson. Every learner. A tool that helps teachers make assignments fit every student. Made for the 2026 Congressional App Challenge.</p>
          <p className="mt-4 max-w-[60ch] text-sm text-ink-3">
            AdaptED does not diagnose students or replace IEP or 504 plans, and it can&apos;t promise results. Always check AI-made work before you use it. AI tools helped build this project; see the README.
          </p>
        </div>
        <div className="text-sm md:col-span-5">
          <p className="font-bold">Accessibility of this site</p>
          <ul className="mt-2 space-y-1.5 text-ink-2">
            <li>Calm mode turns off motion. It also follows your device&apos;s reduced-motion setting.</li>
            <li>Works with a keyboard and screen readers (WCAG 2.2 AA).</li>
            <li>The font is Atkinson Hyperlegible, made by the Braille Institute to be easy to read.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
