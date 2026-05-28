"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileUp, ClipboardPaste, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ModeSelector } from "@/components/mode-selector";
import { TransformOutput } from "@/components/transform-output";
import { TransformLoading } from "@/components/transform-loading";
import { TransformError } from "@/components/transform-error";
import { EXAMPLE_ASSIGNMENT, MODES } from "@/lib/constants";
import { useTransform } from "@/hooks/use-transform";
import type { AccessibilityMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function InteractiveDemo() {
  const [input, setInput] = useState(EXAMPLE_ASSIGNMENT);
  const [mode, setMode] = useState<AccessibilityMode>("dyslexia");

  const activeModeConfig = MODES.find((m) => m.id === mode)!;
  const { result, status, error, retry, isLoading } = useTransform(input, mode);

  const loadExample = () => {
    setInput(EXAMPLE_ASSIGNMENT);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) setInput(text);
    } catch {
      setInput(EXAMPLE_ASSIGNMENT);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    <section id="demo" className="scroll-mt-[4.25rem] border-t border-border/60 bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center md:mb-14"
        >
          <p className="section-eyebrow">Try it yourself</p>
          <h2 className="section-title">Same assignment. Four ways to learn.</h2>
          <p className="section-description">
            Paste your material, pick an accessibility mode, and see it reshape
            instantly for each learning need.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-[13px] font-medium text-muted-foreground">
          <span className="rounded-full border border-border bg-background px-3 py-1 shadow-sm">
            1 · Input
          </span>
          <span className="text-border" aria-hidden>
            →
          </span>
          <span className="rounded-full border border-border bg-background px-3 py-1 shadow-sm">
            2 · Mode
          </span>
          <span className="text-border" aria-hidden>
            →
          </span>
          <span className="rounded-full border border-primary/20 bg-accent px-3 py-1 text-primary shadow-sm">
            3 · AI output
          </span>
        </div>

        <ModeSelector active={mode} onChange={setMode} variant="cards" />

        <motion.div layout className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <Card className="surface-card flex flex-col gap-0 overflow-hidden py-0">
            <div className="border-b border-border/70 bg-muted/50 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="panel-label">Original material</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePaste}
                    className="gap-1.5 font-medium"
                  >
                    <ClipboardPaste className="size-3.5" />
                    Paste
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadExample}
                    className="gap-1.5 font-medium"
                  >
                    Example
                  </Button>
                  <label className="inline-flex cursor-pointer">
                    <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[13px] font-medium text-foreground shadow-sm transition-colors hover:bg-muted">
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
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 md:p-5">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[280px] resize-none border-border/80 bg-background/50 text-[15px] leading-7 shadow-none focus-visible:border-ring focus-visible:ring-ring/30 md:min-h-[340px]"
                placeholder="Paste your assignment, worksheet, or lesson notes here..."
              />
            </div>
          </Card>

          <Card
            className={cn(
              "surface-card flex flex-col gap-0 overflow-hidden py-0 ring-2",
              activeModeConfig.theme.ring,
            )}
          >
            <div
              className={cn(
                "border-b border-border/70 px-5 py-4",
                activeModeConfig.theme.surface,
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm",
                    activeModeConfig.theme.gradient,
                  )}
                >
                  <Wand2 className="size-4" />
                </span>
                <h3 className="panel-label">Adapted output</h3>
              </div>
              <div className="mt-4">
                <ModeSelector active={mode} onChange={setMode} variant="tabs" />
              </div>
            </div>
            <div className="min-h-[280px] flex-1 bg-card p-5 md:min-h-[340px]">
              {status === "error" ? (
                <TransformError message={error ?? undefined} onRetry={retry} />
              ) : isLoading ? (
                <TransformLoading modeLabel={activeModeConfig.label} />
              ) : (
                <TransformOutput
                  result={result}
                  modeSlug={mode}
                  canDownload={Boolean(input.trim()) && status === "success"}
                  modeColor={activeModeConfig.theme.gradient}
                  modeSurface={activeModeConfig.theme.surface}
                  modeBorder={activeModeConfig.theme.border}
                  modeText={activeModeConfig.theme.text}
                />
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
