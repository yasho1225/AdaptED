"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AdaptedAssignment, OutputLanguage } from "@/lib/adapt/types";
import { blockId } from "@/components/doc/adapted-document";
import { stripMarkers } from "@/components/doc/rich-text";

const LANG: Record<OutputLanguage, string> = {
  english: "en-US",
  spanish: "es-ES",
  french: "fr-FR",
  hindi: "hi-IN",
  chinese: "zh-CN",
  arabic: "ar-SA",
  vietnamese: "vi-VN",
};

interface Item {
  id: string | null;
  text: string;
}

function itemsFor(a: AdaptedAssignment): Item[] {
  const items: Item[] = [{ id: null, text: `${a.title}. ${a.studentIntro}` }];
  a.sections.forEach((s, si) => {
    items.push({ id: null, text: s.heading });
    s.blocks.forEach((b, bi) => {
      const parts: string[] = [];
      if (b.type === "question") parts.push(`Question ${b.number ?? ""}.`);
      if (b.term) parts.push(`${b.term}. ${b.definition ?? ""}`);
      if (b.text) parts.push(stripMarkers(b.text).replace(/____/g, "blank"));
      if (b.items) parts.push(b.items.map((i) => i.replace(/____/g, "blank")).join(". "));
      if (b.supports?.steps) parts.push(`Steps: ${b.supports.steps.map(stripMarkers).join(". ")}`);
      if (parts.length) items.push({ id: blockId(si, bi), text: parts.join(" ") });
    });
  });
  return items;
}

/** Block-by-block text-to-speech with the current block highlighted. */
export function useReadAloud(assignment: AdaptedAssignment, language: OutputLanguage) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const items = useMemo(() => itemsFor(assignment), [assignment]);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [active, setActive] = useState<string | null>(null);
  const [rate, setRate] = useState(0.95);
  const index = useRef(0);
  const runId = useRef(0);
  const speakRef = useRef<(i: number, run: number) => void>(() => {});

  const stop = useCallback(() => {
    runId.current += 1;
    if (supported) window.speechSynthesis.cancel();
    setState("idle");
    setActive(null);
    index.current = 0;
  }, [supported]);

  const speakFrom = useCallback(
    (i: number, run: number) => {
      if (run !== runId.current) return;
      if (i >= items.length) {
        setState("idle");
        setActive(null);
        index.current = 0;
        return;
      }
      index.current = i;
      const item = items[i];
      setActive(item.id);
      const u = new SpeechSynthesisUtterance(item.text);
      u.lang = LANG[language];
      u.rate = rate;
      u.onend = () => speakRef.current(i + 1, run);
      u.onerror = () => speakRef.current(i + 1, run);
      window.speechSynthesis.speak(u);
      if (item.id) document.querySelector(`[data-block="${item.id}"]`)?.scrollIntoView({ block: "center", behavior: document.documentElement.dataset.calm === "true" ? "auto" : "smooth" });
    },
    [items, language, rate],
  );
  useEffect(() => {
    speakRef.current = speakFrom;
  }, [speakFrom]);

  const play = useCallback(() => {
    if (!supported) return;
    if (state === "paused") {
      window.speechSynthesis.resume();
      setState("playing");
      return;
    }
    window.speechSynthesis.cancel();
    runId.current += 1;
    setState("playing");
    speakFrom(index.current, runId.current);
  }, [supported, state, speakFrom]);

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setState("paused");
  }, [supported]);

  useEffect(() => stop, [assignment, stop]);

  return { supported, state, active, play, pause, stop, rate, setRate };
}
