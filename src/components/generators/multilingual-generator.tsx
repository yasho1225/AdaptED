"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeSelector } from "@/components/mode-selector";
import { GeneratorPanel } from "@/components/generators/generator-panel";
import {
  FormField,
  FormSelect,
  FormTextarea,
} from "@/components/generators/form-field";
import { useGeneration } from "@/hooks/use-generation";
import type { MultilingualInput } from "@/lib/generation/types";
import type { AccessibilityMode } from "@/lib/types";
import { LANGUAGE_OPTIONS } from "@/lib/generation/constants";

const SAMPLE = `Explain photosynthesis and describe its importance in ecosystems.

Photosynthesis is the process by which green plants use sunlight to convert carbon dioxide and water into glucose and oxygen.`;

const DEFAULT: MultilingualInput = {
  content: SAMPLE,
  targetLanguage: "spanish",
  mode: "apd",
};

export function MultilingualGenerator() {
  const [form, setForm] = useState<MultilingualInput>(DEFAULT);
  const { result, status, error, generate, retry, isLoading } =
    useGeneration<MultilingualInput>("/api/generate/multilingual");

  const update = <K extends keyof MultilingualInput>(
    key: K,
    value: MultilingualInput[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    void generate(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <GeneratorPanel
        title="Multilingual accessibility"
        description="Convert materials into another language while keeping dyslexia, ADHD, APD, or autism structure intact."
        mode={form.mode}
        result={result}
        status={status}
        error={error}
        onRetry={retry}
        onRegenerate={() => void generate(form)}
        filePrefix="multilingual"
        form={
          <>
            <FormField
              label="English source content"
              htmlFor="ml-content"
              hint="Paste a lesson, worksheet, or assignment."
            >
              <FormTextarea
                id="ml-content"
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                required
                className="min-h-[160px]"
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Target language" htmlFor="ml-lang">
                <FormSelect
                  id="ml-lang"
                  value={form.targetLanguage}
                  onChange={(e) =>
                    update(
                      "targetLanguage",
                      e.target.value as MultilingualInput["targetLanguage"],
                    )
                  }
                >
                  {LANGUAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
            </div>
            <FormField label="Keep accessibility structure" htmlFor="ml-mode">
              <ModeSelector
                active={form.mode}
                onChange={(m: AccessibilityMode) => update("mode", m)}
                variant="tabs"
              />
            </FormField>
            <Button type="submit" className="w-full gap-2 sm:w-auto" disabled={isLoading}>
              <Globe className="size-4" />
              {isLoading ? "Adapting…" : "Generate accessible version"}
            </Button>
          </>
        }
      />
    </form>
  );
}
