"use client";

import { useId, useMemo, useState } from "react";
import { Lightbulb, Timer } from "lucide-react";
import { languageAttrs } from "@/lib/adapt/profile";
import type { AdaptedAssignment, Block, NeedId, OutputLanguage, Section } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";
import { CueIcon } from "./cue-icon";
import { RichText } from "./rich-text";

export interface DisplayPrefs {
  /** 0 = default, 1 = large, 2 = extra large */
  size: 0 | 1 | 2;
  wide: boolean;
  tint: "paper" | "cream" | "blue" | "gray";
}

export const DEFAULT_PREFS: DisplayPrefs = { size: 0, wide: false, tint: "paper" };

interface Props {
  assignment: AdaptedAssignment;
  need: NeedId;
  needs?: NeedId[];
  compact?: boolean;
  interactive?: boolean;
  prefs?: DisplayPrefs;
  /** Read-aloud: id of the block currently being spoken ("s-b") */
  activeBlock?: string | null;
  /** ADHD focus mode: show one section at a time */
  focusIndex?: number | null;
  headingLevel?: 2 | 3;
  id?: string;
  /** Sets lang/dir so screen readers pronounce translations correctly and Arabic reads right to left. */
  language?: OutputLanguage;
}

const TINTS: Record<DisplayPrefs["tint"], string> = {
  paper: "bg-sheet",
  cream: "bg-[oklch(0.97_0.035_90)] text-[oklch(0.25_0.03_265)]",
  blue: "bg-[oklch(0.95_0.03_235)] text-[oklch(0.25_0.03_265)]",
  gray: "bg-[oklch(0.94_0.005_265)] text-[oklch(0.25_0.03_265)]",
};

export function blockId(si: number, bi: number) {
  return `${si}-${bi}`;
}

export function AdaptedDocument({ assignment, need, needs, compact = false, interactive = false, prefs = DEFAULT_PREFS, activeBlock, focusIndex = null, headingLevel = 2, id, language = "english" }: Props) {
  const all = needs?.length ? needs : [need];
  const dyslexiaStyle = all.includes("dyslexia");
  const predictable = all.includes("autism");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setChecked((c) => ({ ...c, [key]: !c[key] }));

  const H = headingLevel === 2 ? "h2" : "h3";
  const SH = headingLevel === 2 ? "h3" : "h4";

  const sizeClass = compact ? "text-[0.8rem] leading-relaxed" : ["text-[1.0625rem]", "text-[1.2rem]", "text-[1.35rem]"][prefs.size];
  const spacing = !compact && (dyslexiaStyle || prefs.wide) ? "leading-[1.85] tracking-[0.02em] [word-spacing:0.08em]" : "leading-relaxed";

  const sections = assignment.sections;
  const visible = focusIndex === null ? sections.map((_, i) => i) : [focusIndex];

  return (
    <article
      id={id}
      {...languageAttrs(language)}
      className={cn(
        `need-${need}`,
        prefs.tint !== "paper" && "force-light",
        "relative rounded-[inherit] text-ink",
        TINTS[prefs.tint],
        sizeClass,
        spacing,
        compact ? "p-4" : "p-5 sm:p-8",
      )}
      aria-label={`Adapted assignment: ${assignment.title}`}
    >
      <header className={cn("border-b border-rule", compact ? "mb-3 pb-3" : "mb-6 pb-5")}>
        <H className={cn("font-semibold text-ink", compact ? "text-base" : "text-2xl sm:text-[1.75rem]")}>{assignment.title}</H>
        {assignment.studentIntro && <p className={cn("mt-2 text-ink-2", compact && "line-clamp-2")}>{assignment.studentIntro}</p>}
        {assignment.estimatedMinutes && !compact && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--need-soft)] px-3 py-1 text-sm font-bold text-[color:var(--need)]">
            <Timer className="size-4" aria-hidden /> About {assignment.estimatedMinutes} minutes
          </p>
        )}
      </header>

      <div className={compact ? "space-y-4" : "space-y-9"}>
        {visible.map((si) => (
          <SectionView
            key={si}
            section={sections[si]}
            si={si}
            total={sections.length}
            compact={compact}
            interactive={interactive}
            predictable={predictable}
            checked={checked}
            toggle={toggle}
            activeBlock={activeBlock}
            Heading={SH}
          />
        ))}
      </div>
    </article>
  );
}

