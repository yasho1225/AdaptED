"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Maximize2,
  Minimize2,
  StickyNote,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  DEMO_SITE_URL,
  PITCH_DIFFERENTIATORS,
  PITCH_HOW_IT_WORKS,
  PITCH_MODE_CARDS,
  PITCH_PROBLEM_STATS,
  PITCH_SLIDES,
  type PitchSlideId,
} from "@/lib/pitch-deck-slides";
import { cn } from "@/lib/utils";

const slideMotion = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -28 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-xl font-bold text-card-accent shadow-[var(--shadow-elevated)] ring-1 ring-white/20",
        className,
      )}
    >
      A
    </span>
  );
}

function SlideChrome({
  eyebrow,
  headline,
  subhead,
  children,
}: {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col justify-center px-8 py-10 md:px-14 md:py-12">
      {eyebrow ? <p className="section-eyebrow w-fit">{eyebrow}</p> : null}
      <h2 className="mt-5 max-w-4xl text-[2rem] font-bold leading-[1.08] tracking-[-0.04em] text-foreground sm:text-5xl md:text-[3.25rem]">
        {headline}
      </h2>
      {subhead ? (
        <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-muted-foreground md:text-xl">
          {subhead}
        </p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}

function TitleSlide() {
  const slide = PITCH_SLIDES[0];
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center md:px-14">
      <LogoMark className="mb-8 h-20 w-20 text-3xl" />
      <p className="text-[15px] font-semibold uppercase tracking-[0.22em] text-primary">
        Adapt<span className="text-foreground">ED</span>
      </p>
      <h1 className="mt-6 max-w-4xl text-[2.5rem] font-bold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-6xl md:text-7xl">
        {slide.headline}
      </h1>
      <p className="mt-8 text-lg text-muted-foreground md:text-xl">{slide.subhead}</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <span className="trust-pill">4 accessibility modes</span>
        <span className="trust-pill">&lt; 30 seconds</span>
        <span className="trust-pill">No sign-up</span>
      </div>
    </div>
  );
}

function ProblemSlide() {
  const slide = PITCH_SLIDES[1];
  return (
    <SlideChrome eyebrow={slide.eyebrow} headline={slide.headline}>
      <div className="grid gap-4 md:grid-cols-3">
        {PITCH_PROBLEM_STATS.map((stat) => (
          <article key={stat.label} className="surface-card rounded-2xl p-6">
            <p className="text-3xl font-semibold tracking-[-0.03em] text-card-accent md:text-4xl">
              {stat.value}
            </p>
            <p className="mt-3 text-[15px] leading-7 text-card-muted-foreground">
              {stat.label}
            </p>
          </article>
        ))}
      </div>
    </SlideChrome>
  );
}

function InsightSlide() {
  const slide = PITCH_SLIDES[2];
  return (
    <SlideChrome eyebrow={slide.eyebrow} headline={slide.headline} subhead={slide.subhead}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PITCH_MODE_CARDS.map((mode) => (
          <article
            key={mode.id}
            className={cn(
              "rounded-2xl border p-5 shadow-[var(--shadow-soft)]",
              mode.tint,
              mode.border,
            )}
          >
            <span
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-card text-sm font-semibold shadow-[var(--shadow-soft)]",
                mode.accent,
              )}
            >
              {mode.icon}
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-card-foreground">
              {mode.title}
            </h3>
            <p className="mt-2 text-[14px] leading-6 text-card-muted-foreground">
              {mode.blurb}
            </p>
          </article>
        ))}
      </div>
    </SlideChrome>
  );
}

function DemoSlide() {
  const slide = PITCH_SLIDES[3];
  return (
    <SlideChrome eyebrow={slide.eyebrow} headline={slide.headline} subhead={slide.subhead}>
      <div className="demo-shell max-w-5xl">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="surface-card-static rounded-2xl p-5">
            <p className="panel-label">Original Assignment</p>
            <p className="mt-3 text-[13px] leading-6 text-card-muted-foreground">
              Photosynthesis is the process by which green plants use sunlight to convert
              carbon dioxide and water into glucose and oxygen. Chlorophyll in the leaves
              captures light energy.
            </p>
          </div>
          <div className="surface-card-static rounded-2xl border-mode-dyslexia-border p-5 ring-2 ring-mode-dyslexia/20">
            <p className="panel-label text-mode-dyslexia">Dyslexia Mode</p>
            <div className="mt-3 space-y-2 text-[13px] leading-6 text-card-foreground">
              <p>Plants make food using sunlight.</p>
              <p>This is called photosynthesis.</p>
              <p>Leaves use chlorophyll to catch light.</p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {PITCH_MODE_CARDS.map((mode) => (
            <span
              key={mode.id}
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] font-medium",
                mode.tint,
                mode.border,
                mode.accent,
              )}
            >
              {mode.title}
            </span>
          ))}
        </div>
        <a
          href={DEMO_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6 inline-flex gap-2"
        >
          Open live demo
          <ExternalLink className="size-4" />
        </a>
      </div>
    </SlideChrome>
  );
}

function ProofSlide() {
  const slide = PITCH_SLIDES[4];
  return (
    <SlideChrome eyebrow={slide.eyebrow} headline={slide.headline}>
      <div className="grid max-w-5xl gap-4 lg:grid-cols-2">
        <article className="surface-card rounded-2xl p-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-card-muted-foreground">
            Original
          </p>
          <p className="mt-4 text-[15px] leading-8 text-card-foreground">
            Photosynthesis is the process by which green plants use sunlight to convert
            carbon dioxide and water into glucose and oxygen.
          </p>
        </article>
        <article className="surface-card rounded-2xl border-mode-dyslexia-border p-6 ring-2 ring-mode-dyslexia/15">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-mode-dyslexia">
            Dyslexia mode
          </p>
          <div className="mt-4 space-y-3 text-[15px] leading-8 text-card-foreground">
            <p>Plants make food using sunlight.</p>
            <p>This is called photosynthesis.</p>
            <p>Leaves use chlorophyll to catch light.</p>
          </div>
        </article>
      </div>
    </SlideChrome>
  );
}

