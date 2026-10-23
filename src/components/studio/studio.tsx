"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, RotateCcw, Wand2 } from "lucide-react";
import { useMotion } from "@/components/motion/motion-provider";
import { requestAdaptation } from "@/lib/adapt/client";
import { NEEDS, defaultProfile } from "@/lib/adapt/profile";
import { SAMPLES } from "@/lib/adapt/samples";
import { NEED_IDS, type AdaptResult, type LearnerProfile, type NeedId } from "@/lib/adapt/types";
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
  const { calm } = useMotion();
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
        setError("Add an assignment first — paste text, upload a file, or pick a sample.");
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
      if (opts.scroll) resultRef.current?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
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
    [calm],
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

  const stale = !!ran && !loading && (ran.source !== source || JSON.stringify(ran.profile) !== JSON.stringify(profile));
  const shown = ran && result ? result : null;
  const viewProfile = ran?.profile ?? profile;
  const viewSource = ran?.source ?? source;

  const quickSwitch = (n: NeedId) => {
    const p = { ...defaultProfile(n), grade: profile.grade, language: profile.language };
    setProfile(p);
    void run(source, p);
  };

  const needLabel = profile.needs.map((n) => NEEDS[n].label).join(" + ");

  return (
    <section id="studio" ref={sectionRef} aria-labelledby="studio-heading" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="container-page">
        <div className="max-w-3xl">
          <h2 id="studio-heading" className="text-4xl sm:text-5xl">
            Adapt an assignment.
          </h2>
          <p className="mt-4 text-lg text-ink-2">
            Paste or upload any assignment, describe the learner, and AdaptED rewrites the <em className="not-italic font-semibold text-ink">access</em> — not the learning goals. Every change is explained and every question is checked.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <SourcePanel value={source} onChange={setSource} />
          <ProfilePanel profile={profile} onChange={setProfile} />
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button type="button" className="btn btn-brand min-h-[3.25rem] px-7 text-base" onClick={() => void run(source, profile, { scroll: true })} disabled={loading}>
            <Wand2 className="size-5" aria-hidden />
            {loading ? "Adapting…" : `Adapt for ${needLabel}`}
            <ArrowRight className="size-4" aria-hidden />
          </button>
          {stale && <p className="text-sm font-semibold text-warn">You changed the assignment or profile — adapt again to update.</p>}
        </div>
        {error && (
          <p role="alert" className="mx-auto mt-4 max-w-xl rounded-xl border border-warn/40 bg-warn-soft px-4 py-3 text-center font-semibold text-warn">
            {error}
          </p>
        )}

        <div ref={resultRef} className="mt-14 scroll-mt-24 space-y-5" aria-live="polite" aria-busy={loading}>
          {ran && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl">{shown && !loading ? "The transformation" : "Transforming…"}</h3>
                  {shown && !loading && <div className="mt-2"><SourceBadge result={shown} liveBusy={liveBusy} onRunLive={async () => { setLiveBusy(true); await run(viewSource, viewProfile, { live: true }); setLiveBusy(false); }} /></div>}
                </div>
                {shown && !loading && <ResultActions result={shown} />}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-ink-2">See it for:</span>
                {NEED_IDS.map((n) => {
                  const on = viewProfile.needs.length === 1 && viewProfile.needs[0] === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={on}
                      disabled={loading}
                      onClick={() => quickSwitch(n)}
                      className={cn(`need-${n}`, "chip !min-h-0 !py-1 transition-colors", on ? "border-[color:var(--need)] bg-[color:var(--need)] text-[color:var(--on-need)]" : "hover:border-[color:var(--need)]")}
                    >
                      {NEEDS[n].label}
                    </button>
                  );
                })}
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
                  <div className="mb-4 flex items-center justify-between gap-3">
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
