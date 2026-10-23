"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Languages, RotateCcw, Wand2 } from "lucide-react";
import { CalmMagnet } from "@/components/motion/calm-magnet";
import { useMotion } from "@/components/motion/motion-provider";
import { requestAdaptation } from "@/lib/adapt/client";
import type { CreateRequest, CreateResult } from "@/lib/adapt/create";
import { LANGUAGES, NEEDS, defaultProfile } from "@/lib/adapt/profile";
import { SAMPLES } from "@/lib/adapt/samples";
import { NEED_IDS, type AdaptResult, type LearnerProfile, type NeedId, type OutputLanguage } from "@/lib/adapt/types";
import { OPEN_IN_STUDIO, type OpenInStudioDetail } from "@/lib/events";
import { cn } from "@/lib/utils";
import { CompareAll } from "./compare-all";
import { ProfilePanel } from "./profile-panel";
import { MetricsStrip, PrintCopy, ResultActions, ResultTabs, SourceBadge, TeacherPanel, type ResultTab } from "./result-panel";
import { SourcePanel } from "./source-panel";
import { StudentView } from "./student-view";
import { TransformView } from "./transform-view";
import { WhyPanel } from "./why-panel";

/** Minimum time the Barrier Lens scan plays, so the transformation is visible even for instant results. */
const MIN_SCAN_MS = 1500;