function HowItWorksSlide() {
  const slide = PITCH_SLIDES[5];
  return (
    <SlideChrome eyebrow={slide.eyebrow} headline={slide.headline}>
      <div className="grid max-w-5xl gap-4 md:grid-cols-3">
        {PITCH_HOW_IT_WORKS.map((item) => (
          <article key={item.step} className="surface-card rounded-2xl p-6">
            <p className="text-sm font-semibold tracking-[0.16em] text-card-accent">
              {item.step}
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-card-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-[14px] leading-7 text-card-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </SlideChrome>
  );
}

function DifferentiationSlide() {
  const slide = PITCH_SLIDES[6];
  return (
    <SlideChrome eyebrow={slide.eyebrow} headline={slide.headline}>
      <div className="grid max-w-5xl gap-4 md:grid-cols-3">
        {PITCH_DIFFERENTIATORS.map((item) => (
          <article key={item.title} className="surface-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-card-foreground">
              {item.title}
            </h3>
            <p className="mt-3 text-[14px] leading-7 text-card-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </SlideChrome>
  );
}

function CloseSlide() {
  const slide = PITCH_SLIDES[7];
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center md:px-14">
      <LogoMark className="mb-8" />
      <p className="section-eyebrow">{slide.eyebrow}</p>
      <h2 className="mt-5 max-w-4xl text-[2rem] font-bold leading-[1.1] tracking-[-0.04em] text-foreground sm:text-5xl md:text-[3rem]">
        {slide.headline}
      </h2>
      <a
        href={DEMO_SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-10 inline-flex gap-2 text-base"
      >
        {slide.subhead}
        <ExternalLink className="size-4" />
      </a>
      <p className="mt-8 text-sm text-muted-foreground">
        Press <kbd className="rounded border border-white/20 px-1.5 py-0.5">F</kbd> for
        fullscreen · <kbd className="rounded border border-white/20 px-1.5 py-0.5">N</kbd>{" "}
        for speaker notes
      </p>
    </div>
  );
}

const SLIDE_COMPONENTS: Record<PitchSlideId, () => React.JSX.Element> = {
  title: TitleSlide,
  problem: ProblemSlide,
  insight: InsightSlide,
  demo: DemoSlide,
  proof: ProofSlide,
  "how-it-works": HowItWorksSlide,
  differentiation: DifferentiationSlide,
  close: CloseSlide,
};

export function PitchDeck() {
  const [index, setIndex] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const total = PITCH_SLIDES.length;
  const slide = PITCH_SLIDES[index];
  const SlideBody = SLIDE_COMPONENTS[slide.id];

  const goNext = useCallback(() => {
    setIndex((current) => Math.min(current + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setIndex((current) => Math.max(current - 1, 0));
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      return;
    }
    await document.exitFullscreen();
    setIsFullscreen(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "Home") {
        event.preventDefault();
        setIndex(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        setIndex(total - 1);
      }
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        setNotesOpen((open) => !open);
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void toggleFullscreen();
      }
    };

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [goNext, goPrev, total, toggleFullscreen]);

  return (
    <div className="pitch-deck-root relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, oklch(1 0 0 / 0.1) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
          Exit deck
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setNotesOpen((open) => !open)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[13px] font-medium transition-colors",
              notesOpen
                ? "border-primary/40 bg-primary/15 text-foreground"
                : "border-white/20 bg-white/[0.06] text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={notesOpen}
          >
            <StickyNote className="size-3.5" />
            Notes
          </button>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="size-3.5" />
            ) : (
              <Maximize2 className="size-3.5" />
            )}
            Fullscreen
          </button>
        </div>
      </header>

      <main className="mx-auto flex min-h-screen max-w-7xl items-center pt-16 pb-28">
        <div className="pitch-slide-frame relative aspect-video w-full overflow-hidden rounded-[1.75rem] border border-white/15 bg-background/40 shadow-[var(--shadow-elevated)] backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              {...slideMotion}
            >
              <SlideBody />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-background/80 px-4 py-4 backdrop-blur-md md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={index === 0}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-foreground transition-opacity disabled:opacity-35"
              aria-label="Previous slide"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={index === total - 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-foreground transition-opacity disabled:opacity-35"
              aria-label="Next slide"
            >
              <ArrowRight className="size-4" />
            </button>
            <p className="ml-2 text-sm text-muted-foreground">
              {index + 1} / {total}
            </p>
          </div>

          <div className="hidden items-center gap-1.5 md:flex" aria-hidden>
            {PITCH_SLIDES.map((item, slideIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(slideIndex)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  slideIndex === index
                    ? "w-8 bg-primary"
                    : "w-2 bg-white/25 hover:bg-white/40",
                )}
                aria-label={`Go to slide ${slideIndex + 1}`}
              />
            ))}
          </div>

          <p className="hidden text-[13px] text-muted-foreground lg:block">
            ← → navigate · N notes · F fullscreen
          </p>
        </div>

        <AnimatePresence>
          {notesOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mx-auto mt-4 max-w-7xl rounded-2xl border border-white/15 bg-card p-4 text-left shadow-[var(--shadow-soft)]"
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-card-muted-foreground">
                Speaker notes · slide {index + 1}
              </p>
              <p className="mt-2 text-[14px] leading-7 text-card-foreground">
                {slide.speakerNotes}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </footer>
    </div>
  );
}