function SectionView({
  section,
  si,
  total,
  compact,
  interactive,
  predictable,
  checked,
  toggle,
  activeBlock,
  Heading,
}: {
  section: Section;
  si: number;
  total: number;
  compact: boolean;
  interactive: boolean;
  predictable: boolean;
  checked: Record<string, boolean>;
  toggle: (k: string) => void;
  activeBlock?: string | null;
  Heading: "h3" | "h4";
}) {
  const dirNos: number[] = [];
  for (let i = 0, n = 0; i < section.blocks.length; i++) dirNos.push(section.blocks[i].type === "direction" ? ++n : 0);
  return (
    <section aria-label={section.heading}>
      <div className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", compact ? "mb-2" : "mb-4")}>
        {predictable && !compact && <span className="text-sm font-bold text-[color:var(--need)]">Part {si + 1} of {total}</span>}
        <Heading className={cn("font-semibold text-ink", compact ? "text-[0.9rem]" : "text-xl")}>{section.heading}</Heading>
        {section.minutes ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--need)]/30 px-2 py-0.5 text-xs font-bold text-[color:var(--need)]">
            <Timer className="size-3.5" aria-hidden /> {section.minutes} min
          </span>
        ) : null}
      </div>
      {section.purpose && !compact && <p className="-mt-2 mb-4 text-ink-2">{section.purpose}</p>}
      <div className={compact ? "space-y-2" : "space-y-4"}>
        {section.blocks.map((b, bi) => {
          const key = blockId(si, bi);
          return (
            <div
              key={key}
              data-block={key}
              className={cn(
                "rounded-lg transition-[background-color,box-shadow] duration-300",
                activeBlock === key && "bg-mark shadow-[0_0_0_6px_var(--mark)]",
              )}
            >
              <BlockView block={b} k={key} compact={compact} interactive={interactive} checked={checked} toggle={toggle} directionNo={dirNos[bi]} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function BlockView({
  block: b,
  k,
  compact,
  interactive,
  checked,
  toggle,
  directionNo,
}: {
  block: Block;
  k: string;
  compact: boolean;
  interactive: boolean;
  checked: Record<string, boolean>;
  toggle: (k: string) => void;
  directionNo: number;
}) {
  switch (b.type) {
    case "text":
      return (
        <div className="flex gap-3">
          {b.icon && !compact && <CueIcon icon={b.icon} compact />}
          <p className="max-w-[68ch]">
            <RichText text={b.text ?? ""} />
          </p>
        </div>
      );
    case "keyIdea":
      return (
        <div className="rounded-lg bg-[color:var(--need-soft)] px-4 py-3">
          <p className="text-[0.85em] font-bold text-[color:var(--need)]">Key idea</p>
          <p className="font-semibold">
            <RichText text={b.text ?? ""} />
          </p>
        </div>
      );
    case "vocab":
      return (
        <div className={cn("grid gap-x-4 rounded-xl border border-rule bg-paper/60 px-4 py-3", !compact && "sm:grid-cols-[minmax(10rem,auto)_1fr]")}>
          <div>
            <p className="font-bold">{b.term}</p>
            {b.syllables && b.syllables !== b.term && (
              <p className="tnum text-[0.95em] tracking-wide text-[color:var(--need)]" aria-label={`Syllables: ${b.syllables.replace(/·/g, " ")}`}>
                {b.syllables}
              </p>
            )}
          </div>
          {b.definition && <p className="text-ink-2">{b.definition}</p>}
        </div>
      );
    case "direction":
      return (
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[color:var(--need)] text-sm font-bold text-[color:var(--on-need)]" aria-hidden>
            {directionNo}
          </span>
          <p className="flex-1 pt-0.5">
            <span className="sr-only">Step {directionNo}: </span>
            <RichText text={b.text ?? ""} />
          </p>
          {b.icon && !compact && <CueIcon icon={b.icon} />}
        </div>
      );
    case "question":
      return <QuestionView block={b} compact={compact} />;
    case "checklist":
    case "expectations":
      if (b.type === "expectations") {
        return (
          <dl className="@container grid gap-2 rounded-xl border-2 border-[color:var(--need)]/40 bg-[color:var(--need-soft)] p-4">
            {(b.items ?? []).map((item, i) => {
              const at = item.indexOf(":");
              const label = at > 0 ? item.slice(0, at) : "";
              const value = at > 0 ? item.slice(at + 1).trim() : item;
              return (
                <div key={i} className="grid gap-x-3 @sm:grid-cols-[11rem_1fr]">
                  <dt className="font-bold text-[color:var(--need)]">{label}</dt>
                  <dd>{value}</dd>
                </div>
              );
            })}
          </dl>
        );
      }
      return (
        <ul className="space-y-2" aria-label="Checklist">
          {(b.items ?? []).map((item, i) => {
            const key = `${k}-${i}`;
            const on = !!checked[key];
            return (
              <li key={i}>
                {interactive ? (
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-1 hover:bg-paper-2">
                    <input type="checkbox" checked={on} onChange={() => toggle(key)} className="peer sr-only" />
                    <span
                      className={cn(
                        "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2 border-[color:var(--need)] transition-colors peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand",
                        on && "bg-[color:var(--need)] text-[color:var(--on-need)]",
                      )}
                      aria-hidden
                    >
                      {on && (
                        <svg viewBox="0 0 24 24" className="size-4">
                          <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className={cn(on && "text-ink-3 line-through decoration-2")}>{item}</span>
                  </label>
                ) : (
                  <span className="flex items-start gap-3">
                    <span className="mt-1 size-5 shrink-0 rounded border-2 border-[color:var(--need)]" aria-hidden />
                    <span>{item}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      );
    case "example":
      return (
        <figure className="rounded-xl border border-dashed border-ink-3/50 bg-paper/50 px-4 py-3">
          <figcaption className="text-[0.85em] font-bold text-ink-3">Model answer, using a different example</figcaption>
          <p className="mt-1 font-semibold">
            <RichText text={b.text ?? ""} />
          </p>
          {b.items?.map((it, i) => (
            <p key={i} className="mt-1 text-ink-2">
              <RichText text={it} />
            </p>
          ))}
        </figure>
      );
    case "break":
      return (
        <div className="flex items-center gap-3 rounded-full border border-[color:var(--need)]/30 bg-[color:var(--need-soft)] px-4 py-2.5">
          {b.icon && <CueIcon icon={b.icon} compact />}
          <p className="font-semibold">
            {b.minutes ? `${b.minutes}-minute break: ` : ""}
            <RichText text={b.text ?? ""} />
          </p>
        </div>
      );
    case "notes":
      return <GuidedNotes block={b} interactive={interactive && !compact} />;
    case "tip":
      return (
        <p className="ml-4 rounded-md bg-paper-2 px-3 py-2 text-[0.92em] text-ink-2">
          <RichText text={b.text ?? ""} />
        </p>
      );
    default:
      return null;
  }
}

function QuestionView({ block: b, compact }: { block: Block; compact: boolean }) {
  const s = b.supports;
  return (
    <div className={cn("rounded-xl border border-rule bg-sheet", compact ? "p-3" : "p-4 sm:p-5")}>
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg border-2 border-ink text-base font-bold" aria-hidden>
          {b.number ?? "?"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            <span className="sr-only">Question {b.number}: </span>
            <RichText text={b.text ?? ""} />
          </p>
          {b.items && b.items.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {b.items.map((it, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 size-3.5 shrink-0 rounded-full border-2 border-ink-3" aria-hidden />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {b.icon && !compact && <CueIcon icon={b.icon} />}
      </div>

      {s && !compact && (
        <div className="mt-4 space-y-3 border-t border-dashed border-rule-strong pt-3 text-[0.95em]">
          {s.length && (
            <p>
              <span className="font-bold text-[color:var(--need)]">How much: </span>
              {s.length}
            </p>
          )}
          {s.steps && (
            <div>
              <p className="font-bold text-[color:var(--need)]">Steps</p>
              <ol className="mt-1 list-decimal space-y-1 pl-6 marker:font-bold">
                {s.steps.map((st, i) => (
                  <li key={i}>
                    <RichText text={st} />
                  </li>
                ))}
              </ol>
            </div>
          )}
          {s.starters && (
            <div>
              <p className="font-bold text-[color:var(--need)]">Sentence starters</p>
              <ul className="mt-1 space-y-1">
                {s.starters.map((st, i) => (
                  <li key={i} className="rounded-md border border-dashed border-rule-strong bg-paper/60 px-3 py-1.5">
                    {st}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {s.wordBank && (
            <div>
              <p className="font-bold text-[color:var(--need)]">Word bank</p>
              <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="Word bank">
                {s.wordBank.map((w) => (
                  <li key={w} className="rounded-md bg-[color:var(--need-soft)] px-2 py-0.5 font-semibold">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {s.hint && (
            <p className="flex items-start gap-2 text-ink-2">
              <Lightbulb className="mt-1 size-4 shrink-0 text-[color:var(--need)]" aria-hidden />
              <span>
                <span className="sr-only">Hint: </span>
                <RichText text={s.hint} />
              </span>
            </p>
          )}
          {s.responseOptions && (
            <p>
              <span className="font-bold text-[color:var(--need)]">Ways to answer: </span>
              {s.responseOptions.join(" · ")}
            </p>
          )}
        </div>
      )}
      {!compact && <div className="answer-lines mt-4 hidden h-24 ruled print:block" aria-hidden />}
    </div>
  );
}

function GuidedNotes({ block: b, interactive }: { block: Block; interactive: boolean }) {
  const uid = useId();
  const lines = useMemo(() => {
    const out: { segs: string[]; firstBlank: number }[] = [];
    let count = 0;
    for (const line of b.items ?? []) {
      const segs = line.split("____");
      out.push({ segs, firstBlank: count + 1 });
      count += segs.length - 1;
    }
    return out;
  }, [b.items]);
  return (
    <div className="rounded-xl border border-rule bg-paper/60 p-4">
      {b.text && <p className="mb-3 font-semibold text-[color:var(--need)]">{b.text}</p>}
      <ol className="list-decimal space-y-2.5 pl-6 marker:font-bold">
        {lines.map(({ segs, firstBlank }, li) => (
          <li key={li}>
            {segs.map((seg, i) => (
              <span key={i}>
                {seg}
                {i < segs.length - 1 &&
                  (interactive ? (
                    <input
                      aria-label={`Blank ${firstBlank + i}`}
                      id={`${uid}-${firstBlank + i}`}
                      className="mx-1 inline-block w-32 border-0 border-b-2 border-[color:var(--need)] bg-transparent px-1 text-center font-semibold focus-visible:outline-offset-1"
                    />
                  ) : (
                    <span className="mx-1 inline-block w-24 border-b-2 border-ink-3 align-baseline" role="img" aria-label="blank" />
                  ))}
              </span>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
