"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { RichText } from "@/components/doc/rich-text";
import { useMotion } from "@/components/motion/motion-provider";
import { parseAssignment, words } from "@/lib/adapt/analyze";
import { SCIENCE } from "@/lib/adapt/curated/science";
import { SAMPLES } from "@/lib/adapt/samples";
import { OPEN_IN_STUDIO, type OpenInStudioDetail } from "@/lib/events";
import { cn } from "@/lib/utils";

type View = "before" | "after";

/**
 * Showcase (tasteskill blueprint "Square plate, spare text"): the real sample reading on a square
 * paper plate. "Before" is the dense original; "After" is the real dyslexia version's chunks.
 * The plate opens with the shutter when it enters, then shows the After state once by itself;
 * the tabs switch freely. Calm mode: no autoplay, no motion.
 */
export function ReliefShowcase() {
  const { calm } = useMotion();
  const [view, setView] = useState<View>("before");
  const touched = useRef(false);
  const plate = useRef<HTMLDivElement>(null);

  const before = useMemo(() => parseAssignment(SAMPLES[0].text).passages.join(" "), []);
  const beforeWords = words(before).length;
  const after = useMemo(
    () =>
      SCIENCE.dyslexia.sections
        .filter((s) => s.heading.startsWith("Read"))
        .slice(0, 2)
        .flatMap((s) => [{ heading: s.heading.replace(/^Read:\s*/, ""), text: "", key: false }, ...s.blocks.map((b) => ({ heading: "", text: b.text ?? "", key: b.type === "keyIdea" }))]),
    [],
  );

  // Once the plate has opened, let the reading loosen by itself (unless the visitor already chose).
  useEffect(() => {
    if (calm || !plate.current) return;
    const el = plate.current;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => !touched.current && setView("after"), 2200);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [calm]);

  const pick = (v: View) => {
    touched.current = true;
    setView(v);
  };

  const open = (compare: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent<OpenInStudioDetail>(OPEN_IN_STUDIO, { detail: { need: "dyslexia", compare } }));
  };

  const tabs: [View, string][] = [
    ["before", "Before"],
    ["after", "After"],
  ];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-12">
      {/* The plate: square, paper, opened like a shutter. */}
      <div ref={plate} className="shutter lg:col-span-6">
        <div data-ui data-sample className="sheet relative aspect-square overflow-hidden rounded-none border-0">
          <div id="relief-panel" role="tabpanel" aria-labelledby={`relief-tab-${view}`} className="absolute inset-0 overflow-hidden p-6 sm:p-10">
            <div key={view} className="animate-[rise-in_500ms_var(--ease-out)_both]">
              {view === "before" ? (
                <>
                  <p className="text-sm font-bold text-ink-3">The original reading · {beforeWords} words in one block</p>
                  <p className="mt-4 text-justify text-[0.95rem] leading-[1.45] tracking-[-0.01em] text-ink-2 [hyphens:auto] sm:text-base">{before}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-ink-3">The dyslexia version · one idea at a time</p>
                  <div className="mt-4 space-y-3">
                    {after.map((line, i) =>
                      line.heading ? (
                        <p key={i} className="pt-1 text-lg font-bold">
                          {line.heading.charAt(0).toUpperCase() + line.heading.slice(1)}
                        </p>
                      ) : (
                        <p key={i} className={cn("leading-relaxed", line.key ? "bg-[var(--dyslexia-soft)] px-3 py-2 font-bold" : "text-ink-2")}>
                          <RichText text={line.text} />
                        </p>
                      ),
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spare text: tabs, title, description, two action cells. */}
      <div data-rise-group className="flex flex-col gap-8 lg:col-span-6 lg:min-h-[32rem] lg:justify-between">
        <div data-rise role="tablist" aria-label="Show the reading" className="flex gap-6">
          {tabs.map(([v, name]) => (
            <button
              key={v}
              role="tab"
              id={`relief-tab-${v}`}
              aria-selected={view === v}
              aria-controls="relief-panel"
              tabIndex={view === v ? 0 : -1}
              onClick={() => pick(v)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault();
                  const next = v === "before" ? "after" : "before";
                  pick(next);
                  document.getElementById(`relief-tab-${next}`)?.focus();
                }
              }}
              className={cn("min-h-11 text-lg font-bold transition-colors", view === v ? "text-ink underline decoration-brand decoration-[3px] underline-offset-[0.4em]" : "text-ink-3 hover:text-ink")}
            >
              {name}
            </button>
          ))}
        </div>
        <div>
          <h2 id="showcase-heading" data-rise className="t-head">
            One idea at a time
          </h2>
          <p data-rise className="mt-6 max-w-[38ch] text-ink-2">
            The same reading, rebuilt for a student with dyslexia: short sentences, a heading for each part, the key idea pulled out, and every science word kept.
          </p>
        </div>
        <div data-rise className="grid gap-3 sm:grid-cols-2">
          <a href="#studio" onClick={open(false)} className="btn btn-brand min-h-[4.5rem] justify-between px-7 [--cut:1.4rem]">
            Open this version <ArrowRight className="size-5" aria-hidden />
          </a>
          <a href="#studio" onClick={open(true)} className="btn btn-ghost min-h-[4.5rem] justify-between px-7 [--cut:1.4rem]">
            Compare all four <LayoutGrid className="size-5" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
