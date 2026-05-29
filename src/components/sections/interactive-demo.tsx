"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, ClipboardPaste, Globe, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ModeSelector } from "@/components/mode-selector";
import { TransformOutput } from "@/components/transform-output";
import { TransformLoading } from "@/components/transform-loading";
import { TransformError } from "@/components/transform-error";
import { EXAMPLE_ASSIGNMENT, MODES } from "@/lib/constants";
import { useTransform } from "@/hooks/use-transform";
import { useGeneration } from "@/hooks/use-generation";
import { TRANSLATE_WORKSPACE_OPTIONS } from "@/lib/generation/constants";
import {
  ASSIGNMENT_BRIEF_TEMPLATE,
  buildAssignmentInputFromBrief,
  buildAssignmentSourceText,
  focusAssignmentBriefTopic,
  getAssignmentBriefHint,
  isAssignmentBriefForm,
  parseAssignmentBrief,
} from "@/lib/generation/build-assignment-text";
import type { AssignmentInput, MultilingualInput, TargetLanguage } from "@/lib/generation/types";
import type { AccessibilityMode } from "@/lib/types";
import { cn } from "@/lib/utils";

const toolbarSelectClass =
  "h-8 cursor-pointer rounded-lg border border-border bg-input py-0 pl-2 pr-7 text-[13px] font-medium text-card-foreground shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30";

