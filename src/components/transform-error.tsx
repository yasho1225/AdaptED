"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransformErrorProps {
  message?: string;
  onRetry: () => void;
}

export function TransformError({
  message = "Couldn't transform content. Please try again.",
  onRetry,
}: TransformErrorProps) {
  return (
    <div
      className="flex h-full min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
      role="alert"
    >
      <AlertCircle className="size-8 text-destructive/80" />
      <p className="max-w-xs text-sm text-card-foreground">{message}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="gap-2"
      >
        <RefreshCw className="size-3.5" />
        Try again
      </Button>
    </div>
  );
}
