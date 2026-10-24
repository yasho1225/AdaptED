import Image from "next/image";
import { ArrowRight, ArrowUp, ChevronDown } from "lucide-react";
import { CalmMagnet } from "@/components/motion/calm-magnet";
import { RESEARCH } from "@/lib/adapt/research";
import { cn } from "@/lib/utils";

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
    <section aria-labelledby="stuck-heading" className="py-24 sm:py-32">
      <div data-rise-group className="container-page lg:grid lg:grid-cols-12 lg:gap-x-10">
        <h2 id="stuck-heading" data-rise className="t-head max-w-[16ch] lg:col-span-12">
          Where students get stuck
        </h2>
        <p data-rise className="mt-10 max-w-[34ch] text-[1.5rem] leading-[1.3] font-bold sm:text-[2rem] lg:col-span-7 lg:col-start-6">
          7.5 million U.S. students get special education services. Most get the same worksheet <InlineFrame src="/images/thumb-dense.webp" alt="A dense worksheet paragraph" /> as everyone else. Rewriting it by hand <InlineFrame src="/images/thumb-chunks.webp" alt="The same reading in short chunks" /> takes hours.
        </p>
        <p data-rise className="mt-6 text-sm text-ink-3 lg:col-span-7 lg:col-start-6">
          That is 15% of public school students.{" "}
          <ExternalLink href="https://nces.ed.gov/programs/coe/indicator/cgg/students-with-disabilities" className="font-bold text-ink underline decoration-ink-3 hover:decoration-brand">
            NCES, 2024
          </ExternalLink>
        </p>
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

/** The sources, set large on tiles, each linked; the studies wait behind one disclosure. */
export function Research() {
  return (
    <section id="research" aria-labelledby="research-heading" className="band scroll-mt-16 py-24 sm:py-32">
      <div className="container-page">
        <div data-rise-group className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2 id="research-heading" data-reveal className="t-head lg:col-span-7">
            Built on research
          </h2>
          <p data-rise className="max-w-[44ch] text-ink-2 lg:col-span-5">
            Every change AdaptED makes points to one of these sources, so you can check the reason yourself.
          </p>
        </div>
        <ul data-rise-group className="mt-14 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((t) => (
            <li key={t.name} data-rise>
              <ExternalLink href={t.href} className="flex h-full min-h-[8.5rem] flex-col justify-between gap-5 bg-paper p-6 transition-colors duration-200 hover:bg-paper-2 sm:min-h-[11rem] sm:p-7">
                <span className="block text-2xl leading-tight font-bold">{t.name}</span>
                <span className="block text-ink-2">
                  {t.informs}
                  <span className="mt-2 block text-sm font-bold text-ink underline decoration-ink-3/60 underline-offset-[0.2em] group-hover:decoration-brand">{new URL(t.href).hostname.replace(/^www\./, "")}</span>
                </span>
              </ExternalLink>
            </li>
          ))}
        </ul>
        <details data-rise className="group/studies mt-2 bg-paper">
          <summary className="flex min-h-16 list-none items-center justify-between gap-4 px-6 py-4 text-2xl font-bold transition-colors duration-200 hover:bg-paper-2 sm:px-7 [&::-webkit-details-marker]:hidden">
            Peer-reviewed studies ({STUDIES.length})
            <ChevronDown className="size-5 shrink-0 transition-transform duration-200 group-open/studies:rotate-180" aria-hidden />
          </summary>
          <ul className="hidden gap-x-8 gap-y-4 px-6 pt-2 pb-7 group-open/studies:grid sm:grid-cols-2 sm:px-7 lg:grid-cols-3">
            {STUDIES.map((id) => {
              const r = RESEARCH[id];
              return (
                <li key={id}>
                  <ExternalLink href={r.url} className="inline-flex items-start gap-1.5 text-ink">
                    <span>
                      <span className="font-bold underline decoration-ink-3/60 underline-offset-[0.2em] group-hover:decoration-brand">{r.label}</span>
                      <span className="block text-sm text-ink-2">{r.citation}</span>
                    </span>
                  </ExternalLink>
                </li>
              );
            })}
          </ul>
        </details>
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
    <section aria-labelledby="principles-heading" className="py-24 sm:py-32">
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
    <section aria-labelledby="close-heading" className="band relative overflow-hidden">
      <div className="container-page grid min-h-[min(48rem,85svh)] items-center gap-10 py-20 lg:grid-cols-12 lg:py-0">
        <div className="order-2 lg:order-1 lg:col-span-7 lg:self-stretch">
          <div className="relative -mr-[var(--pad)] h-[22rem] sm:h-[30rem] lg:absolute lg:inset-y-0 lg:left-0 lg:mr-0 lg:h-auto lg:w-[55%]">
            {/* A slab of the page's ground; the picture (captured on the same ground) starts past the slanted edge. */}
            <div className="chisel-start absolute inset-0 overflow-hidden bg-canvas [--cut:5rem] lg:top-24 lg:-bottom-10 lg:-left-6 lg:[--cut:10rem]">
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
              <a href="#studio" className="btn btn-brand">
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

/** "Adapt" in the ink, "ED" in the highlighter, as in the wordmark. */
const MARK: { ch: string; h: number; tone: string }[] = [
  { ch: "A", h: 100, tone: "bg-ink" },
  { ch: "d", h: 78, tone: "bg-ink" },
  { ch: "a", h: 64, tone: "bg-ink" },
  { ch: "p", h: 86, tone: "bg-ink" },
  { ch: "t", h: 70, tone: "bg-ink" },
  { ch: "E", h: 92, tone: "bg-yellow" },
  { ch: "D", h: 100, tone: "bg-yellow" },
];

/** The mark, built large: the wordmark knocked out of chisel blocks. */
export function Footer() {
  return (
    <footer className="no-print pt-24 pb-10 sm:pt-32">
      <div className="container-page">
        <a href="#top" aria-label="AdaptED, back to the top" className="flex h-[20svh] min-h-[8rem] items-end gap-1 sm:h-[30svh]">
          {MARK.map((m, i) => (
            <span
              key={i}
              aria-hidden
              className={cn("chisel flex flex-1 items-end justify-center pb-[0.06em] font-display text-[clamp(3rem,11vw,10rem)] leading-none font-extrabold text-canvas [--cut:clamp(0.6rem,1.6vw,1.6rem)] [font-stretch:80%]", m.tone)}
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
                ["#versions", "Versions"],
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
            <p className="max-w-[44ch] text-ink-2">Helps teachers make every assignment fit every student. Made for the 2026 Congressional App Challenge.</p>
            <p className="mt-4 max-w-[52ch] text-sm text-ink-3">
              AdaptED does not diagnose students or replace IEP or 504 plans, and it can&apos;t promise results. Always check AI-made work before you use it. AI tools helped build this project; see the README.
            </p>
          </div>
          <div className="text-sm md:col-span-4">
            <p className="font-bold">Accessibility of this site</p>
            <ul className="mt-2 space-y-1.5 text-ink-2">
              <li>Calm mode turns off motion, and follows your device&apos;s reduced-motion setting.</li>
              <li>Works with a keyboard and screen readers (WCAG 2.2 AA).</li>
              <li>Body text is Atkinson Hyperlegible, from the Braille Institute.</li>
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
