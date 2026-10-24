"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Languages, RotateCcw, Wand2 } from "lucide-react";
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

export function Studio() {
  const { scrollToEl } = useMotion();
  const [source, setSource] = useState(SAMPLES[0].text);
  const [profile, setProfile] = useState<LearnerProfile>(defaultProfile("dyslexia"));
  const [result, setResult] = useState<AdaptResult | null>(null);
  const [ran, setRan] = useState<{ source: string; profile: LearnerProfile } | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveBusy, setLiveBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<ResultTab>("transform");
  const [comparing, setComparing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

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
      setTab("transform");
      // Scroll once the result area has rendered, since it only takes space when there is a result.
      if (opts.scroll) requestAnimationFrame(() => requestAnimationFrame(() => resultRef.current && scrollToEl(resultRef.current)));
      try {
        const r = await requestAdaptation(src, prof, { signal: controller.signal, live: opts.live });
        if (controller.signal.aborted) return;
        setResult(r);
      } catch (e) {
        if (controller.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [scrollToEl],
  );

  // The hero's "Open the … version" button: load its worksheet, pick that need, and show the result.
  useEffect(() => {
    const open = (e: Event) => {
      const { need, compare } = (e as CustomEvent<OpenInStudioDetail>).detail;
      const p = defaultProfile(need);
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
    const p = { ...profile, grade: req.grade };
    setSource(r.text);
    setProfile(p);
    setComparing(false);
    if (r.source === "ai") void run(r.text, p, { scroll: true });
  };

  const needLabel = profile.needs.map((n) => NEEDS[n].label).join(" + ");
  const untranslated = shown && shown.source !== "ai" && viewProfile.language !== "english";

  return (
    <section id="studio" aria-labelledby="studio-heading" className="relative py-16 sm:py-20">
      <div className="container-page">
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2 id="studio-heading" className="t-head lg:col-span-5">
            Try it
          </h2>
          <p className="max-w-[46ch] text-ink-2 lg:col-span-7">
            Bring an assignment or have AI write one, pick your student, and see the new version, what changed, and why.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <SourcePanel value={source} onChange={setSource} onCreated={onCreated} />
          {/* The action closes the student panel: it uses everything set above it. */}
          <ProfilePanel
            profile={profile}
            onChange={setProfile}
            action={
              <div className="mt-auto pt-6">
                <button type="button" className="btn btn-brand min-h-[3.75rem] w-full text-lg [--cut:1.2rem]" onClick={() => void run(source, profile, { scroll: true })} disabled={loading}>
                  <Wand2 className="size-5" aria-hidden />
                  {loading ? "Adapting…" : `Adapt for ${needLabel}`}
                  <ArrowRight className="size-4" aria-hidden />
                </button>
                {stale && <p className="mt-3 text-center text-sm font-semibold text-warn">You made changes. Click the button again to update.</p>}
                {error && (
                  <p role="alert" className="mt-3 rounded-md bg-warn-soft px-4 py-3 text-center font-semibold text-warn">
                    {error}
                  </p>
                )}
              </div>
            }
          />
        </div>

        <div ref={resultRef} className={cn("scroll-mt-24 space-y-5", ran && "mt-14")} aria-live="polite" aria-busy={loading}>
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
                      className={cn(`need-${n}`, "chip", on ? "border-[color:var(--need)] bg-[color:var(--need-soft)]" : "text-ink-2")}
                    >
                      <span aria-hidden className="size-2 shrink-0 rounded-full bg-[color:var(--need)]" />
                      {NEEDS[n].label}
                    </button>
                  );
                })}
              </div>
              <label className="flex items-center gap-2">
                <Languages className="size-4 text-ink-2" aria-hidden />
                <span className="font-semibold text-ink-2">Language:</span>
                <select className="field !w-auto !py-1.5" value={viewProfile.language} disabled={loading} onChange={(e) => switchLanguage(e.target.value as OutputLanguage)}>
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
                  <TransformView source={viewSource} profile={viewProfile} result={loading ? null : shown} loading={loading} />
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
