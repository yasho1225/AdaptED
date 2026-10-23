import Image from "next/image";
import { ArrowRight, ArrowUp } from "lucide-react";
import { CalmMagnet } from "@/components/motion/calm-magnet";
import { NEEDS, SUPPORTS } from "@/lib/adapt/profile";
import { RESEARCH } from "@/lib/adapt/research";
import { NEED_IDS } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";
import { ReliefShowcase } from "./relief-demo";

function ExternalLink({ href, children, className, rise }: { href: string; children: React.ReactNode; className?: string; rise?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" data-rise={rise || undefined} className={cn("group", className)}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** A picture set inside a sentence, one cap-height tall, cut on the chisel. */
function InlineFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="chisel relative mx-[0.12em] inline-block h-[0.85em] w-[1.6em] overflow-hidden bg-sheet align-[-0.1em] [--cut:0.22em]">
      <Image src={src} alt={alt} fill sizes="128px" className="object-cover object-left-top" />
    </span>
  );
}

/* ------------------------------------------------------------------ */

/** Statement with inline thumbnails: where students get stuck, said once, with the source. */
export function Stuck() {
  return (
    <section aria-labelledby="stuck-heading" className="field-blue py-28 sm:py-40">
      <div data-rise-group className="container-page lg:grid lg:grid-cols-12 lg:gap-x-10">
        <h2 id="stuck-heading" data-rise className="t-head max-w-[16ch] lg:col-span-12">
          Where students get stuck
        </h2>
        <p data-rise className="mt-10 max-w-[34ch] text-[1.5rem] leading-[1.3] font-bold sm:text-[2rem] lg:col-span-7 lg:col-start-6">
          7.5 million U.S. students get special education services. Most get the same worksheet <InlineFrame src="/images/thumb-dense.webp" alt="A dense worksheet paragraph" /> as everyone else. Rewriting it by hand <InlineFrame src="/images/thumb-chunks.webp" alt="The same reading in short chunks" /> takes hours.
        </p>
        <p data-rise className="mt-6 text-sm text-ink-3 lg:col-span-7 lg:col-start-6">
          That is 15% of public school students.{" "}
          <ExternalLink href="https://nces.ed.gov/programs/coe/indicator/cgg/students-with-disabilities" className="font-bold text-ink underline decoration-white/50 hover:decoration-brand">
            NCES, 2024
          </ExternalLink>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Showcase() {
  return (
    <section aria-labelledby="showcase-heading" className="field-blue pb-28 sm:pb-40">
      <div className="container-page">
        <ReliefShowcase />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const TILES: { name: string; informs: string; href: string }[] = [
  { name: "CAST", informs: "Universal Design for Learning Guidelines 3.0", href: RESEARCH["udl-language"].url.replace(/representation\/.*$/, "") },
  { name: "International Dyslexia Association", informs: "What dyslexia is, and fair accommodations", href: RESEARCH["ida-accommodations"].url },
  { name: "ASHA", informs: "Central auditory processing disorder", href: RESEARCH["asha-capd"].url },
  { name: "British Dyslexia Association", informs: "Dyslexia Style Guide: type, spacing, layout", href: RESEARCH["bda-style"].url },
  { name: "TEACCH", informs: "Structured teaching: what, how much, when it's done", href: RESEARCH.teacch.url },
  { name: "NCAEP", informs: "Evidence-based practices for autistic students", href: RESEARCH.ncaep.url },
];

const STUDIES = ["tts-meta", "letter-spacing", "dyslexia-fonts", "guided-notes", "figurative", "self-regulation", "segmenting"];

/** Large marks on tiles: the sources, set large, each linked. */
export function Research() {
  return (
    <section id="research" aria-labelledby="research-heading" className="field-paper scroll-mt-16 py-28 sm:py-40">
      <div className="container-page">
        <div data-rise-group className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <div data-rise className="col-span-2 flex min-h-[12rem] flex-col justify-between gap-6 bg-yellow p-6 text-[#0a1b52] sm:p-8 lg:min-h-[15rem]">
            <h2 id="research-heading" className="t-head">
              Built on research
            </h2>
            <p className="max-w-[44ch] font-bold">Every change AdaptED makes points to one of these sources, so you can check the reason yourself.</p>
          </div>
          {TILES.map((t) => (
            <ExternalLink key={t.name} href={t.href} rise className="flex min-h-[10rem] flex-col justify-between gap-4 bg-white p-5 transition-colors hover:bg-[#e6ebfa] sm:p-6 lg:min-h-[15rem]">
              <span className="block text-xl leading-tight font-bold sm:text-2xl">
                {t.name}
              </span>
              <span className="block text-sm text-ink-2">
                {t.informs}
                <span className="mt-2 block font-bold text-[#0e2fa3] underline decoration-[#0e2fa3]/30 underline-offset-[0.2em] group-hover:decoration-[#0e2fa3]">{new URL(t.href).hostname.replace(/^www\./, "")}</span>
              </span>
            </ExternalLink>
          ))}
          <div data-rise className="col-span-2 bg-white p-5 sm:p-6 lg:col-span-4">
            <p className="text-xl font-bold sm:text-2xl">Peer-reviewed studies</p>
            <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {STUDIES.map((id) => {
                const r = RESEARCH[id];
                return (
                  <li key={id}>
                    <ExternalLink href={r.url} className="inline-flex items-start gap-1.5 text-ink hover:text-[#0e2fa3]">
                      <span>
                        <span className="font-bold underline decoration-[#0e2fa3]/30 underline-offset-[0.2em] group-hover:decoration-[#0e2fa3]">{r.label}</span>
                        <span className="block text-sm text-ink-2">{r.citation}</span>
                      </span>
                    </ExternalLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** Two-column menu with picture bullets: each version, the help it adds, and where each idea comes from. */
export function VersionsMenu() {
  return (
    <section aria-labelledby="versions-heading" className="field-paper pb-28 sm:pb-40">
      <div className="container-page">
        <h2 id="versions-heading" data-reveal className="t-head max-w-[18ch]">
          What each version adds
        </h2>
        <p className="mt-6 max-w-[56ch] text-ink-2">The help a version starts with. Teachers can turn any of it off, or add more from the full list of 21 supports.</p>
        <div className="mt-6 space-y-20 sm:mt-10">
          {NEED_IDS.map((n) => {
            const supports = NEEDS[n].defaultSupports;
            return (
              <article key={n} aria-labelledby={`menu-${n}`} className={cn(`need-${n}`, "grid gap-8 pt-14 lg:grid-cols-12 lg:gap-10")}>
                <header data-rise-group className="lg:col-span-4">
                  {/* The picture starts past the slanted edge, so the cut only trims paper. */}
                  <div data-rise className="chisel-start relative aspect-[4/3] w-full max-w-[22rem] overflow-hidden bg-sheet [--cut:2.2rem]">
                    <div className="absolute inset-y-0 right-0 left-[var(--cut)]">
                      <Image src={`/images/need-${n}.webp`} alt={`The top of the ${NEEDS[n].label} version of the sample worksheet`} fill sizes="(min-width: 1024px) 20rem, 85vw" className="object-contain object-left-top" />
                    </div>
                  </div>
                  <div data-rise className="mt-6 flex items-baseline justify-between gap-4">
                    <h3 id={`menu-${n}`} className="text-2xl sm:text-[2rem]">
                      {NEEDS[n].label}
                    </h3>
                    <span className="text-sm text-ink-2">{supports.length} kinds of help</span>
                  </div>
                  <p data-rise className="mt-2 max-w-[34ch] text-ink-2">
                    {NEEDS[n].tagline}
                  </p>
                </header>
                <ul data-rise-group className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:col-span-8 lg:pt-2">
                  {supports.map((id) => {
                    const s = SUPPORTS[id];
                    const source = RESEARCH[s.evidence[0]];
                    return (
                      <li key={id} data-rise className="flex gap-4">
                        <span aria-hidden className="bullet mt-[0.55em] text-[color:var(--need)]" />
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                            <span className="text-lg font-bold">{s.label}</span>
                            {source && (
                              <ExternalLink href={source.url} className="-my-1.5 inline-block py-1.5 text-sm font-bold text-[color:var(--need)] underline decoration-current/30 underline-offset-[0.2em] hover:decoration-current">
                                {source.label}
                              </ExternalLink>
                            )}
                          </span>
                          <span className="mt-1 block max-w-[38ch] text-ink-2">{s.description}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
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
    <section aria-labelledby="principles-heading" className="field-blue py-28 sm:py-40">
      <div className="container-page grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-12">
        <h2 id="principles-heading" data-reveal className="t-head sm:col-span-2 lg:col-span-12">
          What you can count on
        </h2>
        <div data-rise-group className="lg:col-span-5">
          <h3 data-rise className="text-2xl">
            AdaptED always
          </h3>
          <dl className="mt-6 space-y-7">
            {ALWAYS.map(([t, d]) => (
              <div key={t} data-rise>
                <dt className="flex items-baseline gap-3 text-lg font-bold">
                  <span aria-hidden className="bullet text-brand" />
                  {t}
                </dt>
                <dd className="mt-1 pl-[calc(1.1em+0.75rem)] text-ink-2">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div data-rise-group className="lg:col-span-5 lg:col-start-7">
          <h3 data-rise className="text-2xl">
            AdaptED never
          </h3>
          <ul className="mt-6 space-y-7">
            {NEVER.map((t) => (
              <li key={t} data-rise className="flex gap-3 text-ink-2">
                <span aria-hidden className="mt-[0.65em] h-[3px] w-[1.1em] shrink-0 bg-ink-3" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** The object returns: the four versions come back once, cropped by the section's edges. */
export function CloseCta() {
  return (
    <section aria-labelledby="close-heading" className="field-yellow relative overflow-hidden">
      <div className="container-page grid min-h-[min(54rem,90svh)] items-center gap-10 py-20 lg:grid-cols-12 lg:py-0">
        <div className="order-2 lg:order-1 lg:col-span-7 lg:self-stretch">
          <div className="relative -mr-[var(--pad)] h-[22rem] sm:h-[30rem] lg:absolute lg:inset-y-0 lg:left-0 lg:mr-0 lg:h-auto lg:w-[55%]">
            {/* A slab of the studio's blue; the picture (on the same blue) starts past the slanted edge. */}
            <div className="chisel-start absolute inset-0 overflow-hidden bg-[#0e2fa3] [--cut:5rem] lg:top-24 lg:-bottom-10 lg:-left-6 lg:[--cut:10rem]">
              <div className="absolute inset-y-0 right-0 left-[var(--cut)]">
                <Image src="/images/versions.webp" alt="The same worksheet in four versions, side by side: dyslexia, ADHD, auditory processing, and autism" fill sizes="(min-width: 1024px) 50vw, 90vw" className="object-cover object-top" />
              </div>
            </div>
          </div>
        </div>
        <div data-rise-group className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
          <h2 id="close-heading" data-rise className="t-head">
            Bring your next lesson
          </h2>
          <p data-rise className="mt-6 text-ink-2">
            Paste it in, pick the student, and see what changes in under a minute. Or have AI write a new one.
          </p>
          <p data-rise className="mt-5 text-2xl font-bold">
            Free. No account. Nothing saved.
          </p>
          <div data-rise className="mt-8">
            <CalmMagnet>
              <a href="#studio" className="btn btn-primary">
                Try it now <ArrowRight className="size-4" aria-hidden />
              </a>
            </CalmMagnet>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const MARK: { ch: string; h: number; tone: string }[] = [
  { ch: "A", h: 100, tone: "bg-white" },
  { ch: "d", h: 78, tone: "bg-[#a9d4ff]" },
  { ch: "a", h: 64, tone: "bg-white" },
  { ch: "p", h: 86, tone: "bg-[#9eebc8]" },
  { ch: "t", h: 70, tone: "bg-white" },
  { ch: "E", h: 92, tone: "bg-yellow" },
  { ch: "D", h: 100, tone: "bg-yellow" },
];

/** The mark, built large: the wordmark knocked out of chisel blocks. */
export function Footer() {
  return (
    <footer className="field-navy no-print pt-24 pb-10 sm:pt-32">
      <div className="container-page">
        <a href="#top" aria-label="AdaptED, back to the top" className="flex h-[22svh] min-h-[9rem] items-end gap-1 sm:h-[34svh]">
          {MARK.map((m, i) => (
            <span
              key={i}
              aria-hidden
              className={cn("chisel flex flex-1 items-end justify-center pb-[0.06em] font-display text-[clamp(3rem,11vw,10rem)] leading-none font-extrabold text-[#0a1b52] [--cut:clamp(0.6rem,1.6vw,1.6rem)] [font-stretch:80%]", m.tone)}
              style={{ height: `${m.h}%` }}
            >
              {m.ch}
            </span>
          ))}
        </a>
        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <nav aria-label="Footer" className="md:col-span-3">
            <ul className="space-y-2.5">
              {[
                ["#studio", "Try it"],
                ["#how", "How it works"],
                ["#research", "Research"],
              ].map(([href, text]) => (
                <li key={href}>
                  <a href={href} className="font-bold underline decoration-transparent underline-offset-[0.25em] transition-colors hover:decoration-current">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-5">
            <p className="max-w-[44ch] text-ink-2">One lesson. Every learner. A tool that helps teachers make assignments fit every student. Made for the 2026 Congressional App Challenge.</p>
            <p className="mt-4 max-w-[52ch] text-sm text-ink-3">
              AdaptED does not diagnose students or replace IEP or 504 plans, and it can&apos;t promise results. Always check AI-made work before you use it. AI tools helped build this project; see the README.
            </p>
          </div>
          <div className="text-sm md:col-span-4">
            <p className="font-bold">Accessibility of this site</p>
            <ul className="mt-2 space-y-1.5 text-ink-2">
              <li>Calm mode turns off motion. It also follows your device&apos;s reduced-motion setting.</li>
              <li>Works with a keyboard and screen readers (WCAG 2.2 AA).</li>
              <li>Body text is Atkinson Hyperlegible, made by the Braille Institute to be easy to read.</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex items-center justify-between gap-4 text-sm text-ink-3">
          <p>© 2026 AdaptED</p>
          <a href="#top" className="btn btn-ghost btn-sm">
            Back to top <ArrowUp className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
