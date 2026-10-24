"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Check, Lock } from "lucide-react";
import { OriginalDocument, barrierRanges } from "@/components/doc/original-document";
import { useMotion } from "@/components/motion/motion-provider";
import { detectBarriers, normalize, parseAssignment } from "@/lib/adapt/analyze";
import { SCIENCE } from "@/lib/adapt/curated/science";
import { checkFidelity } from "@/lib/adapt/fidelity";
import { NEEDS, SUPPORTS } from "@/lib/adapt/profile";
import { SAMPLES } from "@/lib/adapt/samples";
import { NEED_IDS } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/*
 * The four "How it works" pictures. Each one is the product itself, built from the same
 * grade 7 science worksheet and the same code the studio runs: real barriers, real supports,
 * the real pre-made versions, and fidelity numbers computed on the spot.
 */

const SAMPLE = SAMPLES[0];

/** Plays a visual's entrance once, the first time it is shown. Calm mode: no entrance. */
function useEntrance(scope: React.RefObject<HTMLElement | null>, play: boolean, build: (tl: gsap.core.Timeline) => void) {
  const { calm } = useMotion();
  const played = useRef(false);
  useGSAP(
    () => {
      if (!play || calm || played.current) return;
      played.current = true;
      build(gsap.timeline({ defaults: { ease: "power3.out" } }));
    },
    { scope, dependencies: [play, calm] },
  );
}

/* 1 · Find what's hard ------------------------------------------------ */

