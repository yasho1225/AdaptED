"use client";

import { useState } from "react";
import { CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeSelector } from "@/components/mode-selector";
import { GeneratorPanel } from "@/components/generators/generator-panel";
import { FormField, FormInput, FormSelect } from "@/components/generators/form-field";
import { useGeneration } from "@/hooks/use-generation";
import type { StudyPlanInput } from "@/lib/generation/types";
import type { AccessibilityMode } from "@/lib/types";

const DEFAULT: StudyPlanInput = {
  subject: "Biology",
  testDate: "2026-06-15",
  studyDurationDays: 7,
  minutesPerDay: 30,
  mode: "adhd",
};

export function StudyPlanGenerator() {
  const [form, setForm] = useState<StudyPlanInput>(DEFAULT);
  const { result, status, error, generate, retry, isLoading } =
    useGeneration<StudyPlanInput>("/api/generate/study-plan");

  const update = <K extends keyof StudyPlanInput>(
    key: K,
    value: StudyPlanInput[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void generate(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <GeneratorPanel
        title="Study plan settings"
        description="Build a paced schedule with breaks, structure, and formatting that matches each learner's needs."
        mode={form.mode}
        result={result}
        status={status}
        error={error}
        onRetry={retry}
        onRegenerate={() => void generate(form)}
        filePrefix="study-plan"
        form={
          <>
            <FormField label="Subject" htmlFor="sp-subject">
              <FormInput
                id="sp-subject"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Test / exam date" htmlFor="sp-date" hint="Used to pace your plan.">
              <FormInput
                id="sp-date"
                type="date"
                value={form.testDate}
                onChange={(e) => update("testDate", e.target.value)}
                required
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Study window (days)" htmlFor="sp-days">
                <FormSelect
                  id="sp-days"
                  value={form.studyDurationDays}
                  onChange={(e) => update("studyDurationDays", Number(e.target.value))}
                >
                  {[3, 5, 7, 10, 14].map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="Time per day" htmlFor="sp-mins">
                <FormSelect
                  id="sp-mins"
                  value={form.minutesPerDay}
                  onChange={(e) => update("minutesPerDay", Number(e.target.value))}
                >
                  {[15, 20, 30, 45, 60].map((m) => (
                    <option key={m} value={m}>
                      {m} min/day
                    </option>
                  ))}
                </FormSelect>
              </FormField>
            </div>
            <FormField label="Accessibility mode" htmlFor="sp-mode">
              <ModeSelector
                active={form.mode}
                onChange={(m: AccessibilityMode) => update("mode", m)}
                variant="tabs"
              />
            </FormField>
            <Button type="submit" className="w-full gap-2 sm:w-auto" disabled={isLoading}>
              <CalendarDays className="size-4" />
              {isLoading ? "Building plan…" : "Generate study plan"}
            </Button>
          </>
        }
      />
    </form>
  );
}