export function InteractiveDemo() {
  const [input, setInput] = useState(EXAMPLE_ASSIGNMENT);
  const [mode, setMode] = useState<AccessibilityMode>("dyslexia");
  const [modePulse, setModePulse] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage | "">("");
  const [isGeneratingAssignment, setIsGeneratingAssignment] = useState(false);
  const [briefHint, setBriefHint] = useState<string | null>(null);
  const [outputVersion, setOutputVersion] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const generatedInputRef = useRef<string | null>(null);

  const activeModeConfig = MODES.find((m) => m.id === mode)!;
  const { theme } = activeModeConfig;

  const transformEnabled = useMemo(
    () => !isAssignmentBriefForm(input) || parseAssignmentBrief(input) !== null,
    [input],
  );

  const {
    result: transformResult,
    status: transformStatus,
    error: transformError,
    retry: retryTransform,
    transformNow,
    isLoading: isTransformLoading,
  } = useTransform(input, mode, { enabled: transformEnabled });

  const {
    result: translationResult,
    status: translationStatus,
    error: translationError,
    generate: generateTranslation,
    retry: retryTranslation,
    reset: resetTranslation,
    isLoading: isTranslationLoading,
  } = useGeneration<MultilingualInput>("/api/generate/multilingual");

  const {
    result: assignmentResult,
    status: assignmentStatus,
    error: assignmentError,
    generate: generateAssignment,
    retry: retryAssignment,
    reset: resetAssignment,
  } = useGeneration<AssignmentInput>("/api/generate/assignment");

  const isTranslating = Boolean(targetLanguage);
  const showAssignmentOutput =
    Boolean(assignmentResult) &&
    generatedInputRef.current !== null &&
    input.trim() === generatedInputRef.current;

  const isOutputLoading = isTranslating
    ? isTranslationLoading
    : showAssignmentOutput
      ? assignmentStatus === "loading" || isGeneratingAssignment
      : isTransformLoading || isGeneratingAssignment;

  const outputStatus = isTranslating
    ? translationStatus
    : showAssignmentOutput
      ? assignmentStatus === "error"
        ? "error"
        : assignmentStatus === "loading" || isGeneratingAssignment
          ? "loading"
          : "success"
      : transformStatus;

  const outputError = isTranslating
    ? translationError
    : showAssignmentOutput
      ? assignmentError
      : transformError;

  const outputResult = isTranslating
    ? translationResult
    : showAssignmentOutput && assignmentResult
      ? assignmentResult
      : transformResult;

  useEffect(() => {
    if (
      generatedInputRef.current &&
      input.trim() !== generatedInputRef.current
    ) {
      resetAssignment();
      generatedInputRef.current = null;
    }
  }, [input, resetAssignment]);

  const prevModeRef = useRef(mode);
  useEffect(() => {
    if (prevModeRef.current === mode) return;
    prevModeRef.current = mode;

    if (isTranslating) return;

    if (
      generatedInputRef.current &&
      input.trim() === generatedInputRef.current
    ) {
      resetAssignment();
      generatedInputRef.current = null;
    }

    setOutputVersion((v) => v + 1);
  }, [mode, input, isTranslating, resetAssignment]);

  const runTranslation = useCallback(
    async (lang: TargetLanguage) => {
      const content = input.trim();
      if (!content) return;
      const result = await generateTranslation({
        content,
        targetLanguage: lang,
        mode,
      });
      if (result) setOutputVersion((v) => v + 1);
    },
    [input, mode, generateTranslation],
  );

  useEffect(() => {
    setModePulse(true);
    const t = window.setTimeout(() => setModePulse(false), 700);
    return () => window.clearTimeout(t);
  }, [mode]);

  useEffect(() => {
    if (!targetLanguage) return;
    void runTranslation(targetLanguage);
  }, [targetLanguage, mode, input, runTranslation]);

  const handleTranslateChange = (value: string) => {
    if (!value) {
      setTargetLanguage("");
      resetTranslation();
      return;
    }
    setTargetLanguage(value as TargetLanguage);
  };

  const promptForAssignmentBrief = () => {
    if (!isAssignmentBriefForm(input)) {
      setInput(ASSIGNMENT_BRIEF_TEMPLATE);
    }
    setBriefHint(getAssignmentBriefHint(input));
    requestAnimationFrame(() => focusAssignmentBriefTopic(inputRef.current));
  };

  const handleGenerate = async () => {
    const brief = parseAssignmentBrief(input);
    if (!brief) {
      promptForAssignmentBrief();
      return;
    }

    setBriefHint(null);
    const assignmentInput = buildAssignmentInputFromBrief(brief, mode);
    const nextText = buildAssignmentSourceText(assignmentInput);

    setIsGeneratingAssignment(true);
    resetTranslation();
    setTargetLanguage("");
    setInput(nextText);
    generatedInputRef.current = nextText.trim();
    setOutputVersion((v) => v + 1);

    try {
      const generated = await generateAssignment(assignmentInput);
      if (generated) {
        setOutputVersion((v) => v + 1);
      } else {
        generatedInputRef.current = null;
        await transformNow();
        setOutputVersion((v) => v + 1);
      }
    } finally {
      setIsGeneratingAssignment(false);
    }
  };

  const loadExample = () => {
    generatedInputRef.current = null;
    resetAssignment();
    resetTranslation();
    setTargetLanguage("");
    const isAlreadyExample = input.trim() === EXAMPLE_ASSIGNMENT.trim();
    setInput(EXAMPLE_ASSIGNMENT);
    if (isAlreadyExample) {
      void transformNow();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        resetTranslation();
        setTargetLanguage("");
        setInput(text);
      }
    } catch {
      loadExample();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    resetTranslation();
    setTargetLanguage("");

    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        if (text.trim()) setInput(text);
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf") {
      setInput(
        input +
          "\n\n[PDF uploaded — paste text or use Example for best demo results.]",
      );
    }
    e.target.value = "";
  };

  return (
    <section id="demo" className="section-band scroll-mt-[4.25rem] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center md:mb-12"
        >
          <p className="section-eyebrow">Live demo</p>
          <h2 className="section-title">Watch accessibility happen in real time</h2>
          <p className="section-description">
            Paste any assignment on the left. Pick a mode. See a visibly different
            output on the right.
          </p>
        </motion.div>

        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-center gap-2 text-[13px] font-medium text-muted-foreground">
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-foreground shadow-sm">
              1 · Input
            </span>
            <span className="text-white/40" aria-hidden>
              →
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-foreground shadow-sm">
              2 · Mode
            </span>
            <span className="text-white/40" aria-hidden>
              →
            </span>
            <span className="rounded-full border border-white/30 bg-card px-3 py-1 font-medium text-card-foreground shadow-sm">
              3 · Output
            </span>
          </div>

          <div role="group" aria-label="Accessibility mode">
            <p className="mb-3 text-center text-[13px] font-medium text-muted-foreground lg:text-left">
              Choose how students should experience this material
            </p>
            <ModeSelector active={mode} onChange={setMode} variant="cards" />
          </div>

          <motion.div layout className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <Card className="surface-card-interactive flex flex-col gap-0 overflow-hidden py-0">
              <div className="border-b border-border/70 bg-muted/50 px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-[14px] font-semibold tracking-[-0.02em] text-card-foreground">
                    Original Assignment
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handlePaste}
                      className="gap-1.5 border-border font-medium"
                    >
                      <ClipboardPaste className="size-3.5" />
                      Paste
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadExample}
                      className="gap-1.5 font-medium"
                    >
                      Example
                    </Button>
                    <label className="inline-flex cursor-pointer">
                      <span className="interactive-hover inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-input px-3 text-[13px] font-medium text-card-foreground shadow-sm hover:bg-muted hover:shadow-[var(--shadow-soft)]">
                        <FileUp className="size-3.5" />
                        Upload
                      </span>
                      <input
                        type="file"
                        accept=".txt,.pdf,text/plain,application/pdf"
                        className="sr-only"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void handleGenerate()}
                      disabled={isGeneratingAssignment}
                      className="gap-1.5 font-semibold shadow-sm"
                    >
                      <Sparkles className="size-3.5" />
                      {isGeneratingAssignment
                        ? "Generating…"
                        : isAssignmentBriefForm(input) &&
                            !parseAssignmentBrief(input)
                          ? "Fill in & generate"
                          : "Generate"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4 md:p-5">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (isAssignmentBriefForm(e.target.value)) {
                      setBriefHint(getAssignmentBriefHint(e.target.value));
                    } else {
                      setBriefHint(null);
                    }
                  }}
                  className="min-h-[280px] resize-none border-border bg-input text-[15px] leading-7 text-card-foreground shadow-none placeholder:text-card-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 md:min-h-[340px]"
                  placeholder="Paste an assignment, or click Generate to set topic, grade, difficulty, and content style."
                  aria-describedby="demo-input-hint"
                />
                <p
                  id="demo-input-hint"
                  className={cn(
                    "mt-2 text-[12px]",
                    briefHint && !parseAssignmentBrief(input)
                      ? "font-medium text-amber-700 dark:text-amber-200"
                      : "text-card-muted-foreground",
                  )}
                >
                  {briefHint && !parseAssignmentBrief(input)
                    ? briefHint
                    : isAssignmentBriefForm(input) && !parseAssignmentBrief(input)
                      ? "Fill in every section, then click Generate again."
                      : "Generate builds a new assignment from your topic, grade, difficulty, and content style."}
                </p>
              </div>
            </Card>

            <div className="relative">
              {modePulse && (
                <motion.span
                  aria-hidden
                  initial={{ opacity: 0.6, scale: 0.98 }}
                  animate={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.7 }}
                  className={cn(
                    "pointer-events-none absolute -inset-1 rounded-2xl ring-4",
                    theme.ring,
                  )}
                />
              )}
              <Card
                className={cn(
                  "surface-card-interactive flex flex-col gap-0 overflow-hidden py-0 ring-2 transition-shadow duration-300",
                  theme.ring,
                  modePulse && "shadow-[var(--shadow-elevated)]",
                )}
              >
                <div className={cn("border-b border-border/70 px-5 py-4", theme.tint)}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg shadow-sm",
                          theme.icon,
                        )}
                      >
                        <Wand2 className="size-4 text-white" aria-hidden />
                      </span>
                      <div>
                        <h3 className="text-[14px] font-semibold tracking-[-0.02em] text-card-foreground">
                          AdaptED Output
                        </h3>
                        <p className="text-[12px] text-card-muted-foreground">
                          {activeModeConfig.label}
                          {targetLanguage
                            ? ` · ${TRANSLATE_WORKSPACE_OPTIONS.find((o) => o.value === targetLanguage)?.label ?? ""}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:shrink-0">
                      <label
                        htmlFor="demo-translate-lang"
                        className="flex items-center gap-1.5 text-[13px] font-medium text-card-muted-foreground"
                      >
                        <Globe className="size-3.5 shrink-0" aria-hidden />
                        Translate
                      </label>
                      <select
                        id="demo-translate-lang"
                        value={targetLanguage}
                        onChange={(e) => handleTranslateChange(e.target.value)}
                        disabled={!input.trim()}
                        className={cn(toolbarSelectClass, "min-w-[9rem]")}
                        aria-label="Target language for translation"
                      >
                        {TRANSLATE_WORKSPACE_OPTIONS.map((o) => (
                          <option key={o.value || "original"} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ModeSelector active={mode} onChange={setMode} variant="tabs" />
                  </div>
                </div>
                <div className="min-h-[300px] flex-1 bg-card p-5 md:min-h-[360px]">
                  <AnimatePresence mode="wait">
                    {outputStatus === "error" ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <TransformError
                          message={outputError ?? undefined}
                          onRetry={
                            isTranslating
                              ? retryTranslation
                              : showAssignmentOutput
                                ? retryAssignment
                                : retryTransform
                          }
                        />
                      </motion.div>
                    ) : isOutputLoading || (isTranslating && !outputResult) ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <TransformLoading
                          modeLabel={
                            isGeneratingAssignment
                              ? "Generating new assignment"
                              : isTranslating
                                ? `Translating to ${TRANSLATE_WORKSPACE_OPTIONS.find((o) => o.value === targetLanguage)?.label ?? "…"}`
                                : activeModeConfig.label
                          }
                        />
                      </motion.div>
                    ) : outputResult ? (
                      <motion.div
                        key={`${mode}-${targetLanguage}-${outputVersion}-${outputResult.blocks.length}-${outputResult.blocks[0]?.text?.slice(0, 24) ?? ""}`}
                        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <TransformOutput
                          result={outputResult}
                          modeSlug={mode}
                          canDownload={
                            Boolean(input.trim()) && outputStatus === "success"
                          }
                          modeIcon={theme.icon}
                          modeAccent={theme.accent}
                          modeTint={theme.tint}
                          modeBorder={theme.border}
                        />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