export function FindVisual({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { text, barriers, shown } = useMemo(() => {
    const p = parseAssignment(SAMPLE.text);
    const text = [p.title, ...p.passages].filter(Boolean).join("\n\n");
    const barriers = detectBarriers(SAMPLE.text);
    const shown = barrierRanges(normalize(text).trim(), barriers).map((r) => barriers[r.index]);
    return { text, barriers, shown };
  }, []);

  useEntrance(ref, play, (tl) => {
    tl.fromTo(".scan", { top: "0%", opacity: 1 }, { top: "100%", duration: 1.3, ease: "power1.inOut" })
      .to(".scan", { opacity: 0, duration: 0.2 })
      .fromTo(".barrier-mark", { "--mark-size": "0%" }, { "--mark-size": "100%", duration: 0.45, stagger: 0.12, ease: "power2.out" }, 0.2)
      .from(".issue", { x: -12, opacity: 0, duration: 0.5, stagger: 0.1 }, 0.6);
  });

  return (
    <div ref={ref} data-ui className="sheet relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-rule px-5 py-3 text-sm">
        <span className="font-bold">Original · grade {SAMPLE.grade} science</span>
        <span className="tnum shrink-0 rounded-full bg-mark-strong px-2.5 py-0.5 font-bold text-sheet-ink">{shown.length} found in the reading</span>
      </div>
      <div className="relative px-5 pt-4 pb-2 sm:px-6">
        <div aria-hidden className="scan pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] bg-brand opacity-0" />
        <OriginalDocument text={text} barriers={barriers} className="line-clamp-[11] text-[0.95rem] text-ink-2" />
      </div>
      <ol className="space-y-1.5 border-t border-rule bg-paper/60 px-5 py-4 text-sm sm:px-6">
        {shown.slice(0, 3).map((b, i) => (
          <li key={i} className="issue flex gap-2.5">
            <span className="tnum grid size-5 shrink-0 place-items-center rounded bg-mark-strong tnum text-xs font-bold text-sheet-ink">{i + 1}</span>
            <span className="text-ink-2">{b.issue}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* 2 · Learn about the student ---------------------------------------- */

export function StudentVisual({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const need = "dyslexia" as const;
  useEntrance(ref, play, (tl) => {
    tl.from(".need-pill", { y: 10, opacity: 0, duration: 0.4, stagger: 0.06 })
      .fromTo(".need-pill.on", { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: "power1.inOut" })
      .from(".help-chip", { scale: 0.85, opacity: 0, duration: 0.35, stagger: 0.07, ease: "back.out(2)" }, "-=0.1")
      .from(".privacy", { opacity: 0, y: 8, duration: 0.4 }, "-=0.1");
  });

  return (
    <div ref={ref} data-ui className="panel p-5 sm:p-6">
      <p className="text-lg font-bold">Your student</p>
      <p className="mt-3 text-sm font-semibold text-ink-2">Needs help with</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {NEED_IDS.map((n) => (
          <li
            key={n}
            className={cn(
              `need-${n}`,
              "need-pill rounded-md border px-3 py-1.5 text-sm font-bold",
              n === need ? "on border-[color:var(--need)] bg-[color:var(--need)] text-[color:var(--on-need)]" : "border-rule-strong text-ink-2",
            )}
          >
            {NEEDS[n].label}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm font-semibold text-ink-2">Kinds of help</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {NEEDS[need].defaultSupports.map((s) => (
          <li key={s} className="help-chip inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-sm font-semibold text-paper">
            <Check className="size-3.5" strokeWidth={3} aria-hidden /> {SUPPORTS[s].label}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm font-semibold text-ink-2">Learning goals</p>
      <p className="mt-1 font-bold">The same as the rest of the class</p>
      <p className="privacy mt-6 flex items-center gap-2 border-t border-rule pt-4 text-sm text-ink-2">
        <Lock className="size-4 shrink-0" aria-hidden /> No names. No medical details. Nothing is saved.
      </p>
    </div>
  );
}

/* 3 · Write the new version ------------------------------------------ */

/** Resting fan positions (tighter on phones so the outer cards stay on screen). */
const FAN = [
  "[transform:translateX(-40%)_translateY(20px)_rotate(-6deg)] sm:[transform:translateX(-62%)_translateY(26px)_rotate(-8deg)]",
  "[transform:translateX(-14%)_translateY(4px)_rotate(-2deg)] sm:[transform:translateX(-21%)_translateY(4px)_rotate(-2.5deg)]",
  "[transform:translateX(14%)_translateY(4px)_rotate(2deg)] sm:[transform:translateX(21%)_translateY(4px)_rotate(2.5deg)]",
  "[transform:translateX(40%)_translateY(20px)_rotate(6deg)] sm:[transform:translateX(62%)_translateY(26px)_rotate(8deg)]",
];

const plain = (s: string) => s.replace(/\*\*/g, "");

export function WriteVisual({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const cards = useMemo(
    () =>
      NEED_IDS.map((n) => {
        const a = SCIENCE[n];
        const section = a.sections.find((s) => s.blocks.some((b) => b.text)) ?? a.sections[0];
        const lines = section.blocks.map((b) => b.text).filter(Boolean).slice(0, 5) as string[];
        return { n, title: a.title, heading: section.heading, lines };
      }),
    [],
  );
  useEntrance(ref, play, (tl) => {
    // GSAP reads each card's resting fan transform from CSS and deals the cards out to it from one stack.
    tl.from(".fan-card", { x: 0, y: 60, rotation: 0, opacity: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" });
  });

  return (
    <div ref={ref} data-ui className="relative mx-auto h-[20rem] w-full max-w-[40rem] sm:h-[26rem]">
      {cards.map((c, i) => (
        <div
          key={c.n}
          className={cn(`need-${c.n}`, FAN[i], "fan-card sheet absolute top-2 border border-rule-strong left-[calc(50%-5.5rem)] flex h-[17rem] w-[11rem] flex-col overflow-hidden sm:left-[calc(50%-7.25rem)] sm:h-[22rem] sm:w-[14.5rem]")}
          style={{ transformOrigin: "50% 100%", zIndex: i === 1 || i === 2 ? 2 : 1 }}
        >
          <p className="bg-[color:var(--need)] px-4 py-2 text-sm font-bold text-[color:var(--on-need)]">{NEEDS[c.n].label}</p>
          <div className="min-h-0 flex-1 px-4 py-3">
            <p className="text-[0.82rem] font-bold leading-snug">{c.title}</p>
            <p className="mt-2 text-xs font-bold text-[color:var(--need)]">{c.heading}</p>
            <div className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-ink-2">
              {c.lines.map((l, j) => (
                <p key={j} className="line-clamp-4">
                  {plain(l)}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 4 · Check the work -------------------------------------------------- */

function TickDraw() {
  return (
    <svg viewBox="0 0 24 24" className="tick size-5 shrink-0 text-ok" aria-hidden>
      <path d="M5 12.5l4.2 4.2L19 7.4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" />
    </svg>
  );
}

export function CheckVisual({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const rows = useMemo(
    () =>
      NEED_IDS.map((n) => {
        const f = checkFidelity(SAMPLE.text, SCIENCE[n]);
        const vocab = f.vocabularyKept.length + f.vocabularyDropped.length;
        return { n, f, vocab };
      }),
    [],
  );
  useEntrance(ref, play, (tl) => {
    tl.from(".ledger-row", { opacity: 0, y: 10, duration: 0.4, stagger: 0.1 }).fromTo(
      ".tick path",
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" },
      0.25,
    );
  });

  return (
    <div ref={ref} data-ui className="panel overflow-hidden">
      <div className="border-b border-rule px-5 py-3 sm:px-6">
        <p className="font-bold">Checked by AdaptED&apos;s code, not by the AI</p>
        <p className="text-sm text-ink-3">The same grade {SAMPLE.grade} worksheet, all four versions</p>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="text-ink-3">
          <tr className="border-b border-rule">
            <th className="px-5 py-2 font-semibold sm:px-6">Version</th>
            <th className="px-2 py-2 font-semibold">Questions</th>
            <th className="px-2 py-2 font-semibold">Choices</th>
            <th className="px-2 py-2 pr-5 font-semibold sm:pr-6">Key words</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ n, f, vocab }) => (
            <tr key={n} className={cn(`need-${n}`, "ledger-row border-b border-rule last:border-0")}>
              <th scope="row" className="px-5 py-3 font-bold sm:px-6">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-[color:var(--need)]" />
                  {NEEDS[n].label}
                </span>
              </th>
              <td className="px-2 py-3">
                <span className="tnum flex items-center gap-1.5 tnum font-bold">
                  {f.matchedQuestions}/{f.originalQuestions} {f.missing.length === 0 && <TickDraw />}
                </span>
              </td>
              <td className="px-2 py-3">
                <span className="flex items-center gap-1.5 font-bold">{f.choicesPreserved ? <>kept <TickDraw /></> : "missing"}</span>
              </td>
              <td className="px-2 py-3 pr-5 sm:pr-6">
                <span className="tnum flex items-center gap-1.5 tnum font-bold">
                  {f.vocabularyKept.length}/{vocab} {f.vocabularyDropped.length === 0 && <TickDraw />}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
