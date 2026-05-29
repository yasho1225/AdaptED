"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TransformOutput } from "@/components/transform-output";
import { TransformLoading } from "@/components/transform-loading";
import { TransformError } from "@/components/transform-error";
import { GeneratorActions } from "@/components/generators/generator-actions";
import type { AccessibilityMode, TransformResult } from "@/lib/types";
import { MODES } from "@/lib/constants";
import type { GenerationStatus } from "@/hooks/use-generation";
import { cn } from "@/lib/utils";

interface GeneratorPanelProps {
  title: string;
  description: string;
  form: React.ReactNode;
  mode: AccessibilityMode;
  result: TransformResult | null;
  status: GenerationStatus;
  error: string | null;
  onRetry: () => void;
  onRegenerate: () => void;
  filePrefix: string;
}

export function GeneratorPanel({
  title,
  description,
  form,
  mode,
  result,
  status,
  error,
  onRetry,
  onRegenerate,
  filePrefix,
}: GeneratorPanelProps) {
  const modeConfig = MODES.find((m) => m.id === mode)!;
  const { theme } = modeConfig;

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <Card className="surface-card p-5 md:p-6">
        <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-card-foreground">
          {title}
        </h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-card-muted-foreground">
          {description}
        </p>
        <div className="mt-6 space-y-4">{form}</div>
      </Card>

      <Card
        className={cn(
          "surface-card flex flex-col gap-0 overflow-hidden p-0 ring-2",
          theme.ring,
        )}
      >
        <div className={cn("border-b border-border/70 px-5 py-4", theme.tint)}>
          <p className="panel-label">Generated output</p>
        </div>
        <div className="min-h-[280px] flex-1 p-5 md:min-h-[320px]">
          {status === "error" ? (
            <TransformError message={error ?? undefined} onRetry={onRetry} />
          ) : status === "loading" ? (
            <TransformLoading modeLabel={modeConfig.label} />
          ) : result ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full flex-col"
            >
              <TransformOutput
                result={result}
                modeSlug={mode}
                canDownload={false}
                modeIcon={theme.icon}
                modeAccent={theme.accent}
                modeTint={theme.tint}
                modeBorder={theme.border}
              />
              <GeneratorActions
                result={result}
                modeSlug={mode}
                filePrefix={filePrefix}
                onRegenerate={onRegenerate}
              />
            </motion.div>
          ) : (
            <p className="flex h-full min-h-[200px] items-center justify-center text-center text-[14px] leading-relaxed text-card-muted-foreground">
              Fill in the form and generate to see accessible output here.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