export function Studio() {
  const { calm, scrollToEl } = useMotion();
  const [source, setSource] = useState(SAMPLES[0].text);
  const [profile, setProfile] = useState<LearnerProfile>(defaultProfile("dyslexia"));
  const [result, setResult] = useState<AdaptResult | null>(null);
  const [ran, setRan] = useState<{ source: string; profile: LearnerProfile } | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveBusy, setLiveBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runKey, setRunKey] = useState(0);
  const [tab, setTab] = useState<ResultTab>("transform");
  const [comparing, setComparing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const autoRan = useRef(false);

  const run = useCallback(
    async (src: string, prof: LearnerProfile, opts: { live?: boolean; scroll?: boolean } = {}) => {
      if (!src.trim()) {
        setError("First, add an assignment. Paste it, upload a file, or pick a sample.");
        return;
      }
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setError(null);
      setLoading(true);
      setRan({ source: src, profile: prof });
      setRunKey((k) => k + 1);
      setTab("transform");
      if (opts.scroll && resultRef.current) scrollToEl(resultRef.current);
      const started = performance.now();
      try {
        const r = await requestAdaptation(src, prof, { signal: controller.signal, live: opts.live });
        const wait = calm ? 0 : Math.max(0, MIN_SCAN_MS - (performance.now() - started));
        if (wait) await new Promise((res) => setTimeout(res, wait));
        if (controller.signal.aborted) return;
        setResult(r);
      } catch (e) {
        if (controller.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [calm, scrollToEl],
  );

  // Play the first transformation when the studio scrolls into view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !autoRan.current) {
          autoRan.current = true;
          void run(SAMPLES[0].text, defaultProfile("dyslexia"));
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  // The hero's "Open the … version" button: load its worksheet, pick that need, and show the result.
  useEffect(() => {
    const open = (e: Event) => {
      const { need, compare } = (e as CustomEvent<OpenInStudioDetail>).detail;
      const p = defaultProfile(need);
      autoRan.current = true;
      setComparing(!!compare);
      setSource(SAMPLES[0].text);
      setProfile(p);
      void run(SAMPLES[0].text, p);
      // Scroll once the new profile has rendered, since it changes the height above the result.
      requestAnimationFrame(() => requestAnimationFrame(() => resultRef.current && scrollToEl(resultRef.current)));
    };
    window.addEventListener(OPEN_IN_STUDIO, open);
    return () => window.removeEventListener(OPEN_IN_STUDIO, open);
  }, [run, scrollToEl]);

  const stale = !!ran && !loading && (ran.source !== source || JSON.stringify(ran.profile) !== JSON.stringify(profile));
  const shown = ran && result ? result : null;
  const viewProfile = ran?.profile ?? profile;
  const viewSource = ran?.source ?? source;

  const quickSwitch = (n: NeedId) => {
    const p = { ...defaultProfile(n), grade: profile.grade, language: profile.language };
    setProfile(p);
    void run(source, p);
  };

  const switchLanguage = (language: OutputLanguage) => {
    const p = { ...viewProfile, language };
    setProfile(p);
    void run(viewSource, p);
  };

  // A new assignment from "Create one with AI": load it, match the grade, and adapt it right away.
  // A starter outline (no AI) needs the teacher's reading first, so it waits for the Adapt button.
  const onCreated = (r: CreateResult, req: CreateRequest) => {
    autoRan.current = true;
    const p = { ...profile, grade: req.grade };
    setSource(r.text);
    setProfile(p);
    setComparing(false);
    if (r.source === "ai") void run(r.text, p, { scroll: true });
  };

  const needLabel = profile.needs.map((n) => NEEDS[n].label).join(" + ");
  const untranslated = shown && shown.source !== "ai" && viewProfile.language !== "english";

  return (
    <section id="studio" ref={sectionRef} aria-labelledby="studio-heading" className="field-blue relative scroll-mt-20 pt-12 pb-28 sm:pb-40">
      <div className="container-page">
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2 id="studio-heading" data-reveal className="t-head lg:col-span-5">
            Try it
          </h2>
          <p className="max-w-[46ch] text-ink-2 lg:col-span-7">
            Bring an assignment, or have AI write a new one. Tell AdaptED about your student. See the new version, what changed, and why, in English or another language.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <SourcePanel value={source} onChange={setSource} onCreated={onCreated} />
          <ProfilePanel profile={profile} onChange={setProfile} />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <CalmMagnet>
            <button type="button" className="btn btn-brand min-h-[3.75rem] px-9 text-lg [--cut:1.2rem]" onClick={() => void run(source, profile, { scroll: true })} disabled={loading}>
              <Wand2 className="size-5" aria-hidden />
              {loading ? "Adapting…" : `Adapt for ${needLabel}`}
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </CalmMagnet>
          {stale && <p className="text-sm font-semibold text-warn">You made changes. Click the button again to update.</p>}
        </div>
        {error && (
          <p role="alert" className="mx-auto mt-4 max-w-xl bg-warn-soft px-4 py-3 text-center font-semibold text-warn">
            {error}
          </p>
        )}

        <div ref={resultRef} className="mt-20 scroll-mt-24 space-y-5" aria-live="polite" aria-busy={loading}>
          {ran && (
            <>
              <div data-ui className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl">{shown && !loading ? "Here’s the new version" : "Making the new version…"}</h3>
                  {shown && !loading && <div className="mt-2"><SourceBadge result={shown} liveBusy={liveBusy} onRunLive={async () => { setLiveBusy(true); await run(viewSource, viewProfile, { live: true }); setLiveBusy(false); }} /></div>}
                </div>
                {shown && !loading && <ResultActions result={shown} />}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink-2">Show it for:</span>
                {NEED_IDS.map((n) => {
                  const on = viewProfile.needs.length === 1 && viewProfile.needs[0] === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={on}
                      disabled={loading}
                      onClick={() => quickSwitch(n)}
                      className={cn(`need-${n}`, "chip transition-colors", on ? "border-[color:var(--need)] bg-[color:var(--need)] text-[color:var(--on-need)]" : "hover:border-[color:var(--need)]")}
                    >
                      {NEEDS[n].label}
                    </button>
                  );
                })}
              </div>
              <label className="flex items-center gap-2">
                <Languages className="size-4 text-ink-2" aria-hidden />
                <span className="font-semibold text-ink-2">Language:</span>
                <select className="field on-paper !w-auto !py-1.5" value={viewProfile.language} disabled={loading} onChange={(e) => switchLanguage(e.target.value as OutputLanguage)}>
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>
              </div>
              {untranslated && (
                <p className="-mt-2 text-sm font-semibold text-warn">
                  {viewProfile.language === "simple-english" ? "Simpler English needs AI, which isn’t available right now, so this version keeps the original wording." : "Translating needs AI, which isn’t available right now, so this version is in English."}
                </p>
              )}
              </div>

              {shown && !loading && <MetricsStrip result={shown} />}

              <ResultTabs tab={tab} onTab={setTab} comparing={comparing} onCompare={() => setComparing((c) => !c)} />

              <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
                {tab === "transform" || !shown || loading ? (
                  <TransformView source={viewSource} profile={viewProfile} result={loading ? null : shown} loading={loading} runKey={runKey} />
                ) : tab === "student" ? (
                  <StudentView result={shown} />
                ) : tab === "why" ? (
                  <WhyPanel result={shown} />
                ) : (
                  <TeacherPanel result={shown} />
                )}
              </div>

              {comparing && (
                <div className="pt-6">
                  <div data-ui className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-2xl">One lesson, four versions</h3>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setComparing(false)}>
                      <RotateCcw className="size-4" aria-hidden /> Close comparison
                    </button>
                  </div>
                  <CompareAll source={viewSource} base={viewProfile} />
                </div>
              )}
              {shown && <PrintCopy result={shown} />}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
