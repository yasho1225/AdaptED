"use client";

import { Check, Copy, Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  downloadTransformResult,
  transformResultToPlainText,
} from "@/lib/export-transform";
import { cn } from "@/lib/utils";
import type { AccessibilityMode, TransformResult } from "@/lib/types";

interface GeneratorActionsProps {
  result: TransformResult;
  modeSlug: AccessibilityMode;
  filePrefix: string;
  onRegenerate: () => void;
  isLoading?: boolean;
}

export function GeneratorActions({
  result,
  modeSlug,
  filePrefix,
  onRegenerate,
  isLoading,
}: GeneratorActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transformResultToPlainText(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => void handleCopy()}
        disabled={isLoading}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => void downloadTransformResult(result, `${filePrefix}-${modeSlug}`)}
        disabled={isLoading}
      >
        <Download className="size-3.5" />
        Download
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={onRegenerate}
        disabled={isLoading}
      >
        <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
        Regenerate
      </Button>
    </div>
  );
}
