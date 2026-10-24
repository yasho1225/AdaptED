import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ExternalLink } from "./external-link";
import { Logo } from "./logo";

/** Where students get stuck, said once, with the source. */
export function Stuck() {
  return (
    <section aria-labelledby="stuck-heading" className="py-16 sm:py-20">
      {/* One row on wide screens: the heading on the left, the statement beside it. */}
      <div className="container-page grid gap-x-10 gap-y-8 lg:grid-cols-12">
        <h2 id="stuck-heading" className="t-head max-w-[16ch] lg:col-span-6 lg:max-w-none">
          Where students get stuck
        </h2>
        <div className="lg:col-span-6 lg:pt-2">
          <p className="max-w-[34ch] text-[1.5rem] leading-[1.3] font-bold sm:text-[2rem]">
            7.5 million U.S. students get special education services. Most get the same worksheet as everyone else.
          </p>
          <p className="mt-5 text-xl text-ink-2">Rewriting it by hand takes hours.</p>
          <p className="mt-3 text-sm text-ink-3">
            7.5 million is 15% of public school students.{" "}
            <ExternalLink href="https://nces.ed.gov/programs/coe/indicator/cgg/students-with-disabilities" className="font-bold text-ink underline decoration-ink-3 hover:decoration-brand">
              NCES, 2024
            </ExternalLink>
          </p>
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
      <div className="container-page grid items-center gap-10 py-16 sm:py-20 lg:min-h-[34rem] lg:grid-cols-12 lg:py-0">
        <div className="order-2 lg:order-1 lg:col-span-7 lg:self-stretch">
          <div className="relative -mr-[var(--pad)] h-[18rem] sm:h-[24rem] lg:absolute lg:inset-y-0 lg:left-0 lg:mr-0 lg:h-auto lg:w-[55%]">
            {/* A slab of the page's ground; the picture (captured on the same ground) starts past the slanted edge. */}
            <div className="chisel-start absolute inset-0 overflow-hidden bg-canvas [--cut:5rem] lg:top-16 lg:-bottom-10 lg:-left-6 lg:[--cut:10rem]">
              <div className="absolute inset-y-0 right-0 left-[var(--cut)]">
                <Image src="/images/versions.webp" alt="The same worksheet in four versions, side by side: dyslexia, ADHD, auditory processing, and autism" fill sizes="(min-width: 1024px) 50vw, 90vw" className="object-cover object-top" />
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
          <h2 id="close-heading" className="t-head">
            Bring your next lesson
          </h2>
          <p className="mt-6 text-ink-2">
            Paste it in, pick the student, and see what changes in under a minute. Or have AI write a new one.
          </p>
          <p className="mt-5 text-2xl font-bold">
            Free. No account. Nothing saved.
          </p>
          <div className="mt-8">
            <a href="#studio" className="btn btn-brand">
              Try it now <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const FOOTER_LINKS = [
  ["#studio", "Try it"],
  ["#how", "How it works"],
  ["#research", "Research"],
] as const;

/** The logo and the three places to go, then what AdaptED is and is not. */
export function Footer() {
  return (
    <footer className="no-print pt-14 pb-10">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
          <a href="#top" aria-label="AdaptED, back to the top" className="-mx-1 inline-flex min-h-11 items-center px-1">
            <Logo />
          </a>
          <nav aria-label="Footer">
            <ul className="-mx-3 flex flex-wrap">
              {FOOTER_LINKS.map(([href, text]) => (
                <li key={href}>
                  <a href={href} className="inline-flex min-h-11 items-center px-3 font-bold text-ink-2 underline decoration-transparent underline-offset-[0.25em] transition-colors hover:text-ink hover:decoration-current">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="max-w-[44ch] text-ink-2">Helps teachers make every assignment fit every student. Made for the 2026 Congressional App Challenge.</p>
            <p className="mt-4 max-w-[52ch] text-sm text-ink-3">
              AdaptED does not diagnose students or replace IEP or 504 plans, and it can&apos;t promise results. Always check AI-made work before you use it. AI tools helped build this project; see the README.
            </p>
          </div>
          <div className="text-sm md:col-span-5">
            <p className="font-bold">Accessibility of this site</p>
            <ul className="mt-2 space-y-1.5 text-ink-2">
              <li>Calm mode turns off motion, and follows your device&apos;s reduced-motion setting.</li>
              <li>Works with a keyboard and screen readers (WCAG 2.2 AA).</li>
              <li>Body text is Atkinson Hyperlegible, from the Braille Institute.</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-sm text-ink-3">© 2026 AdaptED</p>
      </div>
    </footer>
  );
}
